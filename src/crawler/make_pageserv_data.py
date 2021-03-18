import json
import sys
from pathlib import Path
import crawler


def pageServPages(capture):
    zoneNames = {
        page.zone: page.name
        for page in capture.pages if page.isZoneHome
    }

    def pageServPage(page):
        return {
            'path': page.path,
            'zone': zoneNames[page.zone],
            'date': capture.date,
            'name': page.name,
            'description': page.description or '',
            'tags': page.tags,
            'user': page.user
        }

    return [pageServPage(page) for page in capture.pages]


def pageServCaptures(captures):
    return [{'date': c.date} for c in captures]


if len(sys.argv) < 2:
    print('Usage: python make_pageserv_data.py [PATH]')
    print(
        'Path must be the path to a Hypnospace Outlaw data folder. ',
        'For example:',
        ' C:\\Program Files (x86)\\Steam\\steamapps\\common\\',
        'Hypnospace Outlaw\\data'
    )
    exit()

dataPath = Path(sys.argv[1])
if not dataPath.exists():
    print(f'Path not found: {dataPath}')
    exit()

hypnospace = crawler.readHypnospace(dataPath)

pages = [
    page for capture in hypnospace.captures for page in pageServPages(capture)
]
outPath = Path('./pageserv.pages.json')
with open(outPath, 'w') as file:
    file.writelines((json.dumps(p) + '\n' for p in pages))
print(f'Output written to ${outPath.resolve()}')

pageServCaptures = pageServCaptures(hypnospace.captures)
outPath = Path('./pageserv.captures.json')
with open(outPath, 'w') as file:
    file.writelines((json.dumps(c) + '\n' for c in pageServCaptures))
print(f'Output written to ${outPath.resolve()}')

print(
    'Copy these files to ../page-serv/db/pages.json and ',
    '../page-serv/db/captures.json'
)
