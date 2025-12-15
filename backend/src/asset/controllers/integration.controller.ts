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
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { IntegrationService } from '../services/integration.service';
import { CreateIntegrationConfigDto } from '../dto/create-integration-config.dto';
import { UpdateIntegrationConfigDto } from '../dto/update-integration-config.dto';
import { IntegrationConfigResponseDto } from '../dto/integration-config-response.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { User } from '../../users/entities/user.entity';

@ApiTags('Integrations')
@Controller('assets/integrations')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class IntegrationController {
  constructor(private readonly integrationService: IntegrationService) {}

  @Post()
  @ApiOperation({ summary: 'Create integration configuration' })
  @ApiResponse({ status: 201, description: 'Integration config created', type: IntegrationConfigResponseDto })
  async create(
    @Body() dto: CreateIntegrationConfigDto,
    @CurrentUser() user: User,
  ): Promise<IntegrationConfigResponseDto> {
    const config = await this.integrationService.createConfig(dto, user.id);
    return this.mapToResponseDto(config);
  }

  @Get()
  @ApiOperation({ summary: 'Get all integration configurations' })
  @ApiResponse({ status: 200, description: 'List of integration configs', type: [IntegrationConfigResponseDto] })
  async findAll(): Promise<IntegrationConfigResponseDto[]> {
    const configs = await this.integrationService.findAll();
    return configs.map((config) => this.mapToResponseDto(config));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get integration configuration by ID' })
  @ApiParam({ name: 'id', description: 'Integration config ID' })
  @ApiResponse({ status: 200, description: 'Integration config', type: IntegrationConfigResponseDto })
  async findOne(@Param('id') id: string): Promise<IntegrationConfigResponseDto> {
    const config = await this.integrationService.findOne(id);
    return this.mapToResponseDto(config);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update integration configuration' })
  @ApiParam({ name: 'id', description: 'Integration config ID' })
  @ApiResponse({ status: 200, description: 'Integration config updated', type: IntegrationConfigResponseDto })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateIntegrationConfigDto,
  ): Promise<IntegrationConfigResponseDto> {
    const config = await this.integrationService.update(id, dto);
    return this.mapToResponseDto(config);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete integration configuration' })
  @ApiParam({ name: 'id', description: 'Integration config ID' })
  @ApiResponse({ status: 200, description: 'Integration config deleted' })
  async delete(@Param('id') id: string): Promise<void> {
    await this.integrationService.delete(id);
  }

  @Post(':id/test')
  @ApiOperation({ summary: 'Test integration connection' })
  @ApiParam({ name: 'id', description: 'Integration config ID' })
  @ApiResponse({ status: 200, description: 'Connection test result' })
  async testConnection(@Param('id') id: string): Promise<{ success: boolean; message: string }> {
    return this.integrationService.testConnection(id);
  }

  @Post(':id/sync')
  @ApiOperation({ summary: 'Trigger manual synchronization' })
  @ApiParam({ name: 'id', description: 'Integration config ID' })
  @ApiResponse({ status: 200, description: 'Synchronization started' })
  async sync(@Param('id') id: string): Promise<any> {
    return this.integrationService.sync(id);
  }

  @Get(':id/sync-history')
  @ApiOperation({ summary: 'Get synchronization history' })
  @ApiParam({ name: 'id', description: 'Integration config ID' })
  @ApiResponse({ status: 200, description: 'List of sync logs' })
  async getSyncHistory(
    @Param('id') id: string,
    @Query('limit') limit?: number,
  ): Promise<any[]> {
    return this.integrationService.getSyncHistory(id, limit || 20);
  }

  private mapToResponseDto(config: any): IntegrationConfigResponseDto {
    return {
      id: config.id,
      name: config.name,
      integrationType: config.integrationType,
      endpointUrl: config.endpointUrl,
      authenticationType: config.authenticationType,
      fieldMapping: config.fieldMapping,
      syncInterval: config.syncInterval,
      status: config.status,
      lastSyncError: config.lastSyncError,
      lastSyncAt: config.lastSyncAt,
      nextSyncAt: config.nextSyncAt,
      createdById: config.createdById,
      createdByName: config.createdBy
        ? `${config.createdBy.firstName} ${config.createdBy.lastName}`
        : undefined,
      notes: config.notes,
      createdAt: config.createdAt,
      updatedAt: config.updatedAt,
    };
  }
}








