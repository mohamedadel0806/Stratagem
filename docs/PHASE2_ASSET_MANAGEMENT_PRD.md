# Product Requirements Document (PRD)
## Phase 2: Asset Management Module

**Target Markets:** Saudi Arabia, UAE, Egypt  
**Platforms:** Web (Next.js 14 + React 18 + TypeScript frontend, Node.js/NestJS + FastAPI backend services)  
**Document Version:** 1.0  
**Date:** 2024  
**Author:** Product Team

---

## 1. Executive Summary

### 1.1 Overview

Phase 2 introduces the **Asset Management Module** as the first core GRC functionality after completing Phase 1 (Marketing Site + Authentication). This module enables cybersecurity teams to maintain comprehensive asset inventories supporting risk assessments, compliance audits, and security operations.

### 1.2 Business Objectives

- Enable cybersecurity teams to maintain accurate, up-to-date asset inventories
- Support risk assessment and compliance workflows with comprehensive asset data
- Integrate with existing enterprise systems (CMDB, asset management tools)
- Reduce manual data entry through bulk import and API integrations
- Provide visibility into asset relationships and dependencies
- Establish foundation for future risk and compliance modules

### 1.3 Success Metrics

- **Adoption Rate**: 90% of cybersecurity team members actively using the system within 3 months
- **Data Completeness**: 95% of critical assets have all required fields populated
- **Time Savings**: 50% reduction in time spent gathering asset information for assessments
- **Integration Success**: Successfully integrate with at least 2 enterprise systems
- **User Satisfaction**: NPS score of 40+ from cybersecurity team

### 1.4 Dependencies

**Prerequisites (Phase 1 Complete):**
- ✅ Public marketing site deployed
- ✅ Authentication system (Keycloak + NextAuth) operational
- ✅ Application shell with navigation and dashboard
- ✅ User management and RBAC foundation
- ✅ Database infrastructure (PostgreSQL) ready

---

## 2. Goals and Non-Goals

### Goals

1. **Core Asset Management**: Support 5 asset types (Physical, Information, Applications, Software, Suppliers)
2. **Data Import**: CSV/Excel file import with field mapping and validation
3. **Search & Discovery**: Global search and advanced filtering across all asset types
4. **Asset Relationships**: Track dependencies and relationships between assets
5. **Audit Trail**: Complete change history and audit logging
6. **Basic Reporting**: Dashboard metrics and data export capabilities
7. **API Integration**: RESTful API for external system integration (CMDB, etc.)

### Non-Goals (Deferred to Future Phases)

- Automated asset discovery/scanning
- Vulnerability management integration
- Ticketing system integration
- Mobile application
- Advanced analytics and ML-based insights
- Asset lifecycle management (procurement, disposal)
- Real-time network monitoring
- Automated compliance scoring
- Arabic localization (English-only for Phase 2)

---

## 3. User Personas

| Persona | Description | Primary Needs |
|---------|-------------|---------------|
| **Cybersecurity Analyst** | Day-to-day asset inventory management | Quick data entry, bulk import, search, filtering |
| **Security Architect** | Strategic asset oversight | Relationship mapping, dependency analysis, compliance tracking |
| **Compliance Officer** | Compliance-focused asset tracking | Compliance tagging, audit trails, reporting |
| **IT Asset Manager** | IT asset lifecycle management | Software tracking, license management, vendor information |
| **System Administrator** | System configuration and integration | API setup, field customization, user permissions |

---

## 4. Implementation Phases

### Phase 2.1: Foundation (Sprint 1-2, Weeks 1-4)

**Focus**: Core infrastructure and Physical Assets

**Deliverables:**
- Database schema implementation (PostgreSQL)
- Backend API for Physical Assets (NestJS)
- Frontend UI for Physical Asset CRUD (Next.js)
- Basic search and filtering
- Asset ownership management
- Audit logging foundation

**User Stories (P0 - Must Have):**
- 2.1: Add Physical Asset
- 2.2: View Physical Asset Details
- 2.4: Search and Filter Physical Assets
- 7.1: Asset Ownership Management
- 7.2: Universal Asset Search
- 8.2: User Access Control

### Phase 2.2: Data Import (Sprint 3-4, Weeks 5-8)

**Focus**: File import capabilities

