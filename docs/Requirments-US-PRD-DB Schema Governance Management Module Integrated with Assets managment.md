Governance Module Requirements - Enhanced and Improved
Executive Summary
The Governance module serves as the foundation of the GRC platform, enabling organizations to establish, document, and maintain comprehensive governance frameworks covering IT, privacy, and cybersecurity. This module creates a structured approach to managing regulatory compliance, policy development, and control implementation through a unified, integrated system.

1. Governance Framework Overview
1.1 Purpose
Enable organizations to:
Establish comprehensive governance structures aligned with business objectives 
Respond to internal and external influencers systematically 
Develop, manage, and maintain governance documentation 
Create a unified control framework that eliminates redundancy 
Ensure consistency across compliance, risk, and audit activities 
Demonstrate governance maturity to stakeholders and regulators 
1.2 Key Benefits
Single Source of Truth: Centralized governance documentation 
Efficiency: Eliminate duplicate efforts across multiple compliance requirements 
Consistency: Standardized approach to control implementation 
Traceability: Clear mapping from influencers → policies → controls → assets 
Agility: Rapid response to new regulatory requirements 
Evidence-Based: Built-in audit trail for compliance demonstrations 

2. Influencers Management
2.1 Overview
Influencers are the driving forces that shape an organization's governance framework. They represent the "why" behind governance requirements and provide justification for policies and controls.
2.2 Internal Influencers
2.2.1 Definition
Internal drivers originating from within the organization that shape governance requirements.
2.2.2 Categories
Executive Directives
Board of Directors (BOD) resolutions and mandates 
Executive management decisions 
Strategic business objectives 
Corporate values and ethics statements 
Risk appetite statements 
Organizational Policies
Corporate governance principles 
Enterprise risk management framework 
Business continuity requirements 
Third-party risk management 
Acceptable use policies 
Operational Requirements
Business process needs 
Technology architecture decisions 
Data governance requirements 
Service level agreements (SLAs) 
Vendor management requirements 
Incidents and Lessons Learned
Security incident findings 
Audit findings and recommendations 
Near-miss events 
Industry incidents affecting the organization 
Lessons learned from assessments 
2.3 External Influencers
2.3.1 Definition
External forces requiring organizational compliance or adherence, originating from entities outside the organization.
2.3.2 Categories
A. Contractual Obligations Requirements imposed through business agreements and contracts
Examples:
PCI DSS (Payment Card Industry Data Security Standard) 
SOC 2 (Service Organization Control 2) 
ISO/IEC 27001 certification requirements 
Customer-specific security requirements (in MSAs, SOWs) 
Partner agreements with security clauses 
Cloud service provider requirements (e.g., AWS Shared Responsibility) 
Insurance policy requirements 
Vendor contractual obligations 
Attributes to Track:
Contract reference number 
Contracting parties 
Effective date and renewal date 
Specific security/privacy clauses 
Audit rights and frequency 
Attestation requirements 
Penalties for non-compliance 
B. Statutory Requirements Laws enacted by legislative bodies requiring compliance
Examples:
HIPAA (Health Insurance Portability and Accountability Act) - USA 
SOX (Sarbanes-Oxley Act) - USA 
Data Protection Act 2018 - UK 
Personal Information Protection Law (PIPL) - China 
Gramm-Leach-Bliley Act (GLBA) - USA 
FISMA (Federal Information Security Management Act) - USA 
California Consumer Privacy Act (CCPA) - USA 
Digital Personal Data Protection Act - India 
Attributes to Track:
Jurisdiction/territory 
Legislative body 
Enactment date 
Enforcement date 
Responsible regulatory authority 
Penalties for non-compliance (criminal/civil) 
Extraterritorial applicability 
Safe harbor provisions 
C. Regulatory Requirements Rules and standards issued by regulatory authorities
Examples:
Saudi Arabia:
NCA ECC (National Cybersecurity Authority - Essential Cybersecurity Controls) 
NCA CSCC (Critical Systems Cybersecurity Controls) 
PDPL (Personal Data Protection Law) 
SAMA CSF (Saudi Arabian Monetary Authority Cybersecurity Framework) 
CITC Cloud Computing Regulatory Framework 
CST CRF (Communications, Space & Technology Cybersecurity Regulatory Framework) 
European Union:
GDPR (General Data Protection Regulation) 
NIS2 Directive (Network and Information Security) 
DORA (Digital Operational Resilience Act) 
eIDAS (Electronic Identification and Trust Services) 
United States:
NIST Cybersecurity Framework 
CMMC (Cybersecurity Maturity Model Certification) 
FedRAMP (Federal Risk and Authorization Management Program) 
SEC Cybersecurity Rules 
Other Regions:
APRA CPS 234 (Australia - Information Security) 
POPIA (South Africa - Protection of Personal Information) 
LGPD (Brazil - General Data Protection Law) 
PDPA (Singapore - Personal Data Protection Act) 
Attributes to Track:
Regulatory authority/agency 
Regulation number/reference 
Publication date 
Effective date 
Last revision date 
Scope of applicability (sector, organization size, data types) 
Enforcement mechanism 
Reporting requirements 
Assessment/audit frequency 
Penalties and sanctions structure 
D. Industry Standards and Best Practices Voluntary frameworks and standards representing industry consensus
Examples:
NIST SP 800-53 (Security and Privacy Controls) 
ISO/IEC 27001/27002 (Information Security Management) 
CIS Controls (Center for Internet Security) 
COBIT (Control Objectives for Information Technology) 
ITIL (Information Technology Infrastructure Library) 
OWASP (Open Web Application Security Project) standards 
Cloud Security Alliance (CSA) CCM 
SANS Critical Security Controls 
Attributes to Track:
Standards body 
Version number 
Publication date 
Certification/attestation options 
Industry adoption rate 
Revision cycle 
2.4 Functional Requirements - Influencers
FR-INF-001: Influencer Registry
Description: Centralized repository for all governance influencers
Requirements:
Support CRUD operations for all influencer types 
Categorize influencers: Internal, Contractual, Statutory, Regulatory, Industry Standards 
Support sub-categorization within each type 
Track influencer status: Active, Pending, Superseded, Retired 
Support version control for influencer changes 
Enable tagging and custom categorization 
Data Fields:
- Unique identifier
- Name/title
- Category and sub-category
- Description
- Issuing authority/body
- Jurisdiction/scope
- Reference number/code
- Publication date
- Effective date
- Last revision date
- Next review date
- Status
- Applicability criteria (when does this apply?)
- Source document/URL
- Internal owner/responsible party
- Business units affected
- Tags
- Notes
- Attachments (PDFs, links)
FR-INF-002: Applicability Assessment
Description: Determine which influencers apply to the organization
Requirements:
Define applicability criteria (industry, geography, data types, business activities) 
Support applicability questionnaires 
Document applicability decisions with justification 
Track applicability changes over time 
Generate applicability reports 
Alert on new potentially applicable influencers 
FR-INF-003: Influencer Monitoring
Description: Track changes and updates to external influencers
Requirements:
Monitor regulatory updates and changes 
Alert designated owners of updates 
Track revision history 
Support impact assessment workflow for changes 
Generate change reports 
Integrate with external regulatory intelligence sources (optional) 
FR-INF-004: Relationship Mapping
Description: Link influencers to policies, controls, and requirements
Requirements:
Map influencers to policies (many-to-many) 
Map influencers to control objectives 
Visualize influencer hierarchy and relationships 
Show downstream impact (influencer → policy → control → asset) 
Support impact analysis ("what's affected if this changes?") 
FR-INF-005: Compliance Obligations Register
Description: Consolidated view of all compliance obligations
Requirements:
Generate obligation lists from influencers 
Extract specific requirements from regulatory text 
Assign responsibility for each obligation 
Track obligation status 
Generate compliance matrices 
Support obligation export for reporting 

