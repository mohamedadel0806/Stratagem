import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PolicyVersionService } from '../../src/governance/policies/services/policy-version.service';
import { PolicyVersion } from '../../src/governance/policies/entities/policy-version.entity';
import { Policy } from '../../src/governance/policies/entities/policy.entity';
import { User } from '../../src/users/entities/user.entity';

describe('PolicyVersionService', () => {
  let service: PolicyVersionService;
  let versionRepository: Repository<PolicyVersion>;
  let policyRepository: Repository<Policy>;
  let userRepository: Repository<User>;

  const mockVersionRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    count: jest.fn(),
    remove: jest.fn(),
  };

  const mockPolicyRepository = {
    findOne: jest.fn(),
  };

  const mockUserRepository = {
    findOne: jest.fn(),
  };

  const policyId = 'policy-123';
  const userId = 'user-123';
  const versionId = 'version-123';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PolicyVersionService,
        {
          provide: getRepositoryToken(PolicyVersion),
          useValue: mockVersionRepository,
        },
        {
          provide: getRepositoryToken(Policy),
          useValue: mockPolicyRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<PolicyVersionService>(PolicyVersionService);
    versionRepository = module.get<Repository<PolicyVersion>>(
      getRepositoryToken(PolicyVersion),
    );
    policyRepository = module.get<Repository<Policy>>(
      getRepositoryToken(Policy),
    );
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createVersion', () => {
    it('should create a policy version successfully', async () => {
      const mockPolicy = { id: policyId } as unknown as Policy;
      const mockUser = { id: userId } as unknown as User;
      const mockVersion = {
        id: versionId,
        policy_id: policyId,
        version: '1.1',
        version_number: 1,
        content: 'Policy content',
        change_summary: 'Initial version',
        created_by: userId,
        created_at: new Date(),
      } as unknown as PolicyVersion;

      mockPolicyRepository.findOne.mockResolvedValue(mockPolicy);
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockVersionRepository.create.mockReturnValue(mockVersion);
      mockVersionRepository.save.mockResolvedValue(mockVersion);

      const result = await service.createVersion(
        policyId,
        'Policy content',
        '1.1',
        1,
        'Initial version',
        userId,
      );

      expect(mockPolicyRepository.findOne).toHaveBeenCalled();
      expect(mockVersionRepository.create).toHaveBeenCalled();
      expect(mockVersionRepository.save).toHaveBeenCalledWith(mockVersion);
      expect(result).toEqual(mockVersion);
    });

    it('should throw NotFoundException if policy not found', async () => {
      mockPolicyRepository.findOne.mockResolvedValue(null);

      await expect(
        service.createVersion(policyId, 'content', '1.1', 1, 'summary', userId),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if user not found', async () => {
      const mockPolicy = { id: policyId } as unknown as Policy;
      mockPolicyRepository.findOne.mockResolvedValue(mockPolicy);
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(
        service.createVersion(policyId, 'content', '1.1', 1, 'summary', userId),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getVersionsByPolicy', () => {
    it('should return all versions for a policy', async () => {
      const mockPolicy = { id: policyId } as unknown as Policy;
      const mockVersions = [
        {
          id: 'version-1',
          policy_id: policyId,
          version_number: 2,
        },
        {
          id: 'version-2',
          policy_id: policyId,
          version_number: 1,
        },
      ] as unknown as PolicyVersion[];

      mockPolicyRepository.findOne.mockResolvedValue(mockPolicy);
      mockVersionRepository.find.mockResolvedValue(mockVersions);

      const result = await service.getVersionsByPolicy(policyId);

      expect(mockPolicyRepository.findOne).toHaveBeenCalledWith({
        where: { id: policyId, deleted_at: null },
      });
      expect(mockVersionRepository.find).toHaveBeenCalledWith({
        where: { policy_id: policyId },
        relations: ['creator'],
        order: { version_number: 'DESC' },
      });
      expect(result).toEqual(mockVersions);
    });

    it('should throw NotFoundException if policy not found', async () => {
      mockPolicyRepository.findOne.mockResolvedValue(null);

      await expect(
        service.getVersionsByPolicy(policyId),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getVersion', () => {
    it('should return a specific version', async () => {
      const mockVersion = {
        id: versionId,
        policy_id: policyId,
        version_number: 1,
        content: 'Policy content',
      } as unknown as PolicyVersion;

      mockVersionRepository.findOne.mockResolvedValue(mockVersion);

      const result = await service.getVersion(versionId);

      expect(mockVersionRepository.findOne).toHaveBeenCalledWith({
        where: { id: versionId },
        relations: ['policy', 'creator'],
      });
      expect(result).toEqual(mockVersion);
    });

    it('should throw NotFoundException if version not found', async () => {
      mockVersionRepository.findOne.mockResolvedValue(null);

      await expect(service.getVersion(versionId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getLatestVersion', () => {
    it('should return the latest version of a policy', async () => {
      const mockVersion = {
        id: versionId,
        policy_id: policyId,
        version_number: 2,
        version: '1.2',
      } as unknown as PolicyVersion;

      mockVersionRepository.findOne.mockResolvedValue(mockVersion);

      const result = await service.getLatestVersion(policyId);

      expect(mockVersionRepository.findOne).toHaveBeenCalledWith({
        where: { policy_id: policyId },
        relations: ['creator'],
        order: { version_number: 'DESC' },
      });
      expect(result).toEqual(mockVersion);
    });

    it('should throw NotFoundException if no versions found', async () => {
      mockVersionRepository.findOne.mockResolvedValue(null);

      await expect(service.getLatestVersion(policyId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getVersionByNumber', () => {
    it('should return a version by number', async () => {
      const mockVersion = {
        id: versionId,
        policy_id: policyId,
        version_number: 1,
        version: '1.0',
      } as unknown as PolicyVersion;

      mockVersionRepository.findOne.mockResolvedValue(mockVersion);

      const result = await service.getVersionByNumber(policyId, 1);

      expect(mockVersionRepository.findOne).toHaveBeenCalledWith({
        where: { policy_id: policyId, version_number: 1 },
        relations: ['creator'],
      });
      expect(result).toEqual(mockVersion);
    });

    it('should throw NotFoundException if version not found', async () => {
      mockVersionRepository.findOne.mockResolvedValue(null);

      await expect(
        service.getVersionByNumber(policyId, 999),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteVersion', () => {
    it('should delete a version successfully', async () => {
      const mockVersion = {
        id: versionId,
        policy_id: policyId,
      } as unknown as PolicyVersion;

      mockVersionRepository.findOne.mockResolvedValue(mockVersion);
      mockVersionRepository.count.mockResolvedValue(2); // More than 1 version exists
      mockVersionRepository.remove.mockResolvedValue({});

      await service.deleteVersion(versionId);

      expect(mockVersionRepository.count).toHaveBeenCalledWith({
        where: { policy_id: policyId },
      });
      expect(mockVersionRepository.remove).toHaveBeenCalledWith(mockVersion);
    });

    it('should throw BadRequestException if only one version exists', async () => {
      const mockVersion = {
        id: versionId,
        policy_id: policyId,
      } as unknown as PolicyVersion;

      mockVersionRepository.findOne.mockResolvedValue(mockVersion);
      mockVersionRepository.count.mockResolvedValue(1);

      await expect(service.deleteVersion(versionId)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw NotFoundException if version not found', async () => {
      mockVersionRepository.findOne.mockResolvedValue(null);

      await expect(service.deleteVersion(versionId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('compareVersions', () => {
    it('should compare two versions', async () => {
      const version1 = {
        id: 'version-1',
        content: 'Old content',
        change_summary: 'v1',
      } as unknown as PolicyVersion;

      const version2 = {
        id: 'version-2',
        content: 'New content',
        change_summary: 'v2',
      } as unknown as PolicyVersion;

      mockVersionRepository.findOne
        .mockResolvedValueOnce(version1)
        .mockResolvedValueOnce(version2);

      const result = await service.compareVersions('version-1', 'version-2');

      expect(result.version1).toEqual(version1);
      expect(result.version2).toEqual(version2);
      expect(result.differences).toContain('Content has changed');
      expect(result.differences).toContain('Change summary differs');
    });

    it('should return empty differences if versions are the same', async () => {
      const version = {
        id: 'version-1',
        content: 'Same content',
        change_summary: 'Same summary',
      } as unknown as PolicyVersion;

      mockVersionRepository.findOne
        .mockResolvedValueOnce(version)
        .mockResolvedValueOnce(version);

      const result = await service.compareVersions('version-1', 'version-1');

      expect(result.differences).toHaveLength(0);
    });
  });

  describe('getVersionHistory', () => {
    it('should return version history for a policy', async () => {
      const mockVersions = [
        {
          version_number: 2,
          version: '1.2',
          created_at: new Date('2024-12-23'),
          creator: { id: userId },
          change_summary: 'Second version',
        },
        {
          version_number: 1,
          version: '1.1',
          created_at: new Date('2024-12-22'),
          creator: { id: userId },
          change_summary: 'First version',
        },
      ] as unknown as PolicyVersion[];

      mockPolicyRepository.findOne.mockResolvedValue({ id: policyId });
      mockVersionRepository.find.mockResolvedValue(mockVersions);

      const result = await service.getVersionHistory(policyId);

      expect(result).toHaveLength(2);
      expect(result[0].versionNumber).toBe(2);
      expect(result[1].versionNumber).toBe(1);
    });
  });

  describe('rollbackToVersion', () => {
    it('should rollback to a previous version', async () => {
      const targetVersion = {
        id: 'version-1',
        policy_id: policyId,
        version_number: 1,
        content: 'Old content',
      } as unknown as PolicyVersion;

      const currentPolicy = {
        id: policyId,
        version_number: 3,
      } as unknown as Policy;

      const mockUser = { id: userId } as unknown as User;

      const newVersion = {
        id: 'version-4',
        policy_id: policyId,
        version_number: 4,
        version: '0.4',
        content: 'Old content',
        change_summary: 'Rolled back to version 1',
      } as unknown as PolicyVersion;

      // First findOne call gets targetVersion by versionNumber
      // Second findOne call gets policy for validation
      // Third findOne call (in createVersion) gets user
      mockVersionRepository.findOne.mockResolvedValueOnce(targetVersion);
      mockPolicyRepository.findOne.mockResolvedValue(currentPolicy);
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockVersionRepository.create.mockReturnValue(newVersion);
      mockVersionRepository.save.mockResolvedValue(newVersion);

      const result = await service.rollbackToVersion(policyId, 1, userId);

      expect(result.content).toBe('Old content');
      expect(result.change_summary).toContain('Rolled back');
    });
  });
});
