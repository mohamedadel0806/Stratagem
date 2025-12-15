import { BusinessUnitService } from '../services/business-unit.service';
import { BusinessUnit } from '../entities/business-unit.entity';
export declare class BusinessUnitController {
    private readonly businessUnitService;
    constructor(businessUnitService: BusinessUnitService);
    findAll(): Promise<BusinessUnit[]>;
    findOne(id: string): Promise<BusinessUnit>;
}
