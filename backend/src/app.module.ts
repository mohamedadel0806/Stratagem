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
import { TenantsModule } from './tenants/tenants.module';
import { MailModule } from './common/mail/mail.module';
import { DataExportModule } from './common/export/data-export.module';
import { databaseConfig } from './config/database';
import { redisConfig } from './config/redis.config';
import { mailConfig } from './config/mail.config';
import { TenantContextService } from './common/context/tenant-context.service';
import { RLSDataSource } from './common/database/rls-data-source';
import { DataSource } from 'typeorm';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { SubscriptionGuard } from './auth/guards/subscription.guard';
import { ThrottlerModule } from '@nestjs/throttler';
import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis';
import { TenantThrottlerGuard } from './common/guards/tenant-throttler.guard';
import { PerformanceInterceptor } from './common/interceptors/performance.interceptor';

let tenantContextServiceInstance: TenantContextService;

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [redisConfig, mailConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [CommonModule],
      inject: [TenantContextService],
      useFactory: (tenantContextService: TenantContextService) => {
        tenantContextServiceInstance = tenantContextService;
        return {
          ...databaseConfig,
          autoLoadEntities: true,
        };
      },
      dataSourceFactory: async (options) => {
        if (!options) {
          throw new Error('Invalid options passed to dataSourceFactory');
        }
        return new RLSDataSource(options as any, tenantContextServiceInstance);
      },
    }),
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
    TenantsModule,
    MailModule,
    DataExportModule,
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const redis = configService.get('redis');
        return {
          throttlers: [
            {
              name: 'default',
              ttl: 60000,
              limit: 500, // Increased for testing
            },
          ],
          storage: new ThrottlerStorageRedisService({
            host: redis.host,
            port: redis.port,
            password: redis.password,
            db: redis.db,
          }),
        };
      },
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: SubscriptionGuard,
    },
    {
      provide: APP_GUARD,
      useClass: TenantThrottlerGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: PerformanceInterceptor,
    },
  ],
})
export class AppModule { }