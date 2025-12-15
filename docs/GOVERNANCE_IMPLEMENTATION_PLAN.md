# Governance Module Implementation Plan

**Document Version:** 1.1  
**Date:** December 2024  
**Status:** Planning Phase  
**Dependencies:** Asset Management Module (Implemented)  
**Related Documents:** [Bull Queue Flows](./BULL_QUEUE_GOVERNANCE_FLOWS.md)

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Implementation Strategy](#implementation-strategy)
3. [Phase Breakdown](#phase-breakdown)
4. [Detailed Task List](#detailed-task-list)
5. [Integration Points](#integration-points)
6. [Technical Architecture](#technical-architecture)
7. [Database Migration Plan](#database-migration-plan)
8. [Testing Strategy](#testing-strategy)
9. [Risk Management](#risk-management)
10. [Success Metrics](#success-metrics)

---

## Executive Summary

### Overview

This document outlines the comprehensive implementation plan for the Governance Module, which integrates seamlessly with the existing Asset Management Module. The Governance Module enables organizations to establish, document, and maintain governance frameworks covering IT, privacy, and cybersecurity.

### Key Objectives

1. **Establish Governance Foundation**: Create influencer registry, policy management, and control library
2. **Enable Multi-Framework Compliance**: Map controls to multiple regulatory frameworks (NCA, ISO 27001, PCI DSS, etc.)
3. **Integrate with Assets**: Link controls to assets for end-to-end traceability
4. **Support Audit Readiness**: Evidence repository, assessment workflows, and audit packages
5. **Operationalize Governance**: SOPs, testing, and continuous monitoring
6. **Enable Async Processing**: Bull Queue for long-running operations (reports, evidence collection, notifications)

### Success Criteria

| Metric | Target | Measurement |
|--------|--------|-------------|
| Influencers documented | 100+ | Count in system |
| Policies created and approved | 50+ | Count with APPROVED status |
| Controls in unified library | 500+ | Count in control library |
| Frameworks fully mapped | 5+ | Frameworks with >90% coverage |
| Critical assets linked to controls | 90% | Assets with at least 1 control |
| Audit package generation time | < 2 hours | End-to-end timing |
| Policy acknowledgment rate | 95% | Acknowledged / Assigned |
| Queue job success rate | > 99% | Completed / Total jobs |

### Timeline Overview

| Phase | Focus | Duration | Key Deliverables |
|-------|-------|----------|------------------|
| Phase 1 | Foundation | Months 1-3 | Influencers, Policies, Basic Controls, Queues |
| Phase 2 | Control Framework | Months 4-6 | Multi-framework mapping, Assessments, Evidence |
| Phase 3 | Operations | Months 7-9 | SOPs, Testing, Traceability, Notifications |
| Phase 4 | Optimization | Months 10-12 | Automation, AI/ML, Advanced Analytics |

---

## Implementation Strategy

### Architecture Alignment

The Governance Module will follow the same architectural patterns as Asset Management:

| Component | Technology | Notes |
|-----------|------------|-------|
| Backend | NestJS + TypeORM | Modular architecture |
| Frontend | Next.js 14 + React 18 + TypeScript | App Router |
| Database | PostgreSQL | Shared with Asset Management |
| File Storage | MinIO/S3 | Shared bucket structure |
| Authentication | Keycloak | Shared realm |
| API Style | RESTful + OpenAPI | Swagger documentation |
| Message Queue | Bull + Redis | Async job processing |
| Caching | Redis | Shared instance |

### Integration Approach

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend (Next.js)                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐   │
│  │Asset Mgmt UI │  │Governance UI │  │ Shared Components    │   │
│  └──────────────┘  └──────────────┘  └──────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        API Gateway                               │
└─────────────────────────────────────────────────────────────────┘
                              │
          ┌───────────────────┼───────────────────┐
          ▼                   ▼                   ▼
┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
│  Asset Module    │ │Governance Module │ │  Shared Module   │
│  - Physical      │ │  - Influencers   │ │  - Auth          │
│  - Information   │ │  - Policies      │ │  - Audit         │
│  - Applications  │ │  - Controls      │ │  - Files         │
│  - Software      │ │  - Assessments   │ │  - Notifications │
│  - Suppliers     │ │  - Evidence      │ │  - Tags          │
└──────────────────┘ └──────────────────┘ └──────────────────┘
          │                   │                   │
          └───────────────────┼───────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     PostgreSQL Database                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐   │
│  │Asset Tables  │◄─┤ Cross-Refs   ├─►│ Governance Tables    │   │
│  └──────────────┘  └──────────────┘  └──────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────────┐
│                        Redis                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐   │
│  │   Cache      │  │ Bull Queues  │  │    Sessions          │   │
│  └──────────────┘  └──────────────┘  └──────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### Development Principles

- **Incremental Delivery**: Each phase delivers working functionality
- **Test-Driven Development**: Unit, integration, and E2E tests
- **API-First Design**: Define APIs before implementation
- **Documentation**: Keep API docs, architecture docs updated
- **Code Reuse**: Leverage shared components and services
- **Async by Default**: Use queues for operations > 3 seconds

---

## Phase Breakdown

### Phase 1: Foundation (Months 1-3)

**Goal**: Core governance framework operational with async infrastructure

**Deliverables**:
- ✅ Bull Queue infrastructure setup
- ✅ Influencer registry with CRUD operations
- ✅ Policy management (create, approve, publish, acknowledge)
- ✅ Basic control library (100-200 controls)
- ✅ Framework configuration (3-5 frameworks)
- ✅ User management integration
- ✅ Basic reporting (dashboard, policy reports)
- ✅ Notification system (email + in-app)

**Success Metrics**:
- 50+ influencers documented
- 20+ policies created and approved
- 100+ controls in library
- Queue infrastructure operational
- User satisfaction > 7/10

---

### Phase 2: Control Framework (Months 4-6)

**Goal**: Unified control library with multi-framework mapping and evidence management

**Deliverables**:
- ✅ Complete control library (500+ controls)
- ✅ Framework mapping (10+ frameworks)
- ✅ Control assessment module
- ✅ Evidence repository with async upload
- ✅ Standards and baselines management
- ✅ Control-to-asset integration
- ✅ Advanced reporting (compliance scorecards, gap analysis)
- ✅ Async report generation via Bull Queue

**Success Metrics**:
- 500+ controls with average 5+ framework mappings
- 2+ frameworks fully mapped
- 90% of critical assets linked to controls
- Audit package generated in < 2 hours
- Report generation jobs < 1% failure rate

---

### Phase 3: Operations (Months 7-9)

**Goal**: Operational procedures and continuous monitoring

**Deliverables**:
- ✅ SOP management
- ✅ Control testing and scheduling
- ✅ Exception management
- ✅ Traceability matrix
- ✅ Audit support features
- ✅ Advanced analytics and dashboards
- ✅ Scheduled job management (assessments, evidence collection)
- ✅ Mobile-responsive UI

**Success Metrics**:
- 50+ SOPs documented
- 80% of controls tested within cycle
- Complete traceability demonstrated
- Audit preparation time reduced by 50%
- Scheduled jobs 99.5% reliability

---

### Phase 4: Optimization (Months 10-12)

**Goal**: Automation and advanced capabilities

**Deliverables**:
- ✅ Automated evidence collection (SIEM, scanners, cloud APIs)
- ✅ AI-powered gap analysis
- ✅ Predictive compliance analytics
- ✅ Advanced workflow automation
- ✅ Third-party integrations (Splunk, Qualys, AWS)
- ✅ Custom report builder
- ✅ Public API for external integrations
- ✅ Queue monitoring dashboard

**Success Metrics**:
- 30% of evidence auto-collected
- Compliance prediction accuracy > 85%
- API adoption by 2+ consumers
- Page load time < 1 second
- Queue throughput > 1000 jobs/hour

---

## Detailed Task List

### Phase 1: Foundation Tasks

#### Sprint 1-2 (Weeks 1-4): Database Schema & Core Infrastructure

**Backend Tasks**:

- [ ] **GOV-001**: Create database migration for Governance schema
  - Create all enum types (influencer_category, policy_status, control_type, etc.)
  - Create influencers table with indexes
  - Create policies table with indexes
  - Create control_objectives table
  - Create unified_controls table
  - Create compliance_frameworks table
  - Create framework_requirements table
  - Create framework_control_mappings table
  - Create job_status table for queue tracking
  - Create audit triggers for governance tables
  - Create database views (vw_control_coverage, vw_framework_compliance)
  - **Priority**: P0 | **Story Points**: 13
  - **Dependencies**: None
  - **Acceptance**: All tables created, indexes in place, triggers working

- [ ] **GOV-002**: Set up Governance module structure in NestJS
  - Create governance module folder structure
  - Create shared DTOs and entities
  - Configure TypeORM entities for governance tables
  - Set up module dependencies (Auth, Asset Management)
  - Create base service classes
  - **Priority**: P0 | **Story Points**: 8
  - **Dependencies**: GOV-001
  - **Acceptance**: Module structure matches Asset Management pattern

- [ ] **GOV-002A**: Set up Bull Queue infrastructure
  - Install Bull and Bull Board dependencies
  - Configure Redis connection for queues
  - Create GovernanceQueuesModule with all queue definitions
  - Set up Bull Board for queue monitoring UI
  - Create queue health check endpoint
  - Configure queue event listeners (completed, failed, stalled)
  - **Priority**: P0 | **Story Points**: 8
  - **Dependencies**: GOV-002
  - **Acceptance**: All queues registered, Bull Board accessible at /admin/queues

- [ ] **GOV-003**: Create shared service integrations
  - Integrate with existing Auth service
  - Integrate with existing Audit service
  - Integrate with existing File Storage service
  - Integrate with existing Notification service
  - Create shared service interfaces
  - **Priority**: P0 | **Story Points**: 8
  - **Dependencies**: GOV-002
  - **Acceptance**: All shared services accessible from Governance module

**Frontend Tasks**:

- [ ] **GOV-004**: Create Governance module structure in Next.js
  - Create governance folder in `src/app`
  - Create shared components folder
  - Set up routing structure
  - Create layout components
  - Configure navigation integration
  - **Priority**: P0 | **Story Points**: 5
  - **Dependencies**: None
  - **Acceptance**: Navigation shows Governance sections

- [ ] **GOV-005**: Create shared UI components library
  - Reuse Asset Management components (tables, forms, modals)
  - Create governance-specific components (status badges, priority indicators)
  - Create reusable form components
  - Create reusable table components
  - Create job status indicator component
  - Create async operation progress component
  - **Priority**: P0 | **Story Points**: 8
  - **Dependencies**: GOV-004
  - **Acceptance**: Components match Asset Management design

**Testing Tasks**:

- [ ] **GOV-006**: Set up testing infrastructure
  - Configure Jest for backend tests
  - Configure Playwright for E2E tests
  - Create test utilities and fixtures
  - Set up test database
  - Create Bull Queue test utilities (mock queues)
  - **Priority**: P0 | **Story Points**: 5
  - **Dependencies**: GOV-001, GOV-002, GOV-002A
  - **Acceptance**: Test suite runs successfully

---

#### Sprint 3-4 (Weeks 5-8): Influencer Registry

**Backend Tasks**:

- [ ] **GOV-007**: Create Influencer Service
  - Create Influencer entity and DTOs
  - Implement CRUD operations
  - Implement search and filtering
  - Implement bulk import (CSV/Excel) via queue
  - Implement export functionality via queue
  - Add validation rules
  - **Priority**: P0 | **Story Points**: 13
  - **Dependencies**: GOV-002, GOV-002A, GOV-003
  - **Acceptance**: All CRUD operations work, import/export functional

- [ ] **GOV-007A**: Create Influencer Import Processor
  - Create import job definition
  - Implement CSV/Excel parsing
  - Implement validation and error collection
  - Implement batch insert with progress updates
  - Create import result notification
  - **Priority**: P0 | **Story Points**: 8
  - **Dependencies**: GOV-007
  - **Acceptance**: Import jobs process correctly with progress tracking

- [ ] **GOV-008**: Create Influencer Controller
  - Create REST endpoints (GET, POST, PUT, DELETE)
  - Implement pagination and sorting
  - Implement filtering query parameters
  - Add Swagger documentation
  - Add authentication/authorization guards
  - Create async endpoints (POST /import, GET /import/:jobId/status)
  - **Priority**: P0 | **Story Points**: 8
  - **Dependencies**: GOV-007, GOV-007A
  - **Acceptance**: All endpoints documented and tested

- [ ] **GOV-009**: Implement Applicability Assessment
  - Create applicability assessment workflow
  - Create assessment criteria structure
  - Implement assessment decision tracking
  - Create assessment reports
  - **Priority**: P0 | **Story Points**: 8
  - **Dependencies**: GOV-007
  - **Acceptance**: Users can assess influencer applicability

- [ ] **GOV-010**: Implement Influencer Change Tracking
  - Create version history tracking
  - Implement change notifications via queue
  - Create impact assessment workflow
  - **Priority**: P1 | **Story Points**: 8
  - **Dependencies**: GOV-007
  - **Acceptance**: Version history visible, notifications sent

**Frontend Tasks**:

- [ ] **GOV-011**: Create Influencer List View
  - Create table component with filters
  - Implement search functionality
  - Add bulk actions (tag, status change, export)
  - Add pagination
  - Create add/edit/delete actions
  - Show import job status
  - **Priority**: P0 | **Story Points**: 13
  - **Dependencies**: GOV-004, GOV-005
  - **Acceptance**: List view matches Asset Management pattern

- [ ] **GOV-012**: Create Influencer Detail/Edit Form
  - Create form with all influencer fields
  - Implement field validation
  - Add file upload for source documents
  - Add tag management
  - Add business unit selection
  - **Priority**: P0 | **Story Points**: 13
  - **Dependencies**: GOV-011
  - **Acceptance**: Form validates correctly, saves successfully

- [ ] **GOV-013**: Create Applicability Assessment UI
  - Create assessment form
  - Display assessment criteria
  - Show assessment history
  - Add assessment decision workflow
  - **Priority**: P0 | **Story Points**: 8
  - **Dependencies**: GOV-012
  - **Acceptance**: Users can complete assessments

- [ ] **GOV-014**: Create Influencer Import Wizard
  - Create file upload component
  - Create field mapping interface
  - Create preview table
  - Create import progress indicator
  - Create import results view with error details
  - Reuse Asset Management import patterns
  - **Priority**: P1 | **Story Points**: 13
  - **Dependencies**: GOV-011
  - **Acceptance**: Import wizard works like Asset Management

**Testing Tasks**:

- [ ] **GOV-015**: Write Influencer tests
  - Unit tests for Influencer service
  - Unit tests for Import processor
  - Integration tests for API endpoints
  - E2E tests for CRUD flows
  - E2E tests for import flow with queue
  - **Priority**: P0 | **Story Points**: 8
  - **Dependencies**: GOV-007, GOV-007A, GOV-008, GOV-011, GOV-012
  - **Acceptance**: 80%+ code coverage

---

#### Sprint 5-6 (Weeks 9-12): Policy Management

**Backend Tasks**:

- [ ] **GOV-016**: Create Policy Service
  - Create Policy entity and DTOs
  - Implement CRUD operations
  - Implement version control
  - Implement policy templates
  - Implement rich text content storage
  - **Priority**: P0 | **Story Points**: 13
  - **Dependencies**: GOV-002, GOV-003
  - **Acceptance**: Policies can be created with versioning

- [ ] **GOV-017**: Create Control Objective Service
  - Create ControlObjective entity
  - Implement CRUD operations
  - Link to policies
  - Link to influencers
  - **Priority**: P0 | **Story Points**: 8
  - **Dependencies**: GOV-016
  - **Acceptance**: Control objectives linked to policies

- [ ] **GOV-018**: Implement Policy Approval Workflow
  - Create workflow engine
  - Create workflow configuration
  - Implement multi-level approval
  - Implement digital signatures
  - Create approval notifications via queue
  - **Priority**: P0 | **Story Points**: 21
  - **Dependencies**: GOV-016
  - **Acceptance**: Approval workflow configurable and functional

- [ ] **GOV-019**: Implement Policy Publication & Distribution
  - Create publication service
  - Implement assignment to users/roles/BUs
  - Create PolicyDistributionProcessor for queue
  - Implement batched notification sending
  - Implement policy library
  - **Priority**: P0 | **Story Points**: 13
  - **Dependencies**: GOV-016, GOV-002A
  - **Acceptance**: Policies published and distributed via queue

- [ ] **GOV-020**: Implement Policy Acknowledgment Tracking
  - Create acknowledgment service
  - Track user acknowledgments
  - Implement reminder system via scheduled queue jobs
  - Create acknowledgment reports
  - **Priority**: P1 | **Story Points**: 8
  - **Dependencies**: GOV-019
  - **Acceptance**: Acknowledgments tracked and reported

- [ ] **GOV-021**: Implement Policy Review Management
  - Create review scheduling via queue
  - Implement review reminders
  - Create review workflow
  - Track review history
  - **Priority**: P1 | **Story Points**: 8
  - **Dependencies**: GOV-016
  - **Acceptance**: Review reminders sent, reviews tracked

**Frontend Tasks**:

- [ ] **GOV-022**: Create Policy List View
  - Create table with filters (status, type, owner)
  - Add search functionality
  - Show review due dates
  - Show acknowledgment rates
  - Show distribution status
  - **Priority**: P0 | **Story Points**: 8
  - **Dependencies**: GOV-004, GOV-005
  - **Acceptance**: List view functional

- [ ] **GOV-023**: Create Policy Editor
  - Create rich text editor (TinyMCE/CKEditor)
  - Implement policy template selection
  - Add control objectives section
  - Add influencer linking
  - Add version comparison
  - **Priority**: P0 | **Story Points**: 21
  - **Dependencies**: GOV-022
  - **Acceptance**: Rich text editor works, templates load

- [ ] **GOV-024**: Create Policy Approval Workflow UI
  - Create approval interface
  - Show approval status
  - Display approval history
  - Add comments/feedback
  - **Priority**: P0 | **Story Points**: 13
  - **Dependencies**: GOV-023
  - **Acceptance**: Approvers can approve/reject policies

- [ ] **GOV-025**: Create Policy Acknowledgment UI
  - Create acknowledgment interface
  - Show acknowledgment status
  - Display pending acknowledgments
  - Add reminder management
  - Show distribution progress
  - **Priority**: P1 | **Story Points**: 8
  - **Dependencies**: GOV-022
  - **Acceptance**: Users can acknowledge policies

**Testing Tasks**:

- [ ] **GOV-026**: Write Policy tests
  - Unit tests for Policy service
  - Unit tests for PolicyDistributionProcessor
  - Integration tests for approval workflow
  - E2E tests for policy lifecycle
  - **Priority**: P0 | **Story Points**: 8
  - **Dependencies**: GOV-016, GOV-018, GOV-019, GOV-022, GOV-023
  - **Acceptance**: 80%+ code coverage

---

#### Sprint 7-8 (Weeks 13-16): Basic Control Library

**Backend Tasks**:

- [ ] **GOV-027**: Create Unified Control Service
  - Create UnifiedControl entity
  - Implement CRUD operations
  - Implement control domains organization
  - Implement search and filtering
  - **Priority**: P0 | **Story Points**: 13
  - **Dependencies**: GOV-002, GOV-003
  - **Acceptance**: Controls can be created and organized

- [ ] **GOV-028**: Create Framework Service
  - Create Framework entity
  - Implement framework CRUD
  - Implement framework structure import
  - Create framework templates (NCA, ISO 27001, etc.)
  - **Priority**: P0 | **Story Points**: 13
  - **Dependencies**: GOV-002
  - **Acceptance**: Frameworks can be configured

- [ ] **GOV-029**: Implement Framework Mapping Service
  - Create mapping service
  - Implement control-to-requirement mapping
  - Implement coverage level tracking
  - Create gap analysis service
  - **Priority**: P0 | **Story Points**: 13
  - **Dependencies**: GOV-027, GOV-028
  - **Acceptance**: Controls can be mapped to frameworks

- [ ] **GOV-030**: Implement Control Import Service
  - Create import from framework templates
  - Implement bulk control import
  - Create control library templates
  - **Priority**: P1 | **Story Points**: 13
  - **Dependencies**: GOV-027, GOV-028
  - **Acceptance**: Controls can be imported from templates

**Frontend Tasks**:

- [ ] **GOV-031**: Create Control Library View
  - Create tree view by domain
  - Create table view
  - Add search and filters
  - Show framework coverage
  - **Priority**: P0 | **Story Points**: 13
  - **Dependencies**: GOV-004, GOV-005
  - **Acceptance**: Control library viewable and searchable

- [ ] **GOV-032**: Create Control Detail/Edit Form
  - Create form with all control fields
  - Add framework mapping interface
  - Show linked assets
  - Show linked control objectives
  - **Priority**: P0 | **Story Points**: 13
  - **Dependencies**: GOV-031
  - **Acceptance**: Controls can be edited with mappings

- [ ] **GOV-033**: Create Framework Configuration UI
  - Create framework list view
  - Create framework detail/edit form
  - Create framework structure editor
  - Add framework import interface
  - **Priority**: P0 | **Story Points**: 13
  - **Dependencies**: GOV-031
  - **Acceptance**: Frameworks can be configured

- [ ] **GOV-034**: Create Framework Mapping Matrix View
  - Create matrix visualization
  - Show controls vs. requirements
  - Add color coding for coverage
  - Enable mapping from matrix
  - **Priority**: P1 | **Story Points**: 13
  - **Dependencies**: GOV-032, GOV-033
  - **Acceptance**: Mapping matrix visual and interactive

**Testing Tasks**:

- [ ] **GOV-035**: Write Control Library tests
  - Unit tests for Control service
  - Integration tests for framework mapping
  - E2E tests for control CRUD
  - **Priority**: P0 | **Story Points**: 8
  - **Dependencies**: GOV-027, GOV-029, GOV-031, GOV-032
  - **Acceptance**: 80%+ code coverage

---

#### Sprint 9-10 (Weeks 17-20): Basic Reporting & Dashboard

**Backend Tasks**:

- [ ] **GOV-036**: Create Dashboard Service
  - Create dashboard data aggregation
  - Implement metrics calculation
  - Create dashboard widgets data
  - Implement caching for dashboard data
  - **Priority**: P0 | **Story Points**: 13
  - **Dependencies**: GOV-007, GOV-016, GOV-027
  - **Acceptance**: Dashboard data available via API

- [ ] **GOV-037**: Create Reporting Service
  - Create policy reports
  - Create influencer reports
  - Create control reports
  - Implement report export (PDF, Excel) via queue
  - Create ReportGenerationProcessor
  - **Priority**: P0 | **Story Points**: 13
  - **Dependencies**: GOV-007, GOV-016, GOV-027, GOV-002A
  - **Acceptance**: Reports generated asynchronously

- [ ] **GOV-037A**: Create Export Processor
  - Implement Excel generation (ExcelJS)
  - Implement PDF generation (PDFKit/pdf-lib)
  - Implement progress tracking
  - Implement file upload to MinIO
  - Create download URL generation
  - **Priority**: P0 | **Story Points**: 13
  - **Dependencies**: GOV-037
  - **Acceptance**: Exports complete with progress tracking

**Frontend Tasks**:

- [ ] **GOV-038**: Create Governance Dashboard
  - Create dashboard layout
  - Add summary cards
  - Add charts (controls by domain, implementation status)
  - Add activity feed
  - Add upcoming items widget
  - Add queue status widget
  - **Priority**: P0 | **Story Points**: 13
  - **Dependencies**: GOV-004, GOV-005
  - **Acceptance**: Dashboard displays all metrics

- [ ] **GOV-039**: Create Report Views
  - Create policy compliance report
  - Create influencer report
  - Create control implementation report
  - Add export functionality with progress indicator
  - **Priority**: P1 | **Story Points**: 8
  - **Dependencies**: GOV-038
  - **Acceptance**: Reports viewable and exportable asynchronously

**Testing Tasks**:

- [ ] **GOV-040**: Write Dashboard & Reporting tests
  - Unit tests for dashboard service
  - Unit tests for ReportGenerationProcessor
  - Integration tests for report generation queue
  - E2E tests for dashboard display
  - **Priority**: P0 | **Story Points**: 5
  - **Dependencies**: GOV-036, GOV-037, GOV-037A, GOV-038
  - **Acceptance**: Dashboard and reports tested

---

### Phase 2: Control Framework Tasks

#### Sprint 11-12 (Weeks 21-24): Control Assessment

**Backend Tasks**:

- [ ] **GOV-041**: Create Assessment Service
  - Create Assessment entity
  - Implement assessment CRUD
  - Implement assessment workflow
  - Create assessment templates
  - **Priority**: P0 | **Story Points**: 13
  - **Dependencies**: GOV-027
  - **Acceptance**: Assessments can be created and managed

- [ ] **GOV-042**: Create Assessment Result Service
  - Create AssessmentResult entity
  - Implement result recording
  - Implement findings creation
  - Track remediation actions
  - **Priority**: P0 | **Story Points**: 13
  - **Dependencies**: GOV-041
  - **Acceptance**: Assessment results recorded

- [ ] **GOV-043**: Create Finding Service
  - Create Finding entity
  - Implement finding CRUD
  - Implement remediation tracking
  - Create finding reports
  - **Priority**: P0 | **Story Points**: 13
  - **Dependencies**: GOV-042
  - **Acceptance**: Findings created and tracked

**Frontend Tasks**:

- [ ] **GOV-044**: Create Assessment Workspace
  - Create assessment setup wizard
  - Create assessment execution interface
  - Create result recording form
  - Create findings management
  - **Priority**: P0 | **Story Points**: 21
  - **Dependencies**: GOV-031
  - **Acceptance**: Assessments can be executed end-to-end

- [ ] **GOV-045**: Create Findings Tracker
  - Create findings list view
  - Create finding detail/edit form
  - Create remediation tracking
  - Add finding reports
  - **Priority**: P0 | **Story Points**: 13
  - **Dependencies**: GOV-044
  - **Acceptance**: Findings tracked and remediated

**Testing Tasks**:

- [ ] **GOV-046**: Write Assessment tests
  - Unit tests for assessment service
  - Integration tests for assessment workflow
  - E2E tests for assessment execution
  - **Priority**: P0 | **Story Points**: 8
  - **Dependencies**: GOV-041, GOV-044
  - **Acceptance**: 80%+ code coverage

---

#### Sprint 13-14 (Weeks 25-28): Evidence Repository

**Backend Tasks**:

- [ ] **GOV-047**: Create Evidence Service
  - Create Evidence entity
  - Implement evidence CRUD
  - Implement file upload/download
  - Implement evidence linking (to controls, assets, assessments)
  - Implement evidence approval workflow
  - **Priority**: P1 | **Story Points**: 13
  - **Dependencies**: GOV-027, GOV-041
  - **Acceptance**: Evidence can be uploaded and linked

- [ ] **GOV-048**: Create Evidence Expiration Tracking
  - Implement expiration date tracking
  - Create expiration alerts
  - Implement evidence refresh workflow
  - **Priority**: P1 | **Story Points**: 8
  - **Dependencies**: GOV-047
  - **Acceptance**: Expiration alerts sent

**Frontend Tasks**:

- [ ] **GOV-049**: Create Evidence Repository UI
  - Create evidence list view
  - Create evidence upload interface
  - Create evidence detail view
  - Create evidence linking interface
  - **Priority**: P1 | **Story Points**: 13
  - **Dependencies**: GOV-032, GOV-044
  - **Acceptance**: Evidence can be managed via UI

**Testing Tasks**:

- [ ] **GOV-050**: Write Evidence tests
  - Unit tests for evidence service
  - Integration tests for file upload
  - E2E tests for evidence management
  - **Priority**: P1 | **Story Points**: 5
  - **Dependencies**: GOV-047, GOV-049
  - **Acceptance**: Evidence functionality tested

---

#### Sprint 15-16 (Weeks 29-32): Standards & Baselines

**Backend Tasks**:

- [ ] **GOV-051**: Create Standards Service
  - Create Standard entity
  - Implement standards CRUD
  - Link to policies and control objectives
  - Implement compliance tracking
  - **Priority**: P0 | **Story Points**: 8
  - **Dependencies**: GOV-017
  - **Acceptance**: Standards can be created and linked

- [ ] **GOV-052**: Create Baselines Service
  - Create Baseline entity
  - Implement baselines CRUD
  - Implement configuration parameter storage
  - Link to standards
  - **Priority**: P1 | **Story Points**: 13
  - **Dependencies**: GOV-051
  - **Acceptance**: Baselines can be created

- [ ] **GOV-053**: Implement Baseline-to-Asset Assignment
  - Create baseline_asset_assignments table
  - Implement assignment service
  - Implement compliance tracking per asset
  - Create compliance reports
  - **Priority**: P1 | **Story Points**: 13
  - **Dependencies**: GOV-052, Asset Management integration
  - **Acceptance**: Baselines assigned to assets, compliance tracked

**Frontend Tasks**:

- [ ] **GOV-054**: Create Standards Management UI
  - Create standards list view
  - Create standard editor
  - Link to policies/control objectives
  - **Priority**: P0 | **Story Points**: 8
  - **Dependencies**: GOV-023
  - **Acceptance**: Standards manageable via UI

- [ ] **GOV-055**: Create Baselines Management UI
  - Create baselines list view
  - Create baseline editor
  - Create configuration parameter editor
  - Create asset assignment interface
  - **Priority**: P1 | **Story Points**: 13
  - **Dependencies**: GOV-054, Asset Management UI
  - **Acceptance**: Baselines manageable and assignable

**Testing Tasks**:

- [ ] **GOV-056**: Write Standards & Baselines tests
  - Unit tests for standards/baselines services
  - Integration tests for asset assignment
  - E2E tests for standards/baselines CRUD
  - **Priority**: P0 | **Story Points**: 5
  - **Dependencies**: GOV-051, GOV-052, GOV-054, GOV-055
  - **Acceptance**: Standards and baselines tested

---

#### Sprint 17-18 (Weeks 33-36): Control-to-Asset Integration

**Backend Tasks**:

- [ ] **GOV-057**: Create Control-Asset Mapping Service
  - Create control_asset_mappings table
  - Implement mapping service
  - Implement bulk assignment
  - Calculate asset compliance status
  - **Priority**: P0 | **Story Points**: 13
  - **Dependencies**: GOV-027, Asset Management API
  - **Acceptance**: Controls can be mapped to assets

- [ ] **GOV-058**: Create Asset Compliance Service
  - Implement compliance calculation
  - Create compliance status views
  - Generate compliance reports per asset
  - **Priority**: P0 | **Story Points**: 13
  - **Dependencies**: GOV-057
  - **Acceptance**: Asset compliance calculated correctly

- [ ] **GOV-059**: Integrate with Asset Management API
  - Create Asset Management API client
  - Implement asset fetching
  - Implement asset search
  - Create shared types/interfaces
  - **Priority**: P0 | **Story Points**: 8
  - **Dependencies**: Asset Management API available
  - **Acceptance**: Asset data accessible from Governance

**Frontend Tasks**:

- [ ] **GOV-060**: Create Control-Asset Linking UI
  - Create asset browser from control detail
  - Create bulk assignment interface
  - Show linked assets on control detail
  - Show linked controls on asset detail (in Asset Management)
  - **Priority**: P0 | **Story Points**: 13
  - **Dependencies**: GOV-032, Asset Management UI
  - **Acceptance**: Controls and assets can be linked via UI

- [ ] **GOV-061**: Create Asset Compliance View
  - Create compliance status display on asset detail
  - Create compliance dashboard
  - Show missing controls
  - Generate compliance reports
  - **Priority**: P0 | **Story Points**: 13
  - **Dependencies**: GOV-060, Asset Management UI
  - **Acceptance**: Asset compliance visible

**Testing Tasks**:

- [ ] **GOV-062**: Write Integration tests
  - Integration tests for control-asset mapping
  - Integration tests for compliance calculation
  - E2E tests for cross-module workflows
  - **Priority**: P0 | **Story Points**: 8
  - **Dependencies**: GOV-057, GOV-058, GOV-060
  - **Acceptance**: Integration tested end-to-end

---

#### Sprint 19-20 (Weeks 37-40): Advanced Reporting

**Backend Tasks**:

- [ ] **GOV-063**: Create Framework Compliance Scorecard Service
  - Implement compliance calculation per framework
  - Create scorecard data structure
  - Generate compliance trends
  - **Priority**: P0 | **Story Points**: 13
  - **Dependencies**: GOV-029, GOV-058
  - **Acceptance**: Framework compliance calculated

- [ ] **GOV-064**: Create Gap Analysis Service
  - Implement gap identification
  - Prioritize gaps by risk
  - Generate gap reports
  - **Priority**: P1 | **Story Points**: 13
  - **Dependencies**: GOV-029
  - **Acceptance**: Gaps identified and reported

- [ ] **GOV-065**: Create Audit Package Service
  - Implement audit package generation
  - Organize evidence by framework
  - Generate control matrices
  - Create ZIP export
  - **Priority**: P1 | **Story Points**: 13
  - **Dependencies**: GOV-047, GOV-063
  - **Acceptance**: Audit packages generated

**Frontend Tasks**:

- [ ] **GOV-066**: Create Framework Compliance Scorecard UI
  - Create scorecard visualization
  - Show compliance by domain
  - Add drill-down capability
  - Add export functionality
  - **Priority**: P0 | **Story Points**: 13
  - **Dependencies**: GOV-038
  - **Acceptance**: Scorecards viewable and exportable

- [ ] **GOV-067**: Create Gap Analysis UI
  - Create gap list view
  - Show prioritized gaps
  - Create gap remediation planning
  - **Priority**: P1 | **Story Points**: 8
  - **Dependencies**: GOV-066
  - **Acceptance**: Gaps visible and manageable

- [ ] **GOV-068**: Create Audit Package Generator UI
  - Create package generation interface
  - Show package contents
  - Enable download
  - **Priority**: P1 | **Story Points**: 8
  - **Dependencies**: GOV-066
  - **Acceptance**: Audit packages generatable

**Testing Tasks**:

- [ ] **GOV-069**: Write Advanced Reporting tests
  - Unit tests for scorecard service
  - Integration tests for gap analysis
  - E2E tests for audit package generation
  - **Priority**: P0 | **Story Points**: 5
  - **Dependencies**: GOV-063, GOV-064, GOV-065, GOV-066
  - **Acceptance**: Advanced reports tested

---

#### Additional Sprint (Weeks 37-40): Queue Infrastructure Enhancement

**Backend Tasks**:

- [ ] **GOV-096**: Implement Dead Letter Queue Handling
  - Create DLQ for each queue
  - Implement failed job inspection service
  - Create retry from DLQ functionality
  - Create admin endpoints for DLQ management
  - **Priority**: P1 | **Story Points**: 8
  - **Dependencies**: GOV-002A
  - **Acceptance**: Failed jobs can be inspected and retried

- [ ] **GOV-097**: Implement Job Scheduling Service
  - Create scheduled job management
  - Implement cron-based scheduling
  - Create schedule CRUD endpoints
  - Integrate with assessment and evidence collection
  - **Priority**: P1 | **Story Points**: 13
  - **Dependencies**: GOV-002A
  - **Acceptance**: Jobs can be scheduled with cron patterns

- [ ] **GOV-098**: Implement Queue Monitoring Service
  - Create queue metrics collection
  - Implement health checks
  - Create alerting for stalled jobs
  - Create queue performance dashboard data
  - **Priority**: P1 | **Story Points**: 8
  - **Dependencies**: GOV-002A
  - **Acceptance**: Queue health visible in dashboard

**Frontend Tasks**:

- [ ] **GOV-099**: Create Queue Admin Dashboard
  - Create queue status overview
  - Show active/waiting/failed counts
  - Create job inspection UI
  - Create retry/delete controls
  - **Priority**: P2 | **Story Points**: 13
  - **Dependencies**: GOV-096, GOV-097, GOV-098
  - **Acceptance**: Admins can manage queues via UI

---

### Phase 3: Operations Tasks

#### Sprint 21-22 (Weeks 41-44): SOP Management

**Backend Tasks**:

- [ ] **GOV-070**: Create SOP Service
  - Create SOP entity
  - Implement SOP CRUD
  - Implement SOP templates
  - Link to policies/standards/controls
  - **Priority**: P0 | **Story Points**: 13
  - **Dependencies**: GOV-002
  - **Acceptance**: SOPs can be created

- [ ] **GOV-071**: Create SOP Execution Tracking Service
  - Create execution entity
  - Track execution history
  - Calculate execution metrics
  - **Priority**: P1 | **Story Points**: 8
  - **Dependencies**: GOV-070
  - **Acceptance**: Executions tracked

- [ ] **GOV-072**: Create SOP Training & Acknowledgment Service
  - Create training assignment
  - Track acknowledgments
  - Implement training expiration
  - **Priority**: P1 | **Story Points**: 8
  - **Dependencies**: GOV-070
  - **Acceptance**: Training tracked

**Frontend Tasks**:

- [ ] **GOV-073**: Create SOP Management UI
  - Create SOP list view
  - Create SOP editor
  - Create SOP viewer
  - Link to related documents
  - **Priority**: P0 | **Story Points**: 13
  - **Dependencies**: GOV-004, GOV-005
  - **Acceptance**: SOPs manageable via UI

- [ ] **GOV-074**: Create SOP Execution UI
  - Create execution logging interface
  - Show execution history
  - Create execution metrics dashboard
  - **Priority**: P1 | **Story Points**: 8
  - **Dependencies**: GOV-073
  - **Acceptance**: Executions can be logged

**Testing Tasks**:

- [ ] **GOV-075**: Write SOP tests
  - Unit tests for SOP service
  - Integration tests for execution tracking
  - E2E tests for SOP lifecycle
  - **Priority**: P0 | **Story Points**: 5
  - **Dependencies**: GOV-070, GOV-073
  - **Acceptance**: SOP functionality tested

---

#### Sprint 23-24 (Weeks 45-48): Control Testing

**Backend Tasks**:

- [ ] **GOV-076**: Create Control Testing Service
  - Create test entity
  - Implement test scheduling
  - Track test history
  - Implement test reminders
  - **Priority**: P1 | **Story Points**: 13
  - **Dependencies**: GOV-027
  - **Acceptance**: Tests can be scheduled and tracked

**Frontend Tasks**:

- [ ] **GOV-077**: Create Control Testing UI
  - Create test schedule interface
  - Create test execution interface
  - Show test history
  - Create test dashboard
  - **Priority**: P1 | **Story Points**: 8
  - **Dependencies**: GOV-032
  - **Acceptance**: Tests manageable via UI

**Testing Tasks**:

- [ ] **GOV-078**: Write Control Testing tests
  - Unit tests for testing service
  - Integration tests for test scheduling
  - E2E tests for test execution
  - **Priority**: P1 | **Story Points**: 5
  - **Dependencies**: GOV-076, GOV-077
  - **Acceptance**: Testing functionality tested

---

#### Sprint 25-26 (Weeks 49-52): Exception Management

**Backend Tasks**:

- [ ] **GOV-079**: Create Exception Service
  - Create exception entity
  - Implement exception workflow
  - Track exception expiration
  - Implement exception renewal
  - **Priority**: P1 | **Story Points**: 13
  - **Dependencies**: GOV-016, GOV-027
  - **Acceptance**: Exceptions can be requested and approved

**Frontend Tasks**:

- [ ] **GOV-080**: Create Exception Management UI
  - Create exception request form
  - Create exception approval interface
  - Show exception list
  - Create exception expiration alerts
  - **Priority**: P1 | **Story Points**: 8
  - **Dependencies**: GOV-022, GOV-032
  - **Acceptance**: Exceptions manageable via UI

**Testing Tasks**:

- [ ] **GOV-081**: Write Exception tests
  - Unit tests for exception service
  - Integration tests for exception workflow
  - E2E tests for exception lifecycle
  - **Priority**: P1 | **Story Points**: 5
  - **Dependencies**: GOV-079, GOV-080
  - **Acceptance**: Exception functionality tested

---

#### Sprint 27-28 (Weeks 53-56): Traceability & Notifications

**Backend Tasks**:

- [ ] **GOV-082**: Create Traceability Service
  - Implement traceability matrix generation
  - Create dependency tracking
  - Implement impact analysis
  - **Priority**: P1 | **Story Points**: 13
  - **Dependencies**: GOV-007, GOV-016, GOV-027, GOV-057
  - **Acceptance**: Traceability matrix generated

- [ ] **GOV-083**: Create Notification Service
  - Implement notification triggers
  - Create notification templates
  - Implement email notifications
  - Implement in-app notifications
  - **Priority**: P1 | **Story Points**: 13
  - **Dependencies**: GOV-003
  - **Acceptance**: Notifications sent correctly

**Frontend Tasks**:

- [ ] **GOV-084**: Create Traceability Matrix UI
  - Create matrix visualization
  - Show complete chains
  - Highlight gaps
  - Enable drill-down
  - **Priority**: P1 | **Story Points**: 13
  - **Dependencies**: GOV-004
  - **Acceptance**: Traceability matrix visual

- [ ] **GOV-085**: Create Notification Center UI
  - Create notification list
  - Show notification details
  - Implement notification actions
  - **Priority**: P1 | **Story Points**: 5
  - **Dependencies**: GOV-004
  - **Acceptance**: Notifications viewable

**Testing Tasks**:

- [ ] **GOV-086**: Write Traceability & Notification tests
  - Unit tests for traceability service
  - Integration tests for notifications
  - E2E tests for traceability matrix
  - **Priority**: P1 | **Story Points**: 5
  - **Dependencies**: GOV-082, GOV-083, GOV-084
  - **Acceptance**: Traceability and notifications tested

---

### Phase 4: Optimization Tasks

#### Sprint 29-30 (Weeks 57-60): Automation & Integrations

**Backend Tasks**:

- [ ] **GOV-087**: Create Automated Evidence Collection Service
  - Integrate with SIEM systems
  - Integrate with vulnerability scanners
  - Implement scheduled evidence collection
  - **Priority**: P2 | **Story Points**: 21
  - **Dependencies**: GOV-047
  - **Acceptance**: Evidence auto-collected from tools

- [ ] **GOV-088**: Create External API Integration Service
  - Create API gateway for external access
  - Implement API authentication
  - Create webhook support
  - **Priority**: P2 | **Story Points**: 13
  - **Dependencies**: GOV-002
  - **Acceptance**: External APIs accessible

**Frontend Tasks**:

- [ ] **GOV-089**: Create Integration Management UI
  - Create integration configuration interface
  - Show integration status
  - Create integration logs view
  - **Priority**: P2 | **Story Points**: 8
  - **Dependencies**: GOV-087, GOV-088
  - **Acceptance**: Integrations manageable via UI

**Testing Tasks**:

- [ ] **GOV-090**: Write Integration tests
  - Integration tests for evidence collection
  - Integration tests for external APIs
  - E2E tests for automation workflows
  - **Priority**: P2 | **Story Points**: 5
  - **Dependencies**: GOV-087, GOV-088, GOV-089
  - **Acceptance**: Integrations tested

---

#### Sprint 31-32 (Weeks 61-64): Advanced Analytics

**Backend Tasks**:

- [ ] **GOV-091**: Create Predictive Analytics Service
  - Implement compliance prediction
  - Create risk scoring
  - Implement trend analysis
  - **Priority**: P2 | **Story Points**: 21
  - **Dependencies**: GOV-063, GOV-064
  - **Acceptance**: Predictions generated

- [ ] **GOV-092**: Create Custom Report Builder Service
  - Implement report template creation
  - Implement dynamic report generation
  - Create report scheduling
  - **Priority**: P2 | **Story Points**: 21
  - **Dependencies**: GOV-037
  - **Acceptance**: Custom reports generatable

**Frontend Tasks**:

- [ ] **GOV-093**: Create Predictive Analytics UI
  - Create prediction dashboards
  - Show risk scores
  - Display trends
  - **Priority**: P2 | **Story Points**: 13
  - **Dependencies**: GOV-091
  - **Acceptance**: Analytics viewable

- [ ] **GOV-094**: Create Custom Report Builder UI
  - Create report builder interface
  - Enable field selection
  - Enable filtering and grouping
  - **Priority**: P2 | **Story Points**: 21
  - **Dependencies**: GOV-092
  - **Acceptance**: Custom reports buildable

**Testing Tasks**:

- [ ] **GOV-095**: Write Analytics tests
  - Unit tests for analytics service
  - Integration tests for report builder
  - E2E tests for analytics workflows
  - **Priority**: P2 | **Story Points**: 5
  - **Dependencies**: GOV-091, GOV-092, GOV-093, GOV-094
  - **Acceptance**: Analytics tested

---

## Integration Points

### Database Integration

**Shared Tables** (Already exist in Asset Management):
- `users` - User accounts
- `roles` - User roles
- `business_units` - Organizational units
- `audit_logs` - Audit trail
- `tags` - Tagging system
- `notifications` - Notifications

**New Shared Tables** (For Queue Management):
- `job_status` - Track async job status for UI polling

**Cross-Module References**:
- `control_asset_mappings` - Links controls to assets (asset_type, asset_id)
- `baseline_asset_assignments` - Links baselines to assets
- `evidence_linkages` - Links evidence to assets

### API Integration

**Asset Management API Endpoints to Use**:
```
GET  /api/v1/assets/physical/:id
GET  /api/v1/assets/information/:id
GET  /api/v1/assets/applications/:id
GET  /api/v1/assets/software/:id
GET  /api/v1/assets/suppliers/:id
GET  /api/v1/assets/search?q=...
```

**Governance API Endpoints to Expose**:
```
# Synchronous Endpoints
GET  /api/v1/governance/controls/:id
GET  /api/v1/governance/controls/:id/assets
GET  /api/v1/governance/assets/:type/:id/compliance
GET  /api/v1/governance/assets/:type/:id/controls

# Asynchronous Endpoints (Return 202 Accepted)
POST /api/v1/governance/reports/generate
GET  /api/v1/governance/reports/:id/status
GET  /api/v1/governance/reports/:id/download

POST /api/v1/governance/policies/:id/publish
GET  /api/v1/governance/policies/:id/distribution-status

POST /api/v1/governance/audit-packages/generate
GET  /api/v1/governance/audit-packages/:id/status
GET  /api/v1/governance/audit-packages/:id/download

POST /api/v1/governance/imports/influencers
POST /api/v1/governance/imports/controls
GET  /api/v1/governance/imports/:id/status

# Queue Admin Endpoints
GET  /api/v1/admin/queues/status
GET  /api/v1/admin/queues/:name/jobs
POST /api/v1/admin/queues/:name/jobs/:id/retry
DELETE /api/v1/admin/queues/:name/jobs/:id
```

### UI Integration

**Navigation Updates**:
- Add "Governance" section to main navigation
- Add "Controls" link to asset detail pages
- Add "Compliance Status" widget to asset detail pages
- Add "Assets" link to control detail pages
- Add "Queue Status" to admin section

**Shared Components**:
- Reuse table components
- Reuse form components
- Reuse modal components
- Reuse search components
- Create AsyncOperationStatus component
- Create JobProgressIndicator component

---

## Technical Architecture

### Backend Structure

```
backend/src/
├── governance/
│   ├── governance.module.ts
│   ├── influencers/
│   │   ├── influencers.module.ts
│   │   ├── influencers.service.ts
│   │   ├── influencers.controller.ts
│   │   ├── entities/
│   │   ├── dto/
│   │   └── interfaces/
│   ├── policies/
│   │   ├── policies.module.ts
│   │   ├── policies.service.ts
│   │   ├── policies.controller.ts
│   │   ├── processors/
│   │   │   └── policy-distribution.processor.ts
│   │   ├── entities/
│   │   └── dto/
│   ├── controls/
│   ├── assessments/
│   ├── evidence/
│   │   ├── processors/
│   │   │   └── evidence-collection.processor.ts
│   ├── sops/
│   ├── reporting/
│   │   ├── processors/
│   │   │   └── report-generation.processor.ts
│   ├── queues/
│   │   ├── governance-queues.module.ts
│   │   ├── queue-monitor.service.ts
│   │   ├── job-status.service.ts
│   │   └── interfaces/
│   │       ├── policy-distribution.job.ts
│   │       ├── report-generation.job.ts
│   │       ├── evidence-collection.job.ts
│   │       └── audit-package.job.ts
│   └── shared/
│       ├── services/
│       └── utils/
```

### Frontend Structure

```
frontend/src/
├── app/
│   └── governance/
│       ├── influencers/
│       ├── policies/
│       ├── controls/
│       ├── assessments/
│       ├── evidence/
│       ├── sops/
│       ├── reports/
│       └── admin/
│           └── queues/
├── components/
│   └── governance/
│       ├── AsyncOperationStatus.tsx
│       ├── JobProgressIndicator.tsx
│       └── QueueStatusWidget.tsx
└── lib/
    └── governance/
        └── hooks/
            └── useJobStatus.ts
```

### Queue Architecture

See [Bull Queue Governance Flows](./BULL_QUEUE_GOVERNANCE_FLOWS.md) for detailed queue implementation patterns.

```
┌─────────────────────────────────────────────────────────────┐
│                        Redis                                 │
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                   Bull Queues                            │ │
│  │                                                          │ │
│  │  governance:policy      governance:assessment            │ │
│  │  governance:reporting   governance:evidence              │ │
│  │  governance:notification governance:export               │ │
│  │  governance:audit       governance:import                │ │
│  │                                                          │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                               │
└─────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────┐
│                    Queue Processors                          │
│                                                               │
│  PolicyDistributionProcessor    AssessmentScheduleProcessor │
│  ReportGenerationProcessor      EvidenceCollectionProcessor │
│  NotificationProcessor          ExportProcessor              │
│  AuditPackageProcessor          ImportProcessor              │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## Database Migration Plan

### Migration Strategy

1. **Create Governance Schema** (Phase 1, Sprint 1)
   - Create all enum types
   - Create all tables
   - Create indexes
   - Create triggers
   - Create views
   - Create functions

2. **Create Queue Support Tables** (Phase 1, Sprint 1)
   - Create job_status table for UI polling
   - Create scheduled_jobs table for cron management

3. **Seed Initial Data** (Phase 1, Sprint 2)
   - Seed compliance frameworks (NCA, ISO 27001, etc.)
   - Seed control domains
   - Seed policy templates

4. **Data Migration** (If migrating from existing system)
   - Export existing data
   - Transform to new schema
   - Import via queue jobs (for large datasets)
   - Validate data integrity

### Migration Scripts

```sql
-- Migration: 001_create_governance_schema.sql
-- Creates all governance tables, enums, indexes, triggers, views

-- Migration: 002_create_queue_support_tables.sql
-- Creates tables for queue job tracking

-- Migration: 003_seed_frameworks.sql
-- Seeds initial compliance frameworks

-- Migration: 004_seed_control_domains.sql
-- Seeds control domains

-- Migration: 005_create_integration_tables.sql
-- Creates cross-module integration tables
```

---

## Testing Strategy

### Unit Testing

- **Backend**: Jest + NestJS testing utilities
- **Frontend**: Jest + React Testing Library
- **Coverage Target**: 80%+
- **Queue Testing**: Bull Queue mock utilities

### Integration Testing

- **API Testing**: Supertest
- **Database Testing**: Test database with transactions
- **Service Testing**: Mock external dependencies
- **Queue Testing**: Test queue producers and processors

### E2E Testing

- **Framework**: Playwright
- **Scenarios**: Critical user journeys including async operations
- **Coverage**: All P0 user stories

### Queue Testing Patterns

```typescript
// Example: Testing a queue processor
describe('PolicyDistributionProcessor', () => {
  let processor: PolicyDistributionProcessor;
  let mockQueue: jest.Mocked<Queue>;

  beforeEach(() => {
    mockQueue = createMockQueue();
    processor = new PolicyDistributionProcessor(/* deps */);
  });

  it('should distribute policy to all recipients', async () => {
    const job = createMockJob({
      policyId: 'policy-123',
      recipientIds: ['user-1', 'user-2', 'user-3'],
    });

    const result = await processor.handlePolicyDistribution(job);

    expect(result.success).toBe(true);
    expect(result.distributed).toBe(3);
  });

  it('should update progress during distribution', async () => {
    const job = createMockJob({
      policyId: 'policy-123',
      recipientIds: Array(100).fill('user-id'),
    });

    await processor.handlePolicyDistribution(job);

    expect(job.progress).toHaveBeenCalledWith(expect.any(Number));
  });
});
```

---

## Risk Management

### Technical Risks

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| Database performance with large datasets | Medium | High | Optimize queries, add indexes, implement pagination |
| Integration complexity with Asset Management | Medium | High | Clear API contracts, integration tests, incremental integration |
| Control library development time | High | Medium | Start with framework imports, leverage existing standards |
| Approval workflow complexity | Medium | Medium | Use workflow engine library, simplify initial workflows |
| Queue job failures | Medium | Medium | Implement retries, DLQ, monitoring, alerting |
| Redis availability | Low | High | Redis cluster, connection pooling, circuit breakers |

### Business Risks

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| User adoption resistance | Medium | High | Change management, training, executive sponsorship |
| Scope creep | High | Medium | Strict change control, prioritization framework |
| Resource availability | Medium | High | Resource planning, cross-training |

---

## Success Metrics

### Phase 1 Metrics

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| Influencers documented | 50+ | Database count |
| Policies created and approved | 20+ | Database count with status |
| Controls in library | 100+ | Database count |
| Queue infrastructure operational | 100% | Health check passing |
| User satisfaction | > 7/10 | Survey |

### Phase 2 Metrics

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| Controls with 5+ mappings | 500+ | Average mapping count |
| Frameworks fully mapped | 2+ | Coverage > 90% |
| Critical assets linked | 90% | Assets with controls / Total critical |
| Audit package generation | < 2 hours | End-to-end timing |
| Queue job success rate | > 99% | Completed / (Completed + Failed) |

### Phase 3 Metrics

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| SOPs documented | 50+ | Database count |
| Controls tested in cycle | 80% | Tested / Total |
| Traceability | Complete | Audit verification |
| Audit prep time reduction | 50% | Before/after comparison |
| Scheduled job reliability | 99.5% | Jobs executed / Jobs scheduled |

### Phase 4 Metrics

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| Evidence auto-collected | 30% | Auto / Total evidence |
| Prediction accuracy | > 85% | Prediction vs actual |
| API consumers | 2+ | Active API keys |
| Page load time | < 1 second | Performance monitoring |
| Queue throughput | > 1000/hour | Jobs processed per hour |

---

## Appendix

### Task Priority Legend

- **P0 (Must Have)**: Critical for MVP, core functionality
- **P1 (Should Have)**: Important for full product, delivers significant value
- **P2 (Nice to Have)**: Enhancement features, can be deferred to later phases

### Story Points Legend

| Points | Complexity | Example |
|--------|-----------|---------|
| 1-3 | Simple | Single CRUD endpoint |
| 5 | Moderate | Service with validation |
| 8 | Complex | Multi-entity workflow |
| 13 | Very Complex | Integration with external system |
| 21 | Highly Complex | Complete feature module |

### Dependencies Legend

- **None**: No dependencies
- **GOV-XXX**: Depends on another Governance task
- **Asset Management**: Depends on Asset Management module
- **External**: Depends on external system/service

### Queue Job Types Reference

| Queue | Job Type | Description |
|-------|----------|-------------|
| governance:policy | DISTRIBUTE_POLICY | Send policy to assigned users |
| governance:assessment | SCHEDULE_ASSESSMENT | Create scheduled assessment |
| governance:reporting | GENERATE_REPORT | Generate PDF/Excel report |
| governance:evidence | FETCH_EVIDENCE | Collect from integrations |
| governance:notification | SEND_NOTIFICATION | Email/in-app notification |
| governance:export | EXPORT_DATA | Bulk data export |
| governance:audit | GENERATE_AUDIT_PACKAGE | Create audit ZIP |
| governance:import | IMPORT_CONTROLS | Bulk control import |

---

## Conclusion

This implementation plan provides a comprehensive roadmap for building the Governance Module with integrated Bull Queue infrastructure for async operations. The phased approach ensures incremental delivery of value while maintaining quality and managing risks.

**Next Steps**:
1. Review and approve this plan
2. Assign resources to Phase 1 tasks
3. Set up development environment including Redis
4. Begin Sprint 1 tasks (GOV-001, GOV-002, GOV-002A)

**Questions or Concerns?**
Please raise them during the planning review meeting.
