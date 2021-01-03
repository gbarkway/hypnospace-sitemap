FROM node:12.18-alpine AS development
ENV NODE_ENV=development
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --silent
EXPOSE 3000

FROM development AS production
ENV NODE_ENV=production
COPY . .
CMD ["node", "app.js"]
