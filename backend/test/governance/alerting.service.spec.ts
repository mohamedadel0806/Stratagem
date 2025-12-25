import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AlertingService } from '../services/alerting.service';
import { Alert, AlertSeverity, AlertStatus, AlertType } from '../entities/alert.entity';
import { User } from '../../users/entities/user.entity';
import {
  CreateAlertDto,
  UpdateAlertDto,
} from '../dto/alert.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('AlertingService', () => {
  let service: AlertingService;
  let alertRepository: Repository<Alert>;
  let userRepository: Repository<User>;

  const mockAlert: Alert = {
    id: '1',
    title: 'Test Alert',
    description: 'Test Description',
    type: AlertType.POLICY_REVIEW_OVERDUE,
    severity: AlertSeverity.HIGH,
    status: AlertStatus.ACTIVE,
    metadata: {},
    relatedEntityId: 'entity-1',
    relatedEntityType: 'policy',
    createdById: 'user-1',
    createdBy: null,
    acknowledgedById: null,
    acknowledgedBy: null,
    acknowledgedAt: null,
    resolvedById: null,
    resolvedBy: null,
    resolvedAt: null,
    resolutionNotes: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockUser: User = {
    id: 'user-1',
    email: 'test@example.com',
  } as User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AlertingService,
        {
          provide: getRepositoryToken(Alert),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            findAndCount: jest.fn(),
            find: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AlertingService>(AlertingService);
    alertRepository = module.get<Repository<Alert>>(getRepositoryToken(Alert));
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createAlert', () => {
    it('should create a new alert', async () => {
      const createAlertDto: CreateAlertDto = {
        title: 'Test Alert',
        description: 'Test Description',
        type: AlertType.POLICY_REVIEW_OVERDUE,
        severity: AlertSeverity.HIGH,
      };

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(alertRepository, 'create').mockReturnValue(mockAlert);
      jest.spyOn(alertRepository, 'save').mockResolvedValue(mockAlert);

      const result = await service.createAlert(createAlertDto, 'user-1');

      expect(result).toEqual({
        id: mockAlert.id,
        title: mockAlert.title,
        description: mockAlert.description,
        type: mockAlert.type,
        severity: mockAlert.severity,
        status: mockAlert.status,
        relatedEntityId: mockAlert.relatedEntityId,
        relatedEntityType: mockAlert.relatedEntityType,
        metadata: mockAlert.metadata,
        createdAt: mockAlert.createdAt,
        updatedAt: mockAlert.updatedAt,
      });
      expect(alertRepository.create).toHaveBeenCalled();
      expect(alertRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException if user not found', async () => {
      const createAlertDto: CreateAlertDto = {
        title: 'Test Alert',
        description: 'Test Description',
        type: AlertType.POLICY_REVIEW_OVERDUE,
        severity: AlertSeverity.HIGH,
      };

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      await expect(service.createAlert(createAlertDto, 'invalid-user')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getAlert', () => {
    it('should retrieve a single alert by ID', async () => {
      jest.spyOn(alertRepository, 'findOne').mockResolvedValue(mockAlert);

      const result = await service.getAlert('1');

      expect(result).toBeDefined();
      expect(result.id).toBe('1');
      expect(alertRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
        relations: ['createdBy', 'acknowledgedBy', 'resolvedBy'],
      });
    });

    it('should throw NotFoundException if alert not found', async () => {
      jest.spyOn(alertRepository, 'findOne').mockResolvedValue(null);

      await expect(service.getAlert('invalid-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('getAlerts', () => {
    it('should return alerts with pagination', async () => {
      jest.spyOn(alertRepository, 'findAndCount').mockResolvedValue([[mockAlert], 1]);

      const result = await service.getAlerts({ page: 1, limit: 10 });

      expect(result.alerts).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(alertRepository.findAndCount).toHaveBeenCalled();
    });

    it('should filter alerts by status', async () => {
      jest.spyOn(alertRepository, 'findAndCount').mockResolvedValue([[mockAlert], 1]);

      await service.getAlerts({ status: AlertStatus.ACTIVE });

      expect(alertRepository.findAndCount).toHaveBeenCalled();
    });

    it('should filter alerts by severity', async () => {
      jest.spyOn(alertRepository, 'findAndCount').mockResolvedValue([[mockAlert], 1]);

      await service.getAlerts({ severity: AlertSeverity.HIGH });

      expect(alertRepository.findAndCount).toHaveBeenCalled();
    });
  });

  describe('acknowledgeAlert', () => {
    it('should acknowledge an active alert', async () => {
      const activeAlert = { ...mockAlert, status: AlertStatus.ACTIVE };
      const acknowledgedAlert = {
        ...activeAlert,
        status: AlertStatus.ACKNOWLEDGED,
        acknowledgedById: 'user-1',
        acknowledgedAt: new Date(),
      };

      jest.spyOn(alertRepository, 'findOne').mockResolvedValue(activeAlert);
      jest.spyOn(alertRepository, 'save').mockResolvedValue(acknowledgedAlert as Alert);

      const result = await service.acknowledgeAlert('1', 'user-1');

      expect(result.status).toBe(AlertStatus.ACKNOWLEDGED);
      expect(alertRepository.save).toHaveBeenCalled();
    });

    it('should throw BadRequestException if alert is already resolved', async () => {
      const resolvedAlert = { ...mockAlert, status: AlertStatus.RESOLVED };
      jest.spyOn(alertRepository, 'findOne').mockResolvedValue(resolvedAlert);

      await expect(service.acknowledgeAlert('1', 'user-1')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw NotFoundException if alert does not exist', async () => {
      jest.spyOn(alertRepository, 'findOne').mockResolvedValue(null);

      await expect(service.acknowledgeAlert('invalid-id', 'user-1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('resolveAlert', () => {
    it('should resolve an alert with notes', async () => {
      const activeAlert = { ...mockAlert, status: AlertStatus.ACTIVE };
      const resolvedAlert = {
        ...activeAlert,
        status: AlertStatus.RESOLVED,
        resolvedById: 'user-1',
        resolvedAt: new Date(),
        resolutionNotes: 'Issue fixed',
      };

      jest.spyOn(alertRepository, 'findOne').mockResolvedValue(activeAlert);
      jest.spyOn(alertRepository, 'save').mockResolvedValue(resolvedAlert as Alert);

      const result = await service.resolveAlert('1', 'user-1', 'Issue fixed');

      expect(result.status).toBe(AlertStatus.RESOLVED);
      expect(result.resolutionNotes).toBe('Issue fixed');
      expect(alertRepository.save).toHaveBeenCalled();
    });

    it('should throw BadRequestException if trying to resolve dismissed alert', async () => {
      const dismissedAlert = { ...mockAlert, status: AlertStatus.DISMISSED };
      jest.spyOn(alertRepository, 'findOne').mockResolvedValue(dismissedAlert);

      await expect(service.resolveAlert('1', 'user-1')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('dismissAlert', () => {
    it('should dismiss an alert', async () => {
      const dismissedAlert = { ...mockAlert, status: AlertStatus.DISMISSED };
      jest.spyOn(alertRepository, 'findOne').mockResolvedValue(mockAlert);
      jest.spyOn(alertRepository, 'save').mockResolvedValue(dismissedAlert as Alert);

      const result = await service.dismissAlert('1');

      expect(result.status).toBe(AlertStatus.DISMISSED);
      expect(alertRepository.save).toHaveBeenCalled();
    });
  });

  describe('markAllAlertsAsAcknowledged', () => {
    it('should mark all active alerts as acknowledged', async () => {
      jest.spyOn(alertRepository, 'update').mockResolvedValue({ affected: 5 } as any);

      const result = await service.markAllAlertsAsAcknowledged('user-1');

      expect(result.updated).toBe(5);
      expect(alertRepository.update).toHaveBeenCalled();
    });
  });

  describe('deleteAlert', () => {
    it('should delete an alert', async () => {
      jest.spyOn(alertRepository, 'findOne').mockResolvedValue(mockAlert);
      jest.spyOn(alertRepository, 'remove').mockResolvedValue(mockAlert);

      const result = await service.deleteAlert('1');

      expect(result.deleted).toBe(true);
      expect(alertRepository.remove).toHaveBeenCalled();
    });

    it('should throw NotFoundException if alert not found', async () => {
      jest.spyOn(alertRepository, 'findOne').mockResolvedValue(null);

      await expect(service.deleteAlert('invalid-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('getAlertStatistics', () => {
    it('should return alert statistics', async () => {
      jest.spyOn(alertRepository, 'find').mockResolvedValue([
        mockAlert,
        { ...mockAlert, id: '2', status: AlertStatus.ACKNOWLEDGED },
        { ...mockAlert, id: '3', severity: AlertSeverity.CRITICAL },
      ] as Alert[]);

      const stats = await service.getAlertStatistics();

      expect(stats.total).toBe(3);
      expect(stats.active).toBe(1);
      expect(stats.acknowledged).toBe(1);
      expect(stats).toHaveProperty('by_severity');
      expect(stats).toHaveProperty('by_type');
    });
  });

  describe('getRecentCriticalAlerts', () => {
    it('should return recent critical alerts', async () => {
      const criticalAlert = {
        ...mockAlert,
        severity: AlertSeverity.CRITICAL,
        status: AlertStatus.ACTIVE,
      };

      jest.spyOn(alertRepository, 'find').mockResolvedValue([criticalAlert] as Alert[]);

      const result = await service.getRecentCriticalAlerts(5);

      expect(result).toHaveLength(1);
      expect(result[0].severity).toBe(AlertSeverity.CRITICAL);
    });
  });
});
