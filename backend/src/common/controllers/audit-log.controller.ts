import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  Post,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuditLogService } from '../services/audit-log.service';
import { CreateAuditLogDto, AuditLogResponseDto, AuditLogSummaryDto } from '../dto/audit-log.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';

/**
 * AuditLogController: API endpoints for audit log management
 * Used by governance and compliance modules to track system operations
 */
@ApiTags('Audit Logs')
@Controller('audit-logs')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT')
export class AuditLogController {
  constructor(private readonly auditLogService: AuditLogService) {}

  /**
   * Get audit logs for a specific entity
   */
  @Get('entity/:entityType/:entityId')
  @ApiOperation({ summary: 'Get audit logs for an entity' })
  async getEntityLogs(
    @Param('entityType') entityType: string,
    @Param('entityId') entityId: string,
    @Query('limit') limit: string = '100',
  ) {
    const logs = await this.auditLogService.getEntityLogs(entityType, entityId, parseInt(limit));
    return logs.map(log => this.toResponseDto(log));
  }

  /**
   * Get audit logs for a specific user
   */
  @Get('user/:userId')
  @ApiOperation({ summary: 'Get audit logs for a user' })
  async getUserLogs(
    @Param('userId') userId: string,
    @Query('limit') limit: string = '100',
  ) {
    const logs = await this.auditLogService.getUserLogs(userId, parseInt(limit));
    return logs.map(log => this.toResponseDto(log));
  }

  /**
   * Get audit logs for a specific action
   */
  @Get('action/:action')
  @ApiOperation({ summary: 'Get audit logs for an action' })
  async getActionLogs(
    @Param('action') action: string,
    @Query('limit') limit: string = '100',
  ) {
    const logs = await this.auditLogService.getActionLogs(action, parseInt(limit));
    return logs.map(log => this.toResponseDto(log));
  }

  /**
   * Search audit logs
   */
  @Get('search')
  @ApiOperation({ summary: 'Search audit logs' })
  async search(
    @Query('q') query: string,
    @Query('limit') limit: string = '100',
  ) {
    if (!query || query.length < 2) {
      throw new BadRequestException('Search query must be at least 2 characters');
    }
    const logs = await this.auditLogService.search(query, parseInt(limit));
    return logs.map(log => this.toResponseDto(log));
  }

  /**
   * Get all audit logs with pagination
   */
  @Get()
  @ApiOperation({ summary: 'Get all audit logs (paginated)' })
  async getAllLogs(
    @Query('skip') skip: string = '0',
    @Query('take') take: string = '50',
  ) {
    const { logs, total } = await this.auditLogService.getAllLogs(parseInt(skip), parseInt(take));
    return {
      data: logs.map(log => this.toResponseDto(log)),
      total,
      skip: parseInt(skip),
      take: parseInt(take),
    };
  }

  /**
   * Get audit log summary statistics
   */
  @Get('summary/stats')
  @ApiOperation({ summary: 'Get audit log summary statistics' })
  async getSummary(): Promise<AuditLogSummaryDto> {
    return this.auditLogService.getSummary();
  }

  /**
   * Export audit logs as CSV
   */
  @Get('export/csv')
  @ApiOperation({ summary: 'Export audit logs as CSV' })
  async exportCsv(
    @Query('entityType') entityType?: string,
    @Query('entityId') entityId?: string,
  ) {
    const csv = await this.auditLogService.exportToCSV(entityType, entityId);
    return {
      contentType: 'text/csv',
      content: csv,
      filename: `audit-logs-${new Date().toISOString().split('T')[0]}.csv`,
    };
  }

  /**
   * Create an audit log entry (internal use)
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create an audit log entry' })
  async create(
    @Body() dto: CreateAuditLogDto,
    @CurrentUser() user,
  ): Promise<AuditLogResponseDto> {
    // Override userId to ensure user is creating logs for themselves or with proper authorization
    const auditLog = await this.auditLogService.log(dto);
    return this.toResponseDto(auditLog);
  }

  /**
   * Get audit trail for related entities
   */
  @Get('trail/:entityType')
  @ApiOperation({ summary: 'Get audit trail for related entities' })
  async getEntityTrail(
    @Param('entityType') entityType: string,
    @Query('entityIds') entityIds: string,
    @Query('limit') limit: string = '100',
  ) {
    if (!entityIds) {
      throw new BadRequestException('entityIds query parameter is required');
    }
    const ids = entityIds.split(',').map(id => id.trim());
    const logs = await this.auditLogService.getEntityTrail(entityType, ids, parseInt(limit));
    return logs.map(log => this.toResponseDto(log));
  }

  /**
   * Convert AuditLog entity to response DTO
   */
  private toResponseDto(auditLog: any): AuditLogResponseDto {
    return {
      id: auditLog.id,
      userId: auditLog.userId,
      action: auditLog.action,
      entityType: auditLog.entityType,
      entityId: auditLog.entityId,
      description: auditLog.description,
      changes: auditLog.changes,
      metadata: auditLog.metadata,
      ipAddress: auditLog.ipAddress,
      userAgent: auditLog.userAgent,
      timestamp: auditLog.timestamp.toISOString(),
    };
  }
}
