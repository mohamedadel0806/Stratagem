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
var TraceabilityService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TraceabilityService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let TraceabilityService = TraceabilityService_1 = class TraceabilityService {
    constructor(entityManager) {
        this.entityManager = entityManager;
        this.logger = new common_1.Logger(TraceabilityService_1.name);
    }
    async getTraceabilityGraph(rootId, rootType) {
        const nodes = new Map();
        const links = [];
        const influencers = await this.entityManager.query(`
      SELECT id, name as label, reference_number as identifier, status 
      FROM influencers WHERE deleted_at IS NULL
    `);
        influencers.forEach(i => {
            nodes.set(i.id, Object.assign(Object.assign({}, i), { type: 'influencer' }));
        });
        const policies = await this.entityManager.query(`
      SELECT id, title as label, version as identifier, status, linked_influencers
      FROM policies WHERE deleted_at IS NULL
    `);
        policies.forEach(p => {
            nodes.set(p.id, Object.assign(Object.assign({}, p), { type: 'policy' }));
            if (p.linked_influencers && Array.isArray(p.linked_influencers)) {
                p.linked_influencers.forEach(infId => {
                    if (nodes.has(infId)) {
                        links.push({ source: infId, target: p.id, type: 'governs' });
                    }
                });
            }
        });
        const objectives = await this.entityManager.query(`
      SELECT id, objective_identifier as identifier, statement as label, implementation_status as status, policy_id
      FROM control_objectives WHERE deleted_at IS NULL
    `);
        objectives.forEach(o => {
            nodes.set(o.id, Object.assign(Object.assign({}, o), { type: 'objective', label: o.label.substring(0, 50) + (o.label.length > 50 ? '...' : '') }));
            if (nodes.has(o.policy_id)) {
                links.push({ source: o.policy_id, target: o.id, type: 'contains' });
            }
        });
        const controls = await this.entityManager.query(`
      SELECT id, title as label, control_identifier as identifier, status
      FROM unified_controls WHERE deleted_at IS NULL
    `);
        controls.forEach(c => {
            nodes.set(c.id, Object.assign(Object.assign({}, c), { type: 'control' }));
        });
        const objectiveMappings = await this.entityManager.query(`
      SELECT control_objective_id, unified_control_id
      FROM control_objective_unified_controls
    `);
        objectiveMappings.forEach(m => {
            if (nodes.has(m.control_objective_id) && nodes.has(m.unified_control_id)) {
                links.push({ source: m.control_objective_id, target: m.unified_control_id, type: 'satisfied_by' });
            }
        });
        const baselines = await this.entityManager.query(`
      SELECT id, name as label, baseline_identifier as identifier, status
      FROM secure_baselines WHERE deleted_at IS NULL
    `);
        baselines.forEach(b => {
            nodes.set(b.id, Object.assign(Object.assign({}, b), { type: 'baseline' }));
        });
        const baselineMappings = await this.entityManager.query(`
      SELECT baseline_id, control_objective_id
      FROM baseline_control_objective_mappings
    `);
        baselineMappings.forEach(m => {
            if (nodes.has(m.control_objective_id) && nodes.has(m.baseline_id)) {
                links.push({ source: m.control_objective_id, target: m.baseline_id, type: 'configured_by' });
            }
        });
        if (rootId && nodes.has(rootId)) {
            return this.filterGraph(nodes, links, rootId);
        }
        return {
            nodes: Array.from(nodes.values()),
            links,
        };
    }
    filterGraph(allNodes, allLinks, rootId) {
        const reachableNodeIds = new Set([rootId]);
        let added = true;
        while (added) {
            added = false;
            allLinks.forEach(link => {
                if (reachableNodeIds.has(link.source) && !reachableNodeIds.has(link.target)) {
                    reachableNodeIds.add(link.target);
                    added = true;
                }
                if (reachableNodeIds.has(link.target) && !reachableNodeIds.has(link.source)) {
                    reachableNodeIds.add(link.source);
                    added = true;
                }
            });
        }
        const filteredNodes = Array.from(allNodes.values()).filter(n => reachableNodeIds.has(n.id));
        const filteredLinks = allLinks.filter(l => reachableNodeIds.has(l.source) && reachableNodeIds.has(l.target));
        return {
            nodes: filteredNodes,
            links: filteredLinks,
        };
    }
};
exports.TraceabilityService = TraceabilityService;
exports.TraceabilityService = TraceabilityService = TraceabilityService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectEntityManager)()),
    __metadata("design:paramtypes", [typeorm_2.EntityManager])
], TraceabilityService);
//# sourceMappingURL=traceability.service.js.map