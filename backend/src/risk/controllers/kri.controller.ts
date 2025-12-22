import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  ParseUUIDPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { KRIService } from '../services/kri.service';
import { CreateKRIDto } from '../dto/kri/create-kri.dto';
import { UpdateKRIDto } from '../dto/kri/update-kri.dto';
import { CreateKRIMeasurementDto } from '../dto/kri/create-kri-measurement.dto';
import { KRIStatus } from '../entities/kri.entity';

@Controller('kris')
@UseGuards(JwtAuthGuard)
export class KRIController {
  constructor(private readonly kriService: KRIService) {}

  @Get()
  async findAll(
    @Query('categoryId') categoryId?: string,
    @Query('status') status?: KRIStatus,
    @Query('ownerId') ownerId?: string,
    @Query('isActive') isActive?: string,
  ) {
    return this.kriService.findAll({
      categoryId,
      status,
      ownerId,
      isActive: isActive === undefined ? undefined : isActive === 'true',
    });
  }

  @Get('summary')
  async getStatusSummary() {
    return this.kriService.getKRIStatusSummary();
  }

  @Get('attention')
  async getRequiringAttention() {
    return this.kriService.getKRIsRequiringAttention();
  }

  @Get('risk/:riskId')
  async getKRIsForRisk(@Param('riskId', ParseUUIDPipe) riskId: string) {
    return this.kriService.getKRIsForRisk(riskId);
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.kriService.findOne(id);
  }

  @Get(':id/measurements')
  async getMeasurements(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('limit') limit?: number,
  ) {
    return this.kriService.getMeasurementHistory(id, limit || 50);
  }

  @Get(':id/risks')
  async getLinkedRisks(@Param('id', ParseUUIDPipe) id: string) {
    return this.kriService.getLinkedRisks(id);
  }

  @Post()
  async create(@Body() createDto: CreateKRIDto, @Request() req: any) {
    return this.kriService.create(createDto, req.user?.userId || req.user?.id);
  }

  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateKRIDto,
    @Request() req: any,
  ) {
    return this.kriService.update(id, updateDto, req.user?.userId || req.user?.id);
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.kriService.remove(id);
    return { message: 'KRI deleted successfully' };
  }

  @Post(':id/measure')
  async addMeasurement(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() measurementData: Omit<CreateKRIMeasurementDto, 'kri_id'>,
    @Request() req: any,
  ) {
    return this.kriService.addMeasurement(
      { ...measurementData, kri_id: id },
      req.user?.userId || req.user?.id,
    );
  }

  @Post(':id/risks/:riskId')
  async linkToRisk(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('riskId', ParseUUIDPipe) riskId: string,
    @Body() body: { relationship_type?: string; notes?: string },
    @Request() req: any,
  ) {
    await this.kriService.linkToRisk(id, riskId, body.relationship_type, body.notes, req.user?.userId || req.user?.id);
    return { message: 'KRI linked to risk successfully' };
  }

  @Delete(':id/risks/:riskId')
  async unlinkFromRisk(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('riskId', ParseUUIDPipe) riskId: string,
  ) {
    await this.kriService.unlinkFromRisk(id, riskId);
    return { message: 'KRI unlinked from risk successfully' };
  }
}







