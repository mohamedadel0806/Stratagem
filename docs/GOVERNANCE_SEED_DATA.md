# Governance Module Seed Data

## Overview

The Governance Module seed script (`seed-governance.ts`) creates comprehensive test data for all Governance entities.

## Seed Command

```bash
cd backend
DB_HOST=localhost npm run seed:governance
```

## Seeded Data

### 1. Influencers (6)
- **NCA Cybersecurity Framework** - Regulatory (Saudi Arabia)
- **SAMA Cybersecurity Framework** - Regulatory (Saudi Arabia)
- **ADGM Data Protection Regulations** - Regulatory (UAE)
- **ISO 27001:2022** - Industry Standard (International)
- **PCI DSS v4.0** - Industry Standard (International)
- **GDPR** - Statutory (EU/EEA)

### 2. Policies (4)
- **Information Security Policy** (v2.1) - Linked to NCA, ISO 27001
- **Data Privacy and Protection Policy** (v1.5) - Linked to GDPR
- **Access Control Policy** (v2.2) - Linked to NCA, SAMA, ISO 27001
- **Password Management Policy** (v1.8) - Linked to NCA, ISO 27001

### 3. Control Objectives (6)
- **CO-IS-001**: Information asset classification (Implemented)
- **CO-IS-002**: Data encryption (Implemented)
- **CO-AC-001**: RBAC implementation (Implemented)
- **CO-AC-002**: Quarterly access reviews (In Progress)
- **CO-PM-001**: Strong password requirements (Implemented)
- **CO-PM-002**: MFA for privileged accounts (In Progress)

### 4. Unified Controls (6)
- **UCL-IAM-001**: Multi-Factor Authentication (In Progress)
- **UCL-ENC-001**: Data Encryption at Rest (Implemented)
- **UCL-ENC-002**: Data Encryption in Transit (Implemented)
- **UCL-AC-001**: Role-Based Access Control (Implemented)
- **UCL-LOG-001**: Security Event Logging (Implemented)
- **UCL-PW-001**: Password Policy Enforcement (Implemented)

### 5. Assessments (2)
- **ASSESS-2024-Q1**: Q1 2024 Security Controls Assessment (In Progress)
  - 3 controls selected
  - 1 control assessed
  - 1 high finding
  - Overall score: 75%
  
- **ASSESS-2024-ISO**: ISO 27001 Compliance Assessment (Completed)
  - All controls assessed
  - 2 high findings, 3 medium findings, 1 low finding
  - Overall score: 85%

### 6. Assessment Results (3)
- MFA Control: Partially Compliant (requires remediation)
- Encryption Control: Compliant
- RBAC Control: Compliant

### 7. Evidence (3)
- **EVID-2024-001**: MFA Configuration Screenshot (Approved)
- **EVID-2024-002**: Encryption Key Management Policy (Approved, Confidential)
- **EVID-2024-003**: Access Review Report Q1 2024 (Approved)

## Testing the APIs

### 1. Test Influencers API

```bash
# Get all influencers
curl -X GET http://localhost:3001/api/v1/governance/influencers \
  -H "Authorization: Bearer <token>"

# Get specific influencer
curl -X GET http://localhost:3001/api/v1/governance/influencers/<id> \
  -H "Authorization: Bearer <token>"
```

### 2. Test Policies API

```bash
# Get all policies
curl -X GET http://localhost:3001/api/v1/governance/policies \
  -H "Authorization: Bearer <token>"

# Get policy with control objectives
curl -X GET http://localhost:3001/api/v1/governance/policies/<id> \
  -H "Authorization: Bearer <token>"
```

### 3. Test Unified Controls API

```bash
# Get all controls
curl -X GET http://localhost:3001/api/v1/governance/unified-controls \
  -H "Authorization: Bearer <token>"

# Filter by status
curl -X GET "http://localhost:3001/api/v1/governance/unified-controls?status=active&implementation_status=implemented" \
  -H "Authorization: Bearer <token>"
```

### 4. Test Assessments API

```bash
# Get all assessments
curl -X GET http://localhost:3001/api/v1/governance/assessments \
  -H "Authorization: Bearer <token>"

# Get assessment with results
curl -X GET http://localhost:3001/api/v1/governance/assessments/<id> \
  -H "Authorization: Bearer <token>"

# Get assessment results
curl -X GET http://localhost:3001/api/v1/governance/assessments/<id>/results \
  -H "Authorization: Bearer <token>"
```

### 5. Test Evidence API

```bash
# Get all evidence
curl -X GET http://localhost:3001/api/v1/governance/evidence \
  -H "Authorization: Bearer <token>"

# Get evidence linked to a control
curl -X GET http://localhost:3001/api/v1/governance/evidence/linked/control/<control-id> \
  -H "Authorization: Bearer <token>"
```

## Frontend Testing

1. **Navigate to Influencers Page**
   - URL: `http://localhost:3000/en/dashboard/governance/influencers`
   - Should see 6 influencers
   - Test filters: category, status, applicability

2. **Navigate to Policies Page**
   - URL: `http://localhost:3000/en/dashboard/governance/policies`
   - Should see 4 policies
   - Test creating/editing policies
   - Test control objectives management

3. **Navigate to Controls Page**
   - URL: `http://localhost:3000/en/dashboard/governance/controls`
   - Should see 6 unified controls
   - Test filters: type, status, implementation status
   - Test creating/editing controls

## Re-seeding

To re-seed the data (delete and recreate):

1. Delete existing governance data from database
2. Run seed script again:
   ```bash
   DB_HOST=localhost npm run seed:governance
   ```

Or modify the seed script to skip the existence check.

## Data Relationships

- **Influencers → Policies**: Policies are linked to influencers via `linked_influencers` array
- **Policies → Control Objectives**: Control objectives belong to policies via `policy_id`
- **Control Objectives → Influencers**: Control objectives can be linked to influencers
- **Unified Controls**: Standalone controls that can be mapped to frameworks
- **Assessments → Controls**: Assessments select controls via `selected_control_ids`
- **Assessment Results → Controls**: Results link to specific controls
- **Evidence → Controls/Assessments**: Evidence can be linked via `evidence_linkages` table

## Next Steps for Testing

1. ✅ Seed data completed
2. ⏭️ Test API endpoints with Postman/curl
3. ⏭️ Test frontend pages
4. ⏭️ Test CRUD operations
5. ⏭️ Test relationships and linkages
6. ⏭️ Test filters and search
7. ⏭️ Test pagination





