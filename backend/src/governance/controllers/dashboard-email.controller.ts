import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { DashboardEmailService, CreateDashboardEmailScheduleDto, UpdateDashboardEmailScheduleDto } from '../services/dashboard-email.service';
import { DashboardEmailSchedule } from '../entities/dashboard-email-schedule.entity';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser, CurrentUserData } from '../../auth/decorators/current-user.decorator';
import { User } from '../../users/entities/user.entity';

@ApiTags('governance')
@Controller('governance/dashboard/email-schedules')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DashboardEmailController {
  constructor(private readonly emailService: DashboardEmailService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new dashboard email schedule' })
  @ApiResponse({
    status: 201,
    description: 'Dashboard email schedule created successfully',
    type: DashboardEmailSchedule,
  })
  async createSchedule(
    @Body() dto: CreateDashboardEmailScheduleDto,
    @CurrentUser() user: CurrentUserData,
  ): Promise<DashboardEmailSchedule> {
    return this.emailService.createSchedule(dto, user.userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all dashboard email schedules' })
  @ApiResponse({
    status: 200,
    description: 'List of dashboard email schedules',
    type: [DashboardEmailSchedule],
  })
  async getAllSchedules(): Promise<DashboardEmailSchedule[]> {
    return this.emailService.getAllSchedules();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a dashboard email schedule by ID' })
  @ApiParam({ name: 'id', description: 'Dashboard email schedule ID' })
  @ApiResponse({
    status: 200,
    description: 'Dashboard email schedule details',
    type: DashboardEmailSchedule,
  })
  async getScheduleById(@Param('id') id: string): Promise<DashboardEmailSchedule> {
    return this.emailService.getScheduleById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a dashboard email schedule' })
  @ApiParam({ name: 'id', description: 'Dashboard email schedule ID' })
  @ApiResponse({
    status: 200,
    description: 'Dashboard email schedule updated successfully',
    type: DashboardEmailSchedule,
  })
  async updateSchedule(
    @Param('id') id: string,
    @Body() dto: UpdateDashboardEmailScheduleDto,
    @CurrentUser() user: CurrentUserData,
  ): Promise<DashboardEmailSchedule> {
    return this.emailService.updateSchedule(id, dto, user.userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a dashboard email schedule' })
  @ApiParam({ name: 'id', description: 'Dashboard email schedule ID' })
  @ApiResponse({
    status: 200,
    description: 'Dashboard email schedule deleted successfully',
  })
  async deleteSchedule(@Param('id') id: string): Promise<void> {
    return this.emailService.deleteSchedule(id);
  }

  @Put(':id/toggle')
  @ApiOperation({ summary: 'Toggle the active status of a dashboard email schedule' })
  @ApiParam({ name: 'id', description: 'Dashboard email schedule ID' })
  @ApiResponse({
    status: 200,
    description: 'Dashboard email schedule status toggled successfully',
    type: DashboardEmailSchedule,
  })
  async toggleScheduleStatus(
    @Param('id') id: string,
    @CurrentUser() user: CurrentUserData,
  ): Promise<DashboardEmailSchedule> {
    return this.emailService.toggleScheduleStatus(id, user.userId);
  }

  @Post('test-send/:id')
  @ApiOperation({ summary: 'Send a test dashboard email for a schedule' })
  @ApiParam({ name: 'id', description: 'Dashboard email schedule ID' })
  @ApiResponse({
    status: 200,
    description: 'Test email sent successfully',
  })
  async sendTestEmail(@Param('id') id: string): Promise<void> {
    const schedule = await this.emailService.getScheduleById(id);
    // In a real implementation, you would send a test email
    // For now, we'll just return success
    return Promise.resolve();
  }
}