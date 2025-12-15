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
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RiskService } from '../services/risk.service';
import { CreateRiskDto } from '../dto/create-risk.dto';
import { UpdateRiskDto } from '../dto/update-risk.dto';
import { RiskQueryDto } from '../dto/risk-query.dto';
import { BulkUpdateRiskDto } from '../dto/bulk-update-risk.dto';

@ApiTags('Risks')
@Controller('risks')
@UseGuards(JwtAuthGuard)
export class RiskController {
  constructor(private readonly riskService: RiskService) {}

  @Get()
  @ApiOperation({ summary: 'Get all risks with filtering and pagination' })
  async findAll(@Query() query: RiskQueryDto) {
    return this.riskService.findAll(query);
  }

  @Get('heatmap')
  @ApiOperation({ summary: 'Get risk heatmap data' })
  async getHeatmap() {
    return this.riskService.getHeatmapData();
  }

  @Get('dashboard/summary')
  @ApiOperation({ summary: 'Get risk dashboard summary including appetite analysis' })
  async getDashboardSummary(@Request() req: any) {
    return this.riskService.getDashboardSummary(req.user?.organizationId);
  }

  @Get('dashboard/top')
  @ApiOperation({ summary: 'Get top risks by score' })
  async getTopRisks(@Query('limit') limit?: number) {
    return this.riskService.getTopRisks(limit || 10);
  }

  @Get('dashboard/review-due')
  @ApiOperation({ summary: 'Get risks due for review' })
  async getRisksNeedingReview(@Query('days') days?: number) {
    return this.riskService.getRisksNeedingReview(days || 7);
  }

  @Get('exceeding-appetite')
  @ApiOperation({ summary: 'Get risks exceeding the organization risk appetite threshold' })
  @ApiResponse({ status: 200, description: 'List of risks exceeding risk appetite' })
  async getRisksExceedingAppetite(@Request() req: any) {
    return this.riskService.getRisksExceedingAppetite(req.user?.organizationId);
  }

  @Get('check-appetite/:score')
  @ApiOperation({ summary: 'Check if a risk score exceeds the organization risk appetite' })
  @ApiResponse({ status: 200, description: 'Risk appetite check result' })
  async checkRiskAppetite(
    @Param('score') score: number,
    @Request() req: any,
  ) {
    return this.riskService.checkRiskAppetite(Number(score), req.user?.organizationId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single risk by ID with appetite warnings' })
  async findOne(@Param('id', ParseUUIDPipe) id: string, @Request() req: any) {
    return this.riskService.findOne(id, req.user?.organizationId);
  }

  @Post()
  async create(@Body() createRiskDto: CreateRiskDto, @Request() req: any) {
    return this.riskService.create(createRiskDto, req.user?.userId || req.user?.id, req.user?.organizationId);
  }

  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateRiskDto: UpdateRiskDto,
    @Request() req: any,
  ) {
    return this.riskService.update(id, updateRiskDto, req.user?.id);
  }

  @Patch('bulk-update')
  async bulkUpdateStatus(@Body() bulkUpdateDto: BulkUpdateRiskDto) {
    return this.riskService.bulkUpdateStatus(bulkUpdateDto.ids, bulkUpdateDto.status);
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.riskService.remove(id);
    return { message: 'Risk deleted successfully' };
  }
}
