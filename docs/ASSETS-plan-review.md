Asset Management Requirements - Technical Specification
Overview
The asset management module shall enable the cybersecurity team to maintain a comprehensive inventory of organizational assets to support risk assessment and compliance activities.
3. Asset Management Module
3.1 Data Import and Integration
The system shall support asset data ingestion through:
File Import: CSV and Excel file formats 
API Integration: RESTful API endpoints to integrate with existing: 
Asset Management Systems 
Configuration Management Database (CMDB) 
Similar enterprise inventory tools 
The asset data shall be accessible for risk and compliance assessment workflows within the platform.

3.2 Asset Categories and Required Attributes
3.2.1 Physical Assets
The system shall store and manage the following attributes for physical assets:

3.2.2 Information Assets
The system shall store and manage the following attributes for information assets (critical and sensitive data):

3.2.3 Business Applications
The system shall store and manage the following attributes for business applications:

3.2.4 Software Assets
The system shall store and manage the following attributes for software:

3.2.5 Third Parties and Suppliers
The system shall store and manage the following attributes for third-party vendors and suppliers:


3.3 Technical Implementation Notes
All asset attributes should be implemented as structured data fields with appropriate data types 
Implement validation rules for required vs. optional fields based on asset category 
Design the data model to support relationships between assets (e.g., physical assets → applications → information assets) 
Include audit trail capabilities (created date, modified date, modified by) 
Support bulk import with data validation and error reporting 
Implement search and filtering capabilities across all asset attributes 
Asset Management Module - User Stories
Epic 1: Data Import and Integration
User Story 1.1: CSV File Import
As a cybersecurity analystI want to import asset data from CSV filesSo that I can quickly populate the asset inventory without manual data entry
Acceptance Criteria:
User can upload CSV files through the UI 
System validates CSV format and data structure before import 
System displays preview of data to be imported (first 10 rows) 
System provides error report for invalid data rows 
User can map CSV columns to system fields 
System confirms successful import with count of records added 
Import process logs all activities for audit purposes 
Definition of Done:
CSV parser implemented and tested 
Field mapping UI completed 
Error handling and validation implemented 
Unit and integration tests passing 
Documentation updated 

User Story 1.2: Excel File Import
As a cybersecurity analystI want to import asset data from Excel files (.xlsx, .xls)So that I can leverage existing asset inventories maintained in spreadsheets
Acceptance Criteria:
System accepts both .xlsx and .xls file formats 
System handles multiple worksheets (user selects which sheet to import) 
System validates data types and formats 
System provides clear error messages for failed imports 
User can download error report for failed records 
Successfully imported records are immediately available in the system 

User Story 1.3: CMDB Integration
As a system administratorI want to integrate with our existing CMDB via APISo that asset data is automatically synchronized without manual imports
Acceptance Criteria:
System provides API configuration interface (endpoint URL, authentication) 
System supports RESTful API connections 
System can authenticate using API keys/tokens 
System performs scheduled synchronization (configurable intervals) 
System maps CMDB fields to internal asset fields 
System logs all synchronization activities 
System handles connection failures gracefully with retry logic 
Admin receives notifications for sync failures 

User Story 1.4: Asset Management System Integration
As a system administratorI want to integrate with third-party asset management toolsSo that we maintain a single source of truth for asset data
Acceptance Criteria:
System supports multiple integration types (REST API, webhook) 
Admin can configure multiple integration sources 
System prevents duplicate asset entries through unique identifier matching 
System provides conflict resolution options (overwrite, skip, merge) 
Integration status dashboard shows last sync time and status 
Manual sync trigger available for ad-hoc updates 

Epic 2: Physical Asset Management
User Story 2.1: Add Physical Asset
As a cybersecurity analystI want to add a new physical asset with all required detailsSo that I can maintain an accurate inventory for risk assessments
Acceptance Criteria:
Form includes all fields from specification (asset_type, description, manufacturer, etc.) 
Required fields are marked and validated 
Dropdown menus for standardized fields (asset_type, criticality_level) 
System prevents duplicate entries based on unique_identifier 
User can save as draft or complete entry 
System timestamps creation and records creator 

User Story 2.2: View Physical Asset Details
As a cybersecurity analystI want to view complete details of a physical assetSo that I can review asset information during risk assessments
Acceptance Criteria:
Asset detail page displays all attributes in organized sections 
Related assets/dependencies are clickable links 
Security test results are clearly highlighted 
Compliance requirements are prominently displayed 
Page shows audit trail (created, last modified) 
User can export asset details to PDF 

User Story 2.3: Update Physical Asset
As a cybersecurity analystI want to update physical asset informationSo that the inventory remains current and accurate
Acceptance Criteria:
Edit form pre-populates with existing data 
System tracks change history for all modifications 
User must provide reason for changes to critical fields 
System validates data before saving 
Related assets are notified of changes (if dependencies exist) 
Confirmation message displays after successful update 

User Story 2.4: Search and Filter Physical Assets
As a cybersecurity analystI want to search and filter physical assets by multiple criteriaSo that I can quickly find relevant assets for compliance assessments
Acceptance Criteria:
Search bar supports full-text search across all fields 
Filters available for: asset_type, criticality_level, business_unit, compliance_scope, connectivity_status 
Multiple filters can be applied simultaneously 
Search results display key information in table format 
Results can be sorted by any column 
User can export filtered results to CSV/Excel 
Save custom filter configurations for reuse 

User Story 2.5: Track Network Connectivity Status
As a cybersecurity analystI want to track which physical assets are currently connected to the corporate networkSo that I can identify unauthorized or unexpected connections
Acceptance Criteria:
Connectivity status clearly displayed (Connected/Disconnected) 
Visual indicators for connection status (icons, colors) 
Filter option to show only connected/disconnected assets 
Dashboard widget showing connectivity statistics 
Alert notifications for unapproved devices connecting to network 
History log of connectivity changes 

User Story 2.6: Manage Asset Dependencies
As a cybersecurity analystI want to define and view dependencies between physical assets and other systemsSo that I can assess cascading impacts during risk analysis
Acceptance Criteria:
User can add multiple dependencies to an asset 
Dependency relationships are bidirectional (shows what depends on this asset and what this asset depends on) 
Visual dependency map/diagram available 
Warning displayed when modifying assets with dependencies 
Dependency chain analysis available (multi-level) 

Epic 3: Information Asset Management
User Story 3.1: Add Information Asset
As a data protection officerI want to register critical and sensitive information as assetsSo that I can track data classification and compliance requirements
Acceptance Criteria:
Form includes all required fields for information assets 
Classification level dropdown matches organizational policy 
Compliance requirements support multi-select 
Reclassification date triggers reminder notifications 
Information owner can be selected from employee directory 
System validates required fields before saving 

User Story 3.2: Data Classification Management
As a data protection officerI want to assign and update data classification levelsSo that information is properly protected according to its sensitivity
Acceptance Criteria:
Classification levels match organizational Data Classification Policy 
System enforces reclassification schedule 
Automated reminders sent 30 days before reclassification date 
Classification changes require approval workflow 
Audit trail tracks all classification changes with justification 
Reports available for assets approaching reclassification 

User Story 3.3: Information Asset Compliance Tracking
As a compliance officerI want to track compliance requirements for information assetsSo that I can ensure regulatory obligations are met
Acceptance Criteria:
Multi-select field for compliance requirements (GDPR, PCI-DSS, HIPAA, etc.) 
Filter assets by compliance scope 
Dashboard showing compliance coverage 
Bulk compliance tagging for multiple assets 
Export compliance reports for auditors 
Alerts for assets missing compliance information 

