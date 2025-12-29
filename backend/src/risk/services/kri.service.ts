import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, Between } from 'typeorm';
import { KRI, KRIStatus, KRITrend, MeasurementFrequency } from '../entities/kri.entity';
import { KRIMeasurement } from '../entities/kri-measurement.entity';
import { KRIRiskLink } from '../entities/kri-risk-link.entity';
import { CreateKRIDto } from '../dto/kri/create-kri.dto';
import { UpdateKRIDto } from '../dto/kri/update-kri.dto';
import { CreateKRIMeasurementDto } from '../dto/kri/create-kri-measurement.dto';
import { KRIResponseDto, KRIMeasurementResponseDto } from '../dto/kri/kri-response.dto';

@Injectable()
export class KRIService {
  constructor(
    @InjectRepository(KRI)
    private kriRepository: Repository<KRI>,
    @InjectRepository(KRIMeasurement)
    private measurementRepository: Repository<KRIMeasurement>,
    @InjectRepository(KRIRiskLink)
    private linkRepository: Repository<KRIRiskLink>,
  ) { }

  async findAll(filters?: {
    categoryId?: string;
    status?: KRIStatus;
    ownerId?: string;
    isActive?: boolean;
  }): Promise<KRIResponseDto[]> {
    const where: any = {};

    if (filters?.categoryId) where.category_id = filters.categoryId;
    if (filters?.status) where.current_status = filters.status;
    if (filters?.ownerId) where.kri_owner_id = filters.ownerId;
    if (filters?.isActive !== undefined) where.is_active = filters.isActive;

    const kris = await this.kriRepository.find({
      where,
      relations: ['category', 'kri_owner', 'risk_links'],
      order: { created_at: 'DESC' },
    });

    return kris.map(kri => this.toResponseDto(kri));
  }

  async findOne(id: string): Promise<KRIResponseDto> {
    const kri = await this.kriRepository.findOne({
      where: { id },
      relations: ['category', 'kri_owner', 'risk_links', 'measurements'],
    });

    if (!kri) {
      throw new NotFoundException(`KRI with ID ${id} not found`);
    }

    // Get recent measurements
    const recentMeasurements = await this.measurementRepository.find({
      where: { kri_id: id },
      relations: ['measurer'],
      order: { measurement_date: 'DESC' },
      take: 10,
    });

    const dto = this.toResponseDto(kri);
    dto.recent_measurements = recentMeasurements.map(m => this.toMeasurementResponseDto(m));

    return dto;
  }

  async create(createDto: CreateKRIDto, userId?: string): Promise<KRIResponseDto> {
    const kri = this.kriRepository.create({
      ...createDto,
      next_measurement_due: createDto.next_measurement_due
        ? new Date(createDto.next_measurement_due)
        : this.calculateNextMeasurementDate(createDto.measurement_frequency),
      created_by: userId,
    });

    const savedKri = await this.kriRepository.save(kri);

    const fullKri = await this.kriRepository.findOne({
      where: { id: savedKri.id },
      relations: ['category', 'kri_owner'],
    });

    return this.toResponseDto(fullKri);
  }

  async update(id: string, updateDto: UpdateKRIDto, userId?: string): Promise<KRIResponseDto> {
    const kri = await this.kriRepository.findOne({ where: { id } });

    if (!kri) {
      throw new NotFoundException(`KRI with ID ${id} not found`);
    }

    const updateData: any = { ...updateDto, updated_by: userId };
    if (updateDto.next_measurement_due) {
      updateData.next_measurement_due = new Date(updateDto.next_measurement_due);
    }

    Object.assign(kri, updateData);
    const updatedKri = await this.kriRepository.save(kri);

    const fullKri = await this.kriRepository.findOne({
      where: { id: updatedKri.id },
      relations: ['category', 'kri_owner', 'risk_links'],
    });

    return this.toResponseDto(fullKri);
  }

  async remove(id: string): Promise<void> {
    const kri = await this.kriRepository.findOne({ where: { id } });

    if (!kri) {
      throw new NotFoundException(`KRI with ID ${id} not found`);
    }

    await this.kriRepository.softDelete(id);
  }

