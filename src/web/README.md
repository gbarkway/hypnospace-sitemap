# Frontend Web App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Getting Started

Although this project can be run from a container using the Dockerfile or docker-compose, I mostly developed this component outside the container.

```
# start backend services
docker-compose -f ../docker-compose.yml -d
npm install
npm start
```

Backend endpoint locations can be changed by modifying .env.development, or creating a .env.local file. [See here for description of dotenv files in create-react-app projects](https://create-react-app.dev/docs/adding-custom-environment-variables/#what-other-env-files-can-be-used). 

## Building

Building a container image:

```
docker-compose -f ../docker-compose.yml build web
```

Building locally:
```
npm build
```

Note: the location of the backend services **must be known at build time**. `npm build` will read .env.production for this information. If using the docker-compose command above, the path to the .env file can be specified with the environment variable WEBAPP_DOT_ENV_PATH.