**Deliverables:**
- CSV file import with field mapping
- Excel file import (.xlsx, .xls)
- Import preview and validation
- Error reporting and logging
- Import history tracking

**User Stories (P0 - Must Have):**
- 1.1: CSV File Import
- 1.2: Excel File Import

**User Stories (P1 - Should Have):**
- 1.3: CMDB Integration (API foundation)
- 1.4: Asset Management System Integration

### Phase 2.3: Additional Asset Types (Sprint 5-6, Weeks 9-12)

**Focus**: Information Assets, Business Applications, Software, Suppliers

**Deliverables:**
- Information Assets CRUD
- Business Applications CRUD
- Software Assets CRUD
- Suppliers/Third Parties CRUD
- Asset type-specific forms and validations

**User Stories (P1 - Should Have):**
- 3.1: Add Information Asset
- 4.1: Add Business Application
- 5.1: Add Software Asset
- 6.1: Add Third Party/Supplier

### Phase 2.4: Relationships & Advanced Features (Sprint 7-8, Weeks 13-16)

**Focus**: Asset relationships, dependencies, and advanced capabilities

**Deliverables:**
- Asset dependency management
- Relationship visualization
- Bulk operations
- Enhanced reporting
- Dashboard analytics

**User Stories (P1 - Should Have):**
- 2.3: Update Physical Asset
- 7.5: Asset Audit Trail
- 7.7: Asset Dashboard and Analytics
- 8.1: Configure Asset Fields

**User Stories (P2 - Nice to Have):**
- 2.5: Track Network Connectivity Status
- 2.6: Manage Asset Dependencies
- 7.3: Asset Relationship Mapping
- 7.4: Bulk Asset Operations
- 7.8: Asset Export and Reporting

---

## 5. Technical Architecture

### 5.1 Technology Stack Alignment

**Frontend (Next.js 14 + React 18 + TypeScript):**
- Component Library: shadcn/ui + Tailwind CSS
- Forms: React Hook Form + Zod validation
- Data Fetching: TanStack Query (React Query)
- State Management: Zustand
- File Upload: react-dropzone
- Charts: Recharts
- Tables: TanStack Table

**Backend (NestJS + TypeScript):**
- Framework: NestJS (microservices-ready)
- Database ORM: TypeORM or Prisma
- Validation: class-validator + class-transformer
- File Processing: multer, csv-parser, xlsx
- API Documentation: Swagger/OpenAPI

**Database (PostgreSQL 15+):**
- Primary database for all asset data
- JSONB for flexible attributes
- Full-text search capabilities
- Audit logging tables
- Relationship tables

**File Storage:**
- MinIO or AWS S3 for document storage
- Security test reports
- Import files (temporary)

### 5.2 Database Schema

**Core Tables:**
- `users` (from Phase 1)
- `roles` (from Phase 1)
- `business_units` (from Phase 1)
- `asset_types` (lookup table)
- `physical_assets`
- `information_assets`
- `business_applications`
- `software_assets`
- `suppliers`
- `asset_dependencies` (relationships)
- `audit_logs`
- `import_logs`

**See ASSET_MGNT.md for complete schema definition**

### 5.3 API Design

**Base URL:** `/api/v1/assets`

**Endpoints:**

```
# Physical Assets
GET    /api/v1/assets/physical              # List with filters
GET    /api/v1/assets/physical/:id           # Get details
POST   /api/v1/assets/physical               # Create
PUT    /api/v1/assets/physical/:id           # Update
DELETE /api/v1/assets/physical/:id           # Soft delete

# Information Assets
GET    /api/v1/assets/information
GET    /api/v1/assets/information/:id
POST   /api/v1/assets/information
PUT    /api/v1/assets/information/:id
DELETE /api/v1/assets/information/:id

# Business Applications
GET    /api/v1/assets/applications
GET    /api/v1/assets/applications/:id
POST   /api/v1/assets/applications
PUT    /api/v1/assets/applications/:id
DELETE /api/v1/assets/applications/:id

# Software Assets
GET    /api/v1/assets/software
GET    /api/v1/assets/software/:id
POST   /api/v1/assets/software
PUT    /api/v1/assets/software/:id
DELETE /api/v1/assets/software/:id

# Suppliers
GET    /api/v1/assets/suppliers
GET    /api/v1/assets/suppliers/:id
POST   /api/v1/assets/suppliers
PUT    /api/v1/assets/suppliers/:id
DELETE /api/v1/assets/suppliers/:id

# Universal Operations
GET    /api/v1/assets/search?q=...           # Global search
POST   /api/v1/assets/import                 # Bulk import
GET    /api/v1/assets/export                 # Export filtered results
GET    /api/v1/assets/:type/:id/dependencies # Get dependencies
POST   /api/v1/assets/:type/:id/dependencies # Add dependency
DELETE /api/v1/assets/:type/:id/dependencies/:depId

# Audit
GET    /api/v1/assets/:type/:id/audit       # Audit trail
```

