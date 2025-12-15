import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { BusinessApplication } from '../entities/business-application.entity';
import { CreateBusinessApplicationDto } from '../dto/create-business-application.dto';
import { UpdateBusinessApplicationDto } from '../dto/update-business-application.dto';
import { BusinessApplicationResponseDto } from '../dto/business-application-response.dto';
import { BusinessApplicationQueryDto } from '../dto/business-application-query.dto';
import { AssetAuditService } from './asset-audit.service';
import { AssetType } from '../entities/asset-audit-log.entity';
import { RiskAssetLinkService } from '../../risk/services/risk-asset-link.service';
import { RiskAssetType } from '../../risk/entities/risk-asset-link.entity';

@Injectable()
export class BusinessApplicationService {
  constructor(
    @InjectRepository(BusinessApplication)
    private applicationRepository: Repository<BusinessApplication>,
    private auditService: AssetAuditService,
    private riskAssetLinkService: RiskAssetLinkService,
  ) {}

  async findAll(query?: BusinessApplicationQueryDto): Promise<{
    data: BusinessApplicationResponseDto[];
    total: number;
    page: number;
    limit: number;
  }> {
    const page = query?.page || 1;
    const limit = query?.limit || 20;
    const skip = (page - 1) * limit;

    const queryBuilder = this.applicationRepository
      .createQueryBuilder('app')
      .leftJoinAndSelect('app.owner', 'owner')
      .leftJoinAndSelect('app.businessUnit', 'businessUnit')
      .where('app.deletedAt IS NULL');

    if (query?.search) {
      queryBuilder.andWhere(
        '(app.applicationName ILIKE :search OR app.applicationType ILIKE :search)',
        { search: `%${query.search}%` },
      );
    }

    if (query?.applicationType) {
      queryBuilder.andWhere('app.applicationType = :applicationType', {
        applicationType: query.applicationType,
      });
    }

    if (query?.criticalityLevel) {
      queryBuilder.andWhere('app.criticalityLevel = :criticalityLevel', {
        criticalityLevel: query.criticalityLevel,
      });
    }

    if (query?.businessUnit) {
      queryBuilder.andWhere('app.businessUnitId = :businessUnitId', {
        businessUnitId: query.businessUnit,
      });
    }

    if (query?.ownerId) {
      queryBuilder.andWhere('app.ownerId = :ownerId', { ownerId: query.ownerId });
    }

    const total = await queryBuilder.getCount();

    const applications = await queryBuilder
      .orderBy('app.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getMany();

    // Get risk counts for all assets in batch
    const assetIds = applications.map(a => a.id);
    const riskCounts = await this.getRiskCountsForAssets(assetIds);

    return {
      data: applications.map((app) => this.toResponseDto(app, riskCounts[app.id])),
      total,
      page,
      limit,
    };
  }

  async findOne(id: string): Promise<BusinessApplicationResponseDto> {
    const application = await this.applicationRepository.findOne({
      where: { id, deletedAt: IsNull() },
      relations: ['owner', 'businessUnit', 'createdByUser', 'updatedByUser'],
    });

    if (!application) {
      throw new NotFoundException(`Business application with ID ${id} not found`);
    }

    // Get risk count for this asset
    const riskCount = await this.getRiskCountForAsset(id);

    return this.toResponseDto(application, riskCount);
  }

  async create(
    createDto: CreateBusinessApplicationDto,
    userId: string,
  ): Promise<BusinessApplicationResponseDto> {
    // Generate unique identifier if not provided
    let uniqueIdentifier = createDto.uniqueIdentifier;
    if (!uniqueIdentifier) {
      uniqueIdentifier = await this.generateUniqueIdentifier();
    }

    // Check for duplicate identifier
    const existing = await this.applicationRepository.findOne({
      where: { uniqueIdentifier, deletedAt: IsNull() },
    });

    if (existing) {
      throw new ConflictException(`Business application with identifier ${uniqueIdentifier} already exists`);
    }

    const application = this.applicationRepository.create({
      ...createDto,
      uniqueIdentifier,
      dataProcessed: createDto.dataProcessed || null,
      complianceRequirements: createDto.complianceRequirements || null,
      licenseExpiry: createDto.licenseExpiry ? new Date(createDto.licenseExpiry) : null,
      lastSecurityTestDate: createDto.lastSecurityTestDate ? new Date(createDto.lastSecurityTestDate) : null,
      createdBy: userId,
      updatedBy: userId,
    });

    const savedApplication = await this.applicationRepository.save(application);
    
    // Reload with relations
    const reloaded = await this.applicationRepository.findOne({
      where: { id: savedApplication.id },
      relations: ['owner', 'businessUnit'],
    });
    
    // Log creation
    await this.auditService.logCreate(AssetType.APPLICATION, savedApplication.id, userId);
    
    return this.toResponseDto(reloaded!);
  }

  async update(
    id: string,
    updateDto: UpdateBusinessApplicationDto,
    userId: string,
  ): Promise<BusinessApplicationResponseDto> {
    const application = await this.applicationRepository.findOne({
      where: { id, deletedAt: IsNull() },
    });

    if (!application) {
      throw new NotFoundException(`Business application with ID ${id} not found`);
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

    Object.keys(updateData).forEach((key) => {
      if (key !== 'updatedBy' && application[key] !== updateData[key]) {
        changes[key] = {
          old: application[key],
          new: updateData[key],
        };
      }
    });

    Object.assign(application, updateData);
    const savedApplication = await this.applicationRepository.save(application);

    // Reload with relations
    const reloaded = await this.applicationRepository.findOne({
      where: { id: savedApplication.id },
      relations: ['owner', 'businessUnit'],
    });

    // Log changes if any
    if (Object.keys(changes).length > 0) {
      await this.auditService.logUpdate(AssetType.APPLICATION, id, changes, userId);
    }

    return this.toResponseDto(reloaded!);
  }

  async remove(id: string, userId: string): Promise<void> {
    const application = await this.applicationRepository.findOne({
      where: { id, deletedAt: IsNull() },
    });

    if (!application) {
      throw new NotFoundException(`Business application with ID ${id} not found`);
    }

    // Log deletion before soft delete
    await this.auditService.logDelete(AssetType.APPLICATION, id, userId);

    application.deletedAt = new Date();
    await this.applicationRepository.save(application);
  }

  private async getRiskCountForAsset(assetId: string): Promise<number> {
    const links = await this.riskAssetLinkService.findByAsset(RiskAssetType.APPLICATION, assetId);
    return links.length;
  }

  private async getRiskCountsForAssets(assetIds: string[]): Promise<Record<string, number>> {
    if (assetIds.length === 0) return {};
    
    const counts: Record<string, number> = {};
    // Batch query risk counts for all assets
    for (const assetId of assetIds) {
      const links = await this.riskAssetLinkService.findByAsset(RiskAssetType.APPLICATION, assetId);
      counts[assetId] = links.length;
    }
    return counts;
  }

  private toResponseDto(application: BusinessApplication, riskCount?: number): BusinessApplicationResponseDto {
    return {
      id: application.id,
      uniqueIdentifier: application.uniqueIdentifier,
      applicationName: application.applicationName,
      applicationType: application.applicationType || undefined,
      versionNumber: application.versionNumber || undefined,
      patchLevel: application.patchLevel || undefined,
      businessPurpose: application.businessPurpose || undefined,
      ownerId: application.ownerId || undefined,
      owner: application.owner
        ? {
            id: application.owner.id,
            email: application.owner.email,
            firstName: application.owner.firstName || undefined,
            lastName: application.owner.lastName || undefined,
          }
        : undefined,
      businessUnitId: application.businessUnitId || undefined,
      businessUnit: application.businessUnit
        ? {
            id: application.businessUnit.id,
            name: application.businessUnit.name,
            code: application.businessUnit.code || undefined,
          }
        : undefined,
      dataProcessed: Array.isArray(application.dataProcessed) ? application.dataProcessed : undefined,
      dataClassification: application.dataClassification || undefined,
      vendorName: application.vendorName || undefined,
      vendorContact: application.vendorContact || undefined,
      licenseType: application.licenseType || undefined,
      licenseCount: application.licenseCount || undefined,
      licenseExpiry: application.licenseExpiry || undefined,
      hostingType: application.hostingType || undefined,
      hostingLocation: application.hostingLocation || undefined,
      accessUrl: application.accessUrl || undefined,
      securityTestResults: application.securityTestResults || undefined,
      lastSecurityTestDate: application.lastSecurityTestDate || undefined,
      authenticationMethod: application.authenticationMethod || undefined,
      complianceRequirements: Array.isArray(application.complianceRequirements) ? application.complianceRequirements : undefined,
      criticalityLevel: application.criticalityLevel || undefined,
      createdAt: application.createdAt,
      updatedAt: application.updatedAt,
      deletedAt: application.deletedAt || undefined,
      riskCount: riskCount,
    };
  }

  private async generateUniqueIdentifier(): Promise<string> {
    const prefix = 'APP';
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${prefix}-${timestamp}-${random}`;
  }
}

