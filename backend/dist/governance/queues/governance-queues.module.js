"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GovernanceQueuesModule = void 0;
const common_1 = require("@nestjs/common");
const bull_1 = require("@nestjs/bull");
const config_1 = require("@nestjs/config");
const redis_config_1 = require("../../config/redis.config");
const workflow_processor_1 = require("./processors/workflow-processor");
const workflow_module_1 = require("../../workflow/workflow.module");
let GovernanceQueuesModule = class GovernanceQueuesModule {
};
exports.GovernanceQueuesModule = GovernanceQueuesModule;
exports.GovernanceQueuesModule = GovernanceQueuesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forFeature(redis_config_1.redisConfig),
            (0, common_1.forwardRef)(() => workflow_module_1.WorkflowModule),
            bull_1.BullModule.registerQueue({
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
            }, {
                name: 'governance:assessment',
                defaultJobOptions: {
                    attempts: 3,
                    backoff: { type: 'fixed', delay: 5000 },
                },
            }, {
                name: 'governance:reporting',
                defaultJobOptions: {
                    attempts: 2,
                    timeout: 300000,
                    removeOnComplete: false,
                },
            }, {
                name: 'governance:evidence',
                defaultJobOptions: {
                    attempts: 5,
                    backoff: { type: 'exponential', delay: 3000 },
                },
            }, {
                name: 'governance:notification',
                defaultJobOptions: {
                    attempts: 10,
                    backoff: { type: 'fixed', delay: 1000 },
                },
            }, {
                name: 'governance:export',
                defaultJobOptions: {
                    attempts: 3,
                    timeout: 180000,
                },
            }, {
                name: 'governance:audit',
                defaultJobOptions: {
                    attempts: 2,
                    timeout: 600000,
                },
            }, {
                name: 'governance:import',
                defaultJobOptions: {
                    attempts: 3,
                    timeout: 120000,
                },
            }),
        ],
        providers: [
            workflow_processor_1.WorkflowProcessor,
        ],
        exports: [bull_1.BullModule],
    })
], GovernanceQueuesModule);
//# sourceMappingURL=governance-queues.module.js.map