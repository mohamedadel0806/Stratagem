import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessUnit } from '../entities/business-unit.entity';

@Injectable()
export class BusinessUnitService {
  constructor(
    @InjectRepository(BusinessUnit)
    private businessUnitRepository: Repository<BusinessUnit>,
  ) {}

  async findAll(): Promise<BusinessUnit[]> {
    return this.businessUnitRepository.find({
      where: { deletedAt: null },
      order: { name: 'ASC' },
    });
  }

  async findOne(id: string): Promise<BusinessUnit> {
    return this.businessUnitRepository.findOne({
      where: { id, deletedAt: null },
    });
  }
}



