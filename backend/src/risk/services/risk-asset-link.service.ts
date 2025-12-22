import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RiskAssetLink, RiskAssetType } from '../entities/risk-asset-link.entity';
import { Risk } from '../entities/risk.entity';
import { CreateRiskAssetLinkDto } from '../dto/links/create-risk-asset-link.dto';

export interface AssetInfo {
  id: string;
  type: RiskAssetType;
  name: string;
  description?: string;
  criticality?: string;
}

export interface RiskAssetLinkResponseDto {
  id: string;
  risk_id: string;
  asset_type: RiskAssetType;
  asset_id: string;
  impact_description?: string;
  asset_criticality_at_link?: string;
  linked_by?: string;
  linked_at: string;
  asset_info?: AssetInfo;
}

@Injectable()
export class RiskAssetLinkService {
  constructor(
    @InjectRepository(RiskAssetLink)
    private linkRepository: Repository<RiskAssetLink>,
    @InjectRepository(Risk)
    private riskRepository: Repository<Risk>,
  ) {}

  async findByRiskId(riskId: string): Promise<RiskAssetLinkResponseDto[]> {
    const links = await this.linkRepository.find({
      where: { risk_id: riskId },
      relations: ['linker'],
      order: { asset_type: 'ASC', linked_at: 'DESC' },
    });

    return links.map(link => this.toResponseDto(link));
  }

  async findByAsset(assetType: RiskAssetType, assetId: string): Promise<RiskAssetLinkResponseDto[]> {
    const links = await this.linkRepository.find({
      where: { asset_type: assetType, asset_id: assetId },
      relations: ['risk', 'linker'],
      order: { linked_at: 'DESC' },
    });

    return links.map(link => this.toResponseDto(link));
  }

  async getRisksForAsset(assetType: RiskAssetType, assetId: string): Promise<any[]> {
    const links = await this.linkRepository.find({
      where: { asset_type: assetType, asset_id: assetId },
      relations: ['risk'],
    });

    return links.map(link => ({
      link_id: link.id,
      risk_id: link.risk.id,
      risk_identifier: link.risk.risk_id,
      risk_title: link.risk.title,
      risk_level: link.risk.current_risk_level,
      risk_score: link.risk.current_risk_score,
      impact_description: link.impact_description,
    }));
  }

  async getAssetRiskScore(assetType: RiskAssetType, assetId: string): Promise<{
    total_risks: number;
    total_risk_score: number;
    max_risk_level: string;
    risk_breakdown: { level: string; count: number }[];
  }> {
    const links = await this.linkRepository.find({
      where: { asset_type: assetType, asset_id: assetId },
      relations: ['risk'],
    });

    const risks = links.map(l => l.risk).filter(r => r && !r.deleted_at);
    
    const breakdown: Record<string, number> = { critical: 0, high: 0, medium: 0, low: 0 };
    let totalScore = 0;
    let maxLevel = 'low';

    for (const risk of risks) {
      if (risk.current_risk_score) {
        totalScore += risk.current_risk_score;
      }
      if (risk.current_risk_level) {
        breakdown[risk.current_risk_level]++;
        if (this.compareLevels(risk.current_risk_level, maxLevel) > 0) {
          maxLevel = risk.current_risk_level;
        }
      }
    }

    return {
      total_risks: risks.length,
      total_risk_score: totalScore,
      max_risk_level: maxLevel,
      risk_breakdown: Object.entries(breakdown).map(([level, count]) => ({ level, count })),
    };
  }

  async create(createDto: CreateRiskAssetLinkDto, userId?: string): Promise<RiskAssetLinkResponseDto> {
    // Verify risk exists
    const risk = await this.riskRepository.findOne({ where: { id: createDto.risk_id } });
    if (!risk) {
      throw new NotFoundException(`Risk with ID ${createDto.risk_id} not found`);
    }

    // Check for duplicate link
    const existingLink = await this.linkRepository.findOne({
      where: {
        risk_id: createDto.risk_id,
        asset_type: createDto.asset_type,
        asset_id: createDto.asset_id,
      },
    });

    if (existingLink) {
      throw new ConflictException('This asset is already linked to this risk');
    }

    const link = this.linkRepository.create({
      ...createDto,
      linked_by: userId,
    });

    const savedLink = await this.linkRepository.save(link);
    return this.toResponseDto(savedLink);
  }

  async bulkCreate(riskId: string, assets: { asset_type: RiskAssetType; asset_id: string; impact_description?: string }[], userId?: string): Promise<RiskAssetLinkResponseDto[]> {
    // Verify risk exists
    const risk = await this.riskRepository.findOne({ where: { id: riskId } });
    if (!risk) {
      throw new NotFoundException(`Risk with ID ${riskId} not found`);
    }

    const results: RiskAssetLinkResponseDto[] = [];

    for (const asset of assets) {
      try {
        const result = await this.create({
          risk_id: riskId,
          asset_type: asset.asset_type,
          asset_id: asset.asset_id,
          impact_description: asset.impact_description,
        }, userId);
        results.push(result);
      } catch (error) {
        // Skip duplicates
        if (!(error instanceof ConflictException)) {
          throw error;
        }
      }
    }

    return results;
  }

  async updateImpactDescription(linkId: string, impactDescription: string): Promise<RiskAssetLinkResponseDto> {
    const link = await this.linkRepository.findOne({ where: { id: linkId } });
    
    if (!link) {
      throw new NotFoundException(`Risk-asset link with ID ${linkId} not found`);
    }

    link.impact_description = impactDescription;
    const updatedLink = await this.linkRepository.save(link);

    return this.toResponseDto(updatedLink);
  }

  async remove(linkId: string): Promise<void> {
    const link = await this.linkRepository.findOne({ where: { id: linkId } });
    
    if (!link) {
      throw new NotFoundException(`Risk-asset link with ID ${linkId} not found`);
    }

    await this.linkRepository.remove(link);
  }

  async removeByRiskAndAsset(riskId: string, assetType: RiskAssetType, assetId: string): Promise<void> {
    const link = await this.linkRepository.findOne({
      where: { risk_id: riskId, asset_type: assetType, asset_id: assetId },
    });

    if (!link) {
      throw new NotFoundException('Risk-asset link not found');
    }

    await this.linkRepository.remove(link);
  }

  async countByRisk(riskId: string): Promise<Record<RiskAssetType, number>> {
    const links = await this.linkRepository.find({ where: { risk_id: riskId } });
    
    const counts: Record<string, number> = {
      physical: 0,
      information: 0,
      software: 0,
      application: 0,
      supplier: 0,
    };

    for (const link of links) {
      counts[link.asset_type]++;
    }

    return counts as Record<RiskAssetType, number>;
  }

  private compareLevels(a: string, b: string): number {
    const order = { critical: 4, high: 3, medium: 2, low: 1 };
    return (order[a] || 0) - (order[b] || 0);
  }

  private toResponseDto(link: RiskAssetLink): RiskAssetLinkResponseDto {
    return {
      id: link.id,
      risk_id: link.risk_id,
      asset_type: link.asset_type,
      asset_id: link.asset_id,
      impact_description: link.impact_description,
      asset_criticality_at_link: link.asset_criticality_at_link,
      linked_by: link.linked_by,
      linked_at: link.linked_at?.toISOString(),
    };
  }
}







