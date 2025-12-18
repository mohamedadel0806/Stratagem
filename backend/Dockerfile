# Multi-stage build for NestJS application
FROM node:24-alpine AS base

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
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001
RUN chown -R nestjs:nodejs /app
USER nestjs
EXPOSE 3001
CMD ["node", "dist/main.js"]

# Development stage
FROM base AS development
# Install Python and build tools for bcrypt
RUN apk add --no-cache python3 make g++
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