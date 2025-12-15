# Configurable API Gateway Implementation

## Overview
The application now supports two API routing modes:
1. **Next.js Proxy Mode** (default): Frontend → Next.js API Route → Backend
2. **Kong Gateway Mode**: Frontend → Kong → Backend

## Configuration

### Frontend Environment Variables
Create `.env.local` in the frontend directory:

```bash
# Set to 'true' to enable Kong Gateway mode
NEXT_PUBLIC_USE_KONG=false

# Kong Gateway URL (only used when USE_KONG=true)
NEXT_PUBLIC_KONG_URL=http://localhost:8001/api

# Next.js proxy URL (only used when USE_KONG=false)
NEXT_PUBLIC_PROXY_URL=/api/proxy

# Backend URL for server-side API calls (NextAuth, etc.)
BACKEND_URL=http://localhost:3001
```

### Switching Modes

**Next.js Proxy Mode (USE_KONG=false):**
- Frontend → Next.js API route (`/api/proxy/*`) → Backend
- Next.js proxy route handles JWT token forwarding
- No external proxy needed, works with Next.js alone

**Kong Gateway Mode (USE_KONG=true):**
- Frontend → Kong Gateway (`http://localhost:8001/api/*`) → Backend
- Kong strips `/api` prefix before forwarding
- Requires Kong to be running

**Kong Gateway Mode (USE_KONG=true):**
- Frontend makes requests to `http://localhost:8001/api/*`
- Kong Gateway routes to backend at `backend:3001`
- Kong strips `/api` prefix before forwarding

## Testing

Run the test script to verify both modes:
```bash
node scripts/test-api-client.js
```

## Kong Configuration

Kong runs in DB-less mode with declarative configuration:
- Routes: `/api/*` → `backend:3001`
- Plugins: Rate limiting, CORS
- Configuration file: `infrastructure/kong/kong.yml`

## Next.js Proxy Configuration

The Next.js proxy route handles API requests when Kong is disabled:
- Route: `/api/proxy/*` → Backend
- Authentication: JWT tokens from NextAuth session
- File: `frontend/src/app/api/proxy/[[...path]]/route.ts`

## Docker Services

- **kong**: API Gateway (port 8001) - Optional, only needed for Kong mode
- **backend**: NestJS API server (port 3001)
- **frontend**: Next.js application (port 3000)

## Production Deployment

For production:
1. Set `NEXT_PUBLIC_USE_KONG=true`
2. Configure `NEXT_PUBLIC_KONG_URL` to production Kong URL
3. Ensure Kong is properly configured in `docker-compose.prod.yml`
4. Update Caddyfile for production domain routing

## Benefits

- **Flexibility**: Easy switching between routing architectures
- **Rate Limiting**: Kong provides API rate limiting and monitoring
- **Scalability**: Kong can load balance across multiple backend instances
- **Security**: Additional layer of API management and security
- **Monitoring**: Kong provides detailed API analytics