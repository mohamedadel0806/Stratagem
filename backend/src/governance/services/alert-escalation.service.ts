import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { AlertEscalationChain, EscalationChainStatus, EscalationRule } from '../entities/alert-escalation-chain.entity';
import { Alert, AlertStatus, AlertSeverity } from '../entities/alert.entity';
import { AlertRule } from '../entities/alert-rule.entity';
import { Workflow, WorkflowType } from '../../workflow/entities/workflow.entity';
import { User } from '../../users/entities/user.entity';
import { SchedulerRegistry } from '@nestjs/schedule';

interface CreateEscalationChainDto {
  alertId: string;
  alertRuleId?: string;
  escalationRules: EscalationRule[];
  escalationNotes?: string;
}

interface EscalationChainDto {
  id: string;
  alertId: string;
  status: EscalationChainStatus;
  currentLevel: number;
  maxLevels: number;
  nextEscalationAt: Date;
  escalationHistory: any[];
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class AlertEscalationService {
  private readonly logger = new Logger(AlertEscalationService.name);

  constructor(
    @InjectRepository(AlertEscalationChain)
    private readonly escalationRepository: Repository<AlertEscalationChain>,
    @InjectRepository(Alert)
    private readonly alertRepository: Repository<Alert>,
    @InjectRepository(AlertRule)
    private readonly alertRuleRepository: Repository<AlertRule>,
    @InjectRepository(Workflow)
    private readonly workflowRepository: Repository<Workflow>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly schedulerRegistry: SchedulerRegistry,
  ) {}

  /**
   * Create an escalation chain for an alert
   */
  async createEscalationChain(
    createDto: CreateEscalationChainDto,
    userId: string,
  ): Promise<EscalationChainDto> {
    this.logger.log(`Creating escalation chain for alert ${createDto.alertId}`);

    // Validate alert exists
    const alert = await this.alertRepository.findOne({
      where: { id: createDto.alertId },
    });
    if (!alert) {
      throw new NotFoundException(`Alert ${createDto.alertId} not found`);
    }

    // Validate escalation rules
    if (!createDto.escalationRules || createDto.escalationRules.length === 0) {
      throw new BadRequestException('At least one escalation rule is required');
    }

    // Validate rules are in order
    const sortedRules = [...createDto.escalationRules].sort((a, b) => a.level - b.level);
    for (let i = 0; i < sortedRules.length; i++) {
      if (sortedRules[i].level !== i + 1) {
        throw new BadRequestException('Escalation rule levels must be sequential starting from 1');
      }
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User ${userId} not found`);
    }

    // Calculate next escalation time based on first rule delay
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

    // Schedule the first escalation
    await this.scheduleNextEscalation(saved.id);

    return this.mapChainToDto(saved);
  }

  /**
   * Get an escalation chain by ID
   */
  async getEscalationChain(id: string): Promise<EscalationChainDto> {
    const chain = await this.escalationRepository.findOne({
      where: { id },
      relations: ['alert', 'alertRule', 'createdBy', 'resolvedBy'],
    });

    if (!chain) {
      throw new NotFoundException(`Escalation chain ${id} not found`);
    }

    return this.mapChainToDto(chain);
  }

  /**
   * Get escalation chains for an alert
   */
  async getAlertEscalationChains(alertId: string): Promise<EscalationChainDto[]> {
    const chains = await this.escalationRepository.find({
      where: { alertId },
      relations: ['alert', 'alertRule', 'createdBy', 'resolvedBy'],
      order: { createdAt: 'DESC' },
    });

    return chains.map((chain) => this.mapChainToDto(chain));
  }

  /**
   * Get active escalation chains
   */
  async getActiveEscalationChains(): Promise<EscalationChainDto[]> {
    const chains = await this.escalationRepository.find({
      where: { status: In([EscalationChainStatus.PENDING, EscalationChainStatus.IN_PROGRESS]) },
      relations: ['alert', 'alertRule', 'createdBy'],
      order: { nextEscalationAt: 'ASC' },
    });

    return chains.map((chain) => this.mapChainToDto(chain));
  }

  /**
   * Escalate an alert to the next level
   */
  async escalateAlert(chainId: string, escalatedById: string): Promise<EscalationChainDto> {
    this.logger.log(`Escalating alert for chain ${chainId}`);

    const chain = await this.escalationRepository.findOne({
      where: { id: chainId },
      relations: ['alert', 'escalationRules'],
    });

    if (!chain) {
      throw new NotFoundException(`Escalation chain ${chainId} not found`);
    }

    if (chain.status === EscalationChainStatus.RESOLVED || chain.status === EscalationChainStatus.CANCELLED) {
      throw new BadRequestException(`Cannot escalate a ${chain.status} escalation chain`);
    }

    const nextLevel = chain.currentLevel + 1;
    if (nextLevel > chain.maxLevels) {
      throw new BadRequestException('Maximum escalation level reached');
    }

    const escalationRule = chain.escalationRules[nextLevel - 1];
    if (!escalationRule) {
      throw new BadRequestException(`No escalation rule defined for level ${nextLevel}`);
    }

    // Update chain status
    chain.currentLevel = nextLevel;
    chain.status = EscalationChainStatus.ESCALATED;

    // Add to escalation history
    if (!chain.escalationHistory) {
      chain.escalationHistory = [];
    }

    chain.escalationHistory.push({
      level: nextLevel,
      escalatedAt: new Date(),
      escalatedToRoles: escalationRule.roles,
      notificationsSent: [],
    });

    // Calculate next escalation time
    if (nextLevel < chain.maxLevels) {
      const nextRule = chain.escalationRules[nextLevel];
      const totalDelay = nextRule.delayMinutes;
      chain.nextEscalationAt = new Date(Date.now() + totalDelay * 60 * 1000);
    } else {
      // No more escalations
      chain.nextEscalationAt = null;
    }

    const saved = await this.escalationRepository.save(chain);

    // Trigger escalation workflow if configured
    if (escalationRule.workflowId) {
      await this.triggerEscalationWorkflow(chainId, escalationRule.workflowId);
    }

    // Schedule next escalation if not at max level
    if (nextLevel < chain.maxLevels) {
      await this.scheduleNextEscalation(chainId);
    }

    return this.mapChainToDto(saved);
  }

  /**
   * Resolve an escalation chain
   */
  async resolveEscalationChain(
    chainId: string,
    resolutionNotes: string,
    resolvedById: string,
  ): Promise<EscalationChainDto> {
    this.logger.log(`Resolving escalation chain ${chainId}`);

    const chain = await this.escalationRepository.findOne({
      where: { id: chainId },
    });

    if (!chain) {
      throw new NotFoundException(`Escalation chain ${chainId} not found`);
    }

    const user = await this.userRepository.findOne({ where: { id: resolvedById } });
    if (!user) {
      throw new NotFoundException(`User ${resolvedById} not found`);
    }

    chain.status = EscalationChainStatus.RESOLVED;
    chain.escalationNotes = resolutionNotes;
    chain.resolvedById = resolvedById;
    chain.resolvedAt = new Date();
    chain.nextEscalationAt = null;

    const saved = await this.escalationRepository.save(chain);

    // Cancel any scheduled escalations
    await this.cancelScheduledEscalation(chainId);

    return this.mapChainToDto(saved);
  }

  /**
   * Cancel an escalation chain
   */
  async cancelEscalationChain(chainId: string, cancelledById: string): Promise<EscalationChainDto> {
    this.logger.log(`Cancelling escalation chain ${chainId}`);

    const chain = await this.escalationRepository.findOne({
      where: { id: chainId },
    });

    if (!chain) {
      throw new NotFoundException(`Escalation chain ${chainId} not found`);
    }

    const user = await this.userRepository.findOne({ where: { id: cancelledById } });
    if (!user) {
      throw new NotFoundException(`User ${cancelledById} not found`);
    }

    chain.status = EscalationChainStatus.CANCELLED;
    chain.nextEscalationAt = null;

    const saved = await this.escalationRepository.save(chain);

    // Cancel any scheduled escalations
    await this.cancelScheduledEscalation(chainId);

    return this.mapChainToDto(saved);
  }

  /**
   * Get escalation chains by alert severity
   */
  async getEscalationChainsBySeverity(severity: AlertSeverity): Promise<EscalationChainDto[]> {
    const chains = await this.escalationRepository
      .createQueryBuilder('chain')
      .innerJoinAndSelect('chain.alert', 'alert')
      .where('alert.severity = :severity', { severity })
      .andWhereInIds([EscalationChainStatus.PENDING, EscalationChainStatus.IN_PROGRESS])
      .orderBy('chain.nextEscalationAt', 'ASC')
      .getMany();

    return chains.map((chain) => this.mapChainToDto(chain));
  }

  /**
   * Get escalation statistics
   */
  async getEscalationStatistics(): Promise<{
    activeChains: number;
    pendingEscalations: number;
    escalatedAlerts: number;
    averageEscalationLevels: number;
  }> {
    const activeCount = await this.escalationRepository.count({
      where: { status: In([EscalationChainStatus.PENDING, EscalationChainStatus.IN_PROGRESS]) },
    });

    const pendingCount = await this.escalationRepository.count({
      where: { status: EscalationChainStatus.PENDING },
    });

    const escalatedCount = await this.escalationRepository.count({
      where: { status: EscalationChainStatus.ESCALATED },
    });

    // Calculate average escalation levels
    const chains = await this.escalationRepository.find();
    const avgLevels = chains.length > 0 ? chains.reduce((sum, c) => sum + c.currentLevel, 0) / chains.length : 0;

    return {
      activeChains: activeCount,
      pendingEscalations: pendingCount,
      escalatedAlerts: escalatedCount,
      averageEscalationLevels: Math.round(avgLevels * 100) / 100,
    };
  }

  // ============================================================================
  // PRIVATE HELPER METHODS
  // ============================================================================

  /**
   * Schedule the next escalation for a chain
   */
  private async scheduleNextEscalation(chainId: string): Promise<void> {
    const chain = await this.escalationRepository.findOne({
      where: { id: chainId },
    });

    if (!chain || !chain.nextEscalationAt) {
      return;
    }

    const delayMs = chain.nextEscalationAt.getTime() - Date.now();
    if (delayMs <= 0) {
      // Escalation is overdue, execute immediately
      await this.escalateAlert(chainId, chain.createdById);
      return;
    }

    try {
      const taskName = `escalation-${chainId}`;
      // Clear any existing task
      try {
        this.schedulerRegistry.deleteTimeout(taskName);
      } catch (e) {
        // Task doesn't exist, ignore
      }

      // Schedule new task
      const timeout = setTimeout(() => {
        this.escalateAlert(chainId, chain.createdById).catch((err) => {
          this.logger.error(`Failed to escalate chain ${chainId}: ${err.message}`);
        });
      }, delayMs);

      this.schedulerRegistry.addTimeout(taskName, timeout);
      this.logger.log(`Scheduled escalation for chain ${chainId} in ${delayMs}ms`);
    } catch (err) {
      this.logger.error(`Failed to schedule escalation for chain ${chainId}: ${err.message}`);
    }
  }

  /**
   * Cancel a scheduled escalation
   */
  private async cancelScheduledEscalation(chainId: string): Promise<void> {
    try {
      const taskName = `escalation-${chainId}`;
      this.schedulerRegistry.deleteTimeout(taskName);
      this.logger.log(`Cancelled scheduled escalation for chain ${chainId}`);
    } catch (err) {
      // Task doesn't exist, ignore
    }
  }

  /**
   * Trigger an escalation workflow
   */
  private async triggerEscalationWorkflow(chainId: string, workflowId: string): Promise<void> {
    const workflow = await this.workflowRepository.findOne({
      where: { id: workflowId, type: WorkflowType.ESCALATION },
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

    // Update chain with workflow execution reference
    chain.workflowExecutionId = workflowId;
    await this.escalationRepository.save(chain);

    this.logger.log(`Triggered escalation workflow ${workflowId} for chain ${chainId}`);
  }

  /**
   * Map escalation chain to DTO
   */
  private mapChainToDto(chain: AlertEscalationChain): EscalationChainDto {
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
}
