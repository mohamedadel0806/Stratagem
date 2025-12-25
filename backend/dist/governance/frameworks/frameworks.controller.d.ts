import { FrameworksService } from './frameworks.service';
import { CreateFrameworkVersionDto } from './dto/create-framework-version.dto';
import { ImportFrameworkStructureDto } from './dto/import-framework-structure.dto';
export declare class FrameworksController {
    private readonly frameworksService;
    constructor(frameworksService: FrameworksService);
    getAllFrameworks(): Promise<import("../../common/entities/compliance-framework.entity").ComplianceFramework[]>;
    getFramework(id: string): Promise<import("../../common/entities/compliance-framework.entity").ComplianceFramework>;
    createVersion(id: string, createDto: CreateFrameworkVersionDto, req: any): Promise<import("./entities/framework-version.entity").FrameworkVersion>;
    getVersions(id: string): Promise<import("./entities/framework-version.entity").FrameworkVersion[]>;
    getVersion(id: string, version: string): Promise<import("./entities/framework-version.entity").FrameworkVersion>;
    setCurrentVersion(id: string, version: string, req: any): Promise<import("./entities/framework-version.entity").FrameworkVersion>;
    importStructure(id: string, importDto: Omit<ImportFrameworkStructureDto, 'framework_id'>, req: any): Promise<{
        framework: import("../../common/entities/compliance-framework.entity").ComplianceFramework;
        requirementsCreated: number;
        version?: import("./entities/framework-version.entity").FrameworkVersion;
    }>;
    importStructureFromFile(id: string, file: Express.Multer.File, body: {
        version?: string;
        create_version?: string;
        replace_existing?: string;
    }, req: any): Promise<{
        framework: import("../../common/entities/compliance-framework.entity").ComplianceFramework;
        requirementsCreated: number;
        version?: import("./entities/framework-version.entity").FrameworkVersion;
    }>;
    getFrameworkWithStructure(id: string): Promise<import("../../common/entities/compliance-framework.entity").ComplianceFramework & {
        requirements: import("../unified-controls/entities/framework-requirement.entity").FrameworkRequirement[];
    }>;
    getFrameworkRequirements(id: string): Promise<import("../unified-controls/entities/framework-requirement.entity").FrameworkRequirement[]>;
    getFrameworkDomains(id: string): Promise<string[]>;
    getFrameworkCategories(id: string, domain?: string): Promise<string[]>;
    getFrameworkStatistics(id: string): Promise<{
        totalDomains: number;
        totalCategories: number;
        totalRequirements: number;
        version?: string;
        status: string;
    }>;
    isFrameworkActive(id: string): Promise<boolean>;
    searchFrameworks(query: string): Promise<import("../../common/entities/compliance-framework.entity").ComplianceFramework[]>;
    private parseCSVToStructure;
}
