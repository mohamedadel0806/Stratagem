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
exports.AssetDependencyService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const asset_dependency_entity_1 = require("../entities/asset-dependency.entity");
const physical_asset_entity_1 = require("../entities/physical-asset.entity");
const information_asset_entity_1 = require("../entities/information-asset.entity");
const business_application_entity_1 = require("../entities/business-application.entity");
const software_asset_entity_1 = require("../entities/software-asset.entity");
const supplier_entity_1 = require("../entities/supplier.entity");
let AssetDependencyService = class AssetDependencyService {
    constructor(dependencyRepository, physicalAssetRepository, informationAssetRepository, businessApplicationRepository, softwareAssetRepository, supplierRepository) {
        this.dependencyRepository = dependencyRepository;
        this.physicalAssetRepository = physicalAssetRepository;
        this.informationAssetRepository = informationAssetRepository;
        this.businessApplicationRepository = businessApplicationRepository;
        this.softwareAssetRepository = softwareAssetRepository;
        this.supplierRepository = supplierRepository;
    }
    async getAssetNameAndIdentifier(assetType, assetId) {
        let asset;
        switch (assetType) {
            case asset_dependency_entity_1.AssetType.PHYSICAL:
                asset = await this.physicalAssetRepository.findOne({
                    where: { id: assetId, deletedAt: null },
                });
                if (!asset)
                    throw new common_1.NotFoundException(`Physical asset with ID ${assetId} not found`);
                return {
                    name: asset.assetDescription || asset.uniqueIdentifier,
                    identifier: asset.uniqueIdentifier,
                };
            case asset_dependency_entity_1.AssetType.INFORMATION:
                asset = await this.informationAssetRepository.findOne({
                    where: { id: assetId, deletedAt: null },
                });
                if (!asset)
                    throw new common_1.NotFoundException(`Information asset with ID ${assetId} not found`);
                return {
                    name: asset.name || asset.id,
                    identifier: asset.id,
                };
            case asset_dependency_entity_1.AssetType.APPLICATION:
                asset = await this.businessApplicationRepository.findOne({
                    where: { id: assetId, deletedAt: null },
                });
                if (!asset)
                    throw new common_1.NotFoundException(`Application with ID ${assetId} not found`);
                return {
                    name: asset.applicationName || asset.id,
                    identifier: asset.id,
                };
            case asset_dependency_entity_1.AssetType.SOFTWARE:
                asset = await this.softwareAssetRepository.findOne({
                    where: { id: assetId, deletedAt: null },
                });
                if (!asset)
                    throw new common_1.NotFoundException(`Software asset with ID ${assetId} not found`);
                return {
                    name: asset.softwareName || asset.id,
                    identifier: asset.id,
                };
            case asset_dependency_entity_1.AssetType.SUPPLIER:
                asset = await this.supplierRepository.findOne({
                    where: { id: assetId, deletedAt: null },
                });
                if (!asset)
                    throw new common_1.NotFoundException(`Supplier with ID ${assetId} not found`);
                return {
                    name: asset.supplierName || asset.uniqueIdentifier,
                    identifier: asset.uniqueIdentifier,
                };
            default:
                throw new common_1.BadRequestException(`Invalid asset type: ${assetType}`);
        }
    }
    async create(sourceAssetType, sourceAssetId, createDto, userId) {
        if (sourceAssetType === createDto.targetAssetType &&
            sourceAssetId === createDto.targetAssetId) {
            throw new common_1.BadRequestException('An asset cannot depend on itself');
        }
        const existing = await this.dependencyRepository.findOne({
            where: {
                sourceAssetType,
                sourceAssetId,
                targetAssetType: createDto.targetAssetType,
                targetAssetId: createDto.targetAssetId,
            },
        });
        if (existing) {
            throw new common_1.ConflictException('This dependency already exists');
        }
        await this.getAssetNameAndIdentifier(sourceAssetType, sourceAssetId);
        await this.getAssetNameAndIdentifier(createDto.targetAssetType, createDto.targetAssetId);
        const dependency = this.dependencyRepository.create({
            sourceAssetType,
            sourceAssetId,
            targetAssetType: createDto.targetAssetType,
            targetAssetId: createDto.targetAssetId,
            relationshipType: createDto.relationshipType,
            description: createDto.description,
            createdById: userId,
        });
        const saved = await this.dependencyRepository.save(dependency);
        const [sourceInfo, targetInfo] = await Promise.all([
            this.getAssetNameAndIdentifier(sourceAssetType, sourceAssetId),
            this.getAssetNameAndIdentifier(createDto.targetAssetType, createDto.targetAssetId),
        ]);
        return this.toResponseDto(saved, sourceInfo, targetInfo);
    }
    async findAll(assetType, assetId) {
        const sourceInfo = await this.getAssetNameAndIdentifier(assetType, assetId);
        const dependencies = await this.dependencyRepository.find({
            where: {
                sourceAssetType: assetType,
                sourceAssetId: assetId,
            },
            order: {
                createdAt: 'DESC',
            },
        });
        const targetInfos = await Promise.all(dependencies.map((dep) => this.getAssetNameAndIdentifier(dep.targetAssetType, dep.targetAssetId)));
        return dependencies.map((dep, index) => this.toResponseDto(dep, sourceInfo, targetInfos[index]));
    }
    async findIncoming(assetType, assetId) {
        const targetInfo = await this.getAssetNameAndIdentifier(assetType, assetId);
        const dependencies = await this.dependencyRepository.find({
            where: {
                targetAssetType: assetType,
                targetAssetId: assetId,
            },
            order: {
                createdAt: 'DESC',
            },
        });
        const sourceInfos = await Promise.all(dependencies.map((dep) => this.getAssetNameAndIdentifier(dep.sourceAssetType, dep.sourceAssetId)));
        return dependencies.map((dep, index) => this.toResponseDto(dep, sourceInfos[index], targetInfo));
    }
    async remove(dependencyId) {
        const dependency = await this.dependencyRepository.findOne({
            where: { id: dependencyId },
        });
        if (!dependency) {
            throw new common_1.NotFoundException(`Dependency with ID ${dependencyId} not found`);
        }
        await this.dependencyRepository.remove(dependency);
    }
    async checkDependencies(assetType, assetId) {
        let assetInfo;
        try {
            assetInfo = await this.getAssetNameAndIdentifier(assetType, assetId);
        }
        catch (e) {
            return {
                hasDependencies: false,
                outgoingCount: 0,
                incomingCount: 0,
                totalCount: 0,
                outgoing: [],
                incoming: [],
            };
        }
        const outgoingDeps = await this.dependencyRepository.find({
            where: {
                sourceAssetType: assetType,
                sourceAssetId: assetId,
            },
            take: 10,
        });
        const incomingDeps = await this.dependencyRepository.find({
            where: {
                targetAssetType: assetType,
                targetAssetId: assetId,
            },
            take: 10,
        });
        const [outgoingCount, incomingCount] = await Promise.all([
            this.dependencyRepository.count({
                where: { sourceAssetType: assetType, sourceAssetId: assetId },
            }),
            this.dependencyRepository.count({
                where: { targetAssetType: assetType, targetAssetId: assetId },
            }),
        ]);
        const outgoingDtos = await Promise.all(outgoingDeps.map(async (dep) => {
            const targetInfo = await this.getAssetNameAndIdentifier(dep.targetAssetType, dep.targetAssetId);
            return this.toResponseDto(dep, assetInfo, targetInfo);
        }));
        const incomingDtos = await Promise.all(incomingDeps.map(async (dep) => {
            const sourceInfo = await this.getAssetNameAndIdentifier(dep.sourceAssetType, dep.sourceAssetId);
            return this.toResponseDto(dep, sourceInfo, assetInfo);
        }));
        return {
            hasDependencies: outgoingCount > 0 || incomingCount > 0,
            outgoingCount,
            incomingCount,
            totalCount: outgoingCount + incomingCount,
            outgoing: outgoingDtos,
            incoming: incomingDtos,
        };
    }
    async getDependencyChain(assetType, assetId, maxDepth = 3, direction = 'outgoing') {
        await this.getAssetNameAndIdentifier(assetType, assetId);
        const visited = new Set();
        const chain = [];
        const queue = [
            [assetType, assetId, 0, []],
        ];
        let maxDepthReached = 0;
        while (queue.length > 0) {
            const [currentType, currentId, depth, path] = queue.shift();
            const nodeKey = `${currentType}:${currentId}`;
            if (visited.has(nodeKey) || depth > maxDepth) {
                continue;
            }
            visited.add(nodeKey);
            maxDepthReached = Math.max(maxDepthReached, depth);
            if (depth > 0) {
                const assetInfo = await this.getAssetNameAndIdentifier(currentType, currentId);
                chain.push({
                    assetType: currentType,
                    assetId: currentId,
                    assetName: assetInfo.name,
                    assetIdentifier: assetInfo.identifier,
                    depth,
                    path: [...path],
                });
            }
            if (depth >= maxDepth) {
                continue;
            }
            if (direction === 'outgoing' || direction === 'both') {
                const outgoingDeps = await this.dependencyRepository.find({
                    where: {
                        sourceAssetType: currentType,
                        sourceAssetId: currentId,
                    },
                });
                for (const dep of outgoingDeps) {
                    const nextKey = `${dep.targetAssetType}:${dep.targetAssetId}`;
                    if (!visited.has(nextKey)) {
                        queue.push([
                            dep.targetAssetType,
                            dep.targetAssetId,
                            depth + 1,
                            [...path, { assetType: currentType, assetId: currentId }],
                        ]);
                    }
                }
            }
            if (direction === 'incoming' || direction === 'both') {
                const incomingDeps = await this.dependencyRepository.find({
                    where: {
                        targetAssetType: currentType,
                        targetAssetId: currentId,
                    },
                });
                for (const dep of incomingDeps) {
                    const nextKey = `${dep.sourceAssetType}:${dep.sourceAssetId}`;
                    if (!visited.has(nextKey)) {
                        queue.push([
                            dep.sourceAssetType,
                            dep.sourceAssetId,
                            depth + 1,
                            [...path, { assetType: currentType, assetId: currentId }],
                        ]);
                    }
                }
            }
        }
        return {
            chain,
            totalCount: chain.length,
            maxDepthReached,
        };
    }
    toResponseDto(dependency, sourceInfo, targetInfo) {
        return {
            id: dependency.id,
            sourceAssetType: dependency.sourceAssetType,
            sourceAssetId: dependency.sourceAssetId,
            sourceAssetName: sourceInfo.name,
            sourceAssetIdentifier: sourceInfo.identifier,
            targetAssetType: dependency.targetAssetType,
            targetAssetId: dependency.targetAssetId,
            targetAssetName: targetInfo.name,
            targetAssetIdentifier: targetInfo.identifier,
            relationshipType: dependency.relationshipType,
            description: dependency.description,
            createdAt: dependency.createdAt,
            updatedAt: dependency.updatedAt,
        };
    }
};
exports.AssetDependencyService = AssetDependencyService;
exports.AssetDependencyService = AssetDependencyService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(asset_dependency_entity_1.AssetDependency)),
    __param(1, (0, typeorm_1.InjectRepository)(physical_asset_entity_1.PhysicalAsset)),
    __param(2, (0, typeorm_1.InjectRepository)(information_asset_entity_1.InformationAsset)),
    __param(3, (0, typeorm_1.InjectRepository)(business_application_entity_1.BusinessApplication)),
    __param(4, (0, typeorm_1.InjectRepository)(software_asset_entity_1.SoftwareAsset)),
    __param(5, (0, typeorm_1.InjectRepository)(supplier_entity_1.Supplier)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], AssetDependencyService);
//# sourceMappingURL=asset-dependency.service.js.map