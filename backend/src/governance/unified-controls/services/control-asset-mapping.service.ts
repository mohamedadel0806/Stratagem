import { Injectable, NotFoundException, ConflictException, Logger, Optional } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, In } from 'typeorm';
import { ControlAssetMapping, AssetType } from '../entities/control-asset-mapping.entity';
import { UnifiedControl, ImplementationStatus } from '../entities/unified-control.entity';
import { CreateControlAssetMappingDto, BulkCreateControlAssetMappingDto } from '../dto/create-control-asset-mapping.dto';
import { UpdateControlAssetMappingDto } from '../dto/update-control-asset-mapping.dto';
import { ControlAssetMappingQueryDto } from '../dto/control-asset-mapping-query.dto';

export interface AssetCompliancePosture {
  assetId: string;
  assetType: AssetType;
  totalControls: number;
  implementedControls: number;
  partialControls: number;
  notImplementedControls: number;
  complianceScore: number;
  controls: Array<{
    controlId: string;
    controlIdentifier: string;
    title: string;
    implementationStatus: ImplementationStatus;
    effectivenessScore?: number;
    lastTestDate?: Date;
    implementationDate?: Date;
  }>;
}

export interface AssetTypeComplianceOverview {
  assetType: AssetType;
  totalAssets: number;
  assetsWithControls: number;
  assetsWithoutControls: number;
  averageComplianceScore: number;
  complianceDistribution: {
    excellent: number; // 90-100%
    good: number; // 70-89%
    fair: number; // 50-69%
    poor: number; // 0-49%
  };
  topCompliantAssets: Array<{
    assetId: string;
    complianceScore: number;
    totalControls: number;
  }>;
}

@Injectable()
export class ControlAssetMappingService {
  private readonly logger = new Logger(ControlAssetMappingService.name);

  constructor(
    @InjectRepository(ControlAssetMapping)
    private mappingRepository: Repository<ControlAssetMapping>,
    @InjectRepository(UnifiedControl)
    private controlRepository: Repository<UnifiedControl>,
  ) {}

  async create(
    controlId: string,
    createDto: CreateControlAssetMappingDto,
    userId: string,
  ): Promise<ControlAssetMapping> {
    // Verify control exists
    const control = await this.controlRepository.findOne({ where: { id: controlId } });
    if (!control) {
      throw new NotFoundException(`Unified control with ID ${controlId} not found`);
    }

    // Check if mapping already exists
    const existingMapping = await this.mappingRepository.findOne({
      where: {
        unified_control_id: controlId,
        asset_type: createDto.asset_type,
        asset_id: createDto.asset_id,
      },
    });

    if (existingMapping) {
      throw new ConflictException(
        `Control is already linked to this ${createDto.asset_type} asset`,
      );
    }

    const mapping = this.mappingRepository.create({
      unified_control_id: controlId,
      ...createDto,
      mapped_by: userId,
    });

    return this.mappingRepository.save(mapping);
  }

  async bulkCreate(
    controlId: string,
    bulkDto: BulkCreateControlAssetMappingDto,
    userId: string,
  ): Promise<ControlAssetMapping[]> {
    // Verify control exists
    const control = await this.controlRepository.findOne({ where: { id: controlId } });
    if (!control) {
      throw new NotFoundException(`Unified control with ID ${controlId} not found`);
    }

    // Check for existing mappings
    const existingMappings = await this.mappingRepository.find({
      where: {
        unified_control_id: controlId,
        asset_type: bulkDto.asset_type,
        asset_id: In(bulkDto.asset_ids),
      },
    });

    const existingAssetIds = new Set(existingMappings.map(m => m.asset_id));
    const newAssetIds = bulkDto.asset_ids.filter(id => !existingAssetIds.has(id));

    if (newAssetIds.length === 0) {
      throw new ConflictException('All selected assets are already linked to this control');
    }

    const mappings = newAssetIds.map(assetId =>
      this.mappingRepository.create({
        unified_control_id: controlId,
        asset_type: bulkDto.asset_type,
        asset_id: assetId,
        implementation_date: bulkDto.implementation_date ? new Date(bulkDto.implementation_date) : null,
        implementation_status: bulkDto.implementation_status,
        implementation_notes: bulkDto.implementation_notes,
        mapped_by: userId,
      }),
    );

    return this.mappingRepository.save(mappings);
  }

