import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AssetType, AssetCategory } from '../entities/asset-type.entity';
import { CreateAssetTypeDto } from '../dto/create-asset-type.dto';
import { UpdateAssetTypeDto } from '../dto/update-asset-type.dto';

@Injectable()
export class AssetTypeService {
  constructor(
    @InjectRepository(AssetType)
    private assetTypeRepository: Repository<AssetType>,
  ) { }

  async findAll(category?: AssetCategory): Promise<AssetType[]> {
    // RLS handles filtering, we just need to optionally filter by category
    const where: any = { isActive: true };
    if (category) {
      where.category = category;
    }

    return this.assetTypeRepository.find({
      where,
      order: { name: 'ASC' },
    });
  }

  async findOne(id: string): Promise<AssetType> {
    return this.assetTypeRepository.findOne({
      where: { id, isActive: true },
    });
  }

  async create(createDto: CreateAssetTypeDto): Promise<AssetType> {
    const assetType = this.assetTypeRepository.create(createDto);
    return this.assetTypeRepository.save(assetType);
  }

  async update(id: string, updateDto: UpdateAssetTypeDto): Promise<AssetType> {
    await this.assetTypeRepository.update(id, updateDto as any);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.assetTypeRepository.update(id, { isActive: false });
  }
}



