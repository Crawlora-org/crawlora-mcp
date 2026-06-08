# Standalone local Crawlora MCP server (stdio).
# Note: Glama generates its own build from the Dockerfile admin form; this file
# is for users who want to `docker build` / `docker run` the server themselves.
FROM node:22-slim

WORKDIR /app
COPY package.json ./
RUN npm install --omit=dev --no-audit --no-fund
COPY index.mjs tools.json ./

# CRAWLORA_API_KEY must be provided at runtime (free key at https://crawlora.net).
ENV CRAWLORA_API_KEY=""
CMD ["node", "index.mjs"]
