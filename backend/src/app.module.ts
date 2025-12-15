import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PolicyModule } from './policy/policy.module';
import { RiskModule } from './risk/risk.module';
import { ComplianceModule } from './compliance/compliance.module';
import { CommonModule } from './common/common.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { WorkflowModule } from './workflow/workflow.module';
import { AssetModule } from './asset/asset.module';
import { GovernanceModule } from './governance/governance.module';
import { HealthModule } from './health/health.module';
import { databaseConfig } from './config/database';
import { redisConfig } from './config/redis.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [redisConfig],
    }),
    TypeOrmModule.forRoot(databaseConfig),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const redis = configService.get('redis');
        return {
          redis: {
            host: redis.host,
            port: redis.port,
            password: redis.password,
            db: redis.db,
            // Remove enableReadyCheck and maxRetriesPerRequest for Bull compatibility
            // These options cause issues with Bull's subscriber client
            retryDelayOnFailover: redis.retryDelayOnFailover,
          },
          defaultJobOptions: {
            removeOnComplete: 100, // Keep last 100 completed jobs
            removeOnFail: 1000, // Keep last 1000 failed jobs
          },
          settings: {
            stalledInterval: 30000,
            maxStalledCount: 3,
            lockDuration: 30000,
            lockRenewTime: 15000,
          },
        };
      },
      inject: [ConfigService],
    }),
    HealthModule,
    AuthModule,
    UsersModule,
    PolicyModule,
    RiskModule,
    ComplianceModule,
    CommonModule,
    DashboardModule,
    WorkflowModule,
    AssetModule,
    GovernanceModule,
  ],
})
export class AppModule {}