Epic 4: Business Application Management
User Story 4.1: Add Business Application
As a application ownerI want to register business applications in the asset inventorySo that applications are included in security assessments
Acceptance Criteria:
Form includes all application-specific fields 
Application type dropdown with common categories (CRM, ERP, etc.) 
Data processed field supports multi-select for data types 
Version and patch level validation 
Owner assignment from employee directory 
Technical details section for vendor information 

User Story 4.2: Track Application Versions and Patches
As a cybersecurity analystI want to track application versions and patch levelsSo that I can identify outdated or vulnerable applications
Acceptance Criteria:
Version and patch level prominently displayed 
Visual indicators for outdated versions 
Report showing all applications by version/patch status 
Filter applications below specific version thresholds 
Integration with vulnerability databases (if available) 
Bulk update capability for version/patch information 

User Story 4.3: Link Applications to Security Test Results
As a security testerI want to attach security test results to applicationsSo that assessment findings are associated with the correct assets
Acceptance Criteria:
Upload security test reports (PDF, CSV, XML) 
Link multiple test results to single application 
Display latest test date and severity summary 
Filter applications by test status (passed, failed, not tested) 
Automated alerts for failed security tests 
Historical test results viewable 

Epic 5: Software Asset Management
User Story 5.1: Add Software Asset
As a IT asset managerI want to track software licenses and versionsSo that I can manage license compliance and security patches
Acceptance Criteria:
Form includes software-specific fields 
Software type categorization (OS, productivity, development tools) 
Licensing information tracking 
Version and patch level management 
Vendor contact information storage 
Association with physical assets where installed 

User Story 5.2: Software Inventory Report
As a IT managerI want to generate reports of all installed software across assetsSo that I can manage licenses and identify security risks
Acceptance Criteria:
Report shows software name, version, patch level 
Group by software type or vendor 
Show installation count and locations 
Identify unlicensed or unauthorized software 
Export to Excel/PDF 
Schedule automated report generation 

Epic 6: Third Party and Supplier Management
User Story 6.1: Add Third Party/Supplier
As a vendor managerI want to register third parties and suppliersSo that vendor risks are tracked in the asset inventory
Acceptance Criteria:
Form includes all supplier-specific fields 
Unique identifier auto-generated or manual entry 
Contract reference with expiration tracking 
Criticality level assessment 
Multiple contact persons supported 
Services categorization (goods, services, both) 

User Story 6.2: Supplier Criticality Assessment
As a risk managerI want to assess and track supplier criticality levelsSo that I can prioritize vendor risk management activities
Acceptance Criteria:
Criticality level dropdown (Critical, High, Medium, Low) 
Business impact description field 
Link to dependent business processes 
Dashboard showing suppliers by criticality 
Alerts for critical suppliers without recent assessments 
Report of critical suppliers for executive review 

User Story 6.3: Contract Management for Suppliers
As a vendor managerI want to track contract details and expiration datesSo that I can ensure timely contract renewals
Acceptance Criteria:
Contract reference number and upload capability 
Contract start and end dates 
Automated alerts 90, 60, 30 days before expiration 
Contract status tracking (active, expired, pending renewal) 
Report of expiring contracts 
Link to contract documents repository 

Epic 7: Cross-Cutting Features
User Story 7.1: Asset Ownership Management
As a cybersecurity managerI want to assign and track asset owners across all asset typesSo that accountability is clear for each asset
Acceptance Criteria:
Owner field integrated with employee directory/HR system 
Business unit automatically populated from owner profile 
View all assets by owner 
Owner change notification workflow 
Dashboard showing assets without assigned owners 
Bulk owner assignment capability 

User Story 7.2: Universal Asset Search
As a cybersecurity analystI want to search across all asset types from a single interfaceSo that I can quickly find any asset regardless of category
Acceptance Criteria:
Global search bar available on all pages 
Search across asset types (physical, information, applications, software, suppliers) 
Results grouped by asset type 
Advanced search with type-specific filters 
Recent searches saved 
Search suggestions/autocomplete 

User Story 7.3: Asset Relationship Mapping
As a cybersecurity analystI want to visualize relationships between different asset typesSo that I understand dependencies for risk assessment
Acceptance Criteria:
Interactive visual diagram showing asset relationships 
Click on asset to view details 
Filter diagram by asset type or criticality 
Export diagram as image 
Identify single points of failure 
Show impact radius of asset compromise 

User Story 7.4: Bulk Asset Operations
As a cybersecurity analystI want to perform bulk operations on multiple assetsSo that I can efficiently manage large asset inventories
Acceptance Criteria:
Multi-select checkbox on asset lists 
Bulk actions: update owner, update criticality, add compliance tag, delete 
Confirmation dialog before bulk operations 
Progress indicator for large operations 
Operation results summary (success/failure count) 
Rollback capability for failed operations 

User Story 7.5: Asset Audit Trail
As a compliance officerI want to view complete change history for any assetSo that I can demonstrate compliance during audits
Acceptance Criteria:
Audit log shows: who, what, when, why for all changes 
Filter audit log by date range, user, action type 
Export audit logs to CSV 
Immutable audit records 
Retention policy enforcement 
Search within audit logs 

User Story 7.6: Risk Assessment Integration
As a cybersecurity analystI want to access asset information during risk assessmentsSo that I can make informed risk decisions
Acceptance Criteria:
Asset picker/selector in risk assessment workflows 
Pre-populate risk assessment with asset details 
View asset criticality and compliance requirements 
Link risk assessment results back to assets 
Filter assets available for risk assessment 
Quick view of asset security test results 

User Story 7.7: Asset Dashboard and Analytics
As a cybersecurity managerI want to view dashboard metrics for the asset inventorySo that I can understand our security posture at a glance
Acceptance Criteria:
Total asset count by type 
Assets by criticality level (chart) 
Assets by compliance scope 
Assets without owners 
Assets with outdated security tests 
Recent changes summary 
Customizable dashboard widgets 
Export dashboard to PDF for reporting 

User Story 7.8: Asset Export and Reporting
As a cybersecurity analystI want to export asset data in various formatsSo that I can share information with stakeholders and auditors
Acceptance Criteria:
Export to CSV, Excel, PDF 
Select specific fields to include in export 
Export filtered/searched results 
Template-based reports (pre-defined layouts) 
Schedule automated report generation 
Email reports to distribution lists 

Epic 8: System Administration
User Story 8.1: Configure Asset Fields
As a system administratorI want to customize asset fields and dropdown valuesSo that the system matches our organizational terminology
Acceptance Criteria:
Add/edit/disable custom fields for each asset type 
Configure dropdown options (asset types, criticality levels, etc.) 
Set field validation rules 
Mark fields as required/optional 
Changes apply immediately to forms 
Cannot delete fields with existing data (only disable) 

User Story 8.2: User Access Control
As a system administratorI want to control user permissions for asset managementSo that users can only access appropriate asset information
Acceptance Criteria:
Role-based access control (viewer, editor, admin) 
Permissions by asset type 
Row-level security based on business unit 
Audit log of permission changes 
Test permission settings before applying 
Bulk user permission assignment 

User Story 8.3: Data Validation Rules
As a system administratorI want to configure data validation rulesSo that asset data quality is maintained
Acceptance Criteria:
Configure regex patterns for formatted fields (IP, MAC, serial numbers) 
Set required field rules by asset type 
Configure field dependencies (if X then Y required) 
Custom validation error messages 
Test validation rules before applying 
Import validation applied during bulk imports 

