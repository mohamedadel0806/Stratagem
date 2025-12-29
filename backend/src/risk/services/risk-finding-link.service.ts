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
  ) { }

  async findByRiskId(riskId: string): Promise<RiskFindingLinkResponseDto[]> {
    const links = await this.linkRepository.find({
      where: { riskId },
      relations: ['finding', 'linker'],
      order: { linkedAt: 'DESC' },
    });

    return links.map(link => this.toResponseDto(link));
  }

  async findByFindingId(findingId: string): Promise<RiskFindingLinkResponseDto[]> {
    const links = await this.linkRepository.find({
      where: { findingId },
      relations: ['risk', 'linker'],
      order: { linkedAt: 'DESC' },
    });

    return links.map(link => this.toResponseDto(link));
  }

  async getRisksForFinding(findingId: string): Promise<any[]> {
    const links = await this.linkRepository.find({
      where: { findingId },
      relations: ['risk'],
    });

    return links.map(link => ({
      link_id: link.id,
      risk_id: link.risk.id,
      risk_identifier: link.risk.riskId,
      risk_title: link.risk.title,
      risk_level: link.risk.currentRiskLevel,
      risk_score: link.risk.currentRiskScore,
      relationship_type: link.relationshipType,
    }));
  }

  async getFindingsForRisk(riskId: string): Promise<any[]> {
    const links = await this.linkRepository.find({
      where: { riskId },
      relations: ['finding'],
    });

    return links.map(link => ({
      link_id: link.id,
      finding_id: link.finding.id,
      finding_identifier: link.finding.finding_identifier,
      finding_title: link.finding.title,
      severity: link.finding.severity,
      status: link.finding.status,
      relationship_type: link.relationshipType,
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
      where: { riskId: createDto.risk_id, findingId: createDto.finding_id },
    });

    if (existingLink) {
      throw new ConflictException('This finding is already linked to this risk');
    }

    const { risk_id, finding_id, relationship_type, ...rest } = createDto;

    const link = this.linkRepository.create({
      ...rest,
      riskId: risk_id,
      findingId: finding_id,
      relationshipType: relationship_type,
      linkedBy: userId,
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

    const { relationship_type, ...rest } = updateDto as any;
    const updateData: any = { ...rest };
    if (relationship_type) updateData.relationshipType = relationship_type;

    Object.assign(link, updateData);
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
      where: { riskId, findingId },
    });

    if (!link) {
      throw new NotFoundException('Risk-finding link not found');
    }

    await this.linkRepository.remove(link);
  }

  private toResponseDto(link: RiskFindingLink): RiskFindingLinkResponseDto {
    const dto: RiskFindingLinkResponseDto = {
      id: link.id,
      risk_id: link.riskId,
      finding_id: link.findingId,
      relationship_type: link.relationshipType,
      notes: link.notes,
      linked_by: link.linkedBy,
      linked_at: link.linkedAt?.toISOString(),
    };

    if (link.risk) {
      dto.risk_info = {
        risk_id: link.risk.riskId,
        title: link.risk.title,
        current_risk_level: link.risk.currentRiskLevel,
        current_risk_score: link.risk.currentRiskScore,
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
