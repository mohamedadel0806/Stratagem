# Fix: Workflow Column Naming Mismatch - FIXED ✅

**Issue:** Database had camelCase columns but TypeORM expected snake_case

**Error:** `column Workflow.entity_type does not exist`

---

## Root Cause

- Database columns were camelCase: `entityType`, `createdById`, `daysBeforeDeadline`, etc.
- TypeORM uses `SnakeNamingStrategy` which expects snake_case: `entity_type`, `created_by_id`, etc.
- TypeORM was looking for snake_case columns that didn't exist

---

## Solution Applied

Renamed all workflow table columns from camelCase to snake_case to match TypeORM's naming strategy:

1. ✅ `entityType` → `entity_type`
2. ✅ `daysBeforeDeadline` → `days_before_deadline`
3. ✅ `organizationId` → `organization_id`
4. ✅ `createdById` → `created_by_id`
5. ✅ `createdAt` → `created_at`
6. ✅ `updatedAt` → `updated_at`

---

## Commands Run

```sql
ALTER TABLE workflows RENAME COLUMN "entityType" TO entity_type;
ALTER TABLE workflows RENAME COLUMN "daysBeforeDeadline" TO days_before_deadline;
ALTER TABLE workflows RENAME COLUMN "organizationId" TO organization_id;
ALTER TABLE workflows RENAME COLUMN "createdById" TO created_by_id;
ALTER TABLE workflows RENAME COLUMN "createdAt" TO created_at;
ALTER TABLE workflows RENAME COLUMN "updatedAt" TO updated_at;
```

---

## Entity Updated

Removed explicit column name mappings - TypeORM's `SnakeNamingStrategy` now handles it automatically.

---

## Status

✅ **FIXED** - All columns renamed to snake_case, backend restarted.

The workflows endpoints should now work correctly!