### 5.4 File Import Architecture

**Import Flow:**
```
1. User uploads file (CSV/Excel)
2. Backend validates file format
3. Backend parses file (first 10 rows for preview)
4. Frontend displays preview with field mapping UI
5. User maps CSV columns to system fields
6. Backend validates mapped data
7. Backend processes import (async job)
8. Frontend shows progress/status
9. Backend generates error report (if any)
10. Frontend displays results summary
```

**Technology:**
- File Upload: Multipart form data
- CSV Parsing: `csv-parser` (Node.js)
- Excel Parsing: `xlsx` library
- Async Processing: Bull Queue (Redis) or database job queue
- Error Reporting: JSON file stored in object storage

---

## 6. User Interface Requirements

### 6.1 Navigation Updates

**Add to Main Navigation:**
- Assets (dropdown)
  - Physical Assets
  - Information Assets
  - Applications
  - Software
  - Suppliers
  - All Assets (unified view)
- Import (new menu item)
- Reports (new menu item)

### 6.2 Key Screens

#### 6.2.1 Asset List View

**Layout:**
- Filterable table with key columns
- Bulk selection checkboxes
- Sort by any column
- Pagination (25, 50, 100 records per page)
- Quick actions: View, Edit, Delete
- Export button
- Add New Asset button

**Columns (Physical Assets example):**
- Checkbox (bulk select)
- Asset Description
- Asset Type
- Owner
- Business Unit
- Criticality Level
- Connectivity Status
- Last Modified
- Actions (View, Edit, Delete)

#### 6.2.2 Asset Detail View

**Layout:**
- Tabbed interface:
  - Overview (all attributes)
  - Relationships (dependencies)
  - Audit History
  - Security Tests (future)
- Edit button (permission-based)
- Related assets section with clickable links
- Compliance tags prominently displayed
- Last modified information
- Export to PDF button

#### 6.2.3 Asset Create/Edit Form

**Layout:**
- Multi-section form with logical grouping
- Required field indicators (*)
- Field validation with inline error messages
- Auto-save draft capability (localStorage)
- Cancel and Save buttons
- Progress indicator for multi-step forms

**Sections (Physical Asset example):**
1. Basic Information
2. Location & Network
3. Ownership & Business Context
4. Compliance & Security
5. Additional Metadata

#### 6.2.4 Import Wizard

**Steps:**
1. **Upload File**: Drag & drop or file picker
2. **Select Asset Type**: Choose which asset type to import
3. **Map Fields**: Map CSV columns to system fields
4. **Preview Data**: Review first 10 rows with mapped fields
5. **Confirm & Import**: Start import process
6. **Results**: Show success/failure summary with error report download

#### 6.2.5 Dashboard Widgets (Update Phase 1 Dashboard)

**New Widgets:**
- Total Assets by Type (pie chart)
- Assets by Criticality (bar chart)
- Assets Without Owners (list)
- Recent Asset Changes (activity feed)
- Import Status (recent imports)
- Compliance Coverage (by framework)

### 6.3 Design System Integration

**Components to Build/Extend:**
- `AssetTable` - Reusable table component
- `AssetForm` - Dynamic form builder
- `AssetCard` - Card view for assets
- `ImportWizard` - Multi-step import flow
- `FieldMapper` - CSV column mapping UI
- `DependencyGraph` - Visual relationship diagram
- `AuditTimeline` - Audit log visualization
- `BulkActionBar` - Bulk operations toolbar

---

## 7. Functional Requirements

### 7.1 Physical Asset Management