  // Measurements
  async addMeasurement(createDto: CreateKRIMeasurementDto, userId?: string): Promise<KRIMeasurementResponseDto> {
    const kri = await this.kriRepository.findOne({ where: { id: createDto.kri_id } });

    if (!kri) {
      throw new NotFoundException(`KRI with ID ${createDto.kri_id} not found`);
    }

    const measurement = this.measurementRepository.create({
      ...createDto,
      measurement_date: new Date(createDto.measurement_date),
      measured_by: userId,
    });

    const savedMeasurement = await this.measurementRepository.save(measurement);

    // Update next measurement due date
    kri.next_measurement_due = this.calculateNextMeasurementDate(kri.measurement_frequency);
    await this.kriRepository.save(kri);

    const fullMeasurement = await this.measurementRepository.findOne({
      where: { id: savedMeasurement.id },
      relations: ['measurer'],
    });

    return this.toMeasurementResponseDto(fullMeasurement);
  }

  async getMeasurementHistory(kriId: string, limit = 50): Promise<KRIMeasurementResponseDto[]> {
    const measurements = await this.measurementRepository.find({
      where: { kri_id: kriId },
      relations: ['measurer'],
      order: { measurement_date: 'DESC' },
      take: limit,
    });

    return measurements.map(m => this.toMeasurementResponseDto(m));
  }

  // Risk links
  async linkToRisk(kriId: string, riskId: string, relationshipType = 'indicator', notes?: string, userId?: string): Promise<void> {
    const existingLink = await this.linkRepository.findOne({
      where: { kriId, riskId },
    });

    if (existingLink) {
      return; // Already linked
    }

    const link = this.linkRepository.create({
      kriId,
      riskId,
      relationship_type: relationshipType,
      notes,
      linked_by: userId,
    });

    await this.linkRepository.save(link);
  }

  async unlinkFromRisk(kriId: string, riskId: string): Promise<void> {
    await this.linkRepository.delete({ kriId, riskId });
  }

  async getLinkedRisks(kriId: string): Promise<any[]> {
    const links = await this.linkRepository.find({
      where: { kriId },
      relations: ['risk'],
    });

    return links.map(link => ({
      link_id: link.id,
      risk_id: link.risk.id,
      risk_identifier: link.risk.riskId,
      risk_title: link.risk.title,
      risk_level: link.risk.currentRiskLevel,
      relationship_type: link.relationship_type,
    }));
  }

  async getKRIsForRisk(riskId: string): Promise<KRIResponseDto[]> {
    const links = await this.linkRepository.find({
      where: { riskId },
      relations: ['kri', 'kri.category'],
    });

    return links.map(link => this.toResponseDto(link.kri));
  }

  // Dashboard queries
  async getKRIStatusSummary(): Promise<{
    total: number;
    by_status: Record<string, number>;
    by_trend: Record<string, number>;
    overdue_measurements: number;
  }> {
    const kris = await this.kriRepository.find({ where: { is_active: true } });
    const today = new Date();

    const summary = {
      total: kris.length,
      by_status: { green: 0, amber: 0, red: 0, unknown: 0 },
      by_trend: { improving: 0, stable: 0, worsening: 0, unknown: 0 },
      overdue_measurements: 0,
    };

    for (const kri of kris) {
      // By status
      if (kri.current_status) {
        summary.by_status[kri.current_status]++;
      } else {
        summary.by_status.unknown++;
      }

      // By trend
      if (kri.trend) {
        summary.by_trend[kri.trend]++;
      } else {
        summary.by_trend.unknown++;
      }

      // Overdue check
      if (kri.next_measurement_due && kri.next_measurement_due < today) {
        summary.overdue_measurements++;
      }
    }

    return summary;
  }

