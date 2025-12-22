# GitHub Issues - Governance Module Implementation

This document explains how to create GitHub issues for the remaining governance module work using the automated scripts provided.

## Quick Start

### Option 1: Using Node.js Script (Recommended)

```bash
# Set your GitHub token
export GITHUB_TOKEN=ghp_xxxxxxxxxxxxx

# Create all issues (P0, P1, P2)
node scripts/create-governance-issues.js

# Create only P0 (critical) issues
node scripts/create-governance-issues.js --filter=p0

# Create only P1 (should-have) issues
node scripts/create-governance-issues.js --filter=p1

# Create only P2 (nice-to-have) issues
node scripts/create-governance-issues.js --filter=p2
```

### Option 2: Using Bash Script (with gh CLI)

```bash
# Requires: gh CLI installed (https://cli.github.com)
bash scripts/create-governance-issues.sh
```

## Setup Requirements

### Step 1: Create GitHub Personal Access Token

1. Go to: https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Give it a descriptive name: "Stratagem Issues Creator"
4. Select scopes:
   - ✅ `repo` (Full control of private repositories)
5. Click "Generate token"
6. Copy the token (starts with `ghp_`)

### Step 2: Set Environment Variable

**Option A: Temporary (current terminal session)**
```bash
export GITHUB_TOKEN=ghp_xxxxxxxxxxxxx
```

**Option B: Permanent (add to ~/.zshrc)**
```bash
echo 'export GITHUB_TOKEN=ghp_xxxxxxxxxxxxx' >> ~/.zshrc
source ~/.zshrc
```

**Option C: Save to file**
```bash
echo "ghp_xxxxxxxxxxxxx" > ~/.github-token
chmod 600 ~/.github-token
```

### Step 3: Run the Script

```bash
cd /Users/adelsayed/Documents/Code/Stratagem
node scripts/create-governance-issues.js
```

## Issues Being Created

### P0 (Must Have) - 5 Critical Stories

#### 1. [Epic 2] Policy Hierarchy & Management (Story 2.1)
- **Points**: 13
- **Status**: Not Started
- **Components**:
  - Policy entity with parent-child relationships
  - Hierarchical policy structure (Framework → Policy → Standard)
  - Policy versioning with change tracking
  - Policy Form component for CRUD
  - Policy List page with hierarchical view
  - Bulk import from CSV/JSON
  - Policy-to-control mapping UI
  - Notification system for reviews

#### 2. [Epic 3] Unified Control Library (Story 3.1)
- **Points**: 13
- **Status**: Not Started
- **Components**:
  - UnifiedControl entity with lifecycle
  - Control domain taxonomy (Security, Compliance, Operational, Risk)
  - Multi-framework mapping (NIST, ISO, SOC2)
  - ControlLibrary browsing interface
  - Control versioning with approval workflow
  - Full-text search for controls
  - Control import from frameworks

#### 3. [Epic 5] Asset-Control Integration (Story 5.1)
- **Points**: 8
- **Status**: Not Started
- **Components**:
  - Control-to-Asset relationship entity
  - Asset control mapping interface
  - Asset-Control Matrix view
  - Bulk asset assignment
  - Control effectiveness tracking by asset
  - Asset Compliance Report by control

#### 4. [Epic 6] Compliance Posture Report (Story 6.1)
- **Points**: 13
- **Status**: Not Started
- **Components**:
  - Compliance scoring algorithm (0-100%)
  - Overall compliance dashboard
  - Framework-specific breakdown (NIST, ISO, SOC2)
  - Control effectiveness aggregation
  - Policy acknowledgment metrics
  - SOP execution compliance tracking
  - Trend analysis (30/60/90 days)
  - PDF export for presentations

#### 5. [Epic 8] Critical Alerts & Escalations (Story 8.3)
- **Points**: 8
- **Status**: Not Started
- **Components**:
  - AlertRule entity with trigger conditions
  - Policy review overdue alerts
  - Control assessment escalation
  - SOP execution failure alerts
  - Audit finding notifications
  - Custom alert rule builder
  - Alert notification preferences
  - Alert delivery (in-app, email, Slack)
  - Alert history and audit log

### P1 (Should Have) - Sample Issues (5 of 19)

#### 1. [Epic 2] Policy Exception Management (Story 2.4)
- **Points**: 13
- Controlled exception handling for policy non-compliance
- Risk assessment scoring for exceptions
- Exception approval workflow

#### 2. [Epic 3] Control Testing Framework (Story 3.6)
- **Points**: 8
- Control testing and effectiveness tracking
- Test scheduling (one-time and recurring)
- Test evidence attachment

#### 3. [Epic 6] Findings & Remediation Tracking (Story 6.7)
- **Points**: 13
- Audit findings tracking
- Remediation action plans
- Deadline tracking with escalation

#### 4. [Epic 7] Role-Based Access Control (Story 7.4)
- **Points**: 13
- Governance-specific roles
- Role-to-permission mapping
- Entity-level access control

#### 5. [Epic 8] Bulk Operations & Automation (Story 8.5)
- **Points**: 8
- Bulk policy acknowledgment assignment
- Bulk control assignment
- Bulk SOP assignment

### P2 (Nice to Have) - Sample Issues (2 of 10)

#### 1. [Epic 3] Control Analytics & Dashboard (Story 3.15)
- **Points**: 13
- Control effectiveness heatmap
- Trend analysis visualization
- Control performance benchmarking

