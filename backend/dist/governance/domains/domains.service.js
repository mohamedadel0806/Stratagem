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
exports.DomainsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const domain_entity_1 = require("./entities/domain.entity");
let DomainsService = class DomainsService {
    constructor(domainRepository) {
        this.domainRepository = domainRepository;
    }
    async create(createDomainDto, userId) {
        if (createDomainDto.parent_id) {
            await this.validateNoCircularReference(createDomainDto.parent_id, null);
        }
        const domain = this.domainRepository.create(Object.assign(Object.assign({}, createDomainDto), { created_by: userId }));
        return this.domainRepository.save(domain);
    }
    async findAll(includeInactive = false) {
        const where = {};
        if (!includeInactive) {
            where.is_active = true;
        }
        return this.domainRepository.find({
            where,
            relations: ['parent', 'owner', 'children'],
            order: { display_order: 'ASC', name: 'ASC' },
        });
    }
    async findOne(id) {
        const domain = await this.domainRepository.findOne({
            where: { id },
            relations: ['parent', 'owner', 'children', 'creator', 'updater'],
        });
        if (!domain) {
            throw new common_1.NotFoundException(`Domain with ID ${id} not found`);
        }
        return domain;
    }
    async findHierarchy() {
        const roots = await this.domainRepository.find({
            where: { parent_id: null, is_active: true },
            relations: ['owner'],
            order: { display_order: 'ASC', name: 'ASC' },
        });
        for (const root of roots) {
            root.children = await this.loadChildren(root.id);
        }
        return roots;
    }
    async loadChildren(parentId) {
        const children = await this.domainRepository.find({
            where: { parent_id: parentId, is_active: true },
            relations: ['owner'],
            order: { display_order: 'ASC', name: 'ASC' },
        });
        for (const child of children) {
            child.children = await this.loadChildren(child.id);
        }
        return children;
    }
    async update(id, updateDomainDto, userId) {
        const domain = await this.findOne(id);
        if (updateDomainDto.parent_id !== undefined) {
            if (updateDomainDto.parent_id === id) {
                throw new common_1.BadRequestException('Domain cannot be its own parent');
            }
            await this.validateNoCircularReference(updateDomainDto.parent_id, id);
        }
        Object.assign(domain, Object.assign(Object.assign({}, updateDomainDto), { updated_by: userId }));
        return this.domainRepository.save(domain);
    }
    async remove(id) {
        const domain = await this.findOne(id);
        const children = await this.domainRepository.find({
            where: { parent_id: id },
        });
        if (children.length > 0) {
            throw new common_1.BadRequestException(`Cannot delete domain "${domain.name}" because it has ${children.length} child domain(s). Please delete or reassign children first.`);
        }
        await this.domainRepository.softRemove(domain);
    }
    async validateNoCircularReference(parentId, excludeId) {
        let currentId = parentId;
        const visited = new Set();
        while (currentId) {
            if (currentId === excludeId) {
                throw new common_1.BadRequestException('Circular reference detected in domain hierarchy');
            }
            if (visited.has(currentId)) {
                throw new common_1.BadRequestException('Circular reference detected in domain hierarchy');
            }
            visited.add(currentId);
            const parent = await this.domainRepository.findOne({
                where: { id: currentId },
                select: ['id', 'parent_id'],
            });
            if (!parent) {
                break;
            }
            currentId = parent.parent_id;
        }
    }
    async getDomainStatistics() {
        const [total, active, withChildren, withOwner] = await Promise.all([
            this.domainRepository.count(),
            this.domainRepository.count({ where: { is_active: true } }),
            this.domainRepository
                .createQueryBuilder('domain')
                .innerJoin('control_domains', 'child', 'child.parent_id = domain.id')
                .getCount(),
            this.domainRepository.count({ where: { owner_id: null } }).then((count) => total - count),
        ]);
        return {
            total,
            active,
            withChildren,
            withOwner,
        };
    }
};
exports.DomainsService = DomainsService;
exports.DomainsService = DomainsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(domain_entity_1.ControlDomain)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], DomainsService);
//# sourceMappingURL=domains.service.js.map