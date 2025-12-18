/**
 * Policies Service Unit Test
 * Example test file for Governance Policies service
 */

import { Test, TestingModule } from '@nestjs/testing';
import { PoliciesService } from '../../src/governance/policies/policies.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Policy } from '../../src/governance/policies/entities/policy.entity';
import { Repository } from 'typeorm';

describe('PoliciesService', () => {
  let service: PoliciesService;
  let repository: Repository<Policy>;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue([]),
      getCount: jest.fn().mockResolvedValue(0),
      getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
    })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PoliciesService,
        {
          provide: getRepositoryToken(Policy),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<PoliciesService>(PoliciesService);
    repository = module.get<Repository<Policy>>(getRepositoryToken(Policy));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a policy successfully', async () => {
      const createPolicyDto = {
        policy_type: 'Information Security',
        title: 'Test Policy',
        effective_date: '2024-01-01',
      };

      const mockPolicy = {
        id: 'test-id',
        ...createPolicyDto,
        version: '1.0',
        status: 'draft',
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockRepository.create.mockReturnValue(mockPolicy);
      mockRepository.save.mockResolvedValue(mockPolicy);

      const result = await service.create(createPolicyDto as any, 'user-123');

      expect(mockRepository.create).toHaveBeenCalledWith(expect.objectContaining(createPolicyDto));
      expect(mockRepository.save).toHaveBeenCalled();
      expect(result).toEqual(mockPolicy);
    });
  });

  describe('findAll', () => {
    it('should return an array of policies', async () => {
      const mockPolicies = [
        {
          id: '1',
          policy_type: 'Information Security',
          title: 'Policy 1',
        },
        {
          id: '2',
          policy_type: 'Data Privacy',
          title: 'Policy 2',
        },
      ];

      mockRepository.createQueryBuilder.mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(mockPolicies),
        getCount: jest.fn().mockResolvedValue(2),
        getManyAndCount: jest.fn().mockResolvedValue([mockPolicies, 2]),
      });

      const result = await service.findAll({});

      expect(mockRepository.createQueryBuilder).toHaveBeenCalled();
      expect(result.data).toEqual(mockPolicies);
      expect(result.meta.total).toBe(2);
    });
  });

  describe('findOne', () => {
    it('should return a single policy', async () => {
      const mockPolicy = {
        id: 'test-id',
        policy_type: 'Information Security',
        title: 'Test Policy',
      };

      mockRepository.findOne.mockResolvedValue(mockPolicy as Policy);

      const result = await service.findOne('test-id');

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'test-id' },
        relations: ['owner', 'creator', 'updater', 'control_objectives', 'supersedes_policy'],
      });
      expect(result).toEqual(mockPolicy);
    });

    it('should throw error if policy not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('non-existent')).rejects.toThrow();
    });
  });
});





