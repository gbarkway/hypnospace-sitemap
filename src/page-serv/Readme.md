# Page Service

![page-serv test](https://github.com/gbarkway/hypnospace-sitemap/workflows/page-serv%20test/badge.svg)

Microservice for Hypnospace page details like tags, description, username, and HAP ID (maybe).

## Getting Started

To run service and seeded database:
```
docker-compose up
```

Service will be available on host port 3000.

Or:
```
docker-compose -f docker-compose.yml -f docker-compose.debug.yml up
```
This runs with features to aid debugging:

- Opens ports on host:
    - 27017 (mongo)
    - 9229 (node debugger)
- Runs service in nodemon and monitors project files for changes

For convenience you can alias the above:
```
alias docker-compose-dbg="docker-compose -f docker-compose.yml -f docker-compose.debug.yml"
docker-compose-dbg up
```

Run `docker-compose down` after finishing.

## Running Tests
To run tests in container:
```
docker-compose-dbg run --rm pageserv npm test
docker-compose-dbg down
```



