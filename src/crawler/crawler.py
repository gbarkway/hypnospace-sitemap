import json
import re
from collections import namedtuple
from configparser import ConfigParser
from pathlib import Path

PageInfo = namedtuple('PageInfo', ['title', 'path', 'linksTo', 'description', 'tags'])
ZoneInfo = namedtuple('ZoneInfo', ['title', 'pageInfos'])
CaptureInfo = namedtuple('CaptureInfo', ['date', 'zoneInfos'])

__linkRe = re.compile(r'hs[abc]?\\(.+\.hsp)')
def __getPageInfo(hspPath):
    with open(hspPath) as file:
        dom = json.load(file)

    links = [match[1] for match in [__linkRe.search(el[1][10]) for el in dom['data']] if match]
    descriptionAndTags = dom['data'][0][1][8]
    description = descriptionAndTags[:descriptionAndTags.find('>')].strip()
    tags = descriptionAndTags[descriptionAndTags.find('>')+1:].split(' >')
    return PageInfo(dom['data'][0][1][1], '\\'.join(hspPath.parts[-2:]), links, description, tags)


def __getZoneInfo(zonePath):
    pages = [__getPageInfo(f) for f in zonePath.iterdir() if not f.name == 'zone.hsp']

    # "links" in zones.hsp not explicitly defined in hsp file
    zonePage = __getPageInfo(zonePath / 'zone.hsp')
    zonePage = PageInfo(zonePage.title, zonePage.path, zonePage.linksTo + [p.path for p in pages if not '~' in p.path], zonePage.description, zonePage.tags)
    pages.append(zonePage)

    return ZoneInfo(zonePage.title, pages)

def __getCaptureInfo(capturePath):
    config = ConfigParser()
    config.read(capturePath / 'capture.ini')
    return CaptureInfo(config['data']['date'], [__getZoneInfo(p) for p in capturePath.iterdir() if p.is_dir() and (p / 'zone.hsp').exists()])

def read_data(dataPath):
    dataPath = Path(dataPath)
    captureFolders = [p for p in dataPath.iterdir() if (p / 'capture.ini').exists()]
    return [__getCaptureInfo(p) for p in captureFolders]
