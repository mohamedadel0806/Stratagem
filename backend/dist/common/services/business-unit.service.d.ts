import { Repository } from 'typeorm';
import { BusinessUnit } from '../entities/business-unit.entity';
export declare class BusinessUnitService {
    private businessUnitRepository;
    constructor(businessUnitRepository: Repository<BusinessUnit>);
    findAll(): Promise<BusinessUnit[]>;
    findOne(id: string): Promise<BusinessUnit>;
}