  async findAll(controlId: string, queryDto: ControlAssetMappingQueryDto) {
    const where: FindOptionsWhere<ControlAssetMapping> = {
      unified_control_id: controlId,
    };

    if (queryDto.asset_type) {
      where.asset_type = queryDto.asset_type;
    }

    if (queryDto.asset_id) {
      where.asset_id = queryDto.asset_id;
    }

    if (queryDto.implementation_status) {
      where.implementation_status = queryDto.implementation_status;
    }

    const mappings = await this.mappingRepository.find({
      where,
      relations: ['mapper'],
      order: { mapped_at: 'DESC' },
    });

    return mappings;
  }

  async findOne(controlId: string, mappingId: string): Promise<ControlAssetMapping> {
    const mapping = await this.mappingRepository.findOne({
      where: {
        id: mappingId,
        unified_control_id: controlId,
      },
      relations: ['mapper'],
    });

    if (!mapping) {
      throw new NotFoundException(
        `Control-asset mapping with ID ${mappingId} not found for control ${controlId}`,
      );
    }

    return mapping;
  }

  async update(
    controlId: string,
    mappingId: string,
    updateDto: UpdateControlAssetMappingDto,
  ): Promise<ControlAssetMapping> {
    const mapping = await this.findOne(controlId, mappingId);

    Object.assign(mapping, {
      ...updateDto,
      implementation_date: updateDto.implementation_date
        ? new Date(updateDto.implementation_date)
        : mapping.implementation_date,
      last_test_date: updateDto.last_test_date
        ? new Date(updateDto.last_test_date)
        : mapping.last_test_date,
    });

    return this.mappingRepository.save(mapping);
  }

  async remove(controlId: string, mappingId: string): Promise<void> {
    const mapping = await this.findOne(controlId, mappingId);
    await this.mappingRepository.remove(mapping);
  }

  async removeByAsset(controlId: string, assetType: AssetType, assetId: string): Promise<void> {
    const mapping = await this.mappingRepository.findOne({
      where: {
        unified_control_id: controlId,
        asset_type: assetType,
        asset_id: assetId,
      },
    });

    if (!mapping) {
      throw new NotFoundException(
        `Control-asset mapping not found for ${assetType} asset ${assetId}`,
      );
    }

    await this.mappingRepository.remove(mapping);
  }

  async bulkRemove(controlId: string, mappingIds: string[]): Promise<{ deleted: number; notFound: string[] }> {
    // Verify all mappings belong to this control
    const mappings = await this.mappingRepository.find({
      where: {
        id: In(mappingIds),
        unified_control_id: controlId,
      },
    });

    const foundIds = new Set(mappings.map(m => m.id));
    const notFound = mappingIds.filter(id => !foundIds.has(id));

    if (mappings.length > 0) {
      await this.mappingRepository.remove(mappings);
    }

    return {
      deleted: mappings.length,
      notFound,
    };
  }

  async getAssetsByControl(controlId: string): Promise<ControlAssetMapping[]> {
    return this.mappingRepository.find({
      where: { unified_control_id: controlId },
      relations: ['mapper'],
      order: { mapped_at: 'DESC' },
    });
  }

  async getControlsByAsset(assetType: AssetType, assetId: string): Promise<ControlAssetMapping[]> {
    return this.mappingRepository.find({
      where: {
        asset_type: assetType,
        asset_id: assetId,
      },
      relations: ['unified_control', 'mapper'],
      order: { mapped_at: 'DESC' },
    });
  }

