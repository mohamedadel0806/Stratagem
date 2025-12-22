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
var SOPVersionsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SOPVersionsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const sop_version_entity_1 = require("../entities/sop-version.entity");
const sop_entity_1 = require("../entities/sop.entity");
let SOPVersionsService = SOPVersionsService_1 = class SOPVersionsService {
    constructor(versionRepository, sopRepository) {
        this.versionRepository = versionRepository;
        this.sopRepository = sopRepository;
        this.logger = new common_1.Logger(SOPVersionsService_1.name);
    }
    async create(createDto, userId) {
        const sop = await this.sopRepository.findOne({ where: { id: createDto.sop_id } });
        if (!sop) {
            throw new common_1.NotFoundException(`SOP with ID ${createDto.sop_id} not found`);
        }
        const existing = await this.versionRepository.findOne({
            where: {
                sop_id: createDto.sop_id,
                version_number: createDto.version_number,
            },
        });
        if (existing) {
            throw new common_1.BadRequestException(`Version ${createDto.version_number} already exists for this SOP`);
        }
        const version = this.versionRepository.create(Object.assign(Object.assign({}, createDto), { created_by: userId, status: sop_version_entity_1.VersionStatus.DRAFT }));
        return this.versionRepository.save(version);
    }
    async findAll(queryDto) {
        const { page = 1, limit = 25, sop_id, status, sort } = queryDto;
        const skip = (page - 1) * limit;
        const queryBuilder = this.versionRepository
            .createQueryBuilder('version')
            .leftJoinAndSelect('version.sop', 'sop')
            .leftJoinAndSelect('version.creator', 'creator')
            .leftJoinAndSelect('version.updater', 'updater')
            .leftJoinAndSelect('version.approver', 'approver')
            .leftJoinAndSelect('version.publisher', 'publisher');
        if (sop_id) {
            queryBuilder.andWhere('version.sop_id = :sop_id', { sop_id });
        }
        if (status) {
            queryBuilder.andWhere('version.status = :status', { status });
        }
        if (sort) {
            const [field, order] = sort.split(':');
            queryBuilder.orderBy(`version.${field}`, order.toUpperCase());
        }
        else {
            queryBuilder.orderBy('version.created_at', 'DESC');
        }
        const [data, total] = await queryBuilder
            .skip(skip)
            .take(limit)
            .getManyAndCount();
        return {
            data,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async findOne(id) {
        const version = await this.versionRepository.findOne({
            where: { id },
            relations: ['sop', 'creator', 'updater', 'approver', 'publisher'],
        });
        if (!version) {
            throw new common_1.NotFoundException(`SOP version with ID ${id} not found`);
        }
        return version;
    }
    async update(id, updateDto, userId) {
        const version = await this.findOne(id);
        if (version.status !== sop_version_entity_1.VersionStatus.DRAFT) {
            throw new common_1.BadRequestException(`Cannot update version with status: ${version.status}`);
        }
        Object.assign(version, Object.assign(Object.assign({}, updateDto), { updated_by: userId }));
        return this.versionRepository.save(version);
    }
    async approve(id, approveDto, userId) {
        const version = await this.findOne(id);
        if (version.status !== sop_version_entity_1.VersionStatus.PENDING_APPROVAL) {
            throw new common_1.BadRequestException(`Version is not in pending approval status`);
        }
        version.status = approveDto.status;
        version.approved_by = userId;
        version.approved_at = new Date();
        version.approval_comments = approveDto.approval_comments;
        version.updated_by = userId;
        return this.versionRepository.save(version);
    }
    async publish(id, userId) {
        const version = await this.findOne(id);
        if (version.status !== sop_version_entity_1.VersionStatus.APPROVED) {
            throw new common_1.BadRequestException(`Version must be approved before publishing`);
        }
        version.status = sop_version_entity_1.VersionStatus.PUBLISHED;
        version.published_by = userId;
        version.published_at = new Date();
        version.updated_by = userId;
        const sop = await this.sopRepository.findOne({ where: { id: version.sop_id } });
        if (sop && version.content_snapshot) {
            sop.content = version.content_snapshot.content || sop.content;
            sop.purpose = version.content_snapshot.purpose || sop.purpose;
            sop.scope = version.content_snapshot.scope || sop.scope;
            sop.version = version.version_number;
            sop.version_number = parseInt(version.version_number.split('.')[0], 10);
            await this.sopRepository.save(sop);
        }
        return this.versionRepository.save(version);
    }
    async submitForApproval(id, userId) {
        const version = await this.findOne(id);
        if (version.status !== sop_version_entity_1.VersionStatus.DRAFT) {
            throw new common_1.BadRequestException(`Only draft versions can be submitted for approval`);
        }
        version.status = sop_version_entity_1.VersionStatus.PENDING_APPROVAL;
        version.updated_by = userId;
        return this.versionRepository.save(version);
    }
    async remove(id) {
        const version = await this.findOne(id);
        if (version.status === sop_version_entity_1.VersionStatus.PUBLISHED) {
            throw new common_1.BadRequestException(`Cannot delete published versions`);
        }
        await this.versionRepository.softRemove(version);
    }
    async getVersionHistory(sopId) {
        return this.versionRepository.find({
            where: { sop_id: sopId },
            relations: ['creator', 'approver', 'publisher'],
            order: { created_at: 'DESC' },
        });
    }
    async getLatestVersion(sopId) {
        return this.versionRepository.findOne({
            where: { sop_id: sopId, status: sop_version_entity_1.VersionStatus.PUBLISHED },
            relations: ['creator', 'publisher'],
            order: { published_at: 'DESC' },
        });
    }
    async getPendingApprovals() {
        return this.versionRepository.find({
            where: { status: sop_version_entity_1.VersionStatus.PENDING_APPROVAL },
            relations: ['sop', 'creator'],
            order: { created_at: 'ASC' },
        });
    }
    async calculateNextVersion(sopId, changeType) {
        const latestPublished = await this.getLatestVersion(sopId);
        if (!latestPublished) {
            return '1.0';
        }
        const [major, minor] = latestPublished.version_number.split('.').map(Number);
        switch (changeType) {
            case sop_version_entity_1.VersionChangeType.MAJOR:
                return `${major + 1}.0`;
            case sop_version_entity_1.VersionChangeType.MINOR:
                return `${major}.${minor + 1}`;
            case sop_version_entity_1.VersionChangeType.PATCH:
                return `${major}.${minor}.1`;
            default:
                return `${major}.${minor + 1}`;
        }
    }
    async getVersionsRequiringRetraining(sopId) {
        return this.versionRepository.find({
            where: {
                sop_id: sopId,
                requires_retraining: true,
                status: sop_version_entity_1.VersionStatus.PUBLISHED,
            },
            relations: ['publisher'],
            order: { published_at: 'DESC' },
        });
    }
};
exports.SOPVersionsService = SOPVersionsService;
exports.SOPVersionsService = SOPVersionsService = SOPVersionsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(sop_version_entity_1.SOPVersion)),
    __param(1, (0, typeorm_1.InjectRepository)(sop_entity_1.SOP)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], SOPVersionsService);
//# sourceMappingURL=sop-versions.service.js.map