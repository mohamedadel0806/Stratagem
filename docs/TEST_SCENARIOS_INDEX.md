# Test Scenarios Documentation Index

**Document Version**: 1.0  
**Last Updated**: December 2024

---

## Overview

This index provides an overview of all test scenario documentation for the Stratagem GRC Platform, covering Asset Management, Governance Management, and their integration.

---

## Test Scenario Documents

### 1. Asset Management Test Scenarios

**Document**: [`ASSET_MANAGEMENT_TEST_SCENARIOS.md`](./ASSET_MANAGEMENT_TEST_SCENARIOS.md)

**Coverage**:
- Physical Asset Management
- Information Asset Management
- Business Application Management
- Software Asset Management
- Supplier Management
- Data Import (CSV/Excel)
- Search and Discovery
- Asset Relationships
- Audit and Compliance
- Reporting and Analytics

**Key Features**:
- 15+ detailed test scenarios
- 5 comprehensive flow diagrams
- User stories with acceptance criteria
- Covers all 5 asset types
- Import/export scenarios
- Search and filtering scenarios

**User Stories Included**:
- Data Import (CSV/Excel)
- Physical Asset CRUD operations
- Information Asset management
- Business Application management
- Software Asset management
- Supplier management
- Search and filtering
- Asset relationships
- Audit trails
- Reporting

---

### 2. Governance Management Test Scenarios

**Document**: [`GOVERNANCE_TEST_SCENARIOS.md`](./GOVERNANCE_TEST_SCENARIOS.md)

**Coverage**:
- Influencer Registry and Management
- Policy Management and Lifecycle
- Unified Control Library
- Control Assessments
- Evidence Management
- SOP Management (referenced)
- Reporting and Analytics

**Key Features**:
- 20+ detailed test scenarios
- 5 comprehensive flow diagrams
- User stories with acceptance criteria
- Policy approval workflows
- Control framework mapping
- Assessment execution scenarios

**User Stories Included**:
- Influencer creation and applicability assessment
- Policy creation and approval workflows
- Control objective definition
- Control creation and framework mapping
- Control implementation tracking
- Control assessments
- Evidence management
- Policy acknowledgment tracking

---

### 3. System Flow Diagrams and User Stories (Comprehensive)

**Document**: [`SYSTEM_FLOW_DIAGRAMS_AND_USER_STORIES.md`](./SYSTEM_FLOW_DIAGRAMS_AND_USER_STORIES.md)

**Coverage**:
- Complete System Architecture Overview
- Asset Management Module (All 5 asset types)
- Governance Management Module (Full lifecycle)
- Integration Workflows
- End-to-End Workflows

**Key Features**:
- 35+ comprehensive user stories
- 15+ detailed flow diagrams (Mermaid)
- System architecture diagrams
- End-to-end implementation cycles
- Audit preparation workflow
- Asset onboarding with governance

**Highlights**:
- Executive-level system overview
- High-level data flow diagrams
- Complete governance implementation cycle
- Audit preparation workflow
- Asset onboarding with governance integration

---

### 4. Assets-Governance Integration Test Scenarios

**Document**: [`ASSETS_GOVERNANCE_INTEGRATION_TEST_SCENARIOS.md`](./ASSETS_GOVERNANCE_INTEGRATION_TEST_SCENARIOS.md)

**Coverage**:
- Control to Asset Linking
- Asset Compliance Status
- Governance Requirements from Assets
- Audit and Reporting Integration
- Dashboard Integration

**Key Features**:
- 10+ integration test scenarios
- 5 comprehensive flow diagrams
- Bidirectional navigation scenarios
- Compliance calculation scenarios
- Bulk operation scenarios

**User Stories Included**:
- Link controls to assets
- View asset compliance status
- View controls for asset
- Bulk control assignment
- Compliance reporting with asset data
- Asset audit trail with governance events

---

## Document Structure

Each test scenario document follows a consistent structure:

1. **Overview**: High-level description of the module/area
2. **User Stories**: Complete list of user stories with priorities
3. **Test Scenarios by Feature**: Detailed test scenarios organized by functional area
4. **Flow Diagrams**: Visual representations using Mermaid syntax
5. **Acceptance Criteria**: Overall acceptance criteria for the module

### Test Scenario Format

Each individual test scenario includes:

- **User Story Reference**: Links to the associated user story
- **Preconditions**: Required setup before test execution
- **Test Steps**: Step-by-step test execution instructions
- **Expected Results**: Detailed expected outcomes
- **Acceptance Criteria**: Specific acceptance criteria for the scenario

---

## Flow Diagrams

All documents include comprehensive flow diagrams created using Mermaid syntax. Diagrams cover:

