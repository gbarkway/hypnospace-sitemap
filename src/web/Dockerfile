FROM node:14.16-alpine AS build
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json", "./"]
RUN npm install --silent
COPY ["src", "src/"]
COPY ["public", "public/"]
ARG DOT_ENV=".env.production"
COPY ${DOT_ENV} ./.env
RUN npm run build

FROM node:15.14-alpine AS production
WORKDIR /usr/src/app
RUN npm install -g serve
EXPOSE 5000
COPY --from=build "/usr/src/app/build/" "./build/"
CMD ["serve", "build"]
