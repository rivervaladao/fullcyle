FROM node:19.0-slim

WORKDIR /home/node/app

USER root

RUN apt update -y && apt install curl -y

USER node

CMD [ "tail","-f","/dev/null" ]