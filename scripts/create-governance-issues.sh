#!/bin/bash

# GitHub Issues Creation Script for Governance Module
# Creates issues for remaining P0, P1, and P2 stories
# Requirements: gh CLI installed and authenticated

set -e

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to create issue
create_issue() {
    local title="$1"
    local body="$2"
    local labels="$3"
    
    echo -e "${BLUE}Creating issue: ${title}${NC}"
    
    # Create issue using gh CLI
    gh issue create \
        --title "$title" \
        --body "$body" \
        --label "$labels" \
        2>/dev/null || echo -e "${RED}Failed to create issue: $title${NC}"
    
    echo -e "${GREEN}✓ Issue created${NC}\n"
}

# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
    echo -e "${RED}Error: 'gh' CLI is not installed or not in PATH${NC}"
    echo "Install it from: https://github.com/cli/cli#installation"
    exit 1
fi

# Verify we're in the right repo
if [ ! -d ".git" ]; then
    echo -e "${RED}Error: Not in a Git repository${NC}"
    exit 1
fi

echo -e "${YELLOW}========================================${NC}"
echo -e "${YELLOW}Governance Module - Issue Creator${NC}"
echo -e "${YELLOW}========================================${NC}\n"

# REMAINING P0 STORIES (5 critical)
echo -e "${YELLOW}Creating P0 (Must Have) Issues...${NC}\n"

create_issue \
    "[Epic 2] Policy Hierarchy & Management (Story 2.1)" \
    "## Description
Implement core policy hierarchy and management functionality.

## Acceptance Criteria
- [ ] Create Policy entity with parent-child relationships
- [ ] Implement hierarchical policy structure (Framework → Policy → Standard → Procedure)
- [ ] Support policy versioning with change tracking
- [ ] Create Policy Form component for CRUD operations
- [ ] Implement policy review scheduling (annual/quarterly/monthly)
- [ ] Add policy acknowledgment tracking for users
- [ ] Create Policy List page with hierarchical view
- [ ] Support bulk import of policies from CSV/JSON
- [ ] Add policy-to-control mapping UI
- [ ] Create notification system for policy reviews

## Technical Details
- Database: Create policies, policy_versions, policy_acknowledgments tables
- Backend: NestJS service for policy management (PoliciesService)
- Frontend: PolicyForm, PolicyList, PolicyHierarchy components
- API: GET/POST/PUT/DELETE /policies endpoints
- Validation: Zod schemas for policy data

## Dependencies
- Prerequisite for: SOP implementation (already complete)
- Blocks: Policy exception handling, policy compliance reporting

## Story Points: 13
## Priority: P0 (Must Have)
## Effort: High
## Due Date: Sprint 2" \
    "epic/policy-management,priority/p0,backend,frontend"

create_issue \
    "[Epic 3] Unified Control Library - Core Implementation (Story 3.1)" \
    "## Description
Implement the foundational Unified Control Library system - the central repository for all governance controls.

## Acceptance Criteria
- [ ] Create UnifiedControl entity with control lifecycle
- [ ] Implement control domain taxonomy (Security, Compliance, Operational, Risk)
- [ ] Support control mapping to multiple frameworks (NIST, ISO, SOC2, etc.)
- [ ] Create ControlLibrary browsing interface
- [ ] Implement control versioning with approval workflow
- [ ] Add control tagging and categorization system
- [ ] Create ControlDetail page with all related data
- [ ] Implement full-text search for controls
- [ ] Add control filtering by domain, framework, and status
- [ ] Create control import from standard frameworks

## Technical Details
- Database: unified_controls, control_frameworks, control_versions, control_tags tables
- Backend: UnifiedControlsService, ControlFrameworksService
- Frontend: ControlLibrary, ControlBrowser, ControlDetail components
- API: GET/POST/PUT/DELETE /controls endpoints
- Validation: Zod schemas for control structures

## Dependencies
- Prerequisite for: Control testing, control effectiveness tracking
- Depends on: Policy management (for linking)

