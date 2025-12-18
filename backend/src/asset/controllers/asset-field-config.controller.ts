import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { AssetFieldConfigService } from '../services/asset-field-config.service';
import { CreateAssetFieldConfigDto } from '../dto/create-asset-field-config.dto';
import { UpdateAssetFieldConfigDto } from '../dto/update-asset-field-config.dto';
import { AssetFieldConfigResponseDto } from '../dto/asset-field-config-response.dto';
import { AssetTypeEnum } from '../entities/asset-field-config.entity';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { User } from '../../users/entities/user.entity';

@ApiTags('Asset Field Configuration')
@Controller('assets/field-configs')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AssetFieldConfigController {
  constructor(private readonly fieldConfigService: AssetFieldConfigService) {}

  @Post()
  @ApiOperation({ summary: 'Create asset field configuration' })
  @ApiResponse({ status: 201, description: 'Field config created', type: AssetFieldConfigResponseDto })
  async create(
    @Body() dto: CreateAssetFieldConfigDto,
    @CurrentUser() user: User,
  ): Promise<AssetFieldConfigResponseDto> {
    const config = await this.fieldConfigService.create(dto, user.id);
    return this.mapToResponseDto(config);
  }

  @Get()
  @ApiOperation({ summary: 'Get all field configurations' })
  @ApiQuery({ name: 'assetType', required: false, enum: AssetTypeEnum })
  @ApiResponse({ status: 200, description: 'List of field configs', type: [AssetFieldConfigResponseDto] })
  async findAll(@Query('assetType') assetType?: AssetTypeEnum): Promise<AssetFieldConfigResponseDto[]> {
    const configs = await this.fieldConfigService.findAll(assetType);
    return configs.map((config) => this.mapToResponseDto(config));
  }

  @Get('for-form/:assetType')
  @ApiOperation({ summary: 'Get field configurations for form (enabled only)' })
  @ApiParam({ name: 'assetType', enum: AssetTypeEnum })
  @ApiResponse({ status: 200, description: 'List of enabled field configs', type: [AssetFieldConfigResponseDto] })
  async getForForm(@Param('assetType') assetType: AssetTypeEnum): Promise<AssetFieldConfigResponseDto[]> {
    const configs = await this.fieldConfigService.getFieldConfigForForm(assetType);
    return configs.map((config) => this.mapToResponseDto(config));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get field configuration by ID' })
  @ApiParam({ name: 'id', description: 'Field config ID' })
  @ApiResponse({ status: 200, description: 'Field config', type: AssetFieldConfigResponseDto })
  async findOne(@Param('id') id: string): Promise<AssetFieldConfigResponseDto> {
    const config = await this.fieldConfigService.findOne(id);
    return this.mapToResponseDto(config);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update field configuration' })
  @ApiParam({ name: 'id', description: 'Field config ID' })
  @ApiResponse({ status: 200, description: 'Field config updated', type: AssetFieldConfigResponseDto })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateAssetFieldConfigDto,
  ): Promise<AssetFieldConfigResponseDto> {
    const config = await this.fieldConfigService.update(id, dto);
    return this.mapToResponseDto(config);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete field configuration (or disable if has data)' })
  @ApiParam({ name: 'id', description: 'Field config ID' })
  @ApiResponse({ status: 200, description: 'Field config deleted or disabled' })
  async delete(@Param('id') id: string): Promise<void> {
    await this.fieldConfigService.delete(id);
  }

  @Post('validate')
  @ApiOperation({ summary: 'Validate field value' })
  @ApiResponse({ status: 200, description: 'Validation result' })
  async validate(
    @Body() body: { assetType: AssetTypeEnum; fieldName: string; value: any },
  ): Promise<{ valid: boolean; message?: string }> {
    return this.fieldConfigService.validateFieldValue(body.assetType, body.fieldName, body.value);
  }

  private mapToResponseDto(config: any): AssetFieldConfigResponseDto {
    return {
      id: config.id,
      assetType: config.assetType,
      fieldName: config.fieldName,
      displayName: config.displayName,
      fieldType: config.fieldType,
      isRequired: config.isRequired,
      isEnabled: config.isEnabled,
      displayOrder: config.displayOrder,
      validationRule: config.validationRule,
      validationMessage: config.validationMessage,
      selectOptions: config.selectOptions,
      defaultValue: config.defaultValue,
      helpText: config.helpText,
      fieldDependencies: config.fieldDependencies,
      createdById: config.createdById,
      createdByName: config.createdBy
        ? `${config.createdBy.firstName} ${config.createdBy.lastName}`
        : undefined,
      createdAt: config.createdAt,
      updatedAt: config.updatedAt,
    };
  }
}









