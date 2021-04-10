# Hypnospace Outlaw Sitemap

[**Currently hosted here!**](https://hypnospacemap.ca)

![page-serv test](https://github.com/gbarkway/hypnospace-sitemap/workflows/page-serv%20test/badge.svg)
![capture-serv test](https://github.com/gbarkway/hypnospace-sitemap/workflows/capture-serv%20test/badge.svg)
[![crawler test](https://github.com/gbarkway/hypnospace-sitemap/actions/workflows/crawler-test.yml/badge.svg)](https://github.com/gbarkway/hypnospace-sitemap/actions/workflows/crawler-test.yml)

An interactive map of Hypnospace, the alternate-reality Internet from the wonderful 2019 game [Hypnospace Outlaw](http://www.hypnospace.net/). 

![Animated screencapture](./screencapture.gif)

## Run on your local machine

The below instructions require Docker and docker-compose

```shell
cd src
docker-compose --profile frontend up
```

The webapp is available at **http://localhost:5000**

Visit the subfolders listed below for more project-specific instructions, including how to run in a more development-friendly way.

## Project structure

| Name  | Description   | Path | Localhost port |
| ------- |---------------|------| ----- |
| Capture service | Backend service for sitemap graph data (i.e. edges between pages) | src/capture-serv | 3001 |
| Page service | Backend service for viewing and searching detailed page information | src/page-serv | 3000 |
| Webapp | Web frontend | src/web | 5000
| Crawler | Python scripts that parse Hypnospace Outlaw game data for use of above services | src/crawler |

## Contributing

Issues and pull requests welcome!

## Deployment

### Building docker images for production

To build a docker image for every service and push them to a container registry:

1) Set the environment variables in **src/.env** (edit the file directly or set them in your shell)
2) `docker-compose build --profile frontend`
3) `docker-compose push`

### DigitalOcean App Platform

See **deploy/app.yaml** for an example app spec for deploying on DigitalOcean App Platform.

### Kubernetes

Even though it was huge overkill, I used to host this in a Kubernetes cluster for fun. Notes on that in the deploy folder sometime later.
