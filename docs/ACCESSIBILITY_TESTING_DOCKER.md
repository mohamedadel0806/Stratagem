# Accessibility Testing in Docker - Complete Guide

**Last Updated**: December 2024  
**Environment**: Docker Compose

---

## 🐳 Docker Setup

### Verify Services Are Running

```bash
# Check all services status
docker-compose ps

# Expected output should show:
# - frontend (port 3000)
# - backend (port 3001)
# - postgres (port 5432)
# - kong (port 8000)
```

### Start Services (if not running)

```bash
# Start all services
docker-compose up -d

# Start specific services
docker-compose up -d frontend backend postgres

# View logs
docker-compose logs -f frontend
```

---

## 🧪 Running Accessibility Tests

### Method 1: From Host Machine (Recommended)

**Advantages:**
- Direct access to browser UI
- Better for debugging
- No container networking issues

**Commands:**
```bash
# Navigate to frontend directory
cd frontend

# Run all accessibility tests
npm run test:e2e -- e2e/accessibility/accessibility.spec.ts

# Run with interactive UI
npm run test:e2e:ui -- e2e/accessibility/accessibility.spec.ts

# Run in headed mode (see browser)
npm run test:e2e:headed -- e2e/accessibility/accessibility.spec.ts
```

**Configuration:**
- Tests connect to `http://localhost:3000` (frontend container port)
- Playwright runs on host machine
- Browser is visible on host

---

### Method 2: Inside Frontend Container

**Advantages:**
- Consistent environment
- All dependencies in container
- Isolated from host

**Commands:**
```bash
# Run tests inside container
docker-compose exec frontend npm run test:e2e -- e2e/accessibility/accessibility.spec.ts

# Run with specific test category
docker-compose exec frontend npm run test:e2e -- e2e/accessibility/accessibility.spec.ts -g "Keyboard Navigation"

# Check if Playwright browsers are installed
docker-compose exec frontend npx playwright --version
```

**Install Playwright Browsers (if needed):**
```bash
# Install browsers in container
docker-compose exec frontend npx playwright install

# Install with system dependencies
docker-compose exec frontend npx playwright install --with-deps
```

**Note**: UI mode requires X11 forwarding or VNC setup for container execution.

---

### Method 3: One-Time Test Container

**Use Case**: Clean test environment for CI/CD

```bash
# Run tests in new container (removed after completion)
docker-compose run --rm frontend npm run test:e2e -- e2e/accessibility/accessibility.spec.ts

# With environment variables
docker-compose run --rm -e CI=true frontend npm run test:e2e -- e2e/accessibility/accessibility.spec.ts
```

---

## 🔧 Docker-Specific Configuration

### Update Playwright Config for Docker

The `playwright.config.ts` should use:
```typescript
use: {
  baseURL: process.env.FRONTEND_URL || 'http://localhost:3000',
  // ... other config
}
```

### Environment Variables

Create `.env.test` in `frontend/` directory:
```env
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:3001
TEST_USER_EMAIL=test@example.com
TEST_USER_PASSWORD=your-test-password
```

Or pass via Docker:
```bash
docker-compose exec -e FRONTEND_URL=http://localhost:3000 frontend npm run test:e2e
```

---

## 🐛 Troubleshooting

### Issue: Tests Can't Connect to Frontend

**Symptoms:**
- Connection refused errors
- Timeout errors

**Solutions:**
```bash
# Verify frontend is running
docker-compose ps frontend

# Check frontend logs
docker-compose logs frontend --tail 50

# Test connectivity
curl http://localhost:3000

# Restart frontend
docker-compose restart frontend

# Rebuild if needed
docker-compose up -d --build frontend
```

### Issue: Playwright Browsers Not Found

**Symptoms:**
- Browser not found errors
- Missing browser executable

**Solutions:**
```bash
# Install browsers in container
docker-compose exec frontend npx playwright install

# Install with dependencies (Linux)
docker-compose exec frontend npx playwright install --with-deps chromium

# Verify installation
docker-compose exec frontend npx playwright --version
```

