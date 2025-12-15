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
  ) {}

  async findByRiskId(riskId: string): Promise<RiskControlLinkResponseDto[]> {
    const links = await this.linkRepository.find({
      where: { risk_id: riskId },
      relations: ['control', 'linker'],
      order: { linked_at: 'DESC' },
    });

    return links.map(link => this.toResponseDto(link));
  }

  async findByControlId(controlId: string): Promise<RiskControlLinkResponseDto[]> {
    const links = await this.linkRepository.find({
      where: { control_id: controlId },
      relations: ['risk', 'linker'],
      order: { linked_at: 'DESC' },
    });

    return links.map(link => this.toResponseDto(link));
  }

  async getRisksForControl(controlId: string): Promise<any[]> {
    const links = await this.linkRepository.find({
      where: { control_id: controlId },
      relations: ['risk'],
    });

    return links.map(link => ({
      link_id: link.id,
      risk_id: link.risk.id,
      risk_identifier: link.risk.risk_id,
      risk_title: link.risk.title,
      risk_level: link.risk.current_risk_level,
      risk_score: link.risk.current_risk_score,
      effectiveness_rating: link.effectiveness_rating,
      control_type_for_risk: link.control_type_for_risk,
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
      where: { risk_id: createDto.risk_id, control_id: createDto.control_id },
    });

    if (existingLink) {
      throw new ConflictException('This control is already linked to this risk');
    }

    const link = this.linkRepository.create({
      ...createDto,
      linked_by: userId,
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

    Object.assign(link, updateDto);
    if (updateDto.last_effectiveness_review) {
      link.last_effectiveness_review = new Date(updateDto.last_effectiveness_review);
    }

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
      where: { risk_id: riskId, control_id: controlId },
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
      where: { risk_id: riskId },
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
      const type = link.control_type_for_risk || 'general';
      if (!byType[type]) {
        byType[type] = { count: 0, totalEffectiveness: 0 };
      }
      byType[type].count++;

      if (link.effectiveness_rating) {
        const percentage = link.effectiveness_type === 'scale' 
          ? link.effectiveness_rating * 20 
          : link.effectiveness_rating;
        
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
      .andWhere('risk.deleted_at IS NULL')
      .andWhere("risk.status NOT IN ('closed', 'accepted')")
      .select([
        'risk.id',
        'risk.risk_id',
        'risk.title',
        'risk.current_risk_level',
        'risk.current_risk_score',
      ])
      .orderBy('risk.current_risk_score', 'DESC')
      .getRawMany();

    return risksWithoutControls;
  }

  async getControlEffectivenessForControl(controlId: string): Promise<{
    total_risks: number;
    average_effectiveness: number;
    effectiveness_by_risk: { risk_id: string; risk_title: string; effectiveness: number }[];
  }> {
    const links = await this.linkRepository.find({
      where: { control_id: controlId },
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
      if (link.effectiveness_rating != null) {
        const effectiveness = link.effectiveness_type === 'scale'
          ? link.effectiveness_rating * 20
          : link.effectiveness_rating;
        
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
      risk_id: link.risk_id,
      control_id: link.control_id,
      effectiveness_rating: link.effectiveness_rating,
      effectiveness_type: link.effectiveness_type,
      effectiveness_percentage: link.effectiveness_rating
        ? (link.effectiveness_type === 'scale' ? link.effectiveness_rating * 20 : link.effectiveness_rating)
        : undefined,
      control_type_for_risk: link.control_type_for_risk,
      notes: link.notes,
      linked_by: link.linked_by,
      linked_at: link.linked_at?.toISOString(),
      last_effectiveness_review: link.last_effectiveness_review?.toISOString(),
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

