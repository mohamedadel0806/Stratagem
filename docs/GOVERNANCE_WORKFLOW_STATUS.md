# Governance Module - Workflow Integration Status

**Date:** December 3, 2025  
**Status:** ⚠️ **Workflow System Exists, But NOT Integrated with Governance**

## Current Status

### ✅ Workflow Module Exists

The backend has a **Workflow Module** (`backend/src/workflow/`) that provides:

1. **Workflow Types:**
   - `APPROVAL` - Multi-level approval workflows
   - `NOTIFICATION` - Automated notifications
   - `ESCALATION` - Escalation workflows
   - `STATUS_CHANGE` - Status change workflows
   - `DEADLINE_REMINDER` - Deadline reminder workflows

2. **Supported Entity Types:**
   - `RISK` ✅ (integrated)
   - `POLICY` ✅ (exists in enum, but NOT integrated with Governance policies)
   - `COMPLIANCE_REQUIREMENT` ✅ (integrated)
   - `TASK` ✅ (integrated)

3. **Workflow Features:**
   - Multi-level approvals
   - Approval chains
   - Automatic triggers (on_create, on_update, on_status_change)
   - Deadline reminders
   - Notifications

### ❌ Governance Module Integration

**Status:** NOT INTEGRATED

The Governance module does NOT currently use the Workflow system:

1. **Governance Module:**
   - Does NOT import `WorkflowModule`
   - Does NOT use `WorkflowService`
   - Policies have status fields but no workflow integration
   - No approval workflows for policies
   - No approval workflows for exceptions
   - No approval workflows for evidence

2. **Current Policy Status:**
   - Uses simple enum: `DRAFT`, `IN_REVIEW`, `APPROVED`, `PUBLISHED`, `ARCHIVED`
   - Status changes are direct (no approval workflow)
   - No multi-level approval process
   - No approval history tracking

## Requirements from PRD

The requirements document specifies several workflow needs:

### 1. Policy Approval Workflow
- **FR-POL-015:** Multi-level policy approval workflow
- **FR-POL-016:** Document status tracking (Draft → In Review → Approved → Published)
- **FR-POL-017:** Digital signatures for approval
- **FR-POL-018:** Scheduled review reminders

### 2. Exception Approval Workflow
- **FR-EXC-001:** Exception approval workflow
- **FR-EXC-002:** Track exception status and expiration

### 3. Evidence Approval Workflow
- **FR-EVI-001:** Evidence review and approval
- **FR-EVI-002:** Evidence approval workflow

### 4. Control Implementation Workflow
- Status tracking: Planned → In Progress → Completed
- Approval for control implementation

## What Needs to Be Done

### Priority 1: Policy Approval Workflow

**Integration Steps:**

1. **Import WorkflowModule in GovernanceModule**
   ```typescript
   // backend/src/governance/governance.module.ts
   import { WorkflowModule } from '../workflow/workflow.module';
   
   @Module({
     imports: [
       // ... existing imports
       WorkflowModule,
     ],
   })
   ```

2. **Update Policy Service to Use Workflows**
   ```typescript
   // backend/src/governance/policies/policies.service.ts
   import { WorkflowService } from '../../workflow/services/workflow.service';
   
   // When status changes to IN_REVIEW, trigger approval workflow
   // When status changes to APPROVED, complete workflow
   ```

3. **Create Policy Approval Workflow Templates**
   - Define approval chains (e.g., Owner → Manager → CISO)
   - Set up triggers for status changes
   - Configure notifications

4. **Update Policy Entity (if needed)**
   - Add workflow execution tracking
   - Link to workflow approvals

5. **Frontend Integration**
   - Show approval status on policy detail page
   - Display approval chain
   - Allow approvers to approve/reject
   - Show approval history

### Priority 2: Exception Approval Workflow

Similar integration for policy exceptions:
- Create exception → Trigger approval workflow
- Track approval status
- Notify approvers

### Priority 3: Evidence Approval Workflow