## Story Points: 13
## Priority: P0 (Must Have)
## Effort: High
## Due Date: Sprint 2" \
    "epic/control-library,priority/p0,backend,frontend"

create_issue \
    "[Epic 5] Asset-Control Integration (Story 5.1)" \
    "## Description
Link governance controls to specific assets, enabling traceability from regulation to implementation.

## Acceptance Criteria
- [ ] Create Control-to-Asset relationship entity
- [ ] Implement asset control mapping interface
- [ ] Add asset compliance posture by control
- [ ] Create Asset-Control Matrix view
- [ ] Implement bulk asset assignment to controls
- [ ] Add control effectiveness tracking by asset
- [ ] Create Asset Compliance Report by control
- [ ] Implement control change impact analysis on assets
- [ ] Add asset-control relationship audit logging
- [ ] Create dashboard showing control coverage by asset

## Technical Details
- Database: control_asset_mappings, asset_compliance_status tables
- Backend: AssetControlService, ComplianceService
- Frontend: AssetControlMatrix, AssetComplianceReport components
- API: POST/DELETE /controls/:id/assets endpoints
- Integration: Asset Management Module

## Dependencies
- Blocks: Asset compliance workflows, control effectiveness metrics
- Depends on: Asset Management module, Control Library

## Story Points: 8
## Priority: P0 (Must Have)
## Effort: Moderate
## Due Date: Sprint 3" \
    "epic/integration,priority/p0,backend,frontend"

create_issue \
    "[Epic 6] Compliance Posture Report (Story 6.1)" \
    "## Description
Create executive-level compliance posture reporting showing organization's governance maturity across all frameworks.

## Acceptance Criteria
- [ ] Implement compliance scoring algorithm (0-100%)
- [ ] Create dashboard with overall compliance score
- [ ] Add framework-specific compliance breakdown (NIST, ISO, SOC2)
- [ ] Implement control effectiveness aggregation
- [ ] Create policy acknowledgment rate metrics
- [ ] Add SOP execution compliance tracking
- [ ] Create trend analysis (30/60/90 day views)
- [ ] Implement role-based reporting filters
- [ ] Add PDF export for executive presentations
- [ ] Create automated compliance status alerting

## Technical Details
- Backend: ComplianceReportingService, MetricsAggregationService
- Frontend: CompliancePosture, ComplianceTrends, ExportReport components
- API: GET /reports/compliance-posture endpoint
- Database: compliance_metrics, report_snapshots tables
- Integration: Risk module for risk-adjusted scoring

## Dependencies
- Blocks: Executive dashboard, compliance audit preparation
- Depends on: All governance modules (Policies, Controls, SOPs)

## Story Points: 13
## Priority: P0 (Must Have)
## Effort: High
## Due Date: Sprint 3" \
    "epic/reporting,priority/p0,backend,frontend"

create_issue \
    "[Epic 8] Critical Alerts & Escalations (Story 8.3)" \
    "## Description
Implement alert system for critical governance events requiring immediate action.

## Acceptance Criteria
- [ ] Create AlertRule entity with trigger conditions
- [ ] Implement policy review overdue alerts
- [ ] Add control assessment past-due escalation
- [ ] Create SOP execution failure alerts
- [ ] Implement audit finding notification system
- [ ] Add custom alert rule builder for admins
- [ ] Create alert notification preferences per user
- [ ] Implement alert delivery (in-app, email, Slack)
- [ ] Add alert acknowledgment and resolution tracking
- [ ] Create alert history and audit log

## Technical Details
- Database: alert_rules, alert_definitions, alert_subscriptions tables
- Backend: AlertingService, NotificationService, RuleEvaluationEngine
- Frontend: AlertPreferences, AlertHistory, RuleBuilder components
- API: CRUD endpoints for /alerts and /alert-rules
- Integration: Email/Slack notification service

## Dependencies
- Blocks: Governance workflows, audit readiness
- Depends on: All governance modules for trigger events

