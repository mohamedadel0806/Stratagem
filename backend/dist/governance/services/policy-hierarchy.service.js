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
var PolicyHierarchyService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PolicyHierarchyService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let PolicyHierarchyService = PolicyHierarchyService_1 = class PolicyHierarchyService {
    constructor(entityManager) {
        this.entityManager = entityManager;
        this.logger = new common_1.Logger(PolicyHierarchyService_1.name);
    }
    async getPolicyHierarchy() {
        const policies = await this.entityManager.query(`
      SELECT id, title as label, version as identifier, status 
      FROM policies WHERE deleted_at IS NULL
    `);
        const rootNodes = [];
        for (const p of policies) {
            const node = {
                id: p.id,
                type: 'policy',
                label: p.label,
                identifier: p.identifier,
                status: p.status,
                children: [],
            };
            const standards = await this.entityManager.query(`
        SELECT id, title as label, standard_identifier as identifier, status
        FROM standards 
        WHERE policy_id = $1 AND deleted_at IS NULL
      `, [p.id]);
            for (const s of standards) {
                const sNode = {
                    id: s.id,
                    type: 'standard',
                    label: s.label,
                    identifier: s.identifier,
                    status: s.status,
                    children: [],
                };
                const sops = await this.entityManager.query(`
          SELECT s.id, s.title as label, s.sop_identifier as identifier, s.status
          FROM sops s
          WHERE $1 = ANY(s.linked_standards) AND s.deleted_at IS NULL
        `, [s.id]);
                sNode.children = sops.map(sop => ({
                    id: sop.id,
                    type: 'sop',
                    label: sop.label,
                    identifier: sop.identifier,
                    status: sop.status,
                }));
                node.children.push(sNode);
            }
            const directSops = await this.entityManager.query(`
        SELECT id, title as label, sop_identifier as identifier, status
        FROM sops 
        WHERE $1 = ANY(linked_policies) AND deleted_at IS NULL
      `, [p.id]);
            directSops.forEach(sop => {
                if (!node.children.some(c => c.id === sop.id)) {
                    node.children.push({
                        id: sop.id,
                        type: 'sop',
                        label: sop.label,
                        identifier: sop.identifier,
                        status: sop.status,
                    });
                }
            });
            const objectives = await this.entityManager.query(`
        SELECT id, statement as label, objective_identifier as identifier, implementation_status as status
        FROM control_objectives 
        WHERE policy_id = $1 AND deleted_at IS NULL
      `, [p.id]);
            objectives.forEach(obj => {
                node.children.push({
                    id: obj.id,
                    type: 'objective',
                    label: obj.label.substring(0, 100) + (obj.label.length > 100 ? '...' : ''),
                    identifier: obj.identifier,
                    status: obj.status,
                });
            });
            rootNodes.push(node);
        }
        return rootNodes;
    }
};
exports.PolicyHierarchyService = PolicyHierarchyService;
exports.PolicyHierarchyService = PolicyHierarchyService = PolicyHierarchyService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectEntityManager)()),
    __metadata("design:paramtypes", [typeorm_2.EntityManager])
], PolicyHierarchyService);
//# sourceMappingURL=policy-hierarchy.service.js.map