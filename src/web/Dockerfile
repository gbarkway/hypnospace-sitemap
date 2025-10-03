FROM node:24.9-alpine3.21 AS development
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json", "./"]
RUN npm install --silent
ARG DOT_ENV=".env.production"
COPY ${DOT_ENV} ./.env


FROM development as build
COPY ["src", "src/"]
COPY ["public", "public/"]
RUN npm run build

FROM node:24.9-alpine3.21 AS production
WORKDIR /usr/src/app
RUN npm install -g serve
EXPOSE 3000
COPY --from=build "/usr/src/app/build/" "./build/"
CMD ["serve", "build"]
