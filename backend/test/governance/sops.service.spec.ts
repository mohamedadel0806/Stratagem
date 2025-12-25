import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { SOPsService } from '../../src/governance/sops/sops.service';
import { SOP, SOPStatus, SOPCategory } from '../../src/governance/sops/entities/sop.entity';
import { SOPAssignment } from '../../src/governance/sops/entities/sop-assignment.entity';
import { UnifiedControl } from '../../src/governance/unified-controls/entities/unified-control.entity';
import { WorkflowExecution } from '../../src/workflow/entities/workflow-execution.entity';
import { User } from '../../src/users/entities/user.entity';
import { WorkflowService } from '../../src/workflow/services/workflow.service';
import { NotificationService } from '../../src/common/services/notification.service';
import { CreateSOPDto } from '../../src/governance/sops/dto/create-sop.dto';
import { UpdateSOPDto } from '../../src/governance/sops/dto/update-sop.dto';
import { SOPQueryDto } from '../../src/governance/sops/dto/sop-query.dto';
import { EntityType, WorkflowTrigger } from '../../src/workflow/entities/workflow.entity';

describe('SOPsService', () => {
  let service: SOPsService;
  let sopRepository: Repository<SOP>;
  let assignmentRepository: Repository<SOPAssignment>;
  let controlRepository: Repository<UnifiedControl>;
  let workflowService: WorkflowService;
  let notificationService: NotificationService;

  const mockSopRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    count: jest.fn(),
    softRemove: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  const mockAssignmentRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    count: jest.fn(),
  };

  const mockControlRepository = {
    find: jest.fn(),
  };

  const mockWorkflowExecutionRepository = {};
  const mockUserRepository = {};

  const mockWorkflowService = {
    checkAndTriggerWorkflows: jest.fn(),
  };

  const mockNotificationService = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SOPsService,
        {
          provide: getRepositoryToken(SOP),
          useValue: mockSopRepository,
        },
        {
          provide: getRepositoryToken(SOPAssignment),
          useValue: mockAssignmentRepository,
        },
        {
          provide: getRepositoryToken(UnifiedControl),
          useValue: mockControlRepository,
        },
        {
          provide: getRepositoryToken(WorkflowExecution),
          useValue: mockWorkflowExecutionRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: WorkflowService,
          useValue: mockWorkflowService,
        },
        {
          provide: NotificationService,
          useValue: mockNotificationService,
        },
      ],
    }).compile();

    service = module.get<SOPsService>(SOPsService);
    sopRepository = module.get<Repository<SOP>>(getRepositoryToken(SOP));
    assignmentRepository = module.get<Repository<SOPAssignment>>(getRepositoryToken(SOPAssignment));
    controlRepository = module.get<Repository<UnifiedControl>>(getRepositoryToken(UnifiedControl));
    workflowService = module.get<WorkflowService>(WorkflowService);
    notificationService = module.get<NotificationService>(NotificationService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const userId = 'user-123';
    const createDto: CreateSOPDto = {
      sop_identifier: 'SOP-TEST-001',
      title: 'Test SOP',
      purpose: 'Test purpose',
      content: 'Test content',
      category: SOPCategory.SECURITY,
      owner_id: 'owner-123',
    };

    it('should create a SOP successfully', async () => {
      const mockSOP = {
        id: 'sop-123',
        sop_identifier: 'SOP-TEST-001',
        title: 'Test SOP',
        purpose: 'Test purpose',
        content: 'Test content',
        category: SOPCategory.SECURITY,
        owner_id: 'owner-123',
        status: SOPStatus.DRAFT,
        created_by: userId,
        updated_by: null,
        version_number: 1,
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
        controls: [],
      } as unknown as SOP;

      mockSopRepository.create.mockReturnValue(mockSOP);
      mockSopRepository.save.mockResolvedValue(mockSOP);
      mockWorkflowService.checkAndTriggerWorkflows.mockResolvedValue(undefined);

      const result = await service.create(createDto, userId);

      expect(mockSopRepository.create).toHaveBeenCalledWith({
        ...createDto,
        created_by: userId,
      });
      expect(mockSopRepository.save).toHaveBeenCalledWith(mockSOP);
      expect(result).toEqual(mockSOP);
    });

    it('should create SOP with linked controls', async () => {
      const dtoWithControls: CreateSOPDto = {
        ...createDto,
        control_ids: ['control-1', 'control-2'],
      };

      const mockSOP = {
        id: 'sop-123',
        sop_identifier: 'SOP-TEST-001',
        title: 'Test SOP',
        status: SOPStatus.DRAFT,
        created_by: userId,
        controls: [],
      } as unknown as SOP;

      const mockControls = [
        { id: 'control-1' } as UnifiedControl,
        { id: 'control-2' } as UnifiedControl,
      ];

      mockSopRepository.create.mockReturnValue(mockSOP);
      mockSopRepository.save.mockResolvedValue(mockSOP);
      mockControlRepository.find.mockResolvedValue(mockControls);
      mockWorkflowService.checkAndTriggerWorkflows.mockResolvedValue(undefined);

      const result = await service.create(dtoWithControls, userId);

      expect(mockControlRepository.find).toHaveBeenCalledWith({
        where: { id: In(['control-1', 'control-2']) },
      });
      expect(result).toBeDefined();
    });

    it('should trigger workflows on creation', async () => {
      const mockSOP = {
        id: 'sop-123',
        sop_identifier: 'SOP-TEST-001',
        title: 'Test SOP',
        status: SOPStatus.DRAFT,
        created_by: userId,
        category: SOPCategory.SECURITY,
        controls: [],
      } as unknown as SOP;

      mockSopRepository.create.mockReturnValue(mockSOP);
      mockSopRepository.save.mockResolvedValue(mockSOP);
      mockWorkflowService.checkAndTriggerWorkflows.mockResolvedValue(undefined);

      await service.create(createDto, userId);

      expect(mockWorkflowService.checkAndTriggerWorkflows).toHaveBeenCalledWith(
        EntityType.SOP,
        'sop-123',
        WorkflowTrigger.ON_CREATE,
        {
          status: SOPStatus.DRAFT,
          category: SOPCategory.SECURITY,
        },
        true,
      );
    });

    it('should handle workflow trigger errors gracefully', async () => {
      const mockSOP = {
        id: 'sop-123',
        sop_identifier: 'SOP-TEST-001',
        title: 'Test SOP',
        status: SOPStatus.DRAFT,
        created_by: userId,
        controls: [],
      } as unknown as SOP;

      mockSopRepository.create.mockReturnValue(mockSOP);
      mockSopRepository.save.mockResolvedValue(mockSOP);
      mockWorkflowService.checkAndTriggerWorkflows.mockRejectedValue(new Error('Workflow error'));

      const result = await service.create(createDto, userId);

      expect(result).toBeDefined(); // Should not throw
    });
  });

  describe('findAll', () => {
    it('should return paginated SOPs', async () => {
      const mockSOPs = [
        {
          id: 'sop-1',
          title: 'SOP 1',
          status: SOPStatus.PUBLISHED,
          created_at: new Date(),
        },
        {
          id: 'sop-2',
          title: 'SOP 2',
          status: SOPStatus.DRAFT,
          created_at: new Date(),
        },
      ] as unknown as SOP[];

      const queryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([mockSOPs, 2]),
      };

      mockSopRepository.createQueryBuilder.mockReturnValue(queryBuilder);

      const queryDto: SOPQueryDto = {
        page: 1,
        limit: 25,
      };

      const result = await service.findAll(queryDto);

      expect(result.data).toEqual(mockSOPs);
      expect(result.meta.page).toBe(1);
      expect(result.meta.limit).toBe(25);
      expect(result.meta.total).toBe(2);
      expect(result.meta.totalPages).toBe(1);
    });

    it('should filter SOPs by status', async () => {
      const queryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
      };

      mockSopRepository.createQueryBuilder.mockReturnValue(queryBuilder);

      const queryDto: SOPQueryDto = {
        page: 1,
        limit: 25,
        status: SOPStatus.PUBLISHED,
      };

      await service.findAll(queryDto);

      expect(queryBuilder.where).toHaveBeenCalled();
    });

    it('should search SOPs by title, purpose, or content', async () => {
      const queryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
      };

      mockSopRepository.createQueryBuilder.mockReturnValue(queryBuilder);

      const queryDto: SOPQueryDto = {
        page: 1,
        limit: 25,
        search: 'security',
      };

      await service.findAll(queryDto);

      expect(queryBuilder.andWhere).toHaveBeenCalled();
    });

    it('should sort SOPs by specified field', async () => {
      const queryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
      };

      mockSopRepository.createQueryBuilder.mockReturnValue(queryBuilder);

      const queryDto: SOPQueryDto = {
        page: 1,
        limit: 25,
        sort: 'created_at:DESC',
      };

      await service.findAll(queryDto);

      expect(queryBuilder.orderBy).toHaveBeenCalledWith('sop.created_at', 'DESC');
    });
  });

  describe('findOne', () => {
    it('should return a SOP by ID', async () => {
      const mockSOP = {
        id: 'sop-123',
        title: 'Test SOP',
        status: SOPStatus.PUBLISHED,
      } as unknown as SOP;

      mockSopRepository.findOne.mockResolvedValue(mockSOP);

      const result = await service.findOne('sop-123');

      expect(mockSopRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'sop-123' },
        relations: ['owner', 'creator', 'updater', 'controls'],
      });
      expect(result).toEqual(mockSOP);
    });

    it('should throw NotFoundException when SOP not found', async () => {
      mockSopRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    const userId = 'user-123';
    const sopId = 'sop-123';

    it('should update a SOP successfully', async () => {
      const existingSOP = {
        id: sopId,
        sop_identifier: 'SOP-TEST-001',
        title: 'Original Title',
        status: SOPStatus.DRAFT,
        controls: [],
      } as unknown as SOP;

      const updateDto: UpdateSOPDto = {
        title: 'Updated Title',
      };

      const updatedSOP = {
        ...existingSOP,
        ...updateDto,
        updated_by: userId,
      } as unknown as SOP;

      mockSopRepository.findOne.mockResolvedValue(existingSOP);
      mockSopRepository.save.mockResolvedValue(updatedSOP);
      mockWorkflowService.checkAndTriggerWorkflows.mockResolvedValue(undefined);

      const result = await service.update(sopId, updateDto, userId);

      expect(mockSopRepository.save).toHaveBeenCalled();
      expect(result.title).toBe('Updated Title');
      expect(result.updated_by).toBe(userId);
    });

    it('should update SOP controls', async () => {
      const existingSOP = {
        id: sopId,
        sop_identifier: 'SOP-TEST-001',
        title: 'Test SOP',
        status: SOPStatus.DRAFT,
        controls: [],
      } as unknown as SOP;

      const newControls = [
        { id: 'control-1' } as UnifiedControl,
        { id: 'control-2' } as UnifiedControl,
      ];

      const updateDto: UpdateSOPDto = {
        control_ids: ['control-1', 'control-2'],
      };

      const updatedSOP = {
        ...existingSOP,
        controls: newControls,
        updated_by: userId,
      } as unknown as SOP;

      mockSopRepository.findOne.mockResolvedValue(existingSOP);
      mockControlRepository.find.mockResolvedValue(newControls);
      mockSopRepository.save.mockResolvedValue(updatedSOP);
      mockWorkflowService.checkAndTriggerWorkflows.mockResolvedValue(undefined);

      const result = await service.update(sopId, updateDto, userId);

      expect(mockControlRepository.find).toHaveBeenCalledWith({
        where: { id: In(['control-1', 'control-2']) },
      });
      expect(result.controls).toEqual(newControls);
    });

    it('should trigger workflow on status change', async () => {
      const existingSOP = {
        id: sopId,
        sop_identifier: 'SOP-TEST-001',
        title: 'Test SOP',
        status: SOPStatus.DRAFT,
        category: SOPCategory.SECURITY,
        controls: [],
      } as unknown as SOP;

      const updateDto: UpdateSOPDto = {
        status: SOPStatus.IN_REVIEW,
      };

      const updatedSOP = {
        ...existingSOP,
        ...updateDto,
        updated_by: userId,
      } as unknown as SOP;

      mockSopRepository.findOne.mockResolvedValue(existingSOP);
      mockSopRepository.save.mockResolvedValue(updatedSOP);
      mockWorkflowService.checkAndTriggerWorkflows.mockResolvedValue(undefined);

      await service.update(sopId, updateDto, userId);

      expect(mockWorkflowService.checkAndTriggerWorkflows).toHaveBeenCalledWith(
        EntityType.SOP,
        sopId,
        WorkflowTrigger.ON_STATUS_CHANGE,
        expect.objectContaining({
          status: SOPStatus.IN_REVIEW,
          oldStatus: SOPStatus.DRAFT,
        }),
        true,
      );
    });

    it('should send notifications on status change', async () => {
      const existingSOP = {
        id: sopId,
        sop_identifier: 'SOP-TEST-001',
        title: 'Test SOP',
        status: SOPStatus.DRAFT,
        owner_id: 'owner-123',
        controls: [],
      } as unknown as SOP;

      const updateDto: UpdateSOPDto = {
        status: SOPStatus.PUBLISHED,
      };

      const updatedSOP = {
        ...existingSOP,
        ...updateDto,
        updated_by: userId,
      } as unknown as SOP;

      mockSopRepository.findOne.mockResolvedValue(existingSOP);
      mockSopRepository.save.mockResolvedValue(updatedSOP);
      mockWorkflowService.checkAndTriggerWorkflows.mockResolvedValue(undefined);
      mockNotificationService.create.mockResolvedValue(undefined);

      await service.update(sopId, updateDto, userId);

      expect(mockNotificationService.create).toHaveBeenCalled();
    });
  });

  describe('publish', () => {
    const userId = 'user-123';
    const sopId = 'sop-123';

    it('should publish an approved SOP', async () => {
      const approvedSOP = {
        id: sopId,
        sop_identifier: 'SOP-TEST-001',
        title: 'Test SOP',
        status: SOPStatus.APPROVED,
        controls: [],
      } as unknown as SOP;

      const publishedSOP = {
        ...approvedSOP,
        status: SOPStatus.PUBLISHED,
        published_date: expect.any(Date),
        updated_by: userId,
      } as unknown as SOP;

      mockSopRepository.findOne.mockResolvedValue(approvedSOP);
      mockSopRepository.save.mockResolvedValue(publishedSOP);

      const result = await service.publish(sopId, userId);

      expect(result.status).toBe(SOPStatus.PUBLISHED);
      expect(result.published_date).toBeDefined();
    });

    it('should throw error when publishing non-approved SOP', async () => {
      const draftSOP = {
        id: sopId,
        sop_identifier: 'SOP-TEST-001',
        title: 'Test SOP',
        status: SOPStatus.DRAFT,
      } as unknown as SOP;

      mockSopRepository.findOne.mockResolvedValue(draftSOP);

      await expect(service.publish(sopId, userId)).rejects.toThrow(NotFoundException);
    });

    it('should create user assignments when publishing', async () => {
      const approvedSOP = {
        id: sopId,
        sop_identifier: 'SOP-TEST-001',
        title: 'Test SOP',
        status: SOPStatus.APPROVED,
      } as unknown as SOP;

      const publishedSOP = {
        ...approvedSOP,
        status: SOPStatus.PUBLISHED,
        published_date: new Date(),
        updated_by: userId,
      } as unknown as SOP;

      const assignmentUserIds = ['user-1', 'user-2'];

      mockSopRepository.findOne.mockResolvedValue(approvedSOP);
      mockSopRepository.save.mockResolvedValue(publishedSOP);
      mockAssignmentRepository.findOne.mockResolvedValue(null); // No existing assignment
      mockAssignmentRepository.create.mockImplementation((data) => data);
      mockAssignmentRepository.save.mockResolvedValue([]);

      const result = await service.publish(sopId, userId, assignmentUserIds);

      expect(mockAssignmentRepository.create).toHaveBeenCalledTimes(2);
      expect(mockAssignmentRepository.save).toHaveBeenCalled();
    });

    it('should send notifications to assigned users', async () => {
      const approvedSOP = {
        id: sopId,
        sop_identifier: 'SOP-TEST-001',
        title: 'Test SOP',
        status: SOPStatus.APPROVED,
      } as unknown as SOP;

      const publishedSOP = {
        ...approvedSOP,
        status: SOPStatus.PUBLISHED,
        published_date: new Date(),
        updated_by: userId,
      } as unknown as SOP;

      const assignmentUserIds = ['user-1', 'user-2'];

      mockSopRepository.findOne.mockResolvedValue(approvedSOP);
      mockSopRepository.save.mockResolvedValue(publishedSOP);
      mockAssignmentRepository.findOne.mockResolvedValue(null);
      mockAssignmentRepository.create.mockImplementation((data) => data);
      mockAssignmentRepository.save.mockResolvedValue([]);
      mockNotificationService.create.mockResolvedValue(undefined);

      await service.publish(sopId, userId, assignmentUserIds);

      expect(mockNotificationService.create).toHaveBeenCalledTimes(2);
    });
  });

  describe('remove', () => {
    const sopId = 'sop-123';

    it('should soft delete a SOP', async () => {
      const mockSOP = {
        id: sopId,
        sop_identifier: 'SOP-TEST-001',
        title: 'Test SOP',
      } as unknown as SOP;

      mockSopRepository.findOne.mockResolvedValue(mockSOP);
      mockSopRepository.softRemove.mockResolvedValue(mockSOP);

      await service.remove(sopId);

      expect(mockSopRepository.softRemove).toHaveBeenCalledWith(mockSOP);
    });

    it('should throw error when removing non-existent SOP', async () => {
      mockSopRepository.findOne.mockResolvedValue(null);

      await expect(service.remove(sopId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getAssignedSOPs', () => {
    const userId = 'user-123';

    it('should return SOPs assigned to a user', async () => {
      const mockAssignments = [
        {
          sop_id: 'sop-1',
          sop: { id: 'sop-1', title: 'SOP 1', status: SOPStatus.PUBLISHED },
        },
        {
          sop_id: 'sop-2',
          sop: { id: 'sop-2', title: 'SOP 2', status: SOPStatus.PUBLISHED },
        },
      ] as unknown as SOPAssignment[];

      const mockSOPs = [
        { id: 'sop-1', title: 'SOP 1', status: SOPStatus.PUBLISHED },
        { id: 'sop-2', title: 'SOP 2', status: SOPStatus.PUBLISHED },
      ] as unknown as SOP[];

      const queryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([mockSOPs, 2]),
      };

      mockAssignmentRepository.find.mockResolvedValue(mockAssignments);
      mockSopRepository.createQueryBuilder.mockReturnValue(queryBuilder);

      const result = await service.getAssignedSOPs(userId);

      expect(result.data).toEqual(mockSOPs);
      expect(result.meta.total).toBe(2);
    });

    it('should return empty list when user has no assignments', async () => {
      mockAssignmentRepository.find.mockResolvedValue([]);

      const result = await service.getAssignedSOPs(userId);

      expect(result.data).toEqual([]);
      expect(result.meta.total).toBe(0);
    });

    it('should filter assigned SOPs by status', async () => {
      const mockAssignments = [
        {
          sop_id: 'sop-1',
          sop: { id: 'sop-1', title: 'SOP 1', status: SOPStatus.PUBLISHED },
        },
      ] as unknown as SOPAssignment[];

      const queryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
      };

      mockAssignmentRepository.find.mockResolvedValue(mockAssignments);
      mockSopRepository.createQueryBuilder.mockReturnValue(queryBuilder);

      await service.getAssignedSOPs(userId, { status: SOPStatus.PUBLISHED } as SOPQueryDto);

      expect(queryBuilder.where).toHaveBeenCalled();
    });
  });

  describe('getPublicationStatistics', () => {
    it('should return publication statistics', async () => {
      mockSopRepository.count.mockResolvedValue(10);
      mockSopRepository.createQueryBuilder.mockReturnValue({
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getCount: jest.fn().mockResolvedValue(5),
      });
      mockAssignmentRepository.count.mockResolvedValue(50);
      mockAssignmentRepository.count.mockResolvedValueOnce(50);
      mockAssignmentRepository.count.mockResolvedValueOnce(25);

      const result = await service.getPublicationStatistics();

      expect(result.totalPublished).toBe(10);
      expect(result.assignmentsCount).toBe(50);
      expect(result.acknowledgedCount).toBe(25);
      expect(result.acknowledgmentRate).toBe(50);
    });

    it('should calculate acknowledgment rate correctly', async () => {
      mockSopRepository.count.mockResolvedValue(0);
      mockSopRepository.createQueryBuilder.mockReturnValue({
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getCount: jest.fn().mockResolvedValue(0),
      });
      mockAssignmentRepository.count.mockResolvedValueOnce(100);
      mockAssignmentRepository.count.mockResolvedValueOnce(75);

      const result = await service.getPublicationStatistics();

      expect(result.acknowledgmentRate).toBe(75);
    });

    it('should handle zero assignments gracefully', async () => {
      mockSopRepository.count.mockResolvedValue(0);
      mockSopRepository.createQueryBuilder.mockReturnValue({
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getCount: jest.fn().mockResolvedValue(0),
      });
      mockAssignmentRepository.count.mockResolvedValueOnce(0);
      mockAssignmentRepository.count.mockResolvedValueOnce(0);

      const result = await service.getPublicationStatistics();

      expect(result.acknowledgmentRate).toBe(0);
    });
  });
});
