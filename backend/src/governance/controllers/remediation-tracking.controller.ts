import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RemediationTrackingService } from '../services/remediation-tracking.service';
import {
  RemediationTrackerDto,
  RemediationDashboardDto,
  CreateRemediationTrackerDto,
  UpdateRemediationTrackerDto,
  CompleteRemediationDto,
} from '../dto/remediation-tracker.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('governance')
@Controller('governance/remediation')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RemediationTrackingController {
  constructor(private readonly remediationService: RemediationTrackingService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get remediation tracking dashboard metrics' })
  @ApiResponse({
    status: 200,
    description: 'Remediation dashboard data',
    type: RemediationDashboardDto,
  })
  async getDashboard(): Promise<RemediationDashboardDto> {
    return this.remediationService.getDashboard();
  }

  @Post('finding/:findingId')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create remediation tracker for a finding' })
  @ApiResponse({
    status: 201,
    description: 'Remediation tracker created',
    type: RemediationTrackerDto,
  })
  async createTracker(
    @Param('findingId') findingId: string,
    @Body() data: CreateRemediationTrackerDto,
  ): Promise<RemediationTrackerDto> {
    return this.remediationService.createTracker(findingId, data);
  }

  @Put(':trackerId')
  @ApiOperation({ summary: 'Update remediation tracker progress' })
  @ApiResponse({
    status: 200,
    description: 'Tracker updated',
    type: RemediationTrackerDto,
  })
  async updateTracker(
    @Param('trackerId') trackerId: string,
    @Body() data: UpdateRemediationTrackerDto,
  ): Promise<RemediationTrackerDto> {
    return this.remediationService.updateTracker(trackerId, data);
  }

  @Patch(':trackerId/complete')
  @ApiOperation({ summary: 'Mark remediation as complete' })
  @ApiResponse({
    status: 200,
    description: 'Remediation marked complete',
    type: RemediationTrackerDto,
  })
  async completeRemediation(
    @Param('trackerId') trackerId: string,
    @Body() data: CompleteRemediationDto,
  ): Promise<RemediationTrackerDto> {
    return this.remediationService.completeRemediation(trackerId, data);
  }

  @Get('finding/:findingId/trackers')
  @ApiOperation({ summary: 'Get remediation trackers for a finding' })
  @ApiResponse({
    status: 200,
    description: 'List of remediation trackers',
    type: [RemediationTrackerDto],
  })
  async getTrackersByFinding(
    @Param('findingId') findingId: string,
  ): Promise<RemediationTrackerDto[]> {
    return this.remediationService.getTrackersByFinding(findingId);
  }
}
