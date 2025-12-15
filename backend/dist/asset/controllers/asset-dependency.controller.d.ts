import { AssetDependencyService } from '../services/asset-dependency.service';
import { CreateAssetDependencyDto } from '../dto/create-asset-dependency.dto';
import { AssetDependencyResponseDto } from '../dto/asset-dependency-response.dto';
import { AssetType } from '../entities/asset-dependency.entity';
import { User } from '../../users/entities/user.entity';
export declare class AssetDependencyController {
    private readonly dependencyService;
    constructor(dependencyService: AssetDependencyService);
    create(type: AssetType, id: string, createDto: CreateAssetDependencyDto, user: User): Promise<AssetDependencyResponseDto>;
    findAll(type: AssetType, id: string): Promise<AssetDependencyResponseDto[]>;
    findIncoming(type: AssetType, id: string): Promise<AssetDependencyResponseDto[]>;
    checkDependencies(type: AssetType, id: string): Promise<{
        hasDependencies: boolean;
        outgoingCount: number;
        incomingCount: number;
        totalCount: number;
        outgoing: AssetDependencyResponseDto[];
        incoming: AssetDependencyResponseDto[];
    }>;
    remove(dependencyId: string): Promise<{
        message: string;
    }>;
}