  /**
   * Link multiple controls to an asset (from asset side)
   */
  async linkControlsToAsset(
    assetType: AssetType,
    assetId: string,
    controlIds: string[],
    implementationStatus?: string,
    implementationNotes?: string,
    userId?: string,
  ): Promise<{ created: ControlAssetMapping[]; alreadyLinked: string[] }> {
    // Check which controls are already linked
    const existingMappings = await this.mappingRepository.find({
      where: {
        asset_type: assetType,
        asset_id: assetId,
        unified_control_id: In(controlIds),
      },
    });

    const existingControlIds = new Set(existingMappings.map(m => m.unified_control_id));
    const newControlIds = controlIds.filter(id => !existingControlIds.has(id));

    // Verify all new controls exist
    const controls = await this.controlRepository.find({
      where: { id: In(newControlIds) },
    });

    const validControlIds = new Set(controls.map(c => c.id));
    const validNewControlIds = newControlIds.filter(id => validControlIds.has(id));

    // Create new mappings
    const mappings = validNewControlIds.map(controlId =>
      this.mappingRepository.create({
        unified_control_id: controlId,
        asset_type: assetType,
        asset_id: assetId,
        implementation_status: (implementationStatus as ImplementationStatus) || ImplementationStatus.NOT_IMPLEMENTED,
        implementation_notes: implementationNotes,
        mapped_by: userId,
      }),
    );

    const created = mappings.length > 0 ? await this.mappingRepository.save(mappings) : [];

    return {
      created,
      alreadyLinked: controlIds.filter(id => existingControlIds.has(id)),
    };
  }

  /**
   * Get asset compliance posture for a specific asset
   */
  async getAssetCompliancePosture(assetType: AssetType, assetId: string): Promise<AssetCompliancePosture> {
    const mappings = await this.mappingRepository.find({
      where: { asset_type: assetType, asset_id: assetId },
      relations: ['unified_control'],
      order: { mapped_at: 'DESC' },
    });

    const totalControls = mappings.length;
    let implementedControls = 0;
    let partialControls = 0;
    let notImplementedControls = 0;

    const controls = mappings.map(mapping => {
      switch (mapping.implementation_status) {
        case ImplementationStatus.IMPLEMENTED:
          implementedControls++;
          break;
        case ImplementationStatus.IN_PROGRESS:
          partialControls++;
          break;
        case ImplementationStatus.NOT_IMPLEMENTED:
          notImplementedControls++;
          break;
      }

      return {
        controlId: mapping.unified_control.id,
        controlIdentifier: mapping.unified_control.control_identifier,
        title: mapping.unified_control.title,
        implementationStatus: mapping.implementation_status,
        effectivenessScore: mapping.effectiveness_score,
        lastTestDate: mapping.last_test_date,
        implementationDate: mapping.implementation_date,
      };
    });

    // Calculate compliance score (implemented = 100%, partial = 50%, not implemented = 0%)
    const complianceScore = totalControls > 0
      ? Math.round(((implementedControls * 1.0 + partialControls * 0.5) / totalControls) * 100)
      : 0;

    return {
      assetId,
      assetType,
      totalControls,
      implementedControls,
      partialControls,
      notImplementedControls,
      complianceScore,
      controls,
    };
  }