For evidence items:
- Upload evidence → Trigger review workflow
- Reviewer approves/rejects
- Track approval status

## Implementation Plan

### Phase 1: Policy Approval Workflow (Week 1)

**Estimated Time:** 8-10 hours

1. **Backend Integration (4-5 hours)**
   - [ ] Import WorkflowModule in GovernanceModule
   - [ ] Inject WorkflowService in PoliciesService
   - [ ] Create workflow templates for policy approval
   - [ ] Add workflow execution on status changes
   - [ ] Add approval endpoints

2. **Frontend Integration (3-4 hours)**
   - [ ] Add approval UI to policy detail page
   - [ ] Show approval chain and status
   - [ ] Add approve/reject buttons
   - [ ] Display approval history

3. **Testing (1 hour)**
   - [ ] Test approval workflow end-to-end
   - [ ] Test multi-level approvals
   - [ ] Test notifications

### Phase 2: Exception & Evidence Workflows (Week 2)

**Estimated Time:** 6-8 hours

1. **Exception Approval (3-4 hours)**
   - [ ] Integrate workflow for exceptions
   - [ ] Create approval templates
   - [ ] Frontend UI

2. **Evidence Approval (3-4 hours)**
   - [ ] Integrate workflow for evidence
   - [ ] Create approval templates
   - [ ] Frontend UI

### Phase 3: Control Implementation Workflow (Week 3)

**Estimated Time:** 4-6 hours

1. **Control Status Workflow**
   - [ ] Track control implementation status
   - [ ] Approval for control completion
   - [ ] Frontend integration

## Workflow Templates Needed

### Policy Approval Template

```typescript
{
  name: "Policy Approval Workflow",
  type: WorkflowType.APPROVAL,
  trigger: WorkflowTrigger.ON_STATUS_CHANGE,
  entityType: EntityType.POLICY,
  conditions: { status: 'in_review' },
  steps: [
    {
      order: 1,
      approverRole: 'policy_owner',
      required: true,
    },
    {
      order: 2,
      approverRole: 'compliance_manager',
      required: true,
    },
    {
      order: 3,
      approverRole: 'ciso',
      required: true,
    },
  ],
}
```

### Exception Approval Template

```typescript
{
  name: "Policy Exception Approval",
  type: WorkflowType.APPROVAL,
  trigger: WorkflowTrigger.ON_CREATE,
  entityType: EntityType.POLICY_EXCEPTION, // May need to add this
  steps: [
    {
      order: 1,
      approverRole: 'policy_owner',
      required: true,
    },
    {
      order: 2,
      approverRole: 'risk_manager',
      required: true,
    },
  ],
}
```

## Benefits of Integration

1. **Audit Trail:** Complete approval history
2. **Compliance:** Demonstrate proper approval processes
3. **Accountability:** Clear ownership and approval chains
4. **Automation:** Automatic notifications and reminders
5. **Consistency:** Standardized approval processes
6. **Traceability:** Link approvals to policies/controls

## Current Workaround

Until workflows are integrated, Governance uses:
- Simple status enums
- Manual status changes
- No approval tracking
- No approval history

**This is functional but lacks:**
- Multi-level approvals
- Approval history
- Automatic notifications
- Compliance audit trail

## Next Steps

1. ✅ **Assess:** Workflow system exists and is ready
2. ⏭️ **Integrate:** Connect WorkflowModule to GovernanceModule
3. ⏭️ **Implement:** Add approval workflows for policies
4. ⏭️ **Test:** Verify approval workflows work end-to-end
5. ⏭️ **Extend:** Add workflows for exceptions and evidence

## Reference Files

- **Workflow Module:** `backend/src/workflow/`
- **Workflow Service:** `backend/src/workflow/services/workflow.service.ts`
- **Workflow Entity:** `backend/src/workflow/entities/workflow.entity.ts`
- **Governance Policies:** `backend/src/governance/policies/`
- **Requirements:** `docs/Requirments-US-PRD-DB Schema Governance Management Module Integrated with Assets managment.md`





