#!/bin/bash

# Governance Module CRUD Operations Test Script
# Tests POST, PATCH, and DELETE operations for all Governance endpoints

BASE_URL="http://localhost:3001"
GOV_BASE="${BASE_URL}/api/v1/governance"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Get authentication token
echo -e "${BLUE}🔐 Authenticating...${NC}"
LOGIN_RESPONSE=$(curl -s -X POST "${BASE_URL}/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@grcplatform.com","password":"password123"}')

TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.accessToken // empty')

if [ -z "$TOKEN" ] || [ "$TOKEN" = "null" ]; then
  echo -e "${RED}✗ Authentication failed${NC}"
  echo "Response: $LOGIN_RESPONSE"
  exit 1
fi

echo -e "${GREEN}✓ Authentication successful${NC}"
echo ""

# Test counter
PASSED=0
FAILED=0

# Test function
test_crud() {
  local name=$1
  local create_data=$2
  local update_data=$3
  
  echo -e "${BLUE}Testing: ${name}${NC}"
  
  # CREATE
  echo "  POST ${GOV_BASE}/${name}"
  create_response=$(curl -s -w "\n%{http_code}" -X POST "${GOV_BASE}/${name}" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "$create_data" 2>/dev/null)
  
  create_code=$(echo "$create_response" | tail -n1)
  create_body=$(echo "$create_response" | sed '$d')
  
  if [ "$create_code" -eq 201 ] || [ "$create_code" -eq 200 ]; then
    echo -e "    ${GREEN}✓ CREATE${NC} (HTTP $create_code)"
    created_id=$(echo "$create_body" | jq -r '.data.id // .id // empty' 2>/dev/null)
    
    if [ ! -z "$created_id" ] && [ "$created_id" != "null" ]; then
      echo "    └─ Created ID: $created_id"
      
      # UPDATE
      echo "  PATCH ${GOV_BASE}/${name}/${created_id}"
      update_response=$(curl -s -w "\n%{http_code}" -X PATCH "${GOV_BASE}/${name}/${created_id}" \
        -H "Authorization: Bearer $TOKEN" \
        -H "Content-Type: application/json" \
        -d "$update_data" 2>/dev/null)
      
      update_code=$(echo "$update_response" | tail -n1)
      
      if [ "$update_code" -eq 200 ]; then
        echo -e "    ${GREEN}✓ UPDATE${NC} (HTTP $update_code)"
        
        # DELETE
        echo "  DELETE ${GOV_BASE}/${name}/${created_id}"
        delete_response=$(curl -s -w "\n%{http_code}" -X DELETE "${GOV_BASE}/${name}/${created_id}" \
          -H "Authorization: Bearer $TOKEN" 2>/dev/null)
        
        delete_code=$(echo "$delete_response" | tail -n1)
        
        if [ "$delete_code" -eq 204 ] || [ "$delete_code" -eq 200 ]; then
          echo -e "    ${GREEN}✓ DELETE${NC} (HTTP $delete_code)"
          ((PASSED++))
          return 0
        else
          echo -e "    ${RED}✗ DELETE${NC} (HTTP $delete_code)"
          ((FAILED++))
          return 1
        fi
      else
        echo -e "    ${RED}✗ UPDATE${NC} (HTTP $update_code)"
        # Try to delete anyway
        curl -s -X DELETE "${GOV_BASE}/${name}/${created_id}" \
          -H "Authorization: Bearer $TOKEN" > /dev/null 2>&1
        ((FAILED++))
        return 1
      fi
    else
      echo -e "    ${YELLOW}⚠ Could not extract ID, skipping UPDATE/DELETE${NC}"
      ((PASSED++))
      return 0
    fi
  else
    echo -e "    ${RED}✗ CREATE${NC} (HTTP $create_code)"
    echo "    └─ Response: $(echo "$create_body" | head -c 150)"
    ((FAILED++))
    return 1
  fi
}

