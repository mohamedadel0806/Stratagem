# GOV-023: Business Units Null Error Fix

**Error:** `business_units: Expected array, received null`  
**Status:** ✅ Fixed

---

## 🐛 Problem

When updating a policy, if `business_units` (or `linked_influencers` or `tags`) is `null` from the backend, Zod validation fails because it expects an array.

---

## ✅ Solution

Used Zod's `preprocess()` to automatically convert `null` values to empty arrays `[]` before validation.

### Schema Changes:

```typescript
business_units: z.preprocess(
  (val) => (val === null || val === undefined ? [] : val),
  z.array(z.string().uuid()).optional()
),
linked_influencers: z.preprocess(
  (val) => (val === null || val === undefined ? [] : val),
  z.array(z.string().uuid()).optional()
),
tags: z.preprocess(
  (val) => (val === null || val === undefined ? [] : val),
  z.array(z.string()).optional()
),
```

### How It Works:

1. **Preprocess**: Converts `null` or `undefined` to empty array `[]`
2. **Validate**: Then validates as an array of UUIDs
3. **Optional**: Field remains optional (can be undefined)

### Default Values:

Already handles null values:
```typescript
business_units: policy.business_units || [],
linked_influencers: policy.linked_influencers || [],
tags: policy.tags || [],
```

### Cleanup in onSubmit:

Also cleans up empty arrays to `undefined`:
```typescript
business_units: data.business_units && data.business_units.length > 0 ? data.business_units : undefined,
```

---

## ✅ Result

- ✅ Null values from backend are converted to empty arrays
- ✅ Form validation passes
- ✅ Empty arrays are cleaned up to `undefined` before sending to API
- ✅ No more validation errors

---

**Fixed!** The form now properly handles null values for array fields. 🚀




