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
}
