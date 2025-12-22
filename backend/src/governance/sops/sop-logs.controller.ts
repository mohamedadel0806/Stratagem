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
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { SOPLogsService } from './sop-logs.service';
import { CreateSOPLogDto } from './dto/create-sop-log.dto';
import { SOPLogQueryDto } from './dto/sop-log-query.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Audit } from '../../common/decorators/audit.decorator';
import { AuditAction } from '../../common/entities/audit-log.entity';

@ApiTags('Governance - SOP Logs')
@Controller('governance/sop-logs')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SOPLogsController {
  constructor(private readonly logsService: SOPLogsService) { }

  @Post()
  @ApiOperation({ summary: 'Record an SOP execution' })
  @Audit(AuditAction.CREATE, 'SOPLog')
  create(@Body() dto: CreateSOPLogDto, @Request() req) {
    return this.logsService.create(dto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all SOP execution logs' })
  findAll(@Query() query: SOPLogQueryDto) {
    return this.logsService.findAll(query);
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Get SOP execution statistics' })
  getStatistics() {
    return this.logsService.getStatistics();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get SOP log by ID' })
  findOne(@Param('id') id: string) {
    return this.logsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update SOP log' })
  @Audit(AuditAction.UPDATE, 'SOPLog')
  update(@Param('id') id: string, @Body() dto: Partial<CreateSOPLogDto>, @Request() req) {
    return this.logsService.update(id, dto, req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete SOP log' })
  @Audit(AuditAction.DELETE, 'SOPLog')
  remove(@Param('id') id: string) {
    return this.logsService.remove(id);
  }
}