Story Sizing and Priority Recommendations
Must Have (P0):
User Stories: 1.1, 1.2, 2.1, 2.2, 2.4, 7.1, 7.2, 8.2 
Should Have (P1):
User Stories: 1.3, 1.4, 2.3, 3.1, 4.1, 5.1, 6.1, 7.5, 7.7, 8.1 
Nice to Have (P2):
User Stories: 2.5, 2.6, 3.2, 3.3, 4.2, 4.3, 5.2, 6.2, 6.3, 7.3, 7.4, 7.6, 7.8, 8.3 

Product Requirements Document (PRD)
Lightweight Asset Management Tool for Cybersecurity Operations

1. Executive Summary
1.1 Product Overview
A lightweight, web-based asset management system designed specifically for cybersecurity teams to maintain comprehensive asset inventories that support risk assessments, compliance audits, and security operations.
1.2 Business Objectives
Enable cybersecurity teams to maintain accurate, up-to-date asset inventories 
Support risk assessment and compliance workflows with comprehensive asset data 
Integrate with existing enterprise systems (CMDB, asset management tools) 
Reduce manual data entry through bulk import and API integrations 
Provide visibility into asset relationships and dependencies 
1.3 Success Metrics
Adoption Rate: 90% of cybersecurity team members actively using the system within 3 months 
Data Completeness: 95% of critical assets have all required fields populated 
Time Savings: 50% reduction in time spent gathering asset information for assessments 
Integration Success: Successfully integrate with at least 2 enterprise systems 
User Satisfaction: NPS score of 40+ from cybersecurity team 

2. Product Scope
2.1 In Scope
Asset inventory management (physical, information, applications, software, suppliers) 
CSV/Excel file import functionality 
RESTful API for external system integration 
Search and filtering capabilities 
Asset relationship and dependency tracking 
Audit trail and change history 
Role-based access control 
Basic reporting and data export 
Dashboard with key metrics 
2.2 Out of Scope (Future Phases)
Automated asset discovery/scanning 
Vulnerability management integration 
Ticketing system integration 
Mobile application 
Advanced analytics and ML-based insights 
Asset lifecycle management (procurement, disposal) 
Real-time network monitoring 
Automated compliance scoring 
2.3 Target Users
Primary: Cybersecurity analysts, security architects, compliance officers 
Secondary: IT asset managers, risk managers, security operations center (SOC) staff 
Administrative: System administrators, security managers 

3. Functional Requirements
3.1 Asset Management Core
3.1.1 Physical Assets
Description: Manage hardware and network equipment inventory
Requirements:
FR-PA-001: System shall support CRUD operations for physical assets 
FR-PA-002: System shall capture all attributes defined in specification (25 fields) 
FR-PA-003: System shall validate unique identifiers to prevent duplicates 
FR-PA-004: System shall support asset categorization by type (network, IT, specialized) 
FR-PA-005: System shall track connectivity status and network approval 
FR-PA-006: System shall link security test results to assets 
FR-PA-007: System shall support multiple IP and MAC addresses per asset 
3.1.2 Information Assets
Description: Manage critical and sensitive data inventories
Requirements:
FR-IA-001: System shall support CRUD operations for information assets 
FR-IA-002: System shall enforce data classification per organizational policy 
FR-IA-003: System shall track reclassification dates and trigger reminders 
FR-IA-004: System shall support multiple compliance requirements per asset 
FR-IA-005: System shall distinguish between information owner and custodian 
3.1.3 Business Applications
Description: Manage business application inventory
Requirements:
FR-BA-001: System shall support CRUD operations for business applications 
FR-BA-002: System shall track version, patch level, and vendor information 
FR-BA-003: System shall categorize types of data processed by applications 
FR-BA-004: System shall link applications to security test results 
FR-BA-005: System shall store vendor contact information 
3.1.4 Software Assets
Description: Manage software inventory and licensing
Requirements:
FR-SA-001: System shall support CRUD operations for software assets 
FR-SA-002: System shall track software versions and patch levels 
FR-SA-003: System shall categorize software by type (OS, productivity, etc.) 
FR-SA-004: System shall store licensing and vendor information 
FR-SA-005: System shall link software to physical assets where installed 
3.1.5 Third Parties and Suppliers
Description: Manage vendor and supplier relationships
Requirements:
FR-TP-001: System shall support CRUD operations for third parties/suppliers 
FR-TP-002: System shall auto-generate unique identifiers 
FR-TP-003: System shall track contract references and criticality levels 
FR-TP-004: System shall support multiple contact persons per supplier 
FR-TP-005: System shall track goods/services provided 
3.2 Data Import and Integration
3.2.1 File Import
Requirements:
FR-FI-001: System shall support CSV file import with configurable field mapping 
FR-FI-002: System shall support Excel (.xlsx, .xls) file import 
FR-FI-003: System shall validate data format and types before import 
FR-FI-004: System shall provide import preview (first 10 rows) 
FR-FI-005: System shall generate error reports for failed imports 
FR-FI-006: System shall support update existing records via import 
FR-FI-007: System shall log all import activities 
3.2.2 API Integration
Requirements:
FR-API-001: System shall provide RESTful API endpoints for all asset types 
FR-API-002: System shall support API key authentication 
FR-API-003: System shall support OAuth 2.0 authentication 
FR-API-004: System shall enable scheduled data synchronization 
FR-API-005: System shall provide configurable field mapping for integrations 
FR-API-006: System shall handle duplicate detection via unique identifiers 
FR-API-007: System shall provide webhook support for real-time updates 
FR-API-008: System shall log all API transactions 
3.3 Search and Discovery
Requirements:
FR-SD-001: System shall provide global full-text search across all asset types 
FR-SD-002: System shall support advanced filtering by any field 
FR-SD-003: System shall allow multiple simultaneous filters 
FR-SD-004: System shall support saved search configurations 
FR-SD-005: System shall provide search autocomplete/suggestions 
FR-SD-006: System shall display search results with sortable columns 
FR-SD-007: System shall show asset type in search results 
3.4 Relationships and Dependencies
Requirements:
FR-RD-001: System shall support defining dependencies between assets 
FR-RD-002: System shall display bidirectional relationships 
FR-RD-003: System shall provide visual dependency mapping 
FR-RD-004: System shall show dependency chains (multi-level) 
FR-RD-005: System shall warn users when modifying assets with dependencies 
FR-RD-006: System shall support linking physical assets to applications 
FR-RD-007: System shall support linking applications to information assets 
3.5 Audit and Compliance
Requirements:
FR-AC-001: System shall maintain immutable audit logs for all changes 
FR-AC-002: System shall record who, what, when, why for each change 
FR-AC-003: System shall provide audit log filtering and search 
FR-AC-004: System shall support audit log export (CSV, PDF) 
FR-AC-005: System shall track compliance scope for each asset 
FR-AC-006: System shall generate compliance reports by regulation 
FR-AC-007: System shall retain audit logs per organizational policy 
3.6 Reporting and Analytics
Requirements:
FR-RA-001: System shall provide dashboard with key metrics 
FR-RA-002: System shall support asset export to CSV, Excel, PDF 
FR-RA-003: System shall allow custom field selection for exports 
FR-RA-004: System shall provide pre-built report templates 
FR-RA-005: System shall display asset counts by type and criticality 
FR-RA-006: System shall identify assets missing required information 
FR-RA-007: System shall show assets by compliance scope 
FR-RA-008: System shall provide assets without owners report 
3.7 User Management and Security
Requirements:
FR-UM-001: System shall implement role-based access control (RBAC) 
FR-UM-002: System shall support minimum roles: Admin, Editor, Viewer 
FR-UM-003: System shall support row-level security by business unit 
FR-UM-004: System shall integrate with corporate SSO/SAML 
FR-UM-005: System shall enforce strong password policies 
FR-UM-006: System shall support multi-factor authentication (MFA) 
FR-UM-007: System shall log all authentication attempts 
FR-UM-008: System shall auto-logout after configurable inactivity period 

