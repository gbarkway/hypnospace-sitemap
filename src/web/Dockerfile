FROM node:12.18-alpine AS build
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json", "./"]
COPY ["src", "src/"]
COPY ["public", "public/"]
RUN npm install --silent && npm run build

FROM node:12.18-alpine AS production
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY --from=build "/usr/src/app/build/" "./build/"
RUN npm install -g serve
EXPOSE 5000
CMD ["serve", "-s", "build"]
