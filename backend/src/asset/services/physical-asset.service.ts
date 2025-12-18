import { Injectable, NotFoundException, ConflictException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { PhysicalAsset } from '../entities/physical-asset.entity';
import { CreatePhysicalAssetDto } from '../dto/create-physical-asset.dto';
import { UpdatePhysicalAssetDto } from '../dto/update-physical-asset.dto';
import { PhysicalAssetResponseDto } from '../dto/physical-asset-response.dto';
import { PhysicalAssetQueryDto } from '../dto/physical-asset-query.dto';
import { AssetAuditService } from './asset-audit.service';
import { AssetType as AuditAssetType } from '../entities/asset-audit-log.entity';
import { AssetDependency, AssetType } from '../entities/asset-dependency.entity';
import { RiskAssetLinkService } from '../../risk/services/risk-asset-link.service';
import { RiskAssetType } from '../../risk/entities/risk-asset-link.entity';
import { AssetDependencyService } from './asset-dependency.service';
import { NotificationService } from '../../common/services/notification.service';
import { NotificationType, NotificationPriority } from '../../common/entities/notification.entity';
import { InformationAsset } from '../entities/information-asset.entity';
import { BusinessApplication } from '../entities/business-application.entity';
import { SoftwareAsset } from '../entities/software-asset.entity';
import { Supplier } from '../entities/supplier.entity';

@Injectable()
export class PhysicalAssetService {
  private readonly logger = new Logger(PhysicalAssetService.name);

  constructor(
    @InjectRepository(PhysicalAsset)
    private assetRepository: Repository<PhysicalAsset>,
    @InjectRepository(AssetDependency)
    private dependencyRepository: Repository<AssetDependency>,
    @InjectRepository(InformationAsset)
    private informationAssetRepository: Repository<InformationAsset>,
    @InjectRepository(BusinessApplication)
    private businessApplicationRepository: Repository<BusinessApplication>,
    @InjectRepository(SoftwareAsset)
    private softwareAssetRepository: Repository<SoftwareAsset>,
    @InjectRepository(Supplier)
    private supplierRepository: Repository<Supplier>,
    private auditService: AssetAuditService,
    private riskAssetLinkService: RiskAssetLinkService,
    private assetDependencyService: AssetDependencyService,
    private notificationService: NotificationService,
  ) {}

  async findAll(query?: PhysicalAssetQueryDto): Promise<{
    data: PhysicalAssetResponseDto[];
    total: number;
    page: number;
    limit: number;
  }> {
    const page = query?.page || 1;
    const limit = query?.limit || 20;
    const skip = (page - 1) * limit;

    const queryBuilder = this.assetRepository
      .createQueryBuilder('asset')
      .leftJoinAndSelect('asset.owner', 'owner')
      .leftJoinAndSelect('asset.assetType', 'assetType')
      .leftJoinAndSelect('asset.businessUnit', 'businessUnit')
      .where('asset.deletedAt IS NULL');

    // Search filter
    if (query?.search) {
      queryBuilder.andWhere(
        '(asset.assetDescription ILIKE :search OR asset.uniqueIdentifier ILIKE :search OR asset.serialNumber ILIKE :search)',
        { search: `%${query.search}%` },
      );
    }

    // Asset type filter
    if (query?.assetType) {
      queryBuilder.andWhere('asset.assetTypeId = :assetTypeId', { assetTypeId: query.assetType });
    }

    // Criticality level filter
    if (query?.criticalityLevel) {
      queryBuilder.andWhere('asset.criticalityLevel = :criticalityLevel', {
        criticalityLevel: query.criticalityLevel,
      });
    }

    // Connectivity status filter
    if (query?.connectivityStatus) {
      queryBuilder.andWhere('asset.connectivityStatus = :connectivityStatus', {
        connectivityStatus: query.connectivityStatus,
      });
    }

    // Business unit filter
    if (query?.businessUnit) {
      queryBuilder.andWhere('asset.businessUnitId = :businessUnitId', { businessUnitId: query.businessUnit });
    }

    // Owner filter
    if (query?.ownerId) {
      queryBuilder.andWhere('asset.ownerId = :ownerId', { ownerId: query.ownerId });
    }

    // Dependency filter
    if (query?.hasDependencies !== undefined) {
      const subQuery = this.dependencyRepository
        .createQueryBuilder('dep')
        .select('1')
        .where('(dep.sourceAssetType = :assetType AND dep.sourceAssetId = asset.id) OR (dep.targetAssetType = :assetType AND dep.targetAssetId = asset.id)')
        .setParameter('assetType', AssetType.PHYSICAL)
        .limit(1);

      if (query.hasDependencies) {
        // Assets WITH dependencies
        queryBuilder.andWhere(`EXISTS (${subQuery.getQuery()})`);
      } else {
        // Assets WITHOUT dependencies
        queryBuilder.andWhere(`NOT EXISTS (${subQuery.getQuery()})`);
      }
    }

    // Get total count
    const total = await queryBuilder.getCount();

    // Apply pagination and ordering
    const assets = await queryBuilder
      .orderBy('asset.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getMany();

    // Get risk counts for all assets in batch
    const assetIds = assets.map(a => a.id);
    const riskCounts = await this.getRiskCountsForAssets(assetIds);

    return {
      data: assets.map((asset) => this.toResponseDto(asset, riskCounts[asset.id])),
      total,
      page,
      limit,
    };
  }

  async findOne(id: string): Promise<PhysicalAssetResponseDto> {
    const asset = await this.assetRepository.findOne({
      where: { id, deletedAt: IsNull() },
      relations: ['owner', 'assetType', 'businessUnit', 'createdByUser', 'updatedByUser'],
    });

    if (!asset) {
      throw new NotFoundException(`Physical asset with ID ${id} not found`);
    }

    // Get risk count for this asset
    const riskCount = await this.getRiskCountForAsset(id);

    return this.toResponseDto(asset, riskCount);
  }

  async create(createDto: CreatePhysicalAssetDto, userId: string): Promise<PhysicalAssetResponseDto> {
    // Generate unique identifier if not provided
    let uniqueIdentifier = createDto.uniqueIdentifier;
    if (!uniqueIdentifier) {
      uniqueIdentifier = await this.generateUniqueIdentifier();
    }

    // Check for duplicate identifier
    const existing = await this.assetRepository.findOne({
      where: { uniqueIdentifier, deletedAt: IsNull() },
    });

    if (existing) {
      throw new ConflictException(`Asset with identifier ${uniqueIdentifier} already exists`);
    }

    // Prepare asset data - JSONB fields should be stored as objects/arrays directly
    const assetData: any = {
      ...createDto,
      uniqueIdentifier,
      ipAddresses: createDto.ipAddresses || null,
      macAddresses: createDto.macAddresses || null,
      installedSoftware: createDto.installedSoftware || null,
      activePortsServices: createDto.activePortsServices || null,
      complianceRequirements: createDto.complianceRequirements || null,
      securityTestResults: createDto.securityTestResults || null,
      purchaseDate: createDto.purchaseDate ? new Date(createDto.purchaseDate) : null,
      warrantyExpiry: createDto.warrantyExpiry ? new Date(createDto.warrantyExpiry) : null,
      lastConnectivityCheck: createDto.lastConnectivityCheck ? new Date(createDto.lastConnectivityCheck) : null,
      createdBy: userId,
    };

    const asset = this.assetRepository.create(assetData);
    const saved = await this.assetRepository.save(asset);
    const savedEntity = Array.isArray(saved) ? saved[0] : saved;

    // Reload with relations
    const reloaded = await this.assetRepository.findOne({
      where: { id: savedEntity.id },
      relations: ['owner', 'assetType', 'businessUnit'],
    });

    // Log creation
    await this.auditService.logCreate(AuditAssetType.PHYSICAL, savedEntity.id, userId);

    return this.toResponseDto(reloaded!);
  }

  async update(id: string, updateDto: UpdatePhysicalAssetDto, userId: string): Promise<PhysicalAssetResponseDto> {
    const asset = await this.assetRepository.findOne({
      where: { id, deletedAt: IsNull() },
    });

    if (!asset) {
      throw new NotFoundException(`Physical asset with ID ${id} not found`);
    }

    // Check for duplicate identifier if changing
    if (updateDto.uniqueIdentifier && updateDto.uniqueIdentifier !== asset.uniqueIdentifier) {
      const existing = await this.assetRepository.findOne({
        where: { uniqueIdentifier: updateDto.uniqueIdentifier, deletedAt: IsNull() },
      });

      if (existing) {
        throw new ConflictException(`Asset with identifier ${updateDto.uniqueIdentifier} already exists`);
      }
    }

    // Capture previous owner for notification workflow
    const previousOwnerId = asset.ownerId;

    // Extract optional change reason (used for audit logging)
    const { changeReason, ...rawUpdateDto } = updateDto;

    // Prepare update data - JSONB fields should be stored as objects/arrays directly
    const updateData: any = {
      ...rawUpdateDto,
      updatedBy: userId,
    };

    // Handle date conversions
    if (updateDto.purchaseDate) {
      updateData.purchaseDate = new Date(updateDto.purchaseDate);
    }

    if (updateDto.warrantyExpiry) {
      updateData.warrantyExpiry = new Date(updateDto.warrantyExpiry);
    }

    if (updateDto.lastConnectivityCheck) {
      updateData.lastConnectivityCheck = new Date(updateDto.lastConnectivityCheck);
    }

    // Track changes for audit log
    const changes: Record<string, { old: any; new: any }> = {};
    Object.keys(updateData).forEach((key) => {
      if (key !== 'updatedBy' && asset[key] !== updateData[key]) {
        changes[key] = {
          old: asset[key],
          new: updateData[key],
        };
      }
    });

    // Determine if any "critical" fields were changed
    const criticalFields = [
      'uniqueIdentifier',
      'assetDescription',
      'criticalityLevel',
      'ownerId',
      'businessUnitId',
      'physicalLocation',
    ];
    const hasCriticalChanges = criticalFields.some((field) => field in changes);

    // If critical fields changed but no changeReason was provided, enforce justification
    if (hasCriticalChanges && (!changeReason || !changeReason.trim())) {
      throw new BadRequestException(
        'A reason for change is required when updating key asset fields (identifier, description, criticality, owner, business unit, or location).',
      );
    }

    Object.assign(asset, updateData);
    const updated = await this.assetRepository.save(asset);

    // Log changes if any
    if (Object.keys(changes).length > 0) {
      await this.auditService.logUpdate(AuditAssetType.PHYSICAL, id, changes, userId, changeReason);
    }

    // Reload with relations
    const reloaded = await this.assetRepository.findOne({
      where: { id: updated.id },
      relations: ['owner', 'assetType', 'businessUnit'],
    });

    // TODO: Owner change notification workflow
    // If the ownerId changed, this is where we would trigger notifications
    // (e.g., email new owner, notify previous owner/manager, etc.).
    const newOwnerId = reloaded?.ownerId;
    if (previousOwnerId !== newOwnerId && newOwnerId) {
      // For now, we rely on the audit trail and leave a clear hook
      // for a future AssetOwnershipNotificationService to plug in here.
      // Example:
      // await this.ownershipNotificationService.handleOwnerChange({
      //   assetType: 'physical',
      //   assetId: id,
      //   previousOwnerId,
      //   newOwnerId,
      //   changedByUserId: userId,
      // });
    }

    // Notify owners of dependent assets if there were changes
    if (Object.keys(changes).length > 0) {
      await this.notifyDependentAssetOwners(id, reloaded!, changes, changeReason).catch((error) => {
        // Log error but don't fail the update
        this.logger.error(`Failed to notify dependent asset owners: ${error.message}`, error.stack);
      });
    }

    return this.toResponseDto(reloaded!);
  }

  async remove(id: string, userId: string): Promise<void> {
    const asset = await this.assetRepository.findOne({ where: { id, deletedAt: IsNull() } });

    if (!asset) {
      throw new NotFoundException(`Physical asset with ID ${id} not found`);
    }

    // Log deletion before soft delete
    await this.auditService.logDelete(AuditAssetType.PHYSICAL, id, userId);

    // Soft delete
    asset.deletedAt = new Date();
    await this.assetRepository.save(asset);
  }

  private async generateUniqueIdentifier(): Promise<string> {
    const prefix = 'PA';
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${prefix}-${timestamp}-${random}`;
  }

  private async getRiskCountForAsset(assetId: string): Promise<number> {
    const links = await this.riskAssetLinkService.findByAsset(RiskAssetType.PHYSICAL, assetId);
    return links.length;
  }

  private async getRiskCountsForAssets(assetIds: string[]): Promise<Record<string, number>> {
    if (assetIds.length === 0) return {};
    
    const counts: Record<string, number> = {};
    // Batch query risk counts for all assets
    for (const assetId of assetIds) {
      const links = await this.riskAssetLinkService.findByAsset(RiskAssetType.PHYSICAL, assetId);
      counts[assetId] = links.length;
    }
    return counts;
  }

  /**
   * Notify owners of assets that depend on this physical asset when it is updated
   */
  private async notifyDependentAssetOwners(
    physicalAssetId: string,
    physicalAsset: PhysicalAsset,
    changes: Record<string, { old: any; new: any }>,
    changeReason?: string,
  ): Promise<void> {
    // Find all dependencies where this physical asset is the target (incoming dependencies)
    const incomingDependencies = await this.dependencyRepository.find({
      where: {
        targetAssetType: AssetType.PHYSICAL,
        targetAssetId: physicalAssetId,
      },
    });

    if (incomingDependencies.length === 0) {
      return; // No dependent assets to notify
    }

    // Get owner IDs from all dependent assets
    const ownerIds = new Set<string>();

    for (const dep of incomingDependencies) {
      const ownerId = await this.getOwnerIdFromAsset(dep.sourceAssetType, dep.sourceAssetId);
      if (ownerId) {
        ownerIds.add(ownerId);
      }
    }

    if (ownerIds.size === 0) {
      return; // No owners to notify
    }

    // Build change summary
    const changedFields = Object.keys(changes);
    const changeSummary = changedFields
      .map((field) => {
        const change = changes[field];
        return `${field}: "${change.old ?? 'N/A'}" → "${change.new ?? 'N/A'}"`;
      })
      .join(', ');

    const assetIdentifier = physicalAsset.uniqueIdentifier || physicalAsset.assetDescription || physicalAssetId;
    const message = `The physical asset "${assetIdentifier}" that your asset depends on has been updated. Changes: ${changeSummary}.${changeReason ? ` Reason: ${changeReason}` : ''}`;

    // Send notifications to all dependent asset owners
    await this.notificationService.createBulk(Array.from(ownerIds), {
      type: NotificationType.GENERAL,
      priority: NotificationPriority.MEDIUM,
      title: 'Dependent Asset Updated',
      message,
      entityType: 'physical_asset',
      entityId: physicalAssetId,
      actionUrl: `/dashboard/assets/physical/${physicalAssetId}`,
    });

    this.logger.log(
      `Sent dependency notifications to ${ownerIds.size} owners for physical asset ${physicalAssetId}`,
    );
  }

  /**
   * Get the owner ID from an asset based on its type
   */
  private async getOwnerIdFromAsset(assetType: AssetType, assetId: string): Promise<string | null> {
    try {
      switch (assetType) {
        case AssetType.PHYSICAL: {
          const asset = await this.assetRepository.findOne({
            where: { id: assetId, deletedAt: IsNull() },
            select: ['ownerId'],
          });
          return asset?.ownerId || null;
        }

        case AssetType.INFORMATION: {
          const asset = await this.informationAssetRepository.findOne({
            where: { id: assetId, deletedAt: IsNull() },
            select: ['informationOwnerId', 'assetCustodianId'],
          });
          // Prefer informationOwnerId, fallback to assetCustodianId
          return asset?.informationOwnerId || asset?.assetCustodianId || null;
        }

        case AssetType.APPLICATION: {
          const asset = await this.businessApplicationRepository.findOne({
            where: { id: assetId, deletedAt: IsNull() },
            select: ['ownerId'],
          });
          return asset?.ownerId || null;
        }

        case AssetType.SOFTWARE: {
          const asset = await this.softwareAssetRepository.findOne({
            where: { id: assetId, deletedAt: IsNull() },
            select: ['ownerId'],
          });
          return asset?.ownerId || null;
        }

        case AssetType.SUPPLIER: {
          const asset = await this.supplierRepository.findOne({
            where: { id: assetId, deletedAt: IsNull() },
            select: ['ownerId'],
          });
          return asset?.ownerId || null;
        }

        default:
          this.logger.warn(`Unknown asset type: ${assetType}`);
          return null;
      }
    } catch (error) {
      this.logger.error(`Error getting owner for ${assetType} asset ${assetId}: ${error.message}`);
      return null;
    }
  }

  private toResponseDto(asset: PhysicalAsset, riskCount?: number): PhysicalAssetResponseDto {
    return {
      id: asset.id,
      assetTypeId: asset.assetTypeId || undefined,
      assetType: asset.assetType
        ? {
            id: asset.assetType.id,
            name: asset.assetType.name,
            category: asset.assetType.category,
          }
        : undefined,
      assetDescription: asset.assetDescription,
      manufacturer: asset.manufacturer || undefined,
      model: asset.model || undefined,
      businessPurpose: asset.businessPurpose || undefined,
      ownerId: asset.ownerId || undefined,
      owner: asset.owner
        ? {
            id: asset.owner.id,
            email: asset.owner.email,
            firstName: asset.owner.firstName || undefined,
            lastName: asset.owner.lastName || undefined,
          }
        : undefined,
      businessUnitId: asset.businessUnitId || undefined,
      businessUnit: asset.businessUnit
        ? {
            id: asset.businessUnit.id,
            name: asset.businessUnit.name,
            code: asset.businessUnit.code || undefined,
          }
        : undefined,
      uniqueIdentifier: asset.uniqueIdentifier,
      physicalLocation: asset.physicalLocation || undefined,
      criticalityLevel: asset.criticalityLevel || undefined,
      macAddresses: Array.isArray(asset.macAddresses) ? asset.macAddresses : undefined,
      ipAddresses: Array.isArray(asset.ipAddresses) ? asset.ipAddresses : undefined,
      installedSoftware: Array.isArray(asset.installedSoftware) ? asset.installedSoftware : undefined,
      activePortsServices: Array.isArray(asset.activePortsServices) ? asset.activePortsServices : undefined,
      networkApprovalStatus: asset.networkApprovalStatus || undefined,
      connectivityStatus: asset.connectivityStatus || undefined,
      lastConnectivityCheck: asset.lastConnectivityCheck || undefined,
      serialNumber: asset.serialNumber || undefined,
      assetTag: asset.assetTag || undefined,
      purchaseDate: asset.purchaseDate || undefined,
      warrantyExpiry: asset.warrantyExpiry || undefined,
      complianceRequirements: Array.isArray(asset.complianceRequirements) ? asset.complianceRequirements : undefined,
      securityTestResults: asset.securityTestResults || undefined,
      createdAt: asset.createdAt,
      updatedAt: asset.updatedAt,
      deletedAt: asset.deletedAt || undefined,
      riskCount: riskCount,
    };
  }
}


