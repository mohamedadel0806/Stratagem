import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { SoftwareAsset } from '../entities/software-asset.entity';
import { CreateSoftwareAssetDto } from '../dto/create-software-asset.dto';
import { UpdateSoftwareAssetDto } from '../dto/update-software-asset.dto';
import { SoftwareAssetResponseDto } from '../dto/software-asset-response.dto';
import { SoftwareAssetQueryDto } from '../dto/software-asset-query.dto';
import { AssetAuditService } from './asset-audit.service';
import { AssetType } from '../entities/asset-audit-log.entity';
import { RiskAssetLinkService } from '../../risk/services/risk-asset-link.service';
import { RiskAssetType } from '../../risk/entities/risk-asset-link.entity';

@Injectable()
export class SoftwareAssetService {
  constructor(
    @InjectRepository(SoftwareAsset)
    private softwareRepository: Repository<SoftwareAsset>,
    private auditService: AssetAuditService,
    private riskAssetLinkService: RiskAssetLinkService,
  ) {}

  async findAll(query?: SoftwareAssetQueryDto): Promise<{
    data: SoftwareAssetResponseDto[];
    total: number;
    page: number;
    limit: number;
  }> {
    const page = query?.page || 1;
    const limit = query?.limit || 20;
    const skip = (page - 1) * limit;

    const queryBuilder = this.softwareRepository
      .createQueryBuilder('software')
      .leftJoinAndSelect('software.owner', 'owner')
      .leftJoinAndSelect('software.businessUnit', 'businessUnit')
      .where('software.deletedAt IS NULL');

    if (query?.search) {
      queryBuilder.andWhere(
        '(software.softwareName ILIKE :search OR software.softwareType ILIKE :search)',
        { search: `%${query.search}%` },
      );
    }

    if (query?.softwareType) {
      queryBuilder.andWhere('software.softwareType = :softwareType', {
        softwareType: query.softwareType,
      });
    }

    if (query?.vendor) {
      queryBuilder.andWhere('software.vendorName = :vendorName', { vendorName: query.vendor });
    }

    if (query?.businessUnit) {
      queryBuilder.andWhere('software.businessUnitId = :businessUnitId', {
        businessUnitId: query.businessUnit,
      });
    }

    if (query?.ownerId) {
      queryBuilder.andWhere('software.ownerId = :ownerId', { ownerId: query.ownerId });
    }

    const total = await queryBuilder.getCount();

    const softwareAssets = await queryBuilder
      .orderBy('software.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getMany();

    // Get risk counts for all assets in batch
    const assetIds = softwareAssets.map(a => a.id);
    const riskCounts = await this.getRiskCountsForAssets(assetIds);

    return {
      data: softwareAssets.map((software) => this.toResponseDto(software, riskCounts[software.id])),
      total,
      page,
      limit,
    };
  }

  async findOne(id: string): Promise<SoftwareAssetResponseDto> {
    const software = await this.softwareRepository.findOne({
      where: { id, deletedAt: IsNull() },
      relations: ['owner', 'businessUnit', 'createdByUser', 'updatedByUser'],
    });

    if (!software) {
      throw new NotFoundException(`Software asset with ID ${id} not found`);
    }

    // Get risk count for this asset
    const riskCount = await this.getRiskCountForAsset(id);

    return this.toResponseDto(software, riskCount);
  }

  async create(createDto: CreateSoftwareAssetDto, userId: string): Promise<SoftwareAssetResponseDto> {
    // Generate unique identifier if not provided
    let uniqueIdentifier = createDto.uniqueIdentifier;
    if (!uniqueIdentifier) {
      uniqueIdentifier = await this.generateUniqueIdentifier();
    }

    // Check for duplicate identifier
    const existing = await this.softwareRepository.findOne({
      where: { uniqueIdentifier, deletedAt: IsNull() },
    });

    if (existing) {
      throw new ConflictException(`Software asset with identifier ${uniqueIdentifier} already exists`);
    }

    const software = this.softwareRepository.create({
      ...createDto,
      uniqueIdentifier,
      securityTestResults: createDto.securityTestResults || null,
      knownVulnerabilities: createDto.knownVulnerabilities || null,
      licenseExpiry: createDto.licenseExpiry ? new Date(createDto.licenseExpiry) : null,
      lastSecurityTestDate: createDto.lastSecurityTestDate ? new Date(createDto.lastSecurityTestDate) : null,
      supportEndDate: createDto.supportEndDate ? new Date(createDto.supportEndDate) : null,
      createdBy: userId,
      updatedBy: userId,
    });

    const savedSoftware = await this.softwareRepository.save(software);
    
    // Reload with relations
    const reloaded = await this.softwareRepository.findOne({
      where: { id: savedSoftware.id },
      relations: ['owner', 'businessUnit'],
    });
    
    // Log creation
    await this.auditService.logCreate(AssetType.SOFTWARE, savedSoftware.id, userId);
    
    return this.toResponseDto(reloaded!);
  }

  async update(
    id: string,
    updateDto: UpdateSoftwareAssetDto,
    userId: string,
  ): Promise<SoftwareAssetResponseDto> {
    const software = await this.softwareRepository.findOne({
      where: { id, deletedAt: IsNull() },
    });

    if (!software) {
      throw new NotFoundException(`Software asset with ID ${id} not found`);
    }

    // Track changes for audit log
    const changes: Record<string, { old: any; new: any }> = {};
    const updateData: any = {
      ...updateDto,
      updatedBy: userId,
    };

    // Handle date conversions
    if (updateDto.licenseExpiry) {
      updateData.licenseExpiry = new Date(updateDto.licenseExpiry);
    }

    if (updateDto.lastSecurityTestDate) {
      updateData.lastSecurityTestDate = new Date(updateDto.lastSecurityTestDate);
    }

    if (updateDto.supportEndDate) {
      updateData.supportEndDate = new Date(updateDto.supportEndDate);
    }

    Object.keys(updateData).forEach((key) => {
      if (key !== 'updatedBy' && software[key] !== updateData[key]) {
        changes[key] = {
          old: software[key],
          new: updateData[key],
        };
      }
    });

    Object.assign(software, updateData);
    const savedSoftware = await this.softwareRepository.save(software);

    // Reload with relations
    const reloaded = await this.softwareRepository.findOne({
      where: { id: savedSoftware.id },
      relations: ['owner', 'businessUnit'],
    });

    // Log changes if any
    if (Object.keys(changes).length > 0) {
      await this.auditService.logUpdate(AssetType.SOFTWARE, id, changes, userId);
    }

    return this.toResponseDto(reloaded!);
  }

  async remove(id: string, userId: string): Promise<void> {
    const software = await this.softwareRepository.findOne({
      where: { id, deletedAt: IsNull() },
    });

    if (!software) {
      throw new NotFoundException(`Software asset with ID ${id} not found`);
    }

    // Log deletion before soft delete
    await this.auditService.logDelete(AssetType.SOFTWARE, id, userId);

    software.deletedAt = new Date();
    await this.softwareRepository.save(software);
  }

  private async getRiskCountForAsset(assetId: string): Promise<number> {
    const links = await this.riskAssetLinkService.findByAsset(RiskAssetType.SOFTWARE, assetId);
    return links.length;
  }

  private async getRiskCountsForAssets(assetIds: string[]): Promise<Record<string, number>> {
    if (assetIds.length === 0) return {};
    
    const counts: Record<string, number> = {};
    // Batch query risk counts for all assets
    for (const assetId of assetIds) {
      const links = await this.riskAssetLinkService.findByAsset(RiskAssetType.SOFTWARE, assetId);
      counts[assetId] = links.length;
    }
    return counts;
  }

  private toResponseDto(software: SoftwareAsset, riskCount?: number): SoftwareAssetResponseDto {
    return {
      id: software.id,
      uniqueIdentifier: software.uniqueIdentifier,
      softwareName: software.softwareName,
      softwareType: software.softwareType || undefined,
      versionNumber: software.versionNumber || undefined,
      patchLevel: software.patchLevel || undefined,
      businessPurpose: software.businessPurpose || undefined,
      ownerId: software.ownerId || undefined,
      owner: software.owner
        ? {
            id: software.owner.id,
            email: software.owner.email,
            firstName: software.owner.firstName || undefined,
            lastName: software.owner.lastName || undefined,
          }
        : undefined,
      businessUnitId: software.businessUnitId || undefined,
      businessUnit: software.businessUnit
        ? {
            id: software.businessUnit.id,
            name: software.businessUnit.name,
            code: software.businessUnit.code || undefined,
          }
        : undefined,
      vendorName: software.vendorName || undefined,
      vendorContact: software.vendorContact || undefined,
      licenseType: software.licenseType || undefined,
      licenseCount: software.licenseCount || undefined,
      licenseKey: software.licenseKey || undefined,
      licenseExpiry: software.licenseExpiry || undefined,
      installationCount: software.installationCount || undefined,
      securityTestResults: software.securityTestResults || undefined,
      lastSecurityTestDate: software.lastSecurityTestDate || undefined,
      knownVulnerabilities: Array.isArray(software.knownVulnerabilities) ? software.knownVulnerabilities : undefined,
      supportEndDate: software.supportEndDate || undefined,
      createdAt: software.createdAt,
      updatedAt: software.updatedAt,
      deletedAt: software.deletedAt || undefined,
      riskCount: riskCount,
    };
  }

  private async generateUniqueIdentifier(): Promise<string> {
    const prefix = 'SW';
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${prefix}-${timestamp}-${random}`;
  }
}

