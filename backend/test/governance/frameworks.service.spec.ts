import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { FrameworksService } from '../../src/governance/frameworks/frameworks.service';
import { ComplianceFramework, FrameworkStatus } from '../../src/common/entities/compliance-framework.entity';
import { FrameworkRequirement } from '../../src/governance/unified-controls/entities/framework-requirement.entity';
import { FrameworkVersion } from '../../src/governance/frameworks/entities/framework-version.entity';
import { CreateFrameworkVersionDto } from '../../src/governance/frameworks/dto/create-framework-version.dto';
import { ImportFrameworkStructureDto } from '../../src/governance/frameworks/dto/import-framework-structure.dto';

describe('FrameworksService', () => {
  let service: FrameworksService;
  let frameworkRepository: Repository<ComplianceFramework>;
  let requirementRepository: Repository<FrameworkRequirement>;
  let versionRepository: Repository<FrameworkVersion>;

  const mockFrameworkRepository = {
    findOne: jest.fn(),
    find: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  const mockRequirementRepository = {
    findOne: jest.fn(),
    find: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };

  const mockVersionRepository = {
    findOne: jest.fn(),
    find: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    create: jest.fn(),
  };

  const frameworkId = 'framework-123';
  const userId = 'user-123';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FrameworksService,
        {
          provide: getRepositoryToken(ComplianceFramework),
          useValue: mockFrameworkRepository,
        },
        {
          provide: getRepositoryToken(FrameworkRequirement),
          useValue: mockRequirementRepository,
        },
        {
          provide: getRepositoryToken(FrameworkVersion),
          useValue: mockVersionRepository,
        },
      ],
    }).compile();

    service = module.get<FrameworksService>(FrameworksService);
    frameworkRepository = module.get<Repository<ComplianceFramework>>(
      getRepositoryToken(ComplianceFramework),
    );
    requirementRepository = module.get<Repository<FrameworkRequirement>>(
      getRepositoryToken(FrameworkRequirement),
    );
    versionRepository = module.get<Repository<FrameworkVersion>>(
      getRepositoryToken(FrameworkVersion),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllFrameworks', () => {
    it('should return all active frameworks ordered by name', async () => {
      const mockFrameworks = [
        {
          id: 'fw-1',
          name: 'ISO 27001',
          framework_code: 'ISO27001',
          status: FrameworkStatus.ACTIVE,
        },
        {
          id: 'fw-2',
          name: 'NIST Cybersecurity',
          framework_code: 'NIST_CYBER',
          status: FrameworkStatus.ACTIVE,
        },
      ] as ComplianceFramework[];

      mockFrameworkRepository.find.mockResolvedValue(mockFrameworks);

      const result = await service.getAllFrameworks();

      expect(mockFrameworkRepository.find).toHaveBeenCalledWith({
        where: { status: FrameworkStatus.ACTIVE },
        order: { name: 'ASC' },
      });
      expect(result).toEqual(mockFrameworks);
    });

    it('should return empty array if no active frameworks exist', async () => {
      mockFrameworkRepository.find.mockResolvedValue([]);

      const result = await service.getAllFrameworks();

      expect(result).toEqual([]);
    });
  });

  describe('getFramework', () => {
    it('should return a framework by id', async () => {
      const mockFramework = {
        id: frameworkId,
        name: 'ISO 27001',
        framework_code: 'ISO27001',
        status: FrameworkStatus.ACTIVE,
      } as ComplianceFramework;

      mockFrameworkRepository.findOne.mockResolvedValue(mockFramework);

      const result = await service.getFramework(frameworkId);

      expect(mockFrameworkRepository.findOne).toHaveBeenCalledWith({
        where: { id: frameworkId },
      });
      expect(result).toEqual(mockFramework);
    });

    it('should throw NotFoundException if framework does not exist', async () => {
      mockFrameworkRepository.findOne.mockResolvedValue(null);

      await expect(service.getFramework(frameworkId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('createVersion', () => {
    const createVersionDto: CreateFrameworkVersionDto = {
      version: '2.0',
      structure: {
        domains: [
          {
            name: 'Domain 1',
            categories: [
              {
                name: 'Category 1',
                requirements: [
                  {
                    identifier: 'REQ-001',
                    title: 'Requirement 1',
                    text: 'Description of requirement 1',
                  },
                ],
              },
            ],
          },
        ],
      },
      is_current: true,
    };

    it('should create a new framework version', async () => {
      const mockFramework = {
        id: frameworkId,
        name: 'ISO 27001',
        version: '1.0',
        structure: {},
      } as ComplianceFramework;

      const mockVersion = {
        id: 'version-123',
        framework_id: frameworkId,
        version: '2.0',
        structure: createVersionDto.structure,
        is_current: true,
        created_by: userId,
      } as FrameworkVersion;

      mockFrameworkRepository.findOne.mockResolvedValue(mockFramework);
      mockVersionRepository.findOne.mockResolvedValue(null);
      mockVersionRepository.create.mockReturnValue(mockVersion);
      mockVersionRepository.save.mockResolvedValue(mockVersion);
      mockVersionRepository.update.mockResolvedValue({ affected: 1 });
      mockFrameworkRepository.save.mockResolvedValue(mockFramework);

      const result = await service.createVersion(
        frameworkId,
        createVersionDto,
        userId,
      );

      expect(mockVersionRepository.update).toHaveBeenCalled();
      expect(result).toEqual(mockVersion);
    });

    it('should throw BadRequestException if version already exists', async () => {
      const mockFramework = {
        id: frameworkId,
      } as ComplianceFramework;

      mockFrameworkRepository.findOne.mockResolvedValue(mockFramework);
      mockVersionRepository.findOne.mockResolvedValue({ version: '2.0' });

      await expect(
        service.createVersion(frameworkId, createVersionDto, userId),
      ).rejects.toThrow('Version');
    });
  });

  describe('getFrameworkWithStructure', () => {
    it('should return framework with its requirements', async () => {
      const mockFramework = {
        id: frameworkId,
        name: 'ISO 27001',
        structure: {},
      } as ComplianceFramework;

      const mockRequirements = [
        {
          id: 'req-1',
          framework_id: frameworkId,
          requirement_identifier: 'ISO-001',
          title: 'Requirement 1',
        },
      ] as FrameworkRequirement[];

      mockFrameworkRepository.findOne.mockResolvedValue(mockFramework);
      mockRequirementRepository.find.mockResolvedValue(mockRequirements);

      const result = await service.getFrameworkWithStructure(frameworkId);

      expect(result).toEqual({
        ...mockFramework,
        requirements: mockRequirements,
      });
    });

    it('should throw NotFoundException if framework does not exist', async () => {
      mockFrameworkRepository.findOne.mockResolvedValue(null);

      await expect(
        service.getFrameworkWithStructure(frameworkId),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getFrameworkRequirements', () => {
    it('should return all requirements for a framework', async () => {
      const mockFramework = {
        id: frameworkId,
        name: 'ISO 27001',
      } as ComplianceFramework;

      const mockRequirements = [
        {
          id: 'req-1',
          requirement_identifier: 'ISO-001',
        },
        {
          id: 'req-2',
          requirement_identifier: 'ISO-002',
        },
      ] as FrameworkRequirement[];

      mockFrameworkRepository.findOne.mockResolvedValue(mockFramework);
      mockRequirementRepository.find.mockResolvedValue(mockRequirements);

      const result = await service.getFrameworkRequirements(frameworkId);

      expect(mockRequirementRepository.find).toHaveBeenCalledWith({
        where: { framework_id: frameworkId },
        order: { display_order: 'ASC', requirement_identifier: 'ASC' },
      });
      expect(result).toEqual(mockRequirements);
    });
  });

  describe('getFrameworkDomains', () => {
    it('should return all domains from framework structure', async () => {
      const mockFramework = {
        id: frameworkId,
        structure: {
          domains: [
            { name: 'Domain 1' },
            { name: 'Domain 2' },
            { name: 'Domain 1' }, // Duplicate should be filtered
          ],
        },
      } as ComplianceFramework;

      mockFrameworkRepository.findOne.mockResolvedValue(mockFramework);

      const result = await service.getFrameworkDomains(frameworkId);

      expect(result).toEqual(['Domain 1', 'Domain 2']);
    });

    it('should return empty array if no domains exist', async () => {
      const mockFramework = {
        id: frameworkId,
        structure: { domains: [] },
      } as ComplianceFramework;

      mockFrameworkRepository.findOne.mockResolvedValue(mockFramework);

      const result = await service.getFrameworkDomains(frameworkId);

      expect(result).toEqual([]);
    });
  });

  describe('getFrameworkCategories', () => {
    it('should return categories for a specific domain', async () => {
      const mockFramework = {
        id: frameworkId,
        structure: {
          domains: [
            {
              name: 'Domain 1',
              categories: [
                { name: 'Category 1' },
                { name: 'Category 2' },
              ],
            },
            {
              name: 'Domain 2',
              categories: [
                { name: 'Category 3' },
              ],
            },
          ],
        },
      } as ComplianceFramework;

      mockFrameworkRepository.findOne.mockResolvedValue(mockFramework);

      const result = await service.getFrameworkCategories(
        frameworkId,
        'Domain 1',
      );

      expect(result).toEqual(['Category 1', 'Category 2']);
    });

    it('should return all categories if no domain specified', async () => {
      const mockFramework = {
        id: frameworkId,
        structure: {
          domains: [
            {
              name: 'Domain 1',
              categories: [{ name: 'Category 1' }],
            },
            {
              name: 'Domain 2',
              categories: [{ name: 'Category 2' }],
            },
          ],
        },
      } as ComplianceFramework;

      mockFrameworkRepository.findOne.mockResolvedValue(mockFramework);

      const result = await service.getFrameworkCategories(frameworkId);

      expect(result).toEqual(['Category 1', 'Category 2']);
    });
  });

  describe('getFrameworkStatistics', () => {
    it('should return correct framework statistics', async () => {
      const mockFramework = {
        id: frameworkId,
        version: '2.0',
        status: FrameworkStatus.ACTIVE,
        structure: {
          domains: [
            {
              name: 'Domain 1',
              categories: [
                {
                  name: 'Category 1',
                  requirements: [
                    { identifier: 'REQ-001' },
                    { identifier: 'REQ-002' },
                  ],
                },
                {
                  name: 'Category 2',
                  requirements: [{ identifier: 'REQ-003' }],
                },
              ],
            },
            {
              name: 'Domain 2',
              categories: [
                {
                  name: 'Category 3',
                  requirements: [{ identifier: 'REQ-004' }],
                },
              ],
            },
          ],
        },
      } as ComplianceFramework;

      mockFrameworkRepository.findOne.mockResolvedValue(mockFramework);

      const result = await service.getFrameworkStatistics(frameworkId);

      expect(result).toEqual({
        totalDomains: 2,
        totalCategories: 3,
        totalRequirements: 4,
        version: '2.0',
        status: FrameworkStatus.ACTIVE,
      });
    });
  });

  describe('isFrameworkActive', () => {
    it('should return true if framework is active', async () => {
      const mockFramework = {
        id: frameworkId,
        status: FrameworkStatus.ACTIVE,
      } as ComplianceFramework;

      mockFrameworkRepository.findOne.mockResolvedValue(mockFramework);

      const result = await service.isFrameworkActive(frameworkId);

      expect(result).toBe(true);
    });

    it('should return false if framework is not active', async () => {
      const mockFramework = {
        id: frameworkId,
        status: FrameworkStatus.DRAFT,
      } as ComplianceFramework;

      mockFrameworkRepository.findOne.mockResolvedValue(mockFramework);

      const result = await service.isFrameworkActive(frameworkId);

      expect(result).toBe(false);
    });

    it('should return false if framework does not exist', async () => {
      mockFrameworkRepository.findOne.mockResolvedValue(null);

      const result = await service.isFrameworkActive(frameworkId);

      expect(result).toBe(false);
    });
  });

  describe('getAllActiveFrameworks', () => {
    it('should return all active frameworks', async () => {
      const mockFrameworks = [
        {
          id: 'fw-1',
          name: 'Framework A',
          status: FrameworkStatus.ACTIVE,
        },
        {
          id: 'fw-2',
          name: 'Framework B',
          status: FrameworkStatus.ACTIVE,
        },
      ] as ComplianceFramework[];

      mockFrameworkRepository.find.mockResolvedValue(mockFrameworks);

      const result = await service.getAllActiveFrameworks();

      expect(mockFrameworkRepository.find).toHaveBeenCalledWith({
        where: { status: 'active' },
        order: { name: 'ASC' },
      });
      expect(result).toEqual(mockFrameworks);
    });
  });

  describe('searchFrameworks', () => {
    it('should search frameworks by name', async () => {
      const mockFrameworks = [
        {
          id: 'fw-1',
          name: 'ISO 27001',
          framework_code: 'ISO27001',
        },
      ] as ComplianceFramework[];

      const mockQueryBuilder = {
        createQueryBuilder: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        orWhere: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(mockFrameworks),
      };

      mockFrameworkRepository.createQueryBuilder.mockReturnValue(
        mockQueryBuilder,
      );

      const result = await service.searchFrameworks('ISO');

      expect(mockQueryBuilder.getMany).toHaveBeenCalled();
      expect(result).toEqual(mockFrameworks);
    });
  });

  describe('importFrameworkStructure', () => {
    const importDto: ImportFrameworkStructureDto = {
      framework_id: frameworkId,
      structure: {
        domains: [
          {
            name: 'Domain 1',
            categories: [
              {
                name: 'Category 1',
                requirements: [
                  {
                    identifier: 'REQ-001',
                    title: 'Requirement 1',
                    text: 'Description',
                  },
                ],
              },
            ],
          },
        ],
      },
      replace_existing: false,
      create_version: false,
      version: '2.0',
    };

    it('should import framework structure successfully', async () => {
      const mockFramework = {
        id: frameworkId,
        structure: {},
        updated_by: userId,
      } as ComplianceFramework;

      mockFrameworkRepository.findOne.mockResolvedValue(mockFramework);
      mockRequirementRepository.findOne.mockResolvedValue(null);
      mockRequirementRepository.create.mockImplementation((data) => data);
      mockRequirementRepository.save.mockResolvedValue({});
      mockFrameworkRepository.save.mockResolvedValue(mockFramework);

      const result = await service.importFrameworkStructure(importDto, userId);

      expect(result.requirementsCreated).toBeGreaterThanOrEqual(0);
      expect(result.framework).toEqual(mockFramework);
    });

    it('should throw NotFoundException if framework does not exist', async () => {
      mockFrameworkRepository.findOne.mockResolvedValue(null);

      await expect(
        service.importFrameworkStructure(importDto, userId),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