3. Policy Management
3.1 Overview
Policies form the bridge between influencers and controls, translating high-level requirements into organizational directives. A well-structured policy framework ensures consistent governance across the organization.
3.2 Policy Hierarchy
Tier 1: Policies
High-level statements of intent and direction 
Approved by senior management/board 
Broad scope, less frequent changes 
Examples: Information Security Policy, Data Privacy Policy, Acceptable Use Policy 
Tier 2: Standards
Mandatory specifications and requirements 
Support policy implementation 
More detailed and technical 
Examples: Password Standard, Encryption Standard, Access Control Standard 
Tier 3: Baselines
Minimum security configurations 
Platform/technology-specific 
Technical implementation requirements 
Examples: Windows Server Baseline, AWS Security Baseline, Database Hardening Baseline 
Tier 4: Guidelines
Recommended practices and advice 
Non-mandatory but encouraged 
Flexible implementation 
Examples: Secure Coding Guidelines, Remote Work Guidelines, Incident Response Guidelines 
Tier 5: Procedures
Step-by-step instructions (SOPs) 
Operational implementation 
Role-specific 
Examples: User Provisioning Procedure, Backup Procedure, Vulnerability Management Procedure 
3.3 Policy Framework Components
3.3.1 Policy Structure
Each policy should contain:
Header: Title, version, approval date, next review date, owner 
Purpose: Why this policy exists 
Scope: What and who it covers 
Applicable Influencers: Which regulations/requirements drive this 
Definitions: Key terms 
Policy Statements: The actual requirements (control objectives) 
Roles and Responsibilities: Who does what 
Compliance: Consequences of non-compliance 
Exceptions: How to request exceptions 
Related Documents: Standards, procedures, guidelines 
Approval: Signatures and dates 
Revision History: Changes over time 
3.3.2 Control Objectives
Clear, measurable statements of what must be achieved
Format: "The organization shall [action] to [purpose]"
Example Control Objectives:
"The organization shall implement multi-factor authentication for all privileged accounts to prevent unauthorized access" 
"The organization shall encrypt all sensitive data at rest to protect confidentiality" 
"The organization shall conduct annual security awareness training to maintain security culture" 
Attributes:
Unique identifier (e.g., CO-001) 
Statement 
Rationale 
Parent policy 
Linked influencers 
Mapped controls (from control library) 
Implementation status 
Responsible party 
3.4 Standards
3.4.1 Purpose
Translate control objectives into specific, mandatory requirements
3.4.2 Structure
Standard Name 
Reference to Parent Policy/Control Objective 
Specific Requirements (numbered list) 
Scope and Applicability 
Compliance Measurement 
Implementation Timeline 
Exceptions Process 
3.4.3 Example
Policy: Access Control PolicyControl Objective: CO-IAM-001 - "Implement strong authentication"
Standard: Password Standard
Minimum 14 characters 
Complexity: uppercase, lowercase, numbers, special characters 
Maximum age: 90 days 
Password history: 24 passwords 
Account lockout: 5 failed attempts 
No password reuse within 2 years 
3.5 Secure Baseline Configurations
3.5.1 Purpose
Define minimum security settings for systems and platforms
3.5.2 Types
Operating Systems: Windows Server, Linux, macOS 
Network Devices: Firewalls, routers, switches 
Cloud Platforms: AWS, Azure, GCP 
Databases: SQL Server, Oracle, PostgreSQL, MongoDB 
Applications: Web servers, email servers, file servers 
Mobile Devices: iOS, Android 
Containers: Docker, Kubernetes 
3.5.3 Baseline Components
Configuration parameters and values 
Services to disable 
Ports to close 
Patches/updates required 
Logging requirements 
Audit configuration 
Reference to security benchmarks (CIS, STIGs, vendor guides) 
3.5.4 Validation
Automated compliance scanning tools 
Manual verification procedures 
Deviation reporting and remediation 
Regular baseline updates 
3.6 Guidelines
3.6.1 Purpose
Provide recommended practices that support policies and standards
3.6.2 Characteristics
Non-mandatory (recommended) 
Flexible implementation 
Context-dependent 
Best practices and lessons learned 
3.6.3 Examples
Secure Software Development Guidelines 
Cloud Migration Security Guidelines 
Third-Party Risk Assessment Guidelines 
Incident Communication Guidelines 
3.7 Functional Requirements - Policy Management
FR-POL-001: Policy Document Management
Requirements:
Create policy documents using templates 
Support multi-tier hierarchy (policy → standard → baseline → guideline → procedure) 
Version control with change tracking 
Document approval workflow 
Document status tracking (Draft, In Review, Approved, Published, Archived) 
Digital signatures for approval 
Scheduled review reminders 
Document expiration alerts 
Rich text editor with formatting 
Attachment support (diagrams, templates) 
Export to PDF/Word 
FR-POL-002: Control Objectives Library
Requirements:
Define control objectives within policies 
Assign unique identifiers 
Link control objectives to influencers (traceability) 
Map control objectives to implementation controls 
Track control objective status 
Support control objective reuse across policies 
Group control objectives by domain (IAM, Network Security, Data Protection, etc.) 
FR-POL-003: Standards Management
Requirements:
Create standards linked to control objectives 
Define specific technical/procedural requirements 
Support requirement numbering and structuring 
Link standards to implementation guides/baselines 
Track standard compliance by asset/system 
Generate standards compliance reports 
FR-POL-004: Baseline Configuration Management
Requirements:
Create baseline configurations by platform/technology 
Define configuration parameters (key-value pairs) 
Version control for baselines 
Link baselines to applicable standards 
Support baseline templates (e.g., CIS Benchmarks import) 
Export baselines in machine-readable format (JSON, YAML) 
Track baseline deviations per asset 
Integration with configuration scanning tools 
FR-POL-005: Guidelines Repository
Requirements:
Create and publish guidelines 
Categorize by topic/domain 
Link to related policies and standards 
Support best practice sharing 
Track guideline usage/downloads 
Community feedback mechanism 
FR-POL-006: Policy Lifecycle Management
Requirements:
Define policy review cycles 
Automated review notifications 
Policy approval workflow (multi-level) 
Policy publication and distribution 
Policy acknowledgment tracking (users confirm they've read) 
Policy retirement/archiving process 
Impact assessment for policy changes 
FR-POL-007: Traceability Matrix
Requirements:
Visualize influencer → policy → control objective → standard → control mapping 
Generate traceability reports 
Identify gaps (influencers without policies, controls without standards) 
Support "where-used" analysis (what references this control objective?) 
Export traceability matrix to Excel/PDF 
FR-POL-008: Exception Management
Requirements:
Request exceptions to policies/standards 
Exception approval workflow 
Define exception duration and compensating controls 
Track exception status and expiration 
Alert on expiring exceptions 
Exception audit trail 
Generate exception reports 

4. Unified Control Library
4.1 Overview
The Unified Control Library is the cornerstone of the GRC platform, providing a single, consolidated repository of security, privacy, and IT controls mapped to multiple regulatory frameworks. This eliminates redundancy, streamlines assessments, and ensures consistent control implementation across the organization.
4.2 Purpose and Benefits
Primary Purposes:
Create a single source of truth for all organizational controls 
Map multiple regulatory requirements to common controls 
Eliminate duplicate efforts during assessments 
Provide consistency in control implementation 
Enable efficient multi-framework compliance 
Key Benefits:
Efficiency: Assess once, satisfy multiple requirements 
Consistency: Standardized control language and implementation 
Coverage Visibility: Clear view of what's controlled vs. gaps 
Risk Reduction: Comprehensive coverage without overlaps 
Audit Readiness: Centralized evidence collection 
Resource Optimization: Focus resources on implementation, not mapping 
4.3 Control Library Structure
4.3.1 Control Domains
Organize controls into logical categories:
Access Control & Identity Management
Authentication 
Authorization 
Privileged Access Management 
Identity Lifecycle Management 
Asset Management
Hardware/Software Inventory 
Asset Classification 
Asset Lifecycle 
Media Management 
Cryptography & Encryption
Encryption Standards 
Key Management 
Cryptographic Protocols 
Certificate Management 
Data Protection & Privacy
Data Classification 
Data Loss Prevention 
Privacy Controls 
Data Retention & Disposal 
Network Security
Network Segmentation 
Firewalls & Filtering 
Intrusion Detection/Prevention 
Network Monitoring 
Application Security
Secure Development 
Security Testing 
Application Hardening 
API Security 
Endpoint Security
Antimalware 
Device Configuration 
Mobile Device Management 
Endpoint Detection & Response 
Vulnerability Management
Vulnerability Scanning 
Patch Management 
Penetration Testing 
Configuration Management 
Incident Response
Incident Detection 
Incident Handling 
Forensics 
Lessons Learned 
Business Continuity & Disaster Recovery
Backup & Recovery 
Business Impact Analysis 
Continuity Planning 
Testing & Exercises 
Compliance & Audit
Compliance Monitoring 
Audit Logging 
Regulatory Reporting 
Records Management 
Third-Party Risk Management
Vendor Assessment 
Contract Management 
Ongoing Monitoring 
Vendor Termination 
Physical & Environmental Security
Physical Access Control 
Environmental Controls 
Equipment Security 
Disposal & Destruction 
Human Resources Security
Background Checks 
Security Awareness Training 
Acceptable Use 
Termination Procedures 
Security Governance
Policy Management 
Risk Management 
Security Program 
Metrics & Reporting 
4.3.2 Control Structure
Each control in the library should include:
Identification:
Unique Control ID (e.g., UCL-IAM-001) 
Control Title 
Control Domain 
Control Family/Subcategory 
Description:
Control Statement (what must be done) 
Implementation Guidance (how to do it) 
Rationale (why it's important) 
Control Type: Preventive, Detective, Corrective, Compensating 
Mappings:
Framework Mappings (which requirements does this satisfy?) 
NCA ECC → Control IDs 
ISO 27001 → Annex A controls 
NIST CSF → Functions/Categories 
PCI DSS → Requirements 
GDPR → Articles 
SOC 2 → Criteria 
CIS Controls → Control numbers 
[Add others as applicable] 
Implementation:
Implementation Level: Not Implemented, Partially Implemented, Implemented, Not Applicable 
Implementation Status: Planned, In Progress, Completed 
Implementation Notes 
Responsible Party 
Target Implementation Date 
Actual Implementation Date 
Evidence & Testing:
Evidence Types (policies, logs, screenshots, reports) 
Evidence Collection Frequency 
Testing Frequency 
Last Test Date 
Test Results 
Next Test Due Date 
Automated vs. Manual Testing 
Metadata:
Priority/Risk Level: Critical, High, Medium, Low 
Complexity: High, Medium, Low 
Cost Impact: High, Medium, Low 
Linked Assets (where is this control implemented?) 
Linked Policies/Standards 
Related Controls (dependencies, compensating controls) 
Tags/Keywords 
4.4 Control Mapping Matrix
4.4.1 Purpose
The mapping matrix shows how a single unified control satisfies requirements from multiple frameworks simultaneously.
4.4.2 Example Mapping
Unified Control: UCL-IAM-002 - Multi-Factor Authentication

This single control, when implemented, satisfies requirements from 8 different frameworks.
4.4.3 Coverage Analysis
The matrix enables:
Gap Analysis: Which framework requirements have no mapped controls? 
Overlap Analysis: Which controls satisfy the most requirements? 
Efficiency Metrics: Reduction in duplicate efforts 
Prioritization: Focus on controls with highest coverage 
4.5 Control Assessment
4.5.1 Assessment Types
Implementation Assessment: Is the control in place? 
Design Effectiveness: Is the control designed properly? 
Operating Effectiveness: Does the control work as intended? 
Compliance Assessment: Does the control meet specific framework requirements? 
4.5.2 Assessment Process
Select control(s) to assess 
Define assessment scope (systems, locations, timeframe) 
Collect evidence 
Evaluate evidence against control requirements 
Document findings (compliant, non-compliant, partially compliant) 
Identify gaps and remediation actions 
Assign remediation owners and due dates 
Track remediation to closure 
Re-assess after remediation 
4.6 Control Evidence Repository
4.6.1 Purpose
Centralized storage for control evidence supporting assessments and audits
4.6.2 Evidence Types
Policy documents 
Configuration screenshots 
System logs 
Scan reports 
Test results 
Meeting minutes 
Training records 
Vendor attestations (SOC 2, ISO certifications) 
Contracts and agreements 
4.6.3 Evidence Management
Link evidence to specific controls 
Version control for evidence 
Evidence validity period 
Automated evidence collection (where possible) 
Evidence review and approval 
Evidence access controls 
Evidence export for auditors 
4.7 Functional Requirements - Unified Control Library
FR-UCL-001: Control Library Management
Requirements:
Create and maintain unified control library 
Organize controls by domain/family 
Support hierarchical control structure (domain → family → control) 
CRUD operations for controls 
Control version control 
Control status tracking 
Control search and filtering 
Bulk control import (from Excel, CSV) 
Control export functionality 
FR-UCL-002: Framework Mapping Management
Requirements:
Add framework definitions (name, version, authority) 
Define framework requirements/control numbers 
Map unified controls to multiple framework requirements 
Support many-to-many relationships 
Document mapping coverage (full, partial, not applicable) 
Add mapping notes and context 
Visual mapping matrix 
Gap analysis reports (framework requirements without controls) 
FR-UCL-003: Control Implementation Tracking
Requirements:
Track implementation status per control 
Assign responsible parties 
Set target and actual implementation dates 
Document implementation approach 
Link controls to assets where implemented 
Track implementation costs (optional) 
Implementation progress dashboard 
Generate implementation reports 
FR-UCL-004: Control Assessment Management
Requirements:
Create assessment plans (scope, schedule, assessors) 
Assign controls to assessments 
Define assessment criteria and procedures 
Collect and attach evidence 
Record assessment results (compliant, non-compliant, N/A) 
Document findings and observations 
Generate remediation actions from findings 
Track remediation to closure 
Support continuous monitoring (automated assessments) 
Assessment history and trending 
FR-UCL-005: Evidence Management
Requirements:
Upload and store evidence files 
Link evidence to controls (many-to-many) 
Evidence metadata (type, collection date, validity period, collector) 
Evidence approval workflow 
Evidence expiration alerts 
Evidence search and retrieval 
Secure evidence access (role-based) 
Evidence audit trail 
Bulk evidence upload 
Evidence export for audits 
FR-UCL-006: Control Testing
Requirements:
Define testing procedures per control 
Schedule recurring tests 
Assign testers 
Record test execution 
Document test results (pass, fail, not tested) 
Link test results to evidence 
Track test coverage 
Test result dashboards 
Alerts for overdue tests 
FR-UCL-007: Coverage and Gap Analysis
Requirements:
Generate control coverage matrix 
Identify controls covering multiple frameworks 
Identify framework requirements without controls (gaps) 
Identify controls not mapped to any framework (potential redundancy) 
Coverage heat maps (visual representation) 
Gap remediation tracking 
Export analysis reports 
FR-UCL-008: Control Effectiveness Monitoring
Requirements:
Track control effectiveness over time 
Define Key Control Indicators (KCIs) 
Automated data collection for KCIs (where possible) 
Effectiveness scoring/rating 
Trend analysis and reporting 
Alerts for control degradation 
Corrective action tracking 
FR-UCL-009: Audit Support
Requirements:
Generate audit-ready evidence packages 
Organize evidence by framework/auditor requirements 
Create control matrices for auditors 
Track auditor requests and responses 
Document audit findings 
Link audit findings to controls 
Remediation tracking for audit findings 
Generate audit status reports 

5. Standard Operating Procedures (SOPs)
5.1 Overview
SOPs provide detailed, step-by-step instructions for implementing policies, standards, and controls. They are the operational layer of the governance framework, ensuring consistent execution across the organization.
5.2 SOP Framework
5.2.1 SOP Categories
Operational SOPs:
User provisioning and de-provisioning 
Access request and approval 
Password reset 
System backup and restore 
Patch deployment 
Configuration changes 
Log review 
Asset onboarding/offboarding 
Security SOPs:
Incident detection and triage 
Incident response and containment 
Forensic evidence collection 
Malware analysis 
Vulnerability remediation 
Security tool operation 
Threat intelligence processing 
Compliance SOPs:
Audit evidence collection 
Compliance assessment execution 
Control testing 
Risk assessment 
Policy review and approval 
Exception request handling 
Regulatory reporting 
Third-Party SOPs:
Vendor risk assessment 
Vendor onboarding 
Vendor access provisioning 
Vendor monitoring 
Vendor offboarding 
5.2.2 SOP Structure
Each SOP should contain:
Header
SOP ID and title 
Version number 
Approval date 
Next review date 
Owner/author 
Document status 
Purpose
Why this procedure exists 
Objectives 
Scope
What is covered 
What is not covered 
Applicability 
Related Documents
Parent policies 
Related standards 
Referenced procedures 
Forms and templates 
Roles and Responsibilities
Who performs each step 
RACI matrix (Responsible, Accountable, Consulted, Informed) 
Prerequisites
Required access/permissions 
Required tools/systems 
Required training 
Required approvals 
Procedure Steps
Numbered, sequential steps 
Decision points (flowcharts if complex) 
Screenshots/diagrams 
Expected outcomes 
Troubleshooting guidance 
Exceptions and Escalations
What to do if standard procedure cannot be followed 
Escalation paths 
Exception approval process 
Quality Checks
Verification steps 
Success criteria 
Testing/validation 
Records and Documentation
What records must be kept 
Where to store records 
Retention requirements 
Metrics
Time to complete 
Success rate 
Quality indicators 
Revision History
Changes from previous versions 
5.3 SOP Lifecycle
1. Development
Identify need for SOP 
Draft procedure (involve SMEs) 
Include screenshots/diagrams 
Peer review 
2. Review
Technical review 
Compliance review 
Stakeholder review 
Management review 
3. Approval
Designated approver signs off 
Version finalized 
4. Publication
Published to SOP repository 
Communicated to relevant staff 
Training provided if needed 
5. Execution
Staff follow SOP 
Feedback collected 
Issues documented 
6. Maintenance
Periodic review (annually or when change occurs) 
Update based on feedback, changes in technology/regulations 
Re-approval 
Version control 
7. Retirement
Obsolete SOPs archived (not deleted) 
Replacement SOP identified 
Notification to users 
5.4 SOP Best Practices
Writing Guidelines:
Use clear, simple language 
Use active voice ("Click the button" not "The button should be clicked") 
Number all steps 
One action per step 
Include visual aids 
Define acronyms on first use 
Avoid assumptions ("Ensure you have logged in" rather than assuming it) 
Format Considerations:
Consistent template across all SOPs 
Easy-to-navigate structure 
Searchable (keywords, tags) 
Printable if needed 
Mobile-friendly for field operations 
Quality Attributes:
Accuracy 
Completeness 
Clarity 
Conciseness 
Consistency 
5.5 Functional Requirements - SOPs
FR-SOP-001: SOP Document Management
Requirements:
Create SOPs using standardized templates 
Support rich text formatting 
Embed images, diagrams, flowcharts 
Version control 
SOP status workflow (Draft → Review → Approved → Published → Archived) 
Approval routing 
Digital signatures 
Link SOPs to policies, standards, controls 
SOP categorization and tagging 
Full-text search 
Export to PDF/Word 
FR-SOP-002: SOP Execution Tracking
Requirements:
Record SOP executions 
Capture who executed, when, outcome 
Link executions to tickets/requests (optional) 
Track execution metrics (time taken, success rate) 
Execution history per SOP 
Exceptions and deviations documentation 
Quality checks/verification recording 
FR-SOP-003: SOP Training and Acknowledgment
Requirements:
Assign SOPs to roles/individuals for training 
Track training completion 
Quiz/assessment capability (optional) 
Acknowledgment tracking (users confirm understanding) 
Training expiration and renewal 
Training reports 
FR-SOP-004: SOP Review and Maintenance
Requirements:
Scheduled review reminders 
Review workflow 
Change request process 
Impact assessment for changes 
Version comparison (track what changed) 
Stakeholder notification of updates 
Retirement/archiving process 
FR-SOP-005: SOP Library and Search
Requirements:
Centralized SOP repository 
Browse by category/domain 
Advanced search (keywords, tags, content) 
Related SOPs suggestions 
Recently updated SOPs 
Most frequently used SOPs 
SOP access controls (some SOPs may be restricted) 
FR-SOP-006: SOP Performance Metrics
Requirements:
Track SOP execution metrics 
Average time to complete 
Success/failure rates 
Number of exceptions 
User feedback scores
Trend analysis 
Dashboard with SOP KPIs 
Reports on SOP effectiveness 

6. Integration and Relationships
6.1 Data Flow Architecture
External Influencers (Regulations) ─┐
Internal Influencers (BOD, Risks)  ─┤
                                     ├──> Influencer Registry
Contractual Influencers (PCI, SOC2)─┘
                                     │
                                     ↓
                          Applicability Assessment
                                     │
                                     ↓
                              Policies (Tier 1)
                              Control Objectives
                                     │
                                     ↓
                            Standards (Tier 2) ──> Unified Control Library
                                     │                      │
                                     ↓                      │
                          Baselines (Tier 3)               │
                                     │                      │
                                     ↓                      ↓
                          Guidelines (Tier 4)       Control Assessments
                                     │                      │
                                     ↓                      ↓
                           SOPs (Tier 5) ──────────> Evidence Repository
                                     │                      │
                                     ↓                      ↓
                          Execution/Implementation    Audit Reports
                                     │                      │
                                     ↓                      ↓
                              Asset Management ←──── Compliance Status
6.2 Key Relationships
6.2.1 Influencer → Policy
One influencer can drive multiple policies 
One policy can be driven by multiple influencers 
Track which influencer requirements are satisfied by which policies 
6.2.2 Policy → Control Objective
Policies contain control objectives 
Control objectives define "what" must be achieved 
Control objectives link to unified controls 
6.2.3 Control Objective → Standard
Standards specify "how" to achieve control objectives 
Multiple standards can support one control objective 
6.2.4 Standard → Baseline
Baselines implement standards for specific technologies 
One standard can have multiple baselines (per platform) 
6.2.5 Standard → Guideline
Guidelines provide recommendations for implementing standards 
Non-mandatory but helpful 
6.2.6 Control → Asset
Controls are implemented on/for specific assets 
Assets inherit compliance requirements from controls 
Asset compliance = implementation status of required controls 
6.2.7 Control → Evidence
Controls require evidence to prove implementation 
Evidence supports assessments and audits 
Evidence can support multiple controls 
6.2.8 SOP → Control
SOPs describe how to implement/test/operate controls 
One control may have multiple SOPs (implementation, testing, monitoring) 
6.3 Traceability
Forward Traceability (Top-Down): Regulation → Policy → Control Objective → Standard → Control → Asset → Implementation
Backward Traceability (Bottom-Up): Asset → Control → Standard → Control Objective → Policy → Regulation
Use Cases:
Gap Analysis: Which regulations have no implementing controls? 
Impact Analysis: If we change this policy, what's affected? 
Compliance Reporting: Show how we satisfy regulation X 
Audit Support: Demonstrate complete chain of governance 

7. Reporting and Analytics
7.1 Governance Dashboard
Key Metrics:
Total active influencers by category 
Policy compliance score (% of policies current/approved) 
Control implementation status (implemented vs. planned) 
Control effectiveness score 
Assessment completion rate 
Open findings and remediation actions 
Upcoming reviews and expirations 
Visualizations:
Governance maturity score 
Compliance coverage heat map 
Control implementation progress 
Framework compliance status 
Risk areas (controls with low effectiveness) 
7.2 Standard Reports
7.2.1 Influencer Reports
Active influencers by category 
Influencer applicability assessment summary 
Influencers requiring response/action 
Upcoming regulatory changes 
7.2.2 Policy Reports
Policy inventory 
Policies due for review 
Policy approval status 
Policy acknowledgment status 
Exception report 
7.2.3 Control Reports
Control implementation status 
Control assessment results 
Control effectiveness scores 
Gap analysis (requirements without controls) 
Coverage analysis (controls satisfying multiple frameworks) 
Evidence collection status 
Overdue control tests 
7.2.4 Compliance Reports
Multi-framework compliance scorecard 
Framework-specific compliance status 
Audit readiness assessment 
Findings and remediation tracker 
Control testing status 
7.2.5 SOP Reports
SOP inventory 
SOP execution metrics 
SOPs due for review 
Training completion status 
SOP effectiveness scores 
7.3 Executive Reports
Quarterly Governance Report:
Governance program overview 
Compliance posture summary 
Key achievements 
Top risks and remediation plans 
Resource requirements 
Upcoming regulatory changes 
Board-Level Report:
Compliance status (red/yellow/green) 
Critical findings 
Major incidents 
Regulatory changes impacting organization 
Investment needs 

8. User Roles and Permissions
8.1 Governance Roles
Governance Administrator:
Full access to all governance modules 
Configure frameworks and mappings 
Manage users and permissions 
System configuration 
Compliance Officer:
Manage influencers and applicability 
Oversee policy development 
Conduct compliance assessments 
Generate compliance reports 
Policy Manager:
Create and maintain policies 
Manage policy lifecycle 
Coordinate policy reviews and approvals 
Track policy acknowledgments 
Control Owner:
Implement assigned controls 
Provide evidence 
Conduct control testing 
Report on control effectiveness 
Auditor/Assessor:
Review control implementation 
Evaluate evidence 
Document findings 
Generate assessment reports 
Business Unit Owner:
View applicable policies and controls 
Acknowledge policies 
Submit exception requests 
View compliance status for their unit 
Executive/Management:
View dashboards and reports 
Approve policies 
Review compliance status 
Make governance decisions 

9. Implementation Roadmap
Phase 1: Foundation (Months 1-3)
Influencer registry 
Policy management (policies and standards) 
Basic control library 
User management and RBAC 
Basic reporting 
Deliverables:
Working influencer database 
Policy creation and approval workflow 
Initial control library (100-200 controls) 
User training materials 
Phase 2: Control Framework (Months 4-6)
Complete unified control library 
Framework mapping (5-7 key frameworks) 
Control assessment module 
Evidence repository 
Baselines and guidelines 
Deliverables:
Full control library with mappings 
Assessment workflow 
Evidence management system 
Coverage and gap analysis reports 
Phase 3: Operations (Months 7-9)
SOP management 
Control testing and monitoring 
Integration with asset management 
Advanced reporting and analytics 
Continuous monitoring capabilities 
Deliverables:
SOP repository 
Testing scheduler 
Integration APIs 
Executive dashboards 
Phase 4: Optimization (Months 10-12)
Automated evidence collection 
AI-powered gap analysis 
Predictive compliance analytics 
Mobile access 
Advanced integrations (SIEM, ticketing, etc.) 
Deliverables:
Automation workflows 
Predictive reports 
Mobile app 
Integration connectors 

10. Success Criteria
10.1 Functional Success
✅ All influencers documented and tracked 
✅ Complete policy framework published 
✅ Unified control library covering all requirements 
✅ 90%+ control implementation rate 
✅ All controls mapped to applicable frameworks 
✅ Evidence repository operational 
✅ SOPs published for critical processes 
10.2 Operational Success
✅ Assessment cycle time reduced by 40% 
✅ Audit preparation time reduced by 50% 
✅ Zero compliance gaps for critical frameworks 
✅ 95%+ policy acknowledgment rate 
✅ User satisfaction score > 8/10 
10.3 Business Success
✅ Pass all regulatory audits 
✅ Reduce compliance costs 
✅ Enable faster response to new regulations 
✅ Improve board confidence in governance 
✅ Support business growth without compliance delays 

Summary of Improvements Made
Enhanced Influencer Categories: Expanded to include industry standards and best practices; added detailed attributes for each category
Structured Policy Hierarchy: Clarified 5-tier hierarchy (Policy → Standard → Baseline → Guideline → Procedure) with clear purposes
Comprehensive Control Library: Detailed structure with 15+ domains, complete control attributes, and assessment framework
Control Mapping Matrix: Added visual representation and coverage analysis capabilities
Evidence Management: Structured approach to evidence collection, storage, and audit support
Detailed SOP Framework: Complete SOP lifecycle, structure, and best practices
Integration Architecture: Clear data flow and relationship mapping
Reporting Framework: Executive-level to operational-level reports
Implementation Roadmap: Phased approach with clear deliverables
Success Metrics: Measurable criteria for functional, operational, and business success
This enhanced specification provides a complete, implementable governance module that integrates seamlessly with the asset management foundation already defined.Governance Module - Agile User Stories
Epic 1: Influencer Registry and Management
User Story 1.1: Create Influencer Entry
As a compliance officerI want to create and register new governance influencersSo that I can document all regulatory, contractual, and internal requirements driving our governance program
Acceptance Criteria:
Form includes all required fields (name, category, issuing authority, jurisdiction, effective date, etc.) 
Support dropdown for category: Internal, Contractual, Statutory, Regulatory, Industry Standards 
Support sub-categorization within each main category 
Unique identifier auto-generated 
Ability to attach source documents (PDFs, links to regulations) 
Status field: Active, Pending, Superseded, Retired 
Field validation before saving 
Audit trail captures who created and when 
Confirmation message on successful creation 
Story Points: 5Priority: P0 (Must Have)

User Story 1.2: Import Influencers from External Sources
As a compliance officerI want to import influencer data from CSV/Excel filesSo that I can quickly populate the registry with existing documentation
Acceptance Criteria:
Support CSV and Excel file upload 
Template download available with required fields 
Field mapping interface for custom formats 
Data validation before import 
Preview first 10 records before confirming 
Error report for invalid records 
Successfully imported records immediately visible 
Import activity logged in audit trail 
Story Points: 8Priority: P1 (Should Have)

User Story 1.3: Categorize and Tag Influencers
As a compliance officerI want to categorize and tag influencers with custom attributesSo that I can organize and filter requirements effectively
Acceptance Criteria:
Assign primary category and sub-category 
Add multiple tags (e.g., "data privacy", "financial", "healthcare") 
Create custom tags 
Filter influencers by category, sub-category, and tags 
Bulk tagging for multiple influencers 
Tag management (create, rename, merge, delete) 
View tag cloud showing most used tags 
Story Points: 5Priority: P1 (Should Have)

User Story 1.4: Assess Influencer Applicability
As a compliance officerI want to assess whether an influencer applies to our organizationSo that we focus only on relevant requirements
Acceptance Criteria:
Applicability status: Applicable, Not Applicable, Under Review 
Applicability criteria fields (industry, geography, business activities, data types) 
Document applicability decision with justification text 
Attach supporting evidence for applicability decision 
Applicability review date and reminder 
View all applicable vs. non-applicable influencers 
Filter by applicability status 
Export applicability assessment report 
Story Points: 8Priority: P0 (Must Have)

User Story 1.5: Track Influencer Changes and Updates
As a compliance officerI want to monitor and track changes to regulatory requirementsSo that I can respond to updates and maintain compliance
Acceptance Criteria:
Record influencer version history 
Document what changed (revision notes) 
Set review date for next update check 
Automated reminders for scheduled reviews 
Flag influencers with pending updates 
Link to change announcements/regulatory updates 
Impact assessment workflow triggered by changes 
Notification to relevant stakeholders when influencer updated 
Story Points: 8Priority: P1 (Should Have)

User Story 1.6: View Influencer Details and Relationships
As a compliance officerI want to view complete influencer details and related policies/controlsSo that I understand the influencer's impact across the organization
Acceptance Criteria:
Detail page shows all influencer attributes 
Relationships section shows linked policies 
Shows linked control objectives 
Shows linked controls from unified library 
Displays affected business units 
Shows responsible owner/party 
View change history 
Export influencer details to PDF 
Edit and delete buttons (permission-based) 
Story Points: 5Priority: P0 (Must Have)

User Story 1.7: Generate Compliance Obligations Register
As a compliance officerI want to generate a consolidated list of all compliance obligationsSo that I can provide clear requirements to business units
Acceptance Criteria:
Extract specific obligations from applicable influencers 
Group obligations by category, business unit, or framework 
Assign responsibility for each obligation 
Track obligation status (Met, Not Met, In Progress, N/A) 
Priority ranking for obligations 
Filter by status, category, responsible party 
Export register to Excel/PDF 
Schedule automated register generation 
Story Points: 13Priority: P1 (Should Have)

User Story 1.8: Search and Filter Influencers
As a compliance officerI want to search and filter the influencer registrySo that I can quickly find relevant requirements
Acceptance Criteria:
Full-text search across all fields 
Filters: category, status, jurisdiction, issuing authority, applicability 
Multiple filters applied simultaneously 
Saved search configurations 
Sort by any column 
Results show key information in table format 
Click result to view details 
Export filtered results to CSV/Excel 
Story Points: 5Priority: P0 (Must Have)

Epic 2: Policy Management
User Story 2.1: Create Policy Document
As a policy managerI want to create a new policy using a standardized templateSo that all policies follow a consistent structure
Acceptance Criteria:
Select policy template (Information Security, Privacy, Acceptable Use, etc.) 
Rich text editor with formatting options 
Template includes standard sections: Purpose, Scope, Policy Statements, Roles, etc. 
Add policy metadata: version, owner, approval date, review date 
Link policy to driving influencers 
Save as draft or submit for review 
Version control tracks all changes 
Document status: Draft, In Review, Approved, Published, Archived 
Story Points: 8Priority: P0 (Must Have)

User Story 2.2: Define Control Objectives within Policy
As a policy managerI want to define control objectives within a policy documentSo that I establish clear, measurable requirements
Acceptance Criteria:
Add control objectives within policy document 
Each objective has unique identifier (auto-generated) 
Control objective statement field (text) 
Rationale field explaining why objective exists 
Link control objective to influencer requirements 
Assign responsible party for implementation 
Set target implementation date 
Control objectives appear in dedicated section of policy 
Reorder control objectives via drag-and-drop 
Mark control objectives as mandatory or recommended 
Story Points: 8Priority: P0 (Must Have)

User Story 2.3: Link Control Objectives to Unified Controls
As a policy managerI want to map control objectives to implementation controlsSo that there's clear traceability from policy to technical implementation
Acceptance Criteria:
Browse unified control library from control objective 
Select one or more controls that implement the objective 
View which controls are already mapped 
Remove control mappings 
See coverage status (objective with/without controls) 
Visual indicator when objective has no mapped controls 
Bulk mapping for multiple objectives 
Export control objective to control mapping 
Story Points: 8Priority: P1 (Should Have)

User Story 2.4: Policy Approval Workflow
As a policy managerI want to route policies through an approval processSo that policies are reviewed and authorized before publication
Acceptance Criteria:
Define approval workflow (single or multi-level) 
Assign approvers (by role or individual) 
Submit policy for approval 
Approvers receive notification 
Approvers can approve, reject, or request changes 
Comments/feedback captured at each approval stage 
Policy status updates automatically 
Version locked during approval process 
Digital signature capture for approvals 
Email notifications at each stage 
Audit trail of all approval actions 
Story Points: 13Priority: P0 (Must Have)

User Story 2.5: Publish and Distribute Policy
As a policy managerI want to publish approved policies and notify relevant usersSo that staff are aware of new or updated requirements
Acceptance Criteria:
Publish policy to policy repository 
Assign policy to business units, roles, or individuals 
Automated email notification to assigned users 
Published date and version clearly displayed 
Users can view/download policy 
Previous versions remain accessible 
Policy appears in "My Assigned Policies" for users 
Dashboard shows publication statistics 
Story Points: 8Priority: P0 (Must Have)

User Story 2.6: Policy Acknowledgment Tracking
As a policy managerI want to track which users have acknowledged reading policiesSo that I can ensure awareness and demonstrate compliance
Acceptance Criteria:
Users receive notification when assigned a policy 
Users can view policy and click "I Acknowledge" 
Capture acknowledgment date and user 
Track acknowledgment status per user 
Reports showing acknowledgment rates 
Reminders sent to users who haven't acknowledged (configurable intervals) 
Filter policies by acknowledgment status 
Export acknowledgment report for audits 
Ability to require re-acknowledgment after policy updates 
Story Points: 8Priority: P1 (Should Have)

User Story 2.7: Schedule Policy Reviews
As a policy managerI want to set review schedules for policiesSo that policies remain current and relevant
Acceptance Criteria:
Set next review date when creating/updating policy 
Automated reminders sent to policy owner 90, 60, 30 days before due 
Dashboard shows policies due for review 
Filter policies by review status 
Review workflow initiated from reminder 
Document review outcome (no changes, minor changes, major revision) 
Extend review date if needed with justification 
Audit trail of all reviews 
Story Points: 8Priority: P1 (Should Have)

User Story 2.8: Create Standards Linked to Control Objectives
As a policy managerI want to create standards that specify how to implement control objectivesSo that technical teams have clear, mandatory requirements
Acceptance Criteria:
Create standard document using template 
Link standard to parent policy and control objective 
Define specific requirements (numbered list) 
Specify scope and applicability 
Set compliance measurement criteria 
Assign standard owner 
Version control for standards 
Approval workflow for standards 
Link standards to baselines 
Export standard to PDF/Word 
Story Points: 8Priority: P0 (Must Have)

User Story 2.9: Create Secure Baseline Configurations
As a security architectI want to define secure baseline configurations for systems and platformsSo that assets are consistently hardened according to standards
Acceptance Criteria:
Create baseline by platform/technology (Windows, Linux, AWS, etc.) 
Link baseline to parent standard 
Define configuration parameters as key-value pairs 
Support multiple configuration formats (text, JSON, YAML) 
Version control for baselines 
Import baselines from external sources (CIS Benchmarks, STIGs) 
Tag baselines by technology, environment (prod, dev), criticality 
Export baseline in machine-readable format 
Link baselines to assets (track which assets should use which baseline) 
Story Points: 13Priority: P1 (Should Have)

User Story 2.10: Track Baseline Compliance per Asset
As a security architectI want to track which assets comply with required baselinesSo that I can identify configuration drift and non-compliant systems
Acceptance Criteria:
Assign baseline to assets (manual or via asset type) 
Track compliance status: Compliant, Non-Compliant, Not Assessed 
Record assessment date and assessor 
Document deviations with justification 
Exception approval workflow for deviations 
Dashboard showing baseline compliance rates 
Filter assets by compliance status 
Alerts for non-compliant critical assets 
Integration with configuration scanning tools (future) 
Generate compliance reports 
Story Points: 13Priority: P2 (Nice to Have)

User Story 2.11: Create Guidelines
As a policy managerI want to create and publish guidelines for recommended practicesSo that staff have helpful guidance beyond mandatory requirements
Acceptance Criteria:
Create guideline document using template 
Link guideline to related policies/standards 
Mark as "recommended" vs. "mandatory" 
Categorize by topic/domain 
Rich text editor with formatting 
Attach supporting documents (checklists, templates, diagrams) 
Publish to guideline repository 
Search and browse guidelines 
Track downloads/views 
User feedback/rating mechanism 
Story Points: 5Priority: P2 (Nice to Have)

User Story 2.12: Request Policy Exception
As a business unit ownerI want to request an exception to a policy or standardSo that I can handle special circumstances with proper approval
Acceptance Criteria:
Exception request form with required fields 
Select policy/standard/control requiring exception 
Provide business justification 
Propose compensating controls 
Specify exception duration 
Attach supporting documentation 
Submit for approval 
Approval workflow (risk manager, compliance officer, etc.) 
Approvers can approve, reject, or request more information 
Approved exceptions documented with conditions 
Exception expiration date tracked 
Alerts sent before expiration 
Exception renewal process 
Audit trail of all exceptions 
Story Points: 13Priority: P1 (Should Have)

User Story 2.13: Visualize Policy Framework Hierarchy
As a compliance officerI want to view the policy framework hierarchy visuallySo that I understand relationships between policies, standards, baselines, and guidelines
Acceptance Criteria:
Tree view or hierarchical diagram 
Levels: Influencer → Policy → Control Objective → Standard → Baseline → Guideline 
Click any node to view details 
Expand/collapse branches 
Color coding by status or compliance level 
Filter by category or domain 
Zoom and pan controls 
Export diagram as image 
Print-friendly format 
Story Points: 13Priority: P2 (Nice to Have)

User Story 2.14: Generate Traceability Matrix
As a compliance officerI want to generate a traceability matrix showing relationshipsSo that I can demonstrate how influencers are addressed through policies and controls
Acceptance Criteria:
Select scope: specific influencer, policy, or all 
Matrix shows: Influencer → Policy → Control Objective → Standard → Control → Asset 
Identify gaps (influencers without policies, controls without assets) 
Highlight completeness (green = full chain, yellow = partial, red = gaps) 
Filter matrix by business unit, criticality, status 
Export to Excel/PDF 
Print-friendly format 
Drill-down capability (click any item to see details) 
Story Points: 13Priority: P1 (Should Have)

Epic 3: Unified Control Library
User Story 3.1: Create Unified Control
As a compliance officerI want to create a control in the unified control librarySo that I can define implementation requirements once and map to multiple frameworks
Acceptance Criteria:
Form includes all control fields: ID, title, domain, description, implementation guidance 
Assign control to domain (IAM, Network Security, Data Protection, etc.) 
Control type: Preventive, Detective, Corrective, Compensating 
Priority/risk level: Critical, High, Medium, Low 
Implementation complexity: High, Medium, Low 
Cost impact: High, Medium, Low 
Rich text editor for description and guidance 
Attach supporting documents 
Assign control owner 
Set target implementation date 
Version control 
Audit trail 
Story Points: 8Priority: P0 (Must Have)

User Story 3.2: Import Control Library from Template
As a compliance officerI want to import a pre-built control library (e.g., ISO 27001, NIST 800-53)So that I can quickly establish a comprehensive control set
Acceptance Criteria:
Select from available control library templates 
Preview control library before import 
Option to import all or selected controls 
Map imported controls to internal domains 
Avoid duplicate controls (detect by name/description similarity) 
Imported controls marked with source framework 
Bulk edit capability after import 
Import activity logged 
Success/failure report 
Story Points: 13Priority: P1 (Should Have)

User Story 3.3: Map Control to Multiple Frameworks
As a compliance officerI want to map a single control to requirements from multiple frameworksSo that implementing one control satisfies multiple compliance obligations
Acceptance Criteria:
Add framework mapping to control 
Select framework from list (NCA ECC, ISO 27001, NIST CSF, PCI DSS, etc.) 
Select specific requirement/control number from framework 
Specify coverage level: Full, Partial, Not Applicable 
Add mapping notes explaining coverage 
Support multiple mappings per control (many-to-many) 
View all framework mappings on control detail page 
Remove mappings 
Bulk mapping tool (map multiple controls to framework) 
Export control-to-framework mapping matrix 
Story Points: 13Priority: P0 (Must Have)

User Story 3.4: Add Framework to Library
As a governance administratorI want to add new compliance frameworks to the systemSo that controls can be mapped to emerging regulations
Acceptance Criteria:
Create framework entry: name, version, issuing authority, effective date 
Add framework requirements/control numbers 
Organize requirements hierarchically (domain → category → control) 
Import framework structure from Excel/CSV 
Link framework to influencers 
Framework status: Active, Draft, Deprecated 
Version control for frameworks 
Export framework structure 
Story Points: 8Priority: P1 (Should Have)

User Story 3.5: View Control Coverage Matrix
As a compliance officerI want to view which controls satisfy which framework requirementsSo that I can identify high-value controls and gaps
Acceptance Criteria:
Matrix view: Controls (rows) × Frameworks (columns) 
Cell indicates coverage level (Full, Partial, None) 
Color coding for quick visualization 
Click cell to view mapping details 
Filter by domain, framework, coverage level 
Sort by number of frameworks covered (highest coverage first) 
Identify controls covering 5+ frameworks (efficiency indicators) 
Export matrix to Excel 
Print-friendly format 
Story Points: 13Priority: P1 (Should Have)

User Story 3.6: Conduct Gap Analysis
As a compliance officerI want to identify framework requirements without mapped controlsSo that I can address compliance gaps
Acceptance Criteria:
Select framework(s) for gap analysis 
Report shows unmapped requirements 
Group gaps by domain/category 
Priority ranking for gaps 
Ability to create new controls directly from gaps 
Ability to map existing controls to gaps 
Document gap acceptance/risk acceptance 
Track gap remediation actions 
Export gap analysis report 
Dashboard widget showing total gaps by framework 
Story Points: 13Priority: P1 (Should Have)

User Story 3.7: Track Control Implementation Status
As a control ownerI want to update the implementation status of my assigned controlsSo that stakeholders can track governance maturity
Acceptance Criteria:
Implementation status: Not Implemented, Planned, In Progress, Implemented, Not Applicable 
Implementation date (actual vs. target) 
Implementation approach description 
Link controls to implementing assets 
Upload implementation evidence 
Implementation percentage (0-100%) 
Assign responsible party 
Set target completion date 
Status change notifications to stakeholders 
Dashboard showing implementation progress 
Filter controls by implementation status 
Export implementation status report 
Story Points: 8Priority: P0 (Must Have)

User Story 3.8: Link Controls to Assets
As a control ownerI want to link controls to the assets where they're implementedSo that I can demonstrate control coverage across the IT environment
Acceptance Criteria:
Browse asset inventory from control detail page 
Select multiple assets for bulk linking 
View all linked assets from control 
View all linked controls from asset detail page 
Remove asset-control linkages 
Filter assets by control implementation 
Report showing assets by control coverage 
Identify assets without controls (unprotected assets) 
Export asset-control matrix 
Story Points: 8Priority: P1 (Should Have)

User Story 3.9: Create Control Assessment
As an assessorI want to create and conduct control assessmentsSo that I can evaluate control effectiveness
Acceptance Criteria:
Create assessment plan: name, scope, assessment period, assessors 
Select controls to assess 
Select assessment type: Implementation, Design Effectiveness, Operating Effectiveness, Compliance 
Define assessment procedures for each control 
Assign controls to assessors 
Set assessment due dates 
Assessment status: Not Started, In Progress, Completed 
Track assessment progress dashboard 
Email notifications to assigned assessors 
Save assessment as template for reuse 
Story Points: 13Priority: P0 (Must Have)

User Story 3.10: Execute Control Assessment and Record Results
As an assessorI want to execute control assessments and record findingsSo that control effectiveness is documented
Acceptance Criteria:
View assigned controls for assessment 
Review control description and assessment procedures 
Collect and attach evidence (documents, screenshots, logs) 
Record assessment result: Compliant, Non-Compliant, Partially Compliant, Not Applicable 
Document findings (what was observed) 
Add recommendations 
Rate control effectiveness (1-5 scale) 
Assign severity to findings: Critical, High, Medium, Low 
Create remediation actions from findings 
Submit assessment for review 
Assessment approval workflow 
Audit trail of assessment activities 
Story Points: 13Priority: P0 (Must Have)

User Story 3.11: Manage Control Evidence Repository
As a control ownerI want to upload and organize evidence for controlsSo that auditors can easily access proof of implementation
Acceptance Criteria:
Upload evidence files (PDF, images, CSV, logs, etc.) 
Link evidence to one or more controls 
Evidence metadata: type, collection date, validity period, collector 
Evidence categories: Policy, Configuration, Log, Report, Screenshot, Certification, etc. 
Evidence status: Draft, Approved, Expired 
Evidence approval workflow 
Set evidence expiration/refresh date 
Alerts when evidence expires 
Search evidence by control, type, date 
Bulk evidence upload 
Evidence access controls (role-based) 
Download evidence 
Evidence audit trail 
Export evidence package for auditors 
Story Points: 13Priority: P1 (Should Have)

User Story 3.12: Schedule and Track Control Testing
As a control ownerI want to schedule recurring control testsSo that ongoing effectiveness is verified
Acceptance Criteria:
Define test procedure for control 
Set test frequency: Weekly, Monthly, Quarterly, Annually, Ad-hoc 
Assign tester(s) 
Automated test reminders sent to testers 
Record test execution date and tester 
Document test results: Pass, Fail, Not Tested 
Attach test evidence 
Track test history 
Dashboard showing test coverage and upcoming tests 
Alerts for overdue tests 
Generate test summary reports 
Link test failures to remediation actions 
Story Points: 13Priority: P1 (Should Have)

User Story 3.13: Generate Audit-Ready Evidence Package
As a compliance officerI want to generate a package of evidence for external auditsSo that auditor requests are handled efficiently
Acceptance Criteria:
Select framework/audit scope 
System automatically gathers relevant controls and evidence 
Organize evidence by framework requirement 
Include control descriptions, implementation status, test results 
Generate control matrix for auditor 
Package all documents in organized folder structure 
Export as ZIP file 
Include table of contents/index 
Option to add cover letter/executive summary 
Track what was provided to which auditor (audit trail) 
Version control for evidence packages 
Story Points: 13Priority: P1 (Should Have)

User Story 3.14: Track Control Effectiveness Over Time
As a compliance officerI want to monitor control effectiveness trendsSo that I can identify degrading controls and improvement opportunities
Acceptance Criteria:
Define Key Control Indicators (KCIs) for controls 
Automated data collection for KCIs where possible 
Manual KCI entry 
Effectiveness scoring/rating (1-5 or percentage) 
Historical trend charts (line/bar graphs) 
Comparison across time periods 
Identify controls with declining effectiveness 
Alerts when effectiveness drops below threshold 
Root cause analysis documentation 
Corrective action tracking 
Dashboard showing top/bottom performing controls 
Export effectiveness reports 
Story Points: 13Priority: P2 (Nice to Have)

User Story 3.15: Document Control Relationships and Dependencies
As a security architectI want to define relationships between controlsSo that I understand control dependencies and compensating controls
Acceptance Criteria:
Define relationship types: Depends On, Compensates For, Supports, Related To 
Link controls bidirectionally 
View dependency graph/map 
Identify control chains (A depends on B depends on C) 
Warning when modifying controls with dependencies 
Impact analysis: what's affected if this control fails? 
Export dependency map 
Filter view by relationship type 
Story Points: 8Priority: P2 (Nice to Have)

Epic 4: Standard Operating Procedures (SOPs)
User Story 4.1: Create SOP Document
As a process ownerI want to create a standard operating procedure using a templateSo that operational processes are consistently documented
Acceptance Criteria:
Select SOP template by category (Operational, Security, Compliance, Third-Party) 
SOP template includes standard sections: Purpose, Scope, Roles, Prerequisites, Steps, etc. 
Rich text editor with formatting 
Add numbered procedure steps 
Embed images/screenshots in steps 
Add decision points/flowcharts 
Link SOP to related policies, standards, controls 
Assign SOP owner 
Set review frequency 
Save as draft or submit for approval 
Version control 
Export to PDF/Word 
Story Points: 8Priority: P0 (Must Have)

User Story 4.2: SOP Approval Workflow
As a process ownerI want to route SOPs through approval before publicationSo that procedures are validated by stakeholders
Acceptance Criteria:
Define SOP approval workflow 
Assign technical and management approvers 
Submit SOP for approval 
Approvers receive notifications 
Approvers can approve, reject, or request changes 
Comments captured at each stage 
SOP status updates automatically 
Digital signatures 
Version locked during approval 
Audit trail 
Story Points: 8Priority: P0 (Must Have)

User Story 4.3: Publish and Distribute SOPs
As a process ownerI want to publish approved SOPs to the repositorySo that staff can access current procedures
Acceptance Criteria:
Publish SOP to centralized repository 
Assign SOP to roles or individuals 
Notification sent to assigned users 
SOPs categorized by domain/type 
Browse and search SOPs 
Previous versions accessible 
Download SOP as PDF 
Print-friendly format 
View count tracking 
Most popular SOPs dashboard 
Story Points: 5Priority: P0 (Must Have)

User Story 4.4: Track SOP Execution
As a operations managerI want to track when SOPs are executedSo that I can monitor operational compliance and identify issues
Acceptance Criteria:
Record SOP execution: who, when, outcome 
Link execution to tickets/requests (optional) 
Execution outcome: Successful, Failed, Partially Completed 
Document deviations from procedure 
Capture execution time (start/end) 
Attach execution evidence/screenshots 
Quality checks completed (yes/no) 
Exception documentation if procedure not followed 
View execution history per SOP 
Generate execution reports 
Dashboard showing execution metrics 
Story Points: 13Priority: P1 (Should Have)

User Story 4.5: SOP Training and Acknowledgment
As a training coordinatorI want to assign SOPs for training and track acknowledgmentsSo that staff are competent in procedures
Acceptance Criteria:
Assign SOPs to roles or individuals 
Users receive training notification 
Users can view SOP and complete quiz (optional) 
Users click "I Acknowledge" after reading 
Capture acknowledgment date 
Track training completion status 
Reminders for unacknowledged SOPs 
Training expiration and renewal (annual, etc.) 
Generate training completion reports 
Filter SOPs by acknowledgment status 
Export acknowledgment records 
Story Points: 13Priority: P1 (Should Have)

User Story 4.6: Schedule SOP Reviews
As a process ownerI want to schedule regular SOP reviewsSo that procedures remain current and accurate
Acceptance Criteria:
Set next review date 
Automated reminders to SOP owner 
Dashboard shows SOPs due for review 
Review workflow initiated 
Document review outcome: No changes, Minor updates, Major revision 
Extend review date with justification 
Stakeholder involvement in reviews 
Version control tracks review history 
Audit trail 
Story Points: 5Priority: P1 (Should Have)

User Story 4.7: Link SOPs to Controls
As a compliance officerI want to link SOPs to controls in the unified librarySo that I can demonstrate how controls are operationalized
Acceptance Criteria:
Browse control library from SOP 
Link SOP to one or more controls 
Specify SOP purpose: Implementation, Testing, Monitoring, Remediation 
View linked controls from SOP detail page 
View linked SOPs from control detail page 
Remove linkages 
Report showing controls with/without SOPs 
Export SOP-to-control mapping 
Story Points: 5Priority: P1 (Should Have)

User Story 4.8: Capture SOP Feedback
As a process ownerI want to collect feedback from SOP usersSo that I can continuously improve procedures
Acceptance Criteria:
Feedback form on SOP page 
Rating system (1-5 stars) 
Comment field for suggestions 
Submit feedback anonymously or identified 
Feedback routed to SOP owner 
Dashboard showing average ratings per SOP 
View all feedback for an SOP 
Mark feedback as addressed 
Incorporate feedback into revisions 
Trending: SOPs with lowest ratings 
Story Points: 5Priority: P2 (Nice to Have)

User Story 4.9: SOP Performance Metrics
As a operations managerI want to track SOP performance metricsSo that I can identify inefficient or problematic procedures
Acceptance Criteria:
Track average execution time per SOP 
Success vs. failure rate 
Number of exceptions/deviations 
User feedback scores 
Trend analysis over time 
Dashboard with SOP KPIs 
Identify SOPs taking longer than expected 
Identify SOPs with high failure rates 
Identify SOPs with frequent deviations 
Generate performance reports 
Export metrics to Excel 
Story Points: 13Priority: P2 (Nice to Have)

User Story 4.10: Search and Browse SOP Library
As a staff memberI want to search and browse the SOP repositorySo that I can find procedures when needed
Acceptance Criteria:
Full-text search across all SOPs 
Filter by category, domain, status 
Browse by category tree 
View recently updated SOPs 
View most popular SOPs 
View my assigned SOPs 
Bookmarking/favorites 
Search results show relevance scoring 
Click result to view SOP 
Download SOP directly from search results 
Story Points: 5Priority: P0 (Must Have)

Epic 5: Integration and Relationships
User Story 5.1: Visualize Governance Traceability
As a compliance officerI want to visualize the complete governance chain from influencer to assetSo that I can demonstrate end-to-end traceability
Acceptance Criteria:
Interactive diagram showing: Influencer → Policy → Control Objective → Standard → Control → Asset → SOP 
Start from any node and trace forward or backward 
Click any node to view details 
Highlight complete paths (green) vs. incomplete (red) 
Filter by framework, domain, business unit 
Zoom and pan controls
Export diagram as image 
Print-friendly format 
Identify orphaned items (not connected to chain) 
Story Points: 21Priority: P1 (Should Have)

User Story 5.2: Impact Analysis for Changes
As a compliance officerI want to perform impact analysis when changing policies or controlsSo that I understand downstream effects before making changes
Acceptance Criteria:
Select policy, control, or standard for analysis 
System shows all downstream dependencies 
Shows: policies affected, controls affected, assets affected, SOPs affected, assessments impacted 
Visualize impact radius 
Export impact analysis report 
Warning before making changes to high-impact items 
Stakeholder notification list generated 
Change assessment workflow 
Story Points: 13Priority: P1 (Should Have)

User Story 5.3: Cross-Module Search
As a userI want to search across all governance modules from one search barSo that I can find information regardless of where it's stored
Acceptance Criteria:
Global search bar available on all pages 
Search across: influencers, policies, controls, SOPs, evidence, assets 
Results grouped by module 
Filter results by module type 
Sort by relevance, date, status 
Search suggestions/autocomplete 
Recent searches saved 
Advanced search with module-specific filters 
Export search results 
Story Points: 13Priority: P1 (Should Have)

User Story 5.4: Asset Compliance Status View
As a security managerI want to view compliance status of assets based on required controlsSo that I can identify non-compliant systems
Acceptance Criteria:
View asset with linked controls 
Compliance status calculated from control implementation and test results 
Status: Compliant, Partially Compliant, Non-Compliant, Not Assessed 
Show which controls are implemented vs. missing 
Show which controls passed/failed tests 
Color-coded compliance indicators 
Filter assets by compliance status 
Drill down to see specific control gaps 
Generate compliance report per asset 
Dashboard showing assets by compliance level 
Story Points: 13Priority: P1 (Should Have)

User Story 5.5: Bulk Asset-Control Assignment
As a security architectI want to assign controls to multiple assets at onceSo that I can efficiently document control coverage
Acceptance Criteria:
Select multiple assets (by type, location, business unit, etc.) 
Browse and select controls to assign 
Bulk assignment action 
Confirmation prompt showing impact 
Progress indicator for large operations 
Success/failure summary 
Option to rollback if errors 
Audit log of bulk operations 
Email notification to asset owners 
Story Points: 8Priority: P1 (Should Have)

Epic 6: Reporting and Analytics
User Story 6.1: Governance Dashboard
As a compliance officerI want to view a comprehensive governance dashboardSo that I have real-time visibility into governance posture
Acceptance Criteria:
Summary cards: Total policies, active influencers, control implementation rate, assessment completion rate 
Charts: Controls by domain, implementation status, framework compliance scores 
Top risks/issues widget 
Recent activities feed 
Upcoming reviews and expirations 
Customizable widgets (drag and drop) 
Date range filter 
Export dashboard to PDF 
Scheduled dashboard emails 
Story Points: 13Priority: P0 (Must Have)

User Story 6.2: Framework Compliance Scorecard
As a compliance officerI want to generate compliance scorecards by frameworkSo that I can report on regulatory compliance status
Acceptance Criteria:
Select framework(s) for scorecard 
Overall compliance percentage 
Breakdown by domain/category 
Requirements: Met, Not Met, Partially Met, Not Applicable 
Control implementation status 
Assessment results 
Gap summary 
Trend over time (current vs. previous period) 
Color-coded compliance levels (green/yellow/red) 
Export to Excel/PDF 
Executive summary format option 
Story Points: 13Priority: P0 (Must Have)

User Story 6.3: Policy Compliance Report
As a policy managerI want to generate reports on policy status and complianceSo that management understands policy program health
Acceptance Criteria:
Total policies by status (approved, draft, under review, expired) 
Policies due for review 
Policy acknowledgment rates 
Policy exceptions summary 
Policies without linked controls (gaps) 
Policy age distribution 
Most/least acknowledged policies 
Filter by business unit, policy type 
Trend analysis (policies over time) 
Export to Excel/PDF 
Story Points: 8Priority: P1 (Should Have)

User Story 6.4: Control Implementation Progress Report
As a security managerI want to track control implementation progressSo that I can report on security program maturity
Acceptance Criteria:
Controls by implementation status 
Implementation timeline (planned vs. actual) 
Controls by domain 
Controls by priority 
Overdue controls 
Implementation percentage by business unit 
Resource allocation (controls by owner) 
Trend analysis (implementation over time) 
Gantt chart view for planned implementations 
Export to Excel/PDF/PowerPoint 
Story Points: 13Priority: P1 (Should Have)

User Story 6.5: Assessment Results Report
As an assessorI want to generate reports on assessment findingsSo that stakeholders understand control effectiveness
Acceptance Criteria:
Assessment summary (total assessments, completion rate) 
Results by control: compliant, non-compliant, partially compliant 
Findings by severity (critical, high, medium, low) 
Remediation status tracking 
Comparison across assessment periods 
Pass/fail trends 
Top failing controls 
Controls with repeat findings 
Filter by framework, domain, assessor 
Export to Excel/PDF 
Story Points: 13Priority: P1 (Should Have)

User Story 6.6: Executive Governance Report
As an executiveI want to view a high-level governance summarySo that I can understand our compliance posture at a glance
Acceptance Criteria:
One-page executive summary 
Overall compliance score/status 
Key compliance achievements 
Top risks and issues 
Regulatory changes requiring attention 
Resource requirements 
Upcoming audits 
Visual indicators (red/yellow/green) 
Comparison to previous period 
Actionable items requiring executive decision 
Board-ready format 
Export to PDF/PowerPoint 
Story Points: 13Priority: P1 (Should Have)

User Story 6.7: Audit Findings Tracker
As a compliance officerI want to track findings from internal and external auditsSo that remediation is managed to closure
Acceptance Criteria:
Record audit findings (date, auditor, finding description, severity) 
Link findings to controls 
Assign remediation owner 
Set remediation due date 
Track remediation status: Open, In Progress, Closed, Accepted Risk 
Document remediation actions 
Attach remediation evidence 
Overdue findings alerts 
Findings aging report 
Retest validation 
Export findings tracker 
Dashboard showing open findings by severity 
Story Points: 13Priority: P1 (Should Have)

User Story 6.8: Coverage and Gap Analysis Report
As a compliance officerI want to generate gap analysis across frameworksSo that I can prioritize remediation efforts
Acceptance Criteria:
Select frameworks for analysis 
Show requirements without mapped controls (gaps) 
Show controls not mapped to any framework (potential waste) 
Prioritize gaps by risk/impact 
Gap remediation plan with owners and dates 
Coverage heat map (visual representation) 
Progress tracking (gaps over time) 
Export gap analysis report 
Executive summary of top gaps 
Story Points: 13Priority: P1 (Should Have)

User Story 6.9: Scheduled Report Generation
As a compliance officerI want to schedule reports to run automaticallySo that stakeholders receive regular updates without manual effort
Acceptance Criteria:
Select report type 
Define schedule (daily, weekly, monthly, quarterly) 
Set report parameters (filters, date ranges) 
Define recipient list 
Email delivery with attached report 
Dashboard delivery option 
Report generation history 
Enable/disable scheduled reports 
Edit schedule 
Success/failure notifications 
Story Points: 13Priority: P2 (Nice to Have)

User Story 6.10: Custom Report Builder
As a compliance officerI want to create custom reports with selected fieldsSo that I can answer specific stakeholder questions
Acceptance Criteria:
Select data source (policies, controls, assessments, etc.) 
Select fields to include 
Apply filters 
Group by specific fields 
Add calculations (counts, percentages, averages) 
Preview report before generation 
Save report template for reuse 
Export to Excel/PDF/CSV 
Share report templates with team 
Schedule custom reports 
Story Points: 21Priority: P2 (Nice to Have)

Epic 7: Administration and Configuration
User Story 7.1: Configure Governance Frameworks
As a governance administratorI want to add and configure compliance frameworksSo that the system supports our regulatory environment
Acceptance Criteria:
Add new framework (name, version, authority, effective date) 
Import framework structure (domains, categories, requirements) 
Edit framework requirements 
Deactivate deprecated frameworks 
Version control for frameworks 
Framework status: Active, Draft, Deprecated 
Export framework structure 
Audit trail 
Story Points: 8Priority: P1 (Should Have)

User Story 7.2: Customize Control Domains
As a governance administratorI want to customize control domains and categoriesSo that the control library matches our organizational structure
Acceptance Criteria:
Add/edit/delete control domains 
Define domain hierarchy 
Map domains to business functions 
Assign domain owners 
Reorder domains 
Color coding for domains 
Domain status: Active, Inactive 
Move controls between domains 
Audit trail 
Story Points: 5Priority: P1 (Should Have)

User Story 7.3: Configure Approval Workflows
As a governance administratorI want to configure approval workflows for policies and controlsSo that governance documents follow proper authorization paths
Acceptance Criteria:
Define workflow steps 
Assign approvers by role or individual 
Single or multi-level approval 
Parallel or sequential approval 
Conditional routing based on criteria 
Auto-escalation if not approved within timeframe 
Workflow templates (reusable) 
Test workflow before activation 
Audit trail of workflow changes 
Story Points: 13Priority: P1 (Should Have)

User Story 7.4: Manage User Roles and Permissions
As a governance administratorI want to define roles and permissions for governance modulesSo that users have appropriate access levels
Acceptance Criteria:
Create custom roles 
Define permissions by module and action (view, create, edit, delete) 
Assign roles to users 
Row-level security (access by business unit) 
Permission inheritance 
Bulk user assignment 
Test permissions before applying 
Audit trail of permission changes 
Role usage reports 
Story Points: 13Priority: P0 (Must Have)

User Story 7.5: Configure Notification Settings
As a governance administratorI want to configure system notifications and alertsSo that users receive timely reminders and updates
Acceptance Criteria:
Define notification triggers (policy due, assessment overdue, etc.) 
Configure notification frequency 
Define recipient rules (roles, individuals) 
Email template customization 
In-app notification settings 
Escalation notifications 
Notification digest options 
Test notifications 
User preference for notification types 
Notification audit log 
Story Points: 13Priority: P1 (Should Have)

User Story 7.6: System Audit Log
As a governance administratorI want to view comprehensive system audit logsSo that I can track all governance activities for security and compliance
Acceptance Criteria:
Log all create, read, update, delete operations 
Log all authentications 
Log all permission changes 
Log all exports and report generation 
Filter logs by: user, action, entity, date range 
Search within logs 
Export logs to CSV/PDF 
Immutable log records 
Log retention per organizational policy 
Dashboard showing audit statistics 
Story Points: 13Priority: P1 (Should Have)

User Story 7.7: Data Import/Export Management
As a governance administratorI want to manage bulk data imports and exportsSo that governance data can be migrated and shared
Acceptance Criteria:
Template downloads for each entity type 
Import from CSV/Excel 
Field mapping interface 
Data validation before import 
Preview and confirm imports 
Import history and logs 
Export any entity type to CSV/Excel 
Bulk export with filters 
Schedule automated exports 
Import/export API endpoints 
Story Points: 13Priority: P1 (Should Have)

User Story 7.8: Configure Document Templates
As a governance administratorI want to create and manage document templatesSo that governance documents have consistent formatting
Acceptance Criteria:
Create templates for: policies, standards, SOPs, reports 
Rich text editor for templates 
Define template sections and fields 
Insert dynamic placeholders (dates, names, etc.) 
Preview templates 
Set default templates by document type 
Version control for templates 
Share templates across organization 
Template library 
Import/export templates 
Story Points: 8Priority: P2 (Nice to Have)

Epic 8: Notifications and Alerts
User Story 8.1: Policy Review Reminders
As a policy ownerI want to receive reminders when policies are due for reviewSo that I don't miss review deadlines
Acceptance Criteria:
Automated emails sent 90, 60, 30, 7 days before due date 
In-app notifications 
Reminder includes policy name, current version, review due date 
Link directly to policy for review 
Snooze option with justification 
Escalation to manager if overdue 
Dashboard widget showing my pending reviews 
Story Points: 5Priority: P1 (Should Have)

User Story 8.2: Control Assessment Due Notifications
As a control ownerI want to receive alerts when control assessments or tests are overdueSo that I can maintain compliance
Acceptance Criteria:
Notification sent when test due date approaches 
Escalation if test becomes overdue 
Shows control name, test type, due date 
Link to control for testing 
Dashboard showing overdue tests 
Manager visibility of team's overdue tests 
Story Points: 5Priority: P1 (Should Have)

User Story 8.3: Exception Expiration Alerts
As a compliance officerI want to receive alerts when policy exceptions are expiringSo that exceptions are renewed or controls are implemented
Acceptance Criteria:
Notification 30, 14, 7 days before expiration 
Alert on expiration day 
Shows exception details and compensating controls 
Link to exception for renewal or closure 
Report of expiring exceptions 
Dashboard widget 
Story Points: 5Priority: P1 (Should Have)

User Story 8.4: Regulatory Change Notifications
As a compliance officerI want to receive alerts when influencers are updatedSo that I can assess impact and respond to changes
Acceptance Criteria:
Notification when influencer record updated 
Shows what changed 
Link to influencer and impacted policies/controls 
Trigger impact assessment workflow 
Dashboard showing recent regulatory changes 
Option to subscribe/unsubscribe to specific frameworks 
Story Points: 8Priority: P1 (Should Have)

User Story 8.5: Evidence Expiration Alerts
As a control ownerI want to receive notifications when control evidence is expiringSo that I can refresh evidence for audits
Acceptance Criteria:
Alert when evidence validity period approaching end 
Shows control, evidence type, expiration date 
Link to upload new evidence 
Dashboard showing expiring evidence 
Bulk evidence refresh capability 
Story Points: 5Priority: P1 (Should Have)

User Story 8.6: Audit Finding Remediation Reminders
As a remediation ownerI want to receive reminders about open audit findingsSo that I complete remediation on time
Acceptance Criteria:
Notification when remediation due date approaches 
Escalation if overdue 
Shows finding details, severity, due date 
Link to finding for documentation 
Manager visibility 
Dashboard showing my open findings 
Story Points: 5Priority: P1 (Should Have)

Story Sizing Legend
1-3 points: Simple feature, minimal complexity, clear requirements 
5 points: Moderate feature, some complexity, most requirements clear 
8 points: Complex feature, significant development effort, dependencies 
13 points: Very complex feature, multiple components, integrations required 
21 points: Highly complex, consider breaking into smaller stories 
Priority Definitions
P0 (Must Have): Critical for MVP, core functionality 
P1 (Should Have): Important for full product, delivers significant value 
P2 (Nice to Have): Enhancement features, can be deferred to later phases 
Summary Statistics
Total User Stories: 88
By Priority:
P0: 27 stories 
P1: 46 stories 
P2: 15 stories 
By Epic:
Epic 1 (Influencers): 8 stories 
Epic 2 (Policy Management): 14 stories 
Epic 3 (Unified Control Library): 15 stories 
Epic 4 (SOPs): 10 stories 
Epic 5 (Integration): 5 stories 
Epic 6 (Reporting): 10 stories 
Epic 7 (Administration): 8 stories 
Epic 8 (Notifications): 6 stories 
Epic 9 (External Integrations): 6 stories 
Epic 10 (Mobile & Accessibility): 6 stories 
Estimated Total Story Points: ~890 points
This comprehensive set of user stories provides a complete roadmap for implementing the Governance module of your GRC platform.

Wagieh
────┘
Product Requirements Document (PRD)
GRC Platform - Governance Module
1. Executive Summary
1.1 Product Overview
The Governance Module is a comprehensive platform component that enables organizations to establish, document, and maintain governance frameworks covering IT, privacy, and cybersecurity. It seamlessly integrates with the Asset Management Module to provide end-to-end traceability from regulatory requirements to technical implementation on specific assets.
1.2 Business Objectives
Establish centralized governance framework management 
Enable response to regulatory requirements through unified control implementation 
Eliminate redundant compliance efforts through control-to-framework mapping 
Provide complete traceability from regulation to asset implementation 
Support multi-framework compliance with single control implementations 
Reduce audit preparation time by 50%+ 
Enable rapid response to new regulatory requirements 
1.3 Success Metrics
Governance Coverage: 100% of applicable regulations documented 
Control Efficiency: Average 5+ framework mappings per control 
Policy Compliance: 95%+ policy acknowledgment rate 
Assessment Completion: 90%+ controls assessed annually 
Audit Readiness: Generate audit packages in <2 hours 
Time Savings: 60% reduction in compliance assessment time 
User Satisfaction: NPS score 40+ 
1.4 Strategic Value
Risk Reduction: Comprehensive control coverage across all regulations 
Cost Efficiency: Eliminate duplicate compliance efforts 
Audit Confidence: Complete audit trail and evidence repository 
Business Enablement: Faster compliance for new initiatives 
Competitive Advantage: Demonstrate governance maturity to customers 

2. Product Scope
2.1 In Scope
Core Governance Functions:
Influencer registry (regulatory, contractual, statutory, internal) 
Policy lifecycle management (policies, standards, baselines, guidelines) 
Unified control library with multi-framework mapping 
Control assessment and testing 
Evidence repository and management 
Standard Operating Procedures (SOPs) 
Traceability matrix (regulation → policy → control → asset) 
Compliance reporting and analytics 
Exception management 
Audit support 
Integration Capabilities:
Tight integration with Asset Management Module 
Control-to-asset mapping 
Asset compliance status calculation 
Evidence collection from assets 
Shared user management and RBAC 
Unified audit logging 
2.2 Out of Scope (Future Phases)
Phase 2 Candidates:
Risk Management Module (risk assessments, risk register) 
Vendor Risk Management Module 
Incident Management integration 
Automated evidence collection from tools (SIEM, vulnerability scanners) 
AI-powered gap analysis and recommendations 
Predictive compliance analytics 
Mobile application 
Third-party GRC tool integrations (Archer, ServiceNow) 
Not Planned:
Financial compliance (SOX, financial auditing) 
HR compliance (labor laws, workplace safety) 
Environmental compliance 
Legal case management 
2.3 Assumptions and Constraints
Assumptions:
Asset Management Module is deployed and operational 
Users have modern web browsers (Chrome, Firefox, Edge, Safari) 
Organization has defined compliance requirements 
Subject matter experts available for control library development 
Regulatory frameworks are documented (NCA, ISO 27001, etc.) 
Constraints:
Must reuse existing authentication and user management 
Must maintain consistency with Asset Management UI/UX 
Must support same database platform (PostgreSQL) 
Must comply with data retention policies (7 years minimum) 
Must support audit trail requirements (immutable logs) 
Performance: Support 100+ concurrent users 
Scalability: Support 10,000+ controls, 50+ frameworks 

3. User Personas
3.1 Primary Users
Persona 1: Chief Information Security Officer (CISO)
Profile: Executive responsible for security and compliance programGoals:
Understand overall compliance posture 
Demonstrate governance to board and regulators 
Prioritize security investments 
Ensure audit readiness 
Pain Points:
Fragmented compliance information 
Difficulty reporting to board 
Unclear security program maturity 
Audit preparation stress 
Key Features: Executive dashboard, compliance scorecards, audit reports, framework coverage analysis

Persona 2: Compliance Officer
Profile: Manages regulatory compliance programGoals:
Track all applicable regulations 
Ensure policies address requirements 
Coordinate assessments and audits 
Maintain evidence repository 
Pain Points:
Keeping up with regulatory changes 
Mapping requirements across frameworks 
Evidence collection and organization 
Duplicate assessment efforts 
Key Features: Influencer registry, policy management, unified control library, framework mapping, evidence repository

Persona 3: Policy Manager
Profile: Develops and maintains governance documentationGoals:
Create clear, actionable policies 
Ensure policy approval and distribution 
Track policy acknowledgments 
Maintain policy currency 
Pain Points:
Policy review burden 
Ensuring staff read policies 
Keeping policies aligned with regulations 
Policy version control 
Key Features: Policy editor, approval workflows, acknowledgment tracking, policy analytics

Persona 4: Control Owner
Profile: Implements and maintains specific security controlsGoals:
Understand control requirements 
Document control implementation 
Provide evidence of effectiveness 
Pass control assessments 
Pain Points:
Unclear control requirements 
Evidence collection burden 
Multiple assessment requests 
Remediation tracking 
Key Features: Control dashboard, evidence upload, assessment interface, SOPs, asset linking

Persona 5: Internal Auditor/Assessor
Profile: Evaluates control effectivenessGoals:
Conduct efficient assessments 
Document findings objectively 
Track remediation 
Generate audit reports 
Pain Points:
Evidence access and review 
Inconsistent documentation 
Remediation follow-up 
Report generation time 
Key Features: Assessment workflows, evidence review, findings management, audit reports

Persona 6: Security Architect
Profile: Designs security controls and technical implementationsGoals:
Define technical standards 
Create secure baselines 
Map controls to assets 
Ensure comprehensive coverage 
Pain Points:
Translating policy to technical requirements 
Baseline consistency across platforms 
Control dependency management 
Coverage gaps 
Key Features: Standards editor, baseline management, control library, dependency mapping, asset integration

3.2 Secondary Users
Persona 7: Business Unit Manager
Profile: Manages department operationsGoals:
Understand applicable policies 
Ensure team compliance 
Request exceptions when needed 
View compliance status 
Key Features: Policy view, exception requests, compliance dashboard (filtered to BU)

Persona 8: System Administrator
Profile: Manages GRC platformGoals:
Configure frameworks 
Manage users and permissions 
Maintain system health 
Generate reports 
Key Features: Admin console, user management, framework configuration, system logs

4. Integration Architecture
4.1 Integration with Asset Management Module
The Governance and Asset Management modules are tightly integrated to enable end-to-end traceability:
Governance Module                    Asset Management Module
┌──────────────────┐                ┌──────────────────────┐
│  Influencers     │                │                      │
│      ↓           │                │                      │
│   Policies       │                │                      │
│      ↓           │                │                      │
│ Control          │                │                      │
│ Objectives       │                │                      │
│      ↓           │                │                      │
│   Standards      │                │                      │
│      ↓           │                │                      │
│   Baselines      │ ←──applies to──│  Physical Assets    │
│      ↓           │                │  Applications       │
│ Unified Control  │ ←implemented→  │  Software           │
│   Library        │    on          │  Information Assets │
│      ↓           │                │  Suppliers          │
│   Evidence       │ ←collected─────│                     │
│   Repository     │    from        │                     │
│      ↓           │                │                      │
│   Assessments    │ ←evaluate──────│  Asset Compliance   │
│                  │                │                      │
│   SOPs           │ ←executed on───│  Assets             │
└──────────────────┘                └──────────────────────┘
Key Integration Points:
Control-to-Asset Mapping
Controls implemented on specific assets 
Asset compliance calculated from control status 
Asset classification drives control applicability 
Evidence Collection
Evidence linked to both controls and assets 
Asset configuration reports as evidence 
Security test results from assets linked to controls 
Baseline Application
Baselines assigned to assets by type/platform 
Baseline compliance tracked per asset 
Deviations documented and approved 
Shared Master Data
Users, roles, business units (single source) 
Unified audit trail 
Common tagging and categorization 
Compliance Status Flow
Asset criticality → Control priority 
Asset ownership → Control responsibility 
Asset compliance → Framework compliance 
4.2 Data Flow Examples
Example 1: New Regulation Impact
1. Compliance Officer adds NCA regulation to Influencers
2. Creates/updates policies to address NCA requirements
3. Defines control objectives in policies
4. Maps control objectives to unified controls
5. System identifies assets requiring those controls
6. Control owners implement controls on assets
7. Evidence collected from assets
8. Assessments validate implementation
9. Compliance dashboard shows NCA status
Example 2: Asset Compliance Check
1. User views Physical Asset "Firewall-01"
2. System shows controls implemented on this asset
3. System calculates compliance status:
   - Required controls (based on asset criticality, location, data)
   - Implemented controls
   - Control test results
   - Evidence availability
4. Compliance score displayed (e.g., 85% compliant)
5. Gap analysis shows missing controls
6. Remediation actions created
Example 3: Multi-Framework Audit
1. Auditor selects frameworks: NCA ECC, ISO 27001, SOC 2
2. System generates unified control list (no duplicates)
3. For each control, shows:
   - Which frameworks it satisfies
   - Implementation status
   - Assets where implemented
   - Latest test results
   - Evidence repository
4. Audit package generated with all evidence
5. Export to auditor format

5. Functional Requirements
5.1 Influencer Management
FR-INF-001: Influencer Registry
Priority: P0Description: Centralized repository for all governance influencers
Requirements:
Create, read, update, delete influencer records 
Required fields: name, category, issuing authority, status 
Categories: Internal, Contractual, Statutory, Regulatory, Industry Standards 
Sub-categories for detailed classification 
Unique identifier (auto-generated) 
Version tracking with change history 
Source document attachment (PDF, URL) 
Custom fields for organization-specific attributes 
Soft delete (preserve audit trail) 
Data Fields:
ID (UUID, primary key) 
Name/Title (text, required) 
Category (enum, required) 
Sub-category (text) 
Issuing Authority (text) 
Jurisdiction/Scope (text) 
Reference Number (text, unique) 
Description (rich text) 
Publication Date 
Effective Date 
Last Revision Date 
Next Review Date 
Status (Active, Pending, Superseded, Retired) 
Applicability Status (Applicable, Not Applicable, Under Review) 
Applicability Justification (text) 
Source URL 
Attached Documents (file references) 
Owner (user reference) 
Business Units Affected (array) 
Tags (array) 
Created By, Created At, Updated By, Updated At, Deleted At 
User Interactions:
Search by name, category, authority, jurisdiction 
Filter by status, category, applicability 
Sort by any field 
Bulk import from CSV/Excel 
Export to CSV/Excel/PDF 
Business Rules:
Reference number must be unique 
Status changes logged in audit trail 
Deletion requires confirmation and reason 
Updates trigger notifications to affected policy owners 

FR-INF-002: Applicability Assessment
Priority: P0Description: Determine and document which influencers apply to organization
Requirements:
Define applicability criteria (industry, geography, business activities, data types) 
Structured assessment questionnaire 
Document assessment decision with justification 
Attach supporting evidence 
Set review date for reassessment 
Workflow for assessment approval 
Track assessment history 
Generate applicability reports 
Assessment Criteria:
Industry sector (financial, healthcare, government, etc.) 
Geographic operations (countries, states) 
Business activities (e-commerce, payment processing, etc.) 
Data types handled (PII, PHI, payment card, etc.) 
Organization size (revenue, employee count) 
Customer requirements 
Contractual obligations 
Outputs:
Applicable influencer list 
Applicability assessment report 
Non-applicable influencer list with justification 
Under review list requiring further analysis 

FR-INF-003: Influencer Change Management
Priority: P1Description: Track and respond to regulatory changes
Requirements:
Version control for all influencer changes 
Document what changed (revision notes) 
Impact assessment workflow triggered by changes 
Notification to policy owners and compliance team 
Track response actions (policy updates, control changes) 
Dashboard showing recent changes 
Subscription to specific frameworks for alerts 
Integration capability for external regulatory feeds (future) 

FR-INF-004: Compliance Obligations Register
Priority: P1Description: Extract and manage specific requirements from influencers
Requirements:
Create obligation records linked to influencers 
Obligation details: requirement text, category, priority 
Assign responsible party for each obligation 
Track obligation status (Met, Not Met, In Progress, N/A) 
Link obligations to implementing policies/controls 
Filter and search obligations 
Generate compliance obligation matrix 
Export register for regulatory reporting 

5.2 Policy Management
FR-POL-001: Policy Document Management
Priority: P0Description: Create and manage governance policy documents
Requirements:
Policy creation using templates 
Rich text editor with formatting (headers, lists, tables, images) 
Policy structure: Purpose, Scope, Definitions, Policy Statements, Roles, Compliance, Exceptions, Related Documents 
Policy metadata: version, owner, approval date, review date, status 
Link policy to driving influencers (many-to-many) 
Version control with comparison capability 
Document status workflow: Draft → In Review → Approved → Published → Archived 
Soft delete with archive 
Clone policy for new version 
Policy Types Supported:
Information Security Policy 
Data Privacy Policy 
Acceptable Use Policy 
Access Control Policy 
Incident Response Policy 
Business Continuity Policy 
Third-Party Risk Management Policy 
Data Classification Policy 
Custom policy types 
Data Fields:
ID (UUID) 
Policy Type 
Title (text, required) 
Version (auto-incremented) 
Content (rich text) 
Purpose (text) 
Scope (text) 
Owner (user reference) 
Business Units (array) 
Status (enum) 
Approval Date 
Effective Date 
Review Frequency (enum: Annual, Biennial, etc.) 
Next Review Date 
Linked Influencers (array of IDs) 
Tags 
Attachments 
Created By, Created At, Updated By, Updated At, Deleted At 

FR-POL-002: Control Objectives
Priority: P0Description: Define measurable control objectives within policies
Requirements:
Create control objectives within policy 
Each objective has unique identifier (auto-generated, e.g., CO-IAM-001) 
Control objective statement (clear, measurable) 
Rationale/justification 
Link to influencer requirements 
Map to unified controls (implementation) 
Assign responsible party 
Set implementation priority 
Track implementation status 
Reorder objectives within policy 
Control Objective Format: "The organization shall [action] to [purpose]"
Example:
ID: CO-IAM-001 
Statement: "The organization shall implement multi-factor authentication for all privileged accounts to prevent unauthorized access" 
Rationale: "Privileged accounts have elevated access to critical systems. MFA significantly reduces risk of credential compromise." 
Linked Influencers: NCA ECC 5-1-2, ISO 27001 A.5.17, PCI DSS 8.4 
Linked Controls: UCL-IAM-002 (Multi-Factor Authentication) 

FR-POL-003: Approval Workflow
Priority: P0Description: Route policies through approval process
Requirements:
Define approval workflow (configurable) 
Single or multi-level approval 
Sequential or parallel approval paths 
Assign approvers by role or individual 
Submit policy for approval 
Approver notifications (email and in-app) 
Approve, reject, or request changes actions 
Comments at each approval stage 
Digital signature capture 
Version locking during approval 
Auto-escalation for overdue approvals 
Audit trail of all approval actions 
Configurable approval rules (e.g., policies > $X require executive approval) 

FR-POL-004: Policy Publication and Distribution
Priority: P0Description: Publish and communicate policies to users
Requirements:
Publish to policy repository 
Assign policy to business units, roles, or individuals 
Automated notification to assigned users 
Email notification with policy summary and link 
In-app notification 
Policy library (searchable, filterable) 
Version history accessible 
Download as PDF 
Print-friendly format 
Analytics: views, downloads, acknowledgments 

FR-POL-005: Policy Acknowledgment
Priority: P1Description: Track user acknowledgment of policies
Requirements:
Users receive notification when assigned policy 
View policy and click "I Acknowledge" 
Cannot acknowledge without viewing (track scroll/time) 
Capture acknowledgment date and user 
Acknowledgment optional or mandatory (configurable) 
Re-acknowledgment required after major revisions 
Automated reminders for unacknowledged policies (configurable intervals) 
Escalation to manager after repeated reminders 
Acknowledgment reports by policy, user, business unit 
Export acknowledgment records for audits 

FR-POL-006: Policy Review Management
Priority: P1Description: Manage periodic policy reviews
Requirements:
Set review frequency when creating policy 
Automated reminders (90, 60, 30, 7 days before due) 
Dashboard showing policies due for review 
Review workflow 
Document review outcome: No changes, Minor changes, Major revision 
Extend review date with justification 
Stakeholder involvement (comments, suggestions) 
Review completion tracking 
Audit trail of all reviews 

FR-POL-007: Standards Management
Priority: P0Description: Create technical/procedural standards
Requirements:
Create standard document using template 
Link to parent policy and control objectives 
Define specific requirements (numbered, structured) 
Specify scope and applicability 
Set compliance measurement criteria 
Version control 
Approval workflow 
Link to implementing baselines 
Track compliance by asset/system 
Export to PDF/Word 
Standard Structure:
Header (ID, title, version, dates, owner) 
Reference to Policy/Control Objective 
Specific Requirements (numbered list) 
Example: "Password Standard" 
Minimum 14 characters 
Complexity: uppercase, lowercase, numbers, special characters 
Maximum age: 90 days 
Password history: 24 passwords 
Account lockout: 5 failed attempts 
Scope and Applicability 
Compliance Measurement 
Implementation Timeline 
Exceptions Process 

FR-POL-008: Secure Baselines
Priority: P1Description: Define secure configurations for platforms
Requirements:
Create baseline by platform/technology 
Link to parent standard 
Define configuration parameters (key-value pairs) 
Support multiple formats: Text, JSON, YAML, INI 
Import from external sources (CIS Benchmarks, STIGs, vendor guides) 
Version control 
Tag baselines (technology, environment, criticality) 
Export in machine-readable format 
Assign baselines to assets (via asset management integration) 
Track baseline compliance per asset 
Document deviations with justification 
Exception approval for deviations 
Baseline Examples:
Windows Server 2022 Baseline 
Ubuntu Linux 20.04 Baseline 
AWS Security Baseline 
Cisco IOS Firewall Baseline 
PostgreSQL Database Baseline 
Kubernetes Security Baseline 

FR-POL-009: Guidelines Management
Priority: P2Description: Publish recommended practices
Requirements:
Create guideline documents 
Link to related policies/standards 
Mark as "recommended" vs. "mandatory" 
Categorize by topic/domain 
Rich text editor with attachments 
Publish to guideline repository 
Search and browse 
Track views/downloads 
User feedback/ratings 
Comments section 

FR-POL-010: Exception Management
Priority: P1Description: Handle policy/standard exceptions
Requirements:
Exception request form 
Select policy/standard/control requiring exception 
Business justification (required) 
Propose compensating controls 
Specify exception duration 
Risk assessment 
Attach supporting documentation 
Approval workflow (configurable) 
Approved exceptions tracked with conditions 
Exception expiration tracking 
Alerts before expiration 
Renewal process 
Revocation process 
Exception audit trail 
Exception reports (active exceptions, expired, most frequent) 

5.3 Unified Control Library
FR-UCL-001: Control Library Management
Priority: P0Description: Central repository of security/compliance controls
Requirements:
Create, read, update, delete controls 
Organize by domain (15+ predefined domains) 
Control hierarchy: Domain → Family → Control 
Unique control ID (e.g., UCL-IAM-001) 
Control title and description 
Implementation guidance 
Control type: Preventive, Detective, Corrective, Compensating, Administrative, Technical, Physical 
Version control 
Status: Draft, Active, Deprecated 
Search and filter controls 
Bulk import from frameworks 
Export control library 
Clone controls for customization 
Control Domains (Predefined):
Access Control & Identity Management 
Asset Management (references shared module) 
Cryptography & Encryption 
Data Protection & Privacy 
Network Security 
Application Security 
Endpoint Security 
Vulnerability Management 
Incident Response 
Business Continuity & Disaster Recovery 
Compliance & Audit 
Third-Party Risk Management 
Physical & Environmental Security 
Human Resources Security 
Security Governance 
Control Attributes:
- ID (UUID, unique identifier like UCL-IAM-001)
- Title (text, required)
- Description (rich text, required)
- Implementation Guidance (rich text)
- Control Type (enum)
- Control Domain (reference to domain)
- Control Family (text, subcategory within domain)
- Priority/Risk Level (Critical, High, Medium, Low)
- Implementation Complexity (High, Medium, Low)
- Cost Impact (High, Medium, Low)
- Status (Draft, Active, Deprecated)
- Owner (user reference)
- Target Implementation Date
- Actual Implementation Date
- Implementation Status (Not Implemented, Planned, In Progress, Implemented, Not Applicable)
- Implementation Notes (text)
- Related Controls (array of control IDs) - dependencies, compensating
- Linked Policy Control Objectives (array)
- Linked Standards (array)
- Linked SOPs (array)
- Tags
- Attachments
- Created By, Created At, Updated By, Updated At

FR-UCL-002: Framework Mapping
Priority: P0Description: Map controls to multiple compliance frameworks
Requirements:
Define frameworks (name, version, authority, effective date) 
Structure frameworks hierarchically (domain → category → requirement) 
Import framework structure from templates 
Map controls to framework requirements (many-to-many) 
Specify coverage level: Full, Partial, Not Applicable 
Add mapping notes/context 
View all mappings for a control 
View all controls for a framework requirement 
Generate mapping matrix 
Gap analysis (requirements without controls) 
Coverage analysis (controls satisfying most frameworks) 
Export mappings 
Framework Support (Initial):
NCA ECC (Saudi Arabia) 
NCA CSCC (Saudi Arabia) 
PDPL (Saudi Arabia) 
SAMA CSF (Saudi Arabia) 
ISO/IEC 27001:2022 
NIST Cybersecurity Framework 
NIST SP 800-53 
PCI DSS 4.0 
SOC 2 
GDPR 
CIS Controls v8 
COBIT 2019 
Mapping Matrix Example:
Control: UCL-IAM-002 - Multi-Factor Authentication

Framework           | Requirement ID | Coverage | Notes
--------------------|----------------|----------|------
NCA ECC             | 5-1-2         | Full     | Remote access MFA
ISO 27001:2022      | A.5.17        | Partial  | Part of authentication controls
NIST CSF            | PR.AC-7       | Full     | User authentication via MFA
PCI DSS 4.0         | 8.4           | Full     | MFA for CDE access
SOC 2               | CC6.1         | Full     | Logical access with MFA
SAMA CSF            | 1.3.1         | Full     | Strong authentication
CIS Controls v8     | 6.3           | Full     | MFA for external apps
GDPR                | Art. 32       | Partial  | Technical security measure

FR-UCL-003: Control-to-Asset Mapping
Priority: P0Description: Link controls to assets where implemented
Requirements:
Browse asset inventory from control interface 
Select assets for mapping (single or bulk) 
Filter assets by type, criticality, location, BU 
Link control to assets (many-to-many relationship) 
Implementation date per asset 
Implementation status per asset 
Implementation notes per asset 
Remove mappings 
View all controls for an asset (from asset detail page) 
View all assets for a control (from control detail page) 
Asset compliance calculation based on mapped controls 
Reports: Asset-control matrix, assets by control coverage, unprotected assets 
Business Rules:
Control applicability may be automatic based on asset attributes 
Example: Critical assets require all Critical controls 
Example: Assets processing PII require data protection controls 
Manual override allowed with justification 

FR-UCL-004: Control Assessment Management
Priority: P0Description: Plan and conduct control assessments
Requirements:
Create assessment plan 
Name, description, scope 
Assessment period (start/end dates) 
Assessment type: Implementation, Design Effectiveness, Operating Effectiveness, Compliance 
Select controls to assess 
Assign assessors 
Define assessment procedures 
Set due dates 
Assessment execution 
Assessor views assigned controls 
Reviews control details and procedures 
Collects evidence 
Records findings 
Rates effectiveness (1-5 scale or Pass/Fail) 
Documents observations 
Assessment results 
Result per control: Compliant, Non-Compliant, Partially Compliant, Not Applicable 
Findings with severity (Critical, High, Medium, Low) 
Recommendations 
Assessment approval workflow 
Assessment reports 
Historical assessment tracking 

FR-UCL-005: Evidence Repository
Priority: P1Description: Store and manage control evidence
Requirements:
Upload evidence files (PDF, images, CSV, logs, Excel, Word, etc.) 
Evidence metadata 
Evidence type (Policy, Configuration, Log, Report, Screenshot, Certification, Test Result, etc.) 
Collection date 
Validity period (start/end dates) 
Collector (user) 
Description 
Link evidence to controls (many-to-many) 
Link evidence to assets (for asset-specific evidence) 
Evidence status: Draft, Under Review, Approved, Expired 
Approval workflow for evidence 
Evidence expiration alerts 
Evidence search and filter 
Bulk upload capability 
Access controls (role-based) 
Evidence download 
Evidence version history 
Audit trail 
Export evidence package for auditors 
Evidence Auto-Collection (Future Integration):
Configuration snapshots from assets 
Security scan reports 
Log samples from SIEM 
Vulnerability scan results 
Certificate inventories 

FR-UCL-006: Control Testing
Priority: P1Description: Schedule and execute control tests
Requirements:
Define test procedure for control 
Set test frequency (Weekly, Monthly, Quarterly, Annually, Ad-hoc) 
Assign tester(s) 
Automated test reminders 
Record test execution 
Test date 
Tester 
Test procedure followed 
Test result: Pass, Fail, Not Tested 
Test evidence 
Observations 
Test history per control 
Failed test follow-up (create remediation actions) 
Dashboard: Upcoming tests, overdue tests, test coverage % 
Test summary reports 
Integration with automated testing tools (future) 

FR-UCL-007: Control Effectiveness Monitoring
Priority: P2Description: Track control effectiveness over time
Requirements:
Define Key Control Indicators (KCIs) for controls 
KCI types: Quantitative (metric) or Qualitative (rating) 
Data collection: Manual entry or automated (future) 
Effectiveness score (0-100% or 1-5 rating) 
Historical tracking 
Trend analysis (line charts, bar graphs) 
Alerts when effectiveness drops below threshold 
Root cause analysis documentation 
Corrective action tracking 
Dashboard: Top/bottom performing controls 
Effectiveness reports 
Example KCIs:
MFA Control: % of privileged accounts with MFA enabled 
Patching Control: % of systems patched within SLA 
Training Control: % of users completing annual training 
Backup Control: % of successful backup jobs 

FR-UCL-008: Audit Support
Priority: P1Description: Generate audit-ready packages
Requirements:
Select framework(s) and scope for audit 
System gathers relevant controls, evidence, assessments 
Generate control matrix showing: 
Framework requirements 
Mapped controls 
Implementation status 
Assessment results 
Evidence references 
Organize evidence by framework requirement 
Include control descriptions, test results, implementation documentation 
Package as organized folder structure 
Export as ZIP file 
Include table of contents and executive summary 
Track what was provided to auditors (audit trail) 
Version control for audit packages 
Auditor portal (optional): Read-only access to evidence 

5.4 Standard Operating Procedures (SOPs)
FR-SOP-001: SOP Document Management
Priority: P0Description: Create and manage operational procedures
Requirements:
SOP creation using templates 
SOP categories: Operational, Security, Compliance, Third-Party 
SOP structure (standardized): 
Header (ID, title, version, dates, owner, status) 
Purpose 
Scope 
Related Documents (policies, standards, controls) 
Roles and Responsibilities (RACI matrix) 
Prerequisites (access, tools, training, approvals) 
Procedure Steps (numbered, detailed) 
Decision Points (flowcharts) 
Exceptions and Escalations 
Quality Checks 
Records and Documentation 
Metrics 
Revision History 
Rich text editor with images, tables, embedded diagrams 
Link SOPs to policies, standards, controls 
Version control 
Status workflow: Draft → Review → Approved → Published → Archived 
Approval workflow 
Search and browse SOPs 
Download as PDF 
Print-friendly format 
SOP Types (Examples):
User Provisioning Procedure 
Password Reset Procedure 
Backup and Restore Procedure 
Patch Deployment Procedure 
Incident Response Procedure 
Vulnerability Remediation Procedure 
Access Review Procedure 
Vendor Assessment Procedure 

FR-SOP-002: SOP Execution Tracking
Priority: P1Description: Record SOP executions
Requirements:
Record execution: who, when, which SOP 
Execution outcome: Successful, Failed, Partially Completed 
Execution time (start/end) 
Link to ticket/request (optional) 
Document deviations from procedure 
Capture quality check results 
Attach execution evidence 
Exception documentation 
View execution history per SOP 
Execution metrics: Count, average time, success rate 
Dashboard showing execution statistics 
Reports: Most executed SOPs, failed executions, execution trends 

FR-SOP-003: SOP Training and Acknowledgment
Priority: P1Description: Ensure staff competency in procedures
Requirements:
Assign SOPs to roles or individuals 
Training notification to assignees 
Users view SOP 
Optional quiz/assessment 
Acknowledgment button 
Capture acknowledgment date 
Track completion status 
Automated reminders for unacknowledged SOPs 
Training expiration (e.g., annual renewal) 
Re-training upon SOP update 
Training completion reports 
Export training records 

FR-SOP-004: SOP Review and Maintenance
Priority: P1Description: Keep SOPs current
Requirements:
Set review frequency 
Automated review reminders 
Dashboard showing SOPs due for review 
Review workflow 
Document review outcome 
Version comparison 
Stakeholder notification of updates 
Retirement/archiving process 
Audit trail 

FR-SOP-005: SOP-Control Linkage
Priority: P1Description: Link SOPs to controls
Requirements:
Link SOP to control(s) 
Specify linkage type: Implementation, Testing, Monitoring, Remediation 
View SOPs from control detail page 
View controls from SOP detail page 
Report: Controls with/without SOPs 
Gap identification (controls missing operational procedures) 

FR-SOP-006: SOP Feedback and Performance
Priority: P2Description: Collect user feedback and metrics
Requirements:
Feedback form on SOP 
Rating system (1-5 stars) 
Comment field 
Anonymous or identified feedback 
Feedback routed to SOP owner 
Average rating per SOP 
Performance metrics: 
Average execution time 
Success/failure rate 
Number of deviations 
User satisfaction scores 
Trend analysis 
Dashboard: Top/bottom performing SOPs 
Performance reports 

5.5 Traceability and Relationships
FR-TRC-001: Traceability Matrix
Priority: P1Description: Visualize end-to-end governance traceability
Requirements:
Generate traceability report showing: 
Influencer → Policy → Control Objective → Standard → Control → Asset → SOP 
Select scope: All, specific framework, specific domain 
Identify complete chains (green) vs. gaps (red) 
Drill-down capability (click any item for details) 
Filter by business unit, criticality, status 
Export to Excel, PDF 
Visual diagram (tree or flow) 
Identify orphaned items (not connected) 
Use Cases:
Demonstrate to auditor how regulation is addressed 
Identify gaps in governance coverage 
Impact analysis for changes 
Compliance reporting 

FR-TRC-002: Dependency Management
Priority: P2Description: Define and track control dependencies
Requirements:
Define relationship types between controls: 
Depends On (A requires B to be implemented first) 
Compensates For (A compensates if B fails) 
Supports (A enhances B) 
Related To (A and B are related) 
Bidirectional relationships 
View dependency graph 
Identify control chains 
Warning when modifying controls with dependencies 
Impact analysis 
Export dependency map 

FR-TRC-003: Impact Analysis
Priority: P1Description: Assess impact of changes
Requirements:
Select policy, standard, control, or influencer 
System shows downstream impact: 
Policies affected 
Controls affected 
Assets affected 
SOPs affected 
Active assessments impacted 
Stakeholder list (owners of affected items) 
Impact radius visualization 
Export impact analysis report 
Change assessment workflow triggered 
Notification to stakeholders 

5.6 Reporting and Analytics
FR-RPT-001: Governance Dashboard
Priority: P0Description: Executive overview of governance posture
Widgets:
Summary Cards 
Total active influencers 
Total policies (by status) 
Control implementation rate (% implemented) 
Assessment completion rate 
Open findings count 
Charts 
Controls by domain (pie chart) 
Control implementation status (stacked bar) 
Framework compliance scores (bar chart) 
Policy compliance trends (line chart) 
Assessment results distribution (pie chart) 
Recent Activities Feed 
Recent policy publications 
Recent assessment completions 
Recent findings 
Recent regulatory changes 
Upcoming Items 
Policies due for review 
Assessments due 
Evidence expiring 
Exceptions expiring 
Risk Areas 
Controls with low effectiveness 
Unaddressed findings 
Overdue remediations 
Assets without required controls 
Interactions:
Customizable layout (drag-drop widgets) 
Date range filter 
Business unit filter 
Drill-down from any widget 
Export dashboard to PDF 
Scheduled email delivery 

FR-RPT-002: Framework Compliance Scorecard
Priority: P0Description: Compliance status by framework
Requirements:
Select framework(s) 
Overall compliance percentage 
Breakdown by domain/category 
Requirement status: Met, Not Met, Partially Met, Not Applicable 
Control implementation status for each requirement 
Latest assessment results 
Gap summary 
Trend comparison (current vs. previous period) 
Color-coded status indicators 
Export to Excel/PDF 
Executive summary format 
Compliance Calculation:
Compliance % = (Requirements Met + 0.5 × Requirements Partially Met) / Total Applicable Requirements × 100

FR-RPT-003: Policy Compliance Report
Priority: P1Description: Policy program health
Report Sections:
Policy inventory (total by status, type) 
Policies due for review (list with due dates) 
Policy acknowledgment rates (by policy, by BU) 
Active policy exceptions (count, most frequent) 
Policies without linked controls (gaps) 
Policy age distribution (histogram) 
Most/least acknowledged policies 
Policy publication history (timeline) 
Filters: Business unit, policy type, status, date rangeExport: Excel, PDF

FR-RPT-004: Control Implementation Report
Priority: P1Description: Control program maturity
Report Sections:
Controls by implementation status 
Implementation timeline (Gantt chart) 
Controls by domain and priority 
Overdue controls (list) 
Implementation rate by business unit 
Resource allocation (controls by owner) 
Trend analysis (implementation over time) 
Top/bottom domains by implementation 
Filters: Domain, priority, business unit, statusExport: Excel, PDF, PowerPoint

FR-RPT-005: Assessment Results Report
Priority: P1Description: Assessment findings and effectiveness
Report Sections:
Assessment summary (total, completion %, avg. duration) 
Results distribution (compliant, non-compliant, partial, N/A) 
Findings by severity (critical, high, medium, low) 
Remediation status (open, in progress, closed) 
Pass/fail trends over time 
Top failing controls 
Controls with repeat findings 
Assessment coverage (% of controls assessed) 
Filters: Assessment type, framework, domain, assessor, date rangeExport: Excel, PDF

FR-RPT-006: Executive Governance Report
Priority: P1Description: Board/executive summary
Report Structure:
Executive Summary (1 page) 
Overall governance score 
Compliance posture (framework statuses) 
Key achievements (period highlights) 
Top risks and issues 
Upcoming regulatory changes 
Resource requirements 
Recommendations 
Supporting Details 
Compliance scorecard 
Implementation progress 
Assessment results 
Audit findings status 
Upcoming audits 
Budget and resources 
Format: Board-ready, visual, high-levelExport: PDF, PowerPointSchedule: Quarterly automated generation

FR-RPT-007: Audit Findings Tracker
Priority: P1Description: Manage audit findings to closure
Requirements:
Record findings (date, auditor, description, severity, affected control) 
Assign remediation owner 
Set due date 
Track status: Open, In Progress, Closed, Risk Accepted 
Document remediation actions 
Attach remediation evidence 
Retest validation 
Overdue findings alerts 
Findings aging report 
Dashboard: Open findings by severity, overdue findings, remediation trends 
Export to Excel/PDF 

FR-RPT-008: Gap Analysis Report
Priority: P1Description: Identify governance gaps
Analysis Types:
Framework Gap Analysis 
Framework requirements without mapped controls 
Prioritized by risk 
Control Gap Analysis 
Control objectives without implementing controls 
Standards without baselines 
Controls without SOPs 
Asset Gap Analysis 
Assets without required controls 
Critical assets with missing controls 
Evidence Gap Analysis 
Controls without evidence 
Expired evidence 
Assessment Gap Analysis 
Controls not assessed within required timeframe 
Report Outputs:
Gap summary by type 
Detailed gap list with remediation recommendations 
Prioritization matrix 
Remediation plan template 
Export to Excel/PDF 

FR-RPT-009: Custom Report Builder
Priority: P2Description: Ad-hoc reporting capability
Requirements:
Select data source (influencers, policies, controls, assessments, etc.) 
Select fields to include 
Apply filters 
Group by fields 
Add calculations (count, sum, avg, %, etc.) 
Preview report 
Save report template 
Schedule report generation 
Share templates with team 
Export to Excel/PDF/CSV 

FR-RPT-010: Scheduled Reporting
Priority: P2Description: Automated report generation and distribution
Requirements:
Select report type 
Configure parameters (filters, date ranges) 
Set schedule (daily, weekly, monthly, quarterly) 
Define recipient list 
Email delivery with attachment 
Dashboard delivery option 
Report generation history 
Success/failure notifications 
Enable/disable schedules 
Edit schedules 
Audit trail 

5.7 Notifications and Alerts
FR-NOT-001: Policy Review Reminders
Priority: P1Description: Alert policy owners of upcoming reviews
Requirements:
Automated reminders: 90, 60, 30, 7 days before due date 
Email and in-app notifications 
Reminder content: Policy name, version, due date, link to policy 
Escalation to manager if overdue (configurable threshold) 
Dashboard widget: My pending reviews 
Snooze option with justification 

FR-NOT-002: Assessment Due Alerts
Priority: P1Description: Notify assessors of pending assessments
Requirements:
Alerts when assessment approaches due date 
Escalation if overdue 
Shows assessment name, assigned controls, due date 
Link to assessment workspace 
Dashboard: Overdue assessments 
Manager visibility 

FR-NOT-003: Exception Expiration Alerts
Priority: P1Description: Track expiring exceptions
Requirements:
Notifications: 30, 14, 7 days before expiration 
Alert on expiration day 
Shows exception details, compensating controls, expiration date 
Link to exception for renewal or closure 
Report: Expiring exceptions 
Dashboard widget 

FR-NOT-004: Evidence Expiration Alerts
Priority: P1Description: Ensure current evidence
Requirements:
Alert when evidence validity period ending 
Shows control, evidence type, expiration date 
Link to upload new evidence 
Dashboard: Expiring evidence 
Bulk evidence refresh workflow 

FR-NOT-005: Regulatory Change Notifications
Priority: P1Description: Alert compliance team of influencer updates
Requirements:
Notification when influencer updated 
Shows what changed 
Link to influencer and impacted policies/controls 
Trigger impact assessment workflow 
Dashboard: Recent regulatory changes 
Subscribe/unsubscribe to specific frameworks 

FR-NOT-006: Finding Remediation Reminders
Priority: P1Description: Track remediation progress
Requirements:
Alerts when remediation due date approaches 
Escalation if overdue 
Shows finding details, severity, due date 
Link to finding 
Dashboard: My open findings 
Manager visibility 

FR-NOT-007: Acknowledgment Reminders
Priority: P1Description: Ensure policy acknowledgments
Requirements:
Reminders for unacknowledged policies (configurable intervals) 
Escalation after repeated reminders 
Shows policy list and due dates 
Link to policy for acknowledgment 
Dashboard: Pending acknowledgments 

5.8 Administration and Configuration
FR-ADM-001: Framework Configuration
Priority: P1Description: Manage compliance frameworks
Requirements:
Add/edit/delete frameworks 
Framework attributes: Name, version, authority, effective date, URL 
Import framework structure from templates 
Define framework hierarchy (domain → category → requirement) 
Framework status: Active, Draft, Deprecated 
Version control 
Export framework structure 
Audit trail 
Pre-Configured Frameworks (Import Templates):
NCA ECC 
NCA CSCC 
PDPL 
SAMA CSF 
ISO/IEC 27001:2022 
NIST CSF 
NIST SP 800-53 
PCI DSS 4.0 
SOC 2 
GDPR 
CIS Controls v8 

FR-ADM-002: Control Domain Configuration
Priority: P1Description: Customize control organization
Requirements:
Add/edit/delete control domains 
Define domain hierarchy 
Assign domain owners 
Reorder domains 
Color coding 
Domain status: Active, Inactive 
Move controls between domains 
Audit trail 

FR-ADM-003: Workflow Configuration
Priority: P1Description: Define approval workflows
Requirements:
Create workflow templates 
Define workflow steps 
Assign approvers (by role or individual) 
Sequential or parallel approval 
Conditional routing 
Auto-escalation rules 
Test workflow 
Apply workflow to document types 
Audit trail 

FR-ADM-004: Role and Permission Management
Priority: P0Description: Control user access
Roles (Predefined):
Governance Administrator (full access) 
Compliance Officer (manage influencers, policies, controls, assessments) 
Policy Manager (manage policies, standards, SOPs) 
Control Owner (view controls, update status, upload evidence) 
Assessor (conduct assessments, manage findings) 
Auditor (read-only access to evidence and reports) 
Business Unit Manager (view applicable policies, request exceptions) 
Executive (view dashboards and reports) 
Viewer (read-only access) 
Requirements:
Create custom roles 
Define permissions by module and action (create, read, update, delete) 
Granular permissions (e.g., can create policy but not publish) 
Row-level security (access by business unit) 
Permission inheritance 
Bulk user-role assignment 
Test permissions 
Audit trail 
Shared with Asset Management Module:
User table (same users across modules) 
Role table (roles apply to both modules) 
Business unit table (shared organizational structure) 

FR-ADM-005: Notification Configuration
Priority: P1Description: Configure alerts and reminders
Requirements:
Define notification triggers 
Configure reminder intervals 
Define recipient rules 
Email template customization 
In-app notification settings 
Escalation rules 
Notification digest options 
Test notifications 
User preferences (opt-in/out) 
Notification audit log 

FR-ADM-006: System Audit Log
Priority: P1Description: Comprehensive activity logging
Requirements:
Log all CRUD operations 
Log authentication events 
Log permission changes 
Log exports and report generation 
Filter logs: User, action, entity, date range 
Search within logs 
Export logs to CSV 
Immutable records 
Retention per policy (7+ years) 
Dashboard: Audit statistics 
Shared Audit Log:
Single audit log table for both Asset Management and Governance modules 
Entity type field distinguishes module 

FR-ADM-007: Data Import/Export
Priority: P1Description: Bulk data management
Requirements:
Template downloads for each entity type 
Import from CSV/Excel 
Field mapping interface 
Data validation 
Preview and confirm 
Import history 
Export any entity type 
Bulk export with filters 
Schedule automated exports 
API endpoints for integration 

FR-ADM-008: Document Template Management
Priority: P2Description: Standardize document formats
Requirements:
Create templates for policies, standards, SOPs, reports 
Rich text editor 
Define sections and fields 
Dynamic placeholders 
Preview templates 
Set default templates 
Version control 
Share templates 
Template library 
Import/export templates 

6. Non-Functional Requirements
6.1 Performance
NFR-P-001: Page load time ≤ 2 seconds for standard queriesNFR-P-002: Search results return within 1 second for datasets up to 10,000 recordsNFR-P-003: Support 100 concurrent users without degradationNFR-P-004: Bulk import: Process 1,000 records in under 60 secondsNFR-P-005: Report generation: Complete within 30 seconds for standard reportsNFR-P-006: API response time ≤ 500ms for standard requestsNFR-P-007: Dashboard refresh ≤ 3 seconds
6.2 Scalability
NFR-S-001: Support 10,000+ controls in unified libraryNFR-S-002: Support 50+ frameworks with full mappingNFR-S-003: Support 1,000+ policies and 5,000+ standardsNFR-S-004: Support 100,000+ evidence filesNFR-S-005: Database horizontally scalableNFR-S-006: Support organizational growth to 10,000+ users
6.3 Security
NFR-SEC-001: All data transmission via TLS 1.3NFR-SEC-002: Passwords hashed using bcrypt (cost factor 12)NFR-SEC-003: API keys encrypted at rest (AES-256)NFR-SEC-004: SQL injection prevention via parameterized queries/ORMNFR-SEC-005: XSS prevention via input sanitization and output encodingNFR-SEC-006: CSRF protection via tokensNFR-SEC-007: Principle of least privilege enforcedNFR-SEC-008: Sensitive data encrypted at rest (AES-256)NFR-SEC-009: Session timeout: 30 minutes inactivity, 8 hours maximumNFR-SEC-010: MFA support for privileged accountsNFR-SEC-011: Audit logging immutable and tamper-evident
6.4 Availability
NFR-A-001: System uptime 99.5% during business hoursNFR-A-002: Planned maintenance communicated 48 hours advanceNFR-A-003: Database backup every 24 hoursNFR-A-004: Recovery Time Objective (RTO): 4 hoursNFR-A-005: Recovery Point Objective (RPO): 24 hoursNFR-A-006: Disaster recovery plan tested annually
6.5 Usability
NFR-U-001: Accessible via modern browsers (Chrome, Firefox, Edge, Safari) - latest 2 versionsNFR-U-002: Responsive design for desktop and tablet (1024px+ width)NFR-U-003: WCAG 2.1 Level AA complianceNFR-U-004: New users complete basic tasks within 15 minutes of trainingNFR-U-005: Contextual help and tooltips availableNFR-U-006: Consistent UI/UX with Asset Management ModuleNFR-U-007: Maximum 3 clicks to reach any featureNFR-U-008: Form validation with clear error messagesNFR-U-009: Progress indicators for long operations
6.6 Maintainability
NFR-M-001: Code follows organizational coding standardsNFR-M-002: Automated unit test coverage ≥ 80%NFR-M-003: API documentation (OpenAPI/Swagger)NFR-M-004: Database schema version controlled (migrations)NFR-M-005: Error logging with stack tracesNFR-M-006: Monitoring and alerting for critical servicesNFR-M-007: Code review required before mergeNFR-M-008: Technical documentation maintained
6.7 Compatibility
NFR-C-001: Compatible with PostgreSQL 14+NFR-C-002: RESTful API following OpenAPI 3.0 specificationNFR-C-003: Export formats: CSV, Excel (.xlsx), PDFNFR-C-004: Import formats: CSV, Excel (.xlsx, .xls)NFR-C-005: SSO integration: SAML 2.0, OAuth 2.0, LDAPNFR-C-006: Integration with Asset Management Module via shared database
6.8 Data Integrity
NFR-D-001: Referential integrity enforced at database levelNFR-D-002: Transaction support for critical operationsNFR-D-003: Soft delete for audit trail preservationNFR-D-004: Data validation at application and database levelsNFR-D-005: Backup integrity verificationNFR-D-006: Data retention: 7 years minimum for audit records
6.9 Compliance
NFR-COM-001: Support data retention policies (configurable)NFR-COM-002: Support data deletion per GDPR/privacy requirementsNFR-COM-003: Data export for portability (GDPR Article 20)NFR-COM-004: Audit trail meets regulatory requirementsNFR-COM-005: Evidence repository supports legal hold

7. User Interface Requirements
7.1 Navigation Structure
Top Navigation Bar
├── Logo (home link)
├── Global Search
├── Notifications (bell icon with badge)
├── User Menu (avatar)
    ├── Profile
    ├── Settings
    ├── Help
    └── Logout

Left Sidebar
├── Dashboard
├── Governance
│   ├── Influencers
│   ├── Policies
│   ├── Standards
│   ├── Baselines
│   ├── Guidelines
│   └── Exceptions
├── Controls
│   ├── Control Library
│   ├── Frameworks
│   ├── Assessments
│   ├── Evidence
│   └── Testing
├── Procedures
│   ├── SOPs
│   ├── Execution Log
│   └── Training
├── Assets (link to Asset Management Module)
├── Reports
│   ├── Dashboards
│   ├── Compliance
│   ├── Assessments
│   ├── Audit Support
│   └── Custom Reports
└── Administration
    ├── Users & Roles
    ├── Frameworks
    ├── Workflows
    ├── Notifications
    └── System Logs
7.2 Key Screen Layouts
7.2.1 Governance Dashboard
Layout: Full-width, widget-basedSections:
Header: Date range selector, refresh button, export button 
Summary Cards Row (4 cards): Influencers, Policies, Controls, Assessments 
Charts Row 1: Controls by Domain (pie), Implementation Status (stacked bar) 
Charts Row 2: Framework Compliance (bar chart), Assessment Trends (line) 
Activity Feed Column (right side): Recent activities, upcoming tasks 
Bottom Row: Risk areas, pending approvals 
Interactions:
Drag-drop widgets to customize 
Click widget to drill down 
Filter by business unit 
Export as PDF 

7.2.2 Influencer List View
Layout: Table with filtersColumns: Name, Category, Sub-category, Authority, Status, Applicability, Next Review, ActionsFilters Panel (left or collapsible):
Category (checkboxes) 
Status (checkboxes) 
Applicability (checkboxes) 
Authority (dropdown) 
Tags (multi-select) 
Date range (publication/effective) 
Actions:
Search bar (top) 
Add Influencer button (top right) 
Bulk actions (after selection): Tag, Change Status, Export 
Row actions: View, Edit, Delete, Assess Applicability 
Pagination (bottom) 
Export button (top right) 

7.2.3 Policy Editor
Layout: Full-width editor with sidebarLeft Sidebar (30% width):
Policy metadata form 
Title 
Policy Type 
Owner 
Business Units 
Status 
Review Frequency 
Linked Influencers (multi-select) 
Tags 
Control Objectives panel 
Add Control Objective button 
List of objectives (reorderable) 
Attachments panel 
Version history panel 
Main Area (70% width):
Rich text editor for policy content 
Toolbar: Format, Insert (image, table, link), Save, Preview 
Top Bar:
Save Draft button 
Submit for Approval button 
Publish button (if approved) 
Preview button 
Version dropdown 

7.2.4 Unified Control Library View
Layout: Split viewLeft Panel (30%): Control tree
Organized by domain 
Expandable/collapsible 
Search within tree 
Filter by status, priority 
Main Panel (70%): Control details (when selected)
Tabs: 
Overview (description, guidance, type, priority, status, owner) 
Framework Mappings (table of frameworks and requirements) 
Linked Assets (list with compliance status) 
Assessments (history and results) 
Evidence (list of attached evidence) 
Testing (schedule and results) 
Related Controls (dependencies) 
Audit Trail (change history) 
Action buttons: Edit, Assess, Add Evidence, Link Assets, Map Framework 
Top Bar:
Add Control button 
Import Controls button 
Export Library button 
View Mode toggle (Tree vs. Table) 

7.2.5 Control Assessment Workspace
Layout: Wizard/stepper interfaceSteps:
Assessment Setup 
Name, description, type, period 
Select controls (tree view with checkboxes) 
Assign assessors 
Set due dates 
Assessment Execution (for assessor) 
List of assigned controls 
For each control: 
Control details (collapsible) 
Assessment procedure 
Evidence collection (upload files) 
Result selection (Compliant, Non-Compliant, Partial, N/A) 
Findings documentation (if non-compliant) 
Effectiveness rating (1-5) 
Notes 
Save progress, Submit 
Review and Approval 
Assessment summary 
Results overview 
Findings list 
Approve/Request Changes/Reject 
Completion 
Generate report 
Create remediation actions 
Archive assessment 
Progress Indicator: Shows completion percentage, controls assessed vs. total

7.2.6 Framework Compliance Scorecard
Layout: Report layout with drill-downHeader:
Framework selector (dropdown, multi-select) 
Date range 
Export buttons (PDF, Excel) 
Summary Section:
Overall compliance percentage (large, color-coded) 
Comparison to previous period 
Gauge chart 
Breakdown Section:
Table: Domain | Requirements | Met | Partially Met | Not Met | N/A | Compliance % 
Color coding: Green (>90%), Yellow (70-90%), Red (<70%) 
Click row to drill down to requirements 
Drill-Down:
Shows specific requirements 
For each requirement: 
Requirement text 
Mapped control(s) 
Implementation status 
Latest assessment result 
Evidence link 
Click control to view details 

7.2.7 SOP Document View
Layout: Document reader with sidebarMain Area:
SOP content (rendered with formatting) 
Table of contents (top, jump links) 
Step numbers highlighted 
Embedded images/diagrams 
Right Sidebar:
SOP metadata (owner, version, dates, status) 
Related documents (links to policies, standards, controls) 
Actions 
Edit (if owner) 
Acknowledge (if assigned) 
Download PDF 
Log Execution 
Provide Feedback 
Version history 
Execution history (recent) 

7.3 UI/UX Principles
Consistency:
Match Asset Management Module design language 
Consistent color scheme, typography, iconography 
Standard button styles and placement 
Uniform form layouts 
Clarity:
Clear labeling and instructions 
Contextual help (? icons with tooltips) 
Breadcrumb navigation 
Progress indicators for multi-step processes 
Efficiency:
Keyboard shortcuts for power users 
Bulk actions where appropriate 
Saved filters and searches 
Recent items quick access 
Auto-save for long forms 
Feedback:
Loading indicators for all async operations 
Success/error messages with clear actions 
Confirmation dialogs for destructive actions 
Progress notifications for background tasks 
Accessibility:
Keyboard navigation support 
Screen reader compatible 
High contrast mode 
Resizable text 
ARIA labels 

8. Technical Architecture
8.1 System Architecture
┌─────────────────────────────────────────────────────────────┐
│                     Presentation Layer                      │
├─────────────────────────────────────────────────────────────┤
│  Web Application (React/Vue.js)                             │
│  - Governance UI Components                                  │
│  - Asset Management UI Components (existing)                │
│  - Shared Components (Navigation, Auth, etc.)               │
└─────────────────────────────────────────────────────────────┘
                            ↓ HTTPS/REST
┌─────────────────────────────────────────────────────────────┐
│                    Application Layer                        │
├─────────────────────────────────────────────────────────────┤
│  API Gateway / Reverse Proxy (Nginx)                        │
│  - Authentication & Authorization                            │
│  - Rate Limiting                                            │
│  - Request Routing                                          │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                     Business Logic Layer                    │
├───────────────────────────┬─────────────────────────────────┤
│  Governance Services      │   Asset Management Services     │
│  - Influencer Service     │   - Physical Asset Service      │
│  - Policy Service         │   - Application Service         │
│  - Control Service        │   - Software Service            │
│  - Assessment Service     │   - Supplier Service            │
│  - Evidence Service       │   - Information Asset Service   │
│  - SOP Service            │                                 │
│  - Reporting Service      │                                 │
├───────────────────────────┴─────────────────────────────────┤
│                  Shared Services                            │
│  - Authentication Service                                   │
│  - Authorization Service (RBAC)                            │
│  - Notification Service                                     │
│  - Audit Logging Service                                    │
│  - File Storage Service                                     │
│  - Search Service                                           │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                      Data Layer                             │
├─────────────────────────────────────────────────────────────┤
│              PostgreSQL Database (Unified)                  │
│  - Governance Schema                                        │
│  - Asset Management Schema (existing)                       │
│  - Shared Schema (users, roles, business_units, audit)     │
├─────────────────────────────────────────────────────────────┤
│              File Storage (S3 or compatible)                │
│  - Evidence files                                           │
│  - Policy documents                                         │
│  - Attachments                                              │
└─────────────────────────────────────────────────────────

### 8.2 Technology Stack

**Frontend**:
- Framework: React 18+ or Vue.js 3+
- UI Library: Material-UI, Ant Design, or Chakra UI (match Asset Management)
- State Management: Redux Toolkit or Zustand
- Routing: React Router or Vue Router
- Forms: React Hook Form or Formik
- Rich Text Editor: TinyMCE, CKEditor, or Quill
- Charts: Recharts, Chart.js, or Apache ECharts
- HTTP Client: Axios
- Build Tool: Vite or Webpack

**Backend**:
- Framework: Node.js (Express/Nest.js) or Python (FastAPI/Django)
- API Style: RESTful
- Authentication: JWT, OAuth 2.0, SAML 2.0
- ORM: Sequelize (Node.js), TypeORM (Node.js), or SQLAlchemy (Python)
- Validation: Joi, Yup, or Pydantic
- Job Queue: Bull (Redis-based) for background tasks

**Database**:
- Primary: PostgreSQL 14+ (shared with Asset Management)
- Cache: Redis (optional, for sessions and performance)
- Search: PostgreSQL full-text search or Elasticsearch (optional)

**File Storage**:
- Local filesystem or S3-compatible object storage (MinIO, AWS S3)

**Infrastructure**:
- Containerization: Docker
- Orchestration: Docker Compose or Kubernetes
- Reverse Proxy: Nginx
- CI/CD: GitHub Actions, GitLab CI, or Jenkins
- Monitoring: Prometheus + Grafana (optional)
- Logging: ELK Stack or similar (optional)

### 8.3 Integration Points

**Shared Components** (with Asset Management Module):
1. **Database Tables**:
   - `users`
   - `roles`
   - `business_units`
   - `audit_logs`
   - `tags`
   - `notifications`

2. **Services**:
   - Authentication Service
   - Authorization Service
   - Notification Service
   - Audit Logging Service
   - File Storage Service

3. **UI Components**:
   - Navigation
   - User menu
   - Notification center
   - Search bar
   - Modal dialogs
   - Form components

**Cross-Module References**:
- Governance controls → Asset Management assets (many-to-many)
- Governance baselines → Asset Management assets (baseline assignment)
- Governance evidence → Asset Management assets (asset-specific evidence)
- Unified tagging system

**API Integration**:
- Governance API can call Asset Management API and vice versa
- Shared API gateway handles routing
- Consistent error handling and response formats

---

## 9. Database Schema

*See separate Database Schema document below*

---

## 10. Implementation Roadmap

### Phase 1: Foundation (Months 1-3)
**Goal**: Core governance framework operational

**Features**:
- Influencer registry
- Policy management (create, approve, publish, acknowledge)
- Basic control library (100-200 controls)
- Framework configuration
- User management integration (reuse Asset Management)
- Basic reporting (dashboard, policy reports)

**Deliverables**:
- Working influencer database
- Policy creation and approval workflow
- Initial control library with 3-5 framework mappings
- User training materials
- Unit and integration tests
- API documentation

**Success Criteria**:
- 50+ influencers documented
- 20+ policies created and approved
- 100+ controls in library
- User satisfaction > 7/10

---

### Phase 2: Control Framework (Months 4-6)
**Goal**: Unified control library with multi-framework mapping

**Features**:
- Complete control library (500+ controls)
- Framework mapping (10+ frameworks)
- Control assessment module
- Evidence repository
- Standards and baselines management
- Control-to-asset integration
- Advanced reporting (compliance scorecards, gap analysis)

**Deliverables**:
- Full control library with mappings
- Assessment workflow operational
- Evidence management system
- Asset-control linking functional
- Coverage and gap analysis reports
- Integration tests with Asset Management

**Success Criteria**:
- 500+ controls with average 5+ framework mappings
- 2+ frameworks fully mapped
- 90% of critical assets linked to controls
- Audit package generated in < 2 hours

---

### Phase 3: Operations and SOPs (Months 7-9)
**Goal**: Operational procedures and continuous monitoring

**Features**:
- SOP management
- Control testing and scheduling
- Exception management
- Traceability matrix
- Audit support features
- Advanced analytics and dashboards
- Notification system
- Mobile-responsive UI

**Deliverables**:
- SOP repository with 50+ procedures
- Testing scheduler operational
- Traceability reports
- Executive dashboards
- Notification engine
- Mobile-optimized views

**Success Criteria**:
- 50+ SOPs documented
- 80% of controls tested within cycle
- Complete traceability demonstrated
- Audit preparation time reduced by 50%

---

### Phase 4: Optimization (Months 10-12)
**Goal**: Automation and advanced capabilities

**Features**:
- Automated evidence collection (integration with security tools)
- AI-powered gap analysis
- Predictive compliance analytics
- Advanced workflow automation
- Third-party integrations (SIEM, vulnerability scanners)
- Custom report builder
- API for external integrations

**Deliverables**:
- Automated evidence collection from 3+ tools
- Predictive compliance reports
- Custom report builder
- Integration connectors
- API expansion
- Performance optimization

**Success Criteria**:
- 30% of evidence auto-collected
- Compliance prediction accuracy > 85%
- API adoption by 2+ consumers
- Page load time < 1 second

---

## 11. Success Metrics and KPIs

### 11.1 Adoption Metrics
- **User Adoption**: 90% of target users actively using within 3 months
- **Feature Utilization**: 70% of features used monthly
- **Login Frequency**: 80% of users login weekly
- **Training Completion**: 95% of users complete training within 1 month

### 11.2 Operational Metrics
- **Policy Compliance**: 95% policy acknowledgment rate
- **Control Implementation**: 85% of controls implemented within 12 months
- **Assessment Completion**: 90% of controls assessed annually
- **Evidence Currency**: 95% of evidence current (not expired)
- **SOP Execution**: 80% of SOPs executed per procedure
- **Exception Rate**: < 5% of policies have active exceptions

### 11.3 Efficiency Metrics
- **Audit Prep Time**: 50% reduction (baseline vs. post-implementation)
- **Assessment Time**: 40% reduction per control assessment
- **Evidence Collection Time**: 60% reduction with automation
- **Report Generation Time**: < 2 hours for any audit package
- **Duplicate Effort Reduction**: 70% reduction via unified controls

### 11.4 Quality Metrics
- **Control Effectiveness**: Average effectiveness score > 4/5
- **Assessment Findings**: < 10% critical findings
- **Remediation Rate**: 90% of findings closed within SLA
- **Data Completeness**: 95% of required fields populated
- **Framework Coverage**: 100% of applicable requirements mapped

### 11.5 Business Metrics
- **Audit Pass Rate**: 100% of external audits passed
- **Compliance Cost**: 30% reduction in compliance costs
- **Regulatory Response Time**: 50% faster response to new regulations
- **Risk Reduction**: 40% reduction in compliance-related risks
- **Customer Confidence**: 20% increase in customer security questionnaire scores

### 11.6 Technical Metrics
- **System Availability**: 99.5% uptime
- **Page Load Time**: < 2 seconds for 95% of requests
- **API Response Time**: < 500ms for 95% of requests
- **Error Rate**: < 0.1% of transactions
- **Data Accuracy**: 99.9% data integrity

### 11.7 User Satisfaction Metrics
- **NPS Score**: > 40
- **User Satisfaction**: > 8/10
- **Support Tickets**: < 5 per 100 users per month
- **Feature Requests Implemented**: > 30% quarterly

---

## 12. Risks and Mitigation

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| **Data migration issues** from existing systems | Medium | High | Phased migration, extensive testing, rollback plan |
| **User adoption resistance** | Medium | High | Change management, training, executive sponsorship, phased rollout |
| **Integration complexity** with Asset Management | Medium | High | Clear API contracts, integration testing, incremental integration |
| **Control library development** takes longer than expected | High | Medium | Start with framework import, leverage existing standards (CIS, NIST) |
| **Performance issues** with large datasets | Medium | Medium | Database optimization, caching, pagination, load testing |
| **Scope creep** from stakeholder requests | High | Medium | Strict change control, prioritization framework, phase planning |
| **Regulatory changes** during development | Medium | Low | Agile approach, regular reviews, flexible architecture |
| **Security vulnerabilities** | Low | High | Security code review, penetration testing, regular updates |
| **Resource availability** (SMEs, developers) | Medium | High | Resource planning, cross-training, vendor support |
| **Vendor dependencies** (e.g., framework templates) | Low | Medium | In-house capability, multiple vendors, open-source options |

---

## 13. Acceptance Criteria

### 13.1 Functional Acceptance
- All P0 user stories implemented and tested
- All required modules operational
- Integration with Asset Management functional
- All core workflows tested (policy approval, control assessment, audit package generation)
- 100+ controls in library with framework mappings
- Evidence repository operational with upload/download
- Dashboard displaying real-time data
- Reports generating correctly

### 13.2 Non-Functional Acceptance
- Performance targets met (page load < 2s, API < 500ms)
- Security testing passed (no critical vulnerabilities)
- Accessibility WCAG 2.1 AA compliance verified
- Browser compatibility verified (Chrome, Firefox, Edge, Safari)
- Data backup and restore tested
- Disaster recovery plan documented and tested
- Load testing passed (100 concurrent users)

### 13.3 User Acceptance
- UAT completed by 10+ users from different roles
- 90% of UAT test cases passed
- User satisfaction score > 7/10
- All critical feedback addressed
- Training materials reviewed and approved
- Documentation complete and reviewed

### 13.4 Integration Acceptance
- Asset Management integration verified
- Shared authentication working
- Cross-module references functional
- Data consistency verified
- Audit trail complete across modules
- No duplicate data or conflicts

### 13.5 Operational Acceptance
- Production environment prepared
- Monitoring and alerting configured
- Support procedures documented
- Runbooks created for common issues
- Data migration plan approved and tested
- Rollback plan documented and tested

---

## 14. Glossary

| Term | Definition |
|------|------------|
| **Influencer** | Internal or external driver that shapes governance requirements (regulation, contract, board directive) |
| **Control Objective** | Measurable statement of what must be achieved to satisfy a policy requirement |
| **Unified Control** | A single control implementation that satisfies requirements from multiple frameworks |
| **Framework Mapping** | The relationship between a control and specific requirements from compliance frameworks |
| **Baseline** | Minimum security configuration for a specific platform or technology |
| **Evidence** | Documentation proving that a control is implemented and effective |
| **Assessment** | Evaluation of control implementation and effectiveness |
| **Finding** | Identified gap or deficiency discovered during an assessment or audit |
| **Remediation** | Actions taken to address findings and close gaps |
| **Exception** | Approved deviation from a policy, standard, or control requirement |
| **Traceability** | Ability to track relationships from regulation through policy to technical implementation |
| **SOP** | Standard Operating Procedure - detailed instructions for performing a task |
| **RBAC** | Role-Based Access Control - permission system based on user roles |
| **Soft Delete** | Marking records as deleted without physically removing them (for audit trail) |

---

# Database Schema for Governance Module

## Schema Design Principles

1. **Integration with Asset Management**: Reuse shared tables (users, roles, business_units, audit_logs, tags)
2. **No Duplication**: Avoid creating tables that already exist in Asset Management schema
3. **Referential Integrity**: Use foreign keys to ensure data consistency
4. **Scalability**: Support large datasets (10,000+ controls, 50+ frameworks)
5. **Audit Trail**: Track all changes with created/updated fields and audit logging
6. **Flexibility**: Use JSONB for semi-structured data (framework mappings, evidence metadata)
7. **Soft Deletes**: Preserve data for audit trail (deleted_at column)
8. **Normalization**: Normalized to 3NF to reduce redundancy while maintaining query performance

---

## Shared Tables (Already Exist in Asset Management)

These tables are **NOT** recreated in the Governance schema. Both modules reference the same tables:

```sql
-- These tables already exist from Asset Management Module
-- users
-- roles  
-- business_units
-- audit_logs
-- tags
-- asset_tags (extended for governance entities)
-- notifications

Governance Schema Tables
1. Influencers
CREATE TYPE influencer_category_enum AS ENUM (
    'internal',
    'contractual',
    'statutory',
    'regulatory',
    'industry_standard'
);

CREATE TYPE influencer_status_enum AS ENUM (
    'active',
    'pending',
    'superseded',
    'retired'
);

CREATE TYPE applicability_status_enum AS ENUM (
    'applicable',
    'not_applicable',
    'under_review'
);

CREATE TABLE influencers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(500) NOT NULL,
    category influencer_category_enum NOT NULL,
    sub_category VARCHAR(200),
    issuing_authority VARCHAR(300),
    jurisdiction VARCHAR(200),
    reference_number VARCHAR(200) UNIQUE,
    description TEXT,
    publication_date DATE,
    effective_date DATE,
    last_revision_date DATE,
    next_review_date DATE,
    status influencer_status_enum DEFAULT 'active',
    
    -- Applicability
    applicability_status applicability_status_enum DEFAULT 'under_review',
    applicability_justification TEXT,
    applicability_assessment_date DATE,
    applicability_criteria JSONB, -- {industry, geography, data_types, business_activities}
    
    -- Source information
    source_url TEXT,
    source_document_path TEXT, -- Path to stored PDF
    
    -- Relationships
    owner_id UUID REFERENCES users(id),
    business_units_affected UUID[], -- Array of business_unit IDs
    
    -- Metadata
    tags VARCHAR(100)[],
    custom_fields JSONB,
    
    -- Audit fields
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by UUID REFERENCES users(id),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    
    CONSTRAINT valid_dates CHECK (
        (effective_date IS NULL OR publication_date IS NULL OR effective_date >= publication_date) AND
        (last_revision_date IS NULL OR publication_date IS NULL OR last_revision_date >= publication_date)
    )
);

CREATE INDEX idx_influencers_category ON influencers(category);
CREATE INDEX idx_influencers_status ON influencers(status);
CREATE INDEX idx_influencers_applicability ON influencers(applicability_status);
CREATE INDEX idx_influencers_owner ON influencers(owner_id);
CREATE INDEX idx_influencers_reference ON influencers(reference_number);
CREATE INDEX idx_influencers_next_review ON influencers(next_review_date) 
    WHERE next_review_date IS NOT NULL AND deleted_at IS NULL;
CREATE INDEX idx_influencers_tags ON influencers USING gin(tags);
CREATE INDEX idx_influencers_search ON influencers USING gin(
    to_tsvector('english', 
        coalesce(name, '') || ' ' || 
        coalesce(issuing_authority, '') || ' ' ||
        coalesce(description, '')
    )
);

2. Compliance Obligations
CREATE TYPE obligation_status_enum AS ENUM (
    'met',
    'not_met',
    'in_progress',
    'not_applicable'
);

CREATE TABLE compliance_obligations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    influencer_id UUID REFERENCES influencers(id) ON DELETE CASCADE,
    obligation_text TEXT NOT NULL,
    obligation_category VARCHAR(200),
    priority VARCHAR(50), -- critical, high, medium, low
    responsible_party_id UUID REFERENCES users(id),
    status obligation_status_enum DEFAULT 'not_met',
    due_date DATE,
    completion_date DATE,
    notes TEXT,
    
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by UUID REFERENCES users(id),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE INDEX idx_obligations_influencer ON compliance_obligations(influencer_id);
CREATE INDEX idx_obligations_status ON compliance_obligations(status);
CREATE INDEX idx_obligations_responsible ON compliance_obligations(responsible_party_id);
CREATE INDEX idx_obligations_priority ON compliance_obligations(priority);

3. Policies
CREATE TYPE policy_status_enum AS ENUM (
    'draft',
    'in_review',
    'approved',
    'published',
    'archived'
);

CREATE TYPE review_frequency_enum AS ENUM (
    'annual',
    'biennial',
    'triennial',
    'quarterly',
    'monthly',
    'as_needed'
);

CREATE TABLE policies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    policy_type VARCHAR(200) NOT NULL,
    title VARCHAR(500) NOT NULL,
    version VARCHAR(50) NOT NULL DEFAULT '1.0',
    version_number INTEGER DEFAULT 1,
    
    -- Content
    content TEXT, -- Rich text HTML
    purpose TEXT,
    scope TEXT,
    
    -- Ownership and governance
    owner_id UUID REFERENCES users(id),
    business_units UUID[], -- Array of business_unit IDs
    status policy_status_enum DEFAULT 'draft',
    
    -- Dates
    approval_date DATE,
    effective_date DATE,
    review_frequency review_frequency_enum DEFAULT 'annual',
    next_review_date DATE,
    published_date DATE,
    
    -- Relationships
    linked_influencers UUID[], -- Array of influencer IDs
    supersedes_policy_id UUID REFERENCES policies(id), -- Previous version
    
    -- Attachments and metadata
    attachments JSONB, -- Array of {filename, path, upload_date, uploaded_by}
    tags VARCHAR(100)[],
    custom_fields JSONB,
    
    -- Acknowledgment tracking
    requires_acknowledgment BOOLEAN DEFAULT true,
    acknowledgment_due_days INTEGER DEFAULT 30,
    
    -- Audit fields
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by UUID REFERENCES users(id),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE INDEX idx_policies_type ON policies(policy_type);
CREATE INDEX idx_policies_status ON policies(status);
CREATE INDEX idx_policies_owner ON policies(owner_id);
CREATE INDEX idx_policies_next_review ON policies(next_review_date) 
    WHERE next_review_date IS NOT NULL AND deleted_at IS NULL;
CREATE INDEX idx_policies_version ON policies(title, version_number);
CREATE INDEX idx_policies_search ON policies USING gin(
    to_tsvector('english', 
        coalesce(title, '') || ' ' || 
        coalesce(content, '')
    )
);

4. Policy Acknowledgments
CREATE TABLE policy_acknowledgments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    policy_id UUID REFERENCES policies(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    policy_version VARCHAR(50),
    acknowledged_at TIMESTAMP,
    ip_address INET,
    user_agent TEXT,
    
    -- Tracking
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    due_date DATE,
    reminder_sent_count INTEGER DEFAULT 0,
    last_reminder_sent TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT unique_policy_user_version UNIQUE (policy_id, user_id, policy_version)
);

CREATE INDEX idx_policy_acks_policy ON policy_acknowledgments(policy_id);
CREATE INDEX idx_policy_acks_user ON policy_acknowledgments(user_id);
CREATE INDEX idx_policy_acks_pending ON policy_acknowledgments(policy_id, user_id) 
    WHERE acknowledged_at IS NULL;
CREATE INDEX idx_policy_acks_due ON policy_acknowledgments(due_date) 
    WHERE acknowledged_at IS NULL AND due_date IS NOT NULL;

5. Control Objectives
CREATE TYPE implementation_status_enum AS ENUM (
    'not_implemented',
    'planned',
    'in_progress',
    'implemented',
    'not_applicable'
);

CREATE TABLE control_objectives (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    objective_identifier VARCHAR(100) UNIQUE NOT NULL, -- e.g., CO-IAM-001
    policy_id UUID REFERENCES policies(id) ON DELETE CASCADE,
    
    -- Content
    statement TEXT NOT NULL,
    rationale TEXT,
    
    -- Classification
    domain VARCHAR(200), -- IAM, Network Security, etc.
    priority VARCHAR(50), -- critical, high, medium, low
    mandatory BOOLEAN DEFAULT true,
    
    -- Implementation
    responsible_party_id UUID REFERENCES users(id),
    implementation_status implementation_status_enum DEFAULT 'not_implemented',
    target_implementation_date DATE,
    actual_implementation_date DATE,
    
    -- Relationships
    linked_influencers UUID[], -- Which influencer requirements drive this
    
    -- Display order within policy
    display_order INTEGER,
    
    -- Audit fields
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by UUID REFERENCES users(id),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE INDEX idx_control_objectives_policy ON control_objectives(policy_id);
CREATE INDEX idx_control_objectives_identifier ON control_objectives(objective_identifier);
CREATE INDEX idx_control_objectives_domain ON control_objectives(domain);
CREATE INDEX idx_control_objectives_responsible ON control_objectives(responsible_party_id);
CREATE INDEX idx_control_objectives_status ON control_objectives(implementation_status);

6. Standards
CREATE TYPE standard_status_enum AS ENUM (
    'draft',
    'in_review',
    'approved',
    'published',
    'archived'
);

CREATE TABLE standards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    standard_identifier VARCHAR(100) UNIQUE NOT NULL, -- e.g., STD-PWD-001
    title VARCHAR(500) NOT NULL,
    version VARCHAR(50) DEFAULT '1.0',
    
    -- Relationships
    policy_id UUID REFERENCES policies(id),
    control_objective_ids UUID[], -- Array of control_objective IDs
    
    -- Content
    content TEXT, -- Rich text HTML with numbered requirements
    scope_and_applicability TEXT,
    compliance_measurement TEXT,
    implementation_timeline TEXT,
    
    -- Governance
    owner_id UUID REFERENCES users(id),
    status standard_status_enum DEFAULT 'draft',
    approval_date DATE,
    effective_date DATE,
    next_review_date DATE,
    
    -- Metadata
    tags VARCHAR(100)[],
    attachments JSONB,
    
    -- Audit fields
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by UUID REFERENCES users(id),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE INDEX idx_standards_identifier ON standards(standard_identifier);
CREATE INDEX idx_standards_policy ON standards(policy_id);
CREATE INDEX idx_standards_owner ON standards(owner_id);
CREATE INDEX idx_standards_status ON standards(status);

7. Baselines
CREATE TABLE baselines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    baseline_identifier VARCHAR(100) UNIQUE NOT NULL,
    title VARCHAR(500) NOT NULL,
    version VARCHAR(50) DEFAULT '1.0',
    
    -- Classification
    platform_technology VARCHAR(200) NOT NULL, -- Windows Server, AWS, Ubuntu, etc.
    environment VARCHAR(100), -- production, development, test
    
    -- Relationships
    standard_ids UUID[], -- Array of standard IDs
    
    -- Content
    description TEXT,
    configuration_parameters JSONB, -- {key: value} pairs or complex structure
    configuration_format VARCHAR(50), -- json, yaml, ini, text
    
    -- Source
    source_reference VARCHAR(500), -- CIS Benchmark, STIG, etc.
    external_id VARCHAR(200), -- External benchmark ID
    
    -- Governance
    owner_id UUID REFERENCES users(id),
    approval_date DATE,
    next_review_date DATE,
    
    -- Metadata
    tags VARCHAR(100)[],
    criticality VARCHAR(50),
    
    -- Audit fields
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by UUID REFERENCES users(id),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE INDEX idx_baselines_identifier ON baselines(baseline_identifier);
CREATE INDEX idx_baselines_platform ON baselines(platform_technology);
CREATE INDEX idx_baselines_owner ON baselines(owner_id);
CREATE INDEX idx_baselines_tags ON baselines USING gin(tags);

8. Baseline Asset Assignments
CREATE TYPE baseline_compliance_status_enum AS ENUM (
    'compliant',
    'non_compliant',
    'partially_compliant',
    'not_assessed',
    'exception_approved'
);

CREATE TABLE baseline_asset_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    baseline_id UUID REFERENCES baselines(id) ON DELETE CASCADE,
    
    -- Asset reference (from Asset Management Module)
    asset_type asset_category_enum NOT NULL, -- Uses enum from Asset Management
    asset_id UUID NOT NULL,
    
    -- Compliance tracking
    compliance_status baseline_compliance_status_enum DEFAULT 'not_assessed',
    last_assessment_date DATE,
    assessor_id UUID REFERENCES users(id),
    
    -- Deviations
    deviations JSONB, -- Array of {parameter, expected_value, actual_value, justification}
    exception_id UUID, -- References policy_exceptions table
    
    -- Audit fields
    assigned_by UUID REFERENCES users(id),
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_baseline_assignments_baseline ON baseline_asset_assignments(baseline_id);
CREATE INDEX idx_baseline_assignments_asset ON baseline_asset_assignments(asset_type, asset_id);
CREATE INDEX idx_baseline_assignments_status ON baseline_asset_assignments(compliance_status);

9. Guidelines
CREATE TABLE guidelines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    guideline_identifier VARCHAR(100) UNIQUE NOT NULL,
    title VARCHAR(500) NOT NULL,
    version VARCHAR(50) DEFAULT '1.0',
    category VARCHAR(200), -- Secure Development, Cloud Migration, etc.
    
    -- Content
    content TEXT, -- Rich text HTML
    
    -- Relationships
    related_policy_ids UUID[],
    related_standard_ids UUID[],
    
    -- Classification
    mandatory BOOLEAN DEFAULT false, -- Guidelines are typically recommended, not mandatory
    
    -- Governance
    owner_id UUID REFERENCES users(id),
    published_date DATE,
    next_review_date DATE,
    
    -- Usage tracking
    view_count INTEGER DEFAULT 0,
    download_count INTEGER DEFAULT 0,
    average_rating DECIMAL(3, 2), -- 0.00 to 5.00
    
    -- Metadata
    tags VARCHAR(100)[],
    attachments JSONB,
    
    -- Audit fields
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by UUID REFERENCES users(id),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE INDEX idx_guidelines_identifier ON guidelines(guideline_identifier);
CREATE INDEX idx_guidelines_category ON guidelines(category);
CREATE INDEX idx_guidelines_owner ON guidelines(owner_id);

10. Guideline Feedback
CREATE TABLE guideline_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    guideline_id UUID REFERENCES guidelines(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    rating INTEGER CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    is_anonymous BOOLEAN DEFAULT false,
    feedback_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Response
    responded BOOLEAN DEFAULT false,
    response TEXT,
    responded_by UUID REFERENCES users(id),
    responded_at TIMESTAMP
);

CREATE INDEX idx_guideline_feedback_guideline ON guideline_feedback(guideline_id);
CREATE INDEX idx_guideline_feedback_rating ON guideline_feedback(rating);

11. Policy Exceptions
CREATE TYPE exception_status_enum AS ENUM (
    'requested',
    'under_review',
    'approved',
    'rejected',
    'expired',
    'revoked'
);

CREATE TABLE policy_exceptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    exception_identifier VARCHAR(100) UNIQUE NOT NULL,
    
    -- What is being excepted
    exception_type VARCHAR(100), -- policy, standard, control, baseline
    entity_id UUID NOT NULL, -- ID of policy, standard, control, or baseline
    entity_type VARCHAR(100),
    
    -- Requester information
    requested_by UUID REFERENCES users(id),
    requesting_business_unit_id UUID REFERENCES business_units(id),
    request_date DATE DEFAULT CURRENT_DATE,
    
    -- Exception details
    business_justification TEXT NOT NULL,
    compensating_controls TEXT,
    risk_assessment TEXT,
    
    -- Duration
    start_date DATE,
    end_date DATE,
    auto_expire BOOLEAN DEFAULT true,
    
    -- Approval
    status exception_status_enum DEFAULT 'requested',
    approved_by UUID REFERENCES users(id),
    approval_date DATE,
    approval_conditions TEXT,
    rejection_reason TEXT,
    
    -- Monitoring
    last_review_date DATE,
    next_review_date DATE,
    
    -- Attachments
    supporting_documents JSONB,
    
    -- Audit fields
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by UUID REFERENCES users(id),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE INDEX idx_exceptions_identifier ON policy_exceptions(exception_identifier);
CREATE INDEX idx_exceptions_entity ON policy_exceptions(entity_type, entity_id);
CREATE INDEX idx_exceptions_status ON policy_exceptions(status);
CREATE INDEX idx_exceptions_requested_by ON policy_exceptions(requested_by);
CREATE INDEX idx_exceptions_expiry ON policy_exceptions(end_date) 
    WHERE status = 'approved' AND auto_expire = true;

12. Compliance Frameworks
CREATE TYPE framework_status_enum AS ENUM (
    'active',
    'draft',
    'deprecated'
);

CREATE TABLE compliance_frameworks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    framework_code VARCHAR(100) UNIQUE NOT NULL, -- NCA_ECC, ISO27001, PCI_DSS, etc.
    name VARCHAR(300) NOT NULL,
    version VARCHAR(50),
    issuing_authority VARCHAR(300),
    description TEXT,
    effective_date DATE,
    url TEXT,
    status framework_status_enum DEFAULT 'active',
    
    -- Hierarchy/structure stored as JSONB
    --

Example: {domains: [{name: "Access Control", categories: [{name: "Authentication", requirements: [...]}]}]} structure JSONB,
-- Metadata
tags VARCHAR(100)[],

-- Audit fields
created_by UUID REFERENCES users(id),
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_by UUID REFERENCES users(id),
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
deleted_at TIMESTAMP
);
CREATE INDEX idx_frameworks_code ON compliance_frameworks(framework_code); CREATE INDEX idx_frameworks_status ON compliance_frameworks(status);

---

### 13. Framework Requirements

```sql
CREATE TABLE framework_requirements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    framework_id UUID REFERENCES compliance_frameworks(id) ON DELETE CASCADE,
    requirement_identifier VARCHAR(200) NOT NULL, -- e.g., "5-1-2", "A.5.17", "8.4"
    requirement_text TEXT NOT NULL,
    
    -- Hierarchy within framework
    domain VARCHAR(200),
    category VARCHAR(200),
    sub_category VARCHAR(200),
    
    -- Classification
    priority VARCHAR(50), -- critical, high, medium, low
    requirement_type VARCHAR(100), -- technical, administrative, physical
    
    -- Display order
    display_order INTEGER,
    
    -- Metadata
    notes TEXT,
    reference_links TEXT[],
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT unique_framework_requirement UNIQUE (framework_id, requirement_identifier)
);

CREATE INDEX idx_framework_reqs_framework ON framework_requirements(framework_id);
CREATE INDEX idx_framework_reqs_identifier ON framework_requirements(requirement_identifier);
CREATE INDEX idx_framework_reqs_domain ON framework_requirements(domain, category);

14. Unified Control Library
CREATE TYPE control_type_enum AS ENUM (
    'preventive',
    'detective',
    'corrective',
    'compensating',
    'administrative',
    'technical',
    'physical'
);

CREATE TYPE control_complexity_enum AS ENUM (
    'high',
    'medium',
    'low'
);

CREATE TYPE control_cost_impact_enum AS ENUM (
    'high',
    'medium',
    'low'
);

CREATE TYPE control_status_enum AS ENUM (
    'draft',
    'active',
    'deprecated'
);

CREATE TABLE unified_controls (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    control_identifier VARCHAR(100) UNIQUE NOT NULL, -- e.g., UCL-IAM-001
    title VARCHAR(500) NOT NULL,
    
    -- Classification
    control_domain VARCHAR(200) NOT NULL, -- IAM, Network Security, etc.
    control_family VARCHAR(200), -- Subcategory within domain
    control_type control_type_enum NOT NULL,
    
    -- Content
    description TEXT NOT NULL,
    implementation_guidance TEXT,
    
    -- Priority and complexity
    priority VARCHAR(50), -- critical, high, medium, low
    risk_level VARCHAR(50), -- critical, high, medium, low
    implementation_complexity control_complexity_enum,
    cost_impact control_cost_impact_enum,
    
    -- Implementation tracking
    implementation_status implementation_status_enum DEFAULT 'not_implemented',
    target_implementation_date DATE,
    actual_implementation_date DATE,
    implementation_notes TEXT,
    implementation_percentage INTEGER CHECK (implementation_percentage BETWEEN 0 AND 100),
    
    -- Ownership
    owner_id UUID REFERENCES users(id),
    
    -- Status
    status control_status_enum DEFAULT 'active',
    
    -- Metadata
    tags VARCHAR(100)[],
    custom_fields JSONB,
    attachments JSONB,
    
    -- Audit fields
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by UUID REFERENCES users(id),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE INDEX idx_controls_identifier ON unified_controls(control_identifier);
CREATE INDEX idx_controls_domain ON unified_controls(control_domain);
CREATE INDEX idx_controls_family ON unified_controls(control_family);
CREATE INDEX idx_controls_type ON unified_controls(control_type);
CREATE INDEX idx_controls_priority ON unified_controls(priority);
CREATE INDEX idx_controls_status_impl ON unified_controls(implementation_status);
CREATE INDEX idx_controls_owner ON unified_controls(owner_id);
CREATE INDEX idx_controls_search ON unified_controls USING gin(
    to_tsvector('english', 
        coalesce(title, '') || ' ' || 
        coalesce(description, '') || ' ' ||
        coalesce(implementation_guidance, '')
    )
);

15. Control Objective to Control Mapping
CREATE TABLE control_objective_mappings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    control_objective_id UUID REFERENCES control_objectives(id) ON DELETE CASCADE,
    unified_control_id UUID REFERENCES unified_controls(id) ON DELETE CASCADE,
    mapping_notes TEXT,
    
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT unique_objective_control UNIQUE (control_objective_id, unified_control_id)
);

CREATE INDEX idx_objective_mappings_objective ON control_objective_mappings(control_objective_id);
CREATE INDEX idx_objective_mappings_control ON control_objective_mappings(unified_control_id);

16. Framework Control Mappings
CREATE TYPE mapping_coverage_enum AS ENUM (
    'full',
    'partial',
    'not_applicable'
);

CREATE TABLE framework_control_mappings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    framework_requirement_id UUID REFERENCES framework_requirements(id) ON DELETE CASCADE,
    unified_control_id UUID REFERENCES unified_controls(id) ON DELETE CASCADE,
    coverage_level mapping_coverage_enum DEFAULT 'full',
    mapping_notes TEXT,
    
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT unique_framework_control UNIQUE (framework_requirement_id, unified_control_id)
);

