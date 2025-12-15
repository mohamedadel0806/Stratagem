#!/bin/bash

# Test remediation tracking API

LOGIN_URL="http://localhost:3001/auth/login"
API_BASE="http://localhost:3001/api/v1"

# Default test credentials
EMAIL="admin@example.com"
PASSWORD="Admin@123456"

echo "🔐 Testing Remediation Tracking API"
echo "======================================"
echo ""

# Login to get JWT token
echo "1️⃣ Logging in as $EMAIL..."
LOGIN_RESPONSE=$(curl -s -X POST "$LOGIN_URL" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}")

TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.accessToken // .token // empty' 2>/dev/null)

if [ -z "$TOKEN" ]; then
  echo "❌ Login failed. Response:"
  echo $LOGIN_RESPONSE | jq . 2>/dev/null || echo $LOGIN_RESPONSE
  exit 1
fi

echo "✅ Login successful!"
echo "Token: ${TOKEN:0:20}..."
echo ""

# Test remediation dashboard endpoint
echo "2️⃣ Fetching remediation dashboard..."
DASHBOARD_RESPONSE=$(curl -s -X GET "$API_BASE/governance/remediation/dashboard" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json")

# Check if response contains expected fields
if echo $DASHBOARD_RESPONSE | jq -e '.total_open_findings' > /dev/null 2>&1; then
  echo "✅ Remediation dashboard API is working!"
  echo ""
  echo "Dashboard Response:"
  echo $DASHBOARD_RESPONSE | jq . 2>/dev/null
else
  echo "❌ Remediation dashboard API failed:"
  echo $DASHBOARD_RESPONSE | jq . 2>/dev/null || echo $DASHBOARD_RESPONSE
fi
