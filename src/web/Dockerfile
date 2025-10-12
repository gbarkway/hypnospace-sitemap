FROM node:24.9-alpine3.21 AS development
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json", "./"]
RUN npm install --silent
ARG DOT_ENV=".env.production"
COPY ${DOT_ENV} ./.env

FROM development AS build
COPY ["index.html", "index.html"]
COPY ["src", "src/"]
COPY ["public", "public/"]
RUN npm run build

FROM mcr.microsoft.com/playwright:v1.56.0-noble AS test
WORKDIR /usr/src/app
COPY --from=build ["/usr/src/app", "/usr/src/app"]
RUN npx playwright install chromium --with-deps
COPY ["vitest.config.ts", "vitest.config.ts"]
COPY ["vite.config.ts", "vite.config.ts"]
CMD ["npm", "test"]

FROM node:24.9-alpine3.21 AS production
WORKDIR /usr/src/app
RUN npm install -g serve
EXPOSE 3000
COPY --from=build "/usr/src/app/dist/" "./dist/"
CMD ["serve", "build"]
