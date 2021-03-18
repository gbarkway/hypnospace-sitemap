import json
import sys
from pathlib import Path
import crawler


def captureServCapture(capture):
    c = capture
    zoneNames = {page.zone: page.name for page in c.pages if page.isZoneHome}

    return {
        'date':
        c.date,
        'pages': [{
            'name': page.name,
            'path': page.path,
            'zone': zoneNames[page.zone]
        } for page in c.pages],
        'links': [{
            'sourcePath': page.path,
            'targetPath': link
        } for page in c.pages for link in page.linksTo]
    }


if len(sys.argv) < 2:
    print('Usage: python make_captureserv_data.py [PATH]')
    print(
        'Path must be the path to a Hypnospace Outlaw data folder. ',
        'For example: C:\\Program Files (x86)\\Steam\\steamapps\\common\\',
        'Hypnospace Outlaw\\data'
    )
    exit()

dataPath = Path(sys.argv[1])
if not dataPath.exists():
    print(f'Path not found: {dataPath}')
    exit()

hypnospace = crawler.readHypnospace(dataPath)
captureServCaptures = sorted(
    [captureServCapture(c) for c in hypnospace.captures],
    key=lambda c: c['date'])
outPath = Path('./captureserv.captures.json')
with open(outPath, 'w') as file:
    json.dump(captureServCaptures, file)

print(f'Output saved to {outPath.resolve()}')
print('Copy this file to ../capture-serv/captures.json')