CREATE INDEX idx_framework_mappings_requirement ON framework_control_mappings(framework_requirement_id);
CREATE INDEX idx_framework_mappings_control ON framework_control_mappings(unified_control_id);
CREATE INDEX idx_framework_mappings_coverage ON framework_control_mappings(coverage_level);

17. Control Dependencies
CREATE TYPE control_relationship_type_enum AS ENUM (
    'depends_on',
    'compensates_for',
    'supports',
    'related_to'
);

CREATE TABLE control_dependencies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_control_id UUID REFERENCES unified_controls(id) ON DELETE CASCADE,
    target_control_id UUID REFERENCES unified_controls(id) ON DELETE CASCADE,
    relationship_type control_relationship_type_enum NOT NULL,
    description TEXT,
    
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT unique_control_dependency UNIQUE (source_control_id, target_control_id, relationship_type),
    CONSTRAINT no_self_dependency CHECK (source_control_id != target_control_id)
);

CREATE INDEX idx_control_deps_source ON control_dependencies(source_control_id);
CREATE INDEX idx_control_deps_target ON control_dependencies(target_control_id);
CREATE INDEX idx_control_deps_type ON control_dependencies(relationship_type);

18. Control-to-Asset Mapping
CREATE TABLE control_asset_mappings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    unified_control_id UUID REFERENCES unified_controls(id) ON DELETE CASCADE,
    
    -- Asset reference (from Asset Management Module)
    asset_type asset_category_enum NOT NULL,
    asset_id UUID NOT NULL,
    
    -- Implementation details
    implementation_date DATE,
    implementation_status implementation_status_enum DEFAULT 'not_implemented',
    implementation_notes TEXT,
    
    -- Effectiveness
    last_test_date DATE,
    last_test_result VARCHAR(100), -- pass, fail, not_tested
    effectiveness_score INTEGER CHECK (effectiveness_score BETWEEN 1 AND 5),
    
    -- Metadata
    is_automated BOOLEAN DEFAULT false,
    
    -- Audit fields
    mapped_by UUID REFERENCES users(id),
    mapped_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT unique_control_asset UNIQUE (unified_control_id, asset_type, asset_id)
);

