import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { WorkflowTriggerRule, RuleOperator } from '../entities/workflow-trigger-rule.entity';
import { CreateWorkflowTriggerRuleDto } from '../dto/create-trigger-rule.dto';
import { EntityType, WorkflowTrigger } from '../entities/workflow.entity';

@Injectable()
export class WorkflowTriggerRulesService {
  private readonly logger = new Logger(WorkflowTriggerRulesService.name);

  constructor(
    @InjectRepository(WorkflowTriggerRule)
    private ruleRepository: Repository<WorkflowTriggerRule>,
  ) {}

  async create(dto: CreateWorkflowTriggerRuleDto, userId: string): Promise<WorkflowTriggerRule> {
    const rule = this.ruleRepository.create({
      ...dto,
      created_by: userId,
    });
    return this.ruleRepository.save(rule);
  }

  async findAll() {
    return this.ruleRepository.find({
      where: { deleted_at: IsNull() },
      relations: ['workflow', 'creator'],
      order: { priority: 'DESC', created_at: 'DESC' },
    });
  }

  async findOne(id: string): Promise<WorkflowTriggerRule> {
    const rule = await this.ruleRepository.findOne({
      where: { id, deleted_at: IsNull() },
      relations: ['workflow', 'creator'],
    });
    if (!rule) {
      throw new NotFoundException(`Workflow rule with ID ${id} not found`);
    }
    return rule;
  }

  async update(id: string, dto: Partial<CreateWorkflowTriggerRuleDto>, userId: string): Promise<WorkflowTriggerRule> {
    const rule = await this.findOne(id);
    Object.assign(rule, dto);
    return this.ruleRepository.save(rule);
  }

  async remove(id: string): Promise<void> {
    const rule = await this.findOne(id);
    await this.ruleRepository.softDelete(id);
  }

  /**
   * Evaluate all active rules for an entity event and return matching workflows
   */
  async getMatchingWorkflows(
    entityType: EntityType,
    trigger: WorkflowTrigger,
    entityData: Record<string, any>,
  ): Promise<string[]> {
    const rules = await this.ruleRepository.find({
      where: {
        entityType,
        trigger,
        isActive: true,
        deleted_at: IsNull(),
      },
      order: { priority: 'DESC' },
    });

    const matchingWorkflowIds: string[] = [];

    for (const rule of rules) {
      if (this.evaluateRule(rule, entityData)) {
        matchingWorkflowIds.push(rule.workflowId);
      }
    }

    return matchingWorkflowIds;
  }

  private evaluateRule(rule: WorkflowTriggerRule, data: Record<string, any>): boolean {
    if (!rule.conditions || rule.conditions.length === 0) return true;

    return rule.conditions.every((cond) => {
      const val = data[cond.field];
      const target = cond.value;

      switch (cond.operator) {
        case RuleOperator.EQUALS:
          return val === target;
        case RuleOperator.NOT_EQUALS:
          return val !== target;
        case RuleOperator.GREATER_THAN:
          return val > target;
        case RuleOperator.LESS_THAN:
          return val < target;
        case RuleOperator.CONTAINS:
          return typeof val === 'string' && val.includes(target);
        case RuleOperator.IN:
          return Array.isArray(target) && target.includes(val);
        default:
          return false;
      }
    });
  }
}


