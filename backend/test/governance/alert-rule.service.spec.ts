import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AlertRuleService } from '../services/alert-rule.service';
import { AlertingService } from '../services/alerting.service';
import { Alert, AlertSeverity, AlertStatus, AlertType } from '../entities/alert.entity';
import {
  AlertRule,
  AlertRuleTriggerType,
  AlertRuleCondition,
} from '../entities/alert-rule.entity';

describe('AlertRuleService', () => {
  let service: AlertRuleService;
  let alertRuleRepository: Repository<AlertRule>;
  let alertRepository: Repository<Alert>;
  let alertingService: AlertingService;

  const mockRule: AlertRule = {
    id: '1',
    name: 'Test Rule',
    description: 'Test Rule Description',
    isActive: true,
    triggerType: AlertRuleTriggerType.TIME_BASED,
    entityType: 'policy',
    fieldName: 'reviewDate',
    condition: AlertRuleCondition.DAYS_OVERDUE,
    conditionValue: '30',
    thresholdValue: 30,
    severityScore: 3,
    alertMessage: 'Policy {{name}} is overdue',
    filters: {},
    createdById: 'user-1',
    createdBy: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AlertRuleService,
        {
          provide: AlertingService,
          useValue: {
            createAlert: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(AlertRule),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Alert),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AlertRuleService>(AlertRuleService);
    alertRuleRepository = module.get<Repository<AlertRule>>(getRepositoryToken(AlertRule));
    alertRepository = module.get<Repository<Alert>>(getRepositoryToken(Alert));
    alertingService = module.get<AlertingService>(AlertingService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('evaluateEntity', () => {
    it('should evaluate active rules against an entity', async () => {
      const entityData = {
        name: 'Security Policy',
        reviewDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 60 days ago
      };

      jest.spyOn(alertRuleRepository, 'find').mockResolvedValue([mockRule]);
      jest.spyOn(alertRepository, 'findOne').mockResolvedValue(null);

      const createdAlert = {
        id: 'alert-1',
        ...mockRule,
      } as any;

      jest.spyOn(alertRepository, 'save').mockResolvedValue(createdAlert);

      const result = await service.evaluateEntity('policy', entityData, 'policy-1');

      expect(result).toBeDefined();
      expect(alertRuleRepository.find).toHaveBeenCalled();
    });

    it('should not generate duplicate alerts for same entity', async () => {
      const entityData = {
        name: 'Security Policy',
        reviewDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
      };

      const existingAlert = { id: 'alert-1' } as Alert;

      jest.spyOn(alertRuleRepository, 'find').mockResolvedValue([mockRule]);
      jest.spyOn(alertRepository, 'findOne').mockResolvedValue(existingAlert);

      const result = await service.evaluateEntity('policy', entityData, 'policy-1');

      expect(result).toHaveLength(0);
    });
  });

  describe('evaluateCondition', () => {
    it('should evaluate EQUALS condition', () => {
      const result = service['evaluateCondition']('active', AlertRuleCondition.EQUALS, 'active');
      expect(result).toBe(true);
    });

    it('should evaluate NOT_EQUALS condition', () => {
      const result = service['evaluateCondition'](
        'active',
        AlertRuleCondition.NOT_EQUALS,
        'inactive',
      );
      expect(result).toBe(true);
    });

    it('should evaluate GREATER_THAN condition', () => {
      const result = service['evaluateCondition'](
        100,
        AlertRuleCondition.GREATER_THAN,
        50,
      );
      expect(result).toBe(true);
    });

    it('should evaluate LESS_THAN condition', () => {
      const result = service['evaluateCondition'](
        30,
        AlertRuleCondition.LESS_THAN,
        50,
      );
      expect(result).toBe(true);
    });

    it('should evaluate CONTAINS condition', () => {
      const result = service['evaluateCondition'](
        'test string',
        AlertRuleCondition.CONTAINS,
        'test',
      );
      expect(result).toBe(true);
    });

    it('should evaluate NOT_CONTAINS condition', () => {
      const result = service['evaluateCondition'](
        'test string',
        AlertRuleCondition.NOT_CONTAINS,
        'missing',
      );
      expect(result).toBe(true);
    });

    it('should evaluate IS_NULL condition', () => {
      const result = service['evaluateCondition'](null, AlertRuleCondition.IS_NULL, null);
      expect(result).toBe(true);
    });

    it('should evaluate IS_NOT_NULL condition', () => {
      const result = service['evaluateCondition'](
        'value',
        AlertRuleCondition.IS_NOT_NULL,
        null,
      );
      expect(result).toBe(true);
    });

    it('should evaluate DAYS_OVERDUE condition', () => {
      const pastDate = new Date(Date.now() - 40 * 24 * 60 * 60 * 1000); // 40 days ago
      const result = service['evaluateCondition'](
        pastDate,
        AlertRuleCondition.DAYS_OVERDUE,
        30,
      );
      expect(result).toBe(true);
    });

    it('should evaluate STATUS_EQUALS condition', () => {
      const result = service['evaluateCondition'](
        'Active',
        AlertRuleCondition.STATUS_EQUALS,
        'active',
      );
      expect(result).toBe(true);
    });
  });

  describe('determineSeverity', () => {
    it('should return CRITICAL for score >= 4', () => {
      const result = service['determineSeverity']({ ...mockRule, severityScore: 4 });
      expect(result).toBe(AlertSeverity.CRITICAL);
    });

    it('should return HIGH for score === 3', () => {
      const result = service['determineSeverity']({ ...mockRule, severityScore: 3 });
      expect(result).toBe(AlertSeverity.HIGH);
    });

    it('should return MEDIUM for score === 2', () => {
      const result = service['determineSeverity']({ ...mockRule, severityScore: 2 });
      expect(result).toBe(AlertSeverity.MEDIUM);
    });

    it('should return LOW for score === 1', () => {
      const result = service['determineSeverity']({ ...mockRule, severityScore: 1 });
      expect(result).toBe(AlertSeverity.LOW);
    });
  });

  describe('determineAlertType', () => {
    it('should return POLICY_REVIEW_OVERDUE for policy entity', () => {
      const result = service['determineAlertType']({ ...mockRule, entityType: 'policy' }, {});
      expect(result).toBe(AlertType.POLICY_REVIEW_OVERDUE);
    });

    it('should return CONTROL_ASSESSMENT_PAST_DUE for control entity', () => {
      const result = service['determineAlertType'](
        { ...mockRule, entityType: 'control' },
        {},
      );
      expect(result).toBe(AlertType.CONTROL_ASSESSMENT_PAST_DUE);
    });

    it('should return SOP_EXECUTION_FAILURE for sop entity', () => {
      const result = service['determineAlertType'](
        { ...mockRule, entityType: 'sop' },
        {},
      );
      expect(result).toBe(AlertType.SOP_EXECUTION_FAILURE);
    });

    it('should return CUSTOM for unknown entity type', () => {
      const result = service['determineAlertType'](
        { ...mockRule, entityType: 'unknown' },
        {},
      );
      expect(result).toBe(AlertType.CUSTOM);
    });
  });

  describe('generateAlertTitle', () => {
    it('should use custom alertMessage if provided', () => {
      const data = { name: 'Security Policy' };
      const rule = { ...mockRule, alertMessage: 'Policy {{name}} is overdue' };
      const result = service['generateAlertTitle'](rule, data);
      expect(result).toBe('Policy Security Policy is overdue');
    });

    it('should generate default title for TIME_BASED trigger', () => {
      const result = service['generateAlertTitle'](mockRule, {});
      expect(result).toContain('overdue');
    });

    it('should generate default title for THRESHOLD_BASED trigger', () => {
      const rule = { ...mockRule, triggerType: AlertRuleTriggerType.THRESHOLD_BASED };
      const result = service['generateAlertTitle'](rule, {});
      expect(result).toContain('threshold exceeded');
    });
  });

  describe('evaluateBatch', () => {
    it('should process multiple entities', async () => {
      const entities = [
        { id: 'entity-1', data: { reviewDate: new Date() } },
        { id: 'entity-2', data: { reviewDate: new Date() } },
      ];

      jest.spyOn(service, 'evaluateEntity').mockResolvedValue([]);

      const result = await service.evaluateBatch('policy', entities);

      expect(result.processed).toBe(2);
      expect(service.evaluateEntity).toHaveBeenCalledTimes(2);
    });

    it('should handle errors gracefully', async () => {
      const entities = [
        { id: 'entity-1', data: { reviewDate: new Date() } },
      ];

      jest
        .spyOn(service, 'evaluateEntity')
        .mockRejectedValue(new Error('Evaluation failed'));

      const result = await service.evaluateBatch('policy', entities);

      expect(result.errors).toBe(1);
    });
  });

  describe('autoResolveAlerts', () => {
    it('should auto-resolve active alerts for resolved entities', async () => {
      const activeAlerts = [
        {
          id: 'alert-1',
          status: AlertStatus.ACTIVE,
          relatedEntityId: 'entity-1',
        } as Alert,
      ];

      jest.spyOn(alertRepository, 'find').mockResolvedValue(activeAlerts);
      jest.spyOn(alertRepository, 'save').mockResolvedValue(activeAlerts[0]);

      const result = await service.autoResolveAlerts('entity-1', 'policy');

      expect(result).toBe(1);
      expect(alertRepository.save).toHaveBeenCalled();
    });
  });

  describe('cleanupOldAlerts', () => {
    it('should delete old dismissed alerts', async () => {
      jest.spyOn(alertRepository, 'delete').mockResolvedValue({ affected: 10 } as any);

      const result = await service.cleanupOldAlerts(90);

      expect(result).toBe(10);
      expect(alertRepository.delete).toHaveBeenCalled();
    });
  });

  describe('time-based evaluation', () => {
    it('should detect overdue items', () => {
      const pastDate = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000); // 60 days ago
      const rule = { ...mockRule, thresholdValue: 30 };
      const entityData = { reviewDate: pastDate };

      const result = service['evaluateTimeBased'](rule, entityData);

      expect(result).toBe(true);
    });

    it('should not trigger for future dates', () => {
      const futureDate = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000); // 10 days from now
      const rule = { ...mockRule, thresholdValue: 30 };
      const entityData = { reviewDate: futureDate };

      const result = service['evaluateTimeBased'](rule, entityData);

      expect(result).toBe(false);
    });
  });

  describe('threshold-based evaluation', () => {
    it('should trigger for values exceeding threshold', () => {
      const rule = { ...mockRule, triggerType: AlertRuleTriggerType.THRESHOLD_BASED, thresholdValue: 80 };
      const entityData = { effectiveness: 90 };

      const result = service['evaluateThresholdBased'](rule, entityData);

      expect(result).toBe(true);
    });

    it('should not trigger for values below threshold', () => {
      const rule = { ...mockRule, triggerType: AlertRuleTriggerType.THRESHOLD_BASED, thresholdValue: 80 };
      const entityData = { effectiveness: 70 };

      const result = service['evaluateThresholdBased'](rule, entityData);

      expect(result).toBe(false);
    });
  });
});