### Asset Management Flow Diagrams
1. Asset Creation Flow
2. CSV Import Flow
3. Asset Search Flow
4. Asset Update Flow with Validation
5. Asset Dependency Creation Flow

### Governance Management Flow Diagrams
1. Influencer Creation and Applicability Assessment Flow
2. Policy Creation and Approval Workflow
3. Control Assessment Flow
4. Control to Framework Mapping Flow
5. Control to Asset Linking Flow

### Integration Flow Diagrams
1. Control to Asset Linking Flow
2. Asset Compliance Status Calculation Flow
3. Bulk Control Assignment Flow
4. Asset Compliance Dashboard Integration Flow
5. Control-Asset Integration in Assessment Flow

---

## How to Use These Documents

### For Testers
1. Review the Overview section to understand scope
2. Identify relevant test scenarios by feature area
3. Follow test steps exactly as documented
4. Verify expected results match acceptance criteria
5. Report any discrepancies

### For Developers
1. Review user stories to understand requirements
2. Study flow diagrams to understand workflows
3. Reference acceptance criteria during development
4. Ensure all scenarios can be executed successfully

### For Product Owners
1. Review user stories and priorities
2. Verify scenarios cover all requirements
3. Validate acceptance criteria align with business needs
4. Prioritize test execution based on user story priorities

---

## Test Execution Priority

### Priority P0 (Must Have) - Execute First
- Asset CRUD operations
- Influencer management
- Policy creation and approval
- Control creation and mapping
- Basic integration scenarios

### Priority P1 (Should Have) - Execute Second
- Data import scenarios
- Advanced search and filtering
- Control assessments
- Evidence management
- Integration scenarios

### Priority P2 (Nice to Have) - Execute Last
- Advanced relationship mapping
- Bulk operations
- Dashboard widgets
- Advanced reporting

---

## Related Documentation

- **System Flow Diagrams & User Stories**: [`SYSTEM_FLOW_DIAGRAMS_AND_USER_STORIES.md`](./SYSTEM_FLOW_DIAGRAMS_AND_USER_STORIES.md) ⭐ **NEW - Comprehensive**
- **Asset Management PRD**: [`PHASE2_ASSET_MANAGEMENT_PRD.md`](./PHASE2_ASSET_MANAGEMENT_PRD.md)
- **Governance PRD**: [`Requirments-US-PRD-DB Schema Governance Management Module Integrated with Assets managment.md`](./Requirments-US-PRD-DB%20Schema%20Governance%20Management%20Module%20Integrated%20with%20Assets%20managment.md)
- **Governance API Specification**: [`GOVERNANCE_API_SPECIFICATION.md`](./GOVERNANCE_API_SPECIFICATION.md)
- **Asset Management Architecture**: [`ASSET_MANAGEMENT_ARCHITECTURE.md`](./ASSET_MANAGEMENT_ARCHITECTURE.md)

---

## Maintenance

These test scenarios should be updated when:
- New features are added
- User stories change
- Workflows are modified
- Integration points change
- Acceptance criteria are updated

**Last Review**: December 2024  
**Next Review**: After each major release

---

## Summary Statistics

### Asset Management
- **User Stories**: 20+
- **Test Scenarios**: 15+
- **Flow Diagrams**: 5
- **Coverage**: All 5 asset types, Import, Search, Relationships, Reporting

### Governance Management
- **User Stories**: 15+
- **Test Scenarios**: 20+
- **Flow Diagrams**: 5
- **Coverage**: Influencers, Policies, Controls, Assessments, Evidence

### Integration
- **User Stories**: 4
- **Test Scenarios**: 10+
- **Flow Diagrams**: 5
- **Coverage**: Control-Asset Linking, Compliance Status, Reporting Integration

### Comprehensive System Documentation (NEW)
- **User Stories**: 35+
- **Flow Diagrams**: 15+ (including E2E workflows)
- **Story Points**: 250+ estimated
- **Coverage**: Complete system architecture, all modules, integration, end-to-end workflows
- **Special Features**: 
  - System architecture overview
  - Governance implementation lifecycle
  - Asset onboarding workflow
  - Audit preparation workflow

---

## Document List Summary

| Document | User Stories | Flow Diagrams | Focus |
|----------|-------------|---------------|-------|
| `ASSET_MANAGEMENT_TEST_SCENARIOS.md` | 20+ | 5 | Asset Module Testing |
| `GOVERNANCE_TEST_SCENARIOS.md` | 15+ | 5 | Governance Module Testing |
| `SYSTEM_FLOW_DIAGRAMS_AND_USER_STORIES.md` | 35+ | 15+ | System Overview & E2E Flows |
| `ASSETS_GOVERNANCE_INTEGRATION_TEST_SCENARIOS.md` | 4 | 5 | Integration Testing |

---

**Document End**

