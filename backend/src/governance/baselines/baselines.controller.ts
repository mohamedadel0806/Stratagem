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
import { BaselinesService } from './baselines.service';
import { CreateSecureBaselineDto } from './dto/create-baseline.dto';
import { BaselineQueryDto } from './dto/baseline-query.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Audit } from '../../common/decorators/audit.decorator';
import { AuditAction } from '../../common/entities/audit-log.entity';

@ApiTags('Governance - Secure Baselines')
@Controller('governance/baselines')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class BaselinesController {
  constructor(private readonly baselinesService: BaselinesService) { }

  @Post()
  @ApiOperation({ summary: 'Create a secure baseline' })
  @Audit(AuditAction.CREATE, 'SecureBaseline')
  create(@Body() dto: CreateSecureBaselineDto, @Request() req) {
    return this.baselinesService.create(dto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all baselines with filtering' })
  findAll(@Query() query: BaselineQueryDto) {
    return this.baselinesService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get baseline by ID' })
  findOne(@Param('id') id: string) {
    return this.baselinesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update baseline' })
  @Audit(AuditAction.UPDATE, 'SecureBaseline')
  update(@Param('id') id: string, @Body() dto: Partial<CreateSecureBaselineDto>, @Request() req) {
    return this.baselinesService.update(id, dto, req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete baseline' })
  @Audit(AuditAction.DELETE, 'SecureBaseline')
  remove(@Param('id') id: string) {
    return this.baselinesService.remove(id);
  }
}


