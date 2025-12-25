import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PolicyVersion } from '../entities/policy-version.entity';
import { Policy } from '../entities/policy.entity';
import { User } from '../../../users/entities/user.entity';

@Injectable()
export class PolicyVersionService {
  private readonly logger = new Logger(PolicyVersionService.name);

  constructor(
    @InjectRepository(PolicyVersion)
    private versionRepository: Repository<PolicyVersion>,
    @InjectRepository(Policy)
    private policyRepository: Repository<Policy>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createVersion(
    policyId: string,
    content: string,
    version: string,
    versionNumber: number,
    changeSummary: string,
    userId: string,
  ): Promise<PolicyVersion> {
    // Validate policy exists
    const policy = await this.policyRepository.findOne({
      where: { id: policyId, deleted_at: null },
    });
    if (!policy) {
      throw new NotFoundException(`Policy with ID ${policyId} not found`);
    }

    // Validate user exists
    if (userId) {
      const user = await this.userRepository.findOne({
        where: { id: userId },
      });
      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }
    }

    const policyVersion = this.versionRepository.create({
      policy_id: policyId,
      content,
      version,
      version_number: versionNumber,
      change_summary: changeSummary,
      created_by: userId,
    });

    const savedVersion = await this.versionRepository.save(policyVersion);

    this.logger.log(
      `Created policy version: ${savedVersion.id} (v${versionNumber}) for policy ${policyId}`,
    );

    return savedVersion;
  }

  async getVersionsByPolicy(policyId: string): Promise<PolicyVersion[]> {
    // Validate policy exists
    const policy = await this.policyRepository.findOne({
      where: { id: policyId, deleted_at: null },
    });
    if (!policy) {
      throw new NotFoundException(`Policy with ID ${policyId} not found`);
    }

    return this.versionRepository.find({
      where: { policy_id: policyId },
      relations: ['creator'],
      order: { version_number: 'DESC' },
    });
  }

  async getVersion(versionId: string): Promise<PolicyVersion> {
    const version = await this.versionRepository.findOne({
      where: { id: versionId },
      relations: ['policy', 'creator'],
    });

    if (!version) {
      throw new NotFoundException(`Policy version with ID ${versionId} not found`);
    }

    return version;
  }

  async getLatestVersion(policyId: string): Promise<PolicyVersion> {
    const version = await this.versionRepository.findOne({
      where: { policy_id: policyId },
      relations: ['creator'],
      order: { version_number: 'DESC' },
    });

    if (!version) {
      throw new NotFoundException(
        `No versions found for policy with ID ${policyId}`,
      );
    }

    return version;
  }

  async getVersionByNumber(
    policyId: string,
    versionNumber: number,
  ): Promise<PolicyVersion> {
    const version = await this.versionRepository.findOne({
      where: { policy_id: policyId, version_number: versionNumber },
      relations: ['creator'],
    });

    if (!version) {
      throw new NotFoundException(
        `Policy version ${versionNumber} not found for policy ${policyId}`,
      );
    }

    return version;
  }

  async deleteVersion(versionId: string): Promise<void> {
    const version = await this.versionRepository.findOne({
      where: { id: versionId },
      relations: ['policy'],
    });

    if (!version) {
      throw new NotFoundException(`Policy version with ID ${versionId} not found`);
    }

    // Don't allow deleting the only version
    const versionCount = await this.versionRepository.count({
      where: { policy_id: version.policy_id },
    });

    if (versionCount <= 1) {
      throw new BadRequestException(
        'Cannot delete the only version of a policy',
      );
    }

    await this.versionRepository.remove(version);

    this.logger.log(`Deleted policy version: ${versionId}`);
  }

  async compareVersions(
    versionId1: string,
    versionId2: string,
  ): Promise<{
    version1: PolicyVersion;
    version2: PolicyVersion;
    differences: string[];
  }> {
    const version1 = await this.getVersion(versionId1);
    const version2 = await this.getVersion(versionId2);

    // Simple text comparison - can be enhanced with diff library
    const differences: string[] = [];

    if (version1.content !== version2.content) {
      differences.push('Content has changed');
    }

    if (version1.change_summary !== version2.change_summary) {
      differences.push('Change summary differs');
    }

    return {
      version1,
      version2,
      differences,
    };
  }

  async getVersionHistory(policyId: string): Promise<
    Array<{
      versionNumber: number;
      version: string;
      createdAt: Date;
      createdBy: string;
      changeSummary: string;
    }>
  > {
    const versions = await this.getVersionsByPolicy(policyId);

    return versions.map((v) => ({
      versionNumber: v.version_number,
      version: v.version,
      createdAt: v.created_at,
      createdBy: v.creator?.id || 'System',
      changeSummary: v.change_summary || 'No summary provided',
    }));
  }

  async rollbackToVersion(
    policyId: string,
    versionNumber: number,
    userId: string,
  ): Promise<PolicyVersion> {
    // Get the version to rollback to
    const targetVersion = await this.getVersionByNumber(policyId, versionNumber);

    // Create a new version with the old content
    const currentPolicy = await this.policyRepository.findOne({
      where: { id: policyId, deleted_at: null },
    });
    if (!currentPolicy) {
      throw new NotFoundException(`Policy with ID ${policyId} not found`);
    }

    const newVersionNumber = Math.max(
      currentPolicy.version_number || 1,
      versionNumber,
    ) + 1;
    const newVersion = `${Math.floor(newVersionNumber / 10)}.${newVersionNumber % 10}`;

    const rollbackVersion = await this.createVersion(
      policyId,
      targetVersion.content,
      newVersion,
      newVersionNumber,
      `Rolled back to version ${versionNumber}`,
      userId,
    );

    this.logger.log(
      `Rolled back policy ${policyId} to version ${versionNumber}`,
    );

    return rollbackVersion;
  }
}
