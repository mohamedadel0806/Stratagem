import { Repository } from 'typeorm';
import { Policy } from '../policies/entities/policy.entity';
import { UnifiedControl } from '../unified-controls/entities/unified-control.entity';
import { Influencer } from '../influencers/entities/influencer.entity';
export declare class BulkDataService {
    private policyRepository;
    private controlRepository;
    private influencerRepository;
    private readonly logger;
    constructor(policyRepository: Repository<Policy>, controlRepository: Repository<UnifiedControl>, influencerRepository: Repository<Influencer>);
    importPolicies(data: any[], userId: string): Promise<{
        created: number;
        skipped: number;
        errors: string[];
    }>;
    importControls(data: any[], userId: string): Promise<{
        created: number;
        skipped: number;
        errors: string[];
    }>;
    exportEntities(type: 'policies' | 'controls' | 'influencers'): Promise<any[]>;
}
