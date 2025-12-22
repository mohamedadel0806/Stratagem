import { Injectable, Logger } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

export interface HierarchyNode {
  id: string;
  type: 'policy' | 'standard' | 'sop' | 'objective';
  label: string;
  identifier: string;
  status: string;
  children?: HierarchyNode[];
}

@Injectable()
export class PolicyHierarchyService {
  private readonly logger = new Logger(PolicyHierarchyService.name);

  constructor(
    @InjectEntityManager()
    private entityManager: EntityManager,
  ) {}

  async getPolicyHierarchy(): Promise<HierarchyNode[]> {
    // 1. Fetch all top-level Policies
    const policies = await this.entityManager.query(`
      SELECT id, title as label, version as identifier, status 
      FROM policies WHERE deleted_at IS NULL
    `);

    const rootNodes: HierarchyNode[] = [];

    for (const p of policies) {
      const node: HierarchyNode = {
        id: p.id,
        type: 'policy',
        label: p.label,
        identifier: p.identifier,
        status: p.status,
        children: [],
      };

      // 2. Fetch linked Standards
      const standards = await this.entityManager.query(`
        SELECT id, title as label, standard_identifier as identifier, status
        FROM standards 
        WHERE policy_id = $1 AND deleted_at IS NULL
      `, [p.id]);

      for (const s of standards) {
        const sNode: HierarchyNode = {
          id: s.id,
          type: 'standard',
          label: s.label,
          identifier: s.identifier,
          status: s.status,
          children: [],
        };

        // 3. Fetch linked SOPs for this standard
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

        node.children!.push(sNode);
      }

      // 4. Fetch linked SOPs directly linked to Policy
      const directSops = await this.entityManager.query(`
        SELECT id, title as label, sop_identifier as identifier, status
        FROM sops 
        WHERE $1 = ANY(linked_policies) AND deleted_at IS NULL
      `, [p.id]);

      directSops.forEach(sop => {
        // Only add if not already added via a standard
        if (!node.children!.some(c => c.id === sop.id)) {
          node.children!.push({
            id: sop.id,
            type: 'sop',
            label: sop.label,
            identifier: sop.identifier,
            status: sop.status,
          });
        }
      });

      // 5. Fetch Control Objectives for the Policy
      const objectives = await this.entityManager.query(`
        SELECT id, statement as label, objective_identifier as identifier, implementation_status as status
        FROM control_objectives 
        WHERE policy_id = $1 AND deleted_at IS NULL
      `, [p.id]);

      objectives.forEach(obj => {
        node.children!.push({
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
}


