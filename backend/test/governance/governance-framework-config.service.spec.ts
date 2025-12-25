import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { GovernanceFrameworkConfigService } from '../../src/governance/framework-config/governance-framework-config.service';
import {
  GovernanceFrameworkConfig,
  FrameworkType,
} from '../../src/governance/entities/governance-framework-config.entity';
import { ComplianceFramework } from '../../src/common/entities/compliance-framework.entity';
import { User } from '../../src/users/entities/user.entity';
import { CreateGovernanceFrameworkConfigDto } from '../../src/governance/framework-config/dto/create-governance-framework-config.dto';
import { UpdateGovernanceFrameworkConfigDto } from '../../src/governance/framework-config/dto/update-governance-framework-config.dto';
import { GovernanceFrameworkConfigQueryDto } from '../../src/governance/framework-config/dto/governance-framework-config-query.dto';

describe('GovernanceFrameworkConfigService', () => {
  let service: GovernanceFrameworkConfigService;
  let frameworkConfigRepository: Repository<GovernanceFrameworkConfig>;
  let complianceFrameworkRepository: Repository<ComplianceFramework>;
  let userRepository: Repository<User>;

  const mockFrameworkConfigRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    findAndCount: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    merge: jest.fn(),
  };

  const mockComplianceFrameworkRepository = {
    findOne: jest.fn(),
  };

  const mockUserRepository = {};

  const userId = 'user-123';
  const frameworkId = 'framework-123';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GovernanceFrameworkConfigService,
        {
          provide: getRepositoryToken(GovernanceFrameworkConfig),
          useValue: mockFrameworkConfigRepository,
        },
        {
          provide: getRepositoryToken(ComplianceFramework),
          useValue: mockComplianceFrameworkRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<GovernanceFrameworkConfigService>(
      GovernanceFrameworkConfigService,
    );
    frameworkConfigRepository = module.get<
      Repository<GovernanceFrameworkConfig>
    >(getRepositoryToken(GovernanceFrameworkConfig));
    complianceFrameworkRepository = module.get<Repository<ComplianceFramework>>(
      getRepositoryToken(ComplianceFramework),
    );
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const createDto: CreateGovernanceFrameworkConfigDto = {
      name: 'UAE NCA Framework',
      description: 'UAE National Cyber Authority Framework',
      framework_type: FrameworkType.NCA_ECC,
      scope: 'All departments',
      is_active: true,
      metadata: {
        require_policy_approval: true,
        require_control_testing: true,
        policy_review_frequency: 'annual',
      },
    };

    it('should create a governance framework configuration successfully', async () => {
      const mockConfig = {
        id: frameworkId,
        ...createDto,
        created_by: userId,
        updated_by: userId,
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
      } as unknown as GovernanceFrameworkConfig;

      mockFrameworkConfigRepository.create.mockReturnValue(mockConfig);
      mockFrameworkConfigRepository.save.mockResolvedValue(mockConfig);

      const result = await service.create(createDto, userId);

      expect(mockFrameworkConfigRepository.create).toHaveBeenCalledWith({
        ...createDto,
        created_by: userId,
        updated_by: userId,
      });
      expect(mockFrameworkConfigRepository.save).toHaveBeenCalledWith(
        mockConfig,
      );
      expect(result).toEqual(mockConfig);
    });

    it('should validate linked framework when provided', async () => {
      const dtoWithLinkedFramework = {
        ...createDto,
        linked_framework_id: 'compliance-123',
      };

      mockComplianceFrameworkRepository.findOne.mockResolvedValue(null);

      await expect(
        service.create(dtoWithLinkedFramework, userId),
      ).rejects.toThrow(BadRequestException);

      expect(mockComplianceFrameworkRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'compliance-123' },
      });
    });

    it('should throw ConflictException if name already exists', async () => {
      const existingConfig = {
        id: 'existing-123',
        name: createDto.name,
      } as unknown as GovernanceFrameworkConfig;

      mockFrameworkConfigRepository.findOne.mockResolvedValue(existingConfig);

      await expect(service.create(createDto, userId)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('findAll', () => {
    const mockConfigs = [
      {
        id: 'config-1',
        name: 'Framework 1',
        framework_type: FrameworkType.ISO27001,
        is_active: true,
      },
      {
        id: 'config-2',
        name: 'Framework 2',
        framework_type: FrameworkType.GDPR,
        is_active: false,
      },
    ] as unknown as GovernanceFrameworkConfig[];

    it('should find all configurations with pagination', async () => {
      const queryDto: GovernanceFrameworkConfigQueryDto = {
        page: 1,
        limit: 25,
      };

      mockFrameworkConfigRepository.findAndCount.mockResolvedValue([
        mockConfigs,
        2,
      ]);

      const result = await service.findAll(queryDto);

      expect(mockFrameworkConfigRepository.findAndCount).toHaveBeenCalledWith({
        where: { deleted_at: null },
        order: { created_at: 'DESC' },
        skip: 0,
        take: 25,
        relations: ['linked_framework', 'creator', 'updater'],
      });

      expect(result).toEqual({
        data: mockConfigs,
        pagination: {
          page: 1,
          limit: 25,
          total: 2,
          pages: 1,
        },
      });
    });

    it('should filter by framework_type', async () => {
      const queryDto: GovernanceFrameworkConfigQueryDto = {
        framework_type: FrameworkType.ISO27001,
      };

      mockFrameworkConfigRepository.findAndCount.mockResolvedValue([
        [mockConfigs[0]],
        1,
      ]);

      const result = await service.findAll(queryDto);

      expect(mockFrameworkConfigRepository.findAndCount).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            deleted_at: null,
            framework_type: FrameworkType.ISO27001,
          },
        }),
      );
    });

    it('should filter by is_active status', async () => {
      const queryDto: GovernanceFrameworkConfigQueryDto = {
        is_active: true,
      };

      mockFrameworkConfigRepository.findAndCount.mockResolvedValue([
        [mockConfigs[0]],
        1,
      ]);

      const result = await service.findAll(queryDto);

      expect(mockFrameworkConfigRepository.findAndCount).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            deleted_at: null,
            is_active: true,
          },
        }),
      );
    });

    it('should search by name', async () => {
      const queryDto: GovernanceFrameworkConfigQueryDto = {
        search: 'Framework 1',
      };

      mockFrameworkConfigRepository.findAndCount.mockResolvedValue([
        [mockConfigs[0]],
        1,
      ]);

      const result = await service.findAll(queryDto);

      expect(mockFrameworkConfigRepository.findAndCount).toHaveBeenCalled();
    });

    it('should sort by specified field', async () => {
      const queryDto: GovernanceFrameworkConfigQueryDto = {
        sort: 'name:ASC',
      };

      mockFrameworkConfigRepository.findAndCount.mockResolvedValue([
        mockConfigs,
        2,
      ]);

      const result = await service.findAll(queryDto);

      expect(mockFrameworkConfigRepository.findAndCount).toHaveBeenCalledWith(
        expect.objectContaining({
          order: { name: 'ASC' },
        }),
      );
    });
  });

  describe('findOne', () => {
    it('should find a configuration by ID', async () => {
      const mockConfig = {
        id: frameworkId,
        name: 'UAE NCA Framework',
        framework_type: FrameworkType.NCA_ECC,
      } as unknown as GovernanceFrameworkConfig;

      mockFrameworkConfigRepository.findOne.mockResolvedValue(mockConfig);

      const result = await service.findOne(frameworkId);

      expect(mockFrameworkConfigRepository.findOne).toHaveBeenCalledWith({
        where: { id: frameworkId, deleted_at: null },
        relations: ['linked_framework', 'creator', 'updater'],
      });

      expect(result).toEqual(mockConfig);
    });

    it('should throw NotFoundException if configuration not found', async () => {
      mockFrameworkConfigRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('nonexistent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    const updateDto: UpdateGovernanceFrameworkConfigDto = {
      name: 'Updated Framework',
      is_active: false,
    };

    const existingConfig = {
      id: frameworkId,
      name: 'Old Framework',
      framework_type: FrameworkType.ISO27001,
      is_active: true,
    } as unknown as GovernanceFrameworkConfig;

    it('should update a configuration successfully', async () => {
      const updatedConfig = {
        ...existingConfig,
        ...updateDto,
        updated_by: userId,
      } as unknown as GovernanceFrameworkConfig;

      mockFrameworkConfigRepository.findOne.mockResolvedValueOnce(
        existingConfig,
      );
      mockFrameworkConfigRepository.findOne.mockResolvedValueOnce(null); // No duplicate name
      mockFrameworkConfigRepository.merge.mockReturnValue(updatedConfig);
      mockFrameworkConfigRepository.save.mockResolvedValue(updatedConfig);

      const result = await service.update(frameworkId, updateDto, userId);

      expect(mockFrameworkConfigRepository.merge).toHaveBeenCalled();
      expect(mockFrameworkConfigRepository.save).toHaveBeenCalledWith(
        updatedConfig,
      );
      expect(result).toEqual(updatedConfig);
    });

    it('should validate linked framework when updating', async () => {
      const updateWithLinkedFramework = {
        ...updateDto,
        linked_framework_id: 'new-compliance-123',
      };

      mockFrameworkConfigRepository.findOne.mockResolvedValue(existingConfig);
      mockComplianceFrameworkRepository.findOne.mockResolvedValue(null);

      await expect(
        service.update(frameworkId, updateWithLinkedFramework, userId),
      ).rejects.toThrow(BadRequestException);
    });

    it('should check for duplicate name when updating', async () => {
      mockFrameworkConfigRepository.findOne.mockResolvedValue(existingConfig);
      mockFrameworkConfigRepository.findOne.mockResolvedValueOnce(existingConfig); // For findOne check
      mockFrameworkConfigRepository.findOne.mockResolvedValueOnce({
        id: 'other-123',
        name: updateDto.name,
      } as unknown as GovernanceFrameworkConfig); // For duplicate check

      // Reset mock to control its behavior
      mockFrameworkConfigRepository.findOne.mockReset();
      mockFrameworkConfigRepository.findOne.mockResolvedValueOnce(
        existingConfig,
      );
      mockFrameworkConfigRepository.findOne.mockResolvedValueOnce({
        id: 'other-123',
        name: updateDto.name,
      } as unknown as GovernanceFrameworkConfig);

      await expect(
        service.update(frameworkId, updateDto, userId),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('remove (soft delete)', () => {
    it('should soft delete a configuration', async () => {
      const mockConfig = {
        id: frameworkId,
        name: 'Test Framework',
      } as unknown as GovernanceFrameworkConfig;

      mockFrameworkConfigRepository.findOne.mockResolvedValue(mockConfig);
      mockFrameworkConfigRepository.update.mockResolvedValue({});

      await service.remove(frameworkId);

      expect(mockFrameworkConfigRepository.update).toHaveBeenCalledWith(
        frameworkId,
        {
          deleted_at: expect.any(Date),
        },
      );
    });

    it('should throw NotFoundException if configuration does not exist', async () => {
      mockFrameworkConfigRepository.findOne.mockResolvedValue(null);

      await expect(service.remove('nonexistent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('hardDelete', () => {
    it('should hard delete a configuration', async () => {
      const mockConfig = {
        id: frameworkId,
        name: 'Test Framework',
      } as unknown as GovernanceFrameworkConfig;

      mockFrameworkConfigRepository.findOne.mockResolvedValue(mockConfig);
      mockFrameworkConfigRepository.remove.mockResolvedValue({});

      await service.hardDelete(frameworkId);

      expect(mockFrameworkConfigRepository.remove).toHaveBeenCalledWith(
        mockConfig,
      );
    });

    it('should throw NotFoundException if configuration not found for hard delete', async () => {
      mockFrameworkConfigRepository.findOne.mockResolvedValue(null);

      await expect(service.hardDelete('nonexistent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('activate', () => {
    it('should activate an inactive configuration', async () => {
      const inactiveConfig = {
        id: frameworkId,
        name: 'Test Framework',
        is_active: false,
      } as unknown as GovernanceFrameworkConfig;

      const activeConfig = {
        ...inactiveConfig,
        is_active: true,
        updated_by: userId,
      } as unknown as GovernanceFrameworkConfig;

      mockFrameworkConfigRepository.findOne
        .mockResolvedValueOnce(inactiveConfig) // For findOne
        .mockResolvedValueOnce(inactiveConfig); // For update's findOne

      mockFrameworkConfigRepository.merge.mockReturnValue(activeConfig);
      mockFrameworkConfigRepository.save.mockResolvedValue(activeConfig);

      const result = await service.activate(frameworkId, userId);

      expect(result).toEqual(activeConfig);
    });

    it('should throw error if already active', async () => {
      const activeConfig = {
        id: frameworkId,
        name: 'Test Framework',
        is_active: true,
      } as unknown as GovernanceFrameworkConfig;

      mockFrameworkConfigRepository.findOne.mockResolvedValue(activeConfig);

      await expect(service.activate(frameworkId, userId)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('deactivate', () => {
    it('should deactivate an active configuration', async () => {
      const activeConfig = {
        id: frameworkId,
        name: 'Test Framework',
        is_active: true,
      } as unknown as GovernanceFrameworkConfig;

      const inactiveConfig = {
        ...activeConfig,
        is_active: false,
        updated_by: userId,
      } as unknown as GovernanceFrameworkConfig;

      mockFrameworkConfigRepository.findOne
        .mockResolvedValueOnce(activeConfig) // For findOne
        .mockResolvedValueOnce(activeConfig); // For update's findOne

      mockFrameworkConfigRepository.merge.mockReturnValue(inactiveConfig);
      mockFrameworkConfigRepository.save.mockResolvedValue(inactiveConfig);

      const result = await service.deactivate(frameworkId, userId);

      expect(result).toEqual(inactiveConfig);
    });

    it('should throw error if already inactive', async () => {
      const inactiveConfig = {
        id: frameworkId,
        name: 'Test Framework',
        is_active: false,
      } as unknown as GovernanceFrameworkConfig;

      mockFrameworkConfigRepository.findOne.mockResolvedValue(inactiveConfig);

      await expect(service.deactivate(frameworkId, userId)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findByFrameworkType', () => {
    it('should find configurations by framework type', async () => {
      const mockConfigs = [
        {
          id: 'config-1',
          framework_type: FrameworkType.ISO27001,
        },
      ] as unknown as GovernanceFrameworkConfig[];

      mockFrameworkConfigRepository.find.mockResolvedValue(mockConfigs);

      const result = await service.findByFrameworkType(FrameworkType.ISO27001);

      expect(mockFrameworkConfigRepository.find).toHaveBeenCalledWith({
        where: { framework_type: FrameworkType.ISO27001, deleted_at: null },
        relations: ['linked_framework', 'creator', 'updater'],
        order: { created_at: 'DESC' },
      });

      expect(result).toEqual(mockConfigs);
    });
  });

  describe('findActiveConfigs', () => {
    it('should find all active configurations', async () => {
      const mockConfigs = [
        {
          id: 'config-1',
          is_active: true,
        },
        {
          id: 'config-2',
          is_active: true,
        },
      ] as unknown as GovernanceFrameworkConfig[];

      mockFrameworkConfigRepository.find.mockResolvedValue(mockConfigs);

      const result = await service.findActiveConfigs();

      expect(mockFrameworkConfigRepository.find).toHaveBeenCalledWith({
        where: { is_active: true, deleted_at: null },
        relations: ['linked_framework', 'creator', 'updater'],
        order: { created_at: 'DESC' },
      });

      expect(result).toEqual(mockConfigs);
    });
  });
});
