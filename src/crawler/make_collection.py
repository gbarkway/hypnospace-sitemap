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
    for c in captures:
        for zone in c.zoneInfos:
            for page in zone.pageInfos:
                pass


pretty = '--pretty' in sys.argv
captures = read_data(dataPath)
a = [captureInfo2Dict(c) for c in captures]
outPath = Path('./captures.json')
with open(outPath, 'w') as file:
    if pretty:
        json.dump(a, file, indent=2)
    else:
        json.dump(a, file)
print(f'Sitemaps saved to {outPath.resolve()}')
