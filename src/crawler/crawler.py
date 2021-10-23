from datetime import datetime, date
import json
import re
from collections import namedtuple
from configparser import ConfigParser
from pathlib import Path

Page = namedtuple('Page', [
    'name', 'path', 'linksTo', 'description', 'tags', 'citizenName', 'zone',
    'isZoneHome'
])
Capture = namedtuple('Capture', ['date', 'pages'])
Hypnospace = namedtuple('Hypnospace', ['captures', 'mailLinks', 'adLinks'])

__linkRe = re.compile(r'hs[abc]?\\(.+\.hsp)')


def readPage(hspPath):
    """Read single .hsp file and return Page"""

    hspPath = Path(hspPath)
    with open(hspPath) as file:
        dom = json.load(file)

    myPath = '\\'.join(hspPath.parts[-2:])

    # page files are JSON objects w/ heavy nesting. in below list comp, each
    # level referred to like this:
    # top level     - dom           object
    # .2nd level    - dom['data']   (array<array>)
    # ..3rd level   - dataSection   (array<array>)
    # ...4th level  - element       (array<string>)
    # ....5th level - attr          string
    linkAttributes = [
        str(attr) for dataSection in dom['data'] for element in dataSection
        for attr in [element[10], element[11]]
    ]

    # lower() because some links randomly use title casing
    # set() to avoid duplicates
    links = set([
        match[1].lower() for attr in linkAttributes
        for match in [__linkRe.search(attr)] if match
    ])

    # no links to self
    if myPath in links:
        links.remove(myPath)

    descriptionAndTags = dom['data'][0][1][8]
    description = None
    tags = []
    if descriptionAndTags:
        tagStartIndex = descriptionAndTags.find('>')
        if tagStartIndex > -1:
            description = descriptionAndTags[:tagStartIndex].strip()
            tags = descriptionAndTags[(tagStartIndex+1):].split(' >')
        else:
            description = descriptionAndTags.strip()
            tags = []

        if not description:
            description = None

    citizenName = dom['data'][0][1][2]
    if not citizenName:
        citizenName = None

    return Page(dom['data'][0][1][1], myPath, list(links), description, tags,
                citizenName, hspPath.parts[-2], 'zone.hsp' in myPath)


def readZone(zonePath):
    """Read zone folder (e.g. '04_teentopia') and return list of Page"""

    zonePath = Path(zonePath)
    pages = [
        readPage(f) for f in zonePath.iterdir() if not f.name == 'zone.hsp'
    ]

    # "links" in zones.hsp not explicitly defined in hsp file
    zonePage = readPage(zonePath / 'zone.hsp')
    links = list(set(
        zonePage.linksTo +
        [p.path for p in pages if '~' not in p.path]
    ))

    zonePage = Page(zonePage.name, zonePage.path, links, zonePage.description,
                    zonePage.tags, zonePage.citizenName, zonePage.zone, True)
    pages.append(zonePage)

    return pages


def iniDate2Iso(iniDate):
    """Given string of format 'MM DD,YYYY' (used in capture.ini)
    return 'YYYY-MM-DD'
    """

    if iniDate == 'XX XX, 20XX':
        return '20XX-XX-XX'

    for formatStr in ['%b %d,%Y', '%b %d, %Y']:
        try:
            timetuple = datetime.strptime(iniDate, formatStr).timetuple()
            return date(timetuple.tm_year,
                        timetuple.tm_mon,
                        timetuple.tm_mday).isoformat()
        except ValueError:
            pass


def readCapture(capturePath):
    """Read capture folder (e.g. 'hs') and return Capture

    Keyword arguments:
    noprune --  A page must a) have a tag, b) be a zone homepage,
                c) be in noprune, or
                d) have an ancestor with one of these properties
                If a page tree is only accessible via an email link or a spam
                popup (professor helper) it is pruned by default unless it is
                in noprune.
    """

    capturePath = Path(capturePath)
    zonePaths = [
        p for p in capturePath.iterdir()
        if p.is_dir() and (p / 'zone.hsp').exists()
    ]
    pages = [page for zonePath in zonePaths for page in readZone(zonePath)]

    # remove dead links
    pagePaths = set([page.path for page in pages])
    for page in pages:
        toRemove = [link for link in page.linksTo if link not in pagePaths]
        for link in toRemove:
            page.linksTo.remove(link)

    config = ConfigParser()
    config.read(capturePath / 'capture.ini')
    return Capture(iniDate2Iso(config['data']['date']), pages)


def readLinksFromFile(filePath):
    """List containing every HSP url in a file"""

    with open(filePath) as file:
        matches = [__linkRe.search(line) for line in file]

    # lower() because some links randomly use title casing
    return [match[1].lower() for match in matches if match]


def readHypnospace(dataPath):
    """Given Hypnospace Outlaw data folder, return Hypnospace namedtuple"""

    dataPath = Path(dataPath)

    mailLinks = readLinksFromFile(dataPath / 'misc' / 'emails.ini')
    adLinks = readLinksFromFile(dataPath / 'misc' / 'ads.ini')

    captureFolders = [
        p for p in dataPath.iterdir() if (p / 'capture.ini').exists()
    ]
    captures = [
        readCapture(p) for p in captureFolders
    ]

    return Hypnospace(captures, mailLinks, adLinks)
