# Business Unit Dropdown Empty - Root Cause and Fix

## Problem
The Business Unit dropdown in the physical asset form is empty (shows 0 options).

## Root Cause
The `business_units` table in the database is empty. The seed script (`backend/src/scripts/seed.ts`) references business units by name (e.g., 'IT Operations', 'Finance') when creating assets, but it never actually creates `BusinessUnit` entities in the database.

## Solution
Added business unit seeding to the seed script. Business units are now created before assets are seeded.

## How to Fix

### Option 1: Run the Full Seed Script
```bash
cd backend
npm run seed
# or
ts-node src/scripts/seed.ts
```

### Option 2: Run Only Business Units Seed (Faster)
```bash
cd backend
ts-node src/scripts/seed-business-units.ts
```

### Option 3: Manual Database Insert
If you prefer to insert manually via SQL:

```sql
INSERT INTO business_units (id, name, code, description, created_at, updated_at)
VALUES 
  (gen_random_uuid(), 'IT Operations', 'IT-OPERATIONS', 'IT Operations business unit', NOW(), NOW()),
  (gen_random_uuid(), 'Finance', 'FINANCE', 'Finance business unit', NOW(), NOW()),
  (gen_random_uuid(), 'Human Resources', 'HUMAN-RESOURCES', 'Human Resources business unit', NOW(), NOW()),
  (gen_random_uuid(), 'Executive', 'EXECUTIVE', 'Executive business unit', NOW(), NOW()),
  (gen_random_uuid(), 'Customer Relations', 'CUSTOMER-RELATIONS', 'Customer Relations business unit', NOW(), NOW()),
  (gen_random_uuid(), 'Legal', 'LEGAL', 'Legal business unit', NOW(), NOW()),
  (gen_random_uuid(), 'Marketing', 'MARKETING', 'Marketing business unit', NOW(), NOW()),
  (gen_random_uuid(), 'Compliance', 'COMPLIANCE', 'Compliance business unit', NOW(), NOW()),
  (gen_random_uuid(), 'Sales', 'SALES', 'Sales business unit', NOW(), NOW()),
  (gen_random_uuid(), 'Product Development', 'PRODUCT-DEVELOPMENT', 'Product Development business unit', NOW(), NOW()),
  (gen_random_uuid(), 'Business Intelligence', 'BUSINESS-INTELLIGENCE', 'Business Intelligence business unit', NOW(), NOW()),
  (gen_random_uuid(), 'IT Security', 'IT-SECURITY', 'IT Security business unit', NOW(), NOW()),
  (gen_random_uuid(), 'Facilities', 'FACILITIES', 'Facilities business unit', NOW(), NOW());
```

## Verification
After seeding, verify the dropdown works:
1. Open the physical asset form
2. Click the "Business Unit" dropdown
3. You should see 13 business units listed

## Files Changed
- `backend/src/scripts/seed.ts` - Added business unit seeding section
- `backend/src/scripts/seed-business-units.ts` - New standalone script for quick seeding

## API Endpoint
The business units are accessible via:
```
GET /business-units
```
(Requires JWT authentication)

## Notes
- The seed script checks if business units already exist and skips creation if they do
- Business units are created with codes (e.g., 'IT-OPERATIONS') and descriptions
- The admin user is set as the manager for all business units (if admin user exists)

