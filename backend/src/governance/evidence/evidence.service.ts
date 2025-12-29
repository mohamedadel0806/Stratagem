import { Injectable, NotFoundException, Logger, Optional } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, ILike, In } from 'typeorm';
import { Evidence } from './entities/evidence.entity';
import { EvidenceLinkage, EvidenceLinkType } from './entities/evidence-linkage.entity';
import { CreateEvidenceDto } from './dto/create-evidence.dto';
import { NotificationService } from '../../common/services/notification.service';
import { NotificationType, NotificationPriority } from '../../common/entities/notification.entity';
import * as fs from 'fs';
import * as path from 'path';
import * as fflate from 'fflate';

@Injectable()
export class EvidenceService {
  private readonly logger = new Logger(EvidenceService.name);

  constructor(
    @InjectRepository(Evidence)
    private evidenceRepository: Repository<Evidence>,
    @InjectRepository(EvidenceLinkage)
    private evidenceLinkageRepository: Repository<EvidenceLinkage>,
    @Optional() private notificationService?: NotificationService,
  ) { }

  async create(createEvidenceDto: CreateEvidenceDto, userId: string, tenantId: string): Promise<Evidence> {
    // @ts-ignore - TypeORM entity type inference issue
    const evidence = this.evidenceRepository.create({
      ...createEvidenceDto,
      uploaded_by: userId,
      tenant_id: tenantId,
    });

    const savedEvidence = await this.evidenceRepository.save(evidence);

    // Send notification if evidence needs approval
    // @ts-ignore - TypeORM entity type inference issue
    if (this.notificationService && savedEvidence.approved_by) {
      try {
        await this.notificationService.create({
          userId: savedEvidence.approved_by,
          type: NotificationType.GENERAL,
          priority: NotificationPriority.MEDIUM,
          title: 'Evidence Submitted for Approval',
          message: `Evidence "${savedEvidence.title}" has been submitted and requires your approval.`,
          entityType: 'evidence',
          entityId: savedEvidence.id,
          actionUrl: `/dashboard/governance/evidence/${savedEvidence.id}`,
        });
      } catch (error) {
        this.logger.error(`Failed to send notification on evidence creation: ${error.message}`, error.stack);
      }
    }

    // @ts-ignore - TypeORM entity type inference issue
    return savedEvidence;
  }

