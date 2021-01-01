# Page Service

Microservice for Hypnospace page details like tags, description, username, and HAP ID (maybe).

## Getting Started

To run service and seeded database:
```
docker-compose up
```

Or:
```
docker-compose -f docker-compose.yml -f docker-compose.debug.yml up
```
This will run with ports exposed to aid debugging:
- 27017 (mongo)
- 3000 (node)
- 9229 (node debugger)

## Running Tests
To run tests in container:
```
docker-compose run -e NODE_ENV=test pageserv npm install&&npm test
docker-compose down
```




