import { Injectable, NotFoundException, Logger, Inject, Optional } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { ControlObjective, ImplementationStatus } from './entities/control-objective.entity';
import { CreateControlObjectiveDto } from './dto/create-control-objective.dto';
import { Policy } from '../policies/entities/policy.entity';
import { UnifiedControl } from '../unified-controls/entities/unified-control.entity';
import { NotificationService } from '../../common/services/notification.service';
import { NotificationType, NotificationPriority } from '../../common/entities/notification.entity';

@Injectable()
export class ControlObjectivesService {
  private readonly logger = new Logger(ControlObjectivesService.name);

  constructor(
    @InjectRepository(ControlObjective)
    private controlObjectiveRepository: Repository<ControlObjective>,
    @InjectRepository(Policy)
    private policyRepository: Repository<Policy>,
    @InjectRepository(UnifiedControl)
    private unifiedControlRepository: Repository<UnifiedControl>,
    @Optional() private notificationService?: NotificationService,
  ) {}

  async create(createDto: CreateControlObjectiveDto, userId: string): Promise<ControlObjective> {
    // Verify policy exists
    const policy = await this.policyRepository.findOne({
      where: { id: createDto.policy_id },
    });

    if (!policy) {
      throw new NotFoundException(`Policy with ID ${createDto.policy_id} not found`);
    }

    const controlObjective = this.controlObjectiveRepository.create({
      ...createDto,
      created_by: userId,
    });

    const savedObjective = await this.controlObjectiveRepository.save(controlObjective);

    // Send notifications for control objective creation
    if (this.notificationService) {
      try {
        // Notify policy owner
        if (policy.owner_id) {
          await this.notificationService.create({
            userId: policy.owner_id,
            type: NotificationType.GENERAL,
            priority: NotificationPriority.MEDIUM,
            title: 'New Control Objective Added',
            message: `Control objective "${savedObjective.objective_identifier}" has been added to policy "${policy.title}".`,
            entityType: 'policy',
            entityId: policy.id,
            actionUrl: `/dashboard/governance/policies/${policy.id}`,
          });
        }
        
        // Notify responsible party if assigned
        if (savedObjective.responsible_party_id) {
          await this.notificationService.create({
            userId: savedObjective.responsible_party_id,
            type: NotificationType.GENERAL,
            priority: NotificationPriority.MEDIUM,
            title: 'Control Objective Assigned to You',
            message: `Control objective "${savedObjective.objective_identifier}" has been assigned to you.`,
            entityType: 'policy',
            entityId: policy.id,
            actionUrl: `/dashboard/governance/policies/${policy.id}`,
          });
        }
      } catch (error) {
        this.logger.error(`Failed to send notification on control objective creation: ${error.message}`, error.stack);
      }
    }

    return savedObjective;
  }

  async findAll(policyId?: string) {
    const queryBuilder = this.controlObjectiveRepository
      .createQueryBuilder('co')
      .leftJoinAndSelect('co.responsible_party', 'responsible_party')
      .leftJoinAndSelect('co.creator', 'creator')
      .orderBy('co.display_order', 'ASC')
      .addOrderBy('co.created_at', 'ASC');

    if (policyId) {
      queryBuilder.where('co.policy_id = :policyId', { policyId });
    }

    return queryBuilder.getMany();
  }

  async findOne(id: string): Promise<ControlObjective> {
    const controlObjective = await this.controlObjectiveRepository.findOne({
      where: { id },
      relations: ['policy', 'responsible_party', 'creator', 'updater', 'unified_controls'],
    });

    if (!controlObjective) {
      throw new NotFoundException(`Control objective with ID ${id} not found`);
    }

    return controlObjective;
  }

