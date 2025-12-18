# Fix: Workflow Entity Column Naming Mismatch

**Issue:** Database has camelCase columns but TypeORM expects snake_case

**Error:** `column Workflow.entity_type does not exist`

**Root Cause:** 
- Database columns: `entityType`, `createdById`, `daysBeforeDeadline` (camelCase)
- TypeORM expects: `entity_type`, `created_by_id`, `days_before_deadline` (snake_case)
- TypeORM is using `SnakeNamingStrategy` which converts camelCase to snake_case

**Solution:** Explicitly map column names in the entity to match the database.

---

## Fix Applied

Updated `workflow.entity.ts` to explicitly map all camelCase columns:

```typescript
@Column({
  type: 'enum',
  enum: EntityType,
  name: 'entityType', // Explicitly map to camelCase column name
})
entityType: EntityType;
```

---

## Status

✅ Fixed - All camelCase columns explicitly mapped in the entity.





