import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, FindOptionsWhere } from 'typeorm';
import { ControlAssetMapping, AssetType } from '../entities/control-asset-mapping.entity';
import { UnifiedControl, ImplementationStatus } from '../entities/unified-control.entity';

interface CreateMappingDto {
  asset_id: string;
  asset_type: AssetType;
  implementation_status?: ImplementationStatus;
  implementation_notes?: string;
  is_automated?: boolean;
}

interface UpdateMappingDto {
  implementation_status?: ImplementationStatus;
  implementation_notes?: string;
  last_test_date?: Date;
  last_test_result?: string;
  effectiveness_score?: number;
}

interface MapControlsToAssetsDto {
  asset_ids: string[];
  asset_type: AssetType;
}

interface BulkUpdateStatusDto {
  mapping_ids: string[];
  implementation_status: ImplementationStatus;
}

interface AssetComplianceScore {
  asset_id: string;
  asset_type: AssetType;
  total_controls: number;
  implemented_controls: number;
  compliance_percentage: number;
  implementation_status_breakdown: Record<ImplementationStatus, number>;
}

interface ControlEffectiveness {
  control_id: string;
  control_identifier: string;
  total_assets: number;
  average_effectiveness: number;
  implementation_status_breakdown: Record<ImplementationStatus, number>;
}

interface AssetControlMatrixRow {
  control_id: string;
  control_identifier: string;
  control_title: string;
  [key: string]: any; // asset_id: implementation_status
}

@Injectable()
export class AssetControlService {
  private readonly logger = new Logger(AssetControlService.name);

  constructor(
    @InjectRepository(ControlAssetMapping)
    private mappingRepository: Repository<ControlAssetMapping>,
    @InjectRepository(UnifiedControl)
    private controlRepository: Repository<UnifiedControl>,
  ) {}

  // ============================================================================
  // MAPPING CRUD OPERATIONS
  // ============================================================================

  /**
   * Map a single control to an asset
   */
  async mapControlToAsset(
    controlId: string,
    dto: CreateMappingDto,
    userId: string,
  ): Promise<ControlAssetMapping> {
    // Verify control exists
    const control = await this.controlRepository.findOne({ where: { id: controlId } });
    if (!control) {
      throw new NotFoundException(`Control ${controlId} not found`);
    }

    // Check if mapping already exists
    const existing = await this.mappingRepository.findOne({
      where: {
        unified_control_id: controlId,
        asset_id: dto.asset_id,
        asset_type: dto.asset_type,
      },
    });

    if (existing) {
      throw new BadRequestException(
        `Control ${controlId} is already mapped to asset ${dto.asset_id}`,
      );
    }

    const mapping = this.mappingRepository.create({
      unified_control_id: controlId,
      asset_id: dto.asset_id,
      asset_type: dto.asset_type,
      implementation_status: dto.implementation_status || ImplementationStatus.NOT_IMPLEMENTED,
      implementation_notes: dto.implementation_notes,
      is_automated: dto.is_automated || false,
      mapped_by: userId,
    });

    const saved = await this.mappingRepository.save(mapping);
    this.logger.log(`Control ${controlId} mapped to asset ${dto.asset_id}`);

    return saved;
  }

  /**
   * Map a control to multiple assets
   */
  async mapControlToAssets(
    controlId: string,
    dto: MapControlsToAssetsDto,
    userId: string,
  ): Promise<ControlAssetMapping[]> {
    // Verify control exists
    const control = await this.controlRepository.findOne({ where: { id: controlId } });
    if (!control) {
      throw new NotFoundException(`Control ${controlId} not found`);
    }

    // Check for existing mappings
    const existing = await this.mappingRepository.find({
      where: {
        unified_control_id: controlId,
        asset_id: In(dto.asset_ids),
      },
    });

    if (existing.length > 0) {
      throw new BadRequestException(
        `Control is already mapped to ${existing.length} of the requested assets`,
      );
    }

    // Create all mappings
    const mappings = dto.asset_ids.map(assetId =>
      this.mappingRepository.create({
        unified_control_id: controlId,
        asset_id: assetId,
        asset_type: dto.asset_type,
        implementation_status: ImplementationStatus.NOT_IMPLEMENTED,
        mapped_by: userId,
      }),
    );

    const saved = await this.mappingRepository.save(mappings);
    this.logger.log(`Control ${controlId} mapped to ${saved.length} assets`);

    return saved;
  }

