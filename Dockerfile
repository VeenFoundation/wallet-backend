FROM node:8.11.1

ENV NPM_CONFIG_LOGLEVEL info

EXPOSE 80

COPY . /home/wallet

WORKDIR /home/wallet

RUN npm install 

CMD ["node", "./index.js"]