# Automated Compliance Checking System - Design Document

## Overview

This document outlines the design for an automated compliance checking system that evaluates assets against compliance requirements and automatically determines compliance status.

## Current State vs. Target State

### Current State (Manual)
- Assets store framework IDs in `complianceRequirements` field
- Compliance requirements have manual status (set by users)
- No automatic validation of asset data against requirements

### Target State (Automated)
- Assets linked to specific compliance requirements
- Validation rules engine evaluates asset attributes
- Automatic compliance status calculation
- Evidence tracking and audit trail
- Gap analysis and recommendations

---

## 1. Database Schema Changes

### 1.1 Asset-Requirement Mapping Table

```sql
CREATE TABLE asset_requirement_mapping (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_type VARCHAR(50) NOT NULL, -- 'physical', 'information', 'application', 'software', 'supplier'
    asset_id UUID NOT NULL,
    requirement_id UUID NOT NULL REFERENCES compliance_requirements(id) ON DELETE CASCADE,
    compliance_status compliance_status_enum DEFAULT 'not_assessed',
    last_assessed_at TIMESTAMP,
    assessed_by UUID REFERENCES users(id),
    evidence_urls JSONB DEFAULT '[]',
    notes TEXT,
    auto_assessed BOOLEAN DEFAULT false, -- true if status was auto-calculated
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(asset_type, asset_id, requirement_id)
);

CREATE TYPE compliance_status_enum AS ENUM (
    'not_assessed',
    'compliant',
    'non_compliant',
    'partially_compliant',
    'not_applicable',
    'requires_review'
);

CREATE INDEX idx_asset_requirement_mapping_asset ON asset_requirement_mapping(asset_type, asset_id);
CREATE INDEX idx_asset_requirement_mapping_requirement ON asset_requirement_mapping(requirement_id);
CREATE INDEX idx_asset_requirement_mapping_status ON asset_requirement_mapping(compliance_status);
```

### 1.2 Validation Rules Table

```sql
CREATE TABLE compliance_validation_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    requirement_id UUID NOT NULL REFERENCES compliance_requirements(id) ON DELETE CASCADE,
    asset_type VARCHAR(50) NOT NULL, -- Which asset type this rule applies to
    rule_name VARCHAR(255) NOT NULL,
    rule_description TEXT,
    validation_logic JSONB NOT NULL, -- Rule definition in JSON format
    priority INTEGER DEFAULT 0, -- Higher priority = checked first
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_validation_rules_requirement ON compliance_validation_rules(requirement_id);
CREATE INDEX idx_validation_rules_asset_type ON compliance_validation_rules(asset_type);
```

### 1.3 Compliance Assessment History Table

```sql
CREATE TABLE compliance_assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_type VARCHAR(50) NOT NULL,
    asset_id UUID NOT NULL,
    requirement_id UUID NOT NULL REFERENCES compliance_requirements(id),
    assessment_type assessment_type_enum DEFAULT 'automatic',
    previous_status compliance_status_enum,
    new_status compliance_status_enum NOT NULL,
    validation_results JSONB, -- Detailed results from rule evaluation
    assessed_by UUID REFERENCES users(id),
    assessed_at TIMESTAMP DEFAULT NOW(),
    notes TEXT
);

CREATE TYPE assessment_type_enum AS ENUM ('automatic', 'manual', 'scheduled');

CREATE INDEX idx_assessments_asset ON compliance_assessments(asset_type, asset_id);
CREATE INDEX idx_assessments_requirement ON compliance_assessments(requirement_id);
CREATE INDEX idx_assessments_date ON compliance_assessments(assessed_at);
```

---

## 2. Validation Rules Engine

### 2.1 Rule Definition Format (JSON)

```typescript
interface ValidationRule {
  // Rule metadata
  name: string;
  description: string;
  assetType: 'physical' | 'information' | 'application' | 'software' | 'supplier';
  
  // Conditions (all must be true)
  conditions: {
    field: string;           // Asset field path (e.g., 'containsPII', 'criticalityLevel')
    operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than' | 'in' | 'not_in' | 'exists' | 'not_exists';
    value: any;              // Expected value
  }[];
  
  // Compliance criteria (all must be true for compliant status)
  complianceCriteria: {
    field: string;
    operator: string;
    value: any;
  }[];
  
  // Non-compliance criteria (if any true, non-compliant)
  nonComplianceCriteria?: {
    field: string;
    operator: string;
    value: any;
  }[];
  
  // Partial compliance criteria (if true but complianceCriteria not met)
  partialComplianceCriteria?: {
    field: string;
    operator: string;
    value: any;
  }[];
}
```