  /**
   * Get all controls for an asset
   */
  async getAssetControls(
    assetId: string,
    assetType: AssetType,
    page: number = 1,
    limit: number = 25,
  ): Promise<{ mappings: ControlAssetMapping[]; total: number }> {
    const skip = (page - 1) * limit;

    const [mappings, total] = await this.mappingRepository.findAndCount({
      where: {
        asset_id: assetId,
        asset_type: assetType,
      },
      relations: ['unified_control'],
      order: { mapped_at: 'DESC' },
      skip,
      take: limit,
    });

    return { mappings, total };
  }

  /**
   * Get all assets for a control
   */
  async getControlAssets(
    controlId: string,
    page: number = 1,
    limit: number = 25,
  ): Promise<{ mappings: ControlAssetMapping[]; total: number }> {
    const skip = (page - 1) * limit;

    const [mappings, total] = await this.mappingRepository.findAndCount({
      where: { unified_control_id: controlId },
      order: { mapped_at: 'DESC' },
      skip,
      take: limit,
    });

    return { mappings, total };
  }

  /**
   * Update a control-asset mapping
   */
  async updateMapping(
    controlId: string,
    assetId: string,
    dto: UpdateMappingDto,
  ): Promise<ControlAssetMapping> {
    const mapping = await this.mappingRepository.findOne({
      where: {
        unified_control_id: controlId,
        asset_id: assetId,
      },
    });

    if (!mapping) {
      throw new NotFoundException(
        `Mapping for control ${controlId} and asset ${assetId} not found`,
      );
    }

    Object.assign(mapping, dto);
    const saved = await this.mappingRepository.save(mapping);

    this.logger.log(`Mapping for control ${controlId} and asset ${assetId} updated`);
    return saved;
  }

  /**
   * Delete a control-asset mapping
   */
  async deleteMapping(controlId: string, assetId: string): Promise<void> {
    const mapping = await this.mappingRepository.findOne({
      where: {
        unified_control_id: controlId,
        asset_id: assetId,
      },
    });

    if (!mapping) {
      throw new NotFoundException(
        `Mapping for control ${controlId} and asset ${assetId} not found`,
      );
    }

    await this.mappingRepository.remove(mapping);
    this.logger.log(`Mapping for control ${controlId} and asset ${assetId} deleted`);
  }

  // ============================================================================
  // COMPLIANCE & EFFECTIVENESS CALCULATIONS
  // ============================================================================

  /**
   * Calculate compliance score for an asset
   */
  async getAssetComplianceScore(assetId: string, assetType: AssetType): Promise<AssetComplianceScore> {
    const mappings = await this.mappingRepository.find({
      where: {
        asset_id: assetId,
        asset_type: assetType,
      },
    });

    const breakdown: Record<ImplementationStatus, number> = {
      [ImplementationStatus.NOT_IMPLEMENTED]: 0,
      [ImplementationStatus.PLANNED]: 0,
      [ImplementationStatus.IN_PROGRESS]: 0,
      [ImplementationStatus.IMPLEMENTED]: 0,
      [ImplementationStatus.NOT_APPLICABLE]: 0,
    };

    let implementedCount = 0;

    for (const mapping of mappings) {
      breakdown[mapping.implementation_status]++;
      if (mapping.implementation_status === ImplementationStatus.IMPLEMENTED) {
        implementedCount++;
      }
    }

    // Calculate percentage (exclude not_applicable from total)
    const applicableControls = mappings.filter(
      m => m.implementation_status !== ImplementationStatus.NOT_APPLICABLE,
    ).length;

    const compliancePercentage =
      applicableControls > 0 ? (implementedCount / applicableControls) * 100 : 0;

    return {
      asset_id: assetId,
      asset_type: assetType,
      total_controls: mappings.length,
      implemented_controls: implementedCount,
      compliance_percentage: Math.round(compliancePercentage * 100) / 100,
      implementation_status_breakdown: breakdown,
    };
  }

