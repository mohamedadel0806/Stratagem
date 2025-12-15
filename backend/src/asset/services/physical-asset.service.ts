import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
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

@Injectable()
export class PhysicalAssetService {
  constructor(
    @InjectRepository(PhysicalAsset)
    private assetRepository: Repository<PhysicalAsset>,
    @InjectRepository(AssetDependency)
    private dependencyRepository: Repository<AssetDependency>,
    private auditService: AssetAuditService,
    private riskAssetLinkService: RiskAssetLinkService,
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
    const asset = await this.assetRepository.findOne({ where: { id, deletedAt: IsNull() } });

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

    // Prepare update data - JSONB fields should be stored as objects/arrays directly
    const updateData: any = {
      ...updateDto,
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

    Object.assign(asset, updateData);
    const updated = await this.assetRepository.save(asset);

    // Log changes if any
    if (Object.keys(changes).length > 0) {
      await this.auditService.logUpdate(AuditAssetType.PHYSICAL, id, changes, userId);
    }

    // Reload with relations
    const reloaded = await this.assetRepository.findOne({
      where: { id: updated.id },
      relations: ['owner', 'assetType', 'businessUnit'],
    });

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