4. Non-Functional Requirements
4.1 Performance
NFR-P-001: Page load time shall not exceed 2 seconds for standard queries 
NFR-P-002: Search results shall return within 1 second for datasets up to 10,000 assets 
NFR-P-003: System shall support concurrent users: 50 active users minimum 
NFR-P-004: Bulk import shall process 1,000 records in under 60 seconds 
NFR-P-005: API response time shall not exceed 500ms for standard requests 
4.2 Scalability
NFR-S-001: System shall support up to 100,000 total assets across all types 
NFR-S-002: Database shall be horizontally scalable 
NFR-S-003: System shall support adding new asset types without code changes 
4.3 Security
NFR-SEC-001: All data transmission shall use TLS 1.2 or higher 
NFR-SEC-002: All passwords shall be hashed using bcrypt or stronger 
NFR-SEC-003: API keys shall be encrypted at rest 
NFR-SEC-004: System shall prevent SQL injection attacks 
NFR-SEC-005: System shall prevent XSS attacks 
NFR-SEC-006: System shall implement CSRF protection 
NFR-SEC-007: System shall enforce principle of least privilege 
NFR-SEC-008: Sensitive data shall be encrypted at rest (AES-256) 
4.4 Availability
NFR-A-001: System uptime shall be 99.5% during business hours 
NFR-A-002: Planned maintenance windows shall be communicated 48 hours in advance 
NFR-A-003: System shall support database backup every 24 hours 
NFR-A-004: Recovery Time Objective (RTO): 4 hours 
NFR-A-005: Recovery Point Objective (RPO): 24 hours 
4.5 Usability
NFR-U-001: System shall be accessible via modern web browsers (Chrome, Firefox, Edge, Safari) 
NFR-U-002: UI shall be responsive for desktop and tablet devices 
NFR-U-003: System shall comply with WCAG 2.1 Level AA accessibility standards 
NFR-U-004: New users shall complete basic asset creation within 10 minutes of training 
NFR-U-005: System shall provide contextual help and tooltips 
4.6 Maintainability
NFR-M-001: Code shall follow industry-standard coding conventions 
NFR-M-002: System shall have automated unit test coverage of 80% minimum 
NFR-M-003: System shall provide comprehensive API documentation 
NFR-M-004: Database schema changes shall be version-controlled 
NFR-M-005: System shall log errors with stack traces for debugging 
4.7 Compliance
NFR-C-001: System shall support data retention policies 
NFR-C-002: System shall support data deletion per GDPR requirements 
NFR-C-003: System shall provide data export for data portability 

5. User Interface Requirements
5.1 Key Screens
5.1.1 Dashboard
Summary cards: Total assets, Critical assets, Assets without owners, Recent changes 
Charts: Assets by type, Assets by criticality, Compliance coverage 
Recent activity feed 
Quick actions: Add asset, Import data, Search 
5.1.2 Asset List View
Filterable table with key columns 
Bulk selection checkboxes 
Sort by any column 
Pagination (25, 50, 100 records per page) 
Quick actions: View, Edit, Delete 
Export button 
5.1.3 Asset Detail View
Tabbed interface: Overview, Relationships, Audit History, Security Tests 
Edit button (permission-based) 
Related assets section with clickable links 
Compliance tags prominently displayed 
Last modified information 
5.1.4 Asset Create/Edit Form
Multi-section form with logical grouping 
Required field indicators 
Field validation with inline error messages 
Auto-save draft capability 
Cancel and Save buttons 
5.1.5 Import Wizard
Step 1: Upload file 
Step 2: Map fields 
Step 3: Preview data 
Step 4: Confirm and import 
Step 5: Results summary 
5.1.6 Dependency Map
Interactive visual graph 
Zoom and pan controls 
Node click to view details 
Filter by asset type 
Export as image 
5.2 Navigation
Top navigation bar: Logo, Global search, User menu 
Left sidebar: Dashboard, Physical Assets, Information Assets, Applications, Software, Suppliers, Reports, Admin 
Breadcrumb navigation on all pages 

6. Technical Architecture
6.1 Technology Stack Recommendations
6.1.1 Frontend
Framework: React 18+ or Vue.js 3+ 
UI Library: Material-UI, Ant Design, or Tailwind CSS 
State Management: Redux or Vuex 
Data Visualization: D3.js or Chart.js 
HTTP Client: Axios 
6.1.2 Backend
Framework: Node.js (Express) or Python (FastAPI/Django) 
API Style: RESTful API 
Authentication: JWT tokens, OAuth 2.0 
ORM: Sequelize (Node.js) or SQLAlchemy (Python) 
6.1.3 Database
Primary Database: PostgreSQL 14+ (recommended for JSONB support and scalability) 
Alternative: MySQL 8.0+ 
Cache: Redis (optional, for session management and performance) 
6.1.4 Infrastructure
Deployment: Docker containers 
Orchestration: Kubernetes (optional) or Docker Compose 
Reverse Proxy: Nginx 
CI/CD: GitHub Actions, GitLab CI, or Jenkins 
6.2 Integration Points
CMDB Integration: REST API endpoints 
SSO/SAML: SAML 2.0 integration for authentication 
Email: SMTP for notifications 
File Storage: Local filesystem or S3-compatible storage for uploads 


7. Database Schema
See detailed schema in separate section below.

8. API Specifications
8.1 Base URL
https://api.assetmanagement.company.com/v1
8.2 Authentication
All API requests require Bearer token in header:
Authorization: Bearer <token>
8.3 Key Endpoints
Physical Assets
GET /assets/physical - List all physical assets 
GET /assets/physical/{id} - Get specific physical asset 
POST /assets/physical - Create new physical asset 
PUT /assets/physical/{id} - Update physical asset 
DELETE /assets/physical/{id} - Delete physical asset 
Information Assets
GET /assets/information - List all information assets 
GET /assets/information/{id} - Get specific information asset 
POST /assets/information - Create new information asset 
PUT /assets/information/{id} - Update information asset 
DELETE /assets/information/{id} - Delete information asset 
Applications
GET /assets/applications - List all applications 
GET /assets/applications/{id} - Get specific application 
POST /assets/applications - Create new application 
PUT /assets/applications/{id} - Update application 
DELETE /assets/applications/{id} - Delete application 
Software
GET /assets/software - List all software 
GET /assets/software/{id} - Get specific software 
POST /assets/software - Create new software 
PUT /assets/software/{id} - Update software 
DELETE /assets/software/{id} - Delete software 
Suppliers
GET /assets/suppliers - List all suppliers 
GET /assets/suppliers/{id} - Get specific supplier 
POST /assets/suppliers - Create new supplier 
PUT /assets/suppliers/{id} - Update supplier 
DELETE /assets/suppliers/{id} - Delete supplier 
Bulk Operations
POST /assets/import - Bulk import assets 
POST /assets/export - Export assets 
GET /assets/search - Search across all asset types 
Relationships
GET /assets/{id}/dependencies - Get asset dependencies 
POST /assets/{id}/dependencies - Add dependency 
DELETE /assets/{id}/dependencies/{dep_id} - Remove dependency 

