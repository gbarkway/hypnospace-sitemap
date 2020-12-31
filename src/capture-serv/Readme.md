# Capture Service

Microservice for Hypnospace captures. Here "capture" means a date, a set of pages, and a map of connections between pages.

## Getting Started

### Local

Service:

```
npm install
npm start
```

Tests:
```
npm test
```

### Docker images

Service:

```
docker build ./ -t "captureserv:latest"
docker run -p 3000:3000 captureserv:latest 
```

Tests:

```
docker build ./ -f Dockerfile.test -t "captureserv:test"
docker run captureserv:test
```

The test container runs `npm test` then exits.




