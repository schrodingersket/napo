FROM node:8.11.4

WORKDIR /www

COPY *.json /www/
RUN npm install

COPY index.js /www/
COPY lib /www/lib
COPY middleware /www/middleware
COPY routes /www/routes

CMD ["node", "index.js"]