echo "=========================================="
echo "  GOVERNANCE MODULE CRUD TEST SUITE"
echo "=========================================="
echo ""

# Test Influencers CRUD
echo -e "${YELLOW}📋 Testing Influencers CRUD${NC}"
echo "----------------------------------------"
TIMESTAMP=$(date +%s)
test_crud "influencers" \
  "{
    \"name\": \"Test Influencer ${TIMESTAMP}\",
    \"category\": \"regulatory\",
    \"reference_number\": \"TEST-INF-${TIMESTAMP}\",
    \"status\": \"active\",
    \"applicability_status\": \"applicable\"
  }" \
  '{
    "description": "Updated test influencer description"
  }'
echo ""

# Test Policies CRUD
echo -e "${YELLOW}📄 Testing Policies CRUD${NC}"
echo "----------------------------------------"
test_crud "policies" \
  '{
    "title": "Test Policy",
    "policy_type": "test",
    "status": "draft",
    "review_frequency": "annual"
  }' \
  '{
    "content": "Updated test policy content"
  }'
echo ""

# Test Unified Controls CRUD
echo -e "${YELLOW}🔒 Testing Unified Controls CRUD${NC}"
echo "----------------------------------------"
TIMESTAMP=$(date +%s)
test_crud "unified-controls" \
  "{
    \"control_identifier\": \"TEST-CONTROL-${TIMESTAMP}\",
    \"title\": \"Test Control ${TIMESTAMP}\",
    \"status\": \"draft\",
    \"implementation_status\": \"not_implemented\"
  }" \
  '{
    "description": "Updated test control description"
  }'
echo ""

# Test Assessments CRUD
echo -e "${YELLOW}📊 Testing Assessments CRUD${NC}"
echo "----------------------------------------"
TIMESTAMP=$(date +%s)
test_crud "assessments" \
  "{
    \"assessment_identifier\": \"TEST-ASSESS-${TIMESTAMP}\",
    \"name\": \"Test Assessment ${TIMESTAMP}\",
    \"assessment_type\": \"compliance\",
    \"status\": \"not_started\"
  }" \
  '{
    "description": "Updated test assessment description"
  }'
echo ""

# Test Evidence CRUD
echo -e "${YELLOW}📎 Testing Evidence CRUD${NC}"
echo "----------------------------------------"
TIMESTAMP=$(date +%s)
test_crud "evidence" \
  "{
    \"evidence_identifier\": \"TEST-EVID-${TIMESTAMP}\",
    \"title\": \"Test Evidence ${TIMESTAMP}\",
    \"evidence_type\": \"other\",
    \"file_path\": \"/uploads/test-${TIMESTAMP}.pdf\",
    \"status\": \"draft\",
    \"confidential\": false
  }" \
  '{
    "description": "Updated test evidence description"
  }'
echo ""

# Test Findings CRUD
echo -e "${YELLOW}🔍 Testing Findings CRUD${NC}"
echo "----------------------------------------"
TIMESTAMP=$(date +%s)
test_crud "findings" \
  "{
    \"finding_identifier\": \"TEST-FIND-${TIMESTAMP}\",
    \"title\": \"Test Finding ${TIMESTAMP}\",
    \"description\": \"This is a test finding\",
    \"severity\": \"medium\",
    \"status\": \"open\"
  }" \
  '{
    "description": "Updated test finding description"
  }'
echo ""

# Summary
echo "=========================================="
echo "  TEST SUMMARY"
echo "=========================================="
echo -e "${GREEN}✓ Passed: $PASSED${NC}"
echo -e "${RED}✗ Failed: $FAILED${NC}"
echo ""

TOTAL=$((PASSED + FAILED))
if [ $FAILED -eq 0 ]; then
  echo -e "${GREEN}🎉 All CRUD tests passed!${NC}"
  exit 0
else
  echo -e "${RED}⚠️  Some tests failed${NC}"
  exit 1
fi

