# Story 8.3 - Quick Start Guide for Next Session

## 📍 Current Status
- **Frontend**: ✅ 100% COMPLETE (4 components, 1,832 lines)
- **API Client**: ✅ 100% COMPLETE (18 methods)
- **Backend**: ⏳ 0% COMPLETE (needs implementation)
- **Overall**: 75% COMPLETE

## 🎯 Next Session Focus: Backend Implementation

## 📝 Files to Create (In Order)

### 1. AlertingService (Estimated: 300-400 lines)
**Path**: `backend/src/governance/services/alerting.service.ts`

**Key Methods**:
```typescript
class AlertingService {
  // Alert Management
  createAlert(data: CreateAlertDto): Promise<Alert>
  getAlert(id: string): Promise<Alert>
  getAlerts(filters: AlertFilterDto): Promise<{alerts, total}>
  updateAlert(id: string, data: Partial<UpdateAlertDto>): Promise<Alert>
  deleteAlert(id: string): Promise<void>
  
  // Alert Actions
  acknowledgeAlert(id: string, userId: string): Promise<Alert>
  resolveAlert(id: string, userId: string, notes?: string): Promise<Alert>
  dismissAlert(id: string): Promise<Alert>
  markAllAsAcknowledged(userId: string): Promise<number>
  
  // Queries
  getRecentCriticalAlerts(limit: number): Promise<Alert[]>
  getAlertStatistics(): Promise<AlertStatistics>
  
  // Rule Matching (triggered by rules)
  evaluateAlertRules(): Promise<void>
  createAlertsFromRule(rule: AlertRule): Promise<Alert[]>
}
```

### 2. AlertRuleService (Estimated: 250-350 lines)
**Path**: `backend/src/governance/services/alert-rule.service.ts`

**Key Methods**:
```typescript
class AlertRuleService {
  // Rule Management
  createRule(data: CreateAlertRuleDto): Promise<AlertRule>
  getRule(id: string): Promise<AlertRule>
  getRules(filters: AlertRuleFilterDto): Promise<{rules, total}>
  updateRule(id: string, data: Partial<UpdateAlertRuleDto>): Promise<AlertRule>
  deleteRule(id: string): Promise<void>
  
  // Rule Operations
  toggleRule(id: string, isActive: boolean): Promise<AlertRule>
  testRule(id: string): Promise<{matched_count, sample_alerts}>
  evaluateRule(rule: AlertRule): Promise<any[]>
  
  // Queries
  getActiveRules(): Promise<AlertRule[]>
  getRuleStatistics(): Promise<AlertRuleStatistics>
  
  // Rule Matching Logic
  matchesCondition(value: any, condition: AlertRuleCondition, expectedValue: any): boolean
  matchesTimeBasedTrigger(daysOverdue: number, threshold: number): boolean
}
```

### 3. AlertingController (Estimated: 200-300 lines)
**Path**: `backend/src/governance/controllers/alerting.controller.ts`

**Endpoints**:
```
POST   /api/v1/governance/alerts
GET    /api/v1/governance/alerts/:id
GET    /api/v1/governance/alerts
PATCH  /api/v1/governance/alerts/:id/acknowledge
PATCH  /api/v1/governance/alerts/:id/resolve
PATCH  /api/v1/governance/alerts/:id/dismiss
PATCH  /api/v1/governance/alerts/mark-all-acknowledged
DELETE /api/v1/governance/alerts/:id
GET    /api/v1/governance/alerts/recent/critical
GET    /api/v1/governance/alerts/statistics

POST   /api/v1/governance/alert-rules
GET    /api/v1/governance/alert-rules/:id
GET    /api/v1/governance/alert-rules
PATCH  /api/v1/governance/alert-rules/:id
PATCH  /api/v1/governance/alert-rules/:id/toggle
POST   /api/v1/governance/alert-rules/:id/test
DELETE /api/v1/governance/alert-rules/:id
GET    /api/v1/governance/alert-rules/statistics
```

### 4. Unit Tests (Estimated: 400-500 lines)
**Path**: `backend/test/governance/alerting.service.spec.ts`

**Test Suites**:
- AlertingService creation tests
- AlertingService query tests
- AlertingService action tests
- AlertRuleService tests
- Rule matching logic tests
- Integration between services

## 🚀 Implementation Checklist

### Step 1: Create Services
- [ ] Create AlertingService
- [ ] Implement all methods
- [ ] Add dependency injection
- [ ] Add error handling

- [ ] Create AlertRuleService
- [ ] Implement all methods
- [ ] Add rule matching logic
- [ ] Add error handling

### Step 2: Create Controller
- [ ] Create AlertingController
- [ ] Add JWT authentication
- [ ] Add audit logging
- [ ] Implement all endpoints
- [ ] Add input validation

### Step 3: Database Setup
- [ ] Run Alert migration (should already exist)
- [ ] Run AlertRule migration (should already exist)
- [ ] Verify table structures
- [ ] Create database indexes

