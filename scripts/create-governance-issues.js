#!/usr/bin/env node

/**
 * GitHub Issues Creator - Governance Module
 * Creates issues for remaining governance work
 * 
 * Requirements: 
 * - GITHUB_TOKEN environment variable set
 * - Or create file: ~/.github-token with your token
 * 
 * Usage:
 *   node scripts/create-governance-issues.js
 *   node scripts/create-governance-issues.js --filter=p0
 *   node scripts/create-governance-issues.js --filter=p1
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// Get GitHub token from environment or file
function getGitHubToken() {
    const envToken = process.env.GITHUB_TOKEN;
    if (envToken) return envToken;
    
    const tokenFile = path.join(process.env.HOME, '.github-token');
    if (fs.existsSync(tokenFile)) {
        return fs.readFileSync(tokenFile, 'utf-8').trim();
    }
    
    throw new Error('GITHUB_TOKEN not found. Set GITHUB_TOKEN environment variable or create ~/.github-token');
}

// Make HTTPS request to GitHub API
function makeGitHubRequest(method, path, data, token) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'api.github.com',
            port: 443,
            path: path,
            method: method,
            headers: {
                'Authorization': `token ${token}`,
                'Accept': 'application/vnd.github.v3+json',
                'User-Agent': 'Stratagem-IssueCreator/1.0',
                'Content-Type': 'application/json'
            }
        };

        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                try {
                    if (res.statusCode >= 200 && res.statusCode < 300) {
                        resolve(JSON.parse(body));
                    } else {
                        reject(new Error(`GitHub API error: ${res.statusCode} ${body}`));
                    }
                } catch (e) {
                    reject(e);
                }
            });
        });

        req.on('error', reject);
        
        if (data) {
            req.write(JSON.stringify(data));
        }
        
        req.end();
    });
}

// Issue templates
const issues = [
    // P0 Issues
    {
        priority: 'P0',
        title: '[Epic 2] Policy Hierarchy & Management (Story 2.1)',
        labels: ['epic/policy-management', 'priority/p0', 'backend', 'frontend'],
        body: `## Description
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
- **Database**: Create policies, policy_versions, policy_acknowledgments tables
- **Backend**: NestJS service for policy management (PoliciesService)
- **Frontend**: PolicyForm, PolicyList, PolicyHierarchy components
- **API**: GET/POST/PUT/DELETE /policies endpoints
- **Validation**: Zod schemas for policy data

## Dependencies
- Prerequisite for: SOP implementation (already complete)
- Blocks: Policy exception handling, policy compliance reporting

## Story Points: 13
## Effort: High`
    },
    {
        priority: 'P0',
        title: '[Epic 3] Unified Control Library - Core Implementation (Story 3.1)',
        labels: ['epic/control-library', 'priority/p0', 'backend', 'frontend'],
        body: `## Description
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
- **Database**: unified_controls, control_frameworks, control_versions, control_tags tables
- **Backend**: UnifiedControlsService, ControlFrameworksService
- **Frontend**: ControlLibrary, ControlBrowser, ControlDetail components
- **API**: GET/POST/PUT/DELETE /controls endpoints

## Dependencies
- Prerequisite for: Control testing, control effectiveness tracking
- Depends on: Policy management (for linking)

## Story Points: 13
## Effort: High`
    },
    {
        priority: 'P0',
        title: '[Epic 5] Asset-Control Integration (Story 5.1)',
        labels: ['epic/integration', 'priority/p0', 'backend', 'frontend'],
        body: `## Description
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
- **Database**: control_asset_mappings, asset_compliance_status tables
- **Backend**: AssetControlService, ComplianceService
- **Frontend**: AssetControlMatrix, AssetComplianceReport components
- **API**: POST/DELETE /controls/:id/assets endpoints
- **Integration**: Asset Management Module

## Dependencies
- Blocks: Asset compliance workflows, control effectiveness metrics
- Depends on: Asset Management module, Control Library

## Story Points: 8
## Effort: Moderate`
    },
    {
        priority: 'P0',
        title: '[Epic 6] Compliance Posture Report (Story 6.1)',
        labels: ['epic/reporting', 'priority/p0', 'backend', 'frontend'],
        body: `## Description
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
- **Backend**: ComplianceReportingService, MetricsAggregationService
- **Frontend**: CompliancePosture, ComplianceTrends, ExportReport components
- **API**: GET /reports/compliance-posture endpoint
- **Database**: compliance_metrics, report_snapshots tables

## Dependencies
- Blocks: Executive dashboard, compliance audit preparation
- Depends on: All governance modules (Policies, Controls, SOPs)

## Story Points: 13
## Effort: High`
    },
    {
        priority: 'P0',
        title: '[Epic 8] Critical Alerts & Escalations (Story 8.3)',
        labels: ['epic/notifications', 'priority/p0', 'backend', 'frontend'],
        body: `## Description
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
- **Database**: alert_rules, alert_definitions, alert_subscriptions tables
- **Backend**: AlertingService, NotificationService, RuleEvaluationEngine
- **Frontend**: AlertPreferences, AlertHistory, RuleBuilder components
- **API**: CRUD endpoints for /alerts and /alert-rules

## Dependencies
- Blocks: Governance workflows, audit readiness
- Depends on: All governance modules for trigger events

## Story Points: 8
## Effort: Moderate`
    },
    // Sample P1 Issues
    {
        priority: 'P1',
        title: '[Epic 2] Policy Exception Management (Story 2.4)',
        labels: ['epic/policy-management', 'priority/p1', 'backend', 'frontend'],
        body: `## Description
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
- **Database**: policy_exceptions, exception_approvals tables
- **Backend**: PolicyExceptionService, ExceptionApprovalService
- **Frontend**: ExceptionForm, ExceptionDashboard, ExceptionReports components
- **API**: CRUD endpoints for /policy-exceptions

## Story Points: 13
## Priority: P1 (Should Have)`
    },
    {
        priority: 'P1',
        title: '[Epic 3] Control Testing Framework (Story 3.6)',
        labels: ['epic/control-library', 'priority/p1', 'backend', 'frontend'],
        body: `## Description
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
- **Database**: control_tests, test_results, test_evidence tables
- **Backend**: ControlTestingService, EffectivenessService
- **Frontend**: TestingDashboard, TestForm, EffectivenessChart components
- **API**: CRUD endpoints for /controls/:id/tests

## Story Points: 8
## Priority: P1 (Should Have)`
    },
    {
        priority: 'P1',
        title: '[Epic 6] Findings & Remediation Tracking (Story 6.7)',
        labels: ['epic/reporting', 'priority/p1', 'backend', 'frontend'],
        body: `## Description
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
- **Database**: findings, remediation_plans, remediation_activities tables
- **Backend**: FindingsService, RemediationService
- **Frontend**: FindingsDashboard, RemediationForm, FindingsReport components
- **API**: CRUD endpoints for /findings

## Story Points: 13
## Priority: P1 (Should Have)`
    },
    // Sample P2 Issues
    {
        priority: 'P2',
        title: '[Epic 3] Control Analytics & Dashboard (Story 3.15)',
        labels: ['epic/control-library', 'priority/p2', 'frontend', 'analytics'],
        body: `## Description
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
- **Frontend**: ControlAnalytics, ControlHeatmap, TrendAnalysis components
- **Backend**: AnalyticsService, PredictionService
- **API**: GET /controls/analytics endpoints

## Story Points: 13
## Priority: P2 (Nice to Have)`
    }
];

async function createIssues() {
    try {
        const token = getGitHubToken();
        const filter = process.argv[2]?.split('=')[1]?.toUpperCase() || '';
        
        console.log('\n📋 GitHub Issues Creator - Governance Module\n');
        console.log('=' .repeat(50));
        
        // Filter issues if specified
        let issuesToCreate = issues;
        if (filter) {
            issuesToCreate = issues.filter(issue => 
                issue.labels.includes(`priority/${filter.toLowerCase()}`)
            );
            console.log(`\n🔍 Filtering for ${filter} issues...\n`);
        }
        
        console.log(`Creating ${issuesToCreate.length} GitHub issues...\n`);
        
        let successCount = 0;
        let failureCount = 0;
        
        for (const issue of issuesToCreate) {
            try {
                console.log(`📝 Creating: ${issue.title}`);
                
                const result = await makeGitHubRequest(
                    'POST',
                    '/repos/mohamedadel0806/Stratagem/issues',
                    {
                        title: issue.title,
                        body: issue.body,
                        labels: issue.labels
                    },
                    token
                );
                
                console.log(`   ✅ Created: ${result.html_url}\n`);
                successCount++;
                
                // Rate limiting: wait 500ms between requests
                await new Promise(resolve => setTimeout(resolve, 500));
                
            } catch (error) {
                console.log(`   ❌ Failed: ${error.message}\n`);
                failureCount++;
            }
        }
        
        // Summary
        console.log('=' .repeat(50));
        console.log(`\n📊 Summary:\n`);
        console.log(`   ✅ Successfully created: ${successCount} issues`);
        console.log(`   ❌ Failed: ${failureCount} issues`);
        console.log(`\n📌 View all issues at:`);
        console.log(`   https://github.com/mohamedadel0806/Stratagem/issues\n`);
        
    } catch (error) {
        console.error('\n❌ Error:', error.message);
        console.error('\n📚 Setup Instructions:');
        console.error('   1. Create a GitHub Personal Access Token:');
        console.error('      https://github.com/settings/tokens');
        console.error('   2. Select scopes: repo (Full control of private repositories)');
        console.error('   3. Set GITHUB_TOKEN environment variable:');
        console.error('      export GITHUB_TOKEN=ghp_xxx...');
        console.error('   OR save token to ~/.github-token\n');
        process.exit(1);
    }
}

// Run
createIssues();
