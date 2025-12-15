"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const bull_1 = require("@nestjs/bull");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const policy_module_1 = require("./policy/policy.module");
const risk_module_1 = require("./risk/risk.module");
const compliance_module_1 = require("./compliance/compliance.module");
const common_module_1 = require("./common/common.module");
const dashboard_module_1 = require("./dashboard/dashboard.module");
const workflow_module_1 = require("./workflow/workflow.module");
const asset_module_1 = require("./asset/asset.module");
const governance_module_1 = require("./governance/governance.module");
const health_module_1 = require("./health/health.module");
const database_1 = require("./config/database");
const redis_config_1 = require("./config/redis.config");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                load: [redis_config_1.redisConfig],
            }),
            typeorm_1.TypeOrmModule.forRoot(database_1.databaseConfig),
            bull_1.BullModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => {
                    const redis = configService.get('redis');
                    return {
                        redis: {
                            host: redis.host,
                            port: redis.port,
                            password: redis.password,
                            db: redis.db,
                            retryDelayOnFailover: redis.retryDelayOnFailover,
                        },
                        defaultJobOptions: {
                            removeOnComplete: 100,
                            removeOnFail: 1000,
                        },
                        settings: {
                            stalledInterval: 30000,
                            maxStalledCount: 3,
                            lockDuration: 30000,
                            lockRenewTime: 15000,
                        },
                    };
                },
                inject: [config_1.ConfigService],
            }),
            health_module_1.HealthModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            policy_module_1.PolicyModule,
            risk_module_1.RiskModule,
            compliance_module_1.ComplianceModule,
            common_module_1.CommonModule,
            dashboard_module_1.DashboardModule,
            workflow_module_1.WorkflowModule,
            asset_module_1.AssetModule,
            governance_module_1.GovernanceModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map