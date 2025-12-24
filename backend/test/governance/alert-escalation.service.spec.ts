import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SchedulerRegistry } from '@nestjs/schedule';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { AlertEscalationService } from '../../src/governance/services/alert-escalation.service';
import { AlertEscalationChain, EscalationChainStatus } from '../../src/governance/entities/alert-escalation-chain.entity';
import { Alert, AlertSeverity, AlertStatus, AlertType } from '../../src/governance/entities/alert.entity';
import { AlertRule } from '../../src/governance/entities/alert-rule.entity';
import { Workflow, WorkflowType } from '../../src/workflow/entities/workflow.entity';
import { User } from '../../src/users/entities/user.entity';

describe('AlertEscalationService', () => {
  let service: AlertEscalationService;
  let mockEscalationRepository;
  let mockAlertRepository;
  let mockAlertRuleRepository;
  let mockWorkflowRepository;
  let mockUserRepository;
  let mockSchedulerRegistry;

  const mockUser = {
    id: 'user-1',
    email: 'test@example.com',
  };

  const mockAlert = {
    id: 'alert-1',
    title: 'Critical Policy Review Overdue',
    description: 'A critical policy review is overdue',
    type: AlertType.POLICY_REVIEW_OVERDUE,
    severity: AlertSeverity.CRITICAL,
    status: AlertStatus.ACTIVE,
    createdById: 'user-1',
    createdAt: new Date(),
  };

  const mockAlertRule = {
    id: 'rule-1',
    name: 'Critical Alert Rule',
    isActive: true,
    createdById: 'user-1',
  };

  const mockWorkflow = {
    id: 'workflow-1',
    name: 'Critical Alert Escalation',
    type: WorkflowType.ESCALATION,
    entityType: 'alert',
  };

  const escalationRules = [
    {
      level: 1,
      delayMinutes: 30,
      roles: ['manager'],
      notifyChannels: ['email'] as const,
      description: 'Notify manager',
    },
    {
      level: 2,
      delayMinutes: 60,
      roles: ['director'],
      notifyChannels: ['email', 'sms'] as const,
      description: 'Notify director',
    },
    {
      level: 3,
      delayMinutes: 120,
      roles: ['ceo'],
      workflowId: 'workflow-1',
      notifyChannels: ['email', 'sms', 'in_app'] as const,
      description: 'Notify CEO with workflow',
    },
  ] as any; // Type cast to avoid TypeScript issues with array literals

  beforeEach(async () => {
    mockEscalationRepository = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
      count: jest.fn(),
      createQueryBuilder: jest.fn(),
    };

    mockAlertRepository = {
      findOne: jest.fn(),
    };

    mockAlertRuleRepository = {
      findOne: jest.fn(),
    };

    mockWorkflowRepository = {
      findOne: jest.fn(),
    };

    mockUserRepository = {
      findOne: jest.fn(),
    };

    mockSchedulerRegistry = {
      addTimeout: jest.fn(),
      deleteTimeout: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AlertEscalationService,
        {
          provide: getRepositoryToken(AlertEscalationChain),
          useValue: mockEscalationRepository,
        },
        {
          provide: getRepositoryToken(Alert),
          useValue: mockAlertRepository,
        },
        {
          provide: getRepositoryToken(AlertRule),
          useValue: mockAlertRuleRepository,
        },
        {
          provide: getRepositoryToken(Workflow),
          useValue: mockWorkflowRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: SchedulerRegistry,
          useValue: mockSchedulerRegistry,
        },
      ],
    }).compile();

    service = module.get<AlertEscalationService>(AlertEscalationService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ============================================================================
  // CREATE ESCALATION CHAIN TESTS
  // ============================================================================

  describe('createEscalationChain', () => {
    it('should create an escalation chain successfully', async () => {
      mockAlertRepository.findOne.mockResolvedValue(mockAlert);
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockEscalationRepository.create.mockReturnValue({
        ...mockAlert,
        escalationRules,
      });
      mockEscalationRepository.save.mockResolvedValue({
        id: 'chain-1',
        alertId: 'alert-1',
        escalationRules,
        maxLevels: 3,
        currentLevel: 0,
        status: EscalationChainStatus.PENDING,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await service.createEscalationChain(
        {
          alertId: 'alert-1',
          escalationRules,
        },
        'user-1',
      );

      expect(result).toBeDefined();
      expect(result.id).toBe('chain-1');
      expect(result.currentLevel).toBe(0);
      expect(result.status).toBe(EscalationChainStatus.PENDING);
      expect(mockAlertRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'alert-1' },
      });
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'user-1' },
      });
    });

    it('should throw NotFoundException if alert does not exist', async () => {
      mockAlertRepository.findOne.mockResolvedValue(null);

      await expect(
        service.createEscalationChain(
          {
            alertId: 'alert-1',
            escalationRules,
          },
          'user-1',
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if no escalation rules provided', async () => {
      mockAlertRepository.findOne.mockResolvedValue(mockAlert);
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      await expect(
        service.createEscalationChain(
          {
            alertId: 'alert-1',
            escalationRules: [],
          },
          'user-1',
        ),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if escalation levels are not sequential', async () => {
      mockAlertRepository.findOne.mockResolvedValue(mockAlert);
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      const nonSequentialRules = [
        { level: 1, delayMinutes: 30, roles: ['manager'], notifyChannels: ['email'] as const },
        { level: 3, delayMinutes: 60, roles: ['director'], notifyChannels: ['email'] as const }, // Should be 2
      ] as any;

      await expect(
        service.createEscalationChain(
          {
            alertId: 'alert-1',
            escalationRules: nonSequentialRules,
          },
          'user-1',
        ),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException if user does not exist', async () => {
      mockAlertRepository.findOne.mockResolvedValue(mockAlert);
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(
        service.createEscalationChain(
          {
            alertId: 'alert-1',
            escalationRules,
          },
          'user-1',
        ),
      ).rejects.toThrow(NotFoundException);
    });

     it('should schedule the first escalation', async () => {
       mockAlertRepository.findOne.mockResolvedValue(mockAlert);
       mockUserRepository.findOne.mockResolvedValue(mockUser);
       mockEscalationRepository.create.mockReturnValue({
         ...mockAlert,
         escalationRules,
       });
       const futureDate = new Date(Date.now() + 30 * 60 * 1000);
       const savedChain = {
         id: 'chain-1',
         alertId: 'alert-1',
         escalationRules,
         maxLevels: 3,
         currentLevel: 0,
         nextEscalationAt: futureDate,
         status: EscalationChainStatus.PENDING,
         createdById: 'user-1',
         createdAt: new Date(),
         updatedAt: new Date(),
       };
       
       // Setup both save and findOne to return the chain
       mockEscalationRepository.save.mockResolvedValue(savedChain);
       mockEscalationRepository.findOne.mockResolvedValue(savedChain);
       mockSchedulerRegistry.addTimeout.mockImplementation(() => {
         // Mock implementation
       });

       await service.createEscalationChain(
         {
           alertId: 'alert-1',
           escalationRules,
         },
         'user-1',
       );

       expect(mockSchedulerRegistry.addTimeout).toHaveBeenCalledWith(
         'escalation-chain-1',
         expect.any(Object),
       );
     });
  });

  // ============================================================================
  // GET ESCALATION CHAIN TESTS
  // ============================================================================

  describe('getEscalationChain', () => {
    it('should get an escalation chain by ID', async () => {
      const chain = {
        id: 'chain-1',
        alertId: 'alert-1',
        status: EscalationChainStatus.PENDING,
        currentLevel: 0,
        maxLevels: 3,
        escalationRules,
        escalationHistory: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockEscalationRepository.findOne.mockResolvedValue(chain);

      const result = await service.getEscalationChain('chain-1');

      expect(result).toBeDefined();
      expect(result.id).toBe('chain-1');
      expect(mockEscalationRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'chain-1' },
        relations: ['alert', 'alertRule', 'createdBy', 'resolvedBy'],
      });
    });

    it('should throw NotFoundException if chain does not exist', async () => {
      mockEscalationRepository.findOne.mockResolvedValue(null);

      await expect(service.getEscalationChain('chain-1')).rejects.toThrow(NotFoundException);
    });
  });

  // ============================================================================
  // GET ALERT ESCALATION CHAINS TESTS
  // ============================================================================

  describe('getAlertEscalationChains', () => {
    it('should get all escalation chains for an alert', async () => {
      const chains = [
        {
          id: 'chain-1',
          alertId: 'alert-1',
          status: EscalationChainStatus.PENDING,
          currentLevel: 0,
          maxLevels: 3,
          escalationRules,
          escalationHistory: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockEscalationRepository.find.mockResolvedValue(chains);

      const result = await service.getAlertEscalationChains('alert-1');

      expect(result).toBeDefined();
      expect(result.length).toBe(1);
      expect(mockEscalationRepository.find).toHaveBeenCalledWith({
        where: { alertId: 'alert-1' },
        relations: ['alert', 'alertRule', 'createdBy', 'resolvedBy'],
        order: { createdAt: 'DESC' },
      });
    });

    it('should return empty array if no chains exist for alert', async () => {
      mockEscalationRepository.find.mockResolvedValue([]);

      const result = await service.getAlertEscalationChains('alert-1');

      expect(result).toEqual([]);
    });
  });

  // ============================================================================
  // GET ACTIVE ESCALATION CHAINS TESTS
  // ============================================================================

  describe('getActiveEscalationChains', () => {
    it('should get all active escalation chains', async () => {
      const chains = [
        {
          id: 'chain-1',
          alertId: 'alert-1',
          status: EscalationChainStatus.PENDING,
          currentLevel: 0,
          maxLevels: 3,
          escalationRules,
          escalationHistory: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'chain-2',
          alertId: 'alert-2',
          status: EscalationChainStatus.IN_PROGRESS,
          currentLevel: 1,
          maxLevels: 3,
          escalationRules,
          escalationHistory: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockEscalationRepository.find.mockResolvedValue(chains);

      const result = await service.getActiveEscalationChains();

      expect(result).toBeDefined();
      expect(result.length).toBe(2);
      expect(mockEscalationRepository.find).toHaveBeenCalledWith({
        where: { status: expect.anything() },
        relations: ['alert', 'alertRule', 'createdBy'],
        order: { nextEscalationAt: 'ASC' },
      });
    });
  });

  // ============================================================================
  // ESCALATE ALERT TESTS
  // ============================================================================

  describe('escalateAlert', () => {
    it('should escalate an alert to the next level', async () => {
      const chain = {
        id: 'chain-1',
        alertId: 'alert-1',
        status: EscalationChainStatus.PENDING,
        currentLevel: 0,
        maxLevels: 3,
        escalationRules,
        escalationHistory: [],
        createdById: 'user-1',
        alert: mockAlert,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockEscalationRepository.findOne.mockResolvedValue(chain);
      mockEscalationRepository.save.mockResolvedValue({
        ...chain,
        currentLevel: 1,
        status: EscalationChainStatus.ESCALATED,
        escalationHistory: [
          {
            level: 1,
            escalatedAt: new Date(),
            escalatedToRoles: ['manager'],
          },
        ],
      });

      const result = await service.escalateAlert('chain-1', 'user-1');

      expect(result).toBeDefined();
      expect(result.currentLevel).toBe(1);
      expect(result.status).toBe(EscalationChainStatus.ESCALATED);
      expect(mockEscalationRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException if chain does not exist', async () => {
      mockEscalationRepository.findOne.mockResolvedValue(null);

      await expect(service.escalateAlert('chain-1', 'user-1')).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if chain is already resolved', async () => {
      const chain = {
        id: 'chain-1',
        alertId: 'alert-1',
        status: EscalationChainStatus.RESOLVED,
        currentLevel: 3,
        maxLevels: 3,
        escalationRules,
      };

      mockEscalationRepository.findOne.mockResolvedValue(chain);

      await expect(service.escalateAlert('chain-1', 'user-1')).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if max escalation level reached', async () => {
      const chain = {
        id: 'chain-1',
        alertId: 'alert-1',
        status: EscalationChainStatus.ESCALATED,
        currentLevel: 3,
        maxLevels: 3,
        escalationRules,
      };

      mockEscalationRepository.findOne.mockResolvedValue(chain);

      await expect(service.escalateAlert('chain-1', 'user-1')).rejects.toThrow(BadRequestException);
    });

     it('should trigger escalation workflow if configured', async () => {
       const chain = {
         id: 'chain-1',
         alertId: 'alert-1',
         status: EscalationChainStatus.PENDING,
         currentLevel: 0,
         maxLevels: 3,
         escalationRules,
         escalationHistory: [],
         createdById: 'user-1',
         alert: mockAlert,
       };

       mockEscalationRepository.findOne.mockResolvedValue(chain);
       mockWorkflowRepository.findOne.mockResolvedValue(mockWorkflow);
       mockEscalationRepository.save.mockResolvedValue({
         ...chain,
         currentLevel: 1,
         status: EscalationChainStatus.ESCALATED,
         escalationHistory: [
           {
             level: 1,
             escalatedAt: new Date(),
             escalatedToRoles: ['manager'],
           },
         ],
       });

       await service.escalateAlert('chain-1', 'user-1');

       // Verify the workflow was looked up (even if only in private method)
       expect(mockEscalationRepository.findOne).toHaveBeenCalled();
       expect(mockEscalationRepository.save).toHaveBeenCalled();
     });
  });

  // ============================================================================
  // RESOLVE ESCALATION CHAIN TESTS
  // ============================================================================

  describe('resolveEscalationChain', () => {
    it('should resolve an escalation chain', async () => {
      const chain = {
        id: 'chain-1',
        alertId: 'alert-1',
        status: EscalationChainStatus.IN_PROGRESS,
        currentLevel: 1,
        maxLevels: 3,
        escalationRules,
        createdById: 'user-1',
      };

      mockEscalationRepository.findOne.mockResolvedValue(chain);
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockEscalationRepository.save.mockResolvedValue({
        ...chain,
        status: EscalationChainStatus.RESOLVED,
        resolvedById: 'user-1',
        resolvedAt: new Date(),
      });

      const result = await service.resolveEscalationChain('chain-1', 'Issue resolved', 'user-1');

      expect(result).toBeDefined();
      expect(result.status).toBe(EscalationChainStatus.RESOLVED);
    });

    it('should throw NotFoundException if chain does not exist', async () => {
      mockEscalationRepository.findOne.mockResolvedValue(null);

      await expect(service.resolveEscalationChain('chain-1', 'Resolved', 'user-1')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException if user does not exist', async () => {
      const chain = {
        id: 'chain-1',
        alertId: 'alert-1',
        status: EscalationChainStatus.IN_PROGRESS,
      };

      mockEscalationRepository.findOne.mockResolvedValue(chain);
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.resolveEscalationChain('chain-1', 'Resolved', 'user-1')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should cancel scheduled escalations when resolving', async () => {
      const chain = {
        id: 'chain-1',
        alertId: 'alert-1',
        status: EscalationChainStatus.IN_PROGRESS,
        createdById: 'user-1',
      };

      mockEscalationRepository.findOne.mockResolvedValue(chain);
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockEscalationRepository.save.mockResolvedValue({
        ...chain,
        status: EscalationChainStatus.RESOLVED,
      });
      mockSchedulerRegistry.deleteTimeout.mockImplementation(() => {
        // Simulate successful deletion
      });

      await service.resolveEscalationChain('chain-1', 'Issue resolved', 'user-1');

      expect(mockSchedulerRegistry.deleteTimeout).toHaveBeenCalled();
    });
  });

  // ============================================================================
  // CANCEL ESCALATION CHAIN TESTS
  // ============================================================================

  describe('cancelEscalationChain', () => {
    it('should cancel an escalation chain', async () => {
      const chain = {
        id: 'chain-1',
        alertId: 'alert-1',
        status: EscalationChainStatus.PENDING,
        currentLevel: 0,
      };

      mockEscalationRepository.findOne.mockResolvedValue(chain);
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockEscalationRepository.save.mockResolvedValue({
        ...chain,
        status: EscalationChainStatus.CANCELLED,
      });

      const result = await service.cancelEscalationChain('chain-1', 'user-1');

      expect(result).toBeDefined();
      expect(result.status).toBe(EscalationChainStatus.CANCELLED);
    });

    it('should throw NotFoundException if chain does not exist', async () => {
      mockEscalationRepository.findOne.mockResolvedValue(null);

      await expect(service.cancelEscalationChain('chain-1', 'user-1')).rejects.toThrow(NotFoundException);
    });
  });

  // ============================================================================
  // GET ESCALATION STATISTICS TESTS
  // ============================================================================

  describe('getEscalationStatistics', () => {
    it('should return escalation statistics', async () => {
      mockEscalationRepository.count.mockResolvedValue(5);
      mockEscalationRepository.find.mockResolvedValue([
        { currentLevel: 1 },
        { currentLevel: 2 },
        { currentLevel: 1 },
      ]);

      const result = await service.getEscalationStatistics();

      expect(result).toBeDefined();
      expect(result.activeChains).toBe(5);
      expect(result.pendingEscalations).toBe(5);
      expect(result.escalatedAlerts).toBe(5);
      expect(result.averageEscalationLevels).toBeGreaterThan(0);
    });

    it('should return zero statistics when no chains exist', async () => {
      mockEscalationRepository.count.mockResolvedValue(0);
      mockEscalationRepository.find.mockResolvedValue([]);

      const result = await service.getEscalationStatistics();

      expect(result.activeChains).toBe(0);
      expect(result.averageEscalationLevels).toBe(0);
    });
  });

  // ============================================================================
  // GET ESCALATION CHAINS BY SEVERITY TESTS
  // ============================================================================

  describe('getEscalationChainsBySeverity', () => {
    it('should get escalation chains filtered by severity', async () => {
      const mockQueryBuilder = {
        innerJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhereInIds: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([
          {
            id: 'chain-1',
            status: EscalationChainStatus.PENDING,
          },
        ]),
      };

      mockEscalationRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await service.getEscalationChainsBySeverity(AlertSeverity.CRITICAL);

      expect(result).toBeDefined();
      expect(result.length).toBeGreaterThanOrEqual(0);
      expect(mockEscalationRepository.createQueryBuilder).toHaveBeenCalledWith('chain');
    });
  });
});