**FR-PA-001**: System shall support CRUD operations for physical assets  
**FR-PA-002**: System shall capture all 25+ attributes defined in specification  
**FR-PA-003**: System shall validate unique identifiers to prevent duplicates  
**FR-PA-004**: System shall support asset categorization by type  
**FR-PA-005**: System shall track connectivity status and network approval  
**FR-PA-006**: System shall link security test results to assets (future)  
**FR-PA-007**: System shall support multiple IP and MAC addresses per asset

### 7.2 Information Asset Management

**FR-IA-001**: System shall support CRUD operations for information assets  
**FR-IA-002**: System shall enforce data classification per organizational policy  
**FR-IA-003**: System shall track reclassification dates and trigger reminders  
**FR-IA-004**: System shall support multiple compliance requirements per asset  
**FR-IA-005**: System shall distinguish between information owner and custodian

### 7.3 Business Application Management

**FR-BA-001**: System shall support CRUD operations for business applications  
**FR-BA-002**: System shall track version, patch level, and vendor information  
**FR-BA-003**: System shall categorize types of data processed by applications  
**FR-BA-004**: System shall link applications to security test results (future)  
**FR-BA-005**: System shall store vendor contact information

### 7.4 Software Asset Management

**FR-SA-001**: System shall support CRUD operations for software assets  
**FR-SA-002**: System shall track software versions and patch levels  
**FR-SA-003**: System shall categorize software by type  
**FR-SA-004**: System shall store licensing and vendor information  
**FR-SA-005**: System shall link software to physical assets where installed

### 7.5 Third Party and Supplier Management

**FR-TP-001**: System shall support CRUD operations for third parties/suppliers  
**FR-TP-002**: System shall auto-generate unique identifiers  
**FR-TP-003**: System shall track contract references and criticality levels  
**FR-TP-004**: System shall support multiple contact persons per supplier  
**FR-TP-005**: System shall track goods/services provided

### 7.6 Data Import and Integration

**FR-FI-001**: System shall support CSV file import with configurable field mapping  
**FR-FI-002**: System shall support Excel (.xlsx, .xls) file import  
**FR-FI-003**: System shall validate data format and types before import  
**FR-FI-004**: System shall provide import preview (first 10 rows)  
**FR-FI-005**: System shall generate error reports for failed imports  
**FR-FI-006**: System shall support update existing records via import  
**FR-FI-007**: System shall log all import activities

**FR-API-001**: System shall provide RESTful API endpoints for all asset types  
**FR-API-002**: System shall support API key authentication  
**FR-API-003**: System shall support OAuth 2.0 authentication  
**FR-API-004**: System shall enable scheduled data synchronization (future)  
**FR-API-005**: System shall provide configurable field mapping for integrations  
**FR-API-006**: System shall handle duplicate detection via unique identifiers  
**FR-API-007**: System shall provide webhook support for real-time updates (future)  
**FR-API-008**: System shall log all API transactions

### 7.7 Search and Discovery

**FR-SD-001**: System shall provide global full-text search across all asset types  
**FR-SD-002**: System shall support advanced filtering by any field  
**FR-SD-003**: System shall allow multiple simultaneous filters  
**FR-SD-004**: System shall support saved search configurations  
**FR-SD-005**: System shall provide search autocomplete/suggestions  
**FR-SD-006**: System shall display search results with sortable columns  
**FR-SD-007**: System shall show asset type in search results

### 7.8 Relationships and Dependencies

**FR-RD-001**: System shall support defining dependencies between assets  
**FR-RD-002**: System shall display bidirectional relationships  
**FR-RD-003**: System shall provide visual dependency mapping  
**FR-RD-004**: System shall show dependency chains (multi-level)  
**FR-RD-005**: System shall warn users when modifying assets with dependencies  
**FR-RD-006**: System shall support linking physical assets to applications  
**FR-RD-007**: System shall support linking applications to information assets

### 7.9 Audit and Compliance

**FR-AC-001**: System shall maintain immutable audit logs for all changes  
**FR-AC-002**: System shall record who, what, when, why for each change  
**FR-AC-003**: System shall provide audit log filtering and search  
**FR-AC-004**: System shall support audit log export (CSV, PDF)  
**FR-AC-005**: System shall track compliance scope for each asset  
**FR-AC-006**: System shall generate compliance reports by regulation  
**FR-AC-007**: System shall retain audit logs per organizational policy

