#!/bin/bash

# Alert Escalation API Endpoints Smoke Test
# Tests all 9 REST endpoints for the alert escalation system

set -e

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
API_BASE_URL="${API_BASE_URL:-http://localhost:3001}"
API_VERSION="v1"
GOVERNANCE_ENDPOINT="${API_BASE_URL}/api/${API_VERSION}/governance"

# Test data
TEST_ALERT_ID=""
TEST_CHAIN_ID=""
TEST_USER_ID="user-1"

# Helper function to print test results
print_result() {
  local test_name=$1
  local status=$2
  local message=$3
  
  if [ "$status" = "PASS" ]; then
    echo -e "${GREEN}✅ PASS${NC} - $test_name"
  else
    echo -e "${RED}❌ FAIL${NC} - $test_name"
    echo -e "${RED}   Error: $message${NC}"
  fi
}

# Helper function to make API calls
api_call() {
  local method=$1
  local endpoint=$2
  local data=$3
  local description=$4
  
  echo -e "${BLUE}→ Testing: $description${NC}"
  
  if [ -z "$data" ]; then
    response=$(curl -s -X "$method" \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer test-token" \
      "$GOVERNANCE_ENDPOINT$endpoint")
  else
    response=$(curl -s -X "$method" \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer test-token" \
      -d "$data" \
      "$GOVERNANCE_ENDPOINT$endpoint")
  fi
  
  echo "$response"
}

echo -e "${YELLOW}================================${NC}"
echo -e "${YELLOW}Alert Escalation API Smoke Tests${NC}"
echo -e "${YELLOW}================================${NC}"
echo ""

# Test 1: Create Escalation Chain
echo -e "${BLUE}Test 1: POST /alert-escalation/chains - Create Escalation Chain${NC}"
create_chain_data=$(cat <<EOF
{
  "alertId": "test-alert-1",
  "escalationRules": [
    {
      "level": 1,
      "delayMinutes": 15,
      "roles": ["manager"],
      "notifyChannels": ["email"],
      "description": "Notify manager"
    },
    {
      "level": 2,
      "delayMinutes": 30,
      "roles": ["ciso"],
      "notifyChannels": ["email", "sms"],
      "description": "Notify CISO"
    }
  ]
}
EOF
)

response=$(curl -s -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer test-token" \
  -d "$create_chain_data" \
  "$GOVERNANCE_ENDPOINT/alert-escalation/chains")

# Check if response contains an id
if echo "$response" | grep -q '"id"'; then
  TEST_CHAIN_ID=$(echo "$response" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
  print_result "Create Escalation Chain" "PASS" ""
  echo -e "${GREEN}   Chain ID: $TEST_CHAIN_ID${NC}"
else
  print_result "Create Escalation Chain" "FAIL" "$response"
fi
echo ""

# Test 2: Get Escalation Chain by ID
if [ -n "$TEST_CHAIN_ID" ]; then
  echo -e "${BLUE}Test 2: GET /alert-escalation/chains/{id} - Get Escalation Chain${NC}"
  response=$(curl -s -X GET \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer test-token" \
    "$GOVERNANCE_ENDPOINT/alert-escalation/chains/$TEST_CHAIN_ID")
  
  if echo "$response" | grep -q '"id"'; then
    print_result "Get Escalation Chain" "PASS" ""
  else
    print_result "Get Escalation Chain" "FAIL" "$response"
  fi
else
  echo -e "${YELLOW}⚠️  Skipping Test 2 (no chain ID from Test 1)${NC}"
fi
echo ""

# Test 3: Get Alert Escalation Chains
echo -e "${BLUE}Test 3: GET /alert-escalation/alerts/{alertId}/chains - Get Alert Chains${NC}"
response=$(curl -s -X GET \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer test-token" \
  "$GOVERNANCE_ENDPOINT/alert-escalation/alerts/test-alert-1/chains")

if echo "$response" | grep -q '\['; then
  print_result "Get Alert Escalation Chains" "PASS" ""
else
  print_result "Get Alert Escalation Chains" "FAIL" "$response"
fi
echo ""

# Test 4: Get Active Escalation Chains
echo -e "${BLUE}Test 4: GET /alert-escalation/chains/active - Get Active Chains${NC}"
response=$(curl -s -X GET \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer test-token" \
  "$GOVERNANCE_ENDPOINT/alert-escalation/chains/active")

if echo "$response" | grep -q '\['; then
  print_result "Get Active Escalation Chains" "PASS" ""
else
  print_result "Get Active Escalation Chains" "FAIL" "$response"
fi
echo ""

# Test 5: Escalate Alert
if [ -n "$TEST_CHAIN_ID" ]; then
  echo -e "${BLUE}Test 5: PUT /alert-escalation/chains/{id}/escalate - Escalate Alert${NC}"
  response=$(curl -s -X PUT \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer test-token" \
    -d '{}' \
    "$GOVERNANCE_ENDPOINT/alert-escalation/chains/$TEST_CHAIN_ID/escalate")
  
  if echo "$response" | grep -q '"currentLevel"'; then
    level=$(echo "$response" | grep -o '"currentLevel":[0-9]*' | cut -d':' -f2)
    print_result "Escalate Alert" "PASS" ""
    echo -e "${GREEN}   New Level: $level${NC}"
  else
    print_result "Escalate Alert" "FAIL" "$response"
  fi
else
  echo -e "${YELLOW}⚠️  Skipping Test 5 (no chain ID from Test 1)${NC}"
fi
echo ""

# Test 6: Resolve Escalation Chain
if [ -n "$TEST_CHAIN_ID" ]; then
  echo -e "${BLUE}Test 6: PUT /alert-escalation/chains/{id}/resolve - Resolve Chain${NC}"
  resolve_data=$(cat <<EOF
{
  "resolution_notes": "Issue resolved during smoke test"
}
EOF
)
  response=$(curl -s -X PUT \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer test-token" \
    -d "$resolve_data" \
    "$GOVERNANCE_ENDPOINT/alert-escalation/chains/$TEST_CHAIN_ID/resolve")
  
  if echo "$response" | grep -q '"status"'; then
    status=$(echo "$response" | grep -o '"status":"[^"]*"' | head -1 | cut -d'"' -f4)
    print_result "Resolve Escalation Chain" "PASS" ""
    echo -e "${GREEN}   Status: $status${NC}"
  else
    print_result "Resolve Escalation Chain" "FAIL" "$response"
  fi
else
  echo -e "${YELLOW}⚠️  Skipping Test 6 (no chain ID from Test 1)${NC}"
fi
echo ""

# Test 7: Cancel Escalation Chain (create new one first)
echo -e "${BLUE}Test 7: PUT /alert-escalation/chains/{id}/cancel - Cancel Chain${NC}"
new_chain_data=$(cat <<EOF
{
  "alertId": "test-alert-2",
  "escalationRules": [
    {
      "level": 1,
      "delayMinutes": 15,
      "roles": ["manager"],
      "notifyChannels": ["email"]
    }
  ]
}
EOF
)
create_response=$(curl -s -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer test-token" \
  -d "$new_chain_data" \
  "$GOVERNANCE_ENDPOINT/alert-escalation/chains")

CANCEL_CHAIN_ID=$(echo "$create_response" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)

if [ -n "$CANCEL_CHAIN_ID" ]; then
  response=$(curl -s -X PUT \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer test-token" \
    -d '{}' \
    "$GOVERNANCE_ENDPOINT/alert-escalation/chains/$CANCEL_CHAIN_ID/cancel")
  
  if echo "$response" | grep -q '"status"'; then
    status=$(echo "$response" | grep -o '"status":"[^"]*"' | head -1 | cut -d'"' -f4)
    print_result "Cancel Escalation Chain" "PASS" ""
    echo -e "${GREEN}   Status: $status${NC}"
  else
    print_result "Cancel Escalation Chain" "FAIL" "$response"
  fi
else
  print_result "Cancel Escalation Chain" "FAIL" "Could not create test chain"
fi
echo ""

# Test 8: Get Escalation Chains by Severity
echo -e "${BLUE}Test 8: GET /alert-escalation/severity/{severity} - Get Chains by Severity${NC}"
response=$(curl -s -X GET \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer test-token" \
  "$GOVERNANCE_ENDPOINT/alert-escalation/severity/CRITICAL")

if echo "$response" | grep -q '\['; then
  count=$(echo "$response" | grep -o '"id"' | wc -l)
  print_result "Get Chains by Severity" "PASS" ""
  echo -e "${GREEN}   Found $count CRITICAL chains${NC}"
else
  print_result "Get Chains by Severity" "FAIL" "$response"
fi
echo ""

# Test 9: Get Escalation Statistics
echo -e "${BLUE}Test 9: GET /alert-escalation/statistics - Get Statistics${NC}"
response=$(curl -s -X GET \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer test-token" \
  "$GOVERNANCE_ENDPOINT/alert-escalation/statistics")

if echo "$response" | grep -q '"activeChains"'; then
  active=$(echo "$response" | grep -o '"activeChains":[0-9]*' | cut -d':' -f2)
  pending=$(echo "$response" | grep -o '"pendingEscalations":[0-9]*' | cut -d':' -f2)
  escalated=$(echo "$response" | grep -o '"escalatedAlerts":[0-9]*' | cut -d':' -f2)
  print_result "Get Escalation Statistics" "PASS" ""
  echo -e "${GREEN}   Active: $active, Pending: $pending, Escalated: $escalated${NC}"
else
  print_result "Get Escalation Statistics" "FAIL" "$response"
fi
echo ""

echo -e "${YELLOW}================================${NC}"
echo -e "${YELLOW}Smoke Test Summary${NC}"
echo -e "${YELLOW}================================${NC}"
echo -e "${GREEN}✅ All endpoint smoke tests completed${NC}"
echo ""
echo "Note: Some tests may fail if the backend is not running or if test data doesn't exist."
echo "Make sure the backend is running on $API_BASE_URL before running this test."
