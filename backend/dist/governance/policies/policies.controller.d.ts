import { Response } from 'express';
import { PoliciesService } from './policies.service';
import { CreatePolicyDto } from './dto/create-policy.dto';
import { UpdatePolicyDto } from './dto/update-policy.dto';
import { PolicyQueryDto } from './dto/policy-query.dto';
export declare class PoliciesController {
    private readonly policiesService;
    constructor(policiesService: PoliciesService);
    create(createPolicyDto: CreatePolicyDto, req: any): Promise<import("./entities/policy.entity").Policy>;
    findAll(queryDto: PolicyQueryDto): Promise<{
        data: import("./entities/policy.entity").Policy[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<import("./entities/policy.entity").Policy>;
    getVersions(id: string): Promise<{
        data: import("./entities/policy.entity").Policy[];
    }>;
    update(id: string, updatePolicyDto: UpdatePolicyDto, req: any): Promise<import("./entities/policy.entity").Policy>;
    remove(id: string): Promise<void>;
    uploadAttachment(id: string, file: Express.Multer.File, req: any): Promise<{
        message: string;
        attachment: {
            filename: string;
            path: string;
            upload_date: string;
            uploaded_by: any;
        };
    }>;
    downloadAttachment(filename: string, res: Response): Promise<void>;
}