  /**
   * Get compliance overview for all assets of a specific type
   */
  async getAssetTypeComplianceOverview(assetType: AssetType): Promise<AssetTypeComplianceOverview> {
    // Get all unique asset IDs for this type
    const assetMappings = await this.mappingRepository
      .createQueryBuilder('mapping')
      .select('DISTINCT mapping.asset_id', 'assetId')
      .where('mapping.asset_type = :assetType', { assetType })
      .getRawMany();

    const assetIds = assetMappings.map(m => m.assetId);
    const totalAssets = assetIds.length;

    if (totalAssets === 0) {
      return {
        assetType,
        totalAssets: 0,
        assetsWithControls: 0,
        assetsWithoutControls: 0,
        averageComplianceScore: 0,
        complianceDistribution: { excellent: 0, good: 0, fair: 0, poor: 0 },
        topCompliantAssets: [],
      };
    }

    // Calculate compliance for each asset
    const assetCompliances = await Promise.all(
      assetIds.map(assetId => this.getAssetCompliancePosture(assetType, assetId))
    );

    const assetsWithControls = assetCompliances.length;
    const assetsWithoutControls = 0; // This would need to be calculated from asset service

    const totalScore = assetCompliances.reduce((sum, asset) => sum + asset.complianceScore, 0);
    const averageComplianceScore = Math.round(totalScore / assetsWithControls);

    // Calculate distribution
    const distribution = { excellent: 0, good: 0, fair: 0, poor: 0 };
    assetCompliances.forEach(asset => {
      if (asset.complianceScore >= 90) distribution.excellent++;
      else if (asset.complianceScore >= 70) distribution.good++;
      else if (asset.complianceScore >= 50) distribution.fair++;
      else distribution.poor++;
    });

    // Get top 5 compliant assets
    const topCompliantAssets = assetCompliances
      .sort((a, b) => b.complianceScore - a.complianceScore)
      .slice(0, 5)
      .map(asset => ({
        assetId: asset.assetId,
        complianceScore: asset.complianceScore,
        totalControls: asset.totalControls,
      }));

    return {
      assetType,
      totalAssets,
      assetsWithControls,
      assetsWithoutControls,
      averageComplianceScore,
      complianceDistribution: distribution,
      topCompliantAssets,
    };
  }

  /**
   * Get control-asset matrix data
   */
  async getControlAssetMatrix(filters?: {
    assetType?: AssetType;
    controlDomain?: string;
    implementationStatus?: ImplementationStatus;
  }): Promise<{
    controls: Array<{
      id: string;
      identifier: string;
      title: string;
      domain: string;
      totalAssets: number;
      implementedAssets: number;
      partialAssets: number;
      notImplementedAssets: number;
    }>;
    assets: Array<{
      id: string;
      type: AssetType;
      complianceScore: number;
      totalControls: number;
    }>;
    matrix: Array<{
      controlId: string;
      assetId: string;
      implementationStatus: ImplementationStatus;
      effectivenessScore?: number;
    }>;
  }> {
    const { assetType, controlDomain, implementationStatus } = filters || {};

    // Get controls with optional domain filter
    let controlQuery = this.controlRepository.createQueryBuilder('control')
      .select([
        'control.id',
        'control.control_identifier',
        'control.title',
        'control.domain',
      ]);

    if (controlDomain) {
      controlQuery = controlQuery.where('control.domain = :domain', { domain: controlDomain });
    }

    const controls = await controlQuery.getMany();

    // Get assets with optional type filter
    let assetQuery = this.mappingRepository
      .createQueryBuilder('mapping')
      .select('DISTINCT mapping.asset_id', 'assetId')
      .addSelect('mapping.asset_type', 'assetType');

    if (assetType) {
      assetQuery = assetQuery.where('mapping.asset_type = :assetType', { assetType });
    }

    const assetResults = await assetQuery.getRawMany();

    // Get compliance scores for assets
    const assets = await Promise.all(
      assetResults.map(async (asset) => {
        const compliance = await this.getAssetCompliancePosture(asset.assetType, asset.assetId);
        return {
          id: asset.assetId,
          type: asset.assetType,
          complianceScore: compliance.complianceScore,
          totalControls: compliance.totalControls,
        };
      })
    );

    // Build matrix data
    const matrix: Array<{
      controlId: string;
      assetId: string;
      implementationStatus: ImplementationStatus;
      effectivenessScore?: number;
    }> = [];

    for (const control of controls) {
      for (const asset of assets) {
        const mapping = await this.mappingRepository.findOne({
          where: {
            unified_control_id: control.id,
            asset_type: asset.type,
            asset_id: asset.id,
          },
        });

        if (mapping) {
          matrix.push({
            controlId: control.id,
            assetId: asset.id,
            implementationStatus: mapping.implementation_status,
            effectivenessScore: mapping.effectiveness_score,
          });
        }
      }
    }

    // Add asset counts to controls
    const controlsWithCounts = await Promise.all(
      controls.map(async (control) => {
        const mappings = await this.mappingRepository.find({
          where: { unified_control_id: control.id },
        });

        let implementedAssets = 0;
        let partialAssets = 0;
        let notImplementedAssets = 0;

        mappings.forEach(mapping => {
          switch (mapping.implementation_status) {
            case ImplementationStatus.IMPLEMENTED:
              implementedAssets++;
              break;
            case ImplementationStatus.IN_PROGRESS:
              partialAssets++;
              break;
            case ImplementationStatus.NOT_IMPLEMENTED:
              notImplementedAssets++;
              break;
          }
        });

        return {
          id: control.id,
          identifier: control.control_identifier,
          title: control.title,
          domain: control.domain,
          totalAssets: mappings.length,
          implementedAssets,
          partialAssets,
          notImplementedAssets,
        };
      })
    );

    return {
      controls: controlsWithCounts,
      assets,
      matrix,
    };
  }

