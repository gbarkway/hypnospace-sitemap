import datetime
import json
import re
from collections import namedtuple, Counter
from configparser import ConfigParser
from pathlib import Path
import networkx as nx

Page = namedtuple('Page', ['name', 'path', 'linksTo', 'description', 'tags', 'user', 'zone'])
Capture = namedtuple('Capture', ['date', 'pages'])

__linkRe = re.compile(r'hs[abc]?\\(.+\.hsp)')
def __getPageInfo(hspPath):
    # TODO: 04_teentopia\~sboulder-doorm2.hsp appears orphaned even though it is linked to by:
    # ./04_teentopia/~sboulder-doornm2.hsp
    # ./04_teentopia/~sboulder-doorm1.hsp
    # this may be because it's a "redirect" event, not a direct link
    with open(hspPath) as file:
        dom = json.load(file)
        
    myPath = '\\'.join(hspPath.parts[-2:])

    # lower() because some links randomly use title casing
    # set() to avoid duplicates
    links = set([match[1].lower() for dataSection in dom['data'] for element in dataSection for match in [__linkRe.search(str(element[10]))] if match])

    # no links to self
    if myPath in links:
        links.remove(myPath)

    descriptionAndTags = dom['data'][0][1][8]
    description = None
    tags = []
    if len(descriptionAndTags) > 0:
        tagStartIndex = descriptionAndTags.find('>')
        if tagStartIndex > -1:           
            description = descriptionAndTags[:descriptionAndTags.find('>')].strip()
            tags = descriptionAndTags[descriptionAndTags.find('>')+1:].split(' >')
        else:
            description = descriptionAndTags
            tags = []

    return Page(dom['data'][0][1][1], myPath, list(links), description, tags, dom['data'][0][1][2], hspPath.parts[-2])


def __getZonePages(zonePath):
    pages = [__getPageInfo(f) for f in zonePath.iterdir() if not f.name == 'zone.hsp']

    # "links" in zones.hsp not explicitly defined in hsp file
    zonePage = __getPageInfo(zonePath / 'zone.hsp')
    zonePage = Page(zonePage.name, zonePage.path, list(set(zonePage.linksTo + [p.path for p in pages if not '~' in p.path])), zonePage.description, zonePage.tags, zonePage.user, zonePage.zone)
    pages.append(zonePage)

    return pages

def __iniDate2iso(iniDate):
    if iniDate == 'XX XX, 20XX':
        return '20XX-XX-XX'

    for formatStr in ['%b %d,%Y', '%b %d, %Y']:
        try:
            timetuple = datetime.datetime.strptime(iniDate, formatStr).timetuple()
            return datetime.date(timetuple.tm_year, timetuple.tm_mon, timetuple.tm_mday).isoformat()
        except ValueError:
            pass

def __getCapture(capturePath):
    zonePaths = [p for p in capturePath.iterdir() if p.is_dir() and (p / 'zone.hsp').exists()]
    pages = [page for zonePath in zonePaths for page in __getZonePages(zonePath)]

    # remove dead links
    pagePaths = set([page.path for page in pages])
    for page in pages:
        toRemove = [link for link in page.linksTo if not link in pagePaths]
        for link in toRemove:
            page.linksTo.remove(link)

    # remove unreachable pages. some pages appear in data files but aren't reachable in-game.
    # a page is reachable if
    # a) has a tag
    # b) is a zone.hsp
    # c) there is a path to the page from one of a) or b)

    # a) and b)
    reachablePaths = [page.path for page in pages if len(page.tags) or 'zone.hsp' in page.path]

    # c)
    # depth-first graph traversal to find path between current page and a known reachable page
    G = pages2Graph(pages)
    for page in pages:
        if page.path in reachablePaths:
            continue
        
        stack = list(G.predecessors(page.path))
        visited = set(stack) # avoid cycles
        foundReachable = False

        while(len(stack) and not foundReachable):
            path = stack.pop()
            foundReachable = path in reachablePaths
            if not foundReachable:
                for pre in [pre for pre in G.predecessors(path) if pre not in visited]:
                    visited.add(pre)
                    stack.append(pre)

        if foundReachable:
            reachablePaths.append(page.path)
        else:
            print(page.path)

    pages = [page for page in pages if page.path in reachablePaths]          
    config = ConfigParser()
    config.read(capturePath / 'capture.ini')
    print(__iniDate2iso(config['data']['date']))
    print('^^^^')
    return Capture(__iniDate2iso(config['data']['date']), pages)


def pages2Graph(pages):
    G = nx.DiGraph()
    G.add_nodes_from([page.path for page in pages])
    G.add_edges_from([(page.path, link) for page in pages for link in page.linksTo])
    return G
    

def read_data(dataPath):
    dataPath = Path(dataPath)
    captureFolders = [p for p in dataPath.iterdir() if (p / 'capture.ini').exists()]
    return [__getCapture(p) for p in captureFolders]


c = read_data("/home/greg/data")
pass