### 2.2 Example Validation Rules

#### Example 1: Physical Asset Encryption Rule
**Requirement**: "ADGM-8: ICT Asset Protection - Implement encryption for sensitive data"

```json
{
  "name": "Physical Asset Encryption Check",
  "description": "Physical assets containing PII/PHI must have encryption enabled",
  "assetType": "physical",
  "conditions": [
    {
      "field": "containsPII",
      "operator": "equals",
      "value": true
    }
  ],
  "complianceCriteria": [
    {
      "field": "dataClassification",
      "operator": "in",
      "value": ["encrypted", "confidential"]
    }
  ],
  "nonComplianceCriteria": [
    {
      "field": "dataClassification",
      "operator": "equals",
      "value": "public"
    }
  ]
}
```

#### Example 2: Information Asset Classification Rule
**Requirement**: "ADGM-6: Information Asset Inventory - Know what information assets exist"

```json
{
  "name": "Information Asset Classification Check",
  "description": "Information assets must have proper data classification",
  "assetType": "information",
  "conditions": [], // Applies to all information assets
  "complianceCriteria": [
    {
      "field": "dataClassification",
      "operator": "exists",
      "value": null
    },
    {
      "field": "dataClassification",
      "operator": "not_equals",
      "value": ""
    }
  ],
  "nonComplianceCriteria": [
    {
      "field": "dataClassification",
      "operator": "equals",
      "value": ""
    }
  ]
}
```

#### Example 3: Critical Asset Owner Rule
**Requirement**: "SAMA-CSF-3.1.1: Establish Cyber Security Committee"

```json
{
  "name": "Critical Asset Ownership Check",
  "description": "Critical assets must have an assigned owner",
  "assetType": "physical",
  "conditions": [
    {
      "field": "criticalityLevel",
      "operator": "in",
      "value": ["critical", "high"]
    }
  ],
  "complianceCriteria": [
    {
      "field": "ownerId",
      "operator": "exists",
      "value": null
    }
  ],
  "nonComplianceCriteria": [
    {
      "field": "ownerId",
      "operator": "not_exists",
      "value": null
    }
  ]
}
```

---

## 3. Backend Service Architecture

### 3.1 Compliance Assessment Service

Key methods:
- `assessAssetRequirement(assetType, assetId, requirementId)` - Assess single requirement
- `assessAsset(assetType, assetId)` - Assess all requirements for an asset
- `evaluateRule(rule, asset)` - Evaluate a rule against asset data
- `getComplianceGaps(assetType, assetId)` - Get what's missing for compliance
- `bulkAssess(assetType, assetIds)` - Assess multiple assets

### 3.2 Assessment Flow

```
1. Get asset data
2. Get validation rules for requirement + asset type
3. Evaluate each rule:
   - Check if conditions apply
   - Evaluate compliance criteria
   - Evaluate non-compliance criteria
   - Determine status
4. Aggregate results from all rules
5. Save assessment with history
6. Return status + recommendations
```

### 3.3 New API Endpoints

```typescript
POST   /compliance/assessments/assets/:assetType/:assetId/requirements/:requirementId
POST   /compliance/assessments/assets/:assetType/:assetId
GET    /compliance/assessments/assets/:assetType/:assetId
GET    /compliance/assessments/assets/:assetType/:assetId/gaps
POST   /compliance/assessments/bulk-assess
GET    /compliance/assessments/history
```

---

## 4. Frontend Components

### 4.1 Asset Compliance Tab

Add a new "Compliance" tab to asset detail pages showing:
- List of requirements linked to this asset
- Compliance status for each requirement
- Last assessed date
- Validation results/details
- Gap analysis
- "Re-assess" button

### 4.2 Compliance Dashboard Widget

