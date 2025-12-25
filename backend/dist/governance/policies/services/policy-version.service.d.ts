import { Repository } from 'typeorm';
import { PolicyVersion } from '../entities/policy-version.entity';
import { Policy } from '../entities/policy.entity';
import { User } from '../../../users/entities/user.entity';
export declare class PolicyVersionService {
    private versionRepository;
    private policyRepository;
    private userRepository;
    private readonly logger;
    constructor(versionRepository: Repository<PolicyVersion>, policyRepository: Repository<Policy>, userRepository: Repository<User>);
    createVersion(policyId: string, content: string, version: string, versionNumber: number, changeSummary: string, userId: string): Promise<PolicyVersion>;
    getVersionsByPolicy(policyId: string): Promise<PolicyVersion[]>;
    getVersion(versionId: string): Promise<PolicyVersion>;
    getLatestVersion(policyId: string): Promise<PolicyVersion>;
    getVersionByNumber(policyId: string, versionNumber: number): Promise<PolicyVersion>;
    deleteVersion(versionId: string): Promise<void>;
    compareVersions(versionId1: string, versionId2: string): Promise<{
        version1: PolicyVersion;
        version2: PolicyVersion;
        differences: string[];
    }>;
    getVersionHistory(policyId: string): Promise<Array<{
        versionNumber: number;
        version: string;
        createdAt: Date;
        createdBy: string;
        changeSummary: string;
    }>>;
    rollbackToVersion(policyId: string, versionNumber: number, userId: string): Promise<PolicyVersion>;
}