## Story Points: 8
## Priority: P0 (Must Have)
## Effort: Moderate
## Due Date: Sprint 2" \
    "epic/notifications,priority/p0,backend,frontend"

# REMAINING P1 STORIES (Sample of 5 key ones from 19 remaining)
echo -e "${YELLOW}Creating Sample P1 (Should Have) Issues...${NC}\n"

create_issue \
    "[Epic 2] Policy Exception Management (Story 2.4)" \
    "## Description
Enable controlled exception handling for policy non-compliance with risk assessment and approval workflow.

## Acceptance Criteria
- [ ] Create PolicyException entity with justification field
- [ ] Implement risk assessment scoring for exceptions
- [ ] Create exception approval workflow (Manager → CISO → CFO)
- [ ] Add expiration date tracking for time-bound exceptions
- [ ] Implement exception renewal workflow
- [ ] Create exception dashboard for managers
- [ ] Add policy exception reporting
- [ ] Implement exception impact analysis
- [ ] Create automated exception expiration reminders
- [ ] Add exception audit trail

## Technical Details
- Database: policy_exceptions, exception_approvals tables
- Backend: PolicyExceptionService, ExceptionApprovalService
- Frontend: ExceptionForm, ExceptionDashboard, ExceptionReports components
- API: CRUD endpoints for /policy-exceptions
- Workflow: Integration with approval workflow system

## Dependencies
- Depends on: Policy management
- Story Points: 13
- Priority: P1 (Should Have)" \
    "epic/policy-management,priority/p1,backend,frontend"

create_issue \
    "[Epic 3] Control Testing Framework (Story 3.6)" \
    "## Description
Implement control testing and effectiveness tracking functionality.

## Acceptance Criteria
- [ ] Create ControlTest entity with test results tracking
- [ ] Implement test scheduling (one-time and recurring)
- [ ] Add test evidence attachment support
- [ ] Create control effectiveness scoring (0-100%)
- [ ] Implement test history and trend analysis
- [ ] Create testing dashboard for auditors
- [ ] Add test result notifications
- [ ] Implement control maturity assessment
- [ ] Create test report generation
- [ ] Add control weakness identification

## Technical Details
- Database: control_tests, test_results, test_evidence tables
- Backend: ControlTestingService, EffectivenessService
- Frontend: TestingDashboard, TestForm, EffectivenessChart components
- API: CRUD endpoints for /controls/:id/tests
- Story Points: 8
- Priority: P1 (Should Have)" \
    "epic/control-library,priority/p1,backend,frontend"

create_issue \
    "[Epic 6] Findings & Remediation Tracking (Story 6.7)" \
    "## Description
Track audit findings and manage remediation efforts with deadline tracking and escalation.

## Acceptance Criteria
- [ ] Create Finding entity with severity levels
- [ ] Implement remediation action plan creation
- [ ] Add owner assignment and accountability
- [ ] Create deadline tracking with escalation
- [ ] Implement finding status workflow (Open → Remediation → Resolved → Verified)
- [ ] Add finding evidence attachment
- [ ] Create findings dashboard
- [ ] Implement findings reporting by severity
- [ ] Add remediation progress tracking
- [ ] Create finding audit trail

## Technical Details
- Database: findings, remediation_plans, remediation_activities tables
- Backend: FindingsService, RemediationService
- Frontend: FindingsDashboard, RemediationForm, FindingsReport components
- API: CRUD endpoints for /findings
- Story Points: 13
- Priority: P1 (Should Have)" \
    "epic/reporting,priority/p1,backend,frontend"

create_issue \
    "[Epic 7] Role-Based Access Control (Story 7.4)" \
    "## Description
Implement fine-grained role-based access control for governance module.

## Acceptance Criteria
- [ ] Create governance-specific roles (Governance Admin, CISO, Policy Owner, Control Tester, Auditor)
- [ ] Implement role-to-permission mapping
- [ ] Add entity-level access control (row-level security)
- [ ] Create role assignment interface
- [ ] Implement delegation of authority workflows
- [ ] Add role change audit logging
- [ ] Create role hierarchy (inherited permissions)
- [ ] Implement approval requirement by role
- [ ] Add role-based dashboard customization
- [ ] Create access control report

