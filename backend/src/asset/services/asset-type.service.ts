import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AssetType, AssetCategory } from '../entities/asset-type.entity';

@Injectable()
export class AssetTypeService {
  constructor(
    @InjectRepository(AssetType)
    private assetTypeRepository: Repository<AssetType>,
  ) {}

  async findAll(category?: AssetCategory): Promise<AssetType[]> {
    const queryBuilder = this.assetTypeRepository
      .createQueryBuilder('assetType')
      .where('assetType.isActive = :isActive', { isActive: true });

    if (category) {
      queryBuilder.andWhere('assetType.category = :category', { category });
    }

    return queryBuilder.orderBy('assetType.name', 'ASC').getMany();
  }

  async findOne(id: string): Promise<AssetType> {
    return this.assetTypeRepository.findOne({
      where: { id, isActive: true },
    });
  }
}



