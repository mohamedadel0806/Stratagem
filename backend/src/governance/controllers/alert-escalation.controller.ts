import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
  HttpStatus,
  HttpCode,
  Request,
  BadRequestException,
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
import { AlertEscalationService } from '../services/alert-escalation.service';
import {
  CreateEscalationChainDto,
  EscalationChainDto,
  EscalateAlertDto,
  ResolveEscalationChainDto,
  EscalationStatisticsDto,
} from '../dto/alert-escalation.dto';
import { AlertSeverity } from '../entities/alert.entity';

@ApiTags('Alert Escalation')
@Controller('governance/alert-escalation')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AlertEscalationController {
  constructor(private readonly escalationService: AlertEscalationService) {}

  // ============================================================================
  // ESCALATION CHAIN MANAGEMENT ENDPOINTS
  // ============================================================================

  /**
   * Create an escalation chain for an alert
   */
  @Post('chains')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create an escalation chain for an alert' })
  @ApiResponse({
    status: 201,
    description: 'Escalation chain created successfully',
    type: EscalationChainDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Alert not found' })
  async createEscalationChain(
    @Body() dto: CreateEscalationChainDto,
    @Request() req,
  ): Promise<EscalationChainDto> {
    return this.escalationService.createEscalationChain(dto, req.user.id);
  }

  /**
   * Get an escalation chain by ID
   */
  @Get('chains/:id')
  @ApiOperation({ summary: 'Get an escalation chain by ID' })
  @ApiParam({ name: 'id', description: 'Escalation chain ID' })
  @ApiResponse({
    status: 200,
    description: 'Escalation chain retrieved successfully',
    type: EscalationChainDto,
  })
  @ApiResponse({ status: 404, description: 'Escalation chain not found' })
  async getEscalationChain(@Param('id') id: string): Promise<EscalationChainDto> {
    return this.escalationService.getEscalationChain(id);
  }

  /**
   * Get escalation chains for an alert
   */
  @Get('alerts/:alertId/chains')
  @ApiOperation({ summary: 'Get all escalation chains for an alert' })
  @ApiParam({ name: 'alertId', description: 'Alert ID' })
  @ApiResponse({
    status: 200,
    description: 'Escalation chains retrieved successfully',
    type: [EscalationChainDto],
  })
  async getAlertEscalationChains(@Param('alertId') alertId: string): Promise<EscalationChainDto[]> {
    return this.escalationService.getAlertEscalationChains(alertId);
  }

  /**
   * Get all active escalation chains
   */
  @Get('chains/active')
  @ApiOperation({ summary: 'Get all active escalation chains' })
  @ApiResponse({
    status: 200,
    description: 'Active escalation chains retrieved successfully',
    type: [EscalationChainDto],
  })
  async getActiveEscalationChains(): Promise<EscalationChainDto[]> {
    return this.escalationService.getActiveEscalationChains();
  }

  /**
   * Get escalation chains by severity
   */
  @Get('severity/:severity')
  @ApiOperation({ summary: 'Get escalation chains by alert severity' })
  @ApiParam({ name: 'severity', enum: AlertSeverity, description: 'Alert severity level' })
  @ApiResponse({
    status: 200,
    description: 'Escalation chains retrieved successfully',
    type: [EscalationChainDto],
  })
  async getEscalationChainsBySeverity(@Param('severity') severity: AlertSeverity): Promise<EscalationChainDto[]> {
    if (!Object.values(AlertSeverity).includes(severity)) {
      throw new BadRequestException(`Invalid severity: ${severity}`);
    }
    return this.escalationService.getEscalationChainsBySeverity(severity);
  }

  /**
   * Escalate an alert to the next level
   */
  @Put('chains/:id/escalate')
  @ApiOperation({ summary: 'Escalate an alert to the next level' })
  @ApiParam({ name: 'id', description: 'Escalation chain ID' })
  @ApiResponse({
    status: 200,
    description: 'Alert escalated successfully',
    type: EscalationChainDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Escalation chain not found' })
  async escalateAlert(
    @Param('id') id: string,
    @Body() dto: EscalateAlertDto,
    @Request() req,
  ): Promise<EscalationChainDto> {
    return this.escalationService.escalateAlert(id, req.user.id);
  }

  /**
   * Resolve an escalation chain
   */
  @Put('chains/:id/resolve')
  @ApiOperation({ summary: 'Resolve an escalation chain' })
  @ApiParam({ name: 'id', description: 'Escalation chain ID' })
  @ApiResponse({
    status: 200,
    description: 'Escalation chain resolved successfully',
    type: EscalationChainDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Escalation chain not found' })
  async resolveEscalationChain(
    @Param('id') id: string,
    @Body() dto: ResolveEscalationChainDto,
    @Request() req,
  ): Promise<EscalationChainDto> {
    return this.escalationService.resolveEscalationChain(id, dto.resolutionNotes, req.user.id);
  }

  /**
   * Cancel an escalation chain
   */
  @Put('chains/:id/cancel')
  @ApiOperation({ summary: 'Cancel an escalation chain' })
  @ApiParam({ name: 'id', description: 'Escalation chain ID' })
  @ApiResponse({
    status: 200,
    description: 'Escalation chain cancelled successfully',
    type: EscalationChainDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Escalation chain not found' })
  async cancelEscalationChain(@Param('id') id: string, @Request() req): Promise<EscalationChainDto> {
    return this.escalationService.cancelEscalationChain(id, req.user.id);
  }

  /**
   * Get escalation statistics
   */
  @Get('statistics')
  @ApiOperation({ summary: 'Get escalation statistics' })
  @ApiResponse({
    status: 200,
    description: 'Escalation statistics retrieved successfully',
    type: EscalationStatisticsDto,
  })
  async getEscalationStatistics(): Promise<EscalationStatisticsDto> {
    return this.escalationService.getEscalationStatistics();
  }
}
