FROM node:12

ARG port=3000
ENV PORT=$port

ARG maxHeaderSize=120000
ENV MAX_HEADER_SIZE=$maxHeaderSize

EXPOSE $port

CMD mkdir app
COPY . app
WORKDIR /app

RUN npm i
RUN npm run prestart

ENV DEBUG=''
ENV PLAYGROUND=''

ENV ENTSOE_API_URL=''
ENV ENTSOE_SECURITY_TOKEN=''

ENTRYPOINT node --max-http-header-size=$MAX_HEADER_SIZE -r ts-node/register src/main.ts
