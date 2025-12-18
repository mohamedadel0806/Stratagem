# Stratagem GRC Platform - System Flow Diagrams and User Stories

**Document Version**: 1.0  
**Last Updated**: December 2024  
**Platform**: Stratagem GRC (Governance, Risk, Compliance)

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [System Architecture Overview](#system-architecture-overview)
3. [Asset Management Module](#asset-management-module)
   - [User Stories](#asset-user-stories)
   - [Flow Diagrams](#asset-flow-diagrams)
4. [Governance Management Module](#governance-management-module)
   - [User Stories](#governance-user-stories)
   - [Flow Diagrams](#governance-flow-diagrams)
5. [Integration Workflows](#integration-workflows)
   - [User Stories](#integration-user-stories)
   - [Flow Diagrams](#integration-flow-diagrams)
6. [End-to-End Workflows](#end-to-end-workflows)

---

## Executive Summary

The Stratagem GRC Platform is a comprehensive governance, risk, and compliance management system that enables organizations to:

- **Manage Assets**: Track physical, information, software, application, and supplier assets
- **Implement Governance**: Establish policies, controls, and compliance frameworks
- **Ensure Compliance**: Map controls to regulatory requirements and demonstrate compliance
- **Track Evidence**: Maintain audit-ready evidence and assessment records

This document provides detailed user stories and flow diagrams for all major system workflows.

---

## System Architecture Overview

### High-Level System Flow

```mermaid
flowchart TB
    subgraph External["External Influencers"]
        REG[Regulatory Requirements]
        CON[Contractual Obligations]
        STD[Industry Standards]
    end
    
    subgraph Governance["Governance Module"]
        INF[Influencer Registry]
        POL[Policy Management]
        CTL[Unified Control Library]
        ASS[Control Assessments]
        EVD[Evidence Repository]
    end
    
    subgraph Assets["Asset Module"]
        PA[Physical Assets]
        IA[Information Assets]
        SA[Software Assets]
        BA[Business Applications]
        SUP[Suppliers]
    end
    
    subgraph Integration["Integration Layer"]
        CAM[Control-Asset Mapping]
        CMP[Compliance Status]
        RPT[Reporting Engine]
    end
    
    REG --> INF
    CON --> INF
    STD --> INF
    
    INF --> POL
    POL --> CTL
    CTL --> ASS
    ASS --> EVD
    
    CTL --> CAM
    PA --> CAM
    IA --> CAM
    SA --> CAM
    BA --> CAM
    SUP --> CAM
    
    CAM --> CMP
    CMP --> RPT
    
    style Governance fill:#e3f2fd
    style Assets fill:#e8f5e9
    style Integration fill:#fff3e0
```

### Data Flow Summary

```mermaid
flowchart LR
    A[Influencers] -->|Drive| B[Policies]
    B -->|Define| C[Control Objectives]
    C -->|Implemented by| D[Controls]
    D -->|Applied to| E[Assets]
    E -->|Assessed via| F[Assessments]
    F -->|Generate| G[Evidence]
    G -->|Support| H[Compliance Reports]
    
    style A fill:#ffcdd2
    style B fill:#f8bbd9
    style C fill:#e1bee7
    style D fill:#c5cae9
    style E fill:#bbdefb
    style F fill:#b2ebf2
    style G fill:#c8e6c9
    style H fill:#dcedc8
```

---

## Asset Management Module

### Asset User Stories

#### Epic A1: Physical Asset Management

##### User Story A1.1: Create Physical Asset
**As a** cybersecurity analyst  
**I want to** add new physical assets (servers, workstations, network devices) to the inventory  
**So that** I can maintain an accurate record of all hardware assets

**Acceptance Criteria:**
- ✅ Can enter all required fields (name, type, location, owner)
- ✅ Can specify network details (IP, MAC address, hostname)
- ✅ Can set criticality level and business unit
- ✅ Unique identifier is auto-generated
- ✅ Audit log entry is created
- ✅ Validation errors are clearly displayed

**Priority**: P0 (Must Have)  
**Story Points**: 5

---

##### User Story A1.2: View Physical Asset Details
**As a** cybersecurity analyst  
**I want to** view detailed information about any physical asset  
**So that** I can access all relevant attributes, relationships, and compliance status

**Acceptance Criteria:**
- ✅ All asset attributes displayed in organized sections
- ✅ Related assets (dependencies) shown
- ✅ Governance controls linked to asset visible
- ✅ Audit history accessible
- ✅ Page loads within 2 seconds

**Priority**: P0 (Must Have)  
**Story Points**: 3

---

##### User Story A1.3: Update Physical Asset
**As a** cybersecurity analyst  
**I want to** update existing physical asset information  
**So that** asset records stay current and accurate

**Acceptance Criteria:**
- ✅ All fields are editable (with proper permissions)
- ✅ Changes are validated before saving
- ✅ Previous values are preserved in audit log
- ✅ Success/error feedback provided

**Priority**: P1 (Should Have)  
**Story Points**: 5

---

##### User Story A1.4: Search and Filter Physical Assets
**As a** cybersecurity analyst  
**I want to** search and filter physical assets by various criteria  
**So that** I can quickly find specific assets

**Acceptance Criteria:**
- ✅ Full-text search across all fields
- ✅ Filter by type, criticality, location, owner, status
- ✅ Results paginated and sortable
- ✅ Save filter configurations
- ✅ Export filtered results

**Priority**: P0 (Must Have)  
**Story Points**: 5

---

#### Epic A2: Information Asset Management

##### User Story A2.1: Create Information Asset
**As a** compliance officer  
**I want to** add information assets (databases, file shares, data repositories)  
**So that** I can track and classify data assets for compliance

**Acceptance Criteria:**
- ✅ Can set data classification level (Public, Internal, Confidential, Restricted)
- ✅ Can assign information owner and custodian
- ✅ Can link to physical assets where data resides
- ✅ Reclassification review date auto-calculated
- ✅ Compliance requirements linkable

**Priority**: P1 (Should Have)  
**Story Points**: 5

---

##### User Story A2.2: Classify Information Asset
**As a** compliance officer  
**I want to** classify information assets according to sensitivity levels  
**So that** appropriate controls can be applied

**Acceptance Criteria:**
- ✅ Classification levels clearly defined
- ✅ Classification justification required
- ✅ Reclassification workflow supported
- ✅ Classification history maintained

**Priority**: P0 (Must Have)  
**Story Points**: 5

---

#### Epic A3: Business Application Management

##### User Story A3.1: Create Business Application
**As a** security architect  
**I want to** add business applications to the inventory  
**So that** I can track applications and their security requirements

**Acceptance Criteria:**
- ✅ Can specify application details (name, version, vendor)
- ✅ Can define data types processed
- ✅ Can link to underlying infrastructure (servers, databases)
- ✅ Can assign application owner
- ✅ Integration with supplier management

**Priority**: P1 (Should Have)  
**Story Points**: 5

---

#### Epic A4: Software Asset Management

##### User Story A4.1: Create Software Asset
**As an** IT asset manager  
**I want to** add software assets to the inventory  
**So that** I can track software licenses and installations

**Acceptance Criteria:**
- ✅ Can specify software details (name, version, vendor)
- ✅ Can track license information (type, count, expiry)
- ✅ Can link to physical assets where installed
- ✅ License compliance alerts functional

**Priority**: P1 (Should Have)  
**Story Points**: 5

---

#### Epic A5: Supplier Management

##### User Story A5.1: Create Supplier
**As a** compliance officer  
**I want to** add third-party suppliers to the inventory  
**So that** I can track vendor relationships and manage third-party risk

**Acceptance Criteria:**
- ✅ Can specify supplier details and criticality
- ✅ Can add multiple contact persons
- ✅ Can track contract details and dates
- ✅ Can define goods/services provided
- ✅ Can link to assets provided by supplier

**Priority**: P1 (Should Have)  
**Story Points**: 5

---

#### Epic A6: Data Import

##### User Story A6.1: CSV Import
**As a** cybersecurity analyst  
**I want to** import asset data from CSV files  
**So that** I can quickly populate the asset inventory

**Acceptance Criteria:**
- ✅ File upload via drag-and-drop or file picker
- ✅ CSV parsing with preview (first 10 rows)
- ✅ Column mapping interface
- ✅ Validation before import
- ✅ Error report with row-level details
- ✅ Import audit log

**Priority**: P0 (Must Have)  
**Story Points**: 8

---

##### User Story A6.2: Excel Import
**As a** cybersecurity analyst  
**I want to** import asset data from Excel files (.xlsx, .xls)  
**So that** I can use existing spreadsheets

**Acceptance Criteria:**
- ✅ Support for .xlsx and .xls formats
- ✅ Multiple worksheet selection
- ✅ Same mapping interface as CSV
- ✅ Consistent error handling

**Priority**: P0 (Must Have)  
**Story Points**: 8

---

#### Epic A7: Asset Relationships

##### User Story A7.1: Create Asset Dependencies
**As a** security architect  
**I want to** map relationships between assets  
**So that** I can understand dependencies and assess impact

**Acceptance Criteria:**
- ✅ Can create parent-child relationships
- ✅ Can create peer relationships
- ✅ Can specify relationship type (depends on, hosts, connects to)
- ✅ Bidirectional relationships displayed
- ✅ Visual dependency graph available

**Priority**: P2 (Nice to Have)  
**Story Points**: 8

---

##### User Story A7.2: View Asset Dependency Graph
**As a** security architect  
**I want to** visualize asset dependencies in a graph  
**So that** I can understand impact of changes or incidents

**Acceptance Criteria:**
- ✅ Interactive graph visualization
- ✅ Drill-down to asset details
- ✅ Filter by relationship type
- ✅ Export graph as image

**Priority**: P2 (Nice to Have)  
**Story Points**: 8

---

#### Epic A8: Audit and Compliance

##### User Story A8.1: View Asset Audit Trail
**As a** compliance officer  
**I want to** view complete change history for any asset  
**So that** I can audit changes and demonstrate compliance

**Acceptance Criteria:**
- ✅ All changes logged with timestamp
- ✅ User attribution for each change
- ✅ Old and new values captured
- ✅ Export to CSV/PDF

**Priority**: P1 (Should Have)  
**Story Points**: 5

---

### Asset Flow Diagrams

#### Flow A1: Physical Asset Creation Flow

```mermaid
flowchart TD
    A[User Navigates to Assets] --> B[Click Add Physical Asset]
    B --> C[Fill Basic Information]
    C --> D[Asset Name & Description]
    D --> E[Select Asset Type]
    E --> F[Set Location]
    F --> G[Fill Technical Details]
    G --> H[IP Address]
    H --> I[MAC Address]
    I --> J[Hostname]
    J --> K[Set Ownership]
    K --> L[Select Owner]
    L --> M[Select Business Unit]
    M --> N[Set Criticality Level]
    N --> O{Form Valid?}
    O -->|No| P[Show Validation Errors]
    P --> C
    O -->|Yes| Q[Save Asset]
    Q --> R[Generate Unique ID]
    R --> S[Create Audit Log Entry]
    S --> T[Show Success Message]
    T --> U[Redirect to Asset Detail]
    
    style A fill:#e1f5ff
    style Q fill:#c8e6c9
    style P fill:#ffcdd2
    style U fill:#fff9c4
```

#### Flow A2: CSV Import Flow

```mermaid
flowchart TD
    A[Navigate to Import] --> B[Select CSV Import]
    B --> C[Choose Asset Type]
    C --> D[Upload File]
    D --> E{File Valid?}
    E -->|No| F[Show File Error]
    F --> D
    E -->|Yes| G[Parse CSV]
    G --> H[Display Preview]
    H --> I[Map Columns to Fields]
    I --> J[Show Mapping Preview]
    J --> K{Mapping Complete?}
    K -->|No| I
    K -->|Yes| L[Click Import]
    L --> M[Validate All Records]
    M --> N{Validation Passed?}
    N -->|No| O[Show Validation Errors]
    O --> P{Continue with Valid Records?}
    P -->|No| I
    P -->|Yes| Q[Process Import]
    N -->|Yes| Q
    Q --> R[Insert Records to Database]
    R --> S[Create Audit Entries]
    S --> T[Generate Results Summary]
    T --> U[Display Results]
    U --> V{Errors Found?}
    V -->|Yes| W[Show Error Report]
    V -->|No| X[Show Success Message]
    W --> Y[Done]
    X --> Y
    
    style A fill:#e1f5ff
    style G fill:#fff9c4
    style R fill:#c8e6c9
    style O fill:#ffcdd2
```

#### Flow A3: Asset Search and Discovery Flow

```mermaid
flowchart TD
    A[Navigate to Asset List] --> B{Search or Browse?}
    B -->|Search| C[Enter Search Term]
    B -->|Browse| D[View All Assets]
    C --> E[Execute Full-Text Search]
    E --> F[Search All Fields]
    F --> G[Display Results]
    D --> G
    G --> H{Apply Filters?}
    H -->|Yes| I[Open Filter Panel]
    I --> J[Select Filter Criteria]
    J --> K[Asset Type]
    J --> L[Criticality]
    J --> M[Business Unit]
    J --> N[Status]
    J --> O[Date Range]
    K --> P[Apply Filters]
    L --> P
    M --> P
    N --> P
    O --> P
    P --> Q[Execute Filtered Query]
    Q --> R[Display Filtered Results]
    H -->|No| S{Sort Results?}
    R --> S
    S -->|Yes| T[Select Sort Field]
    T --> U[Apply Sort]
    U --> V[Display Sorted Results]
    S -->|No| W{User Clicks Asset?}
    V --> W
    W -->|Yes| X[Navigate to Asset Detail]
    W -->|No| Y{Export Results?}
    Y -->|Yes| Z[Generate Export File]
    Z --> AA[Download Export]
    Y -->|No| AB[Stay on List]
    
    style A fill:#e1f5ff
    style X fill:#fff9c4
    style AA fill:#c8e6c9
```

#### Flow A4: Asset Update Flow

```mermaid
flowchart TD
    A[Open Asset Detail] --> B[Click Edit Button]
    B --> C[Load Edit Form]
    C --> D[Populate Current Values]
    D --> E[User Modifies Fields]
    E --> F[Real-time Validation]
    F --> G{Validation Errors?}
    G -->|Yes| H[Show Inline Errors]
    H --> E
    G -->|No| I[User Clicks Save]
    I --> J[Client Validation]
    J --> K{Client Valid?}
    K -->|No| H
    K -->|Yes| L[Send Update Request]
    L --> M[Server Validation]
    M --> N{Server Valid?}
    N -->|No| O[Return Validation Errors]
    O --> P[Display Error Messages]
    P --> E
    N -->|Yes| Q[Check Permissions]
    Q --> R{Permission Granted?}
    R -->|No| S[Show Access Denied]
    R -->|Yes| T[Update Database]
    T --> U[Create Audit Entry]
    U --> V{Track Changes}
    V --> W[Store Old Value]
    V --> X[Store New Value]
    V --> Y[Store User ID]
    V --> Z[Store Timestamp]
    W --> AA[Return Success]
    X --> AA
    Y --> AA
    Z --> AA
    AA --> AB[Display Success Message]
    AB --> AC[Refresh Detail View]
    
    style A fill:#e1f5ff
    style T fill:#c8e6c9
    style H fill:#ffcdd2
    style AC fill:#fff9c4
```

#### Flow A5: Asset Dependency Management Flow

```mermaid
flowchart TD
    A[Open Asset Detail] --> B[Click Dependencies Tab]
    B --> C[View Existing Dependencies]
    C --> D[Click Add Dependency]
    D --> E[Open Asset Browser]
    E --> F[Search for Asset]
    F --> G[Select Target Asset]
    G --> H[Choose Relationship Type]
    H --> I{Relationship Type}
    I -->|Depends On| J[Set Parent-Child]
    I -->|Connected To| K[Set Peer Connection]
    I -->|Hosts| L[Set Host Relationship]
    J --> M[Add Description]
    K --> M
    L --> M
    M --> N[Validate Relationship]
    N --> O{Valid?}
    O -->|No| P[Show Error]
    O -->|Yes| Q[Save Relationship]
    Q --> R[Create Bidirectional Link]
    R --> S[Update Dependency Graph]
    S --> T[Create Audit Entry]
    T --> U[Refresh Dependencies View]
    
    subgraph "Circular Dependency Check"
        N --> V{Circular Check}
        V -->|Circular Found| W[Block and Show Warning]
        W --> M
        V -->|No Circular| O
    end
    
    style A fill:#e1f5ff
    style Q fill:#c8e6c9
    style P fill:#ffcdd2
    style W fill:#ffcdd2
```

---

## Governance Management Module

### Governance User Stories

#### Epic G1: Influencer Management

##### User Story G1.1: Create Influencer Entry
**As a** compliance officer  
**I want to** create and register new governance influencers  
**So that** I can document all regulatory, contractual, and internal requirements

**Acceptance Criteria:**
- ✅ Can select influencer category (Internal, Contractual, Statutory, Regulatory, Industry Standard)
- ✅ Can specify issuing authority and jurisdiction
- ✅ Can set effective dates and review dates
- ✅ Can attach source documents
- ✅ Can tag and categorize
- ✅ Unique identifier auto-generated

**Priority**: P0 (Must Have)  
**Story Points**: 5

---

##### User Story G1.2: Assess Influencer Applicability
**As a** compliance officer  
**I want to** assess whether an influencer applies to our organization  
**So that** we focus only on relevant requirements

**Acceptance Criteria:**
- ✅ Can define applicability criteria (industry, geography, data types)
- ✅ Can set applicability status (Applicable, Not Applicable, Under Review)
- ✅ Justification required for decisions
- ✅ Evidence attachment supported
- ✅ Review date reminders functional

**Priority**: P0 (Must Have)  
**Story Points**: 8

---

##### User Story G1.3: View Influencer Relationships
**As a** compliance officer  
**I want to** view all policies and controls linked to an influencer  
**So that** I understand the influencer's impact across the organization

**Acceptance Criteria:**
- ✅ Show linked policies with status
- ✅ Show linked control objectives
- ✅ Show linked controls
- ✅ Navigate to related entities
- ✅ Impact analysis available

**Priority**: P0 (Must Have)  
**Story Points**: 5

---

##### User Story G1.4: Monitor Influencer Updates
**As a** compliance officer  
**I want to** track changes to external influencers (regulations, standards)  
**So that** I can assess impact of changes

**Acceptance Criteria:**
- ✅ Change history maintained
- ✅ Alert on updates (configurable)
- ✅ Impact assessment workflow
- ✅ Version comparison available

**Priority**: P1 (Should Have)  
**Story Points**: 8

---

#### Epic G2: Policy Management

##### User Story G2.1: Create Policy Document
**As a** policy manager  
**I want to** create a new policy using a standardized template  
**So that** all policies follow a consistent structure

**Acceptance Criteria:**
- ✅ Template selection available
- ✅ Rich text editor for content
- ✅ Version control (1.0, 1.1, 2.0, etc.)
- ✅ Status workflow (Draft → In Review → Approved → Published)
- ✅ Link to influencers
- ✅ Auto-save drafts

**Priority**: P0 (Must Have)  
**Story Points**: 8

---

##### User Story G2.2: Define Control Objectives
**As a** policy manager  
**I want to** define control objectives within a policy  
**So that** I establish clear, measurable requirements

**Acceptance Criteria:**
- ✅ Add control objectives to policy
- ✅ Auto-generated unique identifiers (CO-001, CO-002)
- ✅ Link to influencer requirements
- ✅ Assign responsible party
- ✅ Set target implementation date
- ✅ Reorder via drag-and-drop

**Priority**: P0 (Must Have)  
**Story Points**: 8

---

##### User Story G2.3: Policy Approval Workflow
**As a** policy manager  
**I want to** route policies through an approval process  
**So that** policies are reviewed before publication

**Acceptance Criteria:**
- ✅ Multi-level approval supported
- ✅ Approval comments captured
- ✅ Digital signature (optional)
- ✅ Rejection with feedback
- ✅ Email notifications sent
- ✅ Audit trail maintained

**Priority**: P0 (Must Have)  
**Story Points**: 13

---

##### User Story G2.4: Publish and Distribute Policy
**As a** policy manager  
**I want to** publish approved policies and notify users  
**So that** staff are aware of requirements

**Acceptance Criteria:**
- ✅ Publish changes status to Published
- ✅ Assign to users, roles, or business units
- ✅ Email notifications sent
- ✅ Published date recorded
- ✅ Previous versions accessible

**Priority**: P0 (Must Have)  
**Story Points**: 8

---

##### User Story G2.5: Track Policy Acknowledgments
**As a** policy manager  
**I want to** track which users have acknowledged reading policies  
**So that** I can demonstrate awareness compliance

**Acceptance Criteria:**
- ✅ Acknowledgment workflow for users
- ✅ Acknowledgment date captured
- ✅ Reminder notifications for overdue
- ✅ Acknowledgment rate reports
- ✅ Re-acknowledgment on policy updates

**Priority**: P1 (Should Have)  
**Story Points**: 8

---

#### Epic G3: Unified Control Library

##### User Story G3.1: Create Unified Control
**As a** compliance officer  
**I want to** create controls in the unified control library  
**So that** I can define implementation requirements once

**Acceptance Criteria:**
- ✅ Auto-generated control identifier (UCL-xxx-001)
- ✅ Control type selection (Preventive, Detective, Corrective, etc.)
- ✅ Domain and family assignment
- ✅ Rich text for description and procedures
- ✅ Complexity and cost impact ratings
- ✅ Owner assignment

**Priority**: P0 (Must Have)  
**Story Points**: 8

---

##### User Story G3.2: Map Control to Frameworks
**As a** compliance officer  
**I want to** map a control to requirements from multiple frameworks  
**So that** one control satisfies multiple compliance obligations

**Acceptance Criteria:**
- ✅ Select framework (NCA ECC, ISO 27001, NIST, etc.)
- ✅ Select specific requirement
- ✅ Set coverage level (Full, Partial, N/A)
- ✅ Add mapping notes
- ✅ Multiple frameworks per control
- ✅ Coverage matrix view

**Priority**: P0 (Must Have)  
**Story Points**: 13

---

##### User Story G3.3: Track Implementation Status
**As a** control owner  
**I want to** update the implementation status of my controls  
**So that** stakeholders can track governance maturity

**Acceptance Criteria:**
- ✅ Status options: Not Implemented, Planned, In Progress, Implemented, N/A
- ✅ Implementation percentage
- ✅ Implementation date
- ✅ Implementation notes
- ✅ Evidence attachment
- ✅ Notifications on status change

**Priority**: P0 (Must Have)  
**Story Points**: 8

---

##### User Story G3.4: Link Controls to Assets
**As a** control owner  
**I want to** link controls to assets where they're implemented  
**So that** I can demonstrate control coverage

**Acceptance Criteria:**
- ✅ Browse and search assets
- ✅ Select multiple assets
- ✅ Set implementation details per asset
- ✅ Bidirectional visibility (control shows assets, asset shows controls)
- ✅ Implementation status per asset

**Priority**: P1 (Should Have)  
**Story Points**: 8

---

#### Epic G4: Control Assessments

##### User Story G4.1: Create Assessment
**As an** assessor  
**I want to** create and plan control assessments  
**So that** I can evaluate control effectiveness

**Acceptance Criteria:**
- ✅ Define assessment scope and period
- ✅ Select controls to assess
- ✅ Assign assessors
- ✅ Define assessment procedures
- ✅ Set assessment type (Design, Operating Effectiveness)
- ✅ Send notifications to assessors

**Priority**: P0 (Must Have)  
**Story Points**: 13

---

##### User Story G4.2: Execute Assessment
**As an** assessor  
**I want to** execute assessments and record findings  
**So that** control effectiveness is documented

**Acceptance Criteria:**
- ✅ View control details and procedures
- ✅ Collect and upload evidence
- ✅ Record assessment result (Compliant, Non-Compliant, Partially Compliant)
- ✅ Rate effectiveness (1-5 scale)
- ✅ Document findings and observations
- ✅ Flag for remediation if needed

**Priority**: P0 (Must Have)  
**Story Points**: 13

---

##### User Story G4.3: Review Assessment Results
**As a** lead assessor  
**I want to** review all assessment results  
**So that** I can approve or request changes

**Acceptance Criteria:**
- ✅ View all assessment results
- ✅ Approve or reject results
- ✅ Add review comments
- ✅ Request additional evidence
- ✅ Complete assessment when all reviewed
- ✅ Generate assessment report

**Priority**: P0 (Must Have)  
**Story Points**: 8

---

#### Epic G5: Evidence Management

##### User Story G5.1: Upload Evidence
**As a** control owner  
**I want to** upload and manage control evidence  
**So that** I can demonstrate control effectiveness

**Acceptance Criteria:**
- ✅ Upload various file types (PDF, images, documents)
- ✅ Set evidence metadata (title, type, collection date)
- ✅ Link to controls and assessments
- ✅ Set validity period
- ✅ Status workflow (Draft, Under Review, Approved, Expired)

**Priority**: P1 (Should Have)  
**Story Points**: 5

---

##### User Story G5.2: Evidence Expiration Alerts
**As a** compliance officer  
**I want to** receive alerts when evidence is expiring  
**So that** I can refresh evidence in time

**Acceptance Criteria:**
- ✅ Configurable expiration alerts (30, 60, 90 days)
- ✅ Email notifications
- ✅ Dashboard widget showing expiring evidence
- ✅ Bulk renewal workflow

**Priority**: P2 (Nice to Have)  
**Story Points**: 5

---

#### Epic G6: Findings and Remediation

##### User Story G6.1: Create Finding
**As an** assessor  
**I want to** document findings from assessments  
**So that** issues are tracked and remediated

**Acceptance Criteria:**
- ✅ Link finding to control and assessment
- ✅ Set severity (Critical, High, Medium, Low)
- ✅ Document finding details
- ✅ Assign to responsible party
- ✅ Set due date for remediation
- ✅ Track finding status

**Priority**: P0 (Must Have)  
**Story Points**: 8

---

##### User Story G6.2: Track Remediation
**As a** compliance officer  
**I want to** track remediation of findings  
**So that** issues are resolved in time

**Acceptance Criteria:**
- ✅ Create remediation plan
- ✅ Track remediation progress
- ✅ Record completion and evidence
- ✅ Verify remediation effectiveness
- ✅ Close finding when remediated
- ✅ Overdue alerts

**Priority**: P0 (Must Have)  
**Story Points**: 8

---

### Governance Flow Diagrams

#### Flow G1: Influencer Creation and Applicability Flow

```mermaid
flowchart TD
    A[Navigate to Influencers] --> B[Click Add New Influencer]
    B --> C[Select Category]
    C --> D{Category Type}
    D -->|Regulatory| E[Load Regulatory Fields]
    D -->|Contractual| F[Load Contractual Fields]
    D -->|Statutory| G[Load Statutory Fields]
    D -->|Internal| H[Load Internal Fields]
    D -->|Industry Standard| I[Load Standard Fields]
    
    E --> J[Fill Required Fields]
    F --> J
    G --> J
    H --> J
    I --> J
    
    J --> K[Name and Description]
    K --> L[Issuing Authority]
    L --> M[Jurisdiction]
    M --> N[Effective Date]
    N --> O[Status]
    
    O --> P[Attach Source Documents]
    P --> Q[Add Tags]
    Q --> R[Select Affected Business Units]
    R --> S{Form Valid?}
    S -->|No| T[Show Validation Errors]
    T --> J
    S -->|Yes| U[Save Influencer]
    U --> V[Generate Unique ID]
    V --> W[Create Audit Log]
    W --> X[Redirect to Detail Page]
    
    X --> Y[User Clicks Assess Applicability]
    Y --> Z[Fill Applicability Criteria]
    Z --> AA[Industry Selection]
    Z --> AB[Geography Selection]
    Z --> AC[Data Types Selection]
    Z --> AD[Business Activities]
    
    AA --> AE[Select Applicability Status]
    AB --> AE
    AC --> AE
    AD --> AE
    
    AE --> AF{Status}
    AF -->|Applicable| AG[Enter Justification]
    AF -->|Not Applicable| AH[Enter Justification]
    AF -->|Under Review| AI[Set Review Date]
    
    AG --> AJ[Set Review Date]
    AH --> AJ
    AI --> AJ
    
    AJ --> AK[Attach Evidence]
    AK --> AL[Save Assessment]
    AL --> AM[Schedule Review Reminder]
    AM --> AN[Update Influencer Status]
    
    style A fill:#e1f5ff
    style U fill:#c8e6c9
    style T fill:#ffcdd2
    style AN fill:#fff9c4
```

#### Flow G2: Policy Creation and Approval Flow

```mermaid
flowchart TD
    A[Navigate to Policies] --> B[Click Create Policy]
    B --> C[Select Template]
    C --> D[Fill Policy Metadata]
    D --> E[Title and Type]
    E --> F[Version Auto-Generated]
    F --> G[Select Owner]
    G --> H[Select Business Units]
    H --> I[Set Review Frequency]
    
    I --> J[Link to Influencers]
    J --> K[Fill Policy Content]
    K --> L[Purpose Section]
    L --> M[Scope Section]
    M --> N[Policy Statements]
    
    N --> O[Define Control Objectives]
    O --> P[Add Control Objective]
    P --> Q[Statement]
    Q --> R[Rationale]
    R --> S[Link to Influencer]
    S --> T[Assign Responsible Party]
    T --> U[Set Target Date]
    U --> V{Add More?}
    V -->|Yes| P
    V -->|No| W[Reorder Objectives]
    
    W --> X[Save Draft]
    X --> Y{Auto-Save}
    Y --> Z[Status: Draft]
    
    Z --> AA[Submit for Review]
    AA --> AB[Status: In Review]
    AB --> AC[Notify Approvers]
    
    AC --> AD{Multi-Level Approval?}
    AD -->|Yes| AE[Notify First Approver]
    AD -->|No| AF[Notify Single Approver]
    
    AE --> AG[Approver Reviews]
    AF --> AG
    
    AG --> AH{Decision}
    AH -->|Approve| AI{More Approvers?}
    AH -->|Reject| AJ[Status: Rejected]
    AH -->|Request Changes| AK[Status: Changes Requested]
    
    AI -->|Yes| AL[Notify Next Approver]
    AL --> AG
    AI -->|No| AM[Status: Approved]
    
    AK --> AN[Notify Policy Owner]
    AN --> AO[Owner Makes Changes]
    AO --> AA
    
    AJ --> AP[Notify Policy Owner]
    
    AM --> AQ[Ready for Publication]
    AQ --> AR[Click Publish]
    AR --> AS[Configure Distribution]
    AS --> AT[Select Users/Roles/BUs]
    AT --> AU[Set Notification Message]
    AU --> AV[Publish Policy]
    AV --> AW[Status: Published]
    AW --> AX[Send Notifications]
    AX --> AY[Users Acknowledge]
    
    style A fill:#e1f5ff
    style AM fill:#c8e6c9
    style AJ fill:#ffcdd2
    style AW fill:#fff9c4
```

#### Flow G3: Unified Control Management Flow

```mermaid
flowchart TD
    A[Navigate to Control Library] --> B[Click Create Control]
    B --> C[Fill Control Details]
    C --> D[Auto-Generate Identifier]
    D --> E[Enter Title]
    E --> F[Select Domain]
    F --> G[Select Control Family]
    G --> H[Select Control Type]
    H --> I{Type Selection}
    I -->|Preventive| J[Blocks Threats]
    I -->|Detective| K[Identifies Threats]
    I -->|Corrective| L[Fixes Issues]
    I -->|Compensating| M[Alternative Control]
    
    J --> N[Enter Description]
    K --> N
    L --> N
    M --> N
    
    N --> O[Enter Control Procedures]
    O --> P[Enter Testing Procedures]
    P --> Q[Set Complexity]
    Q --> R[Set Cost Impact]
    R --> S[Assign Owner]
    S --> T[Add Tags]
    T --> U[Save Control]
    U --> V[Status: Draft]
    V --> W[Activate Control]
    W --> X[Status: Active]
    
    X --> Y[Map to Frameworks]
    Y --> Z[Click Add Framework Mapping]
    Z --> AA[Select Framework]
    AA --> AB{Framework}
    AB -->|NCA ECC| AC[Load NCA Requirements]
    AB -->|ISO 27001| AD[Load ISO Requirements]
    AB -->|NIST CSF| AE[Load NIST Requirements]
    AB -->|Other| AF[Load Other Requirements]
    
    AC --> AG[Select Requirement]
    AD --> AG
    AE --> AG
    AF --> AG
    
    AG --> AH[Set Coverage Level]
    AH --> AI{Coverage}
    AI -->|Full| AJ[Fully Satisfies]
    AI -->|Partial| AK[Partially Satisfies]
    AI -->|N/A| AL[Not Applicable]
    
    AJ --> AM[Add Mapping Notes]
    AK --> AM
    AL --> AM
    
    AM --> AN[Save Mapping]
    AN --> AO{Map More?}
    AO -->|Yes| Z
    AO -->|No| AP[View Coverage Matrix]
    
    style A fill:#e1f5ff
    style U fill:#c8e6c9
    style X fill:#fff9c4
    style AP fill:#e1f5ff
```

#### Flow G4: Control Assessment Flow

```mermaid
flowchart TD
    A[Navigate to Assessments] --> B[Create New Assessment]
    B --> C[Enter Assessment Details]
    C --> D[Assessment Name]
    D --> E[Description]
    E --> F[Assessment Type]
    F --> G{Type}
    G -->|Design Effectiveness| H[Test Control Design]
    G -->|Operating Effectiveness| I[Test Control Operation]
    
    H --> J[Set Assessment Period]
    I --> J
    
    J --> K[Start Date]
    K --> L[End Date]
    L --> M[Select Lead Assessor]
    M --> N[Add Additional Assessors]
    
    N --> O[Select Controls to Assess]
    O --> P[Browse Control Library]
    P --> Q[Filter by Domain]
    Q --> R[Select Controls]
    R --> S[Define Assessment Procedures]
    S --> T[Create Assessment Plan]
    T --> U[Notify Assessors]
    U --> V[Status: Not Started]
    
    V --> W[Assessment Period Starts]
    W --> X[Status: In Progress]
    X --> Y[Assessor Opens Assessment]
    
    Y --> Z[View Assigned Controls]
    Z --> AA[Open Control for Assessment]
    AA --> AB[Review Control Details]
    AB --> AC[Review Testing Procedures]
    AC --> AD[Collect Evidence]
    AD --> AE[Upload Evidence Files]
    AE --> AF[Record Assessment Result]
    AF --> AG{Result}
    AG -->|Compliant| AH[Full Compliance]
    AG -->|Partially Compliant| AI[Partial Compliance]
    AG -->|Non-Compliant| AJ[Non-Compliance]
    
    AH --> AK[Rate Effectiveness 1-5]
    AI --> AK
    AJ --> AK
    
    AK --> AL[Document Findings]
    AL --> AM[Add Observations]
    AM --> AN{Requires Remediation?}
    AN -->|Yes| AO[Create Finding]
    AN -->|No| AP[Submit Result]
    AO --> AP
    
    AP --> AQ{All Controls Assessed?}
    AQ -->|No| Z
    AQ -->|Yes| AR[Status: Under Review]
    
    AR --> AS[Lead Assessor Reviews]
    AS --> AT{Review Complete?}
    AT -->|No| AU[Request Changes]
    AU --> AF
    AT -->|Yes| AV[Status: Completed]
    
    AV --> AW[Generate Assessment Report]
    AW --> AX[Create Remediation Actions]
    AX --> AY[Notify Control Owners]
    
    style A fill:#e1f5ff
    style T fill:#fff9c4
    style AV fill:#c8e6c9
    style AU fill:#ffcdd2
```

#### Flow G5: Evidence Management Flow

```mermaid
flowchart TD
    A[Navigate to Evidence] --> B[Click Upload Evidence]
    B --> C[Fill Evidence Details]
    C --> D[Evidence Title]
    D --> E[Select Evidence Type]
    E --> F{Type}
    F -->|Configuration Screenshot| G[Screenshot]
    F -->|Policy Document| H[Document]
    F -->|System Report| I[Report]
    F -->|Audit Log| J[Log File]
    F -->|Test Results| K[Test Output]
    
    G --> L[Set Collection Date]
    H --> L
    I --> L
    J --> L
    K --> L
    
    L --> M[Set Validity Period]
    M --> N[Valid Until Date]
    N --> O[Enter Description]
    O --> P[Upload File]
    P --> Q{File Valid?}
    Q -->|No| R[Show Error]
    R --> P
    Q -->|Yes| S[Link to Control]
    S --> T[Search Controls]
    T --> U[Select Control]
    U --> V[Save Evidence]
    V --> W[Status: Draft]
    
    W --> X{Review Required?}
    X -->|Yes| Y[Submit for Review]
    Y --> Z[Status: Under Review]
    Z --> AA[Reviewer Approves]
    AA --> AB[Status: Approved]
    X -->|No| AB
    
    AB --> AC[Evidence Active]
    AC --> AD{Approaching Expiry?}
    AD -->|Yes| AE[Send Expiration Alert]
    AE --> AF[User Notified]
    AF --> AG{User Action?}
    AG -->|Renew| AH[Upload New Evidence]
    AH --> B
    AG -->|Extend| AI[Update Valid Until]
    AI --> AC
    AD -->|No| AJ[Continue Monitoring]
    AJ --> AD
    
    AB --> AK[Evidence Expired]
    AK --> AL[Status: Expired]
    AL --> AM[Alert Compliance Team]
    
    style A fill:#e1f5ff
    style V fill:#c8e6c9
    style AB fill:#fff9c4
    style AL fill:#ffcdd2
```

#### Flow G6: Finding and Remediation Flow

```mermaid
flowchart TD
    A[Assessment Identifies Issue] --> B[Create Finding]
    B --> C[Link to Control]
    C --> D[Link to Assessment]
    D --> E[Set Finding Details]
    E --> F[Finding Title]
    F --> G[Finding Description]
    G --> H[Set Severity]
    H --> I{Severity Level}
    I -->|Critical| J[Immediate Action Required]
    I -->|High| K[Action Within 30 Days]
    I -->|Medium| L[Action Within 90 Days]
    I -->|Low| M[Action Within 180 Days]
    
    J --> N[Assign Responsible Party]
    K --> N
    L --> N
    M --> N
    
    N --> O[Set Due Date]
    O --> P[Save Finding]
    P --> Q[Notify Responsible Party]
    Q --> R[Status: Open]
    
    R --> S[Create Remediation Plan]
    S --> T[Define Remediation Steps]
    T --> U[Set Milestones]
    U --> V[Assign Resources]
    V --> W[Status: In Progress]
    
    W --> X[Track Progress]
    X --> Y{On Track?}
    Y -->|No| Z[Send Overdue Alert]
    Z --> AA[Escalate if Needed]
    AA --> X
    Y -->|Yes| AB[Update Progress]
    AB --> AC{Complete?}
    AC -->|No| X
    AC -->|Yes| AD[Submit for Verification]
    
    AD --> AE[Upload Remediation Evidence]
    AE --> AF[Status: Pending Verification]
    AF --> AG[Assessor Verifies]
    AG --> AH{Effective?}
    AH -->|No| AI[Reopen Finding]
    AI --> S
    AH -->|Yes| AJ[Close Finding]
    AJ --> AK[Status: Closed]
    AK --> AL[Update Control Status]
    AL --> AM[Archive Finding]
    
    style A fill:#e1f5ff
    style P fill:#c8e6c9
    style AK fill:#c8e6c9
    style Z fill:#ffcdd2
    style AI fill:#ffcdd2
```

---

## Integration Workflows

### Integration User Stories

#### Epic I1: Control-Asset Integration

##### User Story I1.1: Link Control to Assets
**As a** control owner  
**I want to** link my controls to assets where they're implemented  
**So that** I can demonstrate control coverage across IT environment

**Acceptance Criteria:**
- ✅ Browse and search assets from control detail page
- ✅ Filter assets by type, criticality, business unit
- ✅ Select multiple assets at once
- ✅ Set implementation details per asset
- ✅ Bidirectional linking (control shows assets, asset shows controls)
- ✅ Audit trail in both modules

**Priority**: P1 (Should Have)  
**Story Points**: 8

---

##### User Story I1.2: View Asset Compliance Status
**As a** compliance officer  
**I want to** view compliance status of assets based on assigned controls  
**So that** I can identify non-compliant assets

**Acceptance Criteria:**
- ✅ Compliance percentage calculated
- ✅ Status indicators (Compliant, Partially Compliant, Non-Compliant)
- ✅ Breakdown by control status
- ✅ Link to detailed compliance report
- ✅ Dashboard widget available

**Priority**: P1 (Should Have)  
**Story Points**: 5

---

##### User Story I1.3: Bulk Control Assignment
**As a** compliance officer  
**I want to** assign multiple controls to an asset at once  
**So that** I can efficiently manage control coverage

**Acceptance Criteria:**
- ✅ Select multiple controls from library
- ✅ Set default implementation details
- ✅ Option to customize per control
- ✅ Validation before assignment
- ✅ Bulk update capability

**Priority**: P2 (Nice to Have)  
**Story Points**: 5

---

#### Epic I2: Compliance Reporting

##### User Story I2.1: Generate Framework Compliance Report
**As a** compliance officer  
**I want to** generate compliance reports with asset details  
**So that** I can demonstrate compliance to auditors

**Acceptance Criteria:**
- ✅ Select framework (NCA ECC, ISO 27001, etc.)
- ✅ Include asset compliance details
- ✅ Show control-to-requirement mapping
- ✅ Visual charts and graphs
- ✅ Export to PDF/Excel

**Priority**: P1 (Should Have)  
**Story Points**: 8

---

##### User Story I2.2: Control Gap Analysis
**As a** compliance officer  
**I want to** identify assets missing required controls  
**So that** I can prioritize control implementation

**Acceptance Criteria:**
- ✅ Identify assets without controls
- ✅ Determine required controls by asset type
- ✅ Show gap analysis by framework
- ✅ Drill-down to specific assets
- ✅ Export gap report

**Priority**: P1 (Should Have)  
**Story Points**: 8

---

### Integration Flow Diagrams

#### Flow I1: Control-Asset Linking Flow

```mermaid
flowchart TD
    A[Open Control Detail] --> B[Click Linked Assets Tab]
    B --> C[View Existing Links]
    C --> D[Click Link Assets]
    D --> E[Asset Browser Opens]
    E --> F[Filter Assets]
    F --> G[By Asset Type]
    F --> H[By Criticality]
    F --> I[By Business Unit]
    F --> J[By Status]
    
    G --> K[Search Assets]
    H --> K
    I --> K
    J --> K
    
    K --> L[Display Results]
    L --> M[Select Multiple Assets]
    M --> N[Set Implementation Details]
    N --> O[Implementation Date]
    O --> P[Implementation Status]
    P --> Q[Implementation Notes]
    Q --> R[Click Link Assets]
    
    R --> S[Validate Links]
    S --> T{Valid?}
    T -->|No| U[Show Errors]
    U --> N
    T -->|Yes| V[Create Control-Asset Mappings]
    V --> W[Update Control Coverage]
    W --> X[Update Asset Compliance]
    X --> Y[Create Audit Log - Control]
    Y --> Z[Create Audit Log - Asset]
    Z --> AA[Show Success Message]
    AA --> AB[Refresh Linked Assets List]
    
    subgraph "Bidirectional Visibility"
        AB --> AC[Assets Visible in Control]
        AC --> AD[Controls Visible in Asset]
    end
    
    style A fill:#e1f5ff
    style V fill:#c8e6c9
    style U fill:#ffcdd2
    style AD fill:#fff9c4
```

#### Flow I2: Asset Compliance Calculation Flow

```mermaid
flowchart TD
    A[View Asset Detail] --> B[Click Governance Tab]
    B --> C[Load Linked Controls]
    C --> D[For Each Linked Control]
    D --> E{Control Status}
    E -->|Not Implemented| F[Count as Non-Compliant]
    E -->|Planned| G[Count as Pending]
    E -->|In Progress| H[Count as Pending]
    E -->|Implemented| I[Check Assessment]
    E -->|Not Applicable| J[Exclude from Calculation]
    
    I --> K{Assessment Available?}
    K -->|Yes| L{Assessment Result}
    L -->|Compliant| M[Count as Compliant]
    L -->|Partially Compliant| N[Count as Partial]
    L -->|Non-Compliant| O[Count as Non-Compliant]
    K -->|No| P[Count as Implemented/Not Tested]
    
    F --> Q[Calculate Metrics]
    G --> Q
    H --> Q
    M --> Q
    N --> Q
    O --> Q
    P --> Q
    
    Q --> R[Total Controls]
    Q --> S[Implemented Controls]
    Q --> T[Compliant Controls]
    Q --> U[Non-Compliant Controls]
    Q --> V[Pending Controls]
    
    R --> W[Calculate Compliance %]
    S --> W
    T --> W
    U --> W
    V --> W
    
    W --> X{Compliance Level}
    X -->|>= 90%| Y[Status: Compliant]
    X -->|70-89%| Z[Status: Partially Compliant]
    X -->|< 70%| AA[Status: Non-Compliant]
    
    Y --> AB[Display Green Indicator]
    Z --> AC[Display Yellow Indicator]
    AA --> AD[Display Red Indicator]
    
    AB --> AE[Display Compliance Dashboard]
    AC --> AE
    AD --> AE
    
    style A fill:#e1f5ff
    style W fill:#fff9c4
    style Y fill:#c8e6c9
    style Z fill:#fff9c4
    style AA fill:#ffcdd2
```

#### Flow I3: Framework Compliance Report Flow

```mermaid
flowchart TD
    A[Navigate to Reports] --> B[Select Framework Compliance]
    B --> C[Configure Report]
    C --> D[Select Framework]
    D --> E{Framework Selection}
    E -->|NCA ECC| F[Load NCA Requirements]
    E -->|ISO 27001| G[Load ISO Controls]
    E -->|NIST CSF| H[Load NIST Functions]
    E -->|PCI DSS| I[Load PCI Requirements]
    
    F --> J[Select Report Options]
    G --> J
    H --> J
    I --> J
    
    J --> K[Include Asset Details?]
    K --> L[Date Range Selection]
    L --> M[Business Unit Filter]
    M --> N[Generate Report]
    
    N --> O[Query Controls]
    O --> P[Get Framework Mappings]
    P --> Q[Get Control Assessments]
    Q --> R[Get Linked Assets]
    R --> S[Calculate Compliance Metrics]
    
    S --> T[Build Report Sections]
    T --> U[Executive Summary]
    U --> V[Compliance Overview]
    V --> W[Control Status by Requirement]
    W --> X[Asset Compliance Details]
    X --> Y[Evidence References]
    Y --> Z[Recommendations]
    
    Z --> AA[Generate Charts]
    AA --> AB[Compliance by Domain]
    AB --> AC[Trend Over Time]
    AC --> AD[Risk Heat Map]
    
    AD --> AE[Display Report]
    AE --> AF{Export?}
    AF -->|PDF| AG[Generate PDF]
    AF -->|Excel| AH[Generate Excel]
    AF -->|View| AI[Display in Browser]
    
    AG --> AJ[Download Report]
    AH --> AJ
    
    style A fill:#e1f5ff
    style N fill:#fff9c4
    style AE fill:#c8e6c9
    style AJ fill:#e1f5ff
```

#### Flow I4: Gap Analysis Flow

```mermaid
flowchart TD
    A[Navigate to Gap Analysis] --> B[Select Analysis Type]
    B --> C{Analysis Type}
    C -->|By Framework| D[Select Framework]
    C -->|By Asset Type| E[Select Asset Type]
    C -->|By Business Unit| F[Select Business Unit]
    
    D --> G[Load Framework Requirements]
    E --> H[Load Required Controls for Type]
    F --> I[Load BU Compliance Requirements]
    
    G --> J[Run Analysis]
    H --> J
    I --> J
    
    J --> K[Get All Requirements]
    K --> L[Get Mapped Controls]
    L --> M[Get Implementation Status]
    M --> N[Get Linked Assets]
    
    N --> O[Calculate Gaps]
    O --> P[Requirements Without Controls]
    O --> Q[Controls Not Implemented]
    O --> R[Assets Without Required Controls]
    O --> S[Partial Implementations]
    
    P --> T[Generate Gap Report]
    Q --> T
    R --> T
    S --> T
    
    T --> U[Display Gap Summary]
    U --> V[Total Requirements]
    V --> W[Covered Requirements]
    W --> X[Gap Percentage]
    X --> Y[Priority Gaps]
    
    Y --> Z[Display Detailed Gaps]
    Z --> AA[Gap by Requirement]
    AA --> AB[Click Requirement]
    AB --> AC{View Options}
    AC -->|View Controls| AD[Show Mapped Controls]
    AC -->|View Assets| AE[Show Affected Assets]
    AC -->|Create Control| AF[Create New Control]
    
    AD --> AG[Navigate to Control]
    AE --> AH[Navigate to Asset]
    AF --> AI[Open Control Creation]
    
    Z --> AJ[Export Gap Report]
    AJ --> AK[Download Excel Report]
    
    style A fill:#e1f5ff
    style J fill:#fff9c4
    style U fill:#c8e6c9
    style AK fill:#e1f5ff
```

---

## End-to-End Workflows

### E2E Flow 1: Complete Governance Implementation Cycle

```mermaid
flowchart TD
    subgraph Phase1["Phase 1: Identify Requirements"]
        A[New Regulation Published] --> B[Create Influencer]
        B --> C[Assess Applicability]
        C --> D{Applicable?}
        D -->|Yes| E[Document Requirements]
        D -->|No| F[Archive as N/A]
    end
    
    subgraph Phase2["Phase 2: Define Policies"]
        E --> G[Create/Update Policy]
        G --> H[Define Control Objectives]
        H --> I[Submit for Approval]
        I --> J{Approved?}
        J -->|Yes| K[Publish Policy]
        J -->|No| L[Revise Policy]
        L --> I
    end
    
    subgraph Phase3["Phase 3: Implement Controls"]
        K --> M[Create/Map Controls]
        M --> N[Assign Control Owners]
        N --> O[Implement Controls]
        O --> P[Link to Assets]
        P --> Q[Update Implementation Status]
    end
    
    subgraph Phase4["Phase 4: Assess Effectiveness"]
        Q --> R[Create Assessment]
        R --> S[Execute Assessment]
        S --> T[Collect Evidence]
        T --> U[Record Results]
        U --> V{Findings?}
        V -->|Yes| W[Create Remediation]
        V -->|No| X[Close Assessment]
    end
    
    subgraph Phase5["Phase 5: Continuous Improvement"]
        W --> Y[Implement Remediation]
        Y --> Z[Verify Fix]
        Z --> AA[Update Control Status]
        AA --> AB[Generate Compliance Report]
        X --> AB
        AB --> AC[Review and Improve]
        AC --> A
    end
    
    style Phase1 fill:#ffebee
    style Phase2 fill:#e3f2fd
    style Phase3 fill:#e8f5e9
    style Phase4 fill:#fff8e1
    style Phase5 fill:#f3e5f5
```

### E2E Flow 2: Asset Onboarding with Governance

```mermaid
flowchart TD
    A[New Asset Acquired] --> B[Create Asset Record]
    B --> C[Enter Asset Details]
    C --> D[Set Classification]
    D --> E[Assign Owner]
    E --> F[Determine Required Controls]
    F --> G[Based on Asset Type]
    F --> H[Based on Data Classification]
    F --> I[Based on Criticality]
    
    G --> J[Generate Control Requirements]
    H --> J
    I --> J
    
    J --> K{Controls Exist?}
    K -->|Yes| L[Link Existing Controls]
    K -->|No| M[Create New Controls]
    M --> L
    
    L --> N[Set Implementation Status]
    N --> O{Implemented?}
    O -->|Yes| P[Mark as Implemented]
    O -->|No| Q[Create Implementation Plan]
    
    P --> R[Collect Evidence]
    Q --> S[Track Implementation]
    S --> P
    
    R --> T[Schedule Assessment]
    T --> U[Complete Assessment]
    U --> V[Update Compliance Status]
    V --> W[Asset Fully Onboarded]
    
    W --> X[Monitor Ongoing]
    X --> Y{Changes Detected?}
    Y -->|Yes| Z[Reassess Controls]
    Z --> F
    Y -->|No| X
    
    style A fill:#e1f5ff
    style W fill:#c8e6c9
    style X fill:#fff9c4
```

### E2E Flow 3: Audit Preparation Workflow

```mermaid
flowchart TD
    A[Audit Announced] --> B[Identify Audit Scope]
    B --> C[Determine Frameworks in Scope]
    C --> D[Identify Controls in Scope]
    D --> E[Identify Assets in Scope]
    
    E --> F[Review Control Status]
    F --> G{All Implemented?}
    G -->|No| H[Prioritize Gaps]
    H --> I[Emergency Remediation]
    I --> F
    G -->|Yes| J[Review Assessments]
    
    J --> K{Recent Assessments?}
    K -->|No| L[Schedule Assessments]
    L --> M[Execute Assessments]
    M --> N[Document Results]
    K -->|Yes| N
    
    N --> O[Gather Evidence]
    O --> P[Evidence Repository]
    P --> Q{Evidence Complete?}
    Q -->|No| R[Collect Missing Evidence]
    R --> P
    Q -->|Yes| S[Generate Audit Package]
    
    S --> T[Compliance Report]
    T --> U[Control Mapping Matrix]
    U --> V[Evidence Index]
    V --> W[Assessment Results]
    
    W --> X[Review Package]
    X --> Y{Ready?}
    Y -->|No| Z[Address Gaps]
    Z --> O
    Y -->|Yes| AA[Submit to Auditors]
    
    AA --> AB[Support Audit Activities]
    AB --> AC[Address Audit Queries]
    AC --> AD[Receive Audit Report]
    AD --> AE{Findings?}
    AE -->|Yes| AF[Create Remediation Plan]
    AF --> AG[Track Remediation]
    AG --> AH[Close Audit]
    AE -->|No| AH
    
    style A fill:#e1f5ff
    style S fill:#fff9c4
    style AA fill:#c8e6c9
    style AF fill:#ffcdd2
```

---

## Summary

This document provides comprehensive flow diagrams and user stories for the Stratagem GRC Platform, covering:

### Asset Management Module
- 5 asset types (Physical, Information, Software, Application, Supplier)
- Data import/export capabilities
- Asset relationships and dependencies
- Audit trail and compliance tracking

### Governance Management Module
- Influencer registry and applicability assessment
- Policy creation and approval workflows
- Unified Control Library with framework mapping
- Control assessments and evidence management
- Finding tracking and remediation

### Integration Layer
- Control-to-asset linking
- Compliance status calculation
- Gap analysis and reporting
- End-to-end governance workflows

### Key Metrics
- **Total User Stories**: 35+
- **Total Flow Diagrams**: 15+
- **Priority Distribution**:
  - P0 (Must Have): 18 stories
  - P1 (Should Have): 12 stories
  - P2 (Nice to Have): 6 stories
- **Estimated Story Points**: 250+

---

**Document End**





