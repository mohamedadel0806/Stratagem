# Governance Module - Docker Testing Guide

## Quick Start

All services run via Docker Compose. The Governance module is fully seeded and ready for testing.

## Verify Services

```bash
# Check all services are running
docker-compose ps

# Check backend logs
docker-compose logs backend --tail 50

# Check frontend logs  
docker-compose logs frontend --tail 50
```

## Data Verification

Verify seeded data from Docker:

```bash
# Check governance data (from inside backend container)
docker-compose exec backend sh -c "DB_HOST=postgres npm run check:governance"
```

**Expected Output:**
- ✅ 6 Influencers
- ✅ 28 Policies (Governance-enhanced)
- ✅ 6 Control Objectives
- ✅ 6 Unified Controls
- ✅ 2 Assessments
- ✅ 3 Assessment Results
- ✅ 3 Evidence Items

## Testing APIs

### 1. Get Authentication Token

```bash
# Login to get JWT token
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@grcplatform.com",
    "password": "password123"
  }'

# Save the token from response
export GOVERNANCE_TEST_TOKEN="<token-from-response>"
```

### 2. Run Automated Tests

```bash
# Run the test script
./scripts/test-governance-apis.sh
```

### 3. Manual API Testing

```bash
# Set your token
TOKEN="<your-jwt-token>"

# Test Influencers
curl -X GET http://localhost:3001/api/v1/governance/influencers \
  -H "Authorization: Bearer $TOKEN" | jq

# Test Policies
curl -X GET http://localhost:3001/api/v1/governance/policies \
  -H "Authorization: Bearer $TOKEN" | jq

# Test Unified Controls
curl -X GET http://localhost:3001/api/v1/governance/unified-controls \
  -H "Authorization: Bearer $TOKEN" | jq

# Test Assessments
curl -X GET http://localhost:3001/api/v1/governance/assessments \
  -H "Authorization: Bearer $TOKEN" | jq
```

## Testing Frontend

### Access Frontend

Open browser: **http://localhost:3000**

### Navigate to Governance Pages

1. **Influencers**: `http://localhost:3000/en/dashboard/governance/influencers`
   - Should display 6 influencers
   - Test: Create, Edit, Delete, Filter

2. **Policies**: `http://localhost:3000/en/dashboard/governance/policies`
   - Should display policies with Governance fields
   - Test: Create policy, Add control objectives, Version control

3. **Unified Controls**: `http://localhost:3000/en/dashboard/governance/controls`
   - Should display 6 unified controls
   - Test: Create, Edit, Filter by status/type

## Docker Commands Reference

### Run Seed Script

```bash
# Seed governance data (if needed)
docker-compose exec backend sh -c "DB_HOST=postgres npm run seed:governance"

# Check data status
docker-compose exec backend sh -c "DB_HOST=postgres npm run check:governance"
```

### Run Migrations

```bash
# Run migrations (if needed)
docker-compose exec backend sh -c "DB_HOST=postgres npm run migrate"
```

### View Logs

```bash
# Backend logs
docker-compose logs -f backend

# Frontend logs
docker-compose logs -f frontend

# All logs
docker-compose logs -f
```

### Restart Services

```bash
# Restart backend
docker-compose restart backend

# Restart frontend
docker-compose restart frontend

# Restart all
docker-compose restart
```

## Testing Checklist

### Backend APIs
- [ ] Influencers API returns 6 items
- [ ] Policies API returns policies with Governance fields
- [ ] Control Objectives API returns 6 items
- [ ] Unified Controls API returns 6 items
- [ ] Assessments API returns 2 items
- [ ] Assessment Results API returns 3 items
- [ ] Evidence API returns 3 items
- [ ] Filters work correctly
- [ ] Pagination works
- [ ] Create operations work
- [ ] Update operations work
- [ ] Delete operations work

### Frontend Pages
- [ ] Influencers page loads and displays data
- [ ] Policies page loads and displays data
- [ ] Controls page loads and displays data
- [ ] Forms work for create/edit
- [ ] Filters work
- [ ] Pagination works
- [ ] Navigation between pages works

### Relationships
- [ ] Policies link to influencers
- [ ] Control objectives link to policies
- [ ] Assessments link to controls
- [ ] Assessment results link to controls
- [ ] Evidence can be linked to controls

## Troubleshooting

### Backend Not Starting

```bash
# Check backend logs
docker-compose logs backend

# Check if database is accessible
docker-compose exec backend sh -c "DB_HOST=postgres npm run check:governance"
```

### Database Connection Issues

```bash
# Verify postgres is running
docker-compose ps postgres

# Check database from backend container
docker-compose exec backend sh -c "DB_HOST=postgres npm run check:governance"
```

### Frontend Not Loading

```bash
# Check frontend logs
docker-compose logs frontend

# Verify frontend container is running
docker-compose ps frontend
```

### API Returns 401 (Unauthorized)

- Verify you have a valid JWT token
- Check token hasn't expired
- Ensure Authorization header is set correctly

### API Returns 404 (Not Found)

- Verify backend is running: `docker-compose ps backend`
- Check API route is correct
- Verify Governance module is registered in `app.module.ts`

## Next Steps

1. ✅ Verify all APIs work
2. ✅ Test frontend pages
3. ⏭️ Test CRUD operations
4. ⏭️ Test relationships and linkages
5. ⏭️ Test file uploads for evidence
6. ⏭️ Test assessment execution workflow





