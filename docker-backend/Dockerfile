FROM node:20-slim

RUN apt-get update && apt-get install -y \
    ca-certificates \
    docker.io \
    curl \
    --no-install-recommends \
  && mkdir -p /usr/local/lib/docker/cli-plugins \
  && curl -fsSL "https://github.com/docker/compose/releases/download/v2.27.1/docker-compose-linux-x86_64" \
    -o /usr/local/lib/docker/cli-plugins/docker-compose \
  && chmod +x /usr/local/lib/docker/cli-plugins/docker-compose \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY package.json .
RUN npm install --production
COPY server.js .

EXPOSE 4000
CMD ["node", "server.js"]
