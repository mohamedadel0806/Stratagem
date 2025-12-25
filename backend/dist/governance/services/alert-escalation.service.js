"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var AlertEscalationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlertEscalationService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const alert_escalation_chain_entity_1 = require("../entities/alert-escalation-chain.entity");
const alert_entity_1 = require("../entities/alert.entity");
const alert_rule_entity_1 = require("../entities/alert-rule.entity");
const workflow_entity_1 = require("../../workflow/entities/workflow.entity");
const user_entity_1 = require("../../users/entities/user.entity");
const schedule_1 = require("@nestjs/schedule");
let AlertEscalationService = AlertEscalationService_1 = class AlertEscalationService {
    constructor(escalationRepository, alertRepository, alertRuleRepository, workflowRepository, userRepository, schedulerRegistry) {
        this.escalationRepository = escalationRepository;
        this.alertRepository = alertRepository;
        this.alertRuleRepository = alertRuleRepository;
        this.workflowRepository = workflowRepository;
        this.userRepository = userRepository;
        this.schedulerRegistry = schedulerRegistry;
        this.logger = new common_1.Logger(AlertEscalationService_1.name);
    }
    async createEscalationChain(createDto, userId) {
        this.logger.log(`Creating escalation chain for alert ${createDto.alertId}`);
        const alert = await this.alertRepository.findOne({
            where: { id: createDto.alertId },
        });
        if (!alert) {
            throw new common_1.NotFoundException(`Alert ${createDto.alertId} not found`);
        }
        if (!createDto.escalationRules || createDto.escalationRules.length === 0) {
            throw new common_1.BadRequestException('At least one escalation rule is required');
        }
        const sortedRules = [...createDto.escalationRules].sort((a, b) => a.level - b.level);
        for (let i = 0; i < sortedRules.length; i++) {
            if (sortedRules[i].level !== i + 1) {
                throw new common_1.BadRequestException('Escalation rule levels must be sequential starting from 1');
            }
        }
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new common_1.NotFoundException(`User ${userId} not found`);
        }
        const firstRule = sortedRules[0];
        const nextEscalationAt = new Date(Date.now() + firstRule.delayMinutes * 60 * 1000);
        const chain = this.escalationRepository.create({
            alertId: createDto.alertId,
            alertRuleId: createDto.alertRuleId,
            escalationRules: sortedRules,
            maxLevels: sortedRules.length,
            currentLevel: 0,
            nextEscalationAt,
            escalationHistory: [],
            escalationNotes: createDto.escalationNotes,
            createdById: userId,
        });
        const saved = await this.escalationRepository.save(chain);
        await this.scheduleNextEscalation(saved.id);
        return this.mapChainToDto(saved);
    }
    async getEscalationChain(id) {
        const chain = await this.escalationRepository.findOne({
            where: { id },
            relations: ['alert', 'alertRule', 'createdBy', 'resolvedBy'],
        });
        if (!chain) {
            throw new common_1.NotFoundException(`Escalation chain ${id} not found`);
        }
        return this.mapChainToDto(chain);
    }
    async getAlertEscalationChains(alertId) {
        const chains = await this.escalationRepository.find({
            where: { alertId },
            relations: ['alert', 'alertRule', 'createdBy', 'resolvedBy'],
            order: { createdAt: 'DESC' },
        });
        return chains.map((chain) => this.mapChainToDto(chain));
    }
    async getActiveEscalationChains() {
        const chains = await this.escalationRepository.find({
            where: { status: (0, typeorm_2.In)([alert_escalation_chain_entity_1.EscalationChainStatus.PENDING, alert_escalation_chain_entity_1.EscalationChainStatus.IN_PROGRESS]) },
            relations: ['alert', 'alertRule', 'createdBy'],
            order: { nextEscalationAt: 'ASC' },
        });
        return chains.map((chain) => this.mapChainToDto(chain));
    }
    async escalateAlert(chainId, escalatedById) {
        this.logger.log(`Escalating alert for chain ${chainId}`);
        const chain = await this.escalationRepository.findOne({
            where: { id: chainId },
            relations: ['alert', 'escalationRules'],
        });
        if (!chain) {
            throw new common_1.NotFoundException(`Escalation chain ${chainId} not found`);
        }
        if (chain.status === alert_escalation_chain_entity_1.EscalationChainStatus.RESOLVED || chain.status === alert_escalation_chain_entity_1.EscalationChainStatus.CANCELLED) {
            throw new common_1.BadRequestException(`Cannot escalate a ${chain.status} escalation chain`);
        }
        const nextLevel = chain.currentLevel + 1;
        if (nextLevel > chain.maxLevels) {
            throw new common_1.BadRequestException('Maximum escalation level reached');
        }
        const escalationRule = chain.escalationRules[nextLevel - 1];
        if (!escalationRule) {
            throw new common_1.BadRequestException(`No escalation rule defined for level ${nextLevel}`);
        }
        chain.currentLevel = nextLevel;
        chain.status = alert_escalation_chain_entity_1.EscalationChainStatus.ESCALATED;
        if (!chain.escalationHistory) {
            chain.escalationHistory = [];
        }
        chain.escalationHistory.push({
            level: nextLevel,
            escalatedAt: new Date(),
            escalatedToRoles: escalationRule.roles,
            notificationsSent: [],
        });
        if (nextLevel < chain.maxLevels) {
            const nextRule = chain.escalationRules[nextLevel];
            const totalDelay = nextRule.delayMinutes;
            chain.nextEscalationAt = new Date(Date.now() + totalDelay * 60 * 1000);
        }
        else {
            chain.nextEscalationAt = null;
        }
        const saved = await this.escalationRepository.save(chain);
        if (escalationRule.workflowId) {
            await this.triggerEscalationWorkflow(chainId, escalationRule.workflowId);
        }
        if (nextLevel < chain.maxLevels) {
            await this.scheduleNextEscalation(chainId);
        }
        return this.mapChainToDto(saved);
    }
    async resolveEscalationChain(chainId, resolutionNotes, resolvedById) {
        this.logger.log(`Resolving escalation chain ${chainId}`);
        const chain = await this.escalationRepository.findOne({
            where: { id: chainId },
        });
        if (!chain) {
            throw new common_1.NotFoundException(`Escalation chain ${chainId} not found`);
        }
        const user = await this.userRepository.findOne({ where: { id: resolvedById } });
        if (!user) {
            throw new common_1.NotFoundException(`User ${resolvedById} not found`);
        }
        chain.status = alert_escalation_chain_entity_1.EscalationChainStatus.RESOLVED;
        chain.escalationNotes = resolutionNotes;
        chain.resolvedById = resolvedById;
        chain.resolvedAt = new Date();
        chain.nextEscalationAt = null;
        const saved = await this.escalationRepository.save(chain);
        await this.cancelScheduledEscalation(chainId);
        return this.mapChainToDto(saved);
    }
    async cancelEscalationChain(chainId, cancelledById) {
        this.logger.log(`Cancelling escalation chain ${chainId}`);
        const chain = await this.escalationRepository.findOne({
            where: { id: chainId },
        });
        if (!chain) {
            throw new common_1.NotFoundException(`Escalation chain ${chainId} not found`);
        }
        const user = await this.userRepository.findOne({ where: { id: cancelledById } });
        if (!user) {
            throw new common_1.NotFoundException(`User ${cancelledById} not found`);
        }
        chain.status = alert_escalation_chain_entity_1.EscalationChainStatus.CANCELLED;
        chain.nextEscalationAt = null;
        const saved = await this.escalationRepository.save(chain);
        await this.cancelScheduledEscalation(chainId);
        return this.mapChainToDto(saved);
    }
    async getEscalationChainsBySeverity(severity) {
        const chains = await this.escalationRepository
            .createQueryBuilder('chain')
            .innerJoinAndSelect('chain.alert', 'alert')
            .where('alert.severity = :severity', { severity })
            .andWhereInIds([alert_escalation_chain_entity_1.EscalationChainStatus.PENDING, alert_escalation_chain_entity_1.EscalationChainStatus.IN_PROGRESS])
            .orderBy('chain.nextEscalationAt', 'ASC')
            .getMany();
        return chains.map((chain) => this.mapChainToDto(chain));
    }
    async getEscalationStatistics() {
        const activeCount = await this.escalationRepository.count({
            where: { status: (0, typeorm_2.In)([alert_escalation_chain_entity_1.EscalationChainStatus.PENDING, alert_escalation_chain_entity_1.EscalationChainStatus.IN_PROGRESS]) },
        });
        const pendingCount = await this.escalationRepository.count({
            where: { status: alert_escalation_chain_entity_1.EscalationChainStatus.PENDING },
        });
        const escalatedCount = await this.escalationRepository.count({
            where: { status: alert_escalation_chain_entity_1.EscalationChainStatus.ESCALATED },
        });
        const chains = await this.escalationRepository.find();
        const avgLevels = chains.length > 0 ? chains.reduce((sum, c) => sum + c.currentLevel, 0) / chains.length : 0;
        return {
            activeChains: activeCount,
            pendingEscalations: pendingCount,
            escalatedAlerts: escalatedCount,
            averageEscalationLevels: Math.round(avgLevels * 100) / 100,
        };
    }
    async scheduleNextEscalation(chainId) {
        const chain = await this.escalationRepository.findOne({
            where: { id: chainId },
        });
        if (!chain || !chain.nextEscalationAt) {
            return;
        }
        const delayMs = chain.nextEscalationAt.getTime() - Date.now();
        if (delayMs <= 0) {
            await this.escalateAlert(chainId, chain.createdById);
            return;
        }
        try {
            const taskName = `escalation-${chainId}`;
            try {
                this.schedulerRegistry.deleteTimeout(taskName);
            }
            catch (e) {
            }
            const timeout = setTimeout(() => {
                this.escalateAlert(chainId, chain.createdById).catch((err) => {
                    this.logger.error(`Failed to escalate chain ${chainId}: ${err.message}`);
                });
            }, delayMs);
            this.schedulerRegistry.addTimeout(taskName, timeout);
            this.logger.log(`Scheduled escalation for chain ${chainId} in ${delayMs}ms`);
        }
        catch (err) {
            this.logger.error(`Failed to schedule escalation for chain ${chainId}: ${err.message}`);
        }
    }
    async cancelScheduledEscalation(chainId) {
        try {
            const taskName = `escalation-${chainId}`;
            this.schedulerRegistry.deleteTimeout(taskName);
            this.logger.log(`Cancelled scheduled escalation for chain ${chainId}`);
        }
        catch (err) {
        }
    }
    async triggerEscalationWorkflow(chainId, workflowId) {
        const workflow = await this.workflowRepository.findOne({
            where: { id: workflowId, type: workflow_entity_1.WorkflowType.ESCALATION },
        });
        if (!workflow) {
            this.logger.warn(`Escalation workflow ${workflowId} not found`);
            return;
        }
        const chain = await this.escalationRepository.findOne({
            where: { id: chainId },
        });
        if (!chain) {
            return;
        }
        chain.workflowExecutionId = workflowId;
        await this.escalationRepository.save(chain);
        this.logger.log(`Triggered escalation workflow ${workflowId} for chain ${chainId}`);
    }
    mapChainToDto(chain) {
        return {
            id: chain.id,
            alertId: chain.alertId,
            status: chain.status,
            currentLevel: chain.currentLevel,
            maxLevels: chain.maxLevels,
            nextEscalationAt: chain.nextEscalationAt,
            escalationHistory: chain.escalationHistory || [],
            createdAt: chain.createdAt,
            updatedAt: chain.updatedAt,
        };
    }
};
exports.AlertEscalationService = AlertEscalationService;
exports.AlertEscalationService = AlertEscalationService = AlertEscalationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(alert_escalation_chain_entity_1.AlertEscalationChain)),
    __param(1, (0, typeorm_1.InjectRepository)(alert_entity_1.Alert)),
    __param(2, (0, typeorm_1.InjectRepository)(alert_rule_entity_1.AlertRule)),
    __param(3, (0, typeorm_1.InjectRepository)(workflow_entity_1.Workflow)),
    __param(4, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        schedule_1.SchedulerRegistry])
], AlertEscalationService);
//# sourceMappingURL=alert-escalation.service.js.map