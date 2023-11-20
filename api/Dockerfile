docker pull ghcr.io/puppeteer/puppeteer:latest # pulls the latest
docker pull ghcr.io/puppeteer/puppeteer:19.7.2 # pulls the image that contains Puppeteer v16.1.0

USER root

# Install xvfb
RUN apt-get update && \
    apt-get install -y xvfb

USER node

# Set up display
ENV DISPLAY=:99

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci
COPY . .

# Start xvfb and run the application
CMD xvfb-run --auto-servernum --server-args="-screen 0 1280x1024x24" npx nodemon app.js