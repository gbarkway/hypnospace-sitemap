# Hypnospace Page Crawler

The scripts in this folder generate Hypnospace Outlaw page metadata.

- `crawler.py` is the module that does most of the work
- `make_pageserv_data.py` and `make_captureserv_data.py` use `crawler` to export JSON files that the page service and capture service ingest

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

`readHypnospace` returns a `Hypnospace` namedtuple. `Hypnospace` contains multiple `Capture`s, and a `Capture` contains multiple `Page`s

### JSON-generating scripts

```
python make_pageserv_data.py DATAPATH
python make_captureserv_data.py DATAPATH
```

Where DATAPATH is the path to a Hypnospace Outlaw data folder. For example: ``C:\\Program Files (x86)\\Steam\\steamapps\\common\\Hypnospace Outlaw\\data``

## Running tests
```python -m unittest```