9. Data Migration and Import
9.1 Initial Data Load
Support CSV templates for each asset type 
Provide sample data files 
Data validation before final import 
Error handling with detailed logs 
9.2 Ongoing Synchronization
Scheduled API sync (configurable: hourly, daily, weekly) 
Manual sync trigger 
Conflict resolution strategy (last write wins, manual review) 
Sync status dashboard 

10. Deployment Plan
10.1 Phase 1: MVP (Months 1-3)
Features:
Physical assets management 
CSV/Excel import 
Basic search and filtering 
User authentication and RBAC 
Audit logging 
Basic dashboard 
Deliverables:
Working application deployed to staging 
User documentation 
API documentation 
Initial user training 
10.2 Phase 2: Enhanced Features (Months 4-6)
Features:
Information assets management 
Applications and software management 
API integration capabilities 
Dependency mapping 
Advanced reporting 
Compliance tracking 
10.3 Phase 3: Enterprise Integration (Months 7-9)
Features:
Supplier management 
CMDB integration 
SSO/SAML integration 
Advanced analytics dashboard 
Scheduled reporting 
Bulk operations 

11. Training and Documentation
11.1 User Documentation
Quick start guide 
User manual with screenshots 
Video tutorials for common tasks 
FAQ document 
Troubleshooting guide 
11.2 Administrator Documentation
Installation guide 
Configuration guide 
API integration guide 
Backup and recovery procedures 
Security hardening guide 
11.3 Developer Documentation
API reference documentation 
Database schema documentation 
Architecture overview 
Contributing guidelines 
Code style guide 

12. Support and Maintenance
12.1 Support Channels
Email support: support@company.com 
Internal ticketing system 
Slack/Teams channel for quick questions 
Monthly office hours 
12.2 Maintenance Windows
Scheduled: Every Saturday 2:00 AM - 4:00 AM 
Emergency maintenance: As needed with 2-hour notice minimum 
12.3 Bug Tracking
Use Jira/GitHub Issues for bug tracking 
Priority levels: Critical, High, Medium, Low 
SLA: Critical (4 hours), High (24 hours), Medium (1 week), Low (2 weeks) 

13. Risks and Mitigation


14. Acceptance Criteria
14.1 Functional Acceptance
All P0 user stories implemented and tested 
All required asset types supported 
CSV/Excel import working for all asset types 
Search and filtering functional across all fields 
Audit logging operational 
User authentication and authorization working 
14.2 Performance Acceptance
Load time < 2 seconds for 95% of requests 
Support 50 concurrent users without degradation 
Successfully import 1,000 records in < 60 seconds 
14.3 Security Acceptance
Pass penetration testing with no critical vulnerabilities 
All authentication mechanisms working 
Encryption at rest and in transit verified 
RBAC properly enforced 
14.4 User Acceptance
90% of test users can complete key tasks without assistance 
User satisfaction score > 7/10 
All critical user feedback addressed 

15. Glossary


Database Schema
Schema Design Principles
Normalization: Schema normalized to 3NF to reduce redundancy 
Flexibility: Support for custom fields and extensibility 
Audit Trail: All tables include created/modified timestamps and user tracking 
Soft Deletes: Use deleted_at column instead of hard deletes 
Indexing: Strategic indexes on foreign keys and frequently queried fields 
Data Types: Use appropriate data types (JSONB for flexible attributes, ENUM for constrained values) 

Core Tables
1. users
Stores user account information
sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    employee_id VARCHAR(50) UNIQUE,
    business_unit_id UUID REFERENCES business_units(id),
    role_id UUID REFERENCES roles(id),
    is_active BOOLEAN DEFAULT true,
    last_login_at TIMESTAMP,
    failed_login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_employee_id ON users(employee_id);
CREATE INDEX idx_users_business_unit ON users(business_unit_id);
CREATE INDEX idx_users_active ON users(is_active) WHERE deleted_at IS NULL;
2. roles
Defines user roles for RBAC
sql
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    permissions JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default roles
INSERT INTO roles (name, description) VALUES 
    ('admin', 'Full system access'),
    ('editor', 'Can create and edit assets'),
    ('viewer', 'Read-only access');
