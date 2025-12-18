# Multi-stage build for NestJS application
FROM node:22-slim AS base

# Install dependencies
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm install --only=production --legacy-peer-deps

# Build the application
FROM base AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

# Production stage
FROM base AS production
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
# Copy and make healthcheck script executable
COPY healthcheck.sh /app/healthcheck.sh
RUN chmod +x /app/healthcheck.sh

# Debian-style user creation
RUN groupadd -g 1001 nodejs && \
    useradd -u 1001 -g nodejs -s /bin/sh -m nestjs && \
    chown -R nestjs:nodejs /app

USER nestjs
EXPOSE 3001
CMD ["node", "dist/main.js"]

# Final stage (for safety, explicitly production)
FROM production AS final

# Development stage
FROM base AS development
# Install Python and build tools for bcrypt (using apt-get for Debian)
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# Copy and make healthcheck script executable
COPY healthcheck.sh /app/healthcheck.sh
RUN chmod +x /app/healthcheck.sh
# Rebuild bcrypt for the container architecture after copying
RUN npm rebuild bcrypt --build-from-source || true
EXPOSE 3001
CMD ["npm", "run", "start:dev"]