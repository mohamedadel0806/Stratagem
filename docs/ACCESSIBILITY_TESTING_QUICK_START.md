# Accessibility Testing - Quick Start Guide

**Last Updated**: December 2024  
**Environment**: Docker

---

## Prerequisites

Ensure Docker services are running:
```bash
# Check services status
docker-compose ps

# Start services if needed
docker-compose up -d

# Verify frontend is accessible
curl http://localhost:3000
```

---

## Quick Test Commands (Docker)

### Option 1: Run Tests from Host Machine (Recommended)

Tests connect to `http://localhost:3000` where the frontend container is exposed.

```bash
# Run all accessibility tests
cd frontend
npm run test:e2e -- e2e/accessibility/accessibility.spec.ts

# Run tests in interactive UI mode
npm run test:e2e:ui -- e2e/accessibility/accessibility.spec.ts

# Run tests in headed mode (see browser)
npm run test:e2e:headed -- e2e/accessibility/accessibility.spec.ts
```

### Option 2: Run Tests Inside Frontend Container

```bash
# Run tests inside the frontend container
docker-compose exec frontend npm run test:e2e -- e2e/accessibility/accessibility.spec.ts

# Run with UI mode (requires X11 forwarding or VNC)
docker-compose exec -e DISPLAY=$DISPLAY frontend npm run test:e2e:ui -- e2e/accessibility/accessibility.spec.ts
```

### Option 3: Run Tests in Separate Container

```bash
# Run tests in a new container (one-time execution)
docker-compose run --rm frontend npm run test:e2e -- e2e/accessibility/accessibility.spec.ts
```

### Run Specific Test Category
```bash
# Keyboard Navigation only
npm run test:e2e -- e2e/accessibility/accessibility.spec.ts -g "Keyboard Navigation"

# ARIA Attributes only
npm run test:e2e -- e2e/accessibility/accessibility.spec.ts -g "ARIA Attributes"

# Touch Targets only
npm run test:e2e -- e2e/accessibility/accessibility.spec.ts -g "Touch Targets"
```

---

## Manual Testing Quick Checklist

### ✅ Keyboard Navigation (5 minutes)
1. Open `/en/dashboard/governance`
2. Press `Tab` - verify skip link appears
3. Press `Enter` on skip link - verify focus moves to main
4. Continue pressing `Tab` - verify all elements are reachable
5. Verify focus indicators are visible

### ✅ Screen Reader (10 minutes)
1. Enable VoiceOver (macOS) or NVDA (Windows)
2. Navigate to governance dashboard
3. Use screen reader shortcuts to navigate
4. Verify all content is announced
5. Verify buttons have descriptive labels

### ✅ Mobile Touch (5 minutes)
1. Open governance dashboard on mobile device (or resize browser to 375px)
2. Verify mobile posture summary appears
3. Tap all buttons - verify they're large enough (44x44px)
4. Verify adequate spacing between elements
5. Test in both portrait and landscape

---

## What Gets Tested

### Automated Tests (18 test cases)
- ✅ Keyboard navigation (Tab, Enter, Escape)
- ✅ ARIA attributes and roles
- ✅ Touch target sizes (44x44px minimum)
- ✅ Screen reader support
- ✅ Focus management
- ✅ Mobile responsiveness
- ✅ Accessibility snapshots

### Manual Tests
- ✅ Real screen reader testing
- ✅ Real mobile device testing
- ✅ Browser compatibility
- ✅ Visual focus indicators

---

## Expected Results

### All Tests Should Pass ✅
- Keyboard navigation works throughout
- All ARIA attributes are present
- Touch targets meet size requirements
- Screen readers can navigate and understand content
- Focus is properly managed
- Mobile view displays correctly

---

## Troubleshooting (Docker)

### Tests Fail to Start

**Check Docker services:**
```bash
# Verify all services are running
docker-compose ps

# Check frontend container logs
docker-compose logs frontend --tail 50

# Restart frontend if needed
docker-compose restart frontend

# Rebuild frontend if dependencies changed
docker-compose up -d --build frontend
```

**Verify frontend is accessible:**
```bash
# Test from host
curl http://localhost:3000

# Test from inside container
docker-compose exec frontend curl http://frontend:3000
```

### Tests Timeout

**Check service health:**
```bash
# Verify backend is healthy
docker-compose exec backend npm run healthcheck

# Check database connection
docker-compose exec postgres pg_isready -U postgres

# View backend logs
docker-compose logs backend --tail 50
```

**Increase timeout if needed:**
- Edit `frontend/e2e/accessibility/accessibility.spec.ts`
- Add `test.setTimeout(60000)` at the beginning of test file

### Mobile View Not Showing

**Verify viewport settings:**
- Tests automatically set viewport to 375x667 (mobile)
- Check browser DevTools responsive mode
- Verify CSS classes are correct

**Check container networking:**
```bash
# Verify frontend can reach backend
docker-compose exec frontend curl http://backend:3001/health
```

### Playwright Browser Issues

**Install Playwright browsers in container:**
```bash
# Install browsers inside container
docker-compose exec frontend npx playwright install

# Install with dependencies
docker-compose exec frontend npx playwright install --with-deps
```

**Check browser installation:**
```bash
docker-compose exec frontend npx playwright --version
```

---

## Next Steps After Testing

1. **Review Test Results**
   - Check for any failures
   - Review accessibility snapshot output

2. **Fix Any Issues**
   - Update components with missing ARIA attributes
   - Adjust touch target sizes if needed
   - Fix focus management issues

3. **Re-run Tests**
   - Verify fixes work
   - Ensure all tests pass

4. **Document Results**
   - Update test plan with results
   - Note any known limitations

---

**Status**: ✅ Test Suite Ready  
**Location**: `frontend/e2e/accessibility/accessibility.spec.ts`  
**Documentation**: `docs/ACCESSIBILITY_TEST_PLAN.md`