3. business_units
Organizational units/departments
sql
CREATE TABLE business_units (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    code VARCHAR(50) UNIQUE,
    parent_id UUID REFERENCES business_units(id),
    description TEXT,
    manager_id UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE INDEX idx_business_units_parent ON business_units(parent_id);
CREATE INDEX idx_business_units_code ON business_units(code);
4. asset_types
Lookup table for asset categories
sql
CREATE TYPE asset_category_enum AS ENUM (
    'physical',
    'information',
    'application',
    'software',
    'supplier'
);

CREATE TABLE asset_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category asset_category_enum NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_asset_types_category ON asset_types(category);

-- Sample data for physical assets
INSERT INTO asset_types (category, name) VALUES 
    ('physical', 'Network Equipment'),
    ('physical', 'IT Hardware'),
    ('physical', 'Specialized Equipment');

Asset Tables
5. physical_assets
Physical and network equipment
sql
CREATE TYPE criticality_level_enum AS ENUM ('critical', 'high', 'medium', 'low');
CREATE TYPE connectivity_status_enum AS ENUM ('connected', 'disconnected', 'unknown');
CREATE TYPE approval_status_enum AS ENUM ('approved', 'not_approved', 'pending');

CREATE TABLE physical_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_type_id UUID REFERENCES asset_types(id),
    asset_description VARCHAR(200) NOT NULL,
    manufacturer VARCHAR(200),
    model VARCHAR(200),
    business_purpose TEXT,
    owner_id UUID REFERENCES users(id),
    business_unit_id UUID REFERENCES business_units(id),
    unique_identifier VARCHAR(200) UNIQUE NOT NULL,
    physical_location TEXT,
    criticality_level criticality_level_enum,
    
    -- Network information
    mac_addresses JSONB, -- Array of MAC addresses
    ip_addresses JSONB, -- Array of IP addresses (IPv4 and IPv6)
    
    -- Software and services
    installed_software JSONB, -- Array of {name, version, patch_level}
    active_ports_services JSONB, -- Array of {port, service, protocol}
    
    -- Approval and connectivity
    network_approval_status approval_status_enum DEFAULT 'pending',
    connectivity_status connectivity_status_enum DEFAULT 'unknown',
    last_connectivity_check TIMESTAMP,
    
    -- Additional metadata
    serial_number VARCHAR(200),
    asset_tag VARCHAR(100),
    purchase_date DATE,
    warranty_expiry DATE,
    
    -- Compliance and security
    compliance_requirements JSONB, -- Array of compliance tags
    security_test_results JSONB, -- {last_test_date, findings, severity}
    
    -- Audit fields
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by UUID REFERENCES users(id),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE INDEX idx_physical_assets_type ON physical_assets(asset_type_id);
CREATE INDEX idx_physical_assets_owner ON physical_assets(owner_id);
CREATE INDEX idx_physical_assets_unit ON physical_assets(business_unit_id);
CREATE INDEX idx_physical_assets_identifier ON physical_assets(unique_identifier);
CREATE INDEX idx_physical_assets_criticality ON physical_assets(criticality_level);
CREATE INDEX idx_physical_assets_location ON physical_assets(physical_location);
CREATE INDEX idx_physical_assets_connectivity ON physical_assets(connectivity_status);
CREATE INDEX idx_physical_assets_mac ON physical_assets USING gin(mac_addresses);
CREATE INDEX idx_physical_assets_ip ON physical_assets USING gin(ip_addresses);
6. information_assets
Critical and sensitive information
sql
CREATE TYPE classification_level_enum AS ENUM (
    'public',
    'internal',
    'confidential',
    'restricted',
    'secret'
);

CREATE TABLE information_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    information_type VARCHAR(200) NOT NULL,
    name VARCHAR(300) NOT NULL,
    description TEXT,
    classification_level classification_level_enum NOT NULL,
    classification_date DATE,
    reclassification_date DATE,
    reclassification_reminder_sent BOOLEAN DEFAULT false,
    
    -- Ownership
    information_owner_id UUID REFERENCES users(id),
    asset_custodian_id UUID REFERENCES users(id),
    business_unit_id UUID REFERENCES business_units(id),
    
    -- Location and storage
    asset_location TEXT,
    storage_medium VARCHAR(200), -- database, file server, cloud storage, etc.
    
    -- Compliance
    compliance_requirements JSONB, -- Array of compliance tags
    retention_period VARCHAR(100),
    
    -- Audit fields
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by UUID REFERENCES users(id),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE INDEX idx_info_assets_type ON information_assets(information_type);
CREATE INDEX idx_info_assets_classification ON information_assets(classification_level);
CREATE INDEX idx_info_assets_owner ON information_assets(information_owner_id);
CREATE INDEX idx_info_assets_custodian ON information_assets(asset_custodian_id);
CREATE INDEX idx_info_assets_unit ON information_assets(business_unit_id);
CREATE INDEX idx_info_assets_reclassification ON information_assets(reclassification_date) 
    WHERE reclassification_date IS NOT NULL;
7. business_applications
Business application inventory
sql
CREATE TABLE business_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_name VARCHAR(300) NOT NULL,
    application_type VARCHAR(200), -- CRM, ERP, Collaboration, etc.
    version_number VARCHAR(100),
    patch_level VARCHAR(100),
    
    -- Business context
    business_purpose TEXT,
    owner_id UUID REFERENCES users(id),
    business_unit_id UUID REFERENCES business_units(id),
    
    -- Data processed
    data_processed JSONB, -- Array of data types: financial, PII, PHI, etc.
    data_classification classification_level_enum,
    
    -- Technical details
    vendor_name VARCHAR(200),
    vendor_contact JSONB, -- {name, email, phone}
    license_type VARCHAR(100),
    license_count INTEGER,
    license_expiry DATE,
    
    -- Hosting and access
    hosting_type VARCHAR(100), -- on-premise, cloud, hybrid
    hosting_location TEXT,
    access_url TEXT,
    
    -- Security
    security_test_results JSONB,
    last_security_test_date DATE,
    authentication_method VARCHAR(100), -- SSO, LDAP, local, etc.
    
    -- Compliance
    compliance_requirements JSONB,
    criticality_level criticality_level_enum,
    
    -- Audit fields
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by UUID REFERENCES users(id),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE INDEX idx_applications_name ON business_applications(application_name);
CREATE INDEX idx_applications_type ON business_applications(application_type);
CREATE INDEX idx_applications_owner ON business_applications(owner_id);
CREATE INDEX idx_applications_unit ON business_applications(business_unit_id);
CREATE INDEX idx_applications_criticality ON business_applications(criticality_level);
CREATE INDEX idx_applications_vendor ON business_applications(vendor_name);
8. software_assets
Software inventory
sql
CREATE TABLE software_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    software_name VARCHAR(300) NOT NULL,
    software_type VARCHAR(200), -- OS, productivity, development, etc.
    version_number VARCHAR(100),
    patch_level VARCHAR(100),
    
    -- Business context
    business_purpose TEXT,
    owner_id UUID REFERENCES users(id),
    business_unit_id UUID REFERENCES business_units(id),
    
    -- Technical details
    vendor_name VARCHAR(200), vendor_contact JSONB, license_type VARCHAR(100), license_count INTEGER, license_key TEXT, 
-- Encrypted license_expiry DATE,
-- Installation tracking installation_count INTEGER DEFAULT 0,
-- Security security_test_results JSONB,
last_security_test_date DATE,
known_vulnerabilities JSONB,

-- Support
support_end_date DATE,

-- Audit fields
created_by UUID REFERENCES users(id),
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_by UUID REFERENCES users(id),
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
deleted_at TIMESTAMP
);
CREATE INDEX idx_software_name ON software_assets(software_name); CREATE INDEX idx_software_type ON software_assets(software_type); CREATE INDEX idx_software_owner ON software_assets(owner_id); CREATE INDEX idx_software_unit ON software_assets(business_unit_id); CREATE INDEX idx_software_vendor ON software_assets(vendor_name); CREATE INDEX idx_software_license_expiry ON software_assets(license_expiry) WHERE license_expiry IS NOT NULL;

### 9. suppliers
Third parties and vendors
```sql
CREATE TABLE suppliers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    unique_identifier VARCHAR(100) UNIQUE NOT NULL,
    supplier_name VARCHAR(300) NOT NULL,
    supplier_type VARCHAR(100), -- vendor, contractor, service provider, etc.
    
    -- Business context
    business_purpose TEXT,
    owner_id UUID REFERENCES users(id),
    business_unit_id UUID REFERENCES business_units(id),
    
    -- Services
    goods_services_type JSONB, -- Array of service categories
    criticality_level criticality_level_enum,
    
    -- Contract information
    contract_reference VARCHAR(200),
    contract_start_date DATE,
    contract_end_date DATE,
    contract_value DECIMAL(15, 2),
    currency VARCHAR(10),
    auto_renewal BOOLEAN DEFAULT false,
    
    -- Contact information
    primary_contact JSONB, -- {name, title, email, phone}
    secondary_contact JSONB,
    
    -- Company details
    tax_id VARCHAR(100),
    registration_number VARCHAR(100),
    address TEXT,
    country VARCHAR(100),
    website TEXT,
    
    -- Risk and compliance
    risk_assessment_date DATE,
    risk_level VARCHAR(50),
    compliance_certifications JSONB, -- Array of certifications
    insurance_verified BOOLEAN DEFAULT false,
    background_check_date DATE,
    
    -- Performance
    performance_rating DECIMAL(3, 2), -- 0.00 to 5.00
    last_review_date DATE,
    
    -- Audit fields
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by UUID REFERENCES users(id),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE INDEX idx_suppliers_identifier ON suppliers(unique_identifier);
CREATE INDEX idx_suppliers_name ON suppliers(supplier_name);
CREATE INDEX idx_suppliers_owner ON suppliers(owner_id);
CREATE INDEX idx_suppliers_unit ON suppliers(business_unit_id);
CREATE INDEX idx_suppliers_criticality ON suppliers(criticality_level);
CREATE INDEX idx_suppliers_contract_end ON suppliers(contract_end_date) 
    WHERE contract_end_date IS NOT NULL;
```

---

## Relationship Tables

### 10. asset_dependencies
Tracks dependencies between assets
```sql
CREATE TABLE asset_dependencies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_asset_type asset_category_enum NOT NULL,
    source_asset_id UUID NOT NULL,
    target_asset_type asset_category_enum NOT NULL,
    target_asset_id UUID NOT NULL,
    dependency_type VARCHAR(100), -- requires, supports, integrates_with, etc.
    description TEXT,
    criticality VARCHAR(50), -- critical, high, medium, low
    
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    
    CONSTRAINT unique_dependency UNIQUE (source_asset_type, source_asset_id, target_asset_type, target_asset_id)
);

CREATE INDEX idx_dependencies_source ON asset_dependencies(source_asset_type, source_asset_id);
CREATE INDEX idx_dependencies_target ON asset_dependencies(target_asset_type, target_asset_id);
CREATE INDEX idx_dependencies_type ON asset_dependencies(dependency_type);
```

