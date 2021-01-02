# Page Service

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

## Running Tests
To run tests in container:
```
docker-compose run -e NODE_ENV=test pageserv npm test
docker-compose down
```



