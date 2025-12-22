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
import { SOPSchedulesService } from '../services/sop-schedules.service';
import {
  CreateSOPScheduleDto,
  UpdateSOPScheduleDto,
  SOPScheduleQueryDto,
} from '../dto/sop-schedule.dto';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Audit } from '../../../common/decorators/audit.decorator';
import { AuditAction } from '../../../common/entities/audit-log.entity';

@ApiTags('Governance - SOP Schedules')
@Controller('governance/sops/schedules')
@UseGuards(JwtAuthGuard)
export class SOPSchedulesController {
  constructor(private readonly schedulesService: SOPSchedulesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new SOP schedule' })
  @ApiResponse({ status: 201, description: 'Schedule created successfully' })
  @Audit(AuditAction.CREATE, 'SOP_SCHEDULE')
  create(@Body() createDto: CreateSOPScheduleDto, @Request() req) {
    return this.schedulesService.create(createDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all SOP schedules' })
  @ApiResponse({ status: 200, description: 'List of schedules' })
  findAll(@Query() queryDto: SOPScheduleQueryDto) {
    return this.schedulesService.findAll(queryDto);
  }

  @Get('due')
  @ApiOperation({ summary: 'Get due SOP schedules' })
  @ApiResponse({ status: 200, description: 'List of due schedules' })
  getDue() {
    return this.schedulesService.getDueSchedules();
  }

  @Get('sop/:sop_id')
  @ApiOperation({ summary: 'Get schedules for a specific SOP' })
  @ApiResponse({ status: 200, description: 'SOP schedules' })
  getBySOP(@Param('sop_id') sopId: string) {
    return this.schedulesService.getSchedulesBySOP(sopId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a schedule by ID' })
  @ApiResponse({ status: 200, description: 'Schedule details' })
  findOne(@Param('id') id: string) {
    return this.schedulesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a schedule' })
  @ApiResponse({ status: 200, description: 'Schedule updated successfully' })
  @Audit(AuditAction.UPDATE, 'SOP_SCHEDULE')
  update(@Param('id') id: string, @Body() updateDto: UpdateSOPScheduleDto, @Request() req) {
    return this.schedulesService.update(id, updateDto, req.user.id);
  }

  @Post(':id/mark-executed')
  @ApiOperation({ summary: 'Mark a schedule as executed' })
  @ApiResponse({ status: 200, description: 'Schedule marked as executed' })
  @Audit(AuditAction.UPDATE, 'SOP_SCHEDULE')
  markExecuted(@Param('id') id: string) {
    return this.schedulesService.markAsExecuted(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a schedule' })
  @ApiResponse({ status: 204, description: 'Schedule deleted successfully' })
  @Audit(AuditAction.DELETE, 'SOP_SCHEDULE')
  remove(@Param('id') id: string) {
    return this.schedulesService.remove(id);
  }
}
