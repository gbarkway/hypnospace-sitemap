import sys
import sqlite3
from pathlib import Path
import crawler
import json


def pageRowTuples(captures):
    rowTuples = []
    for capture in captures:
        zoneNames = {
            page.zone: page.name
            for page in capture.pages if page.isZoneHome
        }

        rowTuples += [
            (
                page.path,
                zoneNames[page.zone],
                capture.date,
                page.name,
                page.description,
                json.dumps(page.tags),
                page.citizenName
            )
            for page in capture.pages
        ]

    return rowTuples


if len(sys.argv) < 2:
    print('Usage: python make_page-serv_data.py [PATH]')
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
outPath = Path('./page-serv.db')
with sqlite3.connect(outPath) as con:
    cur = con.cursor()
    cur.execute(
        '''CREATE TABLE "page" (
        "path"              TEXT NOT NULL,
        "zone"              TEXT,
        "date"              TEXT NOT NULL,
        "name"              TEXT,
        "description"       TEXT,
        "tags"              TEXT DEFAULT (json('[]')),
        "citizen_name"      TEXT,
        "linked_by_ad"      INTEGER NOT NULL DEFAULT 0 CHECK("linked_by_ad" = 0 OR "linked_by_ad" = 1),
        "linked_by_mail"    INTEGER NOT NULL DEFAULT 0 CHECK("linked_by_mail" = 0 OR "linked_by_mail" = 1),
        PRIMARY KEY("path","date"))'''
    )
    cur.executemany(
        'INSERT INTO page VALUES (?,?,?,?,?,json(?),?)',
        pageRowTuples(hypnospace.captures)
    )
    con.commit()

print(f'Output written to ${outPath.resolve()}')
print('Copy to ../page-serv/')