### 11. physical_asset_software
Many-to-many: Physical assets to software installed
```sql
CREATE TABLE physical_asset_software (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    physical_asset_id UUID REFERENCES physical_assets(id) ON DELETE CASCADE,
    software_asset_id UUID REFERENCES software_assets(id) ON DELETE CASCADE,
    installation_date DATE,
    installation_path TEXT,
    is_active BOOLEAN DEFAULT true,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT unique_asset_software UNIQUE (physical_asset_id, software_asset_id)
);

CREATE INDEX idx_asset_software_physical ON physical_asset_software(physical_asset_id);
CREATE INDEX idx_asset_software_software ON physical_asset_software(software_asset_id);
```

### 12. application_information
Many-to-many: Applications to information assets
```sql
CREATE TABLE application_information (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID REFERENCES business_applications(id) ON DELETE CASCADE,
    information_asset_id UUID REFERENCES information_assets(id) ON DELETE CASCADE,
    access_type VARCHAR(100), -- read, write, read-write, delete
    purpose TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT unique_app_info UNIQUE (application_id, information_asset_id)
);

CREATE INDEX idx_app_info_application ON application_information(application_id);
CREATE INDEX idx_app_info_information ON application_information(information_asset_id);
```

---

## Audit and Logging Tables

### 13. audit_logs
Comprehensive audit trail
```sql
CREATE TYPE audit_action_enum AS ENUM (
    'create',
    'update',
    'delete',
    'import',
    'export',
    'login',
    'logout',
    'permission_change'
);

CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    action audit_action_enum NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id UUID NOT NULL,
    changes JSONB, -- {field: {old_value, new_value}}
    reason TEXT,
    ip_address INET,
    user_agent TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_audit_user ON audit_logs(user_id);
CREATE INDEX idx_audit_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_action ON audit_logs(action);
CREATE INDEX idx_audit_timestamp ON audit_logs(timestamp DESC);
```

### 14. import_logs
Track bulk import operations
```sql
CREATE TYPE import_status_enum AS ENUM ('pending', 'in_progress', 'completed', 'failed', 'partial');

CREATE TABLE import_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    asset_type asset_category_enum NOT NULL,
    filename VARCHAR(500),
    file_size BIGINT,
    total_records INTEGER,
    successful_records INTEGER DEFAULT 0,
    failed_records INTEGER DEFAULT 0,
    status import_status_enum DEFAULT 'pending',
    error_log JSONB, -- Array of {row, error_message}
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_import_user ON import_logs(user_id);
CREATE INDEX idx_import_status ON import_logs(status);
CREATE INDEX idx_import_created ON import_logs(created_at DESC);
```

---

## Supporting Tables

### 15. compliance_frameworks
Regulatory frameworks and standards
```sql
CREATE TABLE compliance_frameworks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    authority VARCHAR(200), -- Regulatory body
    version VARCHAR(50),
    effective_date DATE,
    is_active BOOLEAN DEFAULT true,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sample data
INSERT INTO compliance_frameworks (code, name, authority) VALUES 
    ('NCA', 'National Cybersecurity Authority', 'Saudi Arabia'),
    ('GDPR', 'General Data Protection Regulation', 'European Union'),
    ('PCI-DSS', 'Payment Card Industry Data Security Standard', 'PCI SSC'),
    ('ISO27001', 'Information Security Management', 'ISO'),
    ('NIST', 'NIST Cybersecurity Framework', 'NIST');
```

### 16. tags
Flexible tagging system
```sql
CREATE TABLE tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    category VARCHAR(100), -- compliance, technology, business, custom
    color VARCHAR(7), -- Hex color code
    description TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_tags_category ON tags(category);
```

### 17. asset_tags
Many-to-many: Assets to tags
```sql
CREATE TABLE asset_tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_type asset_category_enum NOT NULL,
    asset_id UUID NOT NULL,
    tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
    
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT unique_asset_tag UNIQUE (asset_type, asset_id, tag_id)
);

CREATE INDEX idx_asset_tags_asset ON asset_tags(asset_type, asset_id);
CREATE INDEX idx_asset_tags_tag ON asset_tags(tag_id);
```

### 18. security_tests
Security assessment results
```sql
CREATE TYPE test_type_enum AS ENUM (
    'vulnerability_scan',
    'penetration_test',
    'compliance_audit',
    'security_review',
    'code_review'
);

CREATE TYPE test_status_enum AS ENUM ('scheduled', 'in_progress', 'completed', 'failed');

CREATE TABLE security_tests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_type asset_category_enum NOT NULL,
    asset_id UUID NOT NULL,
    test_type test_type_enum NOT NULL,
    test_date DATE NOT NULL,
    tester_name VARCHAR(200),
    tester_company VARCHAR(200),
    
    status test_status_enum DEFAULT 'scheduled',
    
    -- Results
    findings_critical INTEGER DEFAULT 0,
    findings_high INTEGER DEFAULT 0,
    findings_medium INTEGER DEFAULT 0,
    findings_low INTEGER DEFAULT 0,
    findings_info INTEGER DEFAULT 0,
    
    overall_score DECIMAL(5, 2), -- 0.00 to 100.00
    passed BOOLEAN,
    
    -- Documentation
    report_url TEXT,
    report_file BYTEA, -- Or reference to file storage
    summary TEXT,
    recommendations TEXT,
    
    -- Follow-up
    remediation_due_date DATE,
    remediation_completed BOOLEAN DEFAULT false,
    retest_required BOOLEAN DEFAULT false,
    retest_date DATE,
    
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_security_tests_asset ON security_tests(asset_type, asset_id);
CREATE INDEX idx_security_tests_type ON security_tests(test_type);
CREATE INDEX idx_security_tests_date ON security_tests(test_date DESC);
CREATE INDEX idx_security_tests_status ON security_tests(status);
```

### 19. notifications
System notifications
```sql
CREATE TYPE notification_type_enum AS ENUM (
    'reclassification_reminder',
    'contract_expiry',
    'license_expiry',
    'security_test_due',
    'asset_change',
    'compliance_alert',
    'system_alert'
);

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    notification_type notification_type_enum NOT NULL,
    title VARCHAR(300) NOT NULL,
    message TEXT,
    entity_type VARCHAR(100),
    entity_id UUID,
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMP,
    expires_at TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read) WHERE NOT is_read;
CREATE INDEX idx_notifications_created ON notifications(created_at DESC);
```

### 20. integration_configs
External system integration settings
```sql
CREATE TABLE integration_configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    integration_type VARCHAR(100) NOT NULL, -- cmdb, asset_management, api
    endpoint_url TEXT,
    auth_type VARCHAR(50), -- api_key, oauth, basic, token
    auth_credentials TEXT, -- Encrypted
    
    -- Sync settings
    sync_enabled BOOLEAN DEFAULT false,
    sync_frequency VARCHAR(50), -- hourly, daily, weekly, manual
    last_sync_at TIMESTAMP,
    last_sync_status VARCHAR(50),
    last_sync_records INTEGER,
    
    -- Field mapping
    field_mapping JSONB, -- {external_field: internal_field}
    
    -- Settings
    conflict_resolution VARCHAR(50) DEFAULT 'last_write_wins',
    is_active BOOLEAN DEFAULT true,
    
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by UUID REFERENCES users(id),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_integration_type ON integration_configs(integration_type);
CREATE INDEX idx_integration_active ON integration_configs(is_active);
```