- Show compliance percentage by framework
- List non-compliant assets
- Show assets requiring review
- Trend charts

### 4.3 Validation Rules Management UI

- Create/edit validation rules
- Test rules against sample assets
- Rule templates for common requirements

---

## 5. Implementation Phases

### Phase 1: Foundation (Week 1-2)
- Create database tables (migrations)
- Create entities and DTOs
- Basic assessment service structure

### Phase 2: Rules Engine (Week 3-4)
- Implement validation rules engine
- Create rule evaluation logic
- Unit tests for rule evaluation

### Phase 3: Assessment Service (Week 5-6)
- Complete assessment service
- API endpoints
- Scheduled assessment job

### Phase 4: Frontend Integration (Week 7-8)
- Asset compliance tab
- Compliance dashboard widget
- Rules management UI

### Phase 5: Pre-built Rules (Week 9-10)
- Create validation rules for common requirements (NCA, SAMA, ADGM)
- Seed rules into database
- Documentation

---

## 6. Example Use Cases

### Use Case 1: Physical Asset with PII

**Asset**: Server containing PII data
**Requirement**: ADGM-8 (Encryption required for sensitive data)

**Assessment Flow**:
1. System finds rule: "Physical Asset Encryption Check"
2. Checks condition: `containsPII === true` ✅
3. Checks compliance: `dataClassification === 'encrypted'` ❌
4. Result: **Non-Compliant**
5. Recommendation: "Enable encryption or update data classification"

### Use Case 2: Critical Asset Without Owner

**Asset**: Critical server without owner
**Requirement**: SAMA-CSF-3.1.1 (Governance requirements)

**Assessment Flow**:
1. System finds rule: "Critical Asset Ownership Check"
2. Checks condition: `criticalityLevel === 'critical'` ✅
3. Checks compliance: `ownerId exists` ❌
4. Result: **Non-Compliant**
5. Recommendation: "Assign an owner to this critical asset"

### Use Case 3: Information Asset Missing Classification

**Asset**: Information asset without data classification
**Requirement**: ADGM-6 (Information Asset Inventory)

**Assessment Flow**:
1. System finds rule: "Information Asset Classification Check"
2. Checks condition: (none - applies to all) ✅
3. Checks compliance: `dataClassification exists and not empty` ❌
4. Result: **Non-Compliant**
5. Recommendation: "Add data classification to this information asset"

---

## 7. Benefits

1. **Automated Compliance**: Reduces manual effort
2. **Real-time Status**: Compliance status updates when assets change
3. **Gap Analysis**: Identifies what's missing for compliance
4. **Audit Trail**: Complete history of assessments
5. **Scalability**: Can assess thousands of assets automatically
6. **Consistency**: Same rules applied consistently across all assets

---

## 8. Technical Details

### 8.1 Rule Evaluation Operators

- `equals`: Exact match
- `not_equals`: Not equal
- `contains`: Array contains value
- `greater_than`: Numeric comparison
- `less_than`: Numeric comparison
- `in`: Value in array
- `not_in`: Value not in array
- `exists`: Field exists and not null/empty
- `not_exists`: Field missing or null/empty

### 8.2 Status Determination Logic

1. If any rule is non-compliant → Overall: **Non-Compliant**
2. If all rules are compliant → Overall: **Compliant**
3. If any is partially compliant → Overall: **Partially Compliant**
4. If rules require review → Overall: **Requires Review**
5. If no rules apply → Overall: **Not Applicable**

### 8.3 Performance Considerations

- Cache validation rules in memory
- Batch assessments for bulk operations
- Use database indexes for fast lookups
- Schedule daily assessments during off-peak hours
- Store assessment results to avoid re-computation

---

## 9. Future Enhancements

1. **Machine Learning**: Learn from manual overrides to improve rules
2. **Custom Rules UI**: Visual rule builder for non-technical users
3. **Evidence Management**: Upload and link evidence documents
4. **Remediation Workflows**: Auto-create tasks for non-compliant assets
5. **Compliance Scoring**: Weighted scoring system
6. **Regulatory Updates**: Auto-update rules when regulations change

---

**Document Version**: 1.0  
**Created**: November 30, 2025  
**Status**: Design Phase - Ready for Implementation