### Step 4: Tests
- [ ] Create test file
- [ ] Write service tests
- [ ] Write controller tests
- [ ] Achieve 80%+ coverage
- [ ] Run tests: `npm run test`

### Step 5: Integration
- [ ] Add services to module
- [ ] Add controller to module
- [ ] Test with frontend components
- [ ] Verify all endpoints work
- [ ] Check error handling

### Step 6: Documentation
- [ ] Add inline code comments
- [ ] Document API endpoints
- [ ] Create usage examples
- [ ] Update README

## 📚 Reference Files

### Frontend Components (Ready):
- `frontend/src/components/governance/alerts-list.tsx`
- `frontend/src/components/governance/alert-detail.tsx`
- `frontend/src/components/governance/alert-rules-list.tsx`
- `frontend/src/components/governance/alert-notification-widget.tsx`

### API Client Methods (Ready):
- `frontend/src/lib/api/governance.ts` (lines 4609-4643)

### Type Definitions (Ready):
- Alert types: lines 1420-1443
- AlertRule types: lines 1515-1538
- Enums: AlertSeverity, AlertStatus, AlertType, AlertRuleTriggerType, AlertRuleCondition

### Existing Backend Patterns:
- `backend/src/governance/compliance-reporting/services/compliance-reporting.service.ts` - Good example
- `backend/src/governance/policies/policies.service.ts` - Good example for CRUD
- `backend/src/governance/governance.module.ts` - Module setup reference

## ⏱️ Time Estimates

| Task | Estimate | Actual |
|------|----------|--------|
| AlertingService | 2-3 hours | |
| AlertRuleService | 2-3 hours | |
| AlertingController | 1-2 hours | |
| Unit Tests | 2-3 hours | |
| Integration Testing | 1-2 hours | |
| **Total** | **8-13 hours** | |

## 🔧 Development Tips

### 1. Follow Existing Patterns
- Look at ComplianceReportingService for patterns
- Use similar error handling
- Follow same code style

### 2. Test Early and Often
- Write tests alongside implementation
- Run tests after each section
- Use TDD approach if possible

### 3. Database Queries
- Use TypeORM repository pattern
- Add proper indexes
- Handle pagination correctly
- Use query optimization

### 4. API Design
- Use consistent HTTP methods (POST, GET, PATCH, DELETE)
- Follow RESTful conventions
- Proper status codes (200, 201, 400, 404, 500)
- Include audit logging

### 5. Error Handling
- Use NestJS exceptions (NotFoundException, BadRequestException)
- Proper error messages
- Log errors for debugging
- Return meaningful responses

## 🧪 Testing Strategy

### Unit Tests:
1. Service instantiation
2. CRUD operations
3. Business logic (rule matching)
4. Error cases
5. Edge cases

### Integration Tests:
1. Service + Repository integration
2. Controller + Service integration
3. Database operations
4. Error scenarios

### Manual Testing with Frontend:
1. Test each component
2. Test all CRUD operations
3. Test filtering and pagination
4. Test error states
5. Test loading states

## 📋 Module Integration

Add to `backend/src/governance/governance.module.ts`:

```typescript
import { AlertingService } from './services/alerting.service';
import { AlertRuleService } from './services/alert-rule.service';
import { AlertingController } from './controllers/alerting.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Alert, AlertRule, ...])],
  providers: [AlertingService, AlertRuleService, ...],
  controllers: [AlertingController, ...],
  exports: [AlertingService, AlertRuleService],
})
export class GovernanceModule {}
```

## ✅ Definition of Done

Story 8.3 is complete when:
- [ ] AlertingService fully implemented with 15+ methods
- [ ] AlertRuleService fully implemented with 10+ methods
- [ ] AlertingController with all 18 endpoints
- [ ] Unit tests: 80%+ coverage
- [ ] All tests passing (npm run test)
- [ ] Frontend components working with backend
- [ ] Pagination and filtering working
- [ ] Error handling tested
- [ ] Documentation complete
- [ ] Code reviewed and merged

## 🎓 Key Learnings from Frontend

Frontend expectations:
1. Pagination: offset-based with page/limit
2. Filters: support multi-field filtering
3. Timestamps: ISO 8601 format
4. User data: Include id, first_name, last_name
5. Error responses: Include error message
6. Stats: Return counts by type/severity/status

## 📞 Questions to Answer Before Starting

1. How should alerts be auto-created from rules?
2. Should rule evaluation run on schedule or on-demand?
3. What about alert notifications (email, Slack)?
4. Should alerts have assignees?
5. Should there be alert escalation workflows?

## 🚀 Success Criteria

After backend implementation:
- Frontend components display real data
- All CRUD operations work
- Filtering and pagination function correctly
- Error cases handled gracefully
- Unit tests passing
- Code ready for production

---

**Estimated Session Duration**: 8-13 hours  
**Difficulty Level**: Medium (Entity-service pattern is familiar)  
**Dependencies**: None (all entities/DTOs already created)  
**Next Story After**: Story 8.4 or Story 9.1

Good luck! 🚀
