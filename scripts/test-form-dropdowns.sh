#!/bin/bash

# Test script for Physical Asset Form Dropdowns
# This script runs both E2E and component tests for the dropdown functionality

set -e

echo "🧪 Testing Physical Asset Form Dropdowns"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "frontend/package.json" ]; then
  echo -e "${RED}Error: Must run from project root${NC}"
  exit 1
fi

cd frontend

echo -e "${YELLOW}Step 1: Running Component Tests (Jest)${NC}"
echo "----------------------------------------"
if npm test -- physical-asset-form-dropdowns.test.tsx --passWithNoTests; then
  echo -e "${GREEN}✅ Component tests passed${NC}"
else
  echo -e "${RED}❌ Component tests failed${NC}"
  exit 1
fi

echo ""
echo -e "${YELLOW}Step 2: Running E2E Tests (Playwright)${NC}"
echo "----------------------------------------"
echo "Note: This requires the dev servers to be running"
echo ""

# Check if servers are running
if ! lsof -ti:3000 > /dev/null 2>&1; then
  echo -e "${RED}Warning: Frontend server (port 3000) not detected${NC}"
  echo "Please start it with: npm run dev"
  echo ""
fi

if ! lsof -ti:3001 > /dev/null 2>&1 && ! lsof -ti:8000 > /dev/null 2>&1; then
  echo -e "${RED}Warning: Backend server not detected${NC}"
  echo "Please start it with: npm run start:dev (in backend/)"
  echo ""
fi

# Run E2E tests
if npm run test:e2e -- e2e/assets/physical-asset-form-dropdowns.spec.ts; then
  echo -e "${GREEN}✅ E2E tests passed${NC}"
else
  echo -e "${RED}❌ E2E tests failed${NC}"
  echo ""
  echo "Tip: Run with --headed to see what's happening:"
  echo "  npm run test:e2e:headed -- e2e/assets/physical-asset-form-dropdowns.spec.ts"
  exit 1
fi

echo ""
echo -e "${GREEN}✅ All tests passed!${NC}"
echo ""
echo "Summary:"
echo "  - Component tests: ✅"
echo "  - E2E tests: ✅"
echo ""
echo "The dropdown implementation is working correctly!"
