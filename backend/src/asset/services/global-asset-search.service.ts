import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PhysicalAsset } from '../entities/physical-asset.entity';
import { InformationAsset } from '../entities/information-asset.entity';
import { BusinessApplication } from '../entities/business-application.entity';
import { SoftwareAsset } from '../entities/software-asset.entity';
import { Supplier } from '../entities/supplier.entity';
import {
  GlobalAssetSearchQueryDto,
  GlobalAssetSearchResultDto,
  GlobalAssetSearchResponseDto,
  AssetType,
} from '../dto/global-asset-search.dto';

@Injectable()
export class GlobalAssetSearchService {
  constructor(
    @InjectRepository(PhysicalAsset)
    private physicalAssetRepository: Repository<PhysicalAsset>,
    @InjectRepository(InformationAsset)
    private informationAssetRepository: Repository<InformationAsset>,
    @InjectRepository(BusinessApplication)
    private businessApplicationRepository: Repository<BusinessApplication>,
    @InjectRepository(SoftwareAsset)
    private softwareAssetRepository: Repository<SoftwareAsset>,
    @InjectRepository(Supplier)
    private supplierRepository: Repository<Supplier>,
  ) {}

  async search(query: GlobalAssetSearchQueryDto): Promise<GlobalAssetSearchResponseDto> {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const searchTerm = query.q || '';
    const assetType = query.type || AssetType.ALL;

    // Build search conditions for each asset type
    const searchConditions = searchTerm
      ? `%${searchTerm}%`
      : null;

    // Determine which asset types to search
    const typesToSearch: AssetType[] =
      assetType === AssetType.ALL
        ? [
            AssetType.PHYSICAL,
            AssetType.INFORMATION,
            AssetType.APPLICATION,
            AssetType.SOFTWARE,
            AssetType.SUPPLIER,
          ]
        : [assetType];

    const results: GlobalAssetSearchResultDto[] = [];

    // Search Physical Assets
    if (typesToSearch.includes(AssetType.PHYSICAL)) {
      const physicalQuery = this.physicalAssetRepository
        .createQueryBuilder('asset')
        .leftJoinAndSelect('asset.owner', 'owner')
        .leftJoinAndSelect('asset.businessUnit', 'businessUnit')
        .where('asset.deletedAt IS NULL');

      if (searchConditions) {
        physicalQuery.andWhere(
          '(asset.assetDescription ILIKE :search OR asset.uniqueIdentifier ILIKE :search OR asset.serialNumber ILIKE :search)',
          { search: searchConditions },
        );
      }

      if (query.criticality) {
        physicalQuery.andWhere('asset.criticalityLevel = :criticality', {
          criticality: query.criticality,
        });
      }

      if (query.businessUnit) {
        physicalQuery.andWhere('asset.businessUnitId = :businessUnitId', {
          businessUnitId: query.businessUnit,
        });
      }

      const physicalAssets = await physicalQuery.getMany();
      results.push(
        ...physicalAssets.map((asset) => ({
          id: asset.id,
          type: AssetType.PHYSICAL,
          name: asset.assetDescription || asset.uniqueIdentifier,
          identifier: asset.uniqueIdentifier,
          criticality: asset.criticalityLevel,
          owner: asset.owner?.email || (asset.owner?.firstName && asset.owner?.lastName ? `${asset.owner.firstName} ${asset.owner.lastName}` : asset.owner?.firstName || asset.owner?.lastName || null),
          businessUnit: asset.businessUnit?.name || null,
          createdAt: asset.createdAt,
          updatedAt: asset.updatedAt,
        })),
      );
    }

    // Search Information Assets
    if (typesToSearch.includes(AssetType.INFORMATION)) {
      const informationQuery = this.informationAssetRepository
        .createQueryBuilder('asset')
        .leftJoinAndSelect('asset.informationOwner', 'owner')
        .leftJoinAndSelect('asset.businessUnit', 'businessUnit')
        .where('asset.deletedAt IS NULL');

      if (searchConditions) {
        informationQuery.andWhere(
          '(asset.name ILIKE :search OR asset.informationType ILIKE :search)',
          { search: searchConditions },
        );
      }

      if (query.businessUnit) {
        informationQuery.andWhere('asset.businessUnitId = :businessUnitId', {
          businessUnitId: query.businessUnit,
        });
      }

      const informationAssets = await informationQuery.getMany();
      results.push(
        ...informationAssets.map((asset) => ({
          id: asset.id,
          type: AssetType.INFORMATION,
          name: asset.name || asset.id,
          identifier: asset.id,
          criticality: null, // Information assets don't have criticality in plan
          owner: asset.informationOwner?.email || (asset.informationOwner?.firstName && asset.informationOwner?.lastName ? `${asset.informationOwner.firstName} ${asset.informationOwner.lastName}` : asset.informationOwner?.firstName || asset.informationOwner?.lastName || null),
          businessUnit: asset.businessUnit?.name || null,
          createdAt: asset.createdAt,
          updatedAt: asset.updatedAt,
        })),
      );
    }

    // Search Business Applications
    if (typesToSearch.includes(AssetType.APPLICATION)) {
      const applicationQuery = this.businessApplicationRepository
        .createQueryBuilder('app')
        .leftJoinAndSelect('app.owner', 'owner')
        .leftJoinAndSelect('app.businessUnit', 'businessUnit')
        .where('app.deletedAt IS NULL');

      if (searchConditions) {
        applicationQuery.andWhere(
          '(app.applicationName ILIKE :search OR app.applicationType ILIKE :search)',
          { search: searchConditions },
        );
      }

      if (query.criticality) {
        applicationQuery.andWhere('app.criticalityLevel = :criticality', {
          criticality: query.criticality,
        });
      }

      if (query.businessUnit) {
        applicationQuery.andWhere('app.businessUnitId = :businessUnitId', {
          businessUnitId: query.businessUnit,
        });
      }

      const applications = await applicationQuery.getMany();
      results.push(
        ...applications.map((app) => ({
          id: app.id,
          type: AssetType.APPLICATION,
          name: app.applicationName || app.id,
          identifier: app.id,
          criticality: app.criticalityLevel,
          owner: app.owner?.email || (app.owner?.firstName && app.owner?.lastName ? `${app.owner.firstName} ${app.owner.lastName}` : app.owner?.firstName || app.owner?.lastName || null),
          businessUnit: app.businessUnit?.name || null,
          createdAt: app.createdAt,
          updatedAt: app.updatedAt,
        })),
      );
    }

    // Search Software Assets
    if (typesToSearch.includes(AssetType.SOFTWARE)) {
      const softwareQuery = this.softwareAssetRepository
        .createQueryBuilder('software')
        .leftJoinAndSelect('software.owner', 'owner')
        .leftJoinAndSelect('software.businessUnit', 'businessUnit')
        .where('software.deletedAt IS NULL');

      if (searchConditions) {
        softwareQuery.andWhere(
          '(software.softwareName ILIKE :search OR software.softwareType ILIKE :search)',
          { search: searchConditions },
        );
      }

      if (query.businessUnit) {
        softwareQuery.andWhere('software.businessUnitId = :businessUnitId', {
          businessUnitId: query.businessUnit,
        });
      }

      const softwareAssets = await softwareQuery.getMany();
      results.push(
        ...softwareAssets.map((software) => ({
          id: software.id,
          type: AssetType.SOFTWARE,
          name: software.softwareName || software.id,
          identifier: software.id,
          criticality: null, // Software assets don't have criticality in plan
          owner: software.owner?.email || (software.owner?.firstName && software.owner?.lastName ? `${software.owner.firstName} ${software.owner.lastName}` : software.owner?.firstName || software.owner?.lastName || null),
          businessUnit: software.businessUnit?.name || null,
          createdAt: software.createdAt,
          updatedAt: software.updatedAt,
        })),
      );
    }

    // Search Suppliers
    if (typesToSearch.includes(AssetType.SUPPLIER)) {
      const supplierQuery = this.supplierRepository
        .createQueryBuilder('supplier')
        .leftJoinAndSelect('supplier.owner', 'owner')
        .leftJoinAndSelect('supplier.businessUnit', 'businessUnit')
        .where('supplier.deletedAt IS NULL');

      if (searchConditions) {
        supplierQuery.andWhere(
          '(supplier.supplierName ILIKE :search OR supplier.uniqueIdentifier ILIKE :search)',
          { search: searchConditions },
        );
      }

      if (query.criticality) {
        supplierQuery.andWhere('supplier.criticalityLevel = :criticality', {
          criticality: query.criticality,
        });
      }

      if (query.businessUnit) {
        supplierQuery.andWhere('supplier.businessUnitId = :businessUnitId', {
          businessUnitId: query.businessUnit,
        });
      }

      const suppliers = await supplierQuery.getMany();
      results.push(
        ...suppliers.map((supplier) => ({
          id: supplier.id,
          type: AssetType.SUPPLIER,
          name: supplier.supplierName || supplier.uniqueIdentifier,
          identifier: supplier.uniqueIdentifier,
          criticality: supplier.criticalityLevel,
          owner: supplier.owner?.email || (supplier.owner?.firstName && supplier.owner?.lastName ? `${supplier.owner.firstName} ${supplier.owner.lastName}` : supplier.owner?.firstName || supplier.owner?.lastName || null),
          businessUnit: supplier.businessUnit?.name || null,
          createdAt: supplier.createdAt,
          updatedAt: supplier.updatedAt,
        })),
      );
    }

    // Sort by updatedAt (most recent first)
    results.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());

    // Apply pagination
    const total = results.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedResults = results.slice(startIndex, endIndex);

    return {
      data: paginatedResults,
      total,
      page,
      limit,
    };
  }
}