  async update(id: string, updateDto: Partial<CreateControlObjectiveDto>, userId: string): Promise<ControlObjective> {
    const controlObjective = await this.findOne(id);
    const oldStatus = controlObjective.implementation_status;
    const oldResponsiblePartyId = controlObjective.responsible_party_id;

    Object.assign(controlObjective, {
      ...updateDto,
      updated_by: userId,
    });

    const savedObjective = await this.controlObjectiveRepository.save(controlObjective);

    // Send notifications for control objective updates
    if (this.notificationService) {
      try {
        // Implementation status change notification
        if (oldStatus !== savedObjective.implementation_status && savedObjective.responsible_party_id) {
          await this.notificationService.create({
            userId: savedObjective.responsible_party_id,
            type: NotificationType.GENERAL,
            priority: NotificationPriority.MEDIUM,
            title: 'Control Objective Status Changed',
            message: `Control objective "${savedObjective.objective_identifier}" implementation status has changed from ${oldStatus} to ${savedObjective.implementation_status}.`,
            entityType: 'policy',
            entityId: savedObjective.policy_id,
            actionUrl: `/dashboard/governance/policies/${savedObjective.policy_id}`,
          });
        }

        // Responsible party change notification
        if (oldResponsiblePartyId !== savedObjective.responsible_party_id) {
          // Notify new responsible party
          if (savedObjective.responsible_party_id) {
            await this.notificationService.create({
              userId: savedObjective.responsible_party_id,
              type: NotificationType.GENERAL,
              priority: NotificationPriority.MEDIUM,
              title: 'Control Objective Assigned to You',
              message: `Control objective "${savedObjective.objective_identifier}" has been assigned to you.`,
              entityType: 'policy',
              entityId: savedObjective.policy_id,
              actionUrl: `/dashboard/governance/policies/${savedObjective.policy_id}`,
            });
          }
          // Notify old responsible party
          if (oldResponsiblePartyId) {
            await this.notificationService.create({
              userId: oldResponsiblePartyId,
              type: NotificationType.GENERAL,
              priority: NotificationPriority.LOW,
              title: 'Control Objective Assignment Changed',
              message: `Control objective "${savedObjective.objective_identifier}" has been reassigned.`,
              entityType: 'policy',
              entityId: savedObjective.policy_id,
              actionUrl: `/dashboard/governance/policies/${savedObjective.policy_id}`,
            });
          }
        }
      } catch (error) {
        this.logger.error(`Failed to send notification on control objective update: ${error.message}`, error.stack);
      }
    }

    return savedObjective;
  }

  async remove(id: string): Promise<void> {
    const controlObjective = await this.findOne(id);
    
    // Send notification before deletion
    if (this.notificationService && controlObjective.responsible_party_id) {
      try {
        await this.notificationService.create({
          userId: controlObjective.responsible_party_id,
          type: NotificationType.GENERAL,
          priority: NotificationPriority.MEDIUM,
          title: 'Control Objective Removed',
          message: `Control objective "${controlObjective.objective_identifier}" has been removed from the policy.`,
          entityType: 'policy',
          entityId: controlObjective.policy_id,
          actionUrl: `/dashboard/governance/policies/${controlObjective.policy_id}`,
        });
      } catch (error) {
        this.logger.error(`Failed to send notification on control objective deletion: ${error.message}`, error.stack);
      }
    }

    await this.controlObjectiveRepository.softRemove(controlObjective);
  }

  async linkUnifiedControls(id: string, controlIds: string[]): Promise<ControlObjective> {
    const controlObjective = await this.findOne(id);
    const controls = await this.unifiedControlRepository.find({
      where: { id: In(controlIds) },
    });

    if (controls.length === 0 && controlIds.length > 0) {
      throw new NotFoundException('No unified controls found with the provided IDs');
    }

    // Add new controls, avoiding duplicates
    const currentControlIds = new Set(controlObjective.unified_controls?.map(c => c.id) || []);
    const newControls = controls.filter(c => !currentControlIds.has(c.id));
    
    controlObjective.unified_controls = [
      ...(controlObjective.unified_controls || []),
      ...newControls
    ];

    return this.controlObjectiveRepository.save(controlObjective);
  }

  async unlinkUnifiedControls(id: string, controlIds: string[]): Promise<ControlObjective> {
    const controlObjective = await this.findOne(id);
    
    if (!controlObjective.unified_controls) {
      return controlObjective;
    }

    controlObjective.unified_controls = controlObjective.unified_controls.filter(
      c => !controlIds.includes(c.id)
    );

    return this.controlObjectiveRepository.save(controlObjective);
  }

  async getUnifiedControls(id: string): Promise<UnifiedControl[]> {
    const controlObjective = await this.findOne(id);
    return controlObjective.unified_controls || [];
  }
}

