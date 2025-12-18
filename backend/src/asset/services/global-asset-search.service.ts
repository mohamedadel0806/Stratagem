import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
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
  private readonly logger = new Logger(GlobalAssetSearchService.name);

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
    try {
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
      try {
        const physicalQuery = this.physicalAssetRepository
          .createQueryBuilder('asset')
          .leftJoin('asset.owner', 'owner')
          .leftJoin('asset.businessUnit', 'businessUnit')
          .select([
            'asset.id',
            'asset.assetDescription',
            'asset.uniqueIdentifier',
            'asset.criticalityLevel',
            'asset.createdAt',
            'asset.updatedAt',
            'owner.id',
            'owner.email',
            'owner.firstName',
            'owner.lastName',
            'businessUnit.id',
            'businessUnit.name',
          ])
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
      } catch (error: any) {
        this.logger.error(`Error searching physical assets: ${error?.message}`, error?.stack);
        // Continue with other asset types even if one fails
      }
    }

    // Search Information Assets
    if (typesToSearch.includes(AssetType.INFORMATION)) {
      try {
        const informationQuery = this.informationAssetRepository
        .createQueryBuilder('asset')
        .leftJoin('asset.informationOwner', 'owner')
        .leftJoin('asset.businessUnit', 'businessUnit')
        .select([
          'asset.id',
          'asset.name',
          'asset.informationType',
          'asset.createdAt',
          'asset.updatedAt',
          'owner.id',
          'owner.email',
          'owner.firstName',
          'owner.lastName',
          'businessUnit.id',
          'businessUnit.name',
        ])
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
      } catch (error: any) {
        this.logger.error(`Error searching information assets: ${error?.message}`, error?.stack);
        // Continue with other asset types even if one fails
      }
    }

    // Search Business Applications
    if (typesToSearch.includes(AssetType.APPLICATION)) {
      try {
        const applicationQuery = this.businessApplicationRepository
        .createQueryBuilder('app')
        .leftJoin('app.owner', 'owner')
        .leftJoin('app.businessUnit', 'businessUnit')
        .select([
          'app.id',
          'app.applicationName',
          'app.applicationType',
          'app.criticalityLevel',
          'app.createdAt',
          'app.updatedAt',
          'owner.id',
          'owner.email',
          'owner.firstName',
          'owner.lastName',
          'businessUnit.id',
          'businessUnit.name',
        ])
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
      } catch (error: any) {
        this.logger.error(`Error searching business applications: ${error?.message}`, error?.stack);
        // Continue with other asset types even if one fails
      }
    }

    // Search Software Assets
    if (typesToSearch.includes(AssetType.SOFTWARE)) {
      try {
        const softwareQuery = this.softwareAssetRepository
        .createQueryBuilder('software')
        .leftJoin('software.owner', 'owner')
        .leftJoin('software.businessUnit', 'businessUnit')
        .select([
          'software.id',
          'software.softwareName',
          'software.softwareType',
          'software.createdAt',
          'software.updatedAt',
          'owner.id',
          'owner.email',
          'owner.firstName',
          'owner.lastName',
          'businessUnit.id',
          'businessUnit.name',
        ])
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
      } catch (error: any) {
        this.logger.error(`Error searching software assets: ${error?.message}`, error?.stack);
        // Continue with other asset types even if one fails
      }
    }

    // Search Suppliers
    if (typesToSearch.includes(AssetType.SUPPLIER)) {
      try {
        const supplierQuery = this.supplierRepository
        .createQueryBuilder('supplier')
        .leftJoin('supplier.owner', 'owner')
        .leftJoin('supplier.businessUnit', 'businessUnit')
        .select([
          'supplier.id',
          'supplier.supplierName',
          'supplier.uniqueIdentifier',
          'supplier.criticalityLevel',
          'supplier.createdAt',
          'supplier.updatedAt',
          'owner.id',
          'owner.email',
          'owner.firstName',
          'owner.lastName',
          'businessUnit.id',
          'businessUnit.name',
        ])
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
      } catch (error: any) {
        this.logger.error(`Error searching suppliers: ${error?.message}`, error?.stack);
        // Continue with other asset types even if one fails
      }
    }

    // Sort by updatedAt (most recent first), handle null values
    results.sort((a, b) => {
      const timeA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
      const timeB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
      return timeB - timeA;
    });

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
    } catch (error: any) {
      this.logger.error(`Error in global asset search: ${error?.message}`, error?.stack);
      // Re-throw as InternalServerErrorException for better error handling
      throw new InternalServerErrorException(
        `Global asset search failed: ${error?.message || 'Unknown error'}`,
      );
    }
  }
}

