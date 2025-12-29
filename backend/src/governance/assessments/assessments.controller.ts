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
import { AssessmentsService } from './assessments.service';
import { CreateAssessmentDto } from './dto/create-assessment.dto';
import { CreateAssessmentResultDto } from './dto/create-assessment-result.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('governance/assessments')
@UseGuards(JwtAuthGuard)
export class AssessmentsController {
  constructor(private readonly assessmentsService: AssessmentsService) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createAssessmentDto: CreateAssessmentDto, @Request() req) {
    return this.assessmentsService.create(createAssessmentDto, req.user.id, req.user.tenantId);
  }

  @Get()
  findAll(@Query() query: any) {
    return this.assessmentsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.assessmentsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: Partial<CreateAssessmentDto>, @Request() req) {
    return this.assessmentsService.update(id, updateDto, req.user.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.assessmentsService.remove(id);
  }

  @Post(':id/results')
  @HttpCode(HttpStatus.CREATED)
  addResult(@Param('id') assessmentId: string, @Body() createResultDto: CreateAssessmentResultDto, @Request() req) {
    return this.assessmentsService.addResult(
      { ...createResultDto, assessment_id: assessmentId },
      req.user.id,
    );
  }

  @Get(':id/results')
  getResults(@Param('id') assessmentId: string) {
    return this.assessmentsService.getResults(assessmentId);
  }
}







