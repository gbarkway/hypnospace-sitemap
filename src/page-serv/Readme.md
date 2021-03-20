# Page Service

![page-serv test](https://github.com/gbarkway/hypnospace-sitemap/workflows/page-serv%20test/badge.svg)

Microservice for Hypnospace page details like tags, description, username, and HAP ID (maybe).

## Getting Started

To run service with seeded database:

```
docker-compose up
```

Service will be available on host port 3000.

If you have previously run with the dev configuration below, run with the `--build` flag to make sure the debug image isn't cached.

To run with development configuration:

```
source aliases.sh
docker-compose-dev up
```

This runs with features to aid debugging:

- Opens ports on host:
  - 27017 (mongodb)
  - 9230 (node debugger)
- Runs service in nodemon and monitors project files for changes

Run `docker-compose down` after finishing.

## Running Tests

To run tests in container:

```
docker-compose-dev run --rm pageserv npm test
docker-compose-dev down
```
