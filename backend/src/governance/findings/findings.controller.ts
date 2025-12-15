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
import { FindingsService } from './findings.service';
import { CreateFindingDto } from './dto/create-finding.dto';
import { FindingQueryDto } from './dto/finding-query.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RiskFindingLinkService } from '../../risk/services/risk-finding-link.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';

@ApiTags('governance')
@Controller('api/v1/governance/findings')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class FindingsController {
  constructor(
    private readonly findingsService: FindingsService,
    private readonly riskFindingLinkService: RiskFindingLinkService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createDto: CreateFindingDto, @Request() req) {
    return this.findingsService.create(createDto, req.user.id);
  }

  @Get()
  findAll(@Query() queryDto: FindingQueryDto) {
    return this.findingsService.findAll(queryDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.findingsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: Partial<CreateFindingDto>, @Request() req) {
    return this.findingsService.update(id, updateDto, req.user.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.findingsService.remove(id);
  }

  // ================== Risk Integration Endpoints ==================

  @Get(':id/risks')
  @ApiOperation({ summary: 'Get all risks linked to this finding' })
  @ApiParam({ name: 'id', description: 'Finding ID' })
  @ApiResponse({ status: 200, description: 'List of linked risks' })
  getRisks(@Param('id') findingId: string) {
    return this.riskFindingLinkService.getRisksForFinding(findingId);
  }
}




