import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpStatus,
  HttpCode,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { AlertingService } from '../services/alerting.service';
import { AlertRuleService } from '../services/alert-rule.service';
import {
  CreateAlertDto,
  CreateAlertRuleDto,
  UpdateAlertRuleDto,
  AlertDto,
  AlertRuleDto,
} from '../dto/alert.dto';
import { AlertSeverity, AlertStatus, AlertType } from '../entities/alert.entity';

@ApiTags('Alerting')
@Controller('governance/alerting')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AlertingController {
  constructor(
    private readonly alertingService: AlertingService,
    private readonly alertRuleService: AlertRuleService,
  ) {}

  // ============================================================================
  // ALERT MANAGEMENT ENDPOINTS
  // ============================================================================

  @Post('alerts')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new alert' })
  @ApiResponse({ status: 201, description: 'Alert created successfully', type: AlertDto })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async createAlert(@Body() dto: CreateAlertDto, @Request() req): Promise<AlertDto> {
    return this.alertingService.createAlert(dto, req.user.id);
  }

  @Get('alerts')
  @ApiOperation({ summary: 'Get all alerts with pagination and filtering' })
  @ApiQuery({ name: 'status', enum: AlertStatus, required: false })
  @ApiQuery({ name: 'severity', enum: AlertSeverity, required: false })
  @ApiQuery({ name: 'type', enum: AlertType, required: false })
  @ApiQuery({ name: 'search', type: String, required: false })
  @ApiQuery({ name: 'page', type: Number, required: false, description: 'Default: 1' })
  @ApiQuery({ name: 'limit', type: Number, required: false, description: 'Default: 10' })
  @ApiResponse({ status: 200, description: 'Alerts retrieved successfully' })
  async getAlerts(
    @Query('status') status?: AlertStatus,
    @Query('severity') severity?: AlertSeverity,
    @Query('type') type?: AlertType,
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ): Promise<{ alerts: AlertDto[]; total: number }> {
    return this.alertingService.getAlerts({
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 10,
      status,
      severity,
      type,
      search,
    });
  }

  @Get('alerts/:id')
  @ApiOperation({ summary: 'Get alert by ID' })
  @ApiParam({ name: 'id', description: 'Alert ID' })
  @ApiResponse({ status: 200, description: 'Alert retrieved successfully', type: AlertDto })
  @ApiResponse({ status: 404, description: 'Alert not found' })
  async getAlert(@Param('id') id: string): Promise<AlertDto> {
    return this.alertingService.getAlert(id);
  }

  @Get('alerts/recent/critical')
  @ApiOperation({ summary: 'Get recent critical alerts for widget' })
  @ApiQuery({ name: 'limit', type: Number, required: false, description: 'Default: 5' })
  @ApiResponse({ status: 200, description: 'Recent critical alerts retrieved' })
  async getRecentCriticalAlerts(@Query('limit') limit?: string): Promise<AlertDto[]> {
    const limitNum = limit ? parseInt(limit, 10) : 5;
    return this.alertingService.getRecentCriticalAlerts(limitNum);
  }

  @Put('alerts/:id/acknowledge')
  @ApiOperation({ summary: 'Acknowledge an alert' })
  @ApiParam({ name: 'id', description: 'Alert ID' })
  @ApiResponse({ status: 200, description: 'Alert acknowledged successfully', type: AlertDto })
  @ApiResponse({ status: 404, description: 'Alert not found' })
  @ApiResponse({ status: 400, description: 'Cannot acknowledge alert in this state' })
  async acknowledgeAlert(@Param('id') id: string, @Request() req): Promise<AlertDto> {
    return this.alertingService.acknowledgeAlert(id, req.user.id);
  }

  @Put('alerts/:id/resolve')
  @ApiOperation({ summary: 'Resolve an alert' })
  @ApiParam({ name: 'id', description: 'Alert ID' })
  @ApiResponse({ status: 200, description: 'Alert resolved successfully', type: AlertDto })
  @ApiResponse({ status: 404, description: 'Alert not found' })
  @ApiResponse({ status: 400, description: 'Cannot resolve alert in this state' })
  async resolveAlert(
    @Param('id') id: string,
    @Body() body: { resolutionNotes?: string },
    @Request() req,
  ): Promise<AlertDto> {
    return this.alertingService.resolveAlert(id, req.user.id, body.resolutionNotes);
  }

  @Put('alerts/:id/dismiss')
  @ApiOperation({ summary: 'Dismiss an alert' })
  @ApiParam({ name: 'id', description: 'Alert ID' })
  @ApiResponse({ status: 200, description: 'Alert dismissed successfully', type: AlertDto })
  @ApiResponse({ status: 404, description: 'Alert not found' })
  async dismissAlert(@Param('id') id: string): Promise<AlertDto> {
    return this.alertingService.dismissAlert(id);
  }

  @Put('alerts/acknowledge/all')
  @ApiOperation({ summary: 'Mark all active alerts as acknowledged' })
  @ApiResponse({ status: 200, description: 'All alerts acknowledged' })
  async markAllAlertsAsAcknowledged(@Request() req): Promise<{ updated: number }> {
    return this.alertingService.markAllAlertsAsAcknowledged(req.user.id);
  }

  @Delete('alerts/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete an alert permanently' })
  @ApiParam({ name: 'id', description: 'Alert ID' })
  @ApiResponse({ status: 200, description: 'Alert deleted successfully' })
  @ApiResponse({ status: 404, description: 'Alert not found' })
  async deleteAlert(@Param('id') id: string): Promise<{ deleted: boolean }> {
    return this.alertingService.deleteAlert(id);
  }

  @Get('alerts/statistics/summary')
  @ApiOperation({ summary: 'Get alert statistics' })
  @ApiResponse({ status: 200, description: 'Statistics retrieved successfully' })
  async getAlertStatistics(): Promise<any> {
    return this.alertingService.getAlertStatistics();
  }

  // ============================================================================
  // ALERT RULE MANAGEMENT ENDPOINTS
  // ============================================================================

  @Post('rules')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new alert rule' })
  @ApiResponse({ status: 201, description: 'Alert rule created successfully', type: AlertRuleDto })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async createAlertRule(@Body() dto: CreateAlertRuleDto, @Request() req): Promise<AlertRuleDto> {
    return this.alertingService.createAlertRule(dto, req.user.id);
  }

  @Get('rules')
  @ApiOperation({ summary: 'Get alert rules with filtering' })
  @ApiQuery({ name: 'search', type: String, required: false })
  @ApiQuery({ name: 'page', type: Number, required: false, description: 'Default: 1' })
  @ApiQuery({ name: 'limit', type: Number, required: false, description: 'Default: 10' })
  @ApiResponse({ status: 200, description: 'Alert rules retrieved successfully' })
  async getAlertRules(
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ): Promise<{ rules: AlertRuleDto[]; total: number }> {
    return this.alertingService.getAlertRules({
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 10,
      search,
    });
  }

  @Get('rules/:id')
  @ApiOperation({ summary: 'Get alert rule by ID' })
  @ApiParam({ name: 'id', description: 'Alert rule ID' })
  @ApiResponse({ status: 200, description: 'Alert rule retrieved successfully', type: AlertRuleDto })
  @ApiResponse({ status: 404, description: 'Alert rule not found' })
  async getAlertRule(@Param('id') id: string): Promise<AlertRuleDto> {
    return this.alertingService.getAlertRule(id);
  }

  @Put('rules/:id')
  @ApiOperation({ summary: 'Update an alert rule' })
  @ApiParam({ name: 'id', description: 'Alert rule ID' })
  @ApiResponse({ status: 200, description: 'Alert rule updated successfully', type: AlertRuleDto })
  @ApiResponse({ status: 404, description: 'Alert rule not found' })
  async updateAlertRule(
    @Param('id') id: string,
    @Body() dto: UpdateAlertRuleDto,
  ): Promise<AlertRuleDto> {
    return this.alertingService.updateAlertRule(id, dto);
  }

  @Put('rules/:id/toggle')
  @ApiOperation({ summary: 'Toggle alert rule active status' })
  @ApiParam({ name: 'id', description: 'Alert rule ID' })
  @ApiResponse({ status: 200, description: 'Alert rule toggled successfully', type: AlertRuleDto })
  @ApiResponse({ status: 404, description: 'Alert rule not found' })
  async toggleAlertRule(
    @Param('id') id: string,
    @Body() body: { isActive: boolean },
  ): Promise<AlertRuleDto> {
    return this.alertingService.toggleAlertRule(id, body.isActive);
  }

  @Delete('rules/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete an alert rule' })
  @ApiParam({ name: 'id', description: 'Alert rule ID' })
  @ApiResponse({ status: 200, description: 'Alert rule deleted successfully' })
  @ApiResponse({ status: 404, description: 'Alert rule not found' })
  async deleteAlertRule(@Param('id') id: string): Promise<{ deleted: boolean }> {
    return this.alertingService.deleteAlertRule(id);
  }

  @Post('rules/:id/test')
  @ApiOperation({ summary: 'Test alert rule matching logic' })
  @ApiParam({ name: 'id', description: 'Alert rule ID' })
  @ApiResponse({ status: 200, description: 'Test results retrieved' })
  @ApiResponse({ status: 404, description: 'Alert rule not found' })
  async testAlertRule(@Param('id') id: string): Promise<any> {
    return this.alertingService.testAlertRule(id);
  }

  @Get('rules/statistics/summary')
  @ApiOperation({ summary: 'Get alert rule statistics' })
  @ApiResponse({ status: 200, description: 'Statistics retrieved successfully' })
  async getAlertRuleStatistics(): Promise<any> {
    return this.alertingService.getAlertRuleStatistics();
  }
}