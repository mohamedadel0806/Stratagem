# GOV-029: Framework Mapping - Gap Analysis Implementation

**Status:** 🟢 Starting Implementation  
**Target:** Complete gap analysis feature (~8 hours)

---

## 📋 Implementation Plan

### Understanding the Structure

From the codebase analysis:
- ✅ `framework_control_mappings` table exists (migration 1701000000006)
- ✅ `framework_requirements` table exists (migration 1701000000005)  
- ❌ No entity for framework_control_mappings found yet
- ❌ Gap analysis service not implemented

### What Needs to Be Built

1. **Entity** (if needed):
   - FrameworkControlMapping entity (or use raw queries)

2. **Gap Analysis Service**:
   - Identify unmapped framework requirements
   - Calculate coverage percentages
   - Identify partial coverage
   - Provide recommendations

3. **DTOs**:
   - GapAnalysisDto
   - FrameworkGapDto
   - RequirementGapDto

4. **API Endpoint**:
   - GET `/api/v1/governance/reports/gap-analysis`

---

## 🎯 Gap Analysis Requirements

### Framework-Level Analysis
- Requirements with no mapped controls
- Coverage percentage per framework
- Requirements with only partial coverage

### Requirement-Level Analysis  
- Specific unmapped requirements
- Requirements with insufficient coverage
- Priority-based gap ranking

---

**Ready to implement!**







