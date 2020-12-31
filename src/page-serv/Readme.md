# Page Service

Microservice for Hypnospace page details like tags, description, username, and HAP ID (maybe).

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




