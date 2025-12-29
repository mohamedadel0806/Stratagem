import { Module, forwardRef } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisConfig } from '../../config/redis.config';
import { WorkflowProcessor } from './processors/workflow-processor';
import { WorkflowModule } from '../../workflow/workflow.module';
import { CommonModule } from '../../common/common.module';

/**
 * Governance Queues Module
 * 
 * Registers all Bull queues for Governance Module operations:
 * - policy: Policy distribution, publication, workflow execution
 * - assessment: Assessment scheduling, execution
 * - reporting: Report generation
 * - evidence: Evidence collection, processing
 * - notification: Email, in-app notifications
 * - export: Data export (Excel, PDF)
 * - audit: Audit package generation
 * - import: Control/framework import
 */
@Module({
  imports: [
    ConfigModule.forFeature(redisConfig),
    CommonModule,
    forwardRef(() => WorkflowModule), // Import to access WorkflowService in processors
    BullModule.registerQueue(
      {
        name: 'governance:policy',
        defaultJobOptions: {
          attempts: 5,
          backoff: {
            type: 'exponential',
            delay: 2000,
          },
          removeOnComplete: true,
          removeOnFail: false,
        },
      },
      {
        name: 'governance:assessment',
        defaultJobOptions: {
          attempts: 3,
          backoff: { type: 'fixed', delay: 5000 },
        },
      },
      {
        name: 'governance:reporting',
        defaultJobOptions: {
          attempts: 2,
          timeout: 300000, // 5 minutes
          removeOnComplete: false,
        },
      },
      {
        name: 'governance:evidence',
        defaultJobOptions: {
          attempts: 5,
          backoff: { type: 'exponential', delay: 3000 },
        },
      },
      {
        name: 'governance:notification',
        defaultJobOptions: {
          attempts: 10,
          backoff: { type: 'fixed', delay: 1000 },
        },
      },
      {
        name: 'governance:export',
        defaultJobOptions: {
          attempts: 3,
          timeout: 180000, // 3 minutes
        },
      },
      {
        name: 'governance:audit',
        defaultJobOptions: {
          attempts: 2,
          timeout: 600000, // 10 minutes
        },
      },
      {
        name: 'governance:import',
        defaultJobOptions: {
          attempts: 3,
          timeout: 120000, // 2 minutes
        },
      },
    ),
  ],
  providers: [
    WorkflowProcessor, // Process workflow execution jobs
  ],
  exports: [BullModule],
})
export class GovernanceQueuesModule { }