### Issue: Tests Timeout

**Symptoms:**
- Tests fail with timeout errors
- Page doesn't load

**Solutions:**
```bash
# Check backend health
docker-compose exec backend curl http://localhost:3001/health

# Check database
docker-compose exec postgres pg_isready -U postgres

# View all service logs
docker-compose logs --tail 100

# Increase timeout in test file
# Edit: frontend/e2e/accessibility/accessibility.spec.ts
# Add: test.setTimeout(60000)
```

### Issue: Mobile View Not Displaying

**Symptoms:**
- Desktop view shows on mobile viewport
- CSS not applying correctly

**Solutions:**
```bash
# Verify viewport is set correctly in tests
# Tests automatically set: 375x667 (mobile)

# Check frontend container logs for CSS issues
docker-compose logs frontend | grep -i "error\|warn"

# Verify responsive CSS is loaded
docker-compose exec frontend curl http://localhost:3000 | grep -i "md:hidden"
```

### Issue: Container Networking Problems

**Symptoms:**
- Frontend can't reach backend
- API calls fail

**Solutions:**
```bash
# Verify network exists
docker network ls | grep grc-network

# Check container networking
docker-compose exec frontend ping backend

# Test backend from frontend container
docker-compose exec frontend curl http://backend:3001/health

# Recreate network if needed
docker-compose down
docker-compose up -d
```

---

## 📊 Test Execution Examples

### Run Specific Test Category

```bash
# Keyboard Navigation only
cd frontend
npm run test:e2e -- e2e/accessibility/accessibility.spec.ts -g "Keyboard Navigation"

# ARIA Attributes only
npm run test:e2e -- e2e/accessibility/accessibility.spec.ts -g "ARIA Attributes"

# Touch Targets only
npm run test:e2e -- e2e/accessibility/accessibility.spec.ts -g "Touch Targets"
```

### Run with Debug Output

```bash
# Verbose output
cd frontend
DEBUG=pw:api npm run test:e2e -- e2e/accessibility/accessibility.spec.ts

# Show browser console
cd frontend
npm run test:e2e:headed -- e2e/accessibility/accessibility.spec.ts
```

### Generate Test Report

```bash
# HTML report (auto-generated)
cd frontend
npm run test:e2e -- e2e/accessibility/accessibility.spec.ts

# View report
open frontend/playwright-report/index.html
```

---

## 🔍 Verification Checklist

Before running tests, verify:

- [ ] Docker services are running (`docker-compose ps`)
- [ ] Frontend is accessible (`curl http://localhost:3000`)
- [ ] Backend is healthy (`curl http://localhost:3001/health`)
- [ ] Playwright browsers installed (`npx playwright --version`)
- [ ] Test user credentials configured (`.env.test`)
- [ ] Network connectivity between containers

---

## 🚀 Quick Start Commands

```bash
# 1. Start services
docker-compose up -d

# 2. Wait for services to be ready
sleep 10

# 3. Verify frontend
curl http://localhost:3000

# 4. Run accessibility tests
cd frontend
npm run test:e2e -- e2e/accessibility/accessibility.spec.ts

# 5. View results
open playwright-report/index.html
```

---

## 📝 Notes

- **Port Mapping**: Frontend is exposed on `localhost:3000` from host
- **Network**: Containers communicate via `grc-network` Docker network
- **Volumes**: Frontend code is mounted, so changes reflect immediately
- **Browser**: Playwright uses Chromium by default
- **Reports**: Test reports are saved in `frontend/playwright-report/`

---

## 🔗 Related Documentation

- [Accessibility Test Plan](./ACCESSIBILITY_TEST_PLAN.md)
- [Accessibility Testing Quick Start](./ACCESSIBILITY_TESTING_QUICK_START.md)
- [Docker Setup Guide](./DOCKER_SETUP.md)
- [E2E Testing Setup](./E2E_TESTING_SETUP.md)

---

**Status**: ✅ Docker-ready  
**Last Updated**: December 2024


