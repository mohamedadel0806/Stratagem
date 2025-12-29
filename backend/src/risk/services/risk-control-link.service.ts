import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RiskControlLink } from '../entities/risk-control-link.entity';
import { Risk } from '../entities/risk.entity';
import { UnifiedControl } from '../../governance/unified-controls/entities/unified-control.entity';
import { CreateRiskControlLinkDto, UpdateRiskControlLinkDto } from '../dto/links/create-risk-control-link.dto';

export interface RiskControlLinkResponseDto {
  id: string;
  risk_id: string;
  control_id: string;
  effectiveness_rating?: number;
  effectiveness_type: string;
  effectiveness_percentage?: number;
  control_type_for_risk?: string;
  notes?: string;
  linked_by?: string;
  linked_at: string;
  last_effectiveness_review?: string;
  control_info?: {
    control_identifier: string;
    title: string;
    control_type?: string;
    implementation_status?: string;
  };
}

@Injectable()
export class RiskControlLinkService {
  constructor(
    @InjectRepository(RiskControlLink)
    private linkRepository: Repository<RiskControlLink>,
    @InjectRepository(Risk)
    private riskRepository: Repository<Risk>,
    @InjectRepository(UnifiedControl)
    private controlRepository: Repository<UnifiedControl>,
  ) { }

  async findByRiskId(riskId: string): Promise<RiskControlLinkResponseDto[]> {
    const links = await this.linkRepository.find({
      where: { riskId },
      relations: ['control', 'linker'],
      order: { linkedAt: 'DESC' },
    });

    return links.map(link => this.toResponseDto(link));
  }

  async findByControlId(controlId: string): Promise<RiskControlLinkResponseDto[]> {
    const links = await this.linkRepository.find({
      where: { controlId },
      relations: ['risk', 'linker'],
      order: { linkedAt: 'DESC' },
    });

    return links.map(link => this.toResponseDto(link));
  }

  async getRisksForControl(controlId: string): Promise<any[]> {
    const links = await this.linkRepository.find({
      where: { controlId },
      relations: ['risk'],
    });

    return links.map(link => ({
      link_id: link.id,
      risk_id: link.risk.id,
      risk_identifier: link.risk.riskId,
      risk_title: link.risk.title,
      risk_level: link.risk.currentRiskLevel,
      risk_score: link.risk.currentRiskScore,
      effectiveness_rating: link.effectivenessRating,
      control_type_for_risk: link.controlTypeForRisk,
    }));
  }

  async create(createDto: CreateRiskControlLinkDto, userId?: string): Promise<RiskControlLinkResponseDto> {
    // Verify risk exists
    const risk = await this.riskRepository.findOne({ where: { id: createDto.risk_id } });
    if (!risk) {
      throw new NotFoundException(`Risk with ID ${createDto.risk_id} not found`);
    }

    // Verify control exists
    const control = await this.controlRepository.findOne({ where: { id: createDto.control_id } });
    if (!control) {
      throw new NotFoundException(`Control with ID ${createDto.control_id} not found`);
    }

    // Check for duplicate link
    const existingLink = await this.linkRepository.findOne({
      where: { riskId: createDto.risk_id, controlId: createDto.control_id },
    });

    if (existingLink) {
      throw new ConflictException('This control is already linked to this risk');
    }

    const { risk_id, control_id, effectiveness_rating, effectiveness_type, control_type_for_risk, ...rest } = createDto;

    const link = this.linkRepository.create({
      ...rest,
      riskId: risk_id,
      controlId: control_id,
      effectivenessRating: effectiveness_rating,
      effectivenessType: effectiveness_type,
      controlTypeForRisk: control_type_for_risk,
      linkedBy: userId,
    });

    const savedLink = await this.linkRepository.save(link);

    // Reload with relations
    const fullLink = await this.linkRepository.findOne({
      where: { id: savedLink.id },
      relations: ['control'],
    });

    return this.toResponseDto(fullLink);
  }

  async update(linkId: string, updateDto: UpdateRiskControlLinkDto, userId?: string): Promise<RiskControlLinkResponseDto> {
    const link = await this.linkRepository.findOne({
      where: { id: linkId },
      relations: ['control'],
    });

    if (!link) {
      throw new NotFoundException(`Risk-control link with ID ${linkId} not found`);
    }

    const { effectiveness_rating, effectiveness_type, control_type_for_risk, last_effectiveness_review, ...rest } = updateDto as any;

    const updateData: any = { ...rest };
    if (effectiveness_rating !== undefined) updateData.effectivenessRating = effectiveness_rating;
    if (effectiveness_type) updateData.effectivenessType = effectiveness_type;
    if (control_type_for_risk) updateData.controlTypeForRisk = control_type_for_risk;
    if (last_effectiveness_review) updateData.lastEffectivenessReview = new Date(last_effectiveness_review);

    Object.assign(link, updateData);
    const updatedLink = await this.linkRepository.save(link);
    return this.toResponseDto(updatedLink);
  }

