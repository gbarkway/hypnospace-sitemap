FROM node:12.18-alpine AS build
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json", "./"]
RUN npm install --silent
COPY ["src", "src/"]
COPY ["public", "public/"]
ARG REACT_APP_PAGE_SERV_URL
ARG REACT_APP_CAPTURE_SERV_URL
ENV REACT_APP_CAPTURE_SERV_URL $REACT_APP_CAPTURE_SERV_URL
ENV REACT_APP_PAGE_SERV_URL $REACT_APP_PAGE_SERV_URL
RUN npm run build

FROM node:12.18-alpine AS production
WORKDIR /usr/src/app
COPY --from=build "/usr/src/app/build/" "./build/"
RUN npm install -g serve
EXPOSE 5000
CMD ["serve", "-s", "build"]
