import { PolicyExceptionsService } from './policy-exceptions.service';
import { CreatePolicyExceptionDto } from './dto/create-policy-exception.dto';
import { UpdatePolicyExceptionDto } from './dto/update-policy-exception.dto';
import { QueryPolicyExceptionDto } from './dto/query-policy-exception.dto';
export declare class PolicyExceptionsController {
    private readonly exceptionsService;
    constructor(exceptionsService: PolicyExceptionsService);
    create(dto: CreatePolicyExceptionDto, req: any): Promise<import("./entities/policy-exception.entity").PolicyException>;
    findAll(query: QueryPolicyExceptionDto): Promise<{
        data: import("./entities/policy-exception.entity").PolicyException[];
        total: number;
        page: number;
        limit: number;
    }>;
    findOne(id: string): Promise<import("./entities/policy-exception.entity").PolicyException>;
    update(id: string, dto: UpdatePolicyExceptionDto, req: any): Promise<import("./entities/policy-exception.entity").PolicyException>;
    delete(id: string): Promise<{
        message: string;
    }>;
    approve(id: string, body: {
        conditions?: string;
    }, req: any): Promise<import("./entities/policy-exception.entity").PolicyException>;
    reject(id: string, body: {
        reason: string;
    }, req: any): Promise<import("./entities/policy-exception.entity").PolicyException>;
}
