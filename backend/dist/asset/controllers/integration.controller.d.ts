import { IntegrationService } from '../services/integration.service';
import { CreateIntegrationConfigDto } from '../dto/create-integration-config.dto';
import { UpdateIntegrationConfigDto } from '../dto/update-integration-config.dto';
import { IntegrationConfigResponseDto } from '../dto/integration-config-response.dto';
import { User } from '../../users/entities/user.entity';
export declare class IntegrationController {
    private readonly integrationService;
    constructor(integrationService: IntegrationService);
    create(dto: CreateIntegrationConfigDto, user: User): Promise<IntegrationConfigResponseDto>;
    findAll(): Promise<IntegrationConfigResponseDto[]>;
    findOne(id: string): Promise<IntegrationConfigResponseDto>;
    update(id: string, dto: UpdateIntegrationConfigDto): Promise<IntegrationConfigResponseDto>;
    delete(id: string): Promise<void>;
    testConnection(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    sync(id: string): Promise<any>;
    handleWebhook(id: string, payload: any): Promise<any>;
    getSyncHistory(id: string, limit?: number): Promise<any[]>;
    private mapToResponseDto;
}
