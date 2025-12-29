import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { AssetTypeService } from '../services/asset-type.service';
import { AssetType, AssetCategory } from '../entities/asset-type.entity';
import { CreateAssetTypeDto } from '../dto/create-asset-type.dto';
import { UpdateAssetTypeDto } from '../dto/update-asset-type.dto';

@ApiTags('Asset Types')
@Controller('assets/types')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AssetTypeController {
  constructor(private readonly assetTypeService: AssetTypeService) { }

  @Get()
  @ApiOperation({ summary: 'Get all asset types' })
  @ApiQuery({
    name: 'category',
    required: false,
    enum: AssetCategory,
    description: 'Filter by asset category',
  })
  @ApiResponse({
    status: 200,
    description: 'List of asset types',
    type: [AssetType],
  })
  async findAll(@Query('category') category?: AssetCategory): Promise<AssetType[]> {
    return this.assetTypeService.findAll(category);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get asset type by ID' })
  @ApiResponse({
    status: 200,
    description: 'Asset type details',
    type: AssetType,
  })
  async findOne(@Param('id') id: string): Promise<AssetType> {
    return this.assetTypeService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new asset type' })
  async create(@Body() createDto: CreateAssetTypeDto) {
    return this.assetTypeService.create(createDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an asset type' })
  async update(@Param('id') id: string, @Body() updateDto: UpdateAssetTypeDto) {
    return this.assetTypeService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an asset type (deactivate)' })
  async remove(@Param('id') id: string) {
    await this.assetTypeService.remove(id);
    return { success: true };
  }
}



