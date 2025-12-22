import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { PhysicalAsset } from '../entities/physical-asset.entity';
import { InformationAsset } from '../entities/information-asset.entity';
import { BusinessApplication } from '../entities/business-application.entity';
import { SoftwareAsset } from '../entities/software-asset.entity';
import { Supplier } from '../entities/supplier.entity';
import { BulkUpdateDto, BulkUpdateResponseDto } from '../dto/bulk-update.dto';

@Injectable()
export class BulkOperationsService {
  constructor(
    @InjectRepository(PhysicalAsset)
    private physicalAssetRepository: Repository<PhysicalAsset>,
    @InjectRepository(InformationAsset)
    private informationAssetRepository: Repository<InformationAsset>,
    @InjectRepository(BusinessApplication)
    private businessApplicationRepository: Repository<BusinessApplication>,
    @InjectRepository(SoftwareAsset)
    private softwareAssetRepository: Repository<SoftwareAsset>,
    @InjectRepository(Supplier)
    private supplierRepository: Repository<Supplier>,
  ) {}

  async bulkUpdate(
    assetType: 'physical' | 'information' | 'application' | 'software' | 'supplier',
    dto: BulkUpdateDto,
    userId: string,
  ): Promise<BulkUpdateResponseDto> {
    if (!dto.assetIds || dto.assetIds.length === 0) {
      throw new BadRequestException('At least one asset ID is required');
    }

    // Check if any fields are provided for update
    const hasUpdates =
      dto.ownerId !== undefined ||
      dto.criticalityLevel !== undefined ||
      dto.complianceTags !== undefined ||
      dto.businessUnit !== undefined ||
      dto.department !== undefined ||
      dto.versionNumber !== undefined ||
      dto.patchLevel !== undefined;

    if (!hasUpdates) {
      throw new BadRequestException('At least one field must be provided for update');
    }

    const errors: Array<{ assetId: string; error: string }> = [];
    let successful = 0;
    const rollbackData: Array<{ assetId: string; originalData: any }> = [];

    // Get the appropriate repository
    const repository = this.getRepository(assetType);

    // Fetch all assets
    const assets = await repository.find({
      where: { id: In(dto.assetIds) },
    });

    // Update each asset with rollback tracking
    for (const asset of assets) {
      try {
        // Store original data for rollback
        const originalData: any = {};
        const updateData: any = {};

        // Update owner (field name varies by asset type)
        if (dto.ownerId !== undefined) {
          if (assetType === 'information') {
            originalData.informationOwnerId = asset.informationOwnerId;
            updateData.informationOwnerId = dto.ownerId;
          } else {
            originalData.ownerId = asset.ownerId;
            updateData.ownerId = dto.ownerId;
          }
        }

        // Update criticality (only for assets that support it)
        if (dto.criticalityLevel !== undefined) {
          if (assetType === 'physical' || assetType === 'application' || assetType === 'supplier') {
            originalData.criticalityLevel = asset.criticalityLevel;
            updateData.criticalityLevel = dto.criticalityLevel;
          }
        }

        // Update compliance tags
        if (dto.complianceTags !== undefined) {
          if (assetType === 'physical' || assetType === 'application' || assetType === 'information') {
            originalData.complianceRequirements = asset.complianceRequirements;
            updateData.complianceRequirements = dto.complianceTags;
          }
        }

        // Update business unit
        if (dto.businessUnit !== undefined) {
          // This would need to be mapped to businessUnitId if using relations
          // For now, we'll skip if not directly supported
        }

        // Update department
        if (dto.department !== undefined) {
          if (assetType === 'physical') {
            originalData.department = asset.department;
            updateData.department = dto.department;
          }
        }

        // Update version number (for applications and software)
        if (dto.versionNumber !== undefined) {
          if (assetType === 'application' || assetType === 'software') {
            originalData.versionNumber = asset.versionNumber;
            updateData.versionNumber = dto.versionNumber;
          }
        }

        // Update patch level (for applications and software)
        if (dto.patchLevel !== undefined) {
          if (assetType === 'application' || assetType === 'software') {
            originalData.patchLevel = asset.patchLevel;
            updateData.patchLevel = dto.patchLevel;
          }
        }

        // Set updated by
        if (assetType === 'physical' || assetType === 'application' || assetType === 'software') {
          updateData.updatedBy = userId;
        }

        await repository.update(asset.id, updateData);
        rollbackData.push({ assetId: asset.id, originalData });
        successful++;
      } catch (error: any) {
        errors.push({
          assetId: asset.id,
          error: error.message || 'Update failed',
        });
      }
    }

    // If there were errors and rollback is requested, restore original values
    if (errors.length > 0 && dto.rollbackOnError) {
      console.warn(
        `Bulk update encountered errors for ${assetType} assets; initiating rollback`,
        {
          assetType,
          totalRequested: dto.assetIds.length,
          successfulBeforeRollback: successful,
          failed: errors.length,
        },
      );
      for (const rollback of rollbackData) {
        try {
          await repository.update(rollback.assetId, rollback.originalData);
        } catch (rollbackError: any) {
          // Log rollback error but don't fail the entire operation
          console.error(`Failed to rollback asset ${rollback.assetId}:`, rollbackError);
        }
      }
      return {
        successful: 0,
        failed: dto.assetIds.length,
        errors: [
          ...errors,
          ...rollbackData.map((r) => ({
            assetId: r.assetId,
            error: 'Rolled back due to other failures',
          })),
        ],
        rolledBack: true,
      };
    }

    return {
      successful,
      failed: errors.length,
      errors,
      rolledBack: false,
    };
  }

  async bulkDelete(
    assetType: 'physical' | 'information' | 'application' | 'software' | 'supplier',
    assetIds: string[],
  ): Promise<BulkUpdateResponseDto> {
    if (!assetIds || assetIds.length === 0) {
      throw new BadRequestException('At least one asset ID is required');
    }

    const repository = this.getRepository(assetType);
    const errors: Array<{ assetId: string; error: string }> = [];
    let successful = 0;

    for (const assetId of assetIds) {
      try {
        await repository.update(assetId, { deletedAt: new Date() });
        successful++;
      } catch (error: any) {
        errors.push({
          assetId,
          error: error.message || 'Delete failed',
        });
      }
    }

    return {
      successful,
      failed: errors.length,
      errors,
    };
  }

  private getRepository(assetType: string): Repository<any> {
    switch (assetType) {
      case 'physical':
        return this.physicalAssetRepository;
      case 'information':
        return this.informationAssetRepository;
      case 'application':
        return this.businessApplicationRepository;
      case 'software':
        return this.softwareAssetRepository;
      case 'supplier':
        return this.supplierRepository;
      default:
        throw new BadRequestException(`Invalid asset type: ${assetType}`);
    }
  }
}











