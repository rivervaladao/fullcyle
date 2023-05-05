FROM node:20

WORKDIR /app

RUN apt-get update && apt-get install -y wget

COPY package*.json app.js ./

RUN npm install

EXPOSE 3000

ENTRYPOINT [ "node","app.js"]