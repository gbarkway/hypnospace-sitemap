import unittest
import crawler
from pathlib import Path


class TestCrawler(unittest.TestCase):
    def test_readHypnospace(self):
        hs = crawler.readHypnospace('./test_data')
        self.assertEqual(len(hs.captures), 1,
                         'Hypnospace should have expected # captures')
        self.assertEqual(len(hs.adLinks), 2,
                         'Hypnospace should have expected # ad links')
        self.assertEqual(len(hs.mailLinks), 1,
                         'Hypnospace should have expected # mail links')

    def test_readCapture(self):
        capture = crawler.readCapture('./test_data/hs')
        self.assertEqual('1999-11-05', capture.date)

        page = [
            page for page in capture.pages if 'dead_link_test' in page.path
        ][0]
        self.assertIn(r'00_test\tags_no_description.hsp', page.linksTo,
                      'non-dead link should be kept')
        self.assertNotIn(r'00_test\dead_link.hsp', page.linksTo,
                         'dead link should be removed')

        # unreachable pages removed/reachable page kept
        pagePaths = [page.path for page in capture.pages]

        self.assertIn(r'00_test\~reachable_by_tag.hsp', pagePaths,
                      'page with tag should not be pruned')
        self.assertIn(r'00_test\~reachable_2nd_hand_by_tag.hsp', pagePaths,
                      'page linked to by tagged page should not be pruned')
        self.assertIn(r'00_test\reachable_by_zone.hsp', pagePaths,
                      'page linked to by zone homepage should not be pruned')
        self.assertIn(
            r'00_test\~reachable_2nd_hand_by_zone.hsp', pagePaths,
            ('page linked to page linked to by zone homepage should not be ',
             'pruned'))
        self.assertNotIn(r'00_test\~unreachable.hsp', pagePaths,
                         'unreachable page should be pruned')
        self.assertNotIn(
            r'00_test\~unreachable_2.hsp', pagePaths,
            'untagged page linked to by unreachable page should be pruned')

        capture = crawler.readCapture('./test_data/hs',
                                      [r'00_test\~unreachable.hsp'])
        pagePaths = [page.path for page in capture.pages]
        self.assertIn(r'00_test\~unreachable.hsp', pagePaths,
                      'page in noprune should not be pruned')

    def test_readZone(self):
        pages = crawler.readZone('test_data/hs/00_test')
        self.assertEqual(
            len(pages),
            len([
                path for path in Path('test_data/hs/00_test').iterdir()
                if '.hsp' in path.suffix
            ]))

        implicit_links = [
            str(path.relative_to('test_data/hs')).replace('/', '\\')
            for path in Path('test_data/hs/00_test').iterdir()
            if '~' not in str(path) and not 'zone.hsp' == path.name
        ]
        explicit_links = [r'00_test\explicit_zone_link.hsp']

        zonePage = [p for p in pages if r'00_test\zone.hsp' == p.path][0]
        self.assertEqual('00_test', zonePage.zone)
        self.assertTrue(zonePage.isZoneHome)
        self.assertEqual(len(zonePage.linksTo),
                         len(implicit_links) + len(explicit_links))
        for link in implicit_links + explicit_links:
            self.assertIn(link, zonePage.linksTo)

    def test_readPage_basics(self):
        page = crawler.readPage('test_data/hs/00_test/page.hsp')
        self.assertEqual(r'00_test\page.hsp', page.path)
        self.assertEqual('User name', page.user)
        self.assertEqual('Page name', page.name)
        self.assertEqual('00_test', page.zone)
        self.assertFalse(page.isZoneHome)

    def test_readPage_zone(self):
        page = crawler.readPage('test_data/hs/00_test/zone.hsp')
        self.assertTrue(page.isZoneHome)

    def test_readPage_finds_links_from_all_captures(self):
        links = crawler.readPage('test_data/hs/00_test/page.hsp').linksTo
        self.assertIn(r'00_test\~10th_el_hs_prefix.hsp', links,
                      'link with hs prefix should be found')
        self.assertIn(r'00_test\~10th_el_hsa_prefix.hsp', links,
                      'link with hsa prefix should be found')
        self.assertIn(r'00_test\~10th_el_hsb_prefix.hsp', links,
                      'link with hsb prefix should be found')
        self.assertIn(r'00_test\10th_el_hsc_prefix.hsp', links,
                      'link with hsc prefix should be found')

    def test_readPage_finds_links_from_10th_or_11th_element(self):
        links = crawler.readPage('test_data/hs/00_test/page.hsp').linksTo
        self.assertIn(r'00_test\~10th_el_hs_prefix.hsp', links,
                      'link in 10th position should be found')
        self.assertIn(r'00_test\11th_el.hsp', links,
                      'link in 11th position should be found')

    def test_readPage_finds_complex_link(self):
        links = crawler.readPage('test_data/hs/00_test/page.hsp').linksTo
        self.assertIn(r'00_test\~complex_link.hsp', links,
                      'complex link should be found')

    def test_readPage_has_right_link_count(self):
        links = crawler.readPage('test_data/hs/00_test/page.hsp').linksTo
        self.assertEqual(len(links), 6, 'should find expected amount of links')

    def test_readPage_no_duplicate_links(self):
        links = crawler.readPage('test_data/hs/00_test/page.hsp').linksTo
        self.assertCountEqual(links, set(links),
                              'should have no duplicate links')

    def test_readPage_no_links_to_self(self):
        links = crawler.readPage('test_data/hs/00_test/page.hsp').linksTo
        self.assertNotIn('00_test/page.hsp', links,
                         'should have no links to self')

    def test_readPage_empty_list_if_no_links(self):
        links = crawler.readPage('test_data/hs/00_test/no_links.hsp').linksTo
        self.assertEqual(len(links), 0,
                         'page with no links should have empty linksTo')

    def test_readPage_tags_and_description(self):
        page = crawler.readPage(
            'test_data/hs/00_test/tags_and_description.hsp')
        self.assertIn('tag1', page.tags)
        self.assertIn('tag2', page.tags)
        self.assertEqual(len(page.tags), 2)
        self.assertEqual('Test description', page.description)

    def test_readPage_tags_and_no_description(self):
        page = crawler.readPage('test_data/hs/00_test/tags_no_description.hsp')
        self.assertIn('tag1', page.tags)
        self.assertIn('tag2', page.tags)
        self.assertEqual(len(page.tags), 2)
        self.assertEqual(None, page.description)

    def test_readPage_no_tags_and_description(self):
        page = crawler.readPage('test_data/hs/00_test/no_tags_description.hsp')
        self.assertEqual(len(page.tags), 0)
        self.assertEqual('Test description', page.description)

    def test_readPage_no_tags_no_description(self):
        page = crawler.readPage(
            'test_data/hs/00_test/no_tags_no_description.hsp')
        self.assertEqual(len(page.tags), 0)
        self.assertEqual(None, page.description)

    def test_readPage_empty_user_is_none(self):
        page = crawler.readPage(
            'test_data/hs/00_test/no_user_name.hsp')
        self.assertEqual(None, page.user)


if __name__ == '__main__':
    unittest.main()
