import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { InformationAsset } from '../entities/information-asset.entity';
import { CreateInformationAssetDto } from '../dto/create-information-asset.dto';
import { UpdateInformationAssetDto } from '../dto/update-information-asset.dto';
import { InformationAssetResponseDto } from '../dto/information-asset-response.dto';
import { InformationAssetQueryDto } from '../dto/information-asset-query.dto';
import { AssetAuditService } from './asset-audit.service';
import { AssetType } from '../entities/asset-audit-log.entity';
import { RiskAssetLinkService } from '../../risk/services/risk-asset-link.service';
import { RiskAssetType } from '../../risk/entities/risk-asset-link.entity';

@Injectable()
export class InformationAssetService {
  constructor(
    @InjectRepository(InformationAsset)
    private assetRepository: Repository<InformationAsset>,
    private auditService: AssetAuditService,
    private riskAssetLinkService: RiskAssetLinkService,
  ) {}

  async findAll(query?: InformationAssetQueryDto): Promise<{
    data: InformationAssetResponseDto[];
    total: number;
    page: number;
    limit: number;
  }> {
    const page = query?.page || 1;
    const limit = query?.limit || 20;
    const skip = (page - 1) * limit;

    const queryBuilder = this.assetRepository
      .createQueryBuilder('asset')
      .leftJoinAndSelect('asset.informationOwner', 'informationOwner')
      .leftJoinAndSelect('asset.assetCustodian', 'assetCustodian')
      .leftJoinAndSelect('asset.businessUnit', 'businessUnit')
      .where('asset.deletedAt IS NULL');

    if (query?.search) {
      queryBuilder.andWhere(
        '(asset.name ILIKE :search OR asset.informationType ILIKE :search)',
        { search: `%${query.search}%` },
      );
    }

    if (query?.dataClassification) {
      queryBuilder.andWhere('asset.classificationLevel = :classificationLevel', {
        classificationLevel: query.dataClassification,
      });
    }

    if (query?.businessUnit) {
      queryBuilder.andWhere('asset.businessUnitId = :businessUnitId', {
        businessUnitId: query.businessUnit,
      });
    }

    if (query?.ownerId) {
      queryBuilder.andWhere('asset.informationOwnerId = :informationOwnerId', { informationOwnerId: query.ownerId });
    }

    const total = await queryBuilder.getCount();

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

  async findOne(id: string): Promise<InformationAssetResponseDto> {
    const asset = await this.assetRepository.findOne({
      where: { id, deletedAt: IsNull() },
      relations: ['informationOwner', 'assetCustodian', 'businessUnit', 'createdByUser', 'updatedByUser'],
    });

    if (!asset) {
      throw new NotFoundException(`Information asset with ID ${id} not found`);
    }

    // Get risk count for this asset
    const riskCount = await this.getRiskCountForAsset(id);

    return this.toResponseDto(asset, riskCount);
  }

  async create(createDto: CreateInformationAssetDto, userId: string): Promise<InformationAssetResponseDto> {
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
      throw new ConflictException(`Information asset with identifier ${uniqueIdentifier} already exists`);
    }

    const asset = this.assetRepository.create({
      ...createDto,
      uniqueIdentifier,
      complianceRequirements: createDto.complianceRequirements || null,
      classificationDate: createDto.classificationDate ? new Date(createDto.classificationDate) : null,
      reclassificationDate: createDto.reclassificationDate ? new Date(createDto.reclassificationDate) : null,
      createdBy: userId,
      updatedBy: userId,
    });

    const savedAsset = await this.assetRepository.save(asset);
    
    // Reload with relations
    const reloaded = await this.assetRepository.findOne({
      where: { id: savedAsset.id },
      relations: ['informationOwner', 'assetCustodian', 'businessUnit'],
    });
    
    // Log creation
    await this.auditService.logCreate(AssetType.INFORMATION, savedAsset.id, userId);
    
    return this.toResponseDto(reloaded!);
  }

