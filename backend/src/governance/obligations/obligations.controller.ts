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
import { ObligationsService } from './obligations.service';
import { CreateComplianceObligationDto } from './dto/create-obligation.dto';
import { ObligationQueryDto } from './dto/obligation-query.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Audit } from '../../common/decorators/audit.decorator';
import { AuditAction } from '../../common/entities/audit-log.entity';

@ApiTags('Governance - Obligations')
@Controller('governance/obligations')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ObligationsController {
  constructor(private readonly obligationsService: ObligationsService) { }

  @Post()
  @ApiOperation({ summary: 'Create a compliance obligation' })
  @Audit(AuditAction.CREATE, 'ComplianceObligation')
  create(@Body() dto: CreateComplianceObligationDto, @Request() req) {
    return this.obligationsService.create(dto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all obligations with filtering' })
  findAll(@Query() query: ObligationQueryDto) {
    return this.obligationsService.findAll(query);
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Get obligation statistics' })
  getStatistics() {
    return this.obligationsService.getStatistics();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get obligation by ID' })
  findOne(@Param('id') id: string) {
    return this.obligationsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update obligation' })
  @Audit(AuditAction.UPDATE, 'ComplianceObligation')
  update(@Param('id') id: string, @Body() dto: Partial<CreateComplianceObligationDto>, @Request() req) {
    return this.obligationsService.update(id, dto, req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete obligation' })
  @Audit(AuditAction.DELETE, 'ComplianceObligation')
  remove(@Param('id') id: string) {
    return this.obligationsService.remove(id);
  }
}


