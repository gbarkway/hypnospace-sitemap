import datetime
import json
import re
from collections import namedtuple, Counter
from configparser import ConfigParser
from pathlib import Path

# TODO: README
# TODO: Tests
PageInfo = namedtuple('PageInfo', ['name', 'path', 'linksTo', 'description', 'tags', 'user'])
ZoneInfo = namedtuple('ZoneInfo', ['name', 'pageInfos'])
CaptureInfo = namedtuple('CaptureInfo', ['date', 'zoneInfos'])

__linkRe = re.compile(r'hs[abc]?\\(.+\.hsp)')
def __getPageInfo(hspPath):
    with open(hspPath) as file:
        dom = json.load(file)
        
    myPath = '\\'.join(hspPath.parts[-2:])

    # lower() because some links randomly use title casing
    # set() to avoid duplicates
    links = set([match[1].lower() for match in [__linkRe.search(el[1][10]) for el in dom['data']] if match])

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

    return PageInfo(dom['data'][0][1][1], myPath, list(links), description, tags, dom['data'][0][1][2])


def __getZoneInfo(zonePath):
    pages = [__getPageInfo(f) for f in zonePath.iterdir() if not f.name == 'zone.hsp']

    # "links" in zones.hsp not explicitly defined in hsp file
    zonePage = __getPageInfo(zonePath / 'zone.hsp')
    zonePage = PageInfo(zonePage.name, zonePage.path, list(set(zonePage.linksTo + [p.path for p in pages if not '~' in p.path])), zonePage.description, zonePage.tags, zonePage.user)
    pages.append(zonePage)

    return ZoneInfo(zonePage.name, pages)

def __iniDate2iso(iniDate):
    if iniDate == 'XX XX, 20XX':
        return '20XX-XX-XX'

    for formatStr in ['%b %d,%Y', '%b %d, %Y']:
        try:
            timetuple = datetime.datetime.strptime(iniDate, formatStr).timetuple()
            return datetime.date(timetuple.tm_year, timetuple.tm_mon, timetuple.tm_mday).isoformat()
        except ValueError:
            pass

def __getCaptureInfo(capturePath):
    zoneInfos = [__getZoneInfo(p) for p in capturePath.iterdir() if p.is_dir() and (p / 'zone.hsp').exists()]

    # remove dead links
    validPaths = set([pageInfo.path for zoneInfo in zoneInfos for pageInfo in zoneInfo.pageInfos])
    for zoneInfo in zoneInfos:
        for pageInfo in zoneInfo.pageInfos:
            toRemove = [link for link in pageInfo.linksTo if not link in validPaths]
            for link in toRemove:
                pageInfo.linksTo.remove(link)

    # attach orphaned sites to "unlisted" node
    # linked = set([link for zoneInfo in zoneInfos for pageInfo in zoneInfo.pageInfos for link in pageInfo.linksTo])
    # unlistedPages = [pageInfo.path for zoneInfo in zoneInfos for pageInfo in zoneInfo.pageInfos if pageInfo.path not in linked]
    # unlistedZone = ZoneInfo("1000 Unlisted", [PageInfo("Unlisted", "1000_unlisted\\zone.hsp", unlistedPages, "Orphans", [], "gbarkway")])
    # zoneInfos.append(unlistedZone)

    config = ConfigParser()
    config.read(capturePath / 'capture.ini')
    return CaptureInfo(__iniDate2iso(config['data']['date']), zoneInfos)

def read_data(dataPath):
    dataPath = Path(dataPath)
    captureFolders = [p for p in dataPath.iterdir() if (p / 'capture.ini').exists()]
    return [__getCaptureInfo(p) for p in captureFolders]
