import sys
import sqlite3
from pathlib import Path
import crawler
import json


def pageRowTuples(hypnospace):
    return [
        (
            page.path,
            page.zone,
            capture.date,
            page.name,
            page.description,
            json.dumps(page.tags),
            page.user
        )
        for capture in hypnospace.captures for page in capture.pages
    ]


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
outPath = Path('./pageserv.db')
with sqlite3.connect(outPath) as con:
    cur = con.cursor()
    cur.execute(
        '''CREATE TABLE "page" (
        "path"	TEXT NOT NULL,
        "zone"	TEXT,
        "date"	TEXT NOT NULL,
        "name"	TEXT,
        "description"	TEXT,
        "tags"	TEXT DEFAULT (json('[]')),
        "citizen_name"	TEXT,
        PRIMARY KEY("path","date"))'''
    )
    cur.executemany(
        'INSERT INTO page VALUES (?,?,?,?,?,json(?),?)',
        pageRowTuples(hypnospace)
    )
    con.commit()

print(f'Output written to ${outPath.resolve()}')
print('Copy to ../page-serv/')
