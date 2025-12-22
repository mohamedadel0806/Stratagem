import { Repository } from 'typeorm';
import { UnifiedControl } from './entities/unified-control.entity';
import { CreateUnifiedControlDto } from './dto/create-unified-control.dto';
import { UnifiedControlQueryDto } from './dto/unified-control-query.dto';
import { NotificationService } from '../../common/services/notification.service';
import { ControlDomain } from '../../governance/domains/entities/domain.entity';
export declare class UnifiedControlsService {
    private controlRepository;
    private domainRepository;
    private notificationService?;
    private readonly logger;
    constructor(controlRepository: Repository<UnifiedControl>, domainRepository: Repository<ControlDomain>, notificationService?: NotificationService);
    create(createDto: CreateUnifiedControlDto, userId: string): Promise<UnifiedControl>;
    findAll(queryDto: UnifiedControlQueryDto): Promise<{
        data: UnifiedControl[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<UnifiedControl>;
    update(id: string, updateDto: Partial<CreateUnifiedControlDto>, userId: string): Promise<UnifiedControl>;
    remove(id: string): Promise<void>;
    getLibraryStatistics(): Promise<{
        totalControls: number;
        activeControls: number;
        draftControls: number;
        deprecatedControls: number;
        byType: Record<string, number>;
        byComplexity: Record<string, number>;
        implementationRate: number;
    }>;
    getControlsByDomain(domainId: string, includeArchived?: boolean): Promise<UnifiedControl[]>;
    getDomainHierarchyTree(parentId?: string | null): Promise<any[]>;
    getControlTypes(): Promise<string[]>;
    getActiveDomains(): Promise<ControlDomain[]>;
    browseLibrary(filters: {
        domain?: string;
        type?: string;
        complexity?: string;
        status?: string;
        implementationStatus?: string;
        search?: string;
        page?: number;
        limit?: number;
    }): Promise<{
        data: UnifiedControl[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getRelatedControls(controlId: string, limit?: number): Promise<UnifiedControl[]>;
    getControlEffectiveness(controlId: string): Promise<{
        controlId: string;
        title: string;
        implementationStatus: string;
        lastUpdated: Date;
        avgEffectiveness: number;
        testHistory: Array<{
            date: Date;
            result: string;
        }>;
    }>;
    exportControls(filters?: {
        domain?: string;
        type?: string;
        status?: string;
    }): Promise<string>;
    importControls(controlsData: Array<{
        control_identifier: string;
        title: string;
        domain?: string;
        control_type?: string;
        complexity?: string;
        cost_impact?: string;
        description?: string;
        control_procedures?: string;
        testing_procedures?: string;
    }>, userId: string): Promise<{
        created: number;
        skipped: number;
        errors: Array<{
            row: number;
            error: string;
        }>;
    }>;
    getControlsDashboard(): Promise<{
        recentControls: UnifiedControl[];
        draftControls: UnifiedControl[];
        implementedControls: UnifiedControl[];
        deprecatedControls: UnifiedControl[];
    }>;
}