---

## Views for Common Queries

### View: All Assets Summary
```sql
CREATE VIEW vw_all_assets_summary AS
SELECT 
    'physical' as asset_type,
    id,
    asset_description as name,
    owner_id,
    business_unit_id,
    criticality_level,
    created_at,
    updated_at
FROM physical_assets
WHERE deleted_at IS NULL

UNION ALL

SELECT 
    'information' as asset_type,
    id,
    name,
    information_owner_id as owner_id,
    business_unit_id,
    NULL as criticality_level,
    created_at,
    updated_at
FROM information_assets
WHERE deleted_at IS NULL

UNION ALL

SELECT 
    'application' as asset_type,
    id,
    application_name as name,
    owner_id,
    business_unit_id,
    criticality_level,
    created_at,
    updated_at
FROM business_applications
WHERE deleted_at IS NULL

UNION ALL

SELECT 
    'software' as asset_type,
    id,
    software_name as name,
    owner_id,
    business_unit_id,
    NULL as criticality_level,
    created_at,
    updated_at
FROM software_assets
WHERE deleted_at IS NULL

UNION ALL

SELECT 
    'supplier' as asset_type,
    id,
    supplier_name as name,
    owner_id,
    business_unit_id,
    criticality_level,
    created_at,
    updated_at
FROM suppliers
WHERE deleted_at IS NULL;
```

### View: Assets Without Owners
```sql
CREATE VIEW vw_assets_without_owners AS
SELECT * FROM vw_all_assets_summary
WHERE owner_id IS NULL;
```

### View: Critical Assets
```sql
CREATE VIEW vw_critical_assets AS
SELECT * FROM vw_all_assets_summary
WHERE criticality_level = 'critical';
```

---

## Database Functions

### Function: Get Asset Dependencies (Recursive)
```sql
CREATE OR REPLACE FUNCTION get_asset_dependencies(
    p_asset_type asset_category_enum,
    p_asset_id UUID,
    p_depth INTEGER DEFAULT 5
)
RETURNS TABLE (
    level INTEGER,
    asset_type asset_category_enum,
    asset_id UUID,
    dependency_type VARCHAR,
    path TEXT
) AS $$
BEGIN
    RETURN QUERY
    WITH RECURSIVE deps AS (
        -- Base case
        SELECT 
            1 as level,
            ad.target_asset_type as asset_type,
            ad.target_asset_id as asset_id,
            ad.dependency_type,
            ad.target_asset_type::TEXT || ':' || ad.target_asset_id::TEXT as path
        FROM asset_dependencies ad
        WHERE ad.source_asset_type = p_asset_type
        AND ad.source_asset_id = p_asset_id
        AND ad.deleted_at IS NULL
        
        UNION ALL
        
        -- Recursive case
        SELECT 
            d.level + 1,
            ad.target_asset_type,
            ad.target_asset_id,
            ad.dependency_type,
            d.path || ' -> ' || ad.target_asset_type::TEXT || ':' || ad.target_asset_id::TEXT
        FROM deps d
        JOIN asset_dependencies ad 
            ON ad.source_asset_type = d.asset_type
            AND ad.source_asset_id = d.asset_id
        WHERE d.level < p_depth
        AND ad.deleted_at IS NULL
        AND d.path NOT LIKE '%' || ad.target_asset_type::TEXT || ':' || ad.target_asset_id::TEXT || '%'
    )
    SELECT * FROM deps ORDER BY level, asset_type, asset_id;
END;
$$ LANGUAGE plpgsql;
```

---

## Triggers

### Trigger: Update timestamp on record modification
```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all asset tables
CREATE TRIGGER update_physical_assets_updated_at 
    BEFORE UPDATE ON physical_assets 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_information_assets_updated_at 
    BEFORE UPDATE ON information_assets 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_business_applications_updated_at 
    BEFORE UPDATE ON business_applications 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_software_assets_updated_at 
    BEFORE UPDATE ON software_assets 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_suppliers_updated_at 
    BEFORE UPDATE ON suppliers 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### Trigger: Audit log creation
```sql
CREATE OR REPLACE FUNCTION create_audit_log()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'DELETE') THEN
        INSERT INTO audit_logs (user_id, action, entity_type, entity_id, changes)
        VALUES (
            current_setting('app.current_user_id')::UUID,
            'delete',
            TG_TABLE_NAME,
            OLD.id,
            row_to_json(OLD)
        );
        RETURN OLD;
    ELSIF (TG_OP = 'UPDATE') THEN
        INSERT INTO audit_logs (user_id, action, entity_type, entity_id, changes)
        VALUES (
            current_setting('app.current_user_id')::UUID,
            'update',
            TG_TABLE_NAME,
            NEW.id,
            jsonb_build_object('old', row_to_json(OLD), 'new', row_to_json(NEW))
        );
        RETURN NEW;
    ELSIF (TG_OP = 'INSERT') THEN
        INSERT INTO audit_logs (user_id, action, entity_type, entity_id, changes)
        VALUES (
            current_setting('app.current_user_id')::UUID,
            'create',
            TG_TABLE_NAME,
            NEW.id,
            row_to_json(NEW)
        );
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Apply to asset tables
CREATE TRIGGER audit_physical_assets 
    AFTER INSERT OR UPDATE OR DELETE ON physical_assets 
    FOR EACH ROW EXECUTE FUNCTION create_audit_log();
-- Repeat for other asset tables...
```

---

## Indexes for Performance
```sql
-- Full-text search indexes
CREATE INDEX idx_physical_assets_search ON physical_assets 
    USING gin(to_tsvector('english', 
        coalesce(asset_description, '') || ' ' || 
        coalesce(manufacturer, '') || ' ' || 
        coalesce(model, '') || ' ' ||
        coalesce(unique_identifier, '')
    ));

CREATE INDEX idx_applications_search ON business_applications 
    USING gin(to_tsvector('english', 
        coalesce(application_name, '') || ' ' || 
        coalesce(vendor_name, '')
    ));

-- Composite indexes for common queries
CREATE INDEX idx_physical_assets_owner_unit ON physical_assets(owner_id, business_unit_id);
CREATE INDEX idx_applications_type_criticality ON business_applications(application_type, criticality_level);
CREATE INDEX idx_suppliers_criticality_active ON suppliers(criticality_level) WHERE is_active = true;
```

---

## Sample Data Queries

### Find all critical assets owned by a specific business unit
```sql
SELECT 
    asset_type,
    name,
    criticality_level,
    owner_id
FROM vw_all_assets_summary
WHERE business_unit_id = 'unit-uuid-here'
AND criticality_level = 'critical';
```

### Find all assets due for reclassification in next 30 days
```sql
SELECT 
    id,
    name,
    classification_level,
    reclassification_date,
    information_owner_id
FROM information_assets
WHERE reclassification_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '30 days'
AND deleted_at IS NULL
ORDER BY reclassification_date;
```

### Find supplier contracts expiring in next 90 days
```sql
SELECT 
    supplier_name,
    contract_reference,
    contract_end_date,
    criticality_level,
    owner_id
FROM suppliers
WHERE contract_end_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '90 days'
AND deleted_at IS NULL
ORDER BY contract_end_date;
```

