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

pretty = '--pretty' in sys.argv

outFolder = Path('./captures')
if not outFolder.exists():
    outFolder.mkdir()

captures = read_data(dataPath)
for c in captures:
    d = {
        'date': c.date,
        'sites': [{'title': pi.title, 'path': pi.path} for zi in c.zoneInfos for pi in zi.pageInfos],
        'links': [{'source': pi.path, 'target': l} for zi in c.zoneInfos for pi in zi.pageInfos for l in pi.linksTo]
    }
    outPath = outFolder / f'{c.date}.json'
    with open(outPath, 'w') as file:
        if pretty:
            json.dump(d, file, indent=2)
        else:
            json.dump(d, file)

print(f'Sitemaps saved to {outFolder.resolve()}')
