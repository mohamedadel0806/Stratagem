import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AssetFieldConfig, AssetTypeEnum } from '../entities/asset-field-config.entity';
import { CreateAssetFieldConfigDto } from '../dto/create-asset-field-config.dto';
import { UpdateAssetFieldConfigDto } from '../dto/update-asset-field-config.dto';

@Injectable()
export class AssetFieldConfigService {
  constructor(
    @InjectRepository(AssetFieldConfig)
    private fieldConfigRepository: Repository<AssetFieldConfig>,
  ) {}

  async create(dto: CreateAssetFieldConfigDto, userId: string): Promise<AssetFieldConfig> {
    // Check if field already exists
    const existing = await this.fieldConfigRepository.findOne({
      where: {
        assetType: dto.assetType,
        fieldName: dto.fieldName,
      },
    });

    if (existing) {
      throw new BadRequestException(`Field ${dto.fieldName} already exists for asset type ${dto.assetType}`);
    }

    const config = this.fieldConfigRepository.create({
      ...dto,
      createdById: userId,
      isEnabled: dto.isEnabled !== undefined ? dto.isEnabled : true,
      isRequired: dto.isRequired !== undefined ? dto.isRequired : false,
    });

    return this.fieldConfigRepository.save(config);
  }

  async findAll(assetType?: AssetTypeEnum): Promise<AssetFieldConfig[]> {
    const where = assetType ? { assetType } : {};
    return this.fieldConfigRepository.find({
      where,
      relations: ['createdBy'],
      order: { displayOrder: 'ASC', createdAt: 'ASC' },
    });
  }

  async findOne(id: string): Promise<AssetFieldConfig> {
    const config = await this.fieldConfigRepository.findOne({
      where: { id },
      relations: ['createdBy'],
    });

    if (!config) {
      throw new NotFoundException(`Field config with ID ${id} not found`);
    }

    return config;
  }

  async findByAssetType(assetType: AssetTypeEnum): Promise<AssetFieldConfig[]> {
    return this.fieldConfigRepository.find({
      where: { assetType, isEnabled: true },
      order: { displayOrder: 'ASC', createdAt: 'ASC' },
    });
  }

  async update(id: string, dto: UpdateAssetFieldConfigDto): Promise<AssetFieldConfig> {
    const config = await this.findOne(id);

    // Check if field has data (simplified check - in production, check actual asset records)
    if (dto.isEnabled === false && config.isEnabled) {
      // Field is being disabled - check if it has data
      // For now, we'll allow disabling
    }

    Object.assign(config, dto);
    return this.fieldConfigRepository.save(config);
  }

  async delete(id: string): Promise<void> {
    const config = await this.findOne(id);

    // Check if field has data - if yes, only disable, don't delete
    // For now, we'll check if there are any assets using this field
    // In production, you'd query the actual asset tables
    const hasData = false; // Simplified - implement actual check

    if (hasData) {
      // Disable instead of delete
      config.isEnabled = false;
      await this.fieldConfigRepository.save(config);
    } else {
      await this.fieldConfigRepository.remove(config);
    }
  }

  async validateFieldValue(
    assetType: AssetTypeEnum,
    fieldName: string,
    value: any,
  ): Promise<{ valid: boolean; message?: string }> {
    const config = await this.fieldConfigRepository.findOne({
      where: { assetType, fieldName, isEnabled: true },
    });

    if (!config) {
      return { valid: true }; // Field not configured, allow
    }

    // Check required
    if (config.isRequired && (value === null || value === undefined || value === '')) {
      return {
        valid: false,
        message: config.validationMessage || `${config.displayName} is required`,
      };
    }

    // Check validation rule (regex)
    if (config.validationRule && value) {
      const regex = new RegExp(config.validationRule);
      if (!regex.test(String(value))) {
        return {
          valid: false,
          message: config.validationMessage || `${config.displayName} format is invalid`,
        };
      }
    }

    // Check select options
    if (config.fieldType === 'select' && config.selectOptions && value) {
      if (!config.selectOptions.includes(String(value))) {
        return {
          valid: false,
          message: `${config.displayName} must be one of: ${config.selectOptions.join(', ')}`,
        };
      }
    }

    return { valid: true };
  }

  async getFieldConfigForForm(assetType: AssetTypeEnum): Promise<AssetFieldConfig[]> {
    return this.fieldConfigRepository.find({
      where: { assetType, isEnabled: true },
      order: { displayOrder: 'ASC', createdAt: 'ASC' },
    });
  }
}








