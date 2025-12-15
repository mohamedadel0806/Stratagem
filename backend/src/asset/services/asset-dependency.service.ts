import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { AssetDependency, AssetType } from '../entities/asset-dependency.entity';
import { CreateAssetDependencyDto } from '../dto/create-asset-dependency.dto';
import { AssetDependencyResponseDto } from '../dto/asset-dependency-response.dto';
import { PhysicalAsset } from '../entities/physical-asset.entity';
import { InformationAsset } from '../entities/information-asset.entity';
import { BusinessApplication } from '../entities/business-application.entity';
import { SoftwareAsset } from '../entities/software-asset.entity';
import { Supplier } from '../entities/supplier.entity';

@Injectable()
export class AssetDependencyService {
  constructor(
    @InjectRepository(AssetDependency)
    private dependencyRepository: Repository<AssetDependency>,
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

  private async getAssetNameAndIdentifier(
    assetType: AssetType,
    assetId: string,
  ): Promise<{ name: string; identifier: string }> {
    let asset: any;

    switch (assetType) {
      case AssetType.PHYSICAL:
        asset = await this.physicalAssetRepository.findOne({
          where: { id: assetId, deletedAt: null },
        });
        if (!asset) throw new NotFoundException(`Physical asset with ID ${assetId} not found`);
        return {
          name: asset.assetDescription || asset.uniqueIdentifier,
          identifier: asset.uniqueIdentifier,
        };

      case AssetType.INFORMATION:
        asset = await this.informationAssetRepository.findOne({
          where: { id: assetId, deletedAt: null },
        });
        if (!asset) throw new NotFoundException(`Information asset with ID ${assetId} not found`);
        return {
          name: asset.name || asset.id,
          identifier: asset.id,
        };

      case AssetType.APPLICATION:
        asset = await this.businessApplicationRepository.findOne({
          where: { id: assetId, deletedAt: null },
        });
        if (!asset) throw new NotFoundException(`Application with ID ${assetId} not found`);
        return {
          name: asset.applicationName || asset.id,
          identifier: asset.id,
        };

      case AssetType.SOFTWARE:
        asset = await this.softwareAssetRepository.findOne({
          where: { id: assetId, deletedAt: null },
        });
        if (!asset) throw new NotFoundException(`Software asset with ID ${assetId} not found`);
        return {
          name: asset.softwareName || asset.id,
          identifier: asset.id,
        };

      case AssetType.SUPPLIER:
        asset = await this.supplierRepository.findOne({
          where: { id: assetId, deletedAt: null },
        });
        if (!asset) throw new NotFoundException(`Supplier with ID ${assetId} not found`);
        return {
          name: asset.supplierName || asset.uniqueIdentifier,
          identifier: asset.uniqueIdentifier,
        };

      default:
        throw new BadRequestException(`Invalid asset type: ${assetType}`);
    }
  }

  async create(
    sourceAssetType: AssetType,
    sourceAssetId: string,
    createDto: CreateAssetDependencyDto,
    userId: string,
  ): Promise<AssetDependencyResponseDto> {
    // Prevent self-dependency
    if (
      sourceAssetType === createDto.targetAssetType &&
      sourceAssetId === createDto.targetAssetId
    ) {
      throw new BadRequestException('An asset cannot depend on itself');
    }

    // Check if dependency already exists
    const existing = await this.dependencyRepository.findOne({
      where: {
        sourceAssetType,
        sourceAssetId,
        targetAssetType: createDto.targetAssetType,
        targetAssetId: createDto.targetAssetId,
      },
    });

    if (existing) {
      throw new ConflictException('This dependency already exists');
    }

    // Verify source asset exists
    await this.getAssetNameAndIdentifier(sourceAssetType, sourceAssetId);

    // Verify target asset exists
    await this.getAssetNameAndIdentifier(createDto.targetAssetType, createDto.targetAssetId);

    // Create dependency
    const dependency = this.dependencyRepository.create({
      sourceAssetType,
      sourceAssetId,
      targetAssetType: createDto.targetAssetType,
      targetAssetId: createDto.targetAssetId,
      relationshipType: createDto.relationshipType,
      description: createDto.description,
      createdById: userId,
    });

    const saved = await this.dependencyRepository.save(dependency);

    // Get asset names for response
    const [sourceInfo, targetInfo] = await Promise.all([
      this.getAssetNameAndIdentifier(sourceAssetType, sourceAssetId),
      this.getAssetNameAndIdentifier(createDto.targetAssetType, createDto.targetAssetId),
    ]);

    return this.toResponseDto(saved, sourceInfo, targetInfo);
  }

  async findAll(
    assetType: AssetType,
    assetId: string,
  ): Promise<AssetDependencyResponseDto[]> {
    // Verify asset exists
    const sourceInfo = await this.getAssetNameAndIdentifier(assetType, assetId);

    // Get all dependencies where this asset is the source
    const dependencies = await this.dependencyRepository.find({
      where: {
        sourceAssetType: assetType,
        sourceAssetId: assetId,
      },
      order: {
        createdAt: 'DESC',
      },
    });

    // Get asset names for all targets
    const targetInfos = await Promise.all(
      dependencies.map((dep) => this.getAssetNameAndIdentifier(dep.targetAssetType, dep.targetAssetId)),
    );

    return dependencies.map((dep, index) =>
      this.toResponseDto(dep, sourceInfo, targetInfos[index]),
    );
  }

  async findIncoming(
    assetType: AssetType,
    assetId: string,
  ): Promise<AssetDependencyResponseDto[]> {
    // Verify asset exists
    const targetInfo = await this.getAssetNameAndIdentifier(assetType, assetId);

    // Get all dependencies where this asset is the target
    const dependencies = await this.dependencyRepository.find({
      where: {
        targetAssetType: assetType,
        targetAssetId: assetId,
      },
      order: {
        createdAt: 'DESC',
      },
    });

    // Get asset names for all sources
    const sourceInfos = await Promise.all(
      dependencies.map((dep) => this.getAssetNameAndIdentifier(dep.sourceAssetType, dep.sourceAssetId)),
    );

    return dependencies.map((dep, index) =>
      this.toResponseDto(dep, sourceInfos[index], targetInfo),
    );
  }

  async remove(dependencyId: string): Promise<void> {
    const dependency = await this.dependencyRepository.findOne({
      where: { id: dependencyId },
    });

    if (!dependency) {
      throw new NotFoundException(`Dependency with ID ${dependencyId} not found`);
    }

    await this.dependencyRepository.remove(dependency);
  }

  /**
   * Check if an asset has any dependencies (incoming or outgoing)
   * Used to warn users before deleting/updating assets
   */
  async checkDependencies(
    assetType: AssetType,
    assetId: string,
  ): Promise<{
    hasDependencies: boolean;
    outgoingCount: number;
    incomingCount: number;
    totalCount: number;
    outgoing: AssetDependencyResponseDto[];
    incoming: AssetDependencyResponseDto[];
  }> {
    // Get asset info first
    let assetInfo: { name: string; identifier: string };
    try {
      assetInfo = await this.getAssetNameAndIdentifier(assetType, assetId);
    } catch (e) {
      // Asset doesn't exist, return no dependencies
      return {
        hasDependencies: false,
        outgoingCount: 0,
        incomingCount: 0,
        totalCount: 0,
        outgoing: [],
        incoming: [],
      };
    }

    // Get outgoing dependencies (this asset depends on others)
    const outgoingDeps = await this.dependencyRepository.find({
      where: {
        sourceAssetType: assetType,
        sourceAssetId: assetId,
      },
      take: 10, // Limit for performance
    });

    // Get incoming dependencies (others depend on this asset)
    const incomingDeps = await this.dependencyRepository.find({
      where: {
        targetAssetType: assetType,
        targetAssetId: assetId,
      },
      take: 10, // Limit for performance
    });

    // Get total counts
    const [outgoingCount, incomingCount] = await Promise.all([
      this.dependencyRepository.count({
        where: { sourceAssetType: assetType, sourceAssetId: assetId },
      }),
      this.dependencyRepository.count({
        where: { targetAssetType: assetType, targetAssetId: assetId },
      }),
    ]);

    // Build response DTOs
    const outgoingDtos = await Promise.all(
      outgoingDeps.map(async (dep) => {
        const targetInfo = await this.getAssetNameAndIdentifier(dep.targetAssetType, dep.targetAssetId);
        return this.toResponseDto(dep, assetInfo, targetInfo);
      }),
    );

    const incomingDtos = await Promise.all(
      incomingDeps.map(async (dep) => {
        const sourceInfo = await this.getAssetNameAndIdentifier(dep.sourceAssetType, dep.sourceAssetId);
        return this.toResponseDto(dep, sourceInfo, assetInfo);
      }),
    );

    return {
      hasDependencies: outgoingCount > 0 || incomingCount > 0,
      outgoingCount,
      incomingCount,
      totalCount: outgoingCount + incomingCount,
      outgoing: outgoingDtos,
      incoming: incomingDtos,
    };
  }

  private toResponseDto(
    dependency: AssetDependency,
    sourceInfo: { name: string; identifier: string },
    targetInfo: { name: string; identifier: string },
  ): AssetDependencyResponseDto {
    return {
      id: dependency.id,
      sourceAssetType: dependency.sourceAssetType,
      sourceAssetId: dependency.sourceAssetId,
      sourceAssetName: sourceInfo.name,
      sourceAssetIdentifier: sourceInfo.identifier,
      targetAssetType: dependency.targetAssetType,
      targetAssetId: dependency.targetAssetId,
      targetAssetName: targetInfo.name,
      targetAssetIdentifier: targetInfo.identifier,
      relationshipType: dependency.relationshipType,
      description: dependency.description,
      createdAt: dependency.createdAt,
      updatedAt: dependency.updatedAt,
    };
  }
}