  async getKRIsRequiringAttention(): Promise<KRIResponseDto[]> {
    const today = new Date();
    const weekFromNow = new Date();
    weekFromNow.setDate(today.getDate() + 7);

    const kris = await this.kriRepository.find({
      where: [
        { current_status: KRIStatus.RED, is_active: true },
        { next_measurement_due: LessThan(today), is_active: true },
        { next_measurement_due: Between(today, weekFromNow), is_active: true },
      ],
      relations: ['category', 'kri_owner'],
      order: { current_status: 'DESC', next_measurement_due: 'ASC' },
    });

    return kris.map(kri => this.toResponseDto(kri));
  }

  private calculateNextMeasurementDate(frequency?: MeasurementFrequency): Date {
    const now = new Date();
    const next = new Date(now);

    switch (frequency) {
      case MeasurementFrequency.DAILY:
        next.setDate(now.getDate() + 1);
        break;
      case MeasurementFrequency.WEEKLY:
        next.setDate(now.getDate() + 7);
        break;
      case MeasurementFrequency.MONTHLY:
        next.setMonth(now.getMonth() + 1);
        break;
      case MeasurementFrequency.QUARTERLY:
        next.setMonth(now.getMonth() + 3);
        break;
      case MeasurementFrequency.ANNUALLY:
        next.setFullYear(now.getFullYear() + 1);
        break;
      default:
        next.setMonth(now.getMonth() + 1); // Default to monthly
    }

    return next;
  }

  private toResponseDto(kri: KRI): KRIResponseDto {
    const today = new Date();
    let measurementDueStatus: 'on_track' | 'due_soon' | 'overdue' = 'on_track';

    if (kri.next_measurement_due) {
      const dueDate = new Date(kri.next_measurement_due);
      const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

      if (daysUntilDue < 0) {
        measurementDueStatus = 'overdue';
      } else if (daysUntilDue <= 7) {
        measurementDueStatus = 'due_soon';
      }
    }

    return {
      id: kri.id,
      kri_id: kri.kri_id,
      name: kri.name,
      description: kri.description,
      category_id: kri.category_id,
      category_name: kri.category?.name,
      measurement_unit: kri.measurement_unit,
      measurement_frequency: kri.measurement_frequency,
      data_source: kri.data_source,
      calculation_method: kri.calculation_method,
      threshold_green: kri.threshold_green,
      threshold_amber: kri.threshold_amber,
      threshold_red: kri.threshold_red,
      threshold_direction: kri.threshold_direction,
      current_value: kri.current_value,
      current_status: kri.current_status,
      trend: kri.trend,
      kri_owner_id: kri.kri_owner_id,
      owner_name: kri.kri_owner
        ? `${kri.kri_owner.firstName || ''} ${kri.kri_owner.lastName || ''}`.trim()
        : undefined,
      is_active: kri.is_active,
      last_measured_at: this.toISOString(kri.last_measured_at),
      next_measurement_due: this.toISOString(kri.next_measurement_due),
      target_value: kri.target_value,
      baseline_value: kri.baseline_value,
      tags: kri.tags,
      linked_risks_count: kri.risk_links?.length || 0,
      measurement_due_status: measurementDueStatus,
      created_at: this.toISOString(kri.created_at),
      updated_at: this.toISOString(kri.updated_at),
    };
  }

  // Helper function to safely convert dates to ISO string
  private toISOString(date: Date | string | undefined | null): string | undefined {
    if (!date) return undefined;
    if (typeof date === 'string') return date; // Already a string
    if (date instanceof Date) return date.toISOString();
    // Fallback for objects that might have toISOString method but aren't Date objects
    if (typeof (date as any).toISOString === 'function') return (date as any).toISOString();
    return undefined;
  }

  private toMeasurementResponseDto(measurement: KRIMeasurement): KRIMeasurementResponseDto {
    return {
      id: measurement.id,
      kri_id: measurement.kri_id,
      measurement_date: this.toISOString(measurement.measurement_date),
      value: measurement.value,
      status: measurement.status,
      notes: measurement.notes,
      measured_by: measurement.measured_by,
      measurer_name: measurement.measurer
        ? `${measurement.measurer.firstName || ''} ${measurement.measurer.lastName || ''}`.trim()
        : undefined,
      evidence_attachments: measurement.evidence_attachments,
      created_at: this.toISOString(measurement.created_at),
    };
  }
}