## Technical Details
- Database: governance_roles, role_permissions, entity_access_control tables
- Backend: RoleService, AccessControlService, PermissionGuard
- Frontend: RoleManagement, PermissionEditor components
- API: CRUD endpoints for /roles and /permissions
- Story Points: 13
- Priority: P1 (Should Have)" \
    "epic/administration,priority/p1,backend"

create_issue \
    "[Epic 8] Bulk Operations & Automation (Story 8.5)" \
    "## Description
Enable bulk operations for common governance tasks to improve efficiency.

## Acceptance Criteria
- [ ] Implement bulk policy acknowledgment assignment
- [ ] Add bulk control assignment to frameworks
- [ ] Create bulk SOP assignment to users/roles
- [ ] Implement bulk status updates for policies/controls
- [ ] Add bulk notification sending
- [ ] Create bulk action scheduling
- [ ] Implement bulk action history tracking
- [ ] Add confirmation and undo capability
- [ ] Create bulk operation reporting
- [ ] Add bulk action audit logging

## Technical Details
- Database: bulk_operations, bulk_operation_logs tables
- Backend: BulkOperationService, BulkActionProcessor
- Frontend: BulkOperationDialog, BulkActionMonitor components
- API: POST /bulk-operations endpoints
- Story Points: 8
- Priority: P1 (Should Have)" \
    "epic/notifications,priority/p1,backend,frontend"

# REMAINING P2 STORIES (Sample)
echo -e "${YELLOW}Creating Sample P2 (Nice to Have) Issues...${NC}\n"

create_issue \
    "[Epic 3] Control Analytics & Dashboard (Story 3.15)" \
    "## Description
Advanced analytics and visualization for control effectiveness and trends.

## Acceptance Criteria
- [ ] Create control effectiveness heatmap
- [ ] Implement control trend analysis (30/60/90 day)
- [ ] Add control performance benchmarking
- [ ] Create predictive control failure alerts
- [ ] Implement control coverage gap analysis
- [ ] Add control cost/benefit analysis
- [ ] Create control performance dashboard
- [ ] Implement custom metric creation
- [ ] Add data export for analysis tools
- [ ] Create control intelligence reports

## Technical Details
- Frontend: ControlAnalytics, ControlHeatmap, TrendAnalysis components
- Backend: AnalyticsService, PredictionService
- API: GET /controls/analytics endpoints
- Story Points: 13
- Priority: P2 (Nice to Have)" \
    "epic/control-library,priority/p2,frontend,analytics"

create_issue \
    "[Epic 6] Continuous Monitoring (Story 6.9)" \
    "## Description
Enable continuous monitoring of governance controls and compliance status.

## Acceptance Criteria
- [ ] Implement real-time control status monitoring
- [ ] Add continuous compliance assessment
- [ ] Create automated control health checks
- [ ] Implement control status dashboard (streaming updates)
- [ ] Add control anomaly detection
- [ ] Create automated remediation suggestions
- [ ] Implement continuous evidence collection
- [ ] Add trend prediction and forecasting
- [ ] Create monitoring dashboards
- [ ] Implement alert escalation for degradation

## Technical Details
- Backend: MonitoringService, AnomalyDetectionService
- Frontend: MonitoringDashboard, HealthStatus components
- API: WebSocket endpoints for real-time updates
- Story Points: 13
- Priority: P2 (Nice to Have)" \
    "epic/reporting,priority/p2,backend,frontend"

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Issue creation complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "Summary:"
echo "  - 5 P0 (Must Have) issues created"
echo "  - 5 P1 (Should Have) sample issues created"
echo "  - 2 P2 (Nice to Have) sample issues created"
echo ""
echo "View all issues at: https://github.com/mohamedadel0806/Stratagem/issues"