#### 2. [Epic 6] Continuous Monitoring (Story 6.9)
- **Points**: 13
- Real-time control status monitoring
- Automated control health checks
- Anomaly detection

## Issue Label Structure

Issues are tagged with the following labels:

- **Epic Labels**: `epic/policy-management`, `epic/control-library`, `epic/integration`, `epic/reporting`, `epic/notifications`
- **Priority Labels**: `priority/p0`, `priority/p1`, `priority/p2`
- **Type Labels**: `backend`, `frontend`, `database`, `analytics`

## Viewing Created Issues

### GitHub Web Interface
Visit: https://github.com/mohamedadel0806/Stratagem/issues

### Filter by Priority
- **P0 (Critical)**: https://github.com/mohamedadel0806/Stratagem/issues?labels=priority/p0
- **P1 (Should Have)**: https://github.com/mohamedadel0806/Stratagem/issues?labels=priority/p1
- **P2 (Nice to Have)**: https://github.com/mohamedadel0806/Stratagem/issues?labels=priority/p2

### Filter by Epic
- **Policies**: https://github.com/mohamedadel0806/Stratagem/issues?labels=epic/policy-management
- **Controls**: https://github.com/mohamedadel0806/Stratagem/issues?labels=epic/control-library
- **Integration**: https://github.com/mohamedadel0806/Stratagem/issues?labels=epic/integration
- **Reporting**: https://github.com/mohamedadel0806/Stratagem/issues?labels=epic/reporting
- **Notifications**: https://github.com/mohamedadel0806/Stratagem/issues?labels=epic/notifications

## Managing Issues

### Using GitHub CLI

```bash
# List all open P0 issues
gh issue list --label priority/p0

# View specific issue
gh issue view 123

# Create project and add issues
gh project create "Governance Sprint 2"

# Add issue to project
gh issue edit 123 --add-assignee @username

# Close issue
gh issue close 123
```

### Using GitHub Web

1. Click on issue number to open
2. Click "Projects" sidebar to add to project
3. Assign to team members
4. Add to milestone
5. Create related issues

## Issue Workflow

Suggested workflow for issue management:

### 1. Triage (After Creation)
- [ ] Review issue description
- [ ] Validate acceptance criteria
- [ ] Estimate effort
- [ ] Add to current sprint/milestone

### 2. Development
- [ ] Assign to developer
- [ ] Create feature branch: `feature/issue-123-description`
- [ ] Link pull requests to issue
- [ ] Move to "In Progress" column (if using Projects)

### 3. Review
- [ ] Create pull request
- [ ] Request review
- [ ] Link to issue: "Closes #123"
- [ ] Merge to main

### 4. Closure
- [ ] Verify on staging
- [ ] Mark issue as closed
- [ ] Close linked pull requests
- [ ] Move to "Done" column

## Creating a GitHub Project

To organize issues into a workflow:

```bash
# Create project
gh project create "Governance Module - Sprint 2"

# List projects
gh project list

# Add issue to project
gh issue edit 123 --add-project "Governance Module - Sprint 2"
```

Or manually:

1. Go to https://github.com/mohamedadel0806/Stratagem/projects
2. Click "New project"
3. Select "Table" template
4. Add custom fields (Points, Sprint, Owner)
5. Add issues to project
6. Organize into columns: To Do, In Progress, Review, Done

## Customizing Issues

The scripts can be easily modified to:

1. **Add more stories**: Edit the `issues` array in the script
2. **Change labels**: Modify the `labels` property
3. **Add assignees**: Add `assignee` property to issue object
4. **Add milestones**: Add `milestone` property to issue object

### Adding Assignees

In `create-governance-issues.js`, modify issue object:

```javascript
{
    priority: 'P0',
    title: '[Epic 2] Policy Hierarchy & Management (Story 2.1)',
    labels: ['epic/policy-management', 'priority/p0', 'backend', 'frontend'],
    assignee: 'username', // Add this
    milestone: 'Sprint 2', // Add this
    body: '...'
}
```

## Troubleshooting

### "Not Found" Error
- Verify GITHUB_TOKEN is correct
- Verify repository path is correct: `mohamedadel0806/Stratagem`
- Check token expiration: https://github.com/settings/tokens

### "Insufficient Permissions" Error
- Token needs `repo` scope
- Regenerate token with correct scopes

### Rate Limiting
- GitHub API limits to 60 requests/hour (unauthenticated) or 5,000/hour (authenticated)
- Scripts automatically wait between requests
- If hitting limit, wait 1 hour before retrying

## Best Practices

1. **Use Milestones**: Group issues into sprints (Sprint 1, Sprint 2, etc.)
2. **Use Projects**: Create GitHub Projects for workflow visualization
3. **Link Related Issues**: Use "Related issues" for dependencies
4. **Add Code References**: Link to actual code files in issue descriptions
5. **Use Issue Templates**: Create templates for consistency
6. **Regular Reviews**: Review and update issue descriptions as work progresses
7. **Close Early**: Close issues as soon as work is merged, not just when deployed

## Next Steps

1. ✅ Run the issue creation script
2. ✅ Review created issues on GitHub
3. ✅ Create GitHub Project for Sprint planning
4. ✅ Add issues to current sprint
5. ✅ Assign to team members
6. ✅ Start with P0 (critical) issues first

## Support

For more information:
- GitHub Issues API: https://docs.github.com/en/rest/issues
- GitHub CLI Docs: https://cli.github.com/manual
- Governance Module Status: `/docs/GOVERNANCE_USER_STORIES_STATUS.md`
