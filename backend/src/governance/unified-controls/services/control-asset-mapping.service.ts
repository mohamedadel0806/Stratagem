import { Injectable, NotFoundException, ConflictException, Logger, Optional } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, In } from 'typeorm';
import { ControlAssetMapping, AssetType } from '../entities/control-asset-mapping.entity';
import { UnifiedControl, ImplementationStatus } from '../entities/unified-control.entity';
import { CreateControlAssetMappingDto, BulkCreateControlAssetMappingDto } from '../dto/create-control-asset-mapping.dto';
import { UpdateControlAssetMappingDto } from '../dto/update-control-asset-mapping.dto';
import { ControlAssetMappingQueryDto } from '../dto/control-asset-mapping-query.dto';

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
      alreadyLinked: Array.from(existingControlIds),
    };
  }
}