  /**
   * Calculate effectiveness for a control
   */
  async getControlEffectiveness(controlId: string): Promise<ControlEffectiveness> {
    const mappings = await this.mappingRepository.find({
      where: { unified_control_id: controlId },
    });

    const control = await this.controlRepository.findOne({ where: { id: controlId } });
    if (!control) {
      throw new NotFoundException(`Control ${controlId} not found`);
    }

    const breakdown: Record<ImplementationStatus, number> = {
      [ImplementationStatus.NOT_IMPLEMENTED]: 0,
      [ImplementationStatus.PLANNED]: 0,
      [ImplementationStatus.IN_PROGRESS]: 0,
      [ImplementationStatus.IMPLEMENTED]: 0,
      [ImplementationStatus.NOT_APPLICABLE]: 0,
    };

    let totalEffectiveness = 0;
    let scoredMappings = 0;

    for (const mapping of mappings) {
      breakdown[mapping.implementation_status]++;

      if (mapping.effectiveness_score !== null && mapping.effectiveness_score !== undefined) {
        totalEffectiveness += mapping.effectiveness_score;
        scoredMappings++;
      }
    }

    const averageEffectiveness = scoredMappings > 0 ? totalEffectiveness / scoredMappings : 0;

    return {
      control_id: controlId,
      control_identifier: control.control_identifier,
      total_assets: mappings.length,
      average_effectiveness: Math.round(averageEffectiveness * 100) / 100,
      implementation_status_breakdown: breakdown,
    };
  }

  // ============================================================================
  // MATRIX & BULK OPERATIONS
  // ============================================================================

  /**
   * Get asset-control matrix for visualization
   */
  async getAssetControlMatrix(
    assetType?: AssetType,
    domain?: string,
    status?: ImplementationStatus,
  ): Promise<AssetControlMatrixRow[]> {
    let query = this.mappingRepository
      .createQueryBuilder('mapping')
      .leftJoinAndSelect('mapping.unified_control', 'control');

    if (assetType) {
      query = query.where('mapping.asset_type = :assetType', { assetType });
    }

    if (domain) {
      query = query.andWhere('control.domain = :domain', { domain });
    }

    if (status) {
      query = query.andWhere('mapping.implementation_status = :status', { status });
    }

    const mappings = await query.orderBy('control.control_identifier', 'ASC').getMany();

    // Group by control and build matrix rows
    const controlMap = new Map<string, AssetControlMatrixRow>();

    for (const mapping of mappings) {
      const controlId = mapping.unified_control_id;

      if (!controlMap.has(controlId)) {
        controlMap.set(controlId, {
          control_id: controlId,
          control_identifier: mapping.unified_control.control_identifier,
          control_title: mapping.unified_control.title,
        });
      }

      const row = controlMap.get(controlId)!;
      row[mapping.asset_id] = mapping.implementation_status;
    }

    return Array.from(controlMap.values());
  }

  /**
   * Get matrix statistics
   */
  async getMatrixStatistics(): Promise<{
    total_mappings: number;
    by_implementation_status: Record<ImplementationStatus, number>;
    by_asset_type: Record<AssetType, number>;
    average_effectiveness: number;
    unmapped_controls_count: number;
    unmapped_assets_count: number;
  }> {
    const allMappings = await this.mappingRepository.find();
    const allControls = await this.controlRepository.find();

    const byStatus: Record<ImplementationStatus, number> = {
      [ImplementationStatus.NOT_IMPLEMENTED]: 0,
      [ImplementationStatus.PLANNED]: 0,
      [ImplementationStatus.IN_PROGRESS]: 0,
      [ImplementationStatus.IMPLEMENTED]: 0,
      [ImplementationStatus.NOT_APPLICABLE]: 0,
    };

    const byAssetType: Record<AssetType, number> = {
      [AssetType.PHYSICAL]: 0,
      [AssetType.INFORMATION]: 0,
      [AssetType.APPLICATION]: 0,
      [AssetType.SOFTWARE]: 0,
      [AssetType.SUPPLIER]: 0,
    };

    let totalEffectiveness = 0;
    let effectivenessCount = 0;

    for (const mapping of allMappings) {
      byStatus[mapping.implementation_status]++;
      byAssetType[mapping.asset_type]++;

      if (mapping.effectiveness_score !== null && mapping.effectiveness_score !== undefined) {
        totalEffectiveness += mapping.effectiveness_score;
        effectivenessCount++;
      }
    }

    // Find unmapped controls
    const mappedControlIds = new Set(allMappings.map(m => m.unified_control_id));
    const unmappedControls = allControls.filter(c => !mappedControlIds.has(c.id));

    return {
      total_mappings: allMappings.length,
      by_implementation_status: byStatus,
      by_asset_type: byAssetType,
      average_effectiveness: effectivenessCount > 0 ? totalEffectiveness / effectivenessCount : 0,
      unmapped_controls_count: unmappedControls.length,
      unmapped_assets_count: 0, // Would need asset repo to calculate
    };
  }

