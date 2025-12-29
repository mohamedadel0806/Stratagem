import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RiskAssessmentService } from '../services/risk-assessment.service';
import { CreateRiskAssessmentDto } from '../dto/assessment/create-risk-assessment.dto';
import { AssessmentType } from '../entities/risk-assessment.entity';

@ApiTags('Risk Assessments')
@Controller('risk-assessments')
@UseGuards(JwtAuthGuard)
export class RiskAssessmentController {
  constructor(private readonly assessmentService: RiskAssessmentService) { }

  @Get('scales/likelihood')
  @ApiOperation({ summary: 'Get likelihood scale descriptions from settings' })
  @ApiResponse({ status: 200, description: 'Likelihood scale with labels and descriptions' })
  async getLikelihoodScale(@Request() req: any) {
    return this.assessmentService.getLikelihoodScaleDescriptions();
  }

  @Get('scales/impact')
  @ApiOperation({ summary: 'Get impact scale descriptions from settings' })
  @ApiResponse({ status: 200, description: 'Impact scale with labels and descriptions' })
  async getImpactScale(@Request() req: any) {
    return this.assessmentService.getImpactScaleDescriptions();
  }

  @Get('risk/:riskId')
  @ApiOperation({ summary: 'Get all assessments for a risk' })
  async findByRiskId(
    @Param('riskId', ParseUUIDPipe) riskId: string,
    @Query('type') assessmentType?: AssessmentType,
  ) {
    return this.assessmentService.findByRiskId(riskId, assessmentType);
  }

  @Get('risk/:riskId/latest')
  @ApiOperation({ summary: 'Get latest assessments by type for a risk' })
  async findLatestByRiskId(@Param('riskId', ParseUUIDPipe) riskId: string) {
    return this.assessmentService.findLatestByRiskId(riskId);
  }

  @Get('risk/:riskId/compare')
  @ApiOperation({ summary: 'Compare inherent, current, and target assessments' })
  async compareAssessments(@Param('riskId', ParseUUIDPipe) riskId: string) {
    return this.assessmentService.compareAssessments(riskId);
  }

  @Get('risk/:riskId/history')
  @ApiOperation({ summary: 'Get assessment history for a risk' })
  async getHistory(
    @Param('riskId', ParseUUIDPipe) riskId: string,
    @Query('limit') limit?: number,
  ) {
    return this.assessmentService.getAssessmentHistory(riskId, limit || 10);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single assessment by ID' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.assessmentService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new risk assessment with settings validation' })
  @ApiResponse({ status: 201, description: 'Assessment created with appetite warnings if applicable' })
  async create(@Body() createDto: CreateRiskAssessmentDto, @Request() req: any) {
    return this.assessmentService.create(createDto, req.user?.id);
  }
}

