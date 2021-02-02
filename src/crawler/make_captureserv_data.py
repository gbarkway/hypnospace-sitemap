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

def captureInfo2Dict(captureInfo):
    c = captureInfo
    return {
        'date': c.date,
        'pages': [{'name': pi.name, 'path': pi.path, 'zone': zi.name} for zi in c.zoneInfos for pi in zi.pageInfos],
        'links': [{'sourcePath': pi.path, 'targetPath': l} for zi in c.zoneInfos for pi in zi.pageInfos for l in pi.linksTo]
    }

pretty = '--pretty' in sys.argv
captures = read_data(dataPath)
a = [captureInfo2Dict(c) for c in captures]
outPath = Path('./captureserv.captures.json')
with open(outPath, 'w') as file:
    if pretty:
        json.dump(a, file, indent=2)
    else:
        json.dump(a, file)

print(f'Output saved to {outPath.resolve()}')
print('Copy this file to ../capture-serv/captures.json')
