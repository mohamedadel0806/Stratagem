import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RiskFindingLink, RiskFindingRelationshipType } from '../entities/risk-finding-link.entity';
import { Risk } from '../entities/risk.entity';
import { Finding } from '../../governance/findings/entities/finding.entity';
import { CreateRiskFindingLinkDto, UpdateRiskFindingLinkDto } from '../dto/links/create-risk-finding-link.dto';

export interface RiskFindingLinkResponseDto {
  id: string;
  risk_id: string;
  finding_id: string;
  relationship_type?: RiskFindingRelationshipType;
  notes?: string;
  linked_by?: string;
  linked_at: string;
  risk_info?: {
    risk_id: string;
    title: string;
    current_risk_level?: string;
    current_risk_score?: number;
  };
  finding_info?: {
    finding_identifier: string;
    title: string;
    severity?: string;
    status?: string;
  };
}

@Injectable()
export class RiskFindingLinkService {
  constructor(
    @InjectRepository(RiskFindingLink)
    private linkRepository: Repository<RiskFindingLink>,
    @InjectRepository(Risk)
    private riskRepository: Repository<Risk>,
    @InjectRepository(Finding)
    private findingRepository: Repository<Finding>,
  ) {}

  async findByRiskId(riskId: string): Promise<RiskFindingLinkResponseDto[]> {
    const links = await this.linkRepository.find({
      where: { risk_id: riskId },
      relations: ['finding', 'linker'],
      order: { linked_at: 'DESC' },
    });

    return links.map(link => this.toResponseDto(link));
  }

  async findByFindingId(findingId: string): Promise<RiskFindingLinkResponseDto[]> {
    const links = await this.linkRepository.find({
      where: { finding_id: findingId },
      relations: ['risk', 'linker'],
      order: { linked_at: 'DESC' },
    });

    return links.map(link => this.toResponseDto(link));
  }

  async getRisksForFinding(findingId: string): Promise<any[]> {
    const links = await this.linkRepository.find({
      where: { finding_id: findingId },
      relations: ['risk'],
    });

    return links.map(link => ({
      link_id: link.id,
      risk_id: link.risk.id,
      risk_identifier: link.risk.risk_id,
      risk_title: link.risk.title,
      risk_level: link.risk.current_risk_level,
      risk_score: link.risk.current_risk_score,
      relationship_type: link.relationship_type,
    }));
  }

  async getFindingsForRisk(riskId: string): Promise<any[]> {
    const links = await this.linkRepository.find({
      where: { risk_id: riskId },
      relations: ['finding'],
    });

    return links.map(link => ({
      link_id: link.id,
      finding_id: link.finding.id,
      finding_identifier: link.finding.finding_identifier,
      finding_title: link.finding.title,
      severity: link.finding.severity,
      status: link.finding.status,
      relationship_type: link.relationship_type,
    }));
  }

  async create(createDto: CreateRiskFindingLinkDto, userId?: string): Promise<RiskFindingLinkResponseDto> {
    // Verify risk exists
    const risk = await this.riskRepository.findOne({ where: { id: createDto.risk_id } });
    if (!risk) {
      throw new NotFoundException(`Risk with ID ${createDto.risk_id} not found`);
    }

    // Verify finding exists
    const finding = await this.findingRepository.findOne({ where: { id: createDto.finding_id } });
    if (!finding) {
      throw new NotFoundException(`Finding with ID ${createDto.finding_id} not found`);
    }

    // Check for duplicate link
    const existingLink = await this.linkRepository.findOne({
      where: { risk_id: createDto.risk_id, finding_id: createDto.finding_id },
    });

    if (existingLink) {
      throw new ConflictException('This finding is already linked to this risk');
    }

    const link = this.linkRepository.create({
      ...createDto,
      linked_by: userId,
    });

    const savedLink = await this.linkRepository.save(link);
    
    // Reload with relations
    const fullLink = await this.linkRepository.findOne({
      where: { id: savedLink.id },
      relations: ['risk', 'finding'],
    });

    return this.toResponseDto(fullLink);
  }

  async update(linkId: string, updateDto: UpdateRiskFindingLinkDto, userId?: string): Promise<RiskFindingLinkResponseDto> {
    const link = await this.linkRepository.findOne({
      where: { id: linkId },
      relations: ['risk', 'finding'],
    });

    if (!link) {
      throw new NotFoundException(`Risk-finding link with ID ${linkId} not found`);
    }

    Object.assign(link, updateDto);
    const updatedLink = await this.linkRepository.save(link);
    return this.toResponseDto(updatedLink);
  }

  async remove(linkId: string): Promise<void> {
    const link = await this.linkRepository.findOne({ where: { id: linkId } });
    
    if (!link) {
      throw new NotFoundException(`Risk-finding link with ID ${linkId} not found`);
    }

    await this.linkRepository.remove(link);
  }

  async removeByRiskAndFinding(riskId: string, findingId: string): Promise<void> {
    const link = await this.linkRepository.findOne({
      where: { risk_id: riskId, finding_id: findingId },
    });

    if (!link) {
      throw new NotFoundException('Risk-finding link not found');
    }

    await this.linkRepository.remove(link);
  }

  private toResponseDto(link: RiskFindingLink): RiskFindingLinkResponseDto {
    const dto: RiskFindingLinkResponseDto = {
      id: link.id,
      risk_id: link.risk_id,
      finding_id: link.finding_id,
      relationship_type: link.relationship_type,
      notes: link.notes,
      linked_by: link.linked_by,
      linked_at: link.linked_at?.toISOString(),
    };

    if (link.risk) {
      dto.risk_info = {
        risk_id: link.risk.risk_id,
        title: link.risk.title,
        current_risk_level: link.risk.current_risk_level,
        current_risk_score: link.risk.current_risk_score,
      };
    }

    if (link.finding) {
      dto.finding_info = {
        finding_identifier: link.finding.finding_identifier,
        title: link.finding.title,
        severity: link.finding.severity,
        status: link.finding.status,
      };
    }

    return dto;
  }
}



