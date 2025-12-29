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
  ) { }

  async findByRiskId(riskId: string): Promise<RiskAssetLinkResponseDto[]> {
    const links = await this.linkRepository.find({
      where: { riskId },
      relations: ['linker'],
      order: { assetType: 'ASC', linkedAt: 'DESC' },
    });

    return links.map(link => this.toResponseDto(link));
  }

  async findByAsset(assetType: RiskAssetType, assetId: string): Promise<RiskAssetLinkResponseDto[]> {
    const links = await this.linkRepository.find({
      where: { assetType, assetId },
      relations: ['risk', 'linker'],
      order: { linkedAt: 'DESC' },
    });

    return links.map(link => this.toResponseDto(link));
  }

  async getRisksForAsset(assetType: RiskAssetType, assetId: string): Promise<any[]> {
    const links = await this.linkRepository.find({
      where: { assetType, assetId },
      relations: ['risk'],
    });

    return links.map(link => ({
      link_id: link.id,
      risk_id: link.risk.id,
      risk_identifier: link.risk.riskId,
      risk_title: link.risk.title,
      risk_level: link.risk.currentRiskLevel,
      risk_score: link.risk.currentRiskScore,
      impact_description: link.impactDescription,
    }));
  }

  async getAssetRiskScore(assetType: RiskAssetType, assetId: string): Promise<{
    total_risks: number;
    total_risk_score: number;
    max_risk_level: string;
    risk_breakdown: { level: string; count: number }[];
  }> {
    const links = await this.linkRepository.find({
      where: { assetType, assetId },
      relations: ['risk'],
    });

    const risks = links.map(l => l.risk).filter(r => r && !r.deletedAt);

    const breakdown: Record<string, number> = { critical: 0, high: 0, medium: 0, low: 0 };
    let totalScore = 0;
    let maxLevel = 'low';

    for (const risk of risks) {
      if (risk.currentRiskScore) {
        totalScore += risk.currentRiskScore;
      }
      if (risk.currentRiskLevel) {
        breakdown[risk.currentRiskLevel]++;
        if (this.compareLevels(risk.currentRiskLevel, maxLevel) > 0) {
          maxLevel = risk.currentRiskLevel;
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
        riskId: createDto.risk_id,
        assetType: createDto.asset_type,
        assetId: createDto.asset_id,
      },
    });

    if (existingLink) {
      throw new ConflictException('This asset is already linked to this risk');
    }

    const { risk_id, asset_type, asset_id, impact_description, ...rest } = createDto;

    const link = this.linkRepository.create({
      ...rest,
      riskId: risk_id,
      assetType: asset_type,
      assetId: asset_id,
      impactDescription: impact_description,
      linkedBy: userId,
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

    link.impactDescription = impactDescription;
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
      where: { riskId, assetType, assetId },
    });

    if (!link) {
      throw new NotFoundException('Risk-asset link not found');
    }

    await this.linkRepository.remove(link);
  }

  async countByRisk(riskId: string): Promise<Record<RiskAssetType, number>> {
    const links = await this.linkRepository.find({ where: { riskId } });

    const counts: Record<string, number> = {
      physical: 0,
      information: 0,
      software: 0,
      application: 0,
      supplier: 0,
    };

    for (const link of links) {
      counts[link.assetType]++;
    }

    return counts as Record<RiskAssetType, number>;
  }

  private compareLevels(a: string, b: string): number {
    const order: any = { critical: 4, high: 3, medium: 2, low: 1 };
    return (order[a] || 0) - (order[b] || 0);
  }

  private toResponseDto(link: RiskAssetLink): RiskAssetLinkResponseDto {
    return {
      id: link.id,
      risk_id: link.riskId,
      asset_type: link.assetType,
      asset_id: link.assetId,
      impact_description: link.impactDescription,
      asset_criticality_at_link: link.assetCriticalityAtLink,
      linked_by: link.linkedBy,
      linked_at: link.linkedAt?.toISOString(),
    };
  }
}
