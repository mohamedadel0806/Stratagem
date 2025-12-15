# GOV-029: Framework Mapping - Gap Analysis Implementation Plan

**Task ID:** GOV-029  
**Status:** In Progress (70% → Targeting 100%)  
**Estimated Remaining:** ~8 hours  
**Priority:** P1

---

## 🎯 Objective

Complete the gap analysis feature for framework mappings. Identify which framework requirements have no mapped controls (gaps), analyze coverage, and provide actionable insights.

---

## 📋 Current Status (70% Complete)

### ✅ Already Implemented:
- Framework mapping table structure (`framework_control_mappings`)
- Framework requirements table (`framework_requirements`)
- Basic mapping service (control-to-requirement mapping works)
- Coverage level tracking (basic)

### ❌ Missing (Gap Analysis):
- Gap analysis service
- Gap analysis API endpoint
- Gap analysis DTOs
- Gap analysis reporting

---

## 🏗️ Implementation Plan

### 1. Understand Current Structure
- [x] Review `framework_control_mappings` table structure
- [x] Review `framework_requirements` table structure
- [ ] Understand relationship between framework_requirements and compliance_requirements
- [ ] Check if mapping entity exists

### 2. Create Gap Analysis Service
- [ ] Create gap analysis service
- [ ] Identify unmapped requirements (gaps)
- [ ] Calculate coverage percentages
- [ ] Identify partial coverage
- [ ] Provide recommendations

### 3. Create DTOs
- [ ] GapAnalysisDto
- [ ] FrameworkGapDto
- [ ] RequirementGapDto
- [ ] CoverageAnalysisDto

### 4. Create API Endpoint
- [ ] Add gap analysis endpoint to reporting controller
- [ ] Query parameters for filtering
- [ ] Response formatting

### 5. Testing
- [ ] Unit tests
- [ ] Integration tests
- [ ] Verify gap identification works

---

## 🔍 Gap Analysis Requirements

### What Should Gap Analysis Show:

1. **Framework-Level Gaps:**
   - Requirements with no mapped controls
   - Requirements with partial coverage only
   - Coverage percentage per framework

2. **Requirement-Level Gaps:**
   - Specific requirements missing controls
   - Requirements with insufficient coverage
   - Priority/risk of gaps

3. **Coverage Analysis:**
   - Which controls cover which requirements
   - Overlap analysis (controls covering multiple requirements)
   - Coverage gaps by category/domain

---

## 📝 Next Steps

1. Explore existing framework mapping structure
2. Create gap analysis service
3. Create API endpoint
4. Test and verify

**Ready to start implementation!**




