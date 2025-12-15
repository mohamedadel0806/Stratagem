import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { WorkflowService } from '../services/workflow.service';
import { Workflow, WorkflowTrigger, EntityType, WorkflowStatus } from '../entities/workflow.entity';
import { ComplianceRequirement } from '../../common/entities/compliance-requirement.entity';
import { Policy } from '../../policy/entities/policy.entity';
import { Task } from '../../common/entities/task.entity';

@Injectable()
export class DeadlineWorkflowScheduler {
  private readonly logger = new Logger(DeadlineWorkflowScheduler.name);

  constructor(
    private readonly workflowService: WorkflowService,
    @InjectRepository(Workflow)
    private workflowRepository: Repository<Workflow>,
    @InjectRepository(ComplianceRequirement)
    private requirementRepository: Repository<ComplianceRequirement>,
    @InjectRepository(Policy)
    private policyRepository: Repository<Policy>,
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  /**
   * Check deadline workflows every hour
   */
  @Cron(CronExpression.EVERY_HOUR)
  async handleDeadlineWorkflows() {
    this.logger.log('Checking deadline workflows...');

    const workflows = await this.workflowRepository.find({
      where: {
        trigger: WorkflowTrigger.ON_DEADLINE_APPROACHING,
        status: WorkflowStatus.ACTIVE,
      },
    });

    for (const workflow of workflows) {
      try {
        await this.processDeadlineWorkflow(workflow);
      } catch (error) {
        this.logger.error(`Error processing deadline workflow ${workflow.id}:`, error);
      }
    }

    // Check for passed deadlines
    const passedDeadlineWorkflows = await this.workflowRepository.find({
      where: {
        trigger: WorkflowTrigger.ON_DEADLINE_PASSED,
        status: WorkflowStatus.ACTIVE,
      },
    });

    for (const workflow of passedDeadlineWorkflows) {
      try {
        await this.processPassedDeadlineWorkflow(workflow);
      } catch (error) {
        this.logger.error(`Error processing passed deadline workflow ${workflow.id}:`, error);
      }
    }
  }

  private async processDeadlineWorkflow(workflow: Workflow) {
    const daysBefore = workflow.daysBeforeDeadline || 30;
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + daysBefore);

    let entities: any[] = [];

    switch (workflow.entityType) {
      case EntityType.COMPLIANCE_REQUIREMENT:
        if (workflow.conditions?.complianceDeadline) {
          // Find requirements with deadline approaching
          entities = await this.requirementRepository.find({
            where: {
              complianceDeadline: LessThanOrEqual(targetDate.toISOString().split('T')[0]),
            },
          });
        }
        break;
      case EntityType.POLICY:
        // Find policies with review date approaching
        entities = await this.policyRepository.find({
          where: {
            reviewDate: LessThanOrEqual(targetDate),
          },
        });
        break;
      case EntityType.TASK:
        // Find tasks with due date approaching
        entities = await this.taskRepository.find({
          where: {
            dueDate: LessThanOrEqual(targetDate),
          },
        });
        break;
    }

    for (const entity of entities) {
      // Check if workflow already executed for this entity
      const hasExecution = await this.workflowService.checkAndTriggerWorkflows(
        workflow.entityType,
        entity.id,
        WorkflowTrigger.ON_DEADLINE_APPROACHING,
        { ...entity },
      );
    }
  }

  private async processPassedDeadlineWorkflow(workflow: Workflow) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let entities: any[] = [];

    switch (workflow.entityType) {
      case EntityType.COMPLIANCE_REQUIREMENT:
        entities = await this.requirementRepository.find({
          where: {
            complianceDeadline: LessThanOrEqual(today.toISOString().split('T')[0]),
          },
        });
        break;
      case EntityType.POLICY:
        entities = await this.policyRepository.find({
          where: {
            reviewDate: LessThanOrEqual(today),
          },
        });
        break;
      case EntityType.TASK:
        entities = await this.taskRepository.find({
          where: {
            dueDate: LessThanOrEqual(today),
          },
        });
        break;
    }

    for (const entity of entities) {
      await this.workflowService.checkAndTriggerWorkflows(
        workflow.entityType,
        entity.id,
        WorkflowTrigger.ON_DEADLINE_PASSED,
        { ...entity },
      );
    }
  }
}

