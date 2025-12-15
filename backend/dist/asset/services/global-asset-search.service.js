"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalAssetSearchService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const physical_asset_entity_1 = require("../entities/physical-asset.entity");
const information_asset_entity_1 = require("../entities/information-asset.entity");
const business_application_entity_1 = require("../entities/business-application.entity");
const software_asset_entity_1 = require("../entities/software-asset.entity");
const supplier_entity_1 = require("../entities/supplier.entity");
const global_asset_search_dto_1 = require("../dto/global-asset-search.dto");
let GlobalAssetSearchService = class GlobalAssetSearchService {
    constructor(physicalAssetRepository, informationAssetRepository, businessApplicationRepository, softwareAssetRepository, supplierRepository) {
        this.physicalAssetRepository = physicalAssetRepository;
        this.informationAssetRepository = informationAssetRepository;
        this.businessApplicationRepository = businessApplicationRepository;
        this.softwareAssetRepository = softwareAssetRepository;
        this.supplierRepository = supplierRepository;
    }
    async search(query) {
        const page = query.page || 1;
        const limit = query.limit || 20;
        const searchTerm = query.q || '';
        const assetType = query.type || global_asset_search_dto_1.AssetType.ALL;
        const searchConditions = searchTerm
            ? `%${searchTerm}%`
            : null;
        const typesToSearch = assetType === global_asset_search_dto_1.AssetType.ALL
            ? [
                global_asset_search_dto_1.AssetType.PHYSICAL,
                global_asset_search_dto_1.AssetType.INFORMATION,
                global_asset_search_dto_1.AssetType.APPLICATION,
                global_asset_search_dto_1.AssetType.SOFTWARE,
                global_asset_search_dto_1.AssetType.SUPPLIER,
            ]
            : [assetType];
        const results = [];
        if (typesToSearch.includes(global_asset_search_dto_1.AssetType.PHYSICAL)) {
            const physicalQuery = this.physicalAssetRepository
                .createQueryBuilder('asset')
                .leftJoinAndSelect('asset.owner', 'owner')
                .leftJoinAndSelect('asset.businessUnit', 'businessUnit')
                .where('asset.deletedAt IS NULL');
            if (searchConditions) {
                physicalQuery.andWhere('(asset.assetDescription ILIKE :search OR asset.uniqueIdentifier ILIKE :search OR asset.serialNumber ILIKE :search)', { search: searchConditions });
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
            results.push(...physicalAssets.map((asset) => {
                var _a, _b, _c, _d, _e, _f;
                return ({
                    id: asset.id,
                    type: global_asset_search_dto_1.AssetType.PHYSICAL,
                    name: asset.assetDescription || asset.uniqueIdentifier,
                    identifier: asset.uniqueIdentifier,
                    criticality: asset.criticalityLevel,
                    owner: ((_a = asset.owner) === null || _a === void 0 ? void 0 : _a.email) || (((_b = asset.owner) === null || _b === void 0 ? void 0 : _b.firstName) && ((_c = asset.owner) === null || _c === void 0 ? void 0 : _c.lastName) ? `${asset.owner.firstName} ${asset.owner.lastName}` : ((_d = asset.owner) === null || _d === void 0 ? void 0 : _d.firstName) || ((_e = asset.owner) === null || _e === void 0 ? void 0 : _e.lastName) || null),
                    businessUnit: ((_f = asset.businessUnit) === null || _f === void 0 ? void 0 : _f.name) || null,
                    createdAt: asset.createdAt,
                    updatedAt: asset.updatedAt,
                });
            }));
        }
        if (typesToSearch.includes(global_asset_search_dto_1.AssetType.INFORMATION)) {
            const informationQuery = this.informationAssetRepository
                .createQueryBuilder('asset')
                .leftJoinAndSelect('asset.informationOwner', 'owner')
                .leftJoinAndSelect('asset.businessUnit', 'businessUnit')
                .where('asset.deletedAt IS NULL');
            if (searchConditions) {
                informationQuery.andWhere('(asset.name ILIKE :search OR asset.informationType ILIKE :search)', { search: searchConditions });
            }
            if (query.businessUnit) {
                informationQuery.andWhere('asset.businessUnitId = :businessUnitId', {
                    businessUnitId: query.businessUnit,
                });
            }
            const informationAssets = await informationQuery.getMany();
            results.push(...informationAssets.map((asset) => {
                var _a, _b, _c, _d, _e, _f;
                return ({
                    id: asset.id,
                    type: global_asset_search_dto_1.AssetType.INFORMATION,
                    name: asset.name || asset.id,
                    identifier: asset.id,
                    criticality: null,
                    owner: ((_a = asset.informationOwner) === null || _a === void 0 ? void 0 : _a.email) || (((_b = asset.informationOwner) === null || _b === void 0 ? void 0 : _b.firstName) && ((_c = asset.informationOwner) === null || _c === void 0 ? void 0 : _c.lastName) ? `${asset.informationOwner.firstName} ${asset.informationOwner.lastName}` : ((_d = asset.informationOwner) === null || _d === void 0 ? void 0 : _d.firstName) || ((_e = asset.informationOwner) === null || _e === void 0 ? void 0 : _e.lastName) || null),
                    businessUnit: ((_f = asset.businessUnit) === null || _f === void 0 ? void 0 : _f.name) || null,
                    createdAt: asset.createdAt,
                    updatedAt: asset.updatedAt,
                });
            }));
        }
        if (typesToSearch.includes(global_asset_search_dto_1.AssetType.APPLICATION)) {
            const applicationQuery = this.businessApplicationRepository
                .createQueryBuilder('app')
                .leftJoinAndSelect('app.owner', 'owner')
                .leftJoinAndSelect('app.businessUnit', 'businessUnit')
                .where('app.deletedAt IS NULL');
            if (searchConditions) {
                applicationQuery.andWhere('(app.applicationName ILIKE :search OR app.applicationType ILIKE :search)', { search: searchConditions });
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
            results.push(...applications.map((app) => {
                var _a, _b, _c, _d, _e, _f;
                return ({
                    id: app.id,
                    type: global_asset_search_dto_1.AssetType.APPLICATION,
                    name: app.applicationName || app.id,
                    identifier: app.id,
                    criticality: app.criticalityLevel,
                    owner: ((_a = app.owner) === null || _a === void 0 ? void 0 : _a.email) || (((_b = app.owner) === null || _b === void 0 ? void 0 : _b.firstName) && ((_c = app.owner) === null || _c === void 0 ? void 0 : _c.lastName) ? `${app.owner.firstName} ${app.owner.lastName}` : ((_d = app.owner) === null || _d === void 0 ? void 0 : _d.firstName) || ((_e = app.owner) === null || _e === void 0 ? void 0 : _e.lastName) || null),
                    businessUnit: ((_f = app.businessUnit) === null || _f === void 0 ? void 0 : _f.name) || null,
                    createdAt: app.createdAt,
                    updatedAt: app.updatedAt,
                });
            }));
        }
        if (typesToSearch.includes(global_asset_search_dto_1.AssetType.SOFTWARE)) {
            const softwareQuery = this.softwareAssetRepository
                .createQueryBuilder('software')
                .leftJoinAndSelect('software.owner', 'owner')
                .leftJoinAndSelect('software.businessUnit', 'businessUnit')
                .where('software.deletedAt IS NULL');
            if (searchConditions) {
                softwareQuery.andWhere('(software.softwareName ILIKE :search OR software.softwareType ILIKE :search)', { search: searchConditions });
            }
            if (query.businessUnit) {
                softwareQuery.andWhere('software.businessUnitId = :businessUnitId', {
                    businessUnitId: query.businessUnit,
                });
            }
            const softwareAssets = await softwareQuery.getMany();
            results.push(...softwareAssets.map((software) => {
                var _a, _b, _c, _d, _e, _f;
                return ({
                    id: software.id,
                    type: global_asset_search_dto_1.AssetType.SOFTWARE,
                    name: software.softwareName || software.id,
                    identifier: software.id,
                    criticality: null,
                    owner: ((_a = software.owner) === null || _a === void 0 ? void 0 : _a.email) || (((_b = software.owner) === null || _b === void 0 ? void 0 : _b.firstName) && ((_c = software.owner) === null || _c === void 0 ? void 0 : _c.lastName) ? `${software.owner.firstName} ${software.owner.lastName}` : ((_d = software.owner) === null || _d === void 0 ? void 0 : _d.firstName) || ((_e = software.owner) === null || _e === void 0 ? void 0 : _e.lastName) || null),
                    businessUnit: ((_f = software.businessUnit) === null || _f === void 0 ? void 0 : _f.name) || null,
                    createdAt: software.createdAt,
                    updatedAt: software.updatedAt,
                });
            }));
        }
        if (typesToSearch.includes(global_asset_search_dto_1.AssetType.SUPPLIER)) {
            const supplierQuery = this.supplierRepository
                .createQueryBuilder('supplier')
                .leftJoinAndSelect('supplier.owner', 'owner')
                .leftJoinAndSelect('supplier.businessUnit', 'businessUnit')
                .where('supplier.deletedAt IS NULL');
            if (searchConditions) {
                supplierQuery.andWhere('(supplier.supplierName ILIKE :search OR supplier.uniqueIdentifier ILIKE :search)', { search: searchConditions });
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
            results.push(...suppliers.map((supplier) => {
                var _a, _b, _c, _d, _e, _f;
                return ({
                    id: supplier.id,
                    type: global_asset_search_dto_1.AssetType.SUPPLIER,
                    name: supplier.supplierName || supplier.uniqueIdentifier,
                    identifier: supplier.uniqueIdentifier,
                    criticality: supplier.criticalityLevel,
                    owner: ((_a = supplier.owner) === null || _a === void 0 ? void 0 : _a.email) || (((_b = supplier.owner) === null || _b === void 0 ? void 0 : _b.firstName) && ((_c = supplier.owner) === null || _c === void 0 ? void 0 : _c.lastName) ? `${supplier.owner.firstName} ${supplier.owner.lastName}` : ((_d = supplier.owner) === null || _d === void 0 ? void 0 : _d.firstName) || ((_e = supplier.owner) === null || _e === void 0 ? void 0 : _e.lastName) || null),
                    businessUnit: ((_f = supplier.businessUnit) === null || _f === void 0 ? void 0 : _f.name) || null,
                    createdAt: supplier.createdAt,
                    updatedAt: supplier.updatedAt,
                });
            }));
        }
        results.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
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
};
exports.GlobalAssetSearchService = GlobalAssetSearchService;
exports.GlobalAssetSearchService = GlobalAssetSearchService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(physical_asset_entity_1.PhysicalAsset)),
    __param(1, (0, typeorm_1.InjectRepository)(information_asset_entity_1.InformationAsset)),
    __param(2, (0, typeorm_1.InjectRepository)(business_application_entity_1.BusinessApplication)),
    __param(3, (0, typeorm_1.InjectRepository)(software_asset_entity_1.SoftwareAsset)),
    __param(4, (0, typeorm_1.InjectRepository)(supplier_entity_1.Supplier)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], GlobalAssetSearchService);
//# sourceMappingURL=global-asset-search.service.js.map