CREATE INDEX idx_control_asset_control ON control_asset_mappings(unified_control_id);
CREATE INDEX idx_control_asset_asset ON control_asset_mappings(asset_type, asset_id);
CREATE INDEX idx_control_asset_status ON control_asset_mappings(implementation_status);

19. Assessments
CREATE TYPE assessment_type_enum AS ENUM (
    'implementation',
    'design_effectiveness',
    'operating_effectiveness',
    'compliance'
);

CREATE TYPE assessment_status_enum AS ENUM (
    'not_started',
    'in_progress',
    'under_review',
    'completed',
    'cancelled'
);

CREATE TABLE assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_identifier VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(500) NOT NULL,
    description TEXT,
    assessment_type assessment_type_enum NOT NULL,
    
    -- Scope
    scope_description TEXT,
    selected_control_ids UUID[], -- Array of unified_control IDs
    selected_framework_ids UUID[], -- If framework-specific assessment
    
    -- Schedule
    start_date DATE,
    end_date DATE,
    status assessment_status_enum DEFAULT 'not_started',
    
    -- Team
    lead_assessor_id UUID REFERENCES users(id),
    assessor_ids UUID[], -- Array of user IDs
    
    -- Results summary
    controls_assessed INTEGER DEFAULT 0,
    controls_total INTEGER,
    findings_critical INTEGER DEFAULT 0,
    findings_high INTEGER DEFAULT 0,
    findings_medium INTEGER DEFAULT 0,
    findings_low INTEGER DEFAULT 0,
    overall_score DECIMAL(5, 2), -- 0.00 to 100.00
    
    -- Documentation
    assessment_procedures TEXT,
    report_path TEXT, -- Path to final report
    
    -- Approval
    approved_by UUID REFERENCES users(id),
    approval_date DATE,
    
    -- Metadata
    tags VARCHAR(100)[],
    
    -- Audit fields
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by UUID REFERENCES users(id),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE INDEX idx_assessments_identifier ON assessments(assessment_identifier);
CREATE INDEX idx_assessments_type ON assessments(assessment_type);
CREATE INDEX idx_assessments_status ON assessments(status);
CREATE INDEX idx_assessments_lead ON assessments(lead_assessor_id);
CREATE INDEX idx_assessments_dates ON assessments(start_date, end_date);

