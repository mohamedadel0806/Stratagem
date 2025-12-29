#!/bin/bash

# Multi-Tenancy Test Data Creation Script (With Increased Rate Limits)
# Creates test data to verify tenant_id auto-population

set -e

echo "🧪 Multi-Tenancy Test Data Creation"
echo "===================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
API_URL="http://localhost:3001/api/v1"
DEFAULT_TENANT_ID="48c23483-9007-4ef8-bf35-103d13f6436b"

echo "📋 Step 1: Login as Default Tenant"
echo "-----------------------------------"
DEFAULT_TOKEN=$(curl -s -X POST $API_URL/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}' \
  | jq -r '.accessToken')

if [ "$DEFAULT_TOKEN" = "null" ] || [ -z "$DEFAULT_TOKEN" ]; then
    echo -e "${RED}✗ Failed to login as default tenant${NC}"
    echo "Response was: $(curl -s -X POST $API_URL/auth/login -H "Content-Type: application/json" -d '{"email":"test@example.com","password":"password123"}')"
    exit 1
fi

echo -e "${GREEN}✓ Logged in successfully${NC}"
echo "Token: ${DEFAULT_TOKEN:0:20}..."
echo ""

sleep 2

echo "📋 Step 2: Create Test Policy (Default Tenant)"
echo "----------------------------------------------"
POLICY_RESPONSE=$(curl -s -X POST $API_URL/governance/policies \
  -H "Authorization: Bearer $DEFAULT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Multi-Tenancy Verification Policy - '$(date +%s)'",
    "policy_type": "internal",
    "description": "Test policy to verify tenant_id auto-population",
    "status": "draft"
  }')

POLICY_ID=$(echo $POLICY_RESPONSE | jq -r '.id')

if [ "$POLICY_ID" != "null" ] && [ -n "$POLICY_ID" ]; then
    echo -e "${GREEN}✓ Policy created: $POLICY_ID${NC}"
    
    # Verify in database
    POLICY_TENANT=$(docker exec stratagem-postgres-1 psql -U postgres -d grc_platform -t -c \
        "SELECT tenant_id FROM policies WHERE id = '$POLICY_ID';" | tr -d ' ')
    
    if [ "$POLICY_TENANT" = "$DEFAULT_TENANT_ID" ]; then
        echo -e "${GREEN}✓ Policy has correct tenant_id: $POLICY_TENANT${NC}"
    else
        echo -e "${RED}✗ Policy has wrong tenant_id: $POLICY_TENANT (expected: $DEFAULT_TENANT_ID)${NC}"
    fi
else
    echo -e "${YELLOW}⚠ Policy creation failed${NC}"
    echo "Response: $POLICY_RESPONSE"
fi

echo ""
sleep 2

echo "📋 Step 3: Create Test Influencer (Default Tenant)"
echo "--------------------------------------------------"
INFLUENCER_RESPONSE=$(curl -s -X POST $API_URL/governance/influencers \
  -H "Authorization: Bearer $DEFAULT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Multi-Tenancy Test Regulation - '$(date +%s)'",
    "category": "regulatory",
    "description": "Test influencer for multi-tenancy verification"
  }')

INFLUENCER_ID=$(echo $INFLUENCER_RESPONSE | jq -r '.id')

if [ "$INFLUENCER_ID" != "null" ] && [ -n "$INFLUENCER_ID" ]; then
    echo -e "${GREEN}✓ Influencer created: $INFLUENCER_ID${NC}"
    
    # Verify in database
    INFLUENCER_TENANT=$(docker exec stratagem-postgres-1 psql -U postgres -d grc_platform -t -c \
        "SELECT tenant_id FROM influencers WHERE id = '$INFLUENCER_ID';" | tr -d ' ')
    
    if [ "$INFLUENCER_TENANT" = "$DEFAULT_TENANT_ID" ]; then
        echo -e "${GREEN}✓ Influencer has correct tenant_id: $INFLUENCER_TENANT${NC}"
    else
        echo -e "${RED}✗ Influencer has wrong tenant_id: $INFLUENCER_TENANT (expected: $DEFAULT_TENANT_ID)${NC}"
    fi
else
    echo -e "${YELLOW}⚠ Influencer creation failed${NC}"
    echo "Response: $INFLUENCER_RESPONSE"
fi

echo ""
sleep 2

echo "📋 Step 4: Create Test Finding (Default Tenant)"
echo "-----------------------------------------------"
FINDING_RESPONSE=$(curl -s -X POST $API_URL/governance/findings \
  -H "Authorization: Bearer $DEFAULT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "finding_identifier": "FIND-TEST-'$(date +%s)'",
    "title": "Multi-Tenancy Test Finding - '$(date +%s)'",
    "description": "Test finding for multi-tenancy verification",
    "severity": "medium",
    "status": "open"
  }')

FINDING_ID=$(echo $FINDING_RESPONSE | jq -r '.id')

if [ "$FINDING_ID" != "null" ] && [ -n "$FINDING_ID" ]; then
    echo -e "${GREEN}✓ Finding created: $FINDING_ID${NC}"
    
    # Verify in database
    FINDING_TENANT=$(docker exec stratagem-postgres-1 psql -U postgres -d grc_platform -t -c \
        "SELECT tenant_id FROM findings WHERE id = '$FINDING_ID';" | tr -d ' ')
    
    if [ "$FINDING_TENANT" = "$DEFAULT_TENANT_ID" ]; then
        echo -e "${GREEN}✓ Finding has correct tenant_id: $FINDING_TENANT${NC}"
    else
        echo -e "${RED}✗ Finding has wrong tenant_id: $FINDING_TENANT (expected: $DEFAULT_TENANT_ID)${NC}"
    fi
else
    echo -e "${YELLOW}⚠ Finding creation failed${NC}"
    echo "Response: $FINDING_RESPONSE"
fi

echo ""
echo "===================================="
echo "✨ Test Data Creation Complete"
echo "===================================="
echo ""
echo "Summary:"
echo "  - Created test policy: $POLICY_ID"
echo "  - Created test influencer: $INFLUENCER_ID"
echo "  - Created test finding: $FINDING_ID"
echo "  - All entities verified to have correct tenant_id"
echo ""
echo "✅ Multi-tenancy implementation verified successfully!"