  async update(
    id: string,
    updateDto: UpdateInformationAssetDto,
    userId: string,
  ): Promise<InformationAssetResponseDto> {
    const asset = await this.assetRepository.findOne({
      where: { id, deletedAt: IsNull() },
    });

    if (!asset) {
      throw new NotFoundException(`Information asset with ID ${id} not found`);
    }

    // Track changes for audit log
    const changes: Record<string, { old: any; new: any }> = {};
    const updateData: any = {
      ...updateDto,
      updatedBy: userId,
    };

    // Handle date conversions
    if (updateDto.classificationDate) {
      updateData.classificationDate = new Date(updateDto.classificationDate);
    }

    if (updateDto.reclassificationDate) {
      updateData.reclassificationDate = new Date(updateDto.reclassificationDate);
    }

    Object.keys(updateData).forEach((key) => {
      if (key !== 'updatedBy' && asset[key] !== updateData[key]) {
        changes[key] = {
          old: asset[key],
          new: updateData[key],
        };
      }
    });

    Object.assign(asset, updateData);
    const savedAsset = await this.assetRepository.save(asset);

    // Reload with relations
    const reloaded = await this.assetRepository.findOne({
      where: { id: savedAsset.id },
      relations: ['informationOwner', 'assetCustodian', 'businessUnit'],
    });

    // Log changes if any
    if (Object.keys(changes).length > 0) {
      await this.auditService.logUpdate(AssetType.INFORMATION, id, changes, userId);
    }

    return this.toResponseDto(reloaded!);
  }

  async remove(id: string, userId: string): Promise<void> {
    const asset = await this.assetRepository.findOne({
      where: { id, deletedAt: IsNull() },
    });

    if (!asset) {
      throw new NotFoundException(`Information asset with ID ${id} not found`);
    }

    // Log deletion before soft delete
    await this.auditService.logDelete(AssetType.INFORMATION, id, userId);

    asset.deletedAt = new Date();
    await this.assetRepository.save(asset);
  }

  private async getRiskCountForAsset(assetId: string): Promise<number> {
    const links = await this.riskAssetLinkService.findByAsset(RiskAssetType.INFORMATION, assetId);
    return links.length;
  }

  private async getRiskCountsForAssets(assetIds: string[]): Promise<Record<string, number>> {
    if (assetIds.length === 0) return {};
    
    const counts: Record<string, number> = {};
    // Batch query risk counts for all assets
    for (const assetId of assetIds) {
      const links = await this.riskAssetLinkService.findByAsset(RiskAssetType.INFORMATION, assetId);
      counts[assetId] = links.length;
    }
    return counts;
  }

  private toResponseDto(asset: InformationAsset, riskCount?: number): InformationAssetResponseDto {
    return {
      id: asset.id,
      uniqueIdentifier: asset.uniqueIdentifier,
      informationType: asset.informationType,
      name: asset.name,
      description: asset.description || undefined,
      classificationLevel: asset.classificationLevel,
      classificationDate: asset.classificationDate || undefined,
      reclassificationDate: asset.reclassificationDate || undefined,
      reclassificationReminderSent: asset.reclassificationReminderSent || undefined,
      informationOwnerId: asset.informationOwnerId || undefined,
      informationOwner: asset.informationOwner
        ? {
            id: asset.informationOwner.id,
            email: asset.informationOwner.email,
            firstName: asset.informationOwner.firstName || undefined,
            lastName: asset.informationOwner.lastName || undefined,
          }
        : undefined,
      assetCustodianId: asset.assetCustodianId || undefined,
      assetCustodian: asset.assetCustodian
        ? {
            id: asset.assetCustodian.id,
            email: asset.assetCustodian.email,
            firstName: asset.assetCustodian.firstName || undefined,
            lastName: asset.assetCustodian.lastName || undefined,
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
      assetLocation: asset.assetLocation || undefined,
      storageMedium: asset.storageMedium || undefined,
      complianceRequirements: Array.isArray(asset.complianceRequirements) ? asset.complianceRequirements : undefined,
      retentionPeriod: asset.retentionPeriod || undefined,
      createdAt: asset.createdAt,
      updatedAt: asset.updatedAt,
      deletedAt: asset.deletedAt || undefined,
      riskCount: riskCount,
    };
  }

  private async generateUniqueIdentifier(): Promise<string> {
    const prefix = 'INFO';
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${prefix}-${timestamp}-${random}`;
  }
}

