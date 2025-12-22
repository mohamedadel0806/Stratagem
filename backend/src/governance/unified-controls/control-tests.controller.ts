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
import { ControlTestsService } from './services/control-tests.service';
import { CreateControlTestDto } from './dto/create-control-test.dto';
import { ControlTestQueryDto } from './dto/control-test-query.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Audit } from '../../common/decorators/audit.decorator';
import { AuditAction } from '../../common/entities/audit-log.entity';

@ApiTags('Governance - Control Testing')
@Controller('governance/control-tests')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ControlTestsController {
  constructor(private readonly testsService: ControlTestsService) { }

  @Post()
  @ApiOperation({ summary: 'Record or schedule a control test' })
  @Audit(AuditAction.CREATE, 'ControlTest')
  create(@Body() dto: CreateControlTestDto, @Request() req) {
    return this.testsService.create(dto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all control tests with filtering' })
  findAll(@Query() query: ControlTestQueryDto) {
    return this.testsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get control test by ID' })
  findOne(@Param('id') id: string) {
    return this.testsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update control test' })
  @Audit(AuditAction.UPDATE, 'ControlTest')
  update(@Param('id') id: string, @Body() dto: Partial<CreateControlTestDto>, @Request() req) {
    return this.testsService.update(id, dto, req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete control test' })
  @Audit(AuditAction.DELETE, 'ControlTest')
  remove(@Param('id') id: string) {
    return this.testsService.remove(id);
  }
}