20. Assessment Results
CREATE TYPE assessment_result_enum AS ENUM (
    'compliant',
    'non_compliant',
    'partially_compliant',
    'not_applicable',
    'not_tested'
);

CREATE TABLE assessment_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_id UUID REFERENCES assessments(id) ON DELETE CASCADE,
    unified_control_id UUID REFERENCES unified_controls(id),
    
    -- Assessment details
    assessor_id UUID REFERENCES users(id),
    assessment_date DATE,
    assessment_procedure_followed TEXT,
    
    -- Result
    result assessment_result_enum NOT NULL,
    effectiveness_rating INTEGER CHECK (effectiveness_rating BETWEEN 1 AND 5),
    findings TEXT,
    observations TEXT,
    recommendations TEXT,
    
    -- Evidence collected during assessment
    evidence_collected JSONB, -- Array of {filename, path, description}
    
    -- Follow-up
    requires_remediation BOOLEAN DEFAULT false,
    remediation_due_date DATE,
    
    -- Audit fields
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_assessment_results_assessment ON assessment_results(assessment_id);
CREATE INDEX idx_assessment_results_control ON assessment_results(unified_control_id);
CREATE INDEX idx_assessment_results_result ON assessment_results(result);
CREATE INDEX idx_assessment_results_assessor ON assessment_results(assessor_id);

