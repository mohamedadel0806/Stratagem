#!/bin/bash

# Simple Post-Deployment Validation Script
# Run this after every deployment to ensure everything is working

echo "🔍 Post-Deployment Validation"
echo "============================"
echo ""

PASSED=0
FAILED=0

check_service() {
    local service=$1
    echo -n "Checking $service... "

    if docker compose -f docker-compose.prod.yml ps $service | grep -q "Up"; then
        echo "✅ UP"
        ((PASSED++))
    else
        echo "❌ DOWN"
        ((FAILED++))
    fi
}

check_endpoint() {
    local url=$1
    local expected_code=$2
    local description=$3

    echo -n "Testing $description... "

    local actual_code=$(curl -k -s -o /dev/null -w '%{http_code}' "$url" 2>/dev/null)

    if [ "$actual_code" = "$expected_code" ]; then
        echo "✅ $expected_code"
        ((PASSED++))
    else
        echo "❌ $actual_code (expected $expected_code)"
        ((FAILED++))
    fi
}

# Check services
echo "🐳 Service Status:"
check_service "backend"
check_service "frontend"
check_service "kong"
check_service "postgres"
check_service "mongodb"
check_service "redis"
echo ""

# Check endpoints
echo "🌐 API Endpoints:"
check_endpoint "https://grc-staging.newmehub.com/api/health/ready" "200" "Kong Health"
check_endpoint "https://grc-staging.newmehub.com/api/dashboard/overview" "401" "Kong Auth"
check_endpoint "https://grc-staging.newmehub.com/" "200" "Frontend"
echo ""

# Summary
echo "📊 Results:"
echo "✅ Passed: $PASSED"
echo "❌ Failed: $FAILED"

if [ $FAILED -eq 0 ]; then
    echo "🎉 ALL CHECKS PASSED!"
    exit 0
else
    echo "⚠️  SOME CHECKS FAILED!"
    exit 1
fi