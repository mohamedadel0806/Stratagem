# Governance Module Testing Guide

## Prerequisites

All services are running via Docker Compose. Verify services are up:

```bash
docker-compose ps
```

Expected services:
- ✅ `backend` (port 3001)
- ✅ `frontend` (port 3000)
- ✅ `postgres` (port 5432)
- ✅ `keycloak` (port 8080)

## Data Status

✅ **All Governance data is seeded:**
- 6 Influencers
- 28 Policies (includes Governance-enhanced)
- 6 Control Objectives
- 6 Unified Controls
- 2 Assessments
- 3 Assessment Results
- 3 Evidence Items

## Testing Backend APIs

### 1. Get Authentication Token

First, authenticate to get a JWT token:

```bash
# Login via Keycloak or your auth endpoint
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@grcplatform.com",
    "password": "password123"
  }'
```

Save the token from the response.

### 2. Test Influencers API

```bash
# Get all influencers
curl -X GET http://localhost:3001/api/v1/governance/influencers \
  -H "Authorization: Bearer <YOUR_TOKEN>"

# Get specific influencer
curl -X GET http://localhost:3001/api/v1/governance/influencers/<ID> \
  -H "Authorization: Bearer <YOUR_TOKEN>"

# Filter by category
curl -X GET "http://localhost:3001/api/v1/governance/influencers?category=regulatory" \
  -H "Authorization: Bearer <YOUR_TOKEN>"
```

**Expected:** Should return 6 influencers

### 3. Test Policies API

```bash
# Get all policies
curl -X GET http://localhost:3001/api/v1/governance/policies \
  -H "Authorization: Bearer <YOUR_TOKEN>"

# Get policy with control objectives
curl -X GET http://localhost:3001/api/v1/governance/policies/<ID> \
  -H "Authorization: Bearer <YOUR_TOKEN>"

# Filter by status
curl -X GET "http://localhost:3001/api/v1/governance/policies?status=active" \
  -H "Authorization: Bearer <YOUR_TOKEN>"
```

**Expected:** Should return policies with Governance fields

### 4. Test Control Objectives API

```bash
# Get control objectives for a policy
curl -X GET "http://localhost:3001/api/v1/governance/control-objectives?policy_id=<POLICY_ID>" \
  -H "Authorization: Bearer <YOUR_TOKEN>"

# Get all control objectives
curl -X GET http://localhost:3001/api/v1/governance/control-objectives \
  -H "Authorization: Bearer <YOUR_TOKEN>"
```

**Expected:** Should return 6 control objectives

### 5. Test Unified Controls API

```bash
# Get all unified controls
curl -X GET http://localhost:3001/api/v1/governance/unified-controls \
  -H "Authorization: Bearer <YOUR_TOKEN>"

# Get specific control
curl -X GET http://localhost:3001/api/v1/governance/unified-controls/<ID> \
  -H "Authorization: Bearer <YOUR_TOKEN>"

# Filter by status and implementation
curl -X GET "http://localhost:3001/api/v1/governance/unified-controls?status=active&implementation_status=implemented" \
  -H "Authorization: Bearer <YOUR_TOKEN>"
```

**Expected:** Should return 6 unified controls

### 6. Test Assessments API

```bash
# Get all assessments
curl -X GET http://localhost:3001/api/v1/governance/assessments \
  -H "Authorization: Bearer <YOUR_TOKEN>"

# Get assessment with results
curl -X GET http://localhost:3001/api/v1/governance/assessments/<ID> \
  -H "Authorization: Bearer <YOUR_TOKEN>"

# Get assessment results
curl -X GET http://localhost:3001/api/v1/governance/assessments/<ID>/results \
  -H "Authorization: Bearer <YOUR_TOKEN>"
```

**Expected:** Should return 2 assessments with 3 results

### 7. Test Evidence API

```bash
# Get all evidence
curl -X GET http://localhost:3001/api/v1/governance/evidence \
  -H "Authorization: Bearer <YOUR_TOKEN>"

# Get evidence linked to a control
curl -X GET http://localhost:3001/api/v1/governance/evidence/linked/control/<CONTROL_ID> \
  -H "Authorization: Bearer <YOUR_TOKEN>"
```

