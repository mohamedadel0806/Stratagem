# Governance Pages - File Locations & URLs

## 📁 File Locations

### Frontend Pages
All Governance pages are located in:
```
frontend/src/app/[locale]/(dashboard)/dashboard/governance/
```

**Individual Pages:**
1. **Influencers**
   - File: `frontend/src/app/[locale]/(dashboard)/dashboard/governance/influencers/page.tsx`
   - URL: `http://localhost:3000/en/dashboard/governance/influencers`

2. **Policies**
   - File: `frontend/src/app/[locale]/(dashboard)/dashboard/governance/policies/page.tsx`
   - URL: `http://localhost:3000/en/dashboard/governance/policies`

3. **Controls**
   - File: `frontend/src/app/[locale]/(dashboard)/dashboard/governance/controls/page.tsx`
   - URL: `http://localhost:3000/en/dashboard/governance/controls`

4. **Assessments**
   - File: `frontend/src/app/[locale]/(dashboard)/dashboard/governance/assessments/page.tsx`
   - URL: `http://localhost:3000/en/dashboard/governance/assessments`

5. **Evidence**
   - File: `frontend/src/app/[locale]/(dashboard)/dashboard/governance/evidence/page.tsx`
   - URL: `http://localhost:3000/en/dashboard/governance/evidence`

6. **Findings**
   - File: `frontend/src/app/[locale]/(dashboard)/dashboard/governance/findings/page.tsx`
   - URL: `http://localhost:3000/en/dashboard/governance/findings`

### Frontend Components
All Governance form components are located in:
```
frontend/src/components/governance/
```

**Components:**
- `influencer-form.tsx` - Create/Edit Influencer form
- `policy-form.tsx` - Create/Edit Policy form
- `control-objective-form.tsx` - Create/Edit Control Objective form
- `control-objectives-section.tsx` - Control Objectives management section
- `unified-control-form.tsx` - Create/Edit Unified Control form
- `assessment-form.tsx` - Create/Edit Assessment form
- `evidence-form.tsx` - Create/Edit Evidence form
- `finding-form.tsx` - Create/Edit Finding form

### API Client
API functions are located in:
```
frontend/src/lib/api/governance.ts
```

## 🔗 Direct URLs

Once your frontend is running (`npm run dev` or via Docker), you can access:

**Base URL:** `http://localhost:3000`

**Governance Pages:**
- `/en/dashboard/governance/influencers`
- `/en/dashboard/governance/policies`
- `/en/dashboard/governance/controls`
- `/en/dashboard/governance/assessments`
- `/en/dashboard/governance/evidence`
- `/en/dashboard/governance/findings`

**Note:** Replace `en` with your locale if different (e.g., `ar`, `fr`).

## ⚠️ Navigation Note

**The Governance pages are NOT yet linked in the sidebar navigation.**

To add them to the sidebar, you need to update:
```
frontend/src/components/layout/sidebar.tsx
```

Add a Governance dropdown menu similar to the Assets dropdown, with links to all 6 Governance pages.

## 🚀 Quick Access

To quickly test the pages, you can:

1. **Start the frontend:**
   ```bash
   docker-compose up frontend
   # or
   cd frontend && npm run dev
   ```

2. **Navigate directly to any page:**
   - Open browser: `http://localhost:3000/en/dashboard/governance/influencers`
   - Or manually type the URL in the address bar

3. **Check if pages are accessible:**
   ```bash
   curl http://localhost:3000/en/dashboard/governance/influencers
   ```

## 📋 Summary

✅ **6 Pages Created** - All located in `frontend/src/app/[locale]/(dashboard)/dashboard/governance/`
✅ **8 Components Created** - All located in `frontend/src/components/governance/`
✅ **API Client Ready** - Located in `frontend/src/lib/api/governance.ts`
⚠️ **Sidebar Navigation** - Not yet added (needs to be updated)




