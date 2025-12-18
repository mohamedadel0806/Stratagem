# Risk Assessment Requests Seed Data

## Overview

The Assessment Requests seed script (`seed-assessment-requests.ts`) creates comprehensive test data for Risk Assessment Requests with various statuses and scenarios.

## Seed Command

```bash
cd backend
npm run seed:assessment-requests
```

Or with custom database settings:

```bash
DB_HOST=localhost npm run seed:assessment-requests
```

## Prerequisites

Before running the seed script, ensure you have:

1. **Users seeded** - Run `npm run seed` to create users
2. **Risks seeded** - Run `npm run seed:risks` to create risks
3. **Database migrations** - Ensure all migrations are run, especially `CreateRiskAssessmentRequestsTable`

## Seeded Data

The script creates **15+ assessment requests** with:

### Status Distribution:
- **Pending** - Requests awaiting approval or assignment
- **Approved** - Requests approved and ready to start
- **In Progress** - Requests actively being worked on
- **Completed** - Requests that have been completed with linked assessments
- **Rejected** - Requests that were rejected with reasons
- **Cancelled** - Requests that were cancelled

### Assessment Types:
- **Inherent Risk** - Baseline assessments before controls
- **Current Risk** - Assessments with current controls in place
- **Target Risk** - Assessments for desired future state

### Priority Levels:
- **Critical** - Urgent requests requiring immediate attention
- **High** - Important requests with short deadlines
- **Medium** - Standard priority requests
- **Low** - Routine requests with flexible deadlines

## Sample Request Scenarios

### 1. Pending Requests (High Priority)
- **Justification**: Risk landscape has changed significantly
- **Due Date**: 15 days from now
- **Assignment**: Assigned to assessor
- **Notes**: Instructions for completion

### 2. Approved Requests (Medium Priority)
- **Status**: Approved by manager
- **Due Date**: 30 days from now
- **Ready**: Ready to start work

### 3. In Progress Requests
- **Status**: Currently being worked on
- **Priority**: High/Critical
- **Progress**: Assessment in progress

### 4. Completed Requests
- **Status**: Completed
- **Linked Assessment**: Connected to resulting risk assessment
- **Date**: Completed within last 14 days

### 5. Rejected Requests
- **Status**: Rejected
- **Rejection Reason**: Detailed explanation
- **Example**: "Insufficient business justification provided"

### 6. Cancelled Requests
- **Status**: Cancelled
- **Reason**: Risk closure or changed requirements

## Request Identifier Format

All requests follow the format: `REQ-YYYYMM-XXXX`

Example: `REQ-202501-0001`, `REQ-202501-0002`, etc.

## Features

### Request Assignment
- Some requests are assigned to specific assessors
- Others remain unassigned (pending assignment)
- Assignees are randomly selected from existing users

### Due Dates
- Various due dates from 3 days to 60 days in the future
- Some requests have no due date

### Workflow Integration
- Approved requests have approval timestamps
- Rejected requests include rejection reasons
- Completed requests link to actual risk assessments

### Relationships
- All requests are linked to existing risks
- Completed requests link to matching assessments
- Requests reference requesting users and assigned assessors

## Usage in Testing

This seed data is useful for:

1. **Development Testing** - Test the assessment request workflow
2. **UI Testing** - Verify list views, filters, and status displays
3. **Workflow Testing** - Test approval/rejection/cancellation flows
4. **Integration Testing** - Test request-to-assessment linking
5. **Performance Testing** - Test with realistic data volumes

## Reseeding

The script checks for existing requests and skips seeding if any exist. To reseed:

```sql
-- Option 1: Delete all assessment requests
DELETE FROM risk_assessment_requests;

-- Option 2: Truncate table (resets sequence)
TRUNCATE TABLE risk_assessment_requests CASCADE;
```

Then run the seed script again.

## Output Example

```
Connecting to database: localhost:5432/grc_platform
Database connection established

Found 10 users, 8 risks

📋 Seeding Assessment Requests...

  ✓ Created request: REQ-202501-0001 (pending) for risk: Data Breach from Unauthorized Access...
  ✓ Created request: REQ-202501-0002 (approved) for risk: Third-Party Vendor Data Leak...
  ✓ Created request: REQ-202501-0003 (in_progress) for risk: Regulatory Non-Compliance Penalties...
  ...

📊 Creating additional requests with varied statuses...

  ✓ Created pending request: REQ-202501-0011
  ✓ Created pending request: REQ-202501-0012
  ...

✅ Created 15 assessment requests

Summary by status:
  - pending: 6
  - approved: 3
  - in_progress: 2
  - completed: 1
  - rejected: 1
  - cancelled: 1

Summary by assessment type:
  - current: 8
  - inherent: 4
  - target: 3

Summary by priority:
  - high: 5
  - medium: 6
  - low: 2
  - critical: 2

🎉 Assessment Requests seeding completed successfully!
```

## Integration with Other Seed Scripts

The assessment requests seed script works well with:

- `seed.ts` - Provides users
- `seed:risks` - Provides risks to link requests to
- `seed:governance` - Provides controls that may be referenced

Run in order:
```bash
npm run seed                    # Users
npm run seed:governance         # Controls, policies
npm run seed:risks              # Risks, assessments, treatments
npm run seed:assessment-requests # Assessment requests
```

