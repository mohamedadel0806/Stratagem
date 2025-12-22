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
import { SOPVersionsService } from '../services/sop-versions.service';
import {
  CreateSOPVersionDto,
  UpdateSOPVersionDto,
  ApproveSOPVersionDto,
  SOPVersionQueryDto,
} from '../dto/sop-version.dto';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Audit } from '../../../common/decorators/audit.decorator';
import { AuditAction } from '../../../common/entities/audit-log.entity';

@ApiTags('Governance - SOP Versions')
@Controller('governance/sops/versions')
@UseGuards(JwtAuthGuard)
export class SOPVersionsController {
  constructor(private readonly versionsService: SOPVersionsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new SOP version' })
  @ApiResponse({ status: 201, description: 'Version created successfully' })
  @Audit(AuditAction.CREATE, 'SOP_VERSION')
  create(@Body() createDto: CreateSOPVersionDto, @Request() req) {
    return this.versionsService.create(createDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all SOP versions' })
  @ApiResponse({ status: 200, description: 'List of versions' })
  findAll(@Query() queryDto: SOPVersionQueryDto) {
    return this.versionsService.findAll(queryDto);
  }

  @Get('sop/:sop_id/history')
  @ApiOperation({ summary: 'Get version history for a SOP' })
  @ApiResponse({ status: 200, description: 'Version history' })
  getHistory(@Param('sop_id') sopId: string) {
    return this.versionsService.getVersionHistory(sopId);
  }

  @Get('sop/:sop_id/latest')
  @ApiOperation({ summary: 'Get latest published version of a SOP' })
  @ApiResponse({ status: 200, description: 'Latest version' })
  getLatest(@Param('sop_id') sopId: string) {
    return this.versionsService.getLatestVersion(sopId);
  }

  @Get('pending-approval')
  @ApiOperation({ summary: 'Get versions pending approval' })
  @ApiResponse({ status: 200, description: 'Pending versions' })
  getPending() {
    return this.versionsService.getPendingApprovals();
  }

  @Get('sop/:sop_id/retraining')
  @ApiOperation({ summary: 'Get versions requiring retraining for a SOP' })
  @ApiResponse({ status: 200, description: 'Versions requiring retraining' })
  getRetrainingVersions(@Param('sop_id') sopId: string) {
    return this.versionsService.getVersionsRequiringRetraining(sopId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a version by ID' })
  @ApiResponse({ status: 200, description: 'Version details' })
  findOne(@Param('id') id: string) {
    return this.versionsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a version (draft only)' })
  @ApiResponse({ status: 200, description: 'Version updated successfully' })
  @Audit(AuditAction.UPDATE, 'SOP_VERSION')
  update(@Param('id') id: string, @Body() updateDto: UpdateSOPVersionDto, @Request() req) {
    return this.versionsService.update(id, updateDto, req.user.id);
  }

  @Post(':id/submit-approval')
  @ApiOperation({ summary: 'Submit version for approval' })
  @ApiResponse({ status: 200, description: 'Version submitted successfully' })
  @Audit(AuditAction.UPDATE, 'SOP_VERSION')
  submitApproval(@Param('id') id: string, @Request() req) {
    return this.versionsService.submitForApproval(id, req.user.id);
  }

  @Post(':id/approve')
  @ApiOperation({ summary: 'Approve or reject a version' })
  @ApiResponse({ status: 200, description: 'Version approval processed' })
  @Audit(AuditAction.UPDATE, 'SOP_VERSION')
  approve(@Param('id') id: string, @Body() approveDto: ApproveSOPVersionDto, @Request() req) {
    return this.versionsService.approve(id, approveDto, req.user.id);
  }

  @Post(':id/publish')
  @ApiOperation({ summary: 'Publish an approved version' })
  @ApiResponse({ status: 200, description: 'Version published successfully' })
  @Audit(AuditAction.PUBLISH, 'SOP_VERSION')
  publish(@Param('id') id: string, @Request() req) {
    return this.versionsService.publish(id, req.user.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a version (draft only)' })
  @ApiResponse({ status: 204, description: 'Version deleted successfully' })
  @Audit(AuditAction.DELETE, 'SOP_VERSION')
  remove(@Param('id') id: string) {
    return this.versionsService.remove(id);
  }
}