  /**
   * Get control effectiveness summary across all assets
   */
  async getControlEffectivenessSummary(controlId: string): Promise<{
    controlId: string;
    totalAssets: number;
    averageEffectiveness: number;
    effectivenessDistribution: {
      excellent: number; // 90-100%
      good: number; // 70-89%
      fair: number; // 50-69%
      poor: number; // 0-49%
    };
    assetEffectiveness: Array<{
      assetId: string;
      assetType: AssetType;
      effectivenessScore?: number;
      lastTestDate?: Date;
      implementationStatus: ImplementationStatus;
    }>;
  }> {
    const mappings = await this.mappingRepository.find({
      where: { unified_control_id: controlId },
      order: { updated_at: 'DESC' },
    });

    const totalAssets = mappings.length;
    const assetEffectiveness = mappings.map(mapping => ({
      assetId: mapping.asset_id,
      assetType: mapping.asset_type,
      effectivenessScore: mapping.effectiveness_score,
      lastTestDate: mapping.last_test_date,
      implementationStatus: mapping.implementation_status,
    }));

    // Calculate average effectiveness (only for assets with scores)
    const scoredAssets = assetEffectiveness.filter(a => a.effectivenessScore !== null);
    const averageEffectiveness = scoredAssets.length > 0
      ? Math.round(scoredAssets.reduce((sum, a) => sum + (a.effectivenessScore || 0), 0) / scoredAssets.length)
      : 0;

    // Calculate distribution
    const distribution = { excellent: 0, good: 0, fair: 0, poor: 0 };
    scoredAssets.forEach(asset => {
      const score = asset.effectivenessScore || 0;
      if (score >= 90) distribution.excellent++;
      else if (score >= 70) distribution.good++;
      else if (score >= 50) distribution.fair++;
      else distribution.poor++;
    });

    return {
      controlId,
      totalAssets,
      averageEffectiveness,
      effectivenessDistribution: distribution,
      assetEffectiveness,
    };
  }

  /**
   * Bulk update implementation status for multiple mappings
   */
  async bulkUpdateImplementationStatus(
    updates: Array<{
      controlId: string;
      assetType: AssetType;
      assetId: string;
      implementationStatus: ImplementationStatus;
      implementationNotes?: string;
      effectivenessScore?: number;
    }>,
    userId: string,
  ): Promise<{
    updated: number;
    notFound: number;
    errors: Array<{ controlId: string; assetId: string; error: string }>;
  }> {
    const result = { updated: 0, notFound: 0, errors: [] as Array<{ controlId: string; assetId: string; error: string }> };

    for (const update of updates) {
      try {
        const mapping = await this.mappingRepository.findOne({
          where: {
            unified_control_id: update.controlId,
            asset_type: update.assetType,
            asset_id: update.assetId,
          },
        });

        if (!mapping) {
          result.notFound++;
          continue;
        }

        Object.assign(mapping, {
          implementation_status: update.implementationStatus,
          implementation_notes: update.implementationNotes,
          effectiveness_score: update.effectivenessScore,
          updated_at: new Date(),
        });

        await this.mappingRepository.save(mapping);
        result.updated++;
      } catch (error) {
        result.errors.push({
          controlId: update.controlId,
          assetId: update.assetId,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    return result;
  }
}