**Expected:** Should return 3 evidence items

## Testing via Docker Container

### Test from Backend Container

```bash
# Execute commands inside backend container
docker-compose exec backend sh

# Inside container, you can test with curl or use Node.js
```

### Run Seed Script from Container

```bash
# Run seed script inside backend container
docker-compose exec backend npm run seed:governance

# Check data
docker-compose exec backend npm run check:governance
```

## Testing Frontend

### 1. Access Frontend

Open browser: `http://localhost:3000`

### 2. Navigate to Governance Pages

- **Influencers**: `http://localhost:3000/en/dashboard/governance/influencers`
  - Should show 6 influencers
  - Test filters: category, status, applicability
  - Test create/edit/delete

- **Policies**: `http://localhost:3000/en/dashboard/governance/policies`
  - Should show policies
  - Test creating new policy
  - Test adding control objectives
  - Test version control

- **Unified Controls**: `http://localhost:3000/en/dashboard/governance/controls`
  - Should show 6 unified controls
  - Test filters: type, status, implementation
  - Test create/edit/delete

### 3. Test CRUD Operations

1. **Create New Influencer**
   - Click "Add Influencer"
   - Fill form (NCA, SAMA, ISO, etc.)
   - Submit and verify it appears in list

2. **Edit Policy**
   - Click edit on a policy
   - Update content or status
   - Verify changes saved

3. **Add Control Objective**
   - Open a policy
   - Add control objective
   - Verify it links to policy

4. **Create Unified Control**
   - Click "Add Control"
   - Fill form with control details
   - Submit and verify

## Quick Test Script

Create a test script to verify all endpoints:

```bash
#!/bin/bash

# Set your token here
TOKEN="<YOUR_JWT_TOKEN>"
BASE_URL="http://localhost:3001/api/v1/governance"

echo "Testing Governance APIs..."
echo ""

echo "1. Testing Influencers..."
curl -s -X GET "$BASE_URL/influencers" \
  -H "Authorization: Bearer $TOKEN" | jq '.meta.total'
echo ""

echo "2. Testing Policies..."
curl -s -X GET "$BASE_URL/policies" \
  -H "Authorization: Bearer $TOKEN" | jq '.meta.total'
echo ""

echo "3. Testing Unified Controls..."
curl -s -X GET "$BASE_URL/unified-controls" \
  -H "Authorization: Bearer $TOKEN" | jq '.meta.total'
echo ""

echo "4. Testing Assessments..."
curl -s -X GET "$BASE_URL/assessments" \
  -H "Authorization: Bearer $TOKEN" | jq '.data | length'
echo ""

echo "5. Testing Evidence..."
curl -s -X GET "$BASE_URL/evidence" \
  -H "Authorization: Bearer $TOKEN" | jq '.data | length'
echo ""

echo "✅ All API tests completed!"
```

## Expected Results

| Endpoint | Expected Count |
|----------|----------------|
| `/governance/influencers` | 6 |
| `/governance/policies` | 28 (includes old + new) |
| `/governance/control-objectives` | 6 |
| `/governance/unified-controls` | 6 |
| `/governance/assessments` | 2 |
| `/governance/assessments/{id}/results` | 3 (total) |
| `/governance/evidence` | 3 |

## Troubleshooting

### Backend Not Responding

```bash
# Check backend logs
docker-compose logs backend

# Restart backend
docker-compose restart backend
```

### Database Connection Issues

```bash
# Check postgres is running
docker-compose ps postgres

# Check database connection from backend
docker-compose exec backend npm run check:governance
```

### Frontend Not Loading

```bash
# Check frontend logs
docker-compose logs frontend

# Restart frontend
docker-compose restart frontend
```

## Next Steps

1. ✅ Verify all APIs return expected data
2. ✅ Test frontend pages load correctly
3. ✅ Test CRUD operations
4. ⏭️ Test relationships (policies → control objectives, assessments → controls)
5. ⏭️ Test filters and search
6. ⏭️ Test pagination
7. ⏭️ Test file uploads for evidence




