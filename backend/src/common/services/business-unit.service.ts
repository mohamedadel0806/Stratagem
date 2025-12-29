import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { BusinessUnit } from '../entities/business-unit.entity';
import { CreateBusinessUnitDto } from '../dto/create-business-unit.dto';
import { UpdateBusinessUnitDto } from '../dto/update-business-unit.dto';

@Injectable()
export class BusinessUnitService {
  constructor(
    @InjectRepository(BusinessUnit)
    private businessUnitRepository: Repository<BusinessUnit>,
  ) { }

  async findAll(): Promise<BusinessUnit[]> {
    return this.businessUnitRepository.find({
      where: { deletedAt: IsNull() },
      order: { name: 'ASC' },
    });
  }

  async findOne(id: string): Promise<BusinessUnit> {
    return this.businessUnitRepository.findOne({
      where: { id, deletedAt: IsNull() },
    });
  }

  async create(createDto: CreateBusinessUnitDto): Promise<BusinessUnit> {
    const unit = this.businessUnitRepository.create(createDto);
    return this.businessUnitRepository.save(unit);
  }

  async update(id: string, updateDto: UpdateBusinessUnitDto): Promise<BusinessUnit> {
    await this.businessUnitRepository.update(id, updateDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.businessUnitRepository.update(id, { deletedAt: new Date() });
  }
}