### 7.10 Reporting and Analytics

**FR-RA-001**: System shall provide dashboard with key metrics  
**FR-RA-002**: System shall support asset export to CSV, Excel, PDF  
**FR-RA-003**: System shall allow custom field selection for exports  
**FR-RA-004**: System shall provide pre-built report templates  
**FR-RA-005**: System shall display asset counts by type and criticality  
**FR-RA-006**: System shall identify assets missing required information  
**FR-RA-007**: System shall show assets by compliance scope  
**FR-RA-008**: System shall provide assets without owners report

---

## 8. Non-Functional Requirements

### 8.1 Performance

**NFR-P-001**: Page load time shall not exceed 2 seconds for standard queries  
**NFR-P-002**: Search results shall return within 1 second for datasets up to 10,000 assets  
**NFR-P-003**: System shall support concurrent users: 50 active users minimum  
**NFR-P-004**: Bulk import shall process 1,000 records in under 60 seconds  
**NFR-P-005**: API response time shall not exceed 500ms for standard requests

### 8.2 Scalability

**NFR-S-001**: System shall support up to 100,000 total assets across all types  
**NFR-S-002**: Database shall be horizontally scalable  
**NFR-S-003**: System shall support adding new asset types without code changes (future)

### 8.3 Security

**NFR-SEC-001**: All data transmission shall use TLS 1.2 or higher  
**NFR-SEC-002**: All passwords shall be hashed using bcrypt or stronger  
**NFR-SEC-003**: API keys shall be encrypted at rest  
**NFR-SEC-004**: System shall prevent SQL injection attacks  
**NFR-SEC-005**: System shall prevent XSS attacks  
**NFR-SEC-006**: System shall implement CSRF protection  
**NFR-SEC-007**: System shall enforce principle of least privilege  
**NFR-SEC-008**: Sensitive data shall be encrypted at rest (AES-256)

### 8.4 Availability

**NFR-A-001**: System uptime shall be 99.5% during business hours  
**NFR-A-002**: Planned maintenance windows shall be communicated 48 hours in advance  
**NFR-A-003**: System shall support database backup every 24 hours  
**NFR-A-004**: Recovery Time Objective (RTO): 4 hours  
**NFR-A-005**: Recovery Point Objective (RPO): 24 hours

### 8.5 Usability

**NFR-U-001**: System shall be accessible via modern web browsers (Chrome, Firefox, Edge, Safari)  
**NFR-U-002**: UI shall be responsive for desktop and tablet devices  
**NFR-U-003**: System shall comply with WCAG 2.1 Level AA accessibility standards  
**NFR-U-004**: New users shall complete basic asset creation within 10 minutes of training  
**NFR-U-005**: System shall provide contextual help and tooltips

---

## 9. Implementation Roadmap

### Sprint 1-2 (Weeks 1-4): Foundation

**Backend:**
- [ ] Database schema implementation (PostgreSQL)
- [ ] Physical Assets API (CRUD endpoints)
- [ ] Authentication middleware integration
- [ ] Audit logging service
- [ ] Basic search API

**Frontend:**
- [ ] Asset list view component
- [ ] Asset detail view component
- [ ] Asset create/edit form
- [ ] Basic search UI
- [ ] Navigation updates

**Testing:**
- [ ] Unit tests for API endpoints
- [ ] Integration tests for database operations
- [ ] E2E tests for asset CRUD flows

### Sprint 3-4 (Weeks 5-8): Data Import

**Backend:**
- [ ] File upload endpoint
- [ ] CSV parser service
- [ ] Excel parser service
- [ ] Field mapping logic
- [ ] Import validation service
- [ ] Async import job processor
- [ ] Error reporting service

**Frontend:**
- [ ] Import wizard UI (5 steps)
- [ ] File upload component
- [ ] Field mapping interface
- [ ] Import preview table
- [ ] Import results view
- [ ] Error report download

**Testing:**
- [ ] Import validation tests
- [ ] File parsing tests
- [ ] Error handling tests

### Sprint 5-6 (Weeks 9-12): Additional Asset Types

**Backend:**
- [ ] Information Assets API
- [ ] Business Applications API
- [ ] Software Assets API
- [ ] Suppliers API
- [ ] Asset type-specific validations

