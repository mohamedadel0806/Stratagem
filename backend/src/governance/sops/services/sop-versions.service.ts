import { Injectable, NotFoundException, Logger, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SOPVersion, VersionStatus, VersionChangeType } from '../entities/sop-version.entity';
import {
  CreateSOPVersionDto,
  UpdateSOPVersionDto,
  ApproveSOPVersionDto,
  SOPVersionQueryDto,
} from '../dto/sop-version.dto';
import { SOP } from '../entities/sop.entity';

@Injectable()
export class SOPVersionsService {
  private readonly logger = new Logger(SOPVersionsService.name);

  constructor(
    @InjectRepository(SOPVersion)
    private versionRepository: Repository<SOPVersion>,
    @InjectRepository(SOP)
    private sopRepository: Repository<SOP>,
  ) {}

  async create(createDto: CreateSOPVersionDto, userId: string): Promise<SOPVersion> {
    // Verify SOP exists
    const sop = await this.sopRepository.findOne({ where: { id: createDto.sop_id } });
    if (!sop) {
      throw new NotFoundException(`SOP with ID ${createDto.sop_id} not found`);
    }

    // Check if version already exists
    const existing = await this.versionRepository.findOne({
      where: {
        sop_id: createDto.sop_id,
        version_number: createDto.version_number,
      },
    });

    if (existing) {
      throw new BadRequestException(
        `Version ${createDto.version_number} already exists for this SOP`,
      );
    }

    const version = this.versionRepository.create({
      ...createDto,
      created_by: userId,
      status: VersionStatus.DRAFT,
    });

    return this.versionRepository.save(version);
  }

  async findAll(queryDto: SOPVersionQueryDto) {
    const { page = 1, limit = 25, sop_id, status, sort } = queryDto;
    const skip = (page - 1) * limit;

    const queryBuilder = this.versionRepository
      .createQueryBuilder('version')
      .leftJoinAndSelect('version.sop', 'sop')
      .leftJoinAndSelect('version.creator', 'creator')
      .leftJoinAndSelect('version.updater', 'updater')
      .leftJoinAndSelect('version.approver', 'approver')
      .leftJoinAndSelect('version.publisher', 'publisher');

    if (sop_id) {
      queryBuilder.andWhere('version.sop_id = :sop_id', { sop_id });
    }

    if (status) {
      queryBuilder.andWhere('version.status = :status', { status });
    }

    if (sort) {
      const [field, order] = sort.split(':');
      queryBuilder.orderBy(`version.${field}`, order.toUpperCase() as 'ASC' | 'DESC');
    } else {
      queryBuilder.orderBy('version.created_at', 'DESC');
    }

    const [data, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<SOPVersion> {
    const version = await this.versionRepository.findOne({
      where: { id },
      relations: ['sop', 'creator', 'updater', 'approver', 'publisher'],
    });

    if (!version) {
      throw new NotFoundException(`SOP version with ID ${id} not found`);
    }

    return version;
  }

  async update(id: string, updateDto: UpdateSOPVersionDto, userId: string): Promise<SOPVersion> {
    const version = await this.findOne(id);

    // Can only update draft versions
    if (version.status !== VersionStatus.DRAFT) {
      throw new BadRequestException(`Cannot update version with status: ${version.status}`);
    }

    Object.assign(version, {
      ...updateDto,
      updated_by: userId,
    });

    return this.versionRepository.save(version);
  }

  async approve(id: string, approveDto: ApproveSOPVersionDto, userId: string): Promise<SOPVersion> {
    const version = await this.findOne(id);

    if (version.status !== VersionStatus.PENDING_APPROVAL) {
      throw new BadRequestException(`Version is not in pending approval status`);
    }

    version.status = approveDto.status;
    version.approved_by = userId;
    version.approved_at = new Date();
    version.approval_comments = approveDto.approval_comments;
    version.updated_by = userId;

    return this.versionRepository.save(version);
  }

  async publish(id: string, userId: string): Promise<SOPVersion> {
    const version = await this.findOne(id);

    if (version.status !== VersionStatus.APPROVED) {
      throw new BadRequestException(`Version must be approved before publishing`);
    }

    version.status = VersionStatus.PUBLISHED;
    version.published_by = userId;
    version.published_at = new Date();
    version.updated_by = userId;

    // Update SOP's content with this version's snapshot
    const sop = await this.sopRepository.findOne({ where: { id: version.sop_id } });
    if (sop && version.content_snapshot) {
      sop.content = version.content_snapshot.content || sop.content;
      sop.purpose = version.content_snapshot.purpose || sop.purpose;
      sop.scope = version.content_snapshot.scope || sop.scope;
      sop.version = version.version_number;
      sop.version_number = parseInt(version.version_number.split('.')[0], 10);
      await this.sopRepository.save(sop);
    }

    return this.versionRepository.save(version);
  }

  async submitForApproval(id: string, userId: string): Promise<SOPVersion> {
    const version = await this.findOne(id);

    if (version.status !== VersionStatus.DRAFT) {
      throw new BadRequestException(`Only draft versions can be submitted for approval`);
    }

    version.status = VersionStatus.PENDING_APPROVAL;
    version.updated_by = userId;

    return this.versionRepository.save(version);
  }

  async remove(id: string): Promise<void> {
    const version = await this.findOne(id);

    if (version.status === VersionStatus.PUBLISHED) {
      throw new BadRequestException(`Cannot delete published versions`);
    }

    await this.versionRepository.softRemove(version);
  }

  async getVersionHistory(sopId: string): Promise<SOPVersion[]> {
    return this.versionRepository.find({
      where: { sop_id: sopId },
      relations: ['creator', 'approver', 'publisher'],
      order: { created_at: 'DESC' },
    });
  }

  async getLatestVersion(sopId: string): Promise<SOPVersion | null> {
    return this.versionRepository.findOne({
      where: { sop_id: sopId, status: VersionStatus.PUBLISHED },
      relations: ['creator', 'publisher'],
      order: { published_at: 'DESC' },
    });
  }

  async getPendingApprovals(): Promise<SOPVersion[]> {
    return this.versionRepository.find({
      where: { status: VersionStatus.PENDING_APPROVAL },
      relations: ['sop', 'creator'],
      order: { created_at: 'ASC' },
    });
  }

  async calculateNextVersion(
    sopId: string,
    changeType: VersionChangeType,
  ): Promise<string> {
    const latestPublished = await this.getLatestVersion(sopId);

    if (!latestPublished) {
      return '1.0';
    }

    const [major, minor] = latestPublished.version_number.split('.').map(Number);

    switch (changeType) {
      case VersionChangeType.MAJOR:
        return `${major + 1}.0`;
      case VersionChangeType.MINOR:
        return `${major}.${minor + 1}`;
      case VersionChangeType.PATCH:
        // For patches, add a third number
        return `${major}.${minor}.1`;
      default:
        return `${major}.${minor + 1}`;
    }
  }

  async getVersionsRequiringRetraining(sopId: string): Promise<SOPVersion[]> {
    return this.versionRepository.find({
      where: {
        sop_id: sopId,
        requires_retraining: true,
        status: VersionStatus.PUBLISHED,
      },
      relations: ['publisher'],
      order: { published_at: 'DESC' },
    });
  }
}
