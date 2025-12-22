import { Injectable, Logger } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

export interface TraceabilityNode {
  id: string;
  type: 'influencer' | 'policy' | 'objective' | 'control' | 'baseline';
  label: string;
  identifier: string;
  status: string;
  data?: any;
}

export interface TraceabilityLink {
  source: string;
  target: string;
  type: string;
}

export interface TraceabilityGraph {
  nodes: TraceabilityNode[];
  links: TraceabilityLink[];
}

@Injectable()
export class TraceabilityService {
  private readonly logger = new Logger(TraceabilityService.name);

  constructor(
    @InjectEntityManager()
    private entityManager: EntityManager,
  ) {}

  async getTraceabilityGraph(rootId?: string, rootType?: string): Promise<TraceabilityGraph> {
    const nodes: Map<string, TraceabilityNode> = new Map();
    const links: TraceabilityLink[] = [];

    // 1. Fetch Influencers
    const influencers = await this.entityManager.query(`
      SELECT id, name as label, reference_number as identifier, status 
      FROM influencers WHERE deleted_at IS NULL
    `);
    influencers.forEach(i => {
      nodes.set(i.id, { ...i, type: 'influencer' });
    });

    // 2. Fetch Policies and their links to Influencers
    const policies = await this.entityManager.query(`
      SELECT id, title as label, version as identifier, status, linked_influencers
      FROM policies WHERE deleted_at IS NULL
    `);
    policies.forEach(p => {
      nodes.set(p.id, { ...p, type: 'policy' });
      if (p.linked_influencers && Array.isArray(p.linked_influencers)) {
        p.linked_influencers.forEach(infId => {
          if (nodes.has(infId)) {
            links.push({ source: infId, target: p.id, type: 'governs' });
          }
        });
      }
    });

    // 3. Fetch Control Objectives
    const objectives = await this.entityManager.query(`
      SELECT id, objective_identifier as identifier, statement as label, implementation_status as status, policy_id
      FROM control_objectives WHERE deleted_at IS NULL
    `);
    objectives.forEach(o => {
      nodes.set(o.id, { ...o, type: 'objective', label: o.label.substring(0, 50) + (o.label.length > 50 ? '...' : '') });
      if (nodes.has(o.policy_id)) {
        links.push({ source: o.policy_id, target: o.id, type: 'contains' });
      }
    });

    // 4. Fetch Unified Controls and their mappings to Objectives
    const controls = await this.entityManager.query(`
      SELECT id, title as label, control_identifier as identifier, status
      FROM unified_controls WHERE deleted_at IS NULL
    `);
    controls.forEach(c => {
      nodes.set(c.id, { ...c, type: 'control' });
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

    // 5. Fetch Secure Baselines and their mappings to Objectives
    const baselines = await this.entityManager.query(`
      SELECT id, name as label, baseline_identifier as identifier, status
      FROM secure_baselines WHERE deleted_at IS NULL
    `);
    baselines.forEach(b => {
      nodes.set(b.id, { ...b, type: 'baseline' });
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

    // If rootId is provided, filter the graph to only show connected nodes
    if (rootId && nodes.has(rootId)) {
      return this.filterGraph(nodes, links, rootId);
    }

    return {
      nodes: Array.from(nodes.values()),
      links,
    };
  }

  private filterGraph(allNodes: Map<string, TraceabilityNode>, allLinks: TraceabilityLink[], rootId: string): TraceabilityGraph {
    const reachableNodeIds = new Set<string>([rootId]);
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
}


