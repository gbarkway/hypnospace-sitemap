# Capture Service

![Capture Service](https://github.com/gbarkway/hypnospace-sitemap/workflows/Capture%20Service/badge.svg)

Microservice for Hypnospace captures. Here "capture" means a date, a set of pages, and a map of connections between pages.

## Getting Started

Service:

```
docker-compose up
```

Service will be available on host port 3000.

If you have previously run with the debug configuration below, run with the `--build` flag to make sure the debug image isn't cached.

Or:

```
docker-compose -f docker-compose.yml -f docker-compose.debug.yml up
```
This runs with features to aid debugging:

- Opens node inspect port on 9229
- Runs service in nodemon and monitors project files for changes

For convenience you can alias the above:
```
alias docker-compose-dbg="docker-compose -f docker-compose.yml -f docker-compose.debug.yml"
docker-compose-dbg up
```

## Running Tests

To run tests in container:
```
docker-compose-dbg run --rm captureserv npm test
docker-compose-dbg down
```



