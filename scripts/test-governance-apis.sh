#!/bin/bash

# Governance Module API Testing Script
# Tests all Governance endpoints via Docker

BASE_URL="http://localhost:3001/api/v1/governance"
TOKEN="${GOVERNANCE_TEST_TOKEN:-}"

echo "🧪 Testing Governance Module APIs"
echo "=================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if token is provided
if [ -z "$TOKEN" ]; then
  echo -e "${YELLOW}⚠️  No token provided. Set GOVERNANCE_TEST_TOKEN environment variable${NC}"
  echo "   Example: export GOVERNANCE_TEST_TOKEN='your-jwt-token'"
  echo ""
  echo "   Or login first:"
  echo "   curl -X POST http://localhost:3001/api/v1/auth/login \\"
  echo "     -H 'Content-Type: application/json' \\"
  echo "     -d '{\"email\":\"admin@grcplatform.com\",\"password\":\"password123\"}'"
  echo ""
  exit 1
fi

# Test function
test_endpoint() {
  local name=$1
  local endpoint=$2
  local method=${3:-GET}
  
  echo -n "Testing $name... "
  
  if [ "$method" = "GET" ]; then
    response=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL$endpoint" \
      -H "Authorization: Bearer $TOKEN" 2>/dev/null)
  else
    response=$(curl -s -w "\n%{http_code}" -X $method "$BASE_URL$endpoint" \
      -H "Authorization: Bearer $TOKEN" \
      -H "Content-Type: application/json" \
      -d "$4" 2>/dev/null)
  fi
  
  http_code=$(echo "$response" | tail -n1)
  body=$(echo "$response" | sed '$d')
  
  if [ "$http_code" -eq 200 ] || [ "$http_code" -eq 201 ]; then
    echo -e "${GREEN}✓${NC} (HTTP $http_code)"
    
    # Try to extract count if JSON
    if command -v jq &> /dev/null; then
      count=$(echo "$body" | jq -r '.meta.total // .data | length // . | length' 2>/dev/null)
      if [ ! -z "$count" ] && [ "$count" != "null" ]; then
        echo "  └─ Found: $count items"
      fi
    fi
    return 0
  else
    echo -e "${RED}✗${NC} (HTTP $http_code)"
    echo "  └─ Response: $(echo "$body" | head -c 100)"
    return 1
  fi
}

echo "📋 Testing Influencers API"
test_endpoint "Get Influencers" "/influencers"
test_endpoint "Get Influencers (filtered)" "/influencers?category=regulatory"
echo ""

echo "📄 Testing Policies API"
test_endpoint "Get Policies" "/policies"
test_endpoint "Get Policies (filtered)" "/policies?status=active"
echo ""

echo "🎯 Testing Control Objectives API"
test_endpoint "Get Control Objectives" "/control-objectives"
echo ""

echo "🔒 Testing Unified Controls API"
test_endpoint "Get Unified Controls" "/unified-controls"
test_endpoint "Get Unified Controls (filtered)" "/unified-controls?status=active&implementation_status=implemented"
echo ""

echo "📊 Testing Assessments API"
test_endpoint "Get Assessments" "/assessments"
echo ""

echo "📎 Testing Evidence API"
test_endpoint "Get Evidence" "/evidence"
echo ""

echo ""
echo "✅ API Testing Complete!"
echo ""
echo "Next: Test frontend at http://localhost:3000"