  /**
   * Bulk update implementation status
   */
  async bulkUpdateStatus(
    dto: BulkUpdateStatusDto,
    userId: string,
  ): Promise<{ updated: number }> {
    const result = await this.mappingRepository.update(
      { id: In(dto.mapping_ids) },
      {
        implementation_status: dto.implementation_status,
        updated_at: new Date(),
      },
    );

    this.logger.log(`Updated ${result.affected || 0} mappings to status ${dto.implementation_status}`);

    return { updated: result.affected || 0 };
  }

  /**
   * Get unmapped controls (controls without any asset mappings)
   */
  async getUnmappedControls(
    page: number = 1,
    limit: number = 25,
  ): Promise<{ controls: UnifiedControl[]; total: number }> {
    // Get all controls
    const skip = (page - 1) * limit;
    const [allControls, total] = await this.controlRepository.findAndCount({
      skip,
      take: limit,
    });

    // Get mapped control IDs
    const mappedControlIds = await this.mappingRepository
      .createQueryBuilder('mapping')
      .distinct(true)
      .select('mapping.unified_control_id')
      .getRawMany()
      .then(results => new Set(results.map(r => r.mapping_unified_control_id)));

    // Filter unmapped
    const unmappedControls = allControls.filter(c => !mappedControlIds.has(c.id));

    return {
      controls: unmappedControls,
      total,
    };
  }

  // ============================================================================
  // STATISTICS & REPORTING
  // ============================================================================

  /**
   * Get comprehensive statistics
   */
  async getComprehensiveStatistics(): Promise<{
    total_controls: number;
    total_mappings: number;
    average_compliance_score: number;
    average_effectiveness_score: number;
    implementation_distribution: Record<ImplementationStatus, number>;
  }> {
    const allControls = await this.controlRepository.find();
    const allMappings = await this.mappingRepository.find();

    const distribution: Record<ImplementationStatus, number> = {
      [ImplementationStatus.NOT_IMPLEMENTED]: 0,
      [ImplementationStatus.PLANNED]: 0,
      [ImplementationStatus.IN_PROGRESS]: 0,
      [ImplementationStatus.IMPLEMENTED]: 0,
      [ImplementationStatus.NOT_APPLICABLE]: 0,
    };

    let totalEffectiveness = 0;
    let effectivenessCount = 0;

    for (const mapping of allMappings) {
      distribution[mapping.implementation_status]++;

      if (mapping.effectiveness_score !== null && mapping.effectiveness_score !== undefined) {
        totalEffectiveness += mapping.effectiveness_score;
        effectivenessCount++;
      }
    }

    // Calculate average compliance
    const implementedMappings = Object.entries(distribution)
      .filter(([status]) => status === ImplementationStatus.IMPLEMENTED)
      .reduce((sum, [, count]) => sum + count, 0);

    const applicableMappings = allMappings.filter(
      m => m.implementation_status !== ImplementationStatus.NOT_APPLICABLE,
    ).length;

    const averageCompliance =
      applicableMappings > 0 ? (implementedMappings / applicableMappings) * 100 : 0;

    return {
      total_controls: allControls.length,
      total_mappings: allMappings.length,
      average_compliance_score: Math.round(averageCompliance * 100) / 100,
      average_effectiveness_score:
        effectivenessCount > 0 ? Math.round((totalEffectiveness / effectivenessCount) * 100) / 100 : 0,
      implementation_distribution: distribution,
    };
  }

  /**
   * Get compliance by asset type
   */
  async getComplianceByAssetType(): Promise<
    Array<{
      asset_type: AssetType;
      total_mappings: number;
      implemented: number;
      compliance_percentage: number;
    }>
  > {
    const allMappings = await this.mappingRepository.find();

    const byType: Record<
      AssetType,
      { total: number; implemented: number }
    > = {
      [AssetType.PHYSICAL]: { total: 0, implemented: 0 },
      [AssetType.INFORMATION]: { total: 0, implemented: 0 },
      [AssetType.APPLICATION]: { total: 0, implemented: 0 },
      [AssetType.SOFTWARE]: { total: 0, implemented: 0 },
      [AssetType.SUPPLIER]: { total: 0, implemented: 0 },
    };

    for (const mapping of allMappings) {
      byType[mapping.asset_type].total++;
      if (mapping.implementation_status === ImplementationStatus.IMPLEMENTED) {
        byType[mapping.asset_type].implemented++;
      }
    }

    return Object.entries(byType).map(([type, stats]) => ({
      asset_type: type as AssetType,
      total_mappings: stats.total,
      implemented: stats.implemented,
      compliance_percentage:
        stats.total > 0 ? Math.round((stats.implemented / stats.total) * 100 * 100) / 100 : 0,
    }));
  }
}
