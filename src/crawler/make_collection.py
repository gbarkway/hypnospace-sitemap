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

def captures2DictArray(captures):
    return [{'path': page.path, 'zone': zone.name, 'date': c.date, 'name': page.name, 'description': page.description, 'tags': page.tags, 'user': page.user } for c in captures for zone in c.zoneInfos for page in zone.pageInfos]

captures = captures2DictArray(read_data(dataPath))
pass