  async findAll(query?: {
    page?: number;
    limit?: number;
    evidence_type?: string;
    status?: string;
    search?: string;
  }) {
    const { page = 1, limit = 25, evidence_type, status, search } = query || {};
    const skip = (page - 1) * limit;

    const where: FindOptionsWhere<Evidence> = {};

    if (evidence_type) {
      where.evidence_type = evidence_type as any;
    }

    if (status) {
      where.status = status as any;
    }

    const queryBuilder = this.evidenceRepository
      .createQueryBuilder('evidence')
      .leftJoinAndSelect('evidence.collector', 'collector')
      .leftJoinAndSelect('evidence.creator', 'creator')
      .leftJoinAndSelect('evidence.approver', 'approver');

    if (Object.keys(where).length > 0) {
      queryBuilder.where(where);
    }

    if (search) {
      queryBuilder.andWhere(
        '(evidence.title ILIKE :search OR evidence.description ILIKE :search OR evidence.evidence_identifier ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    queryBuilder.orderBy('evidence.created_at', 'DESC');

    const [data, total] = await queryBuilder.skip(skip).take(limit).getManyAndCount();

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

  async findOne(id: string): Promise<Evidence> {
    const evidence = await this.evidenceRepository.findOne({
      where: { id },
      relations: ['collector', 'creator', 'approver', 'linkages'],
    });

    if (!evidence) {
      throw new NotFoundException(`Evidence with ID ${id} not found`);
    }

    return evidence;
  }

  async update(id: string, updateDto: Partial<CreateEvidenceDto>, userId: string): Promise<Evidence> {
    const evidence = await this.findOne(id);
    const oldStatus = evidence.status;

    Object.assign(evidence, updateDto);

    const savedEvidence = await this.evidenceRepository.save(evidence);

    // Send notifications on status changes
    if (this.notificationService && oldStatus !== savedEvidence.status) {
      try {
        // Notify collector/creator when approved or rejected
        if (savedEvidence.status === 'approved' || savedEvidence.status === 'rejected') {
          const recipientId = savedEvidence.collector_id || savedEvidence.created_by;
          if (recipientId) {
            await this.notificationService.create({
              userId: recipientId,
              type: NotificationType.GENERAL,
              priority: savedEvidence.status === 'approved' ? NotificationPriority.MEDIUM : NotificationPriority.HIGH,
              title: savedEvidence.status === 'approved' ? 'Evidence Approved' : 'Evidence Rejected',
              message: `Evidence "${savedEvidence.title}" has been ${savedEvidence.status}.`,
              entityType: 'evidence',
              entityId: savedEvidence.id,
              actionUrl: `/dashboard/governance/evidence/${savedEvidence.id}`,
            });
          }
        }

        // Notify creator when evidence is expiring soon
        if (savedEvidence.status === 'approved' && savedEvidence.valid_until_date) {
          const daysUntilExpiry = Math.ceil(
            (new Date(savedEvidence.valid_until_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
          );
          if (daysUntilExpiry <= 30 && savedEvidence.created_by) {
            await this.notificationService.create({
              userId: savedEvidence.created_by,
              type: NotificationType.DEADLINE_APPROACHING,
              priority: NotificationPriority.MEDIUM,
              title: 'Evidence Expiring Soon',
              message: `Evidence "${savedEvidence.title}" will expire in ${daysUntilExpiry} day(s).`,
              entityType: 'evidence',
              entityId: savedEvidence.id,
              actionUrl: `/dashboard/governance/evidence/${savedEvidence.id}`,
            });
          }
        }
      } catch (error) {
        this.logger.error(`Failed to send notification on evidence status change: ${error.message}`, error.stack);
      }
    }

    return savedEvidence;
  }

  async remove(id: string): Promise<void> {
    const evidence = await this.findOne(id);
    await this.evidenceRepository.softRemove(evidence);
  }

  async linkEvidence(
    evidenceId: string,
    linkType: EvidenceLinkType,
    linkedEntityId: string,
    description?: string,
    userId?: string,
  ): Promise<EvidenceLinkage> {
    const evidence = await this.findOne(evidenceId);

    const linkage = this.evidenceLinkageRepository.create({
      evidence_id: evidenceId,
      link_type: linkType,
      linked_entity_id: linkedEntityId,
      link_description: description,
      created_by: userId,
    });

    return this.evidenceLinkageRepository.save(linkage);
  }

  async getLinkedEvidence(linkType: EvidenceLinkType, linkedEntityId: string): Promise<Evidence[]> {
    const linkages = await this.evidenceLinkageRepository.find({
      where: {
        link_type: linkType,
        linked_entity_id: linkedEntityId,
      },
      relations: ['evidence', 'evidence.collector'],
    });

    return linkages.map((linkage) => linkage.evidence);
  }

  /**
   * Generate an audit-ready evidence package (ZIP)
   */
  async generateEvidencePackage(options: {
    evidenceIds?: string[];
    controlId?: string;
    assessmentId?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<{ data: Buffer; filename: string }> {
    let evidenceItems: Evidence[] = [];

    if (options.evidenceIds && options.evidenceIds.length > 0) {
      evidenceItems = await this.evidenceRepository.find({
        where: { id: In(options.evidenceIds) },
        relations: ['linkages'],
      });
    } else if (options.controlId) {
      evidenceItems = await this.getLinkedEvidence(EvidenceLinkType.CONTROL, options.controlId);
    } else if (options.assessmentId) {
      evidenceItems = await this.getLinkedEvidence(EvidenceLinkType.ASSESSMENT, options.assessmentId);
    } else {
      // Default: all approved evidence
      evidenceItems = await this.evidenceRepository.find({
        where: { status: 'approved' as any },
      });
    }

    if (evidenceItems.length === 0) {
      throw new NotFoundException('No evidence items found for the specified criteria');
    }

    const zipFiles: Record<string, Uint8Array> = {};
    const manifest: any[] = [];

    for (const item of evidenceItems) {
      const filePath = path.resolve(process.cwd(), item.file_path.startsWith('/') ? item.file_path.substring(1) : item.file_path);

      if (fs.existsSync(filePath)) {
        const fileData = fs.readFileSync(filePath);
        const fileName = `${item.evidence_identifier}_${item.filename || 'file'}`;
        zipFiles[fileName] = new Uint8Array(fileData);

        manifest.push({
          id: item.id,
          identifier: item.evidence_identifier,
          title: item.title,
          type: item.evidence_type,
          filename: fileName,
          collected_at: item.collection_date,
          status: item.status,
          description: item.description,
        });
      }
    }

    // Add manifest to ZIP
    zipFiles['manifest.json'] = Buffer.from(JSON.stringify(manifest, null, 2), 'utf-8');

    // Create ZIP using fflate
    const zipped = fflate.zipSync(zipFiles);
    const filename = `evidence_package_${new Date().toISOString().split('T')[0]}.zip`;

    return {
      data: Buffer.from(zipped),
      filename,
    };
  }
}

