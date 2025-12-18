import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  ParseUUIDPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RiskTreatmentService } from '../services/risk-treatment.service';
import { CreateRiskTreatmentDto } from '../dto/treatment/create-risk-treatment.dto';
import { UpdateRiskTreatmentDto } from '../dto/treatment/update-risk-treatment.dto';
import { TreatmentStatus, TreatmentPriority } from '../entities/risk-treatment.entity';

@Controller('risk-treatments')
@UseGuards(JwtAuthGuard)
export class RiskTreatmentController {
  constructor(private readonly treatmentService: RiskTreatmentService) {}

  @Get()
  async findAll(
    @Query('status') status?: TreatmentStatus,
    @Query('priority') priority?: TreatmentPriority,
    @Query('ownerId') ownerId?: string,
    @Query('riskId') riskId?: string,
  ) {
    return this.treatmentService.findAll({ status, priority, ownerId, riskId });
  }

  @Get('summary')
  async getSummary() {
    return this.treatmentService.getTreatmentSummary();
  }

  @Get('overdue')
  async getOverdue() {
    return this.treatmentService.getOverdueTreatments();
  }

  @Get('due-soon')
  async getDueSoon(@Query('days') days?: number) {
    return this.treatmentService.getTreatmentsDueSoon(days || 7);
  }

  @Get('risk/:riskId')
  async findByRiskId(@Param('riskId', ParseUUIDPipe) riskId: string) {
    return this.treatmentService.findByRiskId(riskId);
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.treatmentService.findOne(id);
  }

  @Post()
  async create(@Body() createDto: CreateRiskTreatmentDto, @Request() req: any) {
    return this.treatmentService.create(createDto, req.user?.userId || req.user?.id);
  }

  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateRiskTreatmentDto,
    @Request() req: any,
  ) {
    return this.treatmentService.update(id, updateDto, req.user?.userId || req.user?.id);
  }

  @Patch(':id/progress')
  async updateProgress(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: { progress: number; notes?: string },
    @Request() req: any,
  ) {
    return this.treatmentService.updateProgress(id, body.progress, body.notes, req.user?.userId || req.user?.id);
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.treatmentService.remove(id);
    return { message: 'Risk treatment deleted successfully' };
  }

  // Task management
  @Post(':id/tasks')
  async addTask(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() taskData: { title: string; description?: string; assignee_id?: string; due_date?: string },
  ) {
    return this.treatmentService.addTask(id, taskData);
  }

  @Put('tasks/:taskId')
  async updateTask(
    @Param('taskId', ParseUUIDPipe) taskId: string,
    @Body() taskData: { title?: string; description?: string; assignee_id?: string; status?: string; due_date?: string },
  ) {
    return this.treatmentService.updateTask(taskId, taskData);
  }

  @Delete('tasks/:taskId')
  async removeTask(@Param('taskId', ParseUUIDPipe) taskId: string) {
    await this.treatmentService.removeTask(taskId);
    return { message: 'Task deleted successfully' };
  }
}





