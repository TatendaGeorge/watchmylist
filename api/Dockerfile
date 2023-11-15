FROM ghcr.io/puppeteer/puppeteer:19.7.2

RUN apt-get update && \
    apt-get install -y libx11-xcb1 libxcb-dri3-0 libdrm-dev libgbm-dev libxshmfence-dev

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci
COPY . .

CMD [ "npx", "nodemon", "app.js" ]



