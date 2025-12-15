import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RiskAssessmentRequestService } from '../services/risk-assessment-request.service';
import { CreateRiskAssessmentRequestDto } from '../dto/request/create-risk-assessment-request.dto';
import { UpdateRiskAssessmentRequestDto } from '../dto/request/update-risk-assessment-request.dto';
import { RequestStatus } from '../entities/risk-assessment-request.entity';

@ApiTags('Risk Assessment Requests')
@Controller('risk-assessment-requests')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RiskAssessmentRequestController {
  constructor(private readonly requestService: RiskAssessmentRequestService) {}

  @Get()
  @ApiOperation({ summary: 'Get all assessment requests with optional filters' })
  @ApiResponse({ status: 200, description: 'List of assessment requests' })
  async findAll(
    @Query('riskId') riskId?: string,
    @Query('requestedById') requestedById?: string,
    @Query('requestedForId') requestedForId?: string,
    @Query('status') status?: RequestStatus,
    @Query('assessmentType') assessmentType?: string,
  ) {
    return this.requestService.findAll({
      riskId,
      requestedById,
      requestedForId,
      status,
      assessmentType,
    });
  }

  @Get('pending')
  @ApiOperation({ summary: 'Get pending requests for current user' })
  @ApiResponse({ status: 200, description: 'List of pending requests assigned to user' })
  async findPending(@Request() req: any) {
    return this.requestService.findPendingForUser(req.user?.id);
  }

  @Get('risk/:riskId')
  @ApiOperation({ summary: 'Get all requests for a specific risk' })
  @ApiResponse({ status: 200, description: 'List of assessment requests for the risk' })
  async findByRiskId(@Param('riskId', ParseUUIDPipe) riskId: string) {
    return this.requestService.findByRiskId(riskId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single assessment request by ID' })
  @ApiResponse({ status: 200, description: 'Assessment request details' })
  @ApiResponse({ status: 404, description: 'Request not found' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.requestService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new assessment request' })
  @ApiResponse({ status: 201, description: 'Assessment request created successfully' })
  @ApiResponse({ status: 404, description: 'Risk not found' })
  async create(@Body() createDto: CreateRiskAssessmentRequestDto, @Request() req: any) {
    return this.requestService.create(createDto, req.user?.userId || req.user?.id, req.user?.organizationId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an assessment request' })
  @ApiResponse({ status: 200, description: 'Assessment request updated successfully' })
  @ApiResponse({ status: 404, description: 'Request not found' })
  @ApiResponse({ status: 400, description: 'Invalid status transition' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateRiskAssessmentRequestDto,
    @Request() req: any,
  ) {
    return this.requestService.update(id, updateDto, req.user?.id);
  }

  @Patch(':id/approve')
  @ApiOperation({ summary: 'Approve an assessment request' })
  @ApiResponse({ status: 200, description: 'Request approved successfully' })
  async approve(@Param('id', ParseUUIDPipe) id: string, @Request() req: any) {
    return this.requestService.approve(id, req.user?.id);
  }

  @Patch(':id/reject')
  @ApiOperation({ summary: 'Reject an assessment request' })
  @ApiResponse({ status: 200, description: 'Request rejected successfully' })
  async reject(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('reason') reason: string,
    @Request() req: any,
  ) {
    return this.requestService.reject(id, req.user?.id, reason);
  }

  @Patch(':id/cancel')
  @ApiOperation({ summary: 'Cancel an assessment request' })
  @ApiResponse({ status: 200, description: 'Request cancelled successfully' })
  async cancel(@Param('id', ParseUUIDPipe) id: string, @Request() req: any) {
    return this.requestService.cancel(id, req.user?.id);
  }

  @Patch(':id/in-progress')
  @ApiOperation({ summary: 'Mark request as in progress' })
  @ApiResponse({ status: 200, description: 'Request marked as in progress' })
  async markInProgress(@Param('id', ParseUUIDPipe) id: string, @Request() req: any) {
    return this.requestService.markInProgress(id, req.user?.id);
  }

  @Patch(':id/complete')
  @ApiOperation({ summary: 'Complete a request and link to assessment' })
  @ApiResponse({ status: 200, description: 'Request completed and linked to assessment' })
  async complete(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('assessmentId') assessmentId: string,
    @Request() req: any,
  ) {
    return this.requestService.complete(id, assessmentId, req.user?.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an assessment request' })
  @ApiResponse({ status: 200, description: 'Request deleted successfully' })
  @ApiResponse({ status: 404, description: 'Request not found' })
  @ApiResponse({ status: 400, description: 'Cannot delete request in current status' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.requestService.remove(id);
    return { message: 'Assessment request deleted successfully' };
  }
}
