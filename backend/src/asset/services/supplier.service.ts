import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Supplier } from '../entities/supplier.entity';
import { CreateSupplierDto } from '../dto/create-supplier.dto';
import { UpdateSupplierDto } from '../dto/update-supplier.dto';
import { SupplierResponseDto } from '../dto/supplier-response.dto';
import { SupplierQueryDto } from '../dto/supplier-query.dto';
import { AssetAuditService } from './asset-audit.service';
import { AssetType } from '../entities/asset-audit-log.entity';
import { RiskAssetLinkService } from '../../risk/services/risk-asset-link.service';
import { RiskAssetType } from '../../risk/entities/risk-asset-link.entity';

@Injectable()
export class SupplierService {
  constructor(
    @InjectRepository(Supplier)
    private supplierRepository: Repository<Supplier>,
    private auditService: AssetAuditService,
    private riskAssetLinkService: RiskAssetLinkService,
  ) {}

  async findAll(query?: SupplierQueryDto): Promise<{
    data: SupplierResponseDto[];
    total: number;
    page: number;
    limit: number;
  }> {
    const page = query?.page || 1;
    const limit = query?.limit || 20;
    const skip = (page - 1) * limit;

    const queryBuilder = this.supplierRepository
      .createQueryBuilder('supplier')
      .leftJoinAndSelect('supplier.owner', 'owner')
      .leftJoinAndSelect('supplier.businessUnit', 'businessUnit')
      .where('supplier.deletedAt IS NULL');

    if (query?.search) {
      queryBuilder.andWhere(
        '(supplier.supplierName ILIKE :search OR supplier.uniqueIdentifier ILIKE :search)',
        { search: `%${query.search}%` },
      );
    }

    if (query?.supplierType) {
      queryBuilder.andWhere('supplier.supplierType = :supplierType', {
        supplierType: query.supplierType,
      });
    }

    if (query?.criticalityLevel) {
      queryBuilder.andWhere('supplier.criticalityLevel = :criticalityLevel', {
        criticalityLevel: query.criticalityLevel,
      });
    }

    if (query?.businessUnit) {
      queryBuilder.andWhere('supplier.businessUnitId = :businessUnitId', {
        businessUnitId: query.businessUnit,
      });
    }

    const total = await queryBuilder.getCount();

    const suppliers = await queryBuilder
      .orderBy('supplier.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getMany();

    // Get risk counts for all assets in batch
    const assetIds = suppliers.map(a => a.id);
    const riskCounts = await this.getRiskCountsForAssets(assetIds);

    return {
      data: suppliers.map((supplier) => this.toResponseDto(supplier, riskCounts[supplier.id])),
      total,
      page,
      limit,
    };
  }

  async findOne(id: string): Promise<SupplierResponseDto> {
    const supplier = await this.supplierRepository.findOne({
      where: { id, deletedAt: IsNull() },
      relations: ['owner', 'businessUnit', 'createdByUser', 'updatedByUser'],
    });

    if (!supplier) {
      throw new NotFoundException(`Supplier with ID ${id} not found`);
    }

    // Get risk count for this asset
    const riskCount = await this.getRiskCountForAsset(id);

    return this.toResponseDto(supplier, riskCount);
  }

  async create(createDto: CreateSupplierDto, userId: string): Promise<SupplierResponseDto> {
    // Generate unique identifier if not provided
    let uniqueIdentifier = createDto.uniqueIdentifier;
    if (!uniqueIdentifier) {
      uniqueIdentifier = await this.generateUniqueIdentifier();
    }

    // Check for duplicate unique identifier
    const existing = await this.supplierRepository.findOne({
      where: { uniqueIdentifier, deletedAt: IsNull() },
    });

    if (existing) {
      throw new ConflictException(`Supplier with identifier ${uniqueIdentifier} already exists`);
    }

    const supplier = this.supplierRepository.create({
      ...createDto,
      uniqueIdentifier,
      goodsServicesType: createDto.goodsServicesType || null,
      complianceCertifications: createDto.complianceCertifications || null,
      contractStartDate: createDto.contractStartDate ? new Date(createDto.contractStartDate) : null,
      contractEndDate: createDto.contractEndDate ? new Date(createDto.contractEndDate) : null,
      riskAssessmentDate: createDto.riskAssessmentDate ? new Date(createDto.riskAssessmentDate) : null,
      backgroundCheckDate: createDto.backgroundCheckDate ? new Date(createDto.backgroundCheckDate) : null,
      lastReviewDate: createDto.lastReviewDate ? new Date(createDto.lastReviewDate) : null,
      createdBy: userId,
      updatedBy: userId,
    });

    const savedSupplier = await this.supplierRepository.save(supplier);
    
    // Reload with relations
    const reloaded = await this.supplierRepository.findOne({
      where: { id: savedSupplier.id },
      relations: ['owner', 'businessUnit'],
    });
    
    // Log creation
    await this.auditService.logCreate(AssetType.SUPPLIER, savedSupplier.id, userId);
    
    return this.toResponseDto(reloaded!);
  }

  async update(id: string, updateDto: UpdateSupplierDto, userId: string): Promise<SupplierResponseDto> {
    const supplier = await this.supplierRepository.findOne({
      where: { id, deletedAt: IsNull() },
    });

    if (!supplier) {
      throw new NotFoundException(`Supplier with ID ${id} not found`);
    }

    // Check for duplicate unique identifier if changing
    if (updateDto.uniqueIdentifier && updateDto.uniqueIdentifier !== supplier.uniqueIdentifier) {
      const existing = await this.supplierRepository.findOne({
        where: { uniqueIdentifier: updateDto.uniqueIdentifier, deletedAt: IsNull() },
      });

      if (existing) {
        throw new ConflictException(
          `Supplier with identifier ${updateDto.uniqueIdentifier} already exists`,
        );
      }
    }

    // Track changes for audit log
    const changes: Record<string, { old: any; new: any }> = {};
    const updateData: any = {
      ...updateDto,
      updatedBy: userId,
    };

    // Handle date conversions
    if (updateDto.contractStartDate) {
      updateData.contractStartDate = new Date(updateDto.contractStartDate);
    }

    if (updateDto.contractEndDate) {
      updateData.contractEndDate = new Date(updateDto.contractEndDate);
    }

    if (updateDto.riskAssessmentDate) {
      updateData.riskAssessmentDate = new Date(updateDto.riskAssessmentDate);
    }

    if (updateDto.backgroundCheckDate) {
      updateData.backgroundCheckDate = new Date(updateDto.backgroundCheckDate);
    }

    if (updateDto.lastReviewDate) {
      updateData.lastReviewDate = new Date(updateDto.lastReviewDate);
    }

    Object.keys(updateData).forEach((key) => {
      if (key !== 'updatedBy' && supplier[key] !== updateData[key]) {
        changes[key] = {
          old: supplier[key],
          new: updateData[key],
        };
      }
    });

    Object.assign(supplier, updateData);
    const savedSupplier = await this.supplierRepository.save(supplier);

    // Reload with relations
    const reloaded = await this.supplierRepository.findOne({
      where: { id: savedSupplier.id },
      relations: ['owner', 'businessUnit'],
    });

    // Log changes if any
    if (Object.keys(changes).length > 0) {
      await this.auditService.logUpdate(AssetType.SUPPLIER, id, changes, userId);
    }

    return this.toResponseDto(reloaded!);
  }

  async remove(id: string, userId: string): Promise<void> {
    const supplier = await this.supplierRepository.findOne({
      where: { id, deletedAt: IsNull() },
    });

    if (!supplier) {
      throw new NotFoundException(`Supplier with ID ${id} not found`);
    }

    // Log deletion before soft delete
    await this.auditService.logDelete(AssetType.SUPPLIER, id, userId);

    supplier.deletedAt = new Date();
    await this.supplierRepository.save(supplier);
  }

  private async getRiskCountForAsset(assetId: string): Promise<number> {
    const links = await this.riskAssetLinkService.findByAsset(RiskAssetType.SUPPLIER, assetId);
    return links.length;
  }

  private async getRiskCountsForAssets(assetIds: string[]): Promise<Record<string, number>> {
    if (assetIds.length === 0) return {};
    
    const counts: Record<string, number> = {};
    // Batch query risk counts for all assets
    for (const assetId of assetIds) {
      const links = await this.riskAssetLinkService.findByAsset(RiskAssetType.SUPPLIER, assetId);
      counts[assetId] = links.length;
    }
    return counts;
  }

  private toResponseDto(supplier: Supplier, riskCount?: number): SupplierResponseDto {
    return {
      id: supplier.id,
      uniqueIdentifier: supplier.uniqueIdentifier,
      supplierName: supplier.supplierName,
      supplierType: supplier.supplierType || undefined,
      businessPurpose: supplier.businessPurpose || undefined,
      ownerId: supplier.ownerId || undefined,
      owner: supplier.owner
        ? {
            id: supplier.owner.id,
            email: supplier.owner.email,
            firstName: supplier.owner.firstName || undefined,
            lastName: supplier.owner.lastName || undefined,
          }
        : undefined,
      businessUnitId: supplier.businessUnitId || undefined,
      businessUnit: supplier.businessUnit
        ? {
            id: supplier.businessUnit.id,
            name: supplier.businessUnit.name,
            code: supplier.businessUnit.code || undefined,
          }
        : undefined,
      goodsServicesType: Array.isArray(supplier.goodsServicesType) ? supplier.goodsServicesType : undefined,
      criticalityLevel: supplier.criticalityLevel || undefined,
      contractReference: supplier.contractReference || undefined,
      contractStartDate: supplier.contractStartDate || undefined,
      contractEndDate: supplier.contractEndDate || undefined,
      contractValue: supplier.contractValue || undefined,
      currency: supplier.currency || undefined,
      autoRenewal: supplier.autoRenewal || undefined,
      primaryContact: supplier.primaryContact || undefined,
      secondaryContact: supplier.secondaryContact || undefined,
      taxId: supplier.taxId || undefined,
      registrationNumber: supplier.registrationNumber || undefined,
      address: supplier.address || undefined,
      country: supplier.country || undefined,
      website: supplier.website || undefined,
      riskAssessmentDate: supplier.riskAssessmentDate || undefined,
      riskLevel: supplier.riskLevel || undefined,
      complianceCertifications: Array.isArray(supplier.complianceCertifications) ? supplier.complianceCertifications : undefined,
      insuranceVerified: supplier.insuranceVerified || undefined,
      backgroundCheckDate: supplier.backgroundCheckDate || undefined,
      performanceRating: supplier.performanceRating || undefined,
      lastReviewDate: supplier.lastReviewDate || undefined,
      createdAt: supplier.createdAt,
      updatedAt: supplier.updatedAt,
      deletedAt: supplier.deletedAt || undefined,
      riskCount: riskCount,
    };
  }

  private async generateUniqueIdentifier(): Promise<string> {
    const prefix = 'SUP';
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${prefix}-${timestamp}-${random}`;
  }
}

