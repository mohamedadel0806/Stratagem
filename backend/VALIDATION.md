# Catching Dependency Injection Errors Locally

## Problem

`npm run build` only compiles TypeScript - it doesn't validate NestJS dependency injection. Errors only appear when the application actually starts (like in Docker).

## Solution

We've added a validation script that catches these errors before deployment.

## Usage

### Option 1: Manual Validation (Recommended)

Run the validation script before committing or deploying:

```bash
npm run validate:modules
```

This will:
- ✅ Catch dependency injection errors
- ✅ Validate module imports/exports
- ✅ Check repository availability
- ✅ Verify service/provider registration

### Option 2: Run the App Locally

Simply start the app locally (same as Docker does):

```bash
npm run start:dev
```

If it starts successfully, Docker will too. Press `Ctrl+C` to stop it.

### Option 3: Add to Pre-commit Hook (Optional)

If you want validation to run automatically before commits, you can add it to your git hooks:

```bash
# .git/hooks/pre-commit
#!/bin/sh
cd backend
npm run validate:modules
```

Or use a tool like [husky](https://github.com/typicode/husky).

## What Gets Validated

The validation script checks for:

1. **Missing Entity Repositories**
   - Entities not added to `TypeOrmModule.forFeature()`
   - Example: `EvidenceRepository` not available

2. **Missing Module Imports**
   - Services from other modules not imported
   - Example: `RiskModule` not imported in `FindingsModule`

3. **Circular Dependencies**
   - Modules importing each other without `forwardRef()`

4. **Missing Exports**
   - Services not exported from their modules

## Common Errors and Fixes

### Error: "can't resolve dependencies"

**Fix:** Add missing entity to `TypeOrmModule.forFeature()`:

```typescript
TypeOrmModule.forFeature([
  // ... existing entities
  Evidence,  // ← Add missing entity
])
```

### Error: "is not available in the XModule context"

**Fix:** Import the module that exports the service:

```typescript
@Module({
  imports: [
    // ... existing imports
    RiskModule,  // ← Import missing module
  ],
})
```

### Error: Circular dependency

**Fix:** Use `forwardRef()`:

```typescript
import { forwardRef } from '@nestjs/common';

@Module({
  imports: [
    forwardRef(() => RiskModule),  // ← Use forwardRef
  ],
})
```

## Integration with CI/CD

You can add validation to your CI pipeline:

```yaml
# .github/workflows/ci.yml
- name: Validate modules
  run: |
    cd backend
    npm run validate:modules
```

## Notes

- The validation script may attempt to connect to the database (TypeORM initialization)
- If database is not available, it will show connection errors but still validate DI
- DI errors are caught **before** database connection, so they'll appear immediately
- For full validation (including database), ensure your `.env` file is configured and database is running
- The script exits immediately after validation - it doesn't start the server

## How It Works

1. **Module Compilation** - NestJS compiles all modules (fast, catches DI errors here)
2. **Database Connection** - TypeORM attempts to connect (may take a few seconds)
3. **Validation Complete** - Script exits

If there are DI errors, they appear in step 1 (immediately). Database connection errors in step 2 can be ignored for DI validation purposes.


