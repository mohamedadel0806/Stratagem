import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { BullModule } from '@nestjs/bull';
import { WorkflowController } from './controllers/workflow.controller';
import { WorkflowTriggerRulesController } from './controllers/workflow-trigger-rules.controller';
import { WorkflowService } from './services/workflow.service';
import { WorkflowTemplatesService } from './services/workflow-templates.service';
import { WorkflowTriggerRulesService } from './services/workflow-trigger-rules.service';
import { DeadlineWorkflowScheduler } from './schedulers/deadline-workflow.scheduler';
import { Workflow } from './entities/workflow.entity';
import { WorkflowExecution } from './entities/workflow-execution.entity';
import { WorkflowApproval } from './entities/workflow-approval.entity';
import { WorkflowTriggerRule } from './entities/workflow-trigger-rule.entity';
import { Policy } from '../policy/entities/policy.entity';
import { Risk } from '../risk/entities/risk.entity';
import { ComplianceRequirement } from '../common/entities/compliance-requirement.entity';
import { Task } from '../common/entities/task.entity';
import { Notification } from '../common/entities/notification.entity';
import { NotificationService } from '../common/services/notification.service';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([
      Workflow,
      WorkflowExecution,
      WorkflowApproval,
      WorkflowTriggerRule,
      Policy,
      Risk,
      ComplianceRequirement,
      Task,
      Notification,
      User,
    ]),
    // Note: Queue 'governance:policy' is registered in GovernanceQueuesModule
    // It's accessible via @InjectQueue decorator in WorkflowService
    // Using @Optional() to handle cases where queue might not be available
  ],
  controllers: [WorkflowController, WorkflowTriggerRulesController],
  providers: [WorkflowService, WorkflowTemplatesService, WorkflowTriggerRulesService, DeadlineWorkflowScheduler, NotificationService],
  exports: [WorkflowService, WorkflowTemplatesService, WorkflowTriggerRulesService],
})
export class WorkflowModule {}
