import json
import sys
from pathlib import Path
from crawler import read_data

if len(sys.argv) < 2:
    print('Usage: python crawler.py [PATH]')
    print('Path must be the path to a Hypnospace Outlaw data folder. For example: C:\\Program Files (x86)\\Steam\\steamapps\\common\\Hypnospace Outlaw\\data')
    exit()

dataPath = Path(sys.argv[1])
if not dataPath.exists():
    print(f'Path not found: {dataPath}')
    exit()

def captures2PageServPages(captures):
    return [{'path': page.path, 'zone': zone.name, 'date': c.date, 'name': page.name, 'description': page.description or '', 'tags': page.tags, 'user': page.user } for c in captures for zone in c.zoneInfos for page in zone.pageInfos]

def captures2PageServCaptures(captures):
    return [{'date': c.date} for c in captures]

captures = read_data(dataPath)

pages = captures2PageServPages(captures)
outPath = Path('./pageserv.pages.json')
with open(outPath, 'w') as file:
    file.writelines((json.dumps(p) + '\n' for p in pages))
print(f'Output written to ${outPath.resolve()}')

pageServCaptures = captures2PageServCaptures(captures)
outPath = Path('./pageserv.captures.json')
with open(outPath, 'w') as file:
    file.writelines((json.dumps(c) + '\n' for c in pageServCaptures))
print(f'Output written to ${outPath.resolve()}')


print(f'Copy these files to ../page-serv/db/pages.json and ../page-serv/db/captures.json')