21. Findings
CREATE TYPE finding_severity_enum AS ENUM (
    'critical',
    'high',
    'medium',
    'low',
    'informational'
);

CREATE TYPE finding_status_enum AS ENUM (
    'open',
    'in_progress',
    'closed',
    'risk_accepted',
    'false_positive'
);

CREATE TABLE findings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    finding_identifier VARCHAR(100) UNIQUE NOT NULL,
    
    -- Source
    assessment_id UUID REFERENCES assessments(id),
    assessment_result_id UUID REFERENCES assessment_results(id),
    source_type VARCHAR(100), -- internal_assessment, external_audit, penetration_test, etc.
    source_name VARCHAR(300), -- Auditor name, assessment name, etc.
    
    -- Related entities
    unified_control_id UUID REFERENCES unified_controls(id),
    asset_type asset_category_enum,
    asset_id UUID,
    
    -- Finding details
    title VARCHAR(500) NOT NULL,
    description TEXT NOT NULL,
    severity finding_severity_enum NOT NULL,
    finding_date DATE DEFAULT CURRENT_DATE,
    
    -- Remediation
    status finding_status_enum DEFAULT 'open',
    remediation_owner_id UUID REFERENCES users(id),
    remediation_plan TEXT,
    remediation_due_date DATE,
    remediation_completed_date DATE,
    remediation_evidence JSONB,
    
    -- Risk acceptance
    risk_accepted_by UUID REFERENCES users(id),
    risk_acceptance_justification TEXT,
    risk_acceptance_date DATE,
    risk_acceptance_expiry DATE,
    
    -- Retest
    retest_required BOOLEAN DEFAULT false,
    retest_date DATE,
    retest_result VARCHAR(100),
    
    -- Metadata
    tags VARCHAR(100)[],
    
    -- Audit fields
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by UUID REFERENCES users(id),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE INDEX idx_findings_identifier ON findings(finding_identifier);
CREATE INDEX idx_findings_assessment ON findings(assessment_id);
CREATE INDEX idx_findings_control ON findings(unified_control_id);
CREATE INDEX idx_findings_asset ON findings(asset_type, asset_id);
CREATE INDEX idx_findings_severity ON findings(severity);
CREATE INDEX idx_findings_status ON findings(status);
CREATE INDEX idx_findings_owner ON findings(remediation_owner_id);
CREATE INDEX idx_findings_due ON findings(remediation_due_date) 
    WHERE status IN ('open', 'in_progress');

