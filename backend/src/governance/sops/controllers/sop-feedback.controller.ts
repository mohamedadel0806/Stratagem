import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { SOPFeedbackService } from '../services/sop-feedback.service';
import {
  CreateSOPFeedbackDto,
  UpdateSOPFeedbackDto,
  SOPFeedbackQueryDto,
} from '../dto/sop-feedback.dto';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Audit } from '../../../common/decorators/audit.decorator';
import { AuditAction } from '../../../common/entities/audit-log.entity';

@ApiTags('Governance - SOP Feedback')
@Controller('governance/sops/feedback')
@UseGuards(JwtAuthGuard)
export class SOPFeedbackController {
  constructor(private readonly feedbackService: SOPFeedbackService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create SOP feedback' })
  @ApiResponse({ status: 201, description: 'Feedback created successfully' })
  @Audit(AuditAction.CREATE, 'SOP_FEEDBACK')
  create(@Body() createDto: CreateSOPFeedbackDto, @Request() req) {
    return this.feedbackService.create(createDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all SOP feedback' })
  @ApiResponse({ status: 200, description: 'List of feedback' })
  findAll(@Query() queryDto: SOPFeedbackQueryDto) {
    return this.feedbackService.findAll(queryDto);
  }

  @Get('sop/:sop_id')
  @ApiOperation({ summary: 'Get feedback for a specific SOP' })
  @ApiResponse({ status: 200, description: 'SOP feedback' })
  getFeedbackForSOP(@Param('sop_id') sopId: string) {
    return this.feedbackService.getFeedbackForSOP(sopId);
  }

  @Get('sop/:sop_id/metrics')
  @ApiOperation({ summary: 'Get feedback metrics for a SOP' })
  @ApiResponse({ status: 200, description: 'Feedback metrics' })
  getMetrics(@Param('sop_id') sopId: string) {
    return this.feedbackService.getSOPFeedbackMetrics(sopId);
  }

  @Get('negative')
  @ApiOperation({ summary: 'Get negative feedback' })
  @ApiResponse({ status: 200, description: 'List of negative feedback' })
  getNegative() {
    return this.feedbackService.getNegativeFeedback();
  }

  @Get('follow-up')
  @ApiOperation({ summary: 'Get feedback requiring follow-up' })
  @ApiResponse({ status: 200, description: 'Feedback requiring follow-up' })
  getFollowUp() {
    return this.feedbackService.getFeedbackNeedingFollowUp();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get feedback by ID' })
  @ApiResponse({ status: 200, description: 'Feedback details' })
  findOne(@Param('id') id: string) {
    return this.feedbackService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update feedback' })
  @ApiResponse({ status: 200, description: 'Feedback updated successfully' })
  @Audit(AuditAction.UPDATE, 'SOP_FEEDBACK')
  update(@Param('id') id: string, @Body() updateDto: UpdateSOPFeedbackDto, @Request() req) {
    return this.feedbackService.update(id, updateDto, req.user.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete feedback' })
  @ApiResponse({ status: 204, description: 'Feedback deleted successfully' })
  @Audit(AuditAction.DELETE, 'SOP_FEEDBACK')
  remove(@Param('id') id: string) {
    return this.feedbackService.remove(id);
  }
}
