# Page Service

![page-serv test](https://github.com/gbarkway/hypnospace-sitemap/workflows/page-serv%20test/badge.svg)

Microservice for Hypnospace page details like tags, description, and citizen

## Getting Started

In this folder's parent:

### Docker

```shell
docker-compose down
docker-compose --build up
```

Service will be available on **localhost:3000**.

If you have previously run with the dev configuration below, run with the `--build` flag to make sure the debug image isn't cached.

#### Developer-friendly docker

```shell
docker-compose down
source aliases.sh
docker-compose-dev --build up
```

This runs with features to aid debugging:

- Exposes node inspector on port 9230
- Source files mapped to this directory with hot reloading

Run `docker-compose down` after finishing.

### Non-docker

In this directory

```
npm install
npm start
```

Service will be available on **localhost:3000**

## Running Tests

### Docker

```shell
docker-compose-dev run --rm page-serv npm test
```

## API Documentation

This service's API is described by **openapi.yaml**.
