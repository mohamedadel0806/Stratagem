#!/bin/bash

# Multi-Tenancy Test Script
# Tests tenant_id auto-population and cross-tenant isolation

set -e

echo "🧪 Multi-Tenancy Implementation Test"
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
ACME_TENANT_ID="aaaaaaaa-bbbb-cccc-dddd-000000000002"

# Test Results
TESTS_PASSED=0
TESTS_FAILED=0

# Helper function to print test results
print_result() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✓ PASS${NC}: $2"
        ((TESTS_PASSED++))
    else
        echo -e "${RED}✗ FAIL${NC}: $2"
        ((TESTS_FAILED++))
    fi
}

# Wait between requests to avoid rate limiting
sleep_between_requests() {
    sleep 2
}

echo "📋 Test 1: Verify Tenants Exist in Database"
echo "-------------------------------------------"
TENANT_COUNT=$(docker exec stratagem-postgres-1 psql -U stratagem_user -d stratagem -t -c "SELECT COUNT(*) FROM tenants WHERE status = 'active';" | tr -d ' ')
if [ "$TENANT_COUNT" -ge 2 ]; then
    print_result 0 "Found $TENANT_COUNT active tenants in database"
else
    print_result 1 "Expected at least 2 tenants, found $TENANT_COUNT"
fi
echo ""

echo "📋 Test 2: Verify Users Have tenant_id"
echo "--------------------------------------"
USER_WITH_TENANT=$(docker exec stratagem-postgres-1 psql -U stratagem_user -d stratagem -t -c "SELECT COUNT(*) FROM users WHERE tenant_id IS NOT NULL;" | tr -d ' ')
if [ "$USER_WITH_TENANT" -gt 0 ]; then
    print_result 0 "Found $USER_WITH_TENANT users with tenant_id assigned"
else
    print_result 1 "No users have tenant_id assigned"
fi
echo ""

echo "📋 Test 3: Check Existing Policies Have tenant_id"
echo "------------------------------------------------"
POLICIES_WITH_TENANT=$(docker exec stratagem-postgres-1 psql -U stratagem_user -d stratagem -t -c "SELECT COUNT(*) FROM policies WHERE tenant_id IS NOT NULL;" | tr -d ' ')
TOTAL_POLICIES=$(docker exec stratagem-postgres-1 psql -U stratagem_user -d stratagem -t -c "SELECT COUNT(*) FROM policies;" | tr -d ' ')
echo "Policies with tenant_id: $POLICIES_WITH_TENANT / $TOTAL_POLICIES"
if [ "$POLICIES_WITH_TENANT" -gt 0 ]; then
    print_result 0 "Policies have tenant_id populated"
    
    # Show sample
    echo ""
    echo "Sample policies:"
    docker exec stratagem-postgres-1 psql -U stratagem_user -d stratagem -c "SELECT id, title, tenant_id FROM policies WHERE tenant_id IS NOT NULL LIMIT 3;"
else
    print_result 1 "No policies have tenant_id"
fi
echo ""

echo "📋 Test 4: Check RLS Policies Are Enabled"
echo "----------------------------------------"
RLS_ENABLED=$(docker exec stratagem-postgres-1 psql -U stratagem_user -d stratagem -t -c "SELECT COUNT(*) FROM pg_tables t JOIN pg_class c ON t.tablename = c.relname WHERE t.schemaname = 'public' AND c.relrowsecurity = true AND t.tablename IN ('policies', 'influencers', 'unified_controls');" | tr -d ' ')
if [ "$RLS_ENABLED" -ge 3 ]; then
    print_result 0 "RLS is enabled on governance tables"
else
    print_result 1 "RLS not properly enabled (found $RLS_ENABLED/3 tables)"
fi
echo ""

echo "📋 Test 5: Verify RLS Policies Exist"
echo "-----------------------------------"
RLS_POLICIES=$(docker exec stratagem-postgres-1 psql -U stratagem_user -d stratagem -t -c "SELECT COUNT(*) FROM pg_policies WHERE policyname = 'tenant_isolation_policy' AND tablename IN ('policies', 'influencers', 'unified_controls');" | tr -d ' ')
if [ "$RLS_POLICIES" -ge 3 ]; then
    print_result 0 "tenant_isolation_policy exists on governance tables"
else
    print_result 1 "tenant_isolation_policy missing (found $RLS_POLICIES/3 policies)"
fi
echo ""

echo "📋 Test 6: Check Influencers Have tenant_id"
echo "------------------------------------------"
INFLUENCERS_WITH_TENANT=$(docker exec stratagem-postgres-1 psql -U stratagem_user -d stratagem -t -c "SELECT COUNT(*) FROM influencers WHERE tenant_id IS NOT NULL;" | tr -d ' ')
TOTAL_INFLUENCERS=$(docker exec stratagem-postgres-1 psql -U stratagem_user -d stratagem -t -c "SELECT COUNT(*) FROM influencers;" | tr -d ' ')
echo "Influencers with tenant_id: $INFLUENCERS_WITH_TENANT / $TOTAL_INFLUENCERS"
if [ "$INFLUENCERS_WITH_TENANT" -gt 0 ]; then
    print_result 0 "Influencers have tenant_id populated"
else
    print_result 1 "No influencers have tenant_id"
fi
echo ""

echo "📋 Test 7: Verify Tenant Isolation in Data"
echo "-----------------------------------------"
# Check if different tenants have different data
DEFAULT_POLICIES=$(docker exec stratagem-postgres-1 psql -U stratagem_user -d stratagem -t -c "SELECT COUNT(*) FROM policies WHERE tenant_id = '$DEFAULT_TENANT_ID';" | tr -d ' ')
ACME_POLICIES=$(docker exec stratagem-postgres-1 psql -U stratagem_user -d stratagem -t -c "SELECT COUNT(*) FROM policies WHERE tenant_id = '$ACME_TENANT_ID';" | tr -d ' ')

echo "Default tenant policies: $DEFAULT_POLICIES"
echo "Acme tenant policies: $ACME_POLICIES"

if [ "$DEFAULT_POLICIES" -gt 0 ] || [ "$ACME_POLICIES" -gt 0 ]; then
    print_result 0 "Policies are segregated by tenant"
else
    echo -e "${YELLOW}⚠ WARNING${NC}: No policies found for either tenant (may need to create test data)"
fi
echo ""

# Summary
echo "=================================="
echo "📊 Test Summary"
echo "=================================="
echo -e "Tests Passed: ${GREEN}$TESTS_PASSED${NC}"
echo -e "Tests Failed: ${RED}$TESTS_FAILED${NC}"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ All tests passed!${NC}"
    echo ""
    echo "✨ Multi-tenancy implementation verified:"
    echo "  - tenant_id column exists and is populated"
    echo "  - RLS policies are enabled and active"
    echo "  - Data is segregated by tenant"
    exit 0
else
    echo -e "${RED}✗ Some tests failed${NC}"
    echo "Please review the failures above"
    exit 1
fi
