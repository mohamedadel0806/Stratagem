import { Controller, Get, Param, Query, UseGuards, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { AssetAuditService } from '../services/asset-audit.service';
import {
  AssetAuditLogResponseDto,
  AssetAuditLogQueryDto,
} from '../dto/asset-audit-log-response.dto';
import { AssetType } from '../entities/asset-audit-log.entity';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('assets')
@Controller('assets')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AssetAuditController {
  constructor(private readonly auditService: AssetAuditService) {}

  @Get(':type/:id/audit')
  @ApiOperation({ summary: 'Get audit trail for an asset' })
  @ApiParam({ name: 'type', description: 'Asset type', enum: AssetType })
  @ApiParam({ name: 'id', description: 'Asset ID' })
  @ApiResponse({
    status: 200,
    description: 'Audit trail retrieved successfully',
    type: [AssetAuditLogResponseDto],
  })
  @ApiResponse({ status: 400, description: 'Invalid request parameters' })
  @ApiResponse({ status: 404, description: 'Asset not found' })
  async getAuditTrail(
    @Param('type') type: string,
    @Param('id') id: string,
    @Query() query: AssetAuditLogQueryDto,
  ): Promise<{
    data: AssetAuditLogResponseDto[];
    total: number;
    page: number;
    limit: number;
  }> {
    // Validate and convert type to AssetType enum
    const assetType = this.validateAssetType(type);
    
    const result = await this.auditService.getAuditLogs(assetType, id, query);

    return {
      data: result.data.map((log) => ({
        id: log.id,
        assetType: log.assetType,
        assetId: log.assetId,
        action: log.action,
        fieldName: log.fieldName,
        oldValue: log.oldValue,
        newValue: log.newValue,
        changedBy: log.changedBy
          ? {
              id: log.changedBy.id,
              email: log.changedBy.email,
              firstName: log.changedBy.firstName,
              lastName: log.changedBy.lastName,
            }
          : undefined,
        changeReason: log.changeReason,
        createdAt: log.createdAt instanceof Date 
          ? log.createdAt.toISOString() 
          : new Date(log.createdAt).toISOString(),
      })),
      total: result.total,
      page: result.page,
      limit: result.limit,
    };
  }

  private validateAssetType(type: string): AssetType {
    const validTypes: Record<string, AssetType> = {
      physical: AssetType.PHYSICAL,
      information: AssetType.INFORMATION,
      application: AssetType.APPLICATION,
      software: AssetType.SOFTWARE,
      supplier: AssetType.SUPPLIER,
    };

    const assetType = validTypes[type.toLowerCase()];
    if (!assetType) {
      throw new BadRequestException(
        `Invalid asset type: ${type}. Valid types are: ${Object.keys(validTypes).join(', ')}`,
      );
    }
    return assetType;
  }
}