22. Evidence Repository
CREATE TYPE evidence_type_enum AS ENUM (
    'policy_document',
    'configuration_screenshot',
    'system_log',
    'scan_report',
    'test_result',
    'certification',
    'training_record',
    'meeting_minutes',
    'email_correspondence',
    'contract',
    'other'
);

CREATE TYPE evidence_status_enum AS ENUM (
    'draft',
    'under_review',
    'approved',
    'expired',
    'rejected'
);

CREATE TABLE evidence (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    evidence_identifier VARCHAR(100) UNIQUE NOT NULL,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    evidence_type evidence_type_enum NOT NULL,
    
    -- File information
    filename VARCHAR(500),
    file_path TEXT NOT NULL, -- Path in file storage
    file_size BIGINT, -- Bytes
    mime_type VARCHAR(200),
    file_hash VARCHAR(128), -- SHA-256 hash for integrity
    
    -- Validity period
    collection_date DATE DEFAULT CURRENT_DATE,
    valid_from_date DATE,
    valid_until_date DATE,
    
    -- Collector
    collector_id UUID REFERENCES users(id),
    
    -- Status and approval
    status evidence_status_enum DEFAULT 'draft',
    approved_by UUID REFERENCES users(id),
    approval_date DATE,
    rejection_reason TEXT,
    
    -- Metadata
    tags VARCHAR(100)[],
    custom_metadata JSONB,
    
    -- Access control
    confidential BOOLEAN DEFAULT false,
    restricted_to_roles UUID[], -- Array of role IDs
    
    -- Audit fields
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE INDEX idx_evidence_identifier ON evidence(evidence_identifier);
CREATE INDEX idx_evidence_type ON evidence(evidence_type);
CREATE INDEX idx_evidence_status ON evidence(status);
CREATE INDEX idx_evidence_collector ON evidence(collector_id);
CREATE INDEX idx_evidence_expiry ON evidence(valid_until_date) 
    WHERE valid_until_date IS NOT NULL;
CREATE INDEX idx_evidence_search ON evidence USING gin(
    to_tsvector('english', 
        coalesce(title, '') || ' ' || 
        coalesce(description, '')
    )
);

23. Evidence Linkages
CREATE TYPE evidence_link_type_enum AS ENUM (
    'control',
    'assessment',
    'finding',
    'asset',
    'policy',
    'standard'
);

CREATE TABLE evidence_linkages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    evidence_id UUID REFERENCES evidence(id) ON DELETE CASCADE,
    link_type evidence_link_type_enum NOT NULL,
    linked_entity_id UUID NOT NULL,
    link_description TEXT,
    
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT unique_evidence_link UNIQUE (evidence_id, link_type, linked_entity_id)
);

CREATE INDEX idx_evidence_links_evidence ON evidence_linkages(evidence_id);
CREATE INDEX idx_evidence_links_entity ON evidence_linkages(link_type, linked_entity_id);

24. Control Testing
CREATE TYPE test_frequency_enum AS ENUM (
    'weekly',
    'monthly',
    'quarterly',
    'semi_annually',
    'annually',
    'ad_hoc'
);

CREATE TYPE test_result_enum AS ENUM (
    'pass',
    'fail',
    'not_tested',
    'inconclusive'
);

CREATE TABLE control_tests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    test_identifier VARCHAR(100) UNIQUE NOT NULL,
    unified_control_id UUID REFERENCES unified_controls(id) ON DELETE CASCADE,
    
    -- Test definition
    test_procedure TEXT NOT NULL,
    test_frequency test_frequency_enum,
    is_automated BOOLEAN DEFAULT false,
    
    -- Schedule
    last_test_date DATE,
    next_test_due_date DATE,
    
    -- Assigned tester
    assigned_tester_id UUID REFERENCES users(id),
    
    -- Most recent result
    latest_result test_result_enum,
    latest_test_notes TEXT,
    latest_evidence_id UUID REFERENCES evidence(id),
    
    -- Metadata
    tags VARCHAR(100)[],
    
    -- Audit fields
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by UUID REFERENCES users(id),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE INDEX idx_control_tests_control ON control_tests(unified_control_id);
CREATE INDEX idx_control_tests_tester ON control_tests(assigned_tester_id);
CREATE INDEX idx_control_tests_due ON control_tests(next_test_due_date) 
    WHERE next_test_due_date IS NOT NULL;

25. Test Execution History
CREATE TABLE test_executions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    control_test_id UUID REFERENCES control_tests(id) ON DELETE CASCADE,
    
    -- Execution details
    executed_by UUID REFERENCES users(id),
    execution_date DATE NOT NULL,
    test_duration_minutes INTEGER,
    
    -- Result
    test_result test_result_enum NOT NULL,
    test_notes TEXT,
    observations TEXT,
    
    -- Evidence
    evidence_collected UUID[], -- Array of evidence IDs
    
    -- Follow-up
    issues_identified BOOLEAN DEFAULT false,
    finding_created_id UUID REFERENCES findings(id),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_test_executions_test ON test_executions(control_test_id);
CREATE INDEX idx_test_executions_executor ON test_executions(executed_by);
CREATE INDEX idx_test_executions_date ON test_executions(execution_date DESC);
CREATE INDEX idx_test_executions_result ON test_executions(test_result);

26. Key Control Indicators (KCIs)
CREATE TYPE kci_data_type_enum AS ENUM (
    'percentage',
    'count',
    'rating',
    'yes_no',
    'custom'
);

