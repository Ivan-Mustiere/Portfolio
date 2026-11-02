FROM node:22-slim

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
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY server.js .

# Stays root: access to the mounted docker.sock is root-equivalent anyway, and a
# non-root user would need the host's docker GID baked in. Isolation comes from
# not publishing this container's port (see docker-compose.yml).
EXPOSE 4000
CMD ["node", "server.js"]
