# Build phase
FROM node:8.11.4

WORKDIR /www

COPY *.json /www/
COPY e2e /www/e2e
COPY src /www/src

RUN npm install && npm run build

# Main build
FROM nginx:1.15.2

COPY --from=0 /www/dist/napo-client/* /usr/share/nginx/html/
