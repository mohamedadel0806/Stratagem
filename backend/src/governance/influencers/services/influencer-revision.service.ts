import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InfluencerRevision, RevisionType } from '../entities/influencer-revision.entity';
import { Influencer } from '../entities/influencer.entity';

@Injectable()
export class InfluencerRevisionService {
  constructor(
    @InjectRepository(InfluencerRevision)
    private revisionRepository: Repository<InfluencerRevision>,
  ) {}

  async createRevision(
    influencer: Influencer,
    revisionType: RevisionType,
    userId: string,
    revisionNotes?: string,
    changesSummary?: Record<string, { old: any; new: any }>,
    impactAssessment?: {
      affected_policies?: string[];
      affected_controls?: string[];
      business_units_impact?: string[];
      risk_level?: 'low' | 'medium' | 'high' | 'critical';
      notes?: string;
    },
  ): Promise<InfluencerRevision> {
    const revision = this.revisionRepository.create({
      influencer_id: influencer.id,
      revision_type: revisionType,
      revision_notes: revisionNotes,
      revision_date: new Date(),
      changes_summary: changesSummary,
      impact_assessment: impactAssessment,
      reviewed_by: revisionType === RevisionType.REVIEWED ? userId : null,
      created_by: userId,
    });

    return this.revisionRepository.save(revision);
  }

  async getRevisionHistory(influencerId: string): Promise<InfluencerRevision[]> {
    return this.revisionRepository.find({
      where: { influencer_id: influencerId },
      relations: ['reviewer', 'creator'],
      order: { revision_date: 'DESC', created_at: 'DESC' },
    });
  }

  async getRevision(id: string): Promise<InfluencerRevision> {
    return this.revisionRepository.findOne({
      where: { id },
      relations: ['influencer', 'reviewer', 'creator'],
    });
  }

  async getLatestRevision(influencerId: string): Promise<InfluencerRevision | null> {
    return this.revisionRepository.findOne({
      where: { influencer_id: influencerId },
      relations: ['reviewer', 'creator'],
      order: { revision_date: 'DESC', created_at: 'DESC' },
    });
  }
}


