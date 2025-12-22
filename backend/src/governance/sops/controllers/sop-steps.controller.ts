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
import { SOPStepsService } from '../services/sop-steps.service';
import { CreateSOPStepDto, UpdateSOPStepDto, SOPStepQueryDto } from '../dto/sop-step.dto';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Audit } from '../../../common/decorators/audit.decorator';
import { AuditAction } from '../../../common/entities/audit-log.entity';

@ApiTags('Governance - SOP Steps')
@Controller('governance/sops/steps')
@UseGuards(JwtAuthGuard)
export class SOPStepsController {
  constructor(private readonly stepsService: SOPStepsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new SOP step' })
  @ApiResponse({ status: 201, description: 'Step created successfully' })
  @Audit(AuditAction.CREATE, 'SOP_STEP')
  create(@Body() createDto: CreateSOPStepDto, @Request() req) {
    return this.stepsService.create(createDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all SOP steps' })
  @ApiResponse({ status: 200, description: 'List of steps' })
  findAll(@Query() queryDto: SOPStepQueryDto) {
    return this.stepsService.findAll(queryDto);
  }

  @Get('sop/:sop_id')
  @ApiOperation({ summary: 'Get steps for a specific SOP' })
  @ApiResponse({ status: 200, description: 'SOP steps' })
  getStepsForSOP(@Param('sop_id') sopId: string) {
    return this.stepsService.getStepsForSOP(sopId);
  }

  @Get('sop/:sop_id/critical')
  @ApiOperation({ summary: 'Get critical steps for a SOP' })
  @ApiResponse({ status: 200, description: 'Critical steps' })
  getCritical(@Param('sop_id') sopId: string) {
    return this.stepsService.getCriticalSteps(sopId);
  }

  @Get('sop/:sop_id/duration')
  @ApiOperation({ summary: 'Get total estimated duration for a SOP' })
  @ApiResponse({ status: 200, description: 'Total duration in minutes' })
  getTotalDuration(@Param('sop_id') sopId: string) {
    return this.stepsService.getTotalEstimatedDuration(sopId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a step by ID' })
  @ApiResponse({ status: 200, description: 'Step details' })
  findOne(@Param('id') id: string) {
    return this.stepsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a step' })
  @ApiResponse({ status: 200, description: 'Step updated successfully' })
  @Audit(AuditAction.UPDATE, 'SOP_STEP')
  update(@Param('id') id: string, @Body() updateDto: UpdateSOPStepDto, @Request() req) {
    return this.stepsService.update(id, updateDto, req.user.id);
  }

  @Post('sop/:sop_id/reorder')
  @ApiOperation({ summary: 'Reorder steps within a SOP' })
  @ApiResponse({ status: 200, description: 'Steps reordered successfully' })
  @Audit(AuditAction.UPDATE, 'SOP_STEP')
  reorder(
    @Param('sop_id') sopId: string,
    @Body() body: { step_ids: string[] },
    @Request() req,
  ) {
    return this.stepsService.reorderSteps(sopId, body.step_ids, req.user.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a step' })
  @ApiResponse({ status: 204, description: 'Step deleted successfully' })
  @Audit(AuditAction.DELETE, 'SOP_STEP')
  remove(@Param('id') id: string) {
    return this.stepsService.remove(id);
  }
}
