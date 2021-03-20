# Capture Service

![capture-serv test](https://github.com/gbarkway/hypnospace-sitemap/workflows/capture-serv%20test/badge.svg)

Microservice for Hypnospace captures. Here "capture" means a date, a set of pages, and a map of connections between pages.

## Getting Started

In this directory's parent:

```
docker-compose up
```

Service will be available on host port 3001.

If you have previously run with the dev configuration below, run with the `--build` flag to make sure the debug image isn't cached.

To run with development configuration:

```
source aliases.sh
docker-compose-dev up
```

This runs with the following features to aid debugging:

- Opens node inspect port on 9229
- Runs service in nodemon and monitors project files for changes


## Running Tests

To run tests in container:

```
docker-compose-dev run --rm captureserv npm test
docker-compose-dev down
```
