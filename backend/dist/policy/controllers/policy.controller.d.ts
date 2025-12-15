import { Response } from 'express';
import { PolicyService } from '../services/policy.service';
import { PolicyResponseDto } from '../dto/policy-response.dto';
import { CreatePolicyDto } from '../dto/create-policy.dto';
import { UpdatePolicyDto } from '../dto/update-policy.dto';
import { BulkUpdatePolicyDto } from '../dto/bulk-update-policy.dto';
import { PolicyQueryDto } from '../dto/policy-query.dto';
import { User } from '../../users/entities/user.entity';
export declare class PolicyController {
    private readonly policyService;
    constructor(policyService: PolicyService);
    findAll(query: PolicyQueryDto): Promise<{
        data: PolicyResponseDto[];
        total: number;
        page: number;
        limit: number;
    }>;
    findOne(id: string): Promise<PolicyResponseDto>;
    create(createPolicyDto: CreatePolicyDto, user: User): Promise<PolicyResponseDto>;
    update(id: string, updatePolicyDto: UpdatePolicyDto): Promise<PolicyResponseDto>;
    remove(id: string): Promise<{
        message: string;
    }>;
    bulkUpdateStatus(bulkUpdateDto: BulkUpdatePolicyDto): Promise<{
        updated: number;
        policies: PolicyResponseDto[];
    }>;
    uploadDocument(id: string, file: any): Promise<PolicyResponseDto>;
    getDocument(id: string, res: Response): Promise<void>;
}
