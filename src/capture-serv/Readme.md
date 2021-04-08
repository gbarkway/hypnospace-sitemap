# Capture Service

![capture-serv test](https://github.com/gbarkway/hypnospace-sitemap/workflows/capture-serv%20test/badge.svg)

Microservice for Hypnospace captures. Here "capture" means a date, a set of pages, and a map of connections between pages.

## Getting Started

### Docker

In this directory's parent:

```
docker-compose down
docker-compose --build up
```

Service will be available at **localhost:3001**.

If you have previously run with the dev configuration below, run with the `--build` flag to make sure the debug image isn't cached.

#### Developer-friendly docker
To run with development configuration:

```
source aliases.sh
docker-compose-down
docker-compose-dev --build up
```

This runs with the following features to aid debugging:

- Opens node inspector port on 9229
- Source files mapped to this directory with hot reloading

### Non-docker
In this directory:

```shell
npm install
npm start
```

Service will be available at **localhost:3000**

## Running Tests

### Docker

```
docker-compose-dev run --rm captureserv npm test
```

## API Documentation

This service's API is described by **openapi.yaml**.
