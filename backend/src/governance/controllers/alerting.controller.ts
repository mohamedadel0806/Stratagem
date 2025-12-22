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
import { AlertingService, CreateAlertDto, CreateAlertRuleDto, CreateAlertSubscriptionDto } from '../services/alerting.service';
import { Alert, AlertSeverity, AlertStatus, AlertType } from '../entities/alert.entity';
import { AlertRule, AlertRuleTriggerType, AlertRuleCondition } from '../entities/alert-rule.entity';
import { AlertSubscription, NotificationChannel, NotificationFrequency } from '../entities/alert-subscription.entity';
import { AlertLog } from '../entities/alert-log.entity';

@ApiTags('Alerting')
@Controller('governance/alerting')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AlertingController {
  constructor(private readonly alertingService: AlertingService) {}

  // Alert Management Endpoints
  @Post('alerts')
  @ApiOperation({ summary: 'Create a new alert' })
  @ApiResponse({ status: 201, description: 'Alert created successfully', type: Alert })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async createAlert(@Body() dto: CreateAlertDto, @Request() req): Promise<Alert> {
    return this.alertingService.createAlert(dto, req.user.id);
  }

  @Get('alerts')
  @ApiOperation({ summary: 'Get alerts with optional filtering' })
  @ApiQuery({ name: 'status', enum: AlertStatus, required: false })
  @ApiQuery({ name: 'severity', enum: AlertSeverity, required: false })
  @ApiQuery({ name: 'limit', type: Number, required: false, description: 'Default: 50' })
  @ApiQuery({ name: 'offset', type: Number, required: false, description: 'Default: 0' })
  @ApiResponse({ status: 200, description: 'Alerts retrieved successfully' })
  async getAlerts(
    @Query('status') status?: AlertStatus,
    @Query('severity') severity?: AlertSeverity,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ): Promise<{ alerts: Alert[]; total: number }> {
    const limitNum = limit ? parseInt(limit, 10) : 50;
    const offsetNum = offset ? parseInt(offset, 10) : 0;
    const [alerts, total] = await this.alertingService.getAlerts(status, severity, limitNum, offsetNum);
    return { alerts, total };
  }

  @Get('alerts/:id')
  @ApiOperation({ summary: 'Get alert by ID' })
  @ApiParam({ name: 'id', description: 'Alert ID' })
  @ApiResponse({ status: 200, description: 'Alert retrieved successfully', type: Alert })
  @ApiResponse({ status: 404, description: 'Alert not found' })
  async getAlertById(@Param('id') id: string): Promise<Alert> {
    return this.alertingService.getAlertById(id);
  }

  @Put('alerts/:id/acknowledge')
  @ApiOperation({ summary: 'Acknowledge an alert' })
  @ApiParam({ name: 'id', description: 'Alert ID' })
  @ApiResponse({ status: 200, description: 'Alert acknowledged successfully', type: Alert })
  @ApiResponse({ status: 404, description: 'Alert not found' })
  async acknowledgeAlert(@Param('id') id: string, @Request() req): Promise<Alert> {
    return this.alertingService.acknowledgeAlert(id, req.user.id);
  }

  @Put('alerts/:id/resolve')
  @ApiOperation({ summary: 'Resolve an alert' })
  @ApiParam({ name: 'id', description: 'Alert ID' })
  @ApiResponse({ status: 200, description: 'Alert resolved successfully', type: Alert })
  @ApiResponse({ status: 404, description: 'Alert not found' })
  async resolveAlert(
    @Param('id') id: string,
    @Body() body: { resolution?: string },
    @Request() req,
  ): Promise<Alert> {
    return this.alertingService.resolveAlert(id, req.user.id, body.resolution);
  }

  // Alert Rule Management Endpoints
  @Post('rules')
  @ApiOperation({ summary: 'Create a new alert rule' })
  @ApiResponse({ status: 201, description: 'Alert rule created successfully', type: AlertRule })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async createAlertRule(@Body() dto: CreateAlertRuleDto): Promise<AlertRule> {
    return this.alertingService.createAlertRule(dto);
  }

  @Get('rules')
  @ApiOperation({ summary: 'Get alert rules' })
  @ApiQuery({ name: 'enabled', type: Boolean, required: false })
  @ApiResponse({ status: 200, description: 'Alert rules retrieved successfully', type: [AlertRule] })
  async getAlertRules(@Query('isActive') isActive?: boolean): Promise<AlertRule[]> {
    return this.alertingService.getAlertRules(isActive);
  }

  @Put('rules/:id')
  @ApiOperation({ summary: 'Update an alert rule' })
  @ApiParam({ name: 'id', description: 'Alert rule ID' })
  @ApiResponse({ status: 200, description: 'Alert rule updated successfully', type: AlertRule })
  @ApiResponse({ status: 404, description: 'Alert rule not found' })
  async updateAlertRule(@Param('id') id: string, @Body() dto: Partial<CreateAlertRuleDto>): Promise<AlertRule> {
    return this.alertingService.updateAlertRule(id, dto);
  }

  @Delete('rules/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an alert rule' })
  @ApiParam({ name: 'id', description: 'Alert rule ID' })
  @ApiResponse({ status: 204, description: 'Alert rule deleted successfully' })
  @ApiResponse({ status: 404, description: 'Alert rule not found' })
  async deleteAlertRule(@Param('id') id: string): Promise<void> {
    return this.alertingService.deleteAlertRule(id);
  }

  // Alert Subscription Management Endpoints
  @Post('subscriptions')
  @ApiOperation({ summary: 'Create a new alert subscription' })
  @ApiResponse({ status: 201, description: 'Alert subscription created successfully', type: AlertSubscription })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async createAlertSubscription(@Body() dto: CreateAlertSubscriptionDto): Promise<AlertSubscription> {
    return this.alertingService.createAlertSubscription(dto);
  }

  @Get('subscriptions/user/:userId')
  @ApiOperation({ summary: 'Get user alert subscriptions' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User subscriptions retrieved successfully', type: [AlertSubscription] })
  async getUserSubscriptions(@Param('userId') userId: string): Promise<AlertSubscription[]> {
    return this.alertingService.getUserSubscriptions(userId);
  }

  @Put('subscriptions/:id')
  @ApiOperation({ summary: 'Update an alert subscription' })
  @ApiParam({ name: 'id', description: 'Alert subscription ID' })
  @ApiResponse({ status: 200, description: 'Alert subscription updated successfully', type: AlertSubscription })
  @ApiResponse({ status: 404, description: 'Alert subscription not found' })
  async updateAlertSubscription(
    @Param('id') id: string,
    @Body() dto: Partial<CreateAlertSubscriptionDto>,
  ): Promise<AlertSubscription> {
    return this.alertingService.updateAlertSubscription(id, dto);
  }

  @Delete('subscriptions/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an alert subscription' })
  @ApiParam({ name: 'id', description: 'Alert subscription ID' })
  @ApiResponse({ status: 204, description: 'Alert subscription deleted successfully' })
  @ApiResponse({ status: 404, description: 'Alert subscription not found' })
  async deleteAlertSubscription(@Param('id') id: string): Promise<void> {
    return this.alertingService.deleteAlertSubscription(id);
  }

  // Alert Log Endpoints
  @Get('logs/alert/:alertId')
  @ApiOperation({ summary: 'Get alert logs for a specific alert' })
  @ApiParam({ name: 'alertId', description: 'Alert ID' })
  @ApiResponse({ status: 200, description: 'Alert logs retrieved successfully', type: [AlertLog] })
  async getAlertLogs(@Param('alertId') alertId: string): Promise<AlertLog[]> {
    // This would be implemented in the service
    return [];
  }

  // Manual Rule Evaluation
  @Post('rules/evaluate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Manually trigger alert rule evaluation' })
  @ApiResponse({ status: 200, description: 'Alert rule evaluation completed' })
  async evaluateAlertRules(): Promise<{ message: string }> {
    await this.alertingService.evaluateAlertRules();
    return { message: 'Alert rule evaluation completed' };
  }
}