  async remove(linkId: string): Promise<void> {
    const link = await this.linkRepository.findOne({ where: { id: linkId } });

    if (!link) {
      throw new NotFoundException(`Risk-control link with ID ${linkId} not found`);
    }

    await this.linkRepository.remove(link);
  }

  async removeByRiskAndControl(riskId: string, controlId: string): Promise<void> {
    const link = await this.linkRepository.findOne({
      where: { riskId, controlId },
    });

    if (!link) {
      throw new NotFoundException('Risk-control link not found');
    }

    await this.linkRepository.remove(link);
  }

  async getControlEffectiveness(riskId: string): Promise<{
    total_controls: number;
    average_effectiveness: number;
    effectiveness_by_type: { type: string; count: number; avg_effectiveness: number }[];
  }> {
    const links = await this.linkRepository.find({
      where: { riskId },
      relations: ['control'],
    });

    if (links.length === 0) {
      return {
        total_controls: 0,
        average_effectiveness: 0,
        effectiveness_by_type: [],
      };
    }

    const byType: Record<string, { count: number; totalEffectiveness: number }> = {};
    let totalEffectiveness = 0;
    let effectivenessCount = 0;

    for (const link of links) {
      const type = link.controlTypeForRisk || 'general';
      if (!byType[type]) {
        byType[type] = { count: 0, totalEffectiveness: 0 };
      }
      byType[type].count++;

      if (link.effectivenessRating) {
        const percentage = link.effectivenessType === 'scale'
          ? link.effectivenessRating * 20
          : link.effectivenessRating;

        byType[type].totalEffectiveness += percentage;
        totalEffectiveness += percentage;
        effectivenessCount++;
      }
    }

    return {
      total_controls: links.length,
      average_effectiveness: effectivenessCount > 0
        ? Math.round(totalEffectiveness / effectivenessCount)
        : 0,
      effectiveness_by_type: Object.entries(byType).map(([type, data]) => ({
        type,
        count: data.count,
        avg_effectiveness: data.count > 0 ? Math.round(data.totalEffectiveness / data.count) : 0,
      })),
    };
  }

  async findRisksWithoutControls(): Promise<any[]> {
    const risksWithoutControls = await this.riskRepository
      .createQueryBuilder('risk')
      .leftJoin('risk_control_links', 'rcl', 'rcl.risk_id = risk.id')
      .where('rcl.id IS NULL')
      .andWhere('risk.deletedAt IS NULL')
      .andWhere("risk.status NOT IN ('closed', 'accepted')")
      .select([
        'risk.id',
        'risk.riskId',
        'risk.title',
        'risk.currentRiskLevel',
        'risk.currentRiskScore',
      ])
      .orderBy('risk.currentRiskScore', 'DESC')
      .getRawMany();

    return risksWithoutControls;
  }

  async getControlEffectivenessForControl(controlId: string): Promise<{
    total_risks: number;
    average_effectiveness: number;
    effectiveness_by_risk: { risk_id: string; risk_title: string; effectiveness: number }[];
  }> {
    const links = await this.linkRepository.find({
      where: { controlId: controlId },
      relations: ['risk'],
    });

    if (links.length === 0) {
      return {
        total_risks: 0,
        average_effectiveness: 0,
        effectiveness_by_risk: [],
      };
    }

    const effectivenessByRisk: { risk_id: string; risk_title: string; effectiveness: number }[] = [];
    let totalEffectiveness = 0;
    let effectivenessCount = 0;

    for (const link of links) {
      if (link.effectivenessRating != null) {
        const effectiveness = link.effectivenessType === 'scale'
          ? link.effectivenessRating * 20
          : link.effectivenessRating;

        effectivenessByRisk.push({
          risk_id: link.risk.id,
          risk_title: link.risk.title,
          effectiveness: Math.round(effectiveness),
        });

        totalEffectiveness += effectiveness;
        effectivenessCount++;
      }
    }

    return {
      total_risks: links.length,
      average_effectiveness: effectivenessCount > 0
        ? Math.round(totalEffectiveness / effectivenessCount)
        : 0,
      effectiveness_by_risk: effectivenessByRisk,
    };
  }

  private toResponseDto(link: RiskControlLink): RiskControlLinkResponseDto {
    const dto: RiskControlLinkResponseDto = {
      id: link.id,
      risk_id: link.riskId,
      control_id: link.controlId,
      effectiveness_rating: link.effectivenessRating,
      effectiveness_type: link.effectivenessType,
      effectiveness_percentage: link.effectivenessRating
        ? (link.effectivenessType === 'scale' ? link.effectivenessRating * 20 : link.effectivenessRating)
        : undefined,
      control_type_for_risk: link.controlTypeForRisk,
      notes: link.notes,
      linked_by: link.linkedBy,
      linked_at: link.linkedAt?.toISOString(),
      last_effectiveness_review: link.lastEffectivenessReview?.toISOString(),
    };

    if (link.control) {
      dto.control_info = {
        control_identifier: link.control.control_identifier,
        title: link.control.title,
        control_type: link.control.control_type,
        implementation_status: link.control.implementation_status,
      };
    }

    return dto;
  }
}
