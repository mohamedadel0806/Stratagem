import { Controller, Get, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { AssetDependencyService } from '../services/asset-dependency.service';
import { CreateAssetDependencyDto } from '../dto/create-asset-dependency.dto';
import { AssetDependencyResponseDto } from '../dto/asset-dependency-response.dto';
import { AssetType } from '../entities/asset-dependency.entity';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { User } from '../../users/entities/user.entity';

@ApiTags('assets')
@Controller('assets')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AssetDependencyController {
  constructor(private readonly dependencyService: AssetDependencyService) {}

  @Post(':type/:id/dependencies')
  @ApiOperation({ summary: 'Create a dependency for an asset' })
  @ApiParam({ name: 'type', description: 'Asset type', enum: AssetType })
  @ApiParam({ name: 'id', description: 'Asset ID' })
  @ApiResponse({
    status: 201,
    description: 'Dependency created successfully',
    type: AssetDependencyResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid request or self-dependency' })
  @ApiResponse({ status: 404, description: 'Asset not found' })
  @ApiResponse({ status: 409, description: 'Dependency already exists' })
  async create(
    @Param('type') type: AssetType,
    @Param('id') id: string,
    @Body() createDto: CreateAssetDependencyDto,
    @CurrentUser() user: User,
  ): Promise<AssetDependencyResponseDto> {
    return this.dependencyService.create(type, id, createDto, user.id);
  }

  @Get(':type/:id/dependencies')
  @ApiOperation({ summary: 'Get all dependencies for an asset (outgoing)' })
  @ApiParam({ name: 'type', description: 'Asset type', enum: AssetType })
  @ApiParam({ name: 'id', description: 'Asset ID' })
  @ApiResponse({
    status: 200,
    description: 'List of dependencies',
    type: [AssetDependencyResponseDto],
  })
  @ApiResponse({ status: 404, description: 'Asset not found' })
  async findAll(
    @Param('type') type: AssetType,
    @Param('id') id: string,
  ): Promise<AssetDependencyResponseDto[]> {
    return this.dependencyService.findAll(type, id);
  }

  @Get(':type/:id/dependencies/incoming')
  @ApiOperation({ summary: 'Get all incoming dependencies for an asset' })
  @ApiParam({ name: 'type', description: 'Asset type', enum: AssetType })
  @ApiParam({ name: 'id', description: 'Asset ID' })
  @ApiResponse({
    status: 200,
    description: 'List of incoming dependencies',
    type: [AssetDependencyResponseDto],
  })
  @ApiResponse({ status: 404, description: 'Asset not found' })
  async findIncoming(
    @Param('type') type: AssetType,
    @Param('id') id: string,
  ): Promise<AssetDependencyResponseDto[]> {
    return this.dependencyService.findIncoming(type, id);
  }

  @Get(':type/:id/dependencies/check')
  @ApiOperation({ summary: 'Check if an asset has any dependencies (for deletion warnings)' })
  @ApiParam({ name: 'type', description: 'Asset type', enum: AssetType })
  @ApiParam({ name: 'id', description: 'Asset ID' })
  @ApiResponse({
    status: 200,
    description: 'Dependency check result',
  })
  async checkDependencies(
    @Param('type') type: AssetType,
    @Param('id') id: string,
  ): Promise<{
    hasDependencies: boolean;
    outgoingCount: number;
    incomingCount: number;
    totalCount: number;
    outgoing: AssetDependencyResponseDto[];
    incoming: AssetDependencyResponseDto[];
  }> {
    return this.dependencyService.checkDependencies(type, id);
  }

  @Get(':type/:id/dependencies/chain')
  @ApiOperation({ summary: 'Get multi-level dependency chain (impact analysis)' })
  @ApiParam({ name: 'type', description: 'Asset type', enum: AssetType })
  @ApiParam({ name: 'id', description: 'Asset ID' })
  @ApiResponse({
    status: 200,
    description: 'Multi-level dependency chain',
  })
  @ApiResponse({ status: 404, description: 'Asset not found' })
  async getDependencyChain(
    @Param('type') type: AssetType,
    @Param('id') id: string,
  ): Promise<{
    chain: Array<{
      assetType: AssetType;
      assetId: string;
      assetName: string;
      assetIdentifier: string;
      depth: number;
      path: Array<{ assetType: AssetType; assetId: string }>;
    }>;
    totalCount: number;
    maxDepthReached: number;
  }> {
    return this.dependencyService.getDependencyChain(type, id, 3, 'outgoing');
  }

  @Delete('dependencies/:dependencyId')
  @ApiOperation({ summary: 'Remove a dependency' })
  @ApiParam({ name: 'dependencyId', description: 'Dependency ID' })
  @ApiResponse({ status: 200, description: 'Dependency removed successfully' })
  @ApiResponse({ status: 404, description: 'Dependency not found' })
  async remove(@Param('dependencyId') dependencyId: string): Promise<{ message: string }> {
    await this.dependencyService.remove(dependencyId);
    return { message: 'Dependency removed successfully' };
  }
}