**Frontend:**
- [ ] Information Asset forms
- [ ] Application forms
- [ ] Software forms
- [ ] Supplier forms
- [ ] Unified asset list view
- [ ] Asset type filter

**Testing:**
- [ ] All asset type CRUD tests
- [ ] Validation tests

### Sprint 7-8 (Weeks 13-16): Advanced Features

**Backend:**
- [ ] Asset dependency API
- [ ] Relationship graph service
- [ ] Bulk operations API
- [ ] Enhanced search (full-text)
- [ ] Export service (CSV, Excel, PDF)
- [ ] Dashboard analytics API

**Frontend:**
- [ ] Dependency management UI
- [ ] Relationship visualization (graph)
- [ ] Bulk action toolbar
- [ ] Enhanced search with filters
- [ ] Export functionality
- [ ] Dashboard widgets

**Testing:**
- [ ] Dependency tests
- [ ] Bulk operation tests
- [ ] Export tests

---

## 10. Acceptance Criteria

### 10.1 Functional Acceptance

- [ ] All P0 user stories implemented and tested
- [ ] All 5 asset types supported (Physical, Information, Applications, Software, Suppliers)
- [ ] CSV/Excel import working for all asset types
- [ ] Search and filtering functional across all fields
- [ ] Audit logging operational
- [ ] User authentication and authorization working
- [ ] Asset relationships and dependencies functional

### 10.2 Performance Acceptance

- [ ] Load time < 2 seconds for 95% of requests
- [ ] Support 50 concurrent users without degradation
- [ ] Successfully import 1,000 records in < 60 seconds
- [ ] Search returns results in < 1 second for 10,000 assets

### 10.3 Security Acceptance

- [ ] Pass penetration testing with no critical vulnerabilities
- [ ] All authentication mechanisms working
- [ ] Encryption at rest and in transit verified
- [ ] RBAC properly enforced
- [ ] API security validated

### 10.4 User Acceptance

- [ ] 90% of test users can complete key tasks without assistance
- [ ] User satisfaction score > 7/10
- [ ] All critical user feedback addressed
- [ ] Documentation complete and reviewed

---

## 11. Risks and Mitigation

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Complex import requirements | High | Medium | Start with simple CSV, iterate based on feedback |
| Performance with large datasets | High | Medium | Implement pagination, indexing, caching early |
| Data quality issues | Medium | High | Strong validation, error reporting, user training |
| Integration complexity | Medium | Medium | Start with manual import, add API integration later |
| Scope creep | High | Medium | Strict prioritization (P0/P1/P2), defer P2 features |

---

## 12. Dependencies and Integration Points

### 12.1 Phase 1 Dependencies

- ✅ User authentication system (Keycloak)
- ✅ User management and RBAC
- ✅ Application shell and navigation
- ✅ Database infrastructure
- ✅ Design system components

### 12.2 External Integrations (Future)

- CMDB systems (ServiceNow, etc.)
- Asset management tools
- SIEM systems (for security test results)
- HR systems (for employee directory)

### 12.3 Phase 3 Preparation

- Asset data will feed into Risk Management module
- Asset data will support Compliance module
- Asset relationships will inform Audit module

---

## 13. Documentation Requirements

### 13.1 User Documentation

- Quick start guide for asset management
- User manual with screenshots
- Video tutorials for common tasks
- Import guide with examples
- FAQ document

### 13.2 Administrator Documentation

- Field configuration guide
- User permission setup
- API integration guide
- Import troubleshooting

### 13.3 Developer Documentation

- API reference documentation
- Database schema documentation
- Component library documentation
- Architecture decisions

---

## 14. Success Criteria

**Phase 2 is considered successful when:**

1. ✅ All P0 user stories completed and tested
2. ✅ At least 2 asset types fully functional (Physical + one other)
3. ✅ CSV import working with field mapping
4. ✅ Search and filtering operational
5. ✅ Audit logging capturing all changes
6. ✅ 10+ beta users successfully using the system
7. ✅ Performance targets met
8. ✅ Security review passed
9. ✅ Documentation complete

---

**Document Version**: 1.0  
**Last Updated**: 2024  
**Next Review**: After Sprint 2 completion

