import { Repository } from 'typeorm';
import { ComplianceFramework } from '../../common/entities/compliance-framework.entity';
import { FrameworkRequirement } from '../unified-controls/entities/framework-requirement.entity';
import { FrameworkVersion } from './entities/framework-version.entity';
import { CreateFrameworkVersionDto } from './dto/create-framework-version.dto';
import { ImportFrameworkStructureDto } from './dto/import-framework-structure.dto';
export declare class FrameworksService {
    private frameworkRepository;
    private requirementRepository;
    private versionRepository;
    constructor(frameworkRepository: Repository<ComplianceFramework>, requirementRepository: Repository<FrameworkRequirement>, versionRepository: Repository<FrameworkVersion>);
    getAllFrameworks(): Promise<ComplianceFramework[]>;
    getFramework(id: string): Promise<ComplianceFramework>;
    createVersion(frameworkId: string, createDto: CreateFrameworkVersionDto, userId: string): Promise<FrameworkVersion>;
    getVersions(frameworkId: string): Promise<FrameworkVersion[]>;
    getVersion(frameworkId: string, version: string): Promise<FrameworkVersion>;
    setCurrentVersion(frameworkId: string, version: string, userId: string): Promise<FrameworkVersion>;
    importFrameworkStructure(importDto: ImportFrameworkStructureDto, userId: string): Promise<{
        framework: ComplianceFramework;
        requirementsCreated: number;
        version?: FrameworkVersion;
    }>;
    getFrameworkWithStructure(frameworkId: string): Promise<ComplianceFramework & {
        requirements: FrameworkRequirement[];
    }>;
    getFrameworkRequirements(frameworkId: string): Promise<FrameworkRequirement[]>;
    getFrameworkDomains(frameworkId: string): Promise<string[]>;
    getFrameworkCategories(frameworkId: string, domain?: string): Promise<string[]>;
    getFrameworkStatistics(frameworkId: string): Promise<{
        totalDomains: number;
        totalCategories: number;
        totalRequirements: number;
        version?: string;
        status: string;
    }>;
    isFrameworkActive(frameworkId: string): Promise<boolean>;
    getAllActiveFrameworks(): Promise<ComplianceFramework[]>;
    searchFrameworks(query: string): Promise<ComplianceFramework[]>;
}
