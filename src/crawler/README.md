# Hypnospace Page Crawler

[![crawler test](https://github.com/gbarkway/hypnospace-sitemap/actions/workflows/crawler-test.yml/badge.svg)](https://github.com/gbarkway/hypnospace-sitemap/actions/workflows/crawler-test.yml)

The scripts in this folder generate Hypnospace Outlaw page metadata.

- `crawler.py` is the module that does most of the work
- `make_pageserv_data.py` creates page-serv's sqlite3 database (found in ../page-serv/pageserv.db)
- `make_crawler_data.py` creates ../capture-serv/captures.json

## Requirements

- Python (tested with v3.8.5)
- [NetworkX](https://networkx.org/) python library (tested with v2.5)
- A Hypnospace Outlaw installation

## Usage

### Crawler module

```py
import crawler
hs = crawler.readHypnospace('C:\\Program Files (x86)\\Steam\\steamapps\\common\\Hypnospace Outlaw\\data')
```

`readHypnospace` returns a `Hypnospace` namedtuple. `Hypnospace` contains many `Capture` tuples, and a `Capture` contains many `Page` tuples.

### Data-generating scripts

```shell
python make_pageserv_data.py DATAPATH
python make_captureserv_data.py DATAPATH
```

Where DATAPATH is the path to a Hypnospace Outlaw data folder. For example: ``C:\\Program Files (x86)\\Steam\\steamapps\\common\\Hypnospace Outlaw\\data``

## Running tests

```python -m unittest```