CREATE TABLE key_control_indicators (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    unified_control_id UUID REFERENCES unified_controls(id) ON DELETE CASCADE,
    kci_name VARCHAR(300) NOT NULL,
    kci_description TEXT,
    data_type kci_data_type_enum NOT NULL,
    
    -- Thresholds
    target_value DECIMAL(10, 2),
    warning_threshold DECIMAL(10, 2),
    critical_threshold DECIMAL(10, 2),
    
    -- Collection
    collection_frequency test_frequency_enum,
    is_automated BOOLEAN DEFAULT false,
    last_collection_date DATE,
    next_collection_due_date DATE,
    
    -- Most recent value
    current_value DECIMAL(10, 2),
    current_status VARCHAR(50), -- on_target, warning, critical
    
    -- Responsible party
    data_owner_id UUID REFERENCES users(id),
    
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE INDEX idx_kcis_control ON key_control_indicators(unified_control_id);
CREATE INDEX idx_kcis_owner ON key_control_indicators(data_owner_id);
CREATE INDEX idx_kcis_status ON key_control_indicators(current_status);

27. KCI Measurements
CREATE TABLE kci_measurements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kci_id UUID REFERENCES key_control_indicators(id) ON DELETE CASCADE,
    measurement_date DATE NOT NULL,
    measured_value DECIMAL(10, 2) NOT NULL,
    notes TEXT,
    measured_by UUID REFERENCES users(id),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_kci_measurements_kci ON kci_measurements(kci_id);
CREATE INDEX idx_kci_measurements_date ON kci_measurements(measurement_date DESC);

28. Standard Operating Procedures (SOPs)
CREATE TYPE sop_category_enum AS ENUM (
    'operational',
    'security',
    'compliance',
    'third_party',
    'incident_response',
    'business_continuity',
    'other'
);

CREATE TYPE sop_status_enum AS ENUM (
    'draft',
    'in_review',
    'approved',
    'published',
    'archived'
);

CREATE TABLE sops (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sop_identifier VARCHAR(100) UNIQUE NOT NULL,
    title VARCHAR(500) NOT NULL,
    version VARCHAR(50) DEFAULT '1.0',
    category sop_category_enum NOT NULL,
    
    -- Content (structured)
    purpose TEXT,
    scope TEXT,
    related_documents JSONB, -- {policies: [], standards: [], controls: []}
    roles_responsibilities TEXT, -- RACI matrix or narrative
    prerequisites TEXT,
    procedure_steps TEXT, -- Numbered steps, rich text
    decision_points JSONB, -- Flowchart data or description
    exceptions_escalations TEXT,
    quality_checks TEXT,
    records_documentation TEXT,
    metrics TEXT,
    
    -- Relationships
    linked_policy_ids UUID[],
    linked_standard_ids UUID[],
    linked_control_ids UUID[],
    
    -- Governance
    owner_id UUID REFERENCES users(id),
    status sop_status_enum DEFAULT 'draft',
    approval_date DATE,
    published_date DATE,
    review_frequency review_frequency_enum DEFAULT 'annual',
    next_review_date DATE,
    
    -- Usage tracking
    execution_count INTEGER DEFAULT 0,
    view_count INTEGER DEFAULT 0,
    download_count INTEGER DEFAULT 0,
    average_rating DECIMAL(3, 2),
    
    -- Metadata
    tags VARCHAR(100)[],
    attachments JSONB,
    
    -- Audit fields
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by UUID REFERENCES users(id),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE INDEX idx_sops_identifier ON sops(sop_identifier);
CREATE INDEX idx_sops_category ON sops(category);
CREATE INDEX idx_sops_status ON sops(status);
CREATE INDEX idx_sops_owner ON sops(owner_id);
CREATE INDEX idx_sops_search ON sops USING gin(
    to_tsvector('english', 
        coalesce(title, '') || ' ' || 
        coalesce(purpose, '') || ' ' ||
        coalesce(procedure_steps, '')
    )
);

29. SOP Executions
CREATE TYPE execution_outcome_enum AS ENUM (
    'successful',
    'failed',
    'partially_completed',
    'cancelled'
);

CREATE TABLE sop_executions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sop_id UUID REFERENCES sops(id) ON DELETE CASCADE,
    
    -- Execution details
    executed_by UUID REFERENCES users(id),
    execution_start TIMESTAMP,
    execution_end TIMESTAMP,
    execution_duration_minutes INTEGER,
    
    -- Outcome
    outcome execution_outcome_enum NOT NULL,
    deviations_from_procedure TEXT,
    quality_checks_passed BOOLEAN,
    
    -- Context
    ticket_reference VARCHAR(200), -- Link to external ticket system
    related_asset_type asset_category_enum,
    related_asset_id UUID,
    
    -- Documentation
    execution_notes TEXT,
    evidence_collected UUID[], -- Array of evidence IDs
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_sop_executions_sop ON sop_executions(sop_id);
CREATE INDEX idx_sop_executions_executor ON sop_executions(executed_by);
CREATE INDEX idx_sop_executions_date ON sop_executions(execution_start DESC);
CREATE INDEX idx_sop_executions_outcome ON sop_executions(outcome);

30. SOP Training and Acknowledgments
CREATE TABLE sop_training (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sop_id UUID REFERENCES sops(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    sop_version VARCHAR(50),
    
    -- Training
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    due_date DATE,
    
    -- Quiz (optional)
    quiz_required BOOLEAN DEFAULT false,
    quiz_score INTEGER CHECK (quiz_score BETWEEN 0 AND 100),
    quiz_passed BOOLEAN,
    
    -- Acknowledgment
    acknowledged_at TIMESTAMP,
    acknowledgment_ip INET,
    
    -- Expiration and renewal
    training_expires_at DATE,
    renewal_required BOOLEAN DEFAULT false,
    
    -- Tracking
    reminder_sent_count INTEGER DEFAULT 0,
    last_reminder_sent TIMESTAMP,
    
    CONSTRAINT unique_sop_user_version UNIQUE (sop_id, user_id, sop_version)
);

CREATE INDEX idx_sop_training_sop ON sop_training(sop_id);
CREATE INDEX idx_sop_training_user ON sop_training(user_id);
CREATE INDEX idx_sop_training_pending ON sop_training(sop_id, user_id) 
    WHERE acknowledged_at IS NULL;
CREATE INDEX idx_sop_training_expiring ON sop_training(training_expires_at) 
    WHERE training_expires_at IS NOT NULL AND renewal_required = true;

31. SOP Feedback
CREATE TABLE sop_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sop_id UUID REFERENCES sops(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    rating INTEGER CHECK (rating BETWEEN 1 AND 5),
    feedback_text TEXT,
    is_anonymous BOOLEAN DEFAULT false,
    feedback_category VARCHAR(100), -- clarity, accuracy, completeness, usability
    
    -- Response
    responded BOOLEAN DEFAULT false,
    response_text TEXT,
    responded_by UUID REFERENCES users(id),
    responded_at TIMESTAMP,
    action_taken TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_sop_feedback_sop ON sop_feedback(sop_id);
CREATE INDEX idx_sop_feedback_rating ON sop_feedback(rating);
CREATE INDEX idx_sop_feedback_responded ON sop_feedback(responded);

Shared/Extended Tables
32. Extend Asset Tags for Governance Entities
The existing asset_tags table from Asset Management supports tagging governance entities:
-- This table already exists from Asset Management Module
-- Extended to support governance entities via entity_type

-- Example usage:
-- entity_type = 'policy', entity_id = policy UUID
-- entity_type = 'control', entity_id = unified_control UUID
-- entity_type = 'sop', entity_id = sop UUID
33. Unified Audit Log
The existing audit_logs table from Asset Management is used for both modules:
-- This table already exists from Asset Management Module
-- entity_type distinguishes between modules:
-- - 'physical_asset', 'information_asset', 'application', 'software', 'supplier' (Asset Management)
-- - 'influencer', 'policy', 'control', 'assessment', 'evidence', 'sop' (Governance)
34. Unified Notifications
The existing notifications table from Asset Management is extended:
-- This table already exists from Asset Management Module
-- notification_type extended to include governance events:
-- - 'policy_review_due'
-- - 'assessment_due'
-- - 'exception_expiring'
-- - 'evidence_expiring'
-- - 'regulatory_change'
-- - 'finding_remediation_due'
-- - 'sop_acknowledgment_due' -- - 'control_test_due'

---

## Database Views

### View 1: Complete Control Coverage

```sql
CREATE VIEW vw_control_coverage AS
SELECT 
    uc.id AS control_id,
    uc.control_identifier,
    uc.title AS control_title,
    uc.control_domain,
    uc.implementation_status,
    
    -- Framework coverage
    COUNT(DISTINCT fcm.framework_requirement_id) AS framework_requirements_covered,
    COUNT(DISTINCT fr.framework_id) AS frameworks_covered,
    
    -- Asset implementation
    COUNT(DISTINCT cam.asset_id) AS assets_implementing,
    
    -- Assessment status
    MAX(ar.assessment_date) AS last_assessment_date,
    
    -- Evidence count
    COUNT(DISTINCT el.evidence_id) AS evidence_count,
    
    -- Testing
    MAX(ct.last_test_date) AS last_test_date,
    ct.latest_result AS last_test_result
    
FROM unified_controls uc
LEFT JOIN framework_control_mappings fcm ON uc.id = fcm.unified_control_id
LEFT JOIN framework_requirements fr ON fcm.framework_requirement_id = fr.id
LEFT JOIN control_asset_mappings cam ON uc.id = cam.unified_control_id
LEFT JOIN assessment_results ar ON uc.id = ar.unified_control_id
LEFT JOIN evidence_linkages el ON uc.id = el.linked_entity_id AND el.link_type = 'control'
LEFT JOIN control_tests ct ON uc.id = ct.unified_control_id
WHERE uc.deleted_at IS NULL
GROUP BY uc.id, uc.control_identifier, uc.title, uc.control_domain, 
         uc.implementation_status, ct.latest_result;
View 2: Framework Compliance Status
CREATE VIEW vw_framework_compliance AS
SELECT 
    cf.id AS framework_id,
    cf.framework_code,
    cf.name AS framework_name,
    cf.version,
    
    COUNT(DISTINCT fr.id) AS total_requirements,
    COUNT(DISTINCT fcm.unified_control_id) FILTER (
        WHERE fcm.coverage_level = 'full'
    ) AS requirements_fully_covered,
    COUNT(DISTINCT fcm.unified_control_id) FILTER (
        WHERE fcm.coverage_level = 'partial'
    ) AS requirements_partially_covered,
    COUNT(DISTINCT fr.id) FILTER (
        WHERE fcm.id IS NULL
    ) AS requirements_not_covered,
    
    ROUND(
        (COUNT(DISTINCT fcm.unified_control_id) FILTER (
            WHERE fcm.coverage_level = 'full'
        )::DECIMAL + 
        0.5 * COUNT(DISTINCT fcm.unified_control_id) FILTER (
            WHERE fcm.coverage_level = 'partial'
        )) / 
        NULLIF(COUNT(DISTINCT fr.id), 0) * 100, 
        2
    ) AS compliance_percentage
    
FROM compliance_frameworks cf
LEFT JOIN framework_requirements fr ON cf.id = fr.framework_id
LEFT JOIN framework_control_mappings fcm ON fr.id = fcm.framework_requirement_id
WHERE cf.deleted_at IS NULL AND cf.status = 'active'
GROUP BY cf.id, cf.framework_code, cf.name, cf.version;
View 3: Asset Compliance Status
CREATE VIEW vw_asset_compliance AS
SELECT 
    cam.asset_type,
    cam.asset_id,
    
    -- Control counts
    COUNT(DISTINCT cam.unified_control_id) AS total_controls_assigned,
    COUNT(DISTINCT cam.unified_control_id) FILTER (
        WHERE cam.implementation_status = 'implemented'
    ) AS controls_implemented,
    COUNT(DISTINCT cam.unified_control_id) FILTER (
        WHERE cam.implementation_status IN ('not_implemented', 'planned')
    ) AS controls_pending,
    
    -- Test results
    COUNT(DISTINCT cam.unified_control_id) FILTER (
        WHERE cam.last_test_result = 'pass'
    ) AS controls_passed_test,
    COUNT(DISTINCT cam.unified_control_id) FILTER (
        WHERE cam.last_test_result = 'fail'
    ) AS controls_failed_test,
    
    -- Compliance calculation
    ROUND(
        COUNT(DISTINCT cam.unified_control_id) FILTER (
            WHERE cam.implementation_status = 'implemented' 
            AND (cam.last_test_result = 'pass' OR cam.last_test_result IS NULL)
        )::DECIMAL / 
        NULLIF(COUNT(DISTINCT cam.unified_control_id), 0) * 100,
        2
    ) AS compliance_percentage,
    
    -- Status determination
    CASE 
        WHEN ROUND(
            COUNT(DISTINCT cam.unified_control_id) FILTER (
                WHERE cam.implementation_status = 'implemented' 
                AND (cam.last_test_result = 'pass' OR cam.last_test_result IS NULL)
            )::DECIMAL / 
            NULLIF(COUNT(DISTINCT cam.unified_control_id), 0) * 100,
            2
        ) >= 90 THEN 'compliant'
        WHEN ROUND(
            COUNT(DISTINCT cam.unified_control_id) FILTER (
                WHERE cam.implementation_status = 'implemented' 
                AND (cam.last_test_result = 'pass' OR cam.last_test_result IS NULL)
            )::DECIMAL / 
            NULLIF(COUNT(DISTINCT cam.unified_control_id), 0) * 100,
            2
        ) >= 70 THEN 'partially_compliant'
        ELSE 'non_compliant'
    END AS compliance_status
    
FROM control_asset_mappings cam
GROUP BY cam.asset_type, cam.asset_id;
View 4: Policy Status Summary
CREATE VIEW vw_policy_status AS
SELECT 
    p.id AS policy_id,
    p.title,
    p.policy_type,
    p.status,
    p.owner_id,
    p.next_review_date,
    
    -- Acknowledgments
    COUNT(DISTINCT pa.user_id) AS total_assigned_users,
    COUNT(DISTINCT pa.user_id) FILTER (
        WHERE pa.acknowledged_at IS NOT NULL
    ) AS acknowledged_users,
    ROUND(
        COUNT(DISTINCT pa.user_id) FILTER (
            WHERE pa.acknowledged_at IS NOT NULL
        )::DECIMAL / 
        NULLIF(COUNT(DISTINCT pa.user_id), 0) * 100,
        2
    ) AS acknowledgment_percentage,
    
    -- Control objectives
    COUNT(DISTINCT co.id) AS control_objectives_count,
    COUNT(DISTINCT co.id) FILTER (
        WHERE co.implementation_status = 'implemented'
    ) AS objectives_implemented,
    
    -- Active exceptions
    COUNT(DISTINCT pe.id) FILTER (
        WHERE pe.status = 'approved' 
        AND (pe.end_date IS NULL OR pe.end_date >= CURRENT_DATE)
    ) AS active_exceptions
    
FROM policies p
LEFT JOIN policy_acknowledgments pa ON p.id = pa.policy_id AND pa.policy_version = p.version
LEFT JOIN control_objectives co ON p.id = co.policy_id AND co.deleted_at IS NULL
LEFT JOIN policy_exceptions pe ON p.id = pe.entity_id AND pe.entity_type = 'policy' AND pe.deleted_at IS NULL
WHERE p.deleted_at IS NULL
GROUP BY p.id, p.title, p.policy_type, p.status, p.owner_id, p.next_review_date;
View 5: Open Findings Dashboard
CREATE VIEW vw_open_findings AS
SELECT 
    f.id AS finding_id,
    f.finding_identifier,
    f.title,
    f.severity,
    f.status,
    f.finding_date,
    f.remediation_due_date,
    f.remediation_owner_id,
    
    -- Related entities
    f.unified_control_id,
    uc.control_identifier,
    uc.title AS control_title,
    f.asset_type,
    f.asset_id,
    
    -- Aging
    CURRENT_DATE - f.finding_date AS days_open,
    CASE 
        WHEN f.remediation_due_date IS NULL THEN NULL
        WHEN f.remediation_due_date < CURRENT_DATE THEN f.remediation_due_date - CURRENT_DATE
        ELSE NULL
    END AS days_overdue,
    
    -- Priority score (higher = more urgent)
    CASE f.severity
        WHEN 'critical' THEN 100
        WHEN 'high' THEN 75
        WHEN 'medium' THEN 50
        WHEN 'low' THEN 25
        ELSE 10
    END +
    CASE 
        WHEN f.remediation_due_date < CURRENT_DATE THEN 50
        WHEN f.remediation_due_date <= CURRENT_DATE + INTERVAL '7 days' THEN 25
        ELSE 0
    END AS priority_score
    
FROM findings f
LEFT JOIN unified_controls uc ON f.unified_control_id = uc.id
WHERE f.status IN ('open', 'in_progress') 
AND f.deleted_at IS NULL
ORDER BY priority_score DESC, f.finding_date;

Database Functions
Function 1: Calculate Asset Compliance
CREATE OR REPLACE FUNCTION calculate_asset_compliance(
    p_asset_type asset_category_enum,
    p_asset_id UUID
)
RETURNS TABLE (
    total_controls INTEGER,
    implemented_controls INTEGER,
    passed_controls INTEGER,
    failed_controls INTEGER,
    compliance_percentage DECIMAL(5,2),
    compliance_status VARCHAR(50)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*)::INTEGER AS total_controls,
        COUNT(*) FILTER (WHERE implementation_status = 'implemented')::INTEGER AS implemented_controls,
        COUNT(*) FILTER (WHERE last_test_result = 'pass')::INTEGER AS passed_controls,
        COUNT(*) FILTER (WHERE last_test_result = 'fail')::INTEGER AS failed_controls,
        ROUND(
            COUNT(*) FILTER (
                WHERE implementation_status = 'implemented' 
                AND (last_test_result = 'pass' OR last_test_result IS NULL)
            )::DECIMAL / 
            NULLIF(COUNT(*), 0) * 100,
            2
        ) AS compliance_percentage,
        CASE 
            WHEN ROUND(
                COUNT(*) FILTER (
                    WHERE implementation_status = 'implemented' 
                    AND (last_test_result = 'pass' OR last_test_result IS NULL)
                )::DECIMAL / 
                NULLIF(COUNT(*), 0) * 100,
                2
            ) >= 90 THEN 'compliant'
            WHEN ROUND(
                COUNT(*) FILTER (
                    WHERE implementation_status = 'implemented' 
                    AND (last_test_result = 'pass' OR last_test_result IS NULL)
                )::DECIMAL / 
                NULLIF(COUNT(*), 0) * 100,
                2
            ) >= 70 THEN 'partially_compliant'
            ELSE 'non_compliant'
        END AS compliance_status
    FROM control_asset_mappings
    WHERE asset_type = p_asset_type AND asset_id = p_asset_id;
END;
$$ LANGUAGE plpgsql;
Function 2: Get Control Traceability
CREATE OR REPLACE FUNCTION get_control_traceability(
    p_control_id UUID
)
RETURNS TABLE (
    influencer_id UUID,
    influencer_name VARCHAR,
    policy_id UUID,
    policy_title VARCHAR,
    control_objective_id UUID,
    control_objective_statement TEXT,
    standard_id UUID,
    standard_title VARCHAR,
    framework_id UUID,
    framework_name VARCHAR,
    framework_requirement_id UUID,
    requirement_identifier VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT DISTINCT
        i.id AS influencer_id,
        i.name AS influencer_name,
        p.id AS policy_id,
        p.title AS policy_title,
        co.id AS control_objective_id,
        co.statement AS control_objective_statement,
        s.id AS standard_id,
        s.title AS standard_title,
        cf.id AS framework_id,
        cf.name AS framework_name,
        fr.id AS framework_requirement_id,
        fr.requirement_identifier
    FROM unified_controls uc
    -- Control to Control Objective
    LEFT JOIN control_objective_mappings com ON uc.id = com.unified_control_id
    LEFT JOIN control_objectives co ON com.control_objective_id = co.id
    -- Control Objective to Policy
    LEFT JOIN policies p ON co.policy_id = p.id
    -- Policy to Influencer
    LEFT JOIN unnest(p.linked_influencers) AS policy_influencer_id ON true
    LEFT JOIN influencers i ON policy_influencer_id = i.id
    -- Control Objective to Standard
    LEFT JOIN unnest(s.control_objective_ids) AS standard_co_id ON co.id = standard_co_id
    LEFT JOIN standards s ON standard_co_id = ANY(s.control_objective_ids)
    -- Control to Framework
    LEFT JOIN framework_control_mappings fcm ON uc.id = fcm.unified_control_id
    LEFT JOIN framework_requirements fr ON fcm.framework_requirement_id = fr.id
    LEFT JOIN compliance_frameworks cf ON fr.framework_id = cf.id
    WHERE uc.id = p_control_id
    AND uc.deleted_at IS NULL;
END;
$$ LANGUAGE plpgsql;
Function 3: Get Framework Gap Analysis
CREATE OR REPLACE FUNCTION get_framework_gaps(
    p_framework_id UUID
)
RETURNS TABLE (
    requirement_id UUID,
    requirement_identifier VARCHAR,
    requirement_text TEXT,
    domain VARCHAR,
    category VARCHAR,
    priority VARCHAR,
    has_control BOOLEAN,
    mapped_controls INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        fr.id AS requirement_id,
        fr.requirement_identifier,
        fr.requirement_text,
        fr.domain,
        fr.category,
        fr.priority,
        EXISTS(
            SELECT 1 FROM framework_control_mappings fcm 
            WHERE fcm.framework_requirement_id = fr.id
        ) AS has_control,
        COUNT(fcm.unified_control_id)::INTEGER AS mapped_controls
    FROM framework_requirements fr
    LEFT JOIN framework_control_mappings fcm ON fr.id = fcm.framework_requirement_id
    WHERE fr.framework_id = p_framework_id
    GROUP BY fr.id, fr.requirement_identifier, fr.requirement_text, 
             fr.domain, fr.category, fr.priority
    ORDER BY 
        CASE fr.priority
            WHEN 'critical' THEN 1
            WHEN 'high' THEN 2
            WHEN 'medium' THEN 3
            WHEN 'low' THEN 4
            ELSE 5
        END,
        fr.domain,
        fr.requirement_identifier;
END;
$$ LANGUAGE plpgsql;

Triggers
Trigger 1: Update Timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all governance tables with updated_at
CREATE TRIGGER update_influencers_updated_at 
    BEFORE UPDATE ON influencers 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_policies_updated_at 
    BEFORE UPDATE ON policies 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_controls_updated_at 
    BEFORE UPDATE ON unified_controls 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Apply to remaining tables...
Trigger 2: Create Audit Log
CREATE OR REPLACE FUNCTION create_governance_audit_log()
RETURNS TRIGGER AS $$
DECLARE
    v_user_id UUID;
BEGIN
    -- Get current user from session variable
    BEGIN
        v_user_id := current_setting('app.current_user_id')::UUID;
    EXCEPTION
        WHEN OTHERS THEN
            v_user_id := NULL;
    END;
    
    IF (TG_OP = 'DELETE') THEN
        INSERT INTO audit_logs (user_id, action, entity_type, entity_id, changes)
        VALUES (
            v_user_id,
            'delete',
            TG_TABLE_NAME,
            OLD.id,
            row_to_json(OLD)::JSONB
        );
        RETURN OLD;
    ELSIF (TG_OP = 'UPDATE') THEN
        INSERT INTO audit_logs (user_id, action, entity_type, entity_id, changes)
        VALUES (
            v_user_id,
            'update',
            TG_TABLE_NAME,
            NEW.id,
            jsonb_build_object(
                'old', row_to_json(OLD)::JSONB,
                'new', row_to_json(NEW)::JSONB
            )
        );
        RETURN NEW;
    ELSIF (TG_OP = 'INSERT') THEN
        INSERT INTO audit_logs (user_id, action, entity_type, entity_id, changes)
        VALUES (
            v_user_id,
            'create',
            TG_TABLE_NAME,
            NEW.id,
            row_to_json(NEW)::JSONB
        );
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Apply to critical governance tables
CREATE TRIGGER audit_influencers 
    AFTER INSERT OR UPDATE OR DELETE ON influencers 
    FOR EACH ROW EXECUTE FUNCTION create_governance_audit_log();

CREATE TRIGGER audit_policies 
    AFTER INSERT OR UPDATE OR DELETE ON policies 
    FOR EACH ROW EXECUTE FUNCTION create_governance_audit_log();

CREATE TRIGGER audit_controls 
    AFTER INSERT OR UPDATE OR DELETE ON unified_controls 
    FOR EACH ROW EXECUTE FUNCTION create_governance_audit_log();

CREATE TRIGGER audit_assessments 
    AFTER INSERT OR UPDATE OR DELETE ON assessments 
    FOR EACH ROW EXECUTE FUNCTION create_governance_audit_log();

CREATE TRIGGER audit_findings 
    AFTER INSERT OR UPDATE OR DELETE ON findings 
    FOR EACH ROW EXECUTE FUNCTION create_governance_audit_log();

-- Apply to remaining critical tables...
Trigger 3: Policy Version Increment
CREATE OR REPLACE FUNCTION increment_policy_version()
RETURNS TRIGGER AS $$
BEGIN
    -- Only increment if content has changed and status is being set to 'approved'
    IF NEW.status = 'approved' AND OLD.status != 'approved' THEN
        NEW.version_number := OLD.version_number + 1;
        NEW.version := NEW.version_number::TEXT || '.0';
        NEW.approval_date := CURRENT_DATE;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER policy_version_increment 
    BEFORE UPDATE ON policies 
    FOR EACH ROW 
    WHEN (NEW.status = 'approved' AND OLD.status != 'approved')
    EXECUTE FUNCTION increment_policy_version();
Trigger 4: Calculate Assessment Summary
CREATE OR REPLACE FUNCTION update_assessment_summary()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE assessments
    SET 
        controls_assessed = (
            SELECT COUNT(*) FROM assessment_results 
            WHERE assessment_id = NEW.assessment_id
        ),
        findings_critical = (
            SELECT COUNT(*) FROM findings 
            WHERE assessment_id = NEW.assessment_id AND severity = 'critical'
        ),
        findings_high = (
            SELECT COUNT(*) FROM findings 
            WHERE assessment_id = NEW.assessment_id AND severity = 'high'
        ),
        findings_medium = (
            SELECT COUNT(*) FROM findings 
            WHERE assessment_id = NEW.assessment_id AND severity = 'medium'
        ),
        findings_low = (
            SELECT COUNT(*) FROM findings 
            WHERE assessment_id = NEW.assessment_id AND severity = 'low'
        ),
        overall_score = (
            SELECT ROUND(AVG(effectiveness_rating) * 20, 2) 
            FROM assessment_results 
            WHERE assessment_id = NEW.assessment_id 
            AND effectiveness_rating IS NOT NULL
        )
    WHERE id = NEW.assessment_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER assessment_summary_update 
    AFTER INSERT OR UPDATE ON assessment_results 
    FOR EACH ROW 
    EXECUTE FUNCTION update_assessment_summary();

Indexes for Performance
-- Full-text search indexes
CREATE INDEX idx_influencers_fts ON influencers 
    USING gin(to_tsvector('english', 
        coalesce(name, '') || ' ' || 
        coalesce(issuing_authority, '') || ' ' ||
        coalesce(description, '')
    ));

CREATE INDEX idx_policies_fts ON policies 
    USING gin(to_tsvector('english', 
        coalesce(title, '') || ' ' || 
        coalesce(content, '')
    ));

CREATE INDEX idx_controls_fts ON unified_controls 
    USING gin(to_tsvector('english', 
        coalesce(title, '') || ' ' || 
        coalesce(description, '') || ' ' ||
        coalesce(implementation_guidance, '')
    ));

CREATE INDEX idx_evidence_fts ON evidence 
    USING gin(to_tsvector('english', 
        coalesce(title, '') || ' ' || 
        coalesce(description, '')
    ));

CREATE INDEX idx_sops_fts ON sops 
    USING gin(to_tsvector('english', 
        coalesce(title, '') || ' ' || 
        coalesce(purpose, '') || ' ' ||
        coalesce(procedure_steps, '')
    ));

-- Composite indexes for common queries
CREATE INDEX idx_policies_owner_status ON policies(owner_id, status) 
    WHERE deleted_at IS NULL;

CREATE INDEX idx_controls_domain_status ON unified_controls(control_domain, implementation_status) 
    WHERE deleted_at IS NULL;

CREATE INDEX idx_findings_severity_status ON findings(severity, status) 
    WHERE deleted_at IS NULL;

CREATE INDEX idx_assessments_status_dates ON assessments(status, start_date, end_date) 
    WHERE deleted_at IS NULL;

-- JSONB indexes for flexible queries
CREATE INDEX idx_policies_linked_influencers ON policies USING gin(linked_influencers);
CREATE INDEX idx_control_objectives_linked_influencers ON control_objectives USING gin(linked_influencers);
CREATE INDEX idx_baselines_config ON baselines USING gin(configuration_parameters);
CREATE INDEX idx_evidence_metadata ON evidence USING gin(custom_metadata);

-- Array indexes
CREATE INDEX idx_influencers_bu_affected ON influencers USING gin(business_units_affected);
CREATE INDEX idx_policies_business_units ON policies USING gin(business_units);
CREATE INDEX idx_sops_linked_controls ON sops USING gin(linked_control_ids);

Sample Data Queries
Query 1: Get All Controls for a Framework with Compliance Status
SELECT 
    fr.requirement_identifier,
    fr.requirement_text,
    fr.domain,
    uc.control_identifier,
    uc.title AS control_title,
    fcm.coverage_level,
    uc.implementation_status,
    COUNT(DISTINCT cam.asset_id) AS assets_count,
    MAX(ar.assessment_date) AS last_assessed,
    ar.result AS last_assessment_result
FROM framework_requirements fr
LEFT JOIN framework_control_mappings fcm ON fr.id = fcm.framework_requirement_id
LEFT JOIN unified_controls uc ON fcm.unified_control_id = uc.id
LEFT JOIN control_asset_mappings cam ON uc.id = cam.unified_control_id
LEFT JOIN (
    SELECT DISTINCT ON (unified_control_id) 
        unified_control_id, assessment_date, result
    FROM assessment_results
    ORDER BY unified_control_id, assessment_date DESC
) ar ON uc.id = ar.unified_control_id
WHERE fr.framework_id = 'framework-uuid-here'
AND uc.deleted_at IS NULL
GROUP BY fr.requirement_identifier, fr.requirement_text, fr.domain,
         uc.control_identifier, uc.title, fcm.coverage_level, 
         uc.implementation_status, ar.result
ORDER BY fr.domain, fr.requirement_identifier;
Query 2: Get Asset Compliance Report
SELECT 
    -- Asset info (would join to actual asset tables)
    cam.asset_type,
    cam.asset_id,
    
    -- Control counts
    COUNT(DISTINCT uc.id) AS total_controls,
    COUNT(DISTINCT uc.id) FILTER (
        WHERE uc.implementation_status = 'implemented'
    ) AS implemented_controls,
    
    -- Framework coverage
    STRING_AGG(DISTINCT cf.framework_code, ', ') AS applicable_frameworks,
    
    -- Compliance percentage
    ROUND(
        COUNT(DISTINCT uc.id) FILTER (
            WHERE uc.implementation_status = 'implemented'
        )::DECIMAL / NULLIF(COUNT(DISTINCT uc.id), 0) * 100,
        2
    ) AS compliance_percentage,
    
    -- Recent findings
    COUNT(DISTINCT f.id) FILTER (
        WHERE f.status IN ('open', 'in_progress')
    ) AS open_findings
    
FROM control_asset_mappings cam
JOIN unified_controls uc ON cam.unified_control_id = uc.id
LEFT JOIN framework_control_mappings fcm ON uc.id = fcm.unified_control_id
LEFT JOIN framework_requirements fr ON fcm.framework_requirement_id = fr.id
LEFT JOIN compliance_frameworks cf ON fr.framework_id = cf.id
LEFT JOIN findings f ON cam.asset_id = f.asset_id AND cam.asset_type = f.asset_type
WHERE cam.asset_id = 'asset-uuid-here'
GROUP BY cam.asset_type, cam.asset_id;
Query 3: Get Policies Due for Review in Next 30 Days
SELECT 
    p.id,
    p.title,
    p.policy_type,
    p.version,
    p.owner_id,
    u.first_name || ' ' || u.last_name AS owner_name,
    p.next_review_date,
    p.next_review_date - CURRENT_DATE AS days_until_review,
    COUNT(DISTINCT co.id) AS control_objectives_count,
    COUNT(DISTINCT pa.user_id) AS assigned_users
FROM policies p
JOIN users u ON p.owner_id = u.id
LEFT JOIN control_objectives co ON p.id = co.policy_id AND co.deleted_at IS NULL
LEFT JOIN policy_acknowledgments pa ON p.id = pa.policy_id AND pa.policy_version = p.version
WHERE p.status = 'published'
AND p.next_review_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '30 days'
AND p.deleted_at IS NULL
GROUP BY p.id, p.title, p.policy_type, p.version, p.owner_id, 
         u.first_name, u.last_name, p.next_review_date
ORDER BY p.next_review_date;
Query 4: Get Top Controls by Framework Coverage
SELECT 
    uc.control_identifier,
    uc.title,
    uc.control_domain,
    COUNT(DISTINCT fr.framework_id) AS frameworks_covered,
    STRING_AGG(DISTINCT cf.framework_code, ', ' ORDER BY cf.framework_code) AS framework_list,
    COUNT(DISTINCT fcm.framework_requirement_id) AS requirements_satisfied,
    uc.implementation_status
FROM unified_controls uc
JOIN framework_control_mappings fcm ON uc.id = fcm.unified_control_id
JOIN framework_requirements fr ON fcm.framework_requirement_id = fr.id
JOIN compliance_frameworks cf ON fr.framework_id = cf.id
WHERE uc.deleted_at IS NULL
AND uc.status = 'active'
AND fcm.coverage_level IN ('full', 'partial')
GROUP BY uc.control_identifier, uc.title, uc.control_domain, uc.implementation_status
HAVING COUNT(DISTINCT fr.framework_id) >= 3
ORDER BY frameworks_covered DESC, requirements_satisfied DESC
LIMIT 20;

Data Integrity Constraints
-- Ensure evidence files exist before linking
ALTER TABLE evidence_linkages
ADD CONSTRAINT fk_evidence_exists
FOREIGN KEY (evidence_id) REFERENCES evidence(id) ON DELETE CASCADE;

-- Ensure dates are logical in policies
ALTER TABLE policies
ADD CONSTRAINT check_policy_dates
CHECK (
    (effective_date IS NULL OR approval_date IS NULL OR effective_date >= approval_date) AND
    (published_date IS NULL OR approval_date IS NULL OR published_date >= approval_date)
);

-- Ensure assessment dates are logical
ALTER TABLE assessments
ADD CONSTRAINT check_assessment_dates
CHECK (end_date IS NULL OR start_date IS NULL OR end_date >= start_date);

-- Ensure finding remediation dates are logical
ALTER TABLE findings
ADD CONSTRAINT check_finding_dates
CHECK (
    remediation_completed_date IS NULL OR 
    finding_date IS NULL OR 
    remediation_completed_date >= finding_date
);

-- Ensure exception dates are logical
ALTER TABLE policy_exceptions
ADD CONSTRAINT check_exception_dates
CHECK (
    end_date IS NULL OR 
    start_date IS NULL OR 
    end_date > start_date
);

-- Ensure control test scores are valid
ALTER TABLE test_executions
ADD CONSTRAINT check_test_duration
CHECK (test_duration_minutes IS NULL OR test_duration_minutes >= 0);

-- Ensure KCI thresholds are logical
ALTER TABLE key_control_indicators
ADD CONSTRAINT check_kci_thresholds
CHECK (
    (critical_threshold IS NULL OR warning_threshold IS NULL OR target_value IS NULL) OR
    (critical_threshold < warning_threshold AND warning_threshold < target_value)
);

This completes the comprehensive database schema for the Governance Module, fully integrated with the Asset Management Module while avoiding duplication and maintaining referential integrity.
