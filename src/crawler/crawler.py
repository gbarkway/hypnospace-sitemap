import datetime
import json
import re
from collections import namedtuple, Counter
from configparser import ConfigParser
from pathlib import Path
import networkx as nx

Page = namedtuple('Page', ['name', 'path', 'linksTo', 'description', 'tags', 'user', 'zone', 'isZoneHome'])
Capture = namedtuple('Capture', ['date', 'pages'])
Hypnospace = namedtuple('Hypnospace', ['captures', 'mailLinks', 'adLinks'])

__linkRe = re.compile(r'hs[abc]?\\(.+\.hsp)')

def readPage(hspPath):
    """Read single .hsp file and return Page"""

    hspPath = Path(hspPath)
    with open(hspPath) as file:
        dom = json.load(file)
        
    myPath = '\\'.join(hspPath.parts[-2:])

    # page files are JSON objects w/ heavy nesting. in below list comp, each level referred to like this:
    # top level     - dom           object
    # .2nd level    - dom['data']   (array<array>)
    # ..3rd level   - dataSection   (array<array>)
    # ...4th level  - element       (array<string>)
    # ....5th level - attr          string
    linkAttributes = [str(attr) for dataSection in dom['data'] for element in dataSection for attr in [element[10], element[11]]]

    # lower() because some links randomly use title casing
    # set() to avoid duplicates
    links = set([match[1].lower() for attr in linkAttributes for match in [__linkRe.search(attr)] if match])

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
        
    return Page(dom['data'][0][1][1], myPath, list(links), description, tags, dom['data'][0][1][2], hspPath.parts[-2], 'zone.hsp' in myPath)

def readZone(zonePath):
    """Read zone folder (e.g. '04_teentopia') and return list of Page"""

    zonePath = Path(zonePath)
    pages = [readPage(f) for f in zonePath.iterdir() if not f.name == 'zone.hsp']

    # "links" in zones.hsp not explicitly defined in hsp file
    zonePage = readPage(zonePath / 'zone.hsp')
    zonePage = Page(zonePage.name, zonePage.path, list(set(zonePage.linksTo + [p.path for p in pages if not '~' in p.path])), zonePage.description, zonePage.tags, zonePage.user, zonePage.zone, True)
    pages.append(zonePage)

    return pages

def iniDate2Iso(iniDate):
    """Given string of format 'MM DD,YYYY' (used in capture.ini) return 'YYYY-MM-DD'"""

    if iniDate == 'XX XX, 20XX':
        return '20XX-XX-XX'

    for formatStr in ['%b %d,%Y', '%b %d, %Y']:
        try:
            timetuple = datetime.datetime.strptime(iniDate, formatStr).timetuple()
            return datetime.date(timetuple.tm_year, timetuple.tm_mon, timetuple.tm_mday).isoformat()
        except ValueError:
            pass

def readCapture(capturePath, noprune=[]):
    """Read capture folder (e.g. 'hs') and return Capture

    Keyword arguments:
    noprune --  A page must a) have a tag, b) be a zone homepage, c) be in noprune, or d) have an ancestor with one of these properties
                If a page tree is only accessible via an email link or a spam popup (professor helper) it is pruned by default unless it is
                in noprune.
    """

    capturePath = Path(capturePath)
    zonePaths = [p for p in capturePath.iterdir() if p.is_dir() and (p / 'zone.hsp').exists()]
    pages = [page for zonePath in zonePaths for page in readZone(zonePath)]

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
    # c) is in noprune
    # d) there is a path to the page from one of a), b) or c)

    # a), b), and c)
    reachablePaths = [page.path for page in pages if len(page.tags) or page.path.endswith(r'\zone.hsp') or page.path in noprune]

    # d)
    # depth-first graph traversal to find path between current page and a known reachable page
    G = pages2Graph(pages)
    for page in pages:
        if page.path in reachablePaths:
            continue
        
        stack = list(G.predecessors(page.path))
        visited = set(stack) # avoid cycles
        hasReachablePre = False

        while(len(stack) and not hasReachablePre):
            path = stack.pop()
            hasReachablePre = path in reachablePaths
            if not hasReachablePre:
                for pre in [pre for pre in G.predecessors(path) if pre not in visited]:
                    visited.add(pre)
                    stack.append(pre)

        if hasReachablePre:
            reachablePaths.append(page.path)

    pages = [page for page in pages if page.path in reachablePaths]          
    config = ConfigParser()
    config.read(capturePath / 'capture.ini')
    return Capture(iniDate2Iso(config['data']['date']), pages)

def pages2Graph(pages):
    """networkx DiGraph"""

    G = nx.DiGraph()
    G.add_nodes_from([page.path for page in pages])
    G.add_edges_from([(page.path, link) for page in pages for link in page.linksTo])
    return G

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

    captureFolders = [p for p in dataPath.iterdir() if (p / 'capture.ini').exists()]
    captures = [readCapture(p, noprune=(mailLinks + adLinks)) for p in captureFolders]

    return Hypnospace(captures, mailLinks, adLinks)
