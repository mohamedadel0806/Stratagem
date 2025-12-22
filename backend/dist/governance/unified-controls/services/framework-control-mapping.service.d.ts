import { Repository } from 'typeorm';
import { FrameworkControlMapping, MappingCoverage } from '../entities/framework-control-mapping.entity';
import { UnifiedControl } from '../entities/unified-control.entity';
import { FrameworkRequirement } from '../entities/framework-requirement.entity';
export declare class FrameworkControlMappingService {
    private mappingRepository;
    private controlRepository;
    private requirementRepository;
    private readonly logger;
    constructor(mappingRepository: Repository<FrameworkControlMapping>, controlRepository: Repository<UnifiedControl>, requirementRepository: Repository<FrameworkRequirement>);
    createMapping(controlId: string, requirementId: string, coverageLevel: MappingCoverage, mappingNotes?: string, userId?: string): Promise<FrameworkControlMapping>;
    getMappingsForControl(controlId: string): Promise<FrameworkControlMapping[]>;
    getMappingsForRequirement(requirementId: string): Promise<FrameworkControlMapping[]>;
    bulkCreateMappings(controlId: string, requirementIds: string[], coverageLevel: MappingCoverage, mappingNotes?: string, userId?: string): Promise<{
        created: FrameworkControlMapping[];
        alreadyLinked: string[];
    }>;
    updateMapping(mappingId: string, coverageLevel?: MappingCoverage, mappingNotes?: string): Promise<FrameworkControlMapping>;
    deleteMapping(mappingId: string): Promise<void>;
    deleteMappingsForControl(controlId: string): Promise<void>;
    getCoverageMatrix(frameworkId: string): Promise<{
        requirementId: string;
        requirementIdentifier: string;
        requirementTitle: string;
        controlId: string;
        controlIdentifier: string;
        controlTitle: string;
        coverageLevel: MappingCoverage;
    }[]>;
}
