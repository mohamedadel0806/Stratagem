import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, ILike } from 'typeorm';
import { GovernanceFrameworkConfig } from '../entities/governance-framework-config.entity';
import { ComplianceFramework } from '../../common/entities/compliance-framework.entity';
import { User } from '../../users/entities/user.entity';
import { CreateGovernanceFrameworkConfigDto } from './dto/create-governance-framework-config.dto';
import { UpdateGovernanceFrameworkConfigDto } from './dto/update-governance-framework-config.dto';
import { GovernanceFrameworkConfigQueryDto } from './dto/governance-framework-config-query.dto';

@Injectable()
export class GovernanceFrameworkConfigService {
  private readonly logger = new Logger(GovernanceFrameworkConfigService.name);

  constructor(
    @InjectRepository(GovernanceFrameworkConfig)
    private frameworkConfigRepository: Repository<GovernanceFrameworkConfig>,
    @InjectRepository(ComplianceFramework)
    private complianceFrameworkRepository: Repository<ComplianceFramework>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(
    createFrameworkConfigDto: CreateGovernanceFrameworkConfigDto,
    userId: string,
  ): Promise<GovernanceFrameworkConfig> {
    // Validate linked framework if provided
    if (createFrameworkConfigDto.linked_framework_id) {
      const linkedFramework = await this.complianceFrameworkRepository.findOne({
        where: { id: createFrameworkConfigDto.linked_framework_id },
      });
      if (!linkedFramework) {
        throw new BadRequestException(
          `Compliance framework with ID ${createFrameworkConfigDto.linked_framework_id} not found`,
        );
      }
    }

    // Check for duplicate name
    const existingConfig = await this.frameworkConfigRepository.findOne({
      where: { name: createFrameworkConfigDto.name, deleted_at: null },
    });
    if (existingConfig) {
      throw new ConflictException(
        `A governance framework configuration with name "${createFrameworkConfigDto.name}" already exists`,
      );
    }

    const frameworkConfig = this.frameworkConfigRepository.create({
      ...createFrameworkConfigDto,
      created_by: userId,
      updated_by: userId,
    });

    const savedConfig = await this.frameworkConfigRepository.save(
      frameworkConfig,
    );

    this.logger.log(
      `Created governance framework config: ${savedConfig.id} (${savedConfig.name})`,
    );

    return savedConfig;
  }

  async findAll(queryDto: GovernanceFrameworkConfigQueryDto) {
    const {
      page = 1,
      limit = 25,
      framework_type,
      is_active,
      search,
      sort = 'created_at:DESC',
    } = queryDto;
    const skip = (page - 1) * limit;

    const where: FindOptionsWhere<GovernanceFrameworkConfig> = {
      deleted_at: null,
    };

    if (framework_type) {
      where.framework_type = framework_type;
    }

    if (is_active !== undefined) {
      where.is_active = is_active;
    }

    if (search) {
      where.name = ILike(`%${search}%`);
    }

    const [data, total] = await this.frameworkConfigRepository.findAndCount({
      where,
      order: this.parseSortQuery(sort),
      skip,
      take: limit,
      relations: ['linked_framework', 'creator', 'updater'],
    });

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<GovernanceFrameworkConfig> {
    const config = await this.frameworkConfigRepository.findOne({
      where: { id, deleted_at: null },
      relations: ['linked_framework', 'creator', 'updater'],
    });

    if (!config) {
      throw new NotFoundException(
        `Governance framework configuration with ID ${id} not found`,
      );
    }

    return config;
  }

  async update(
    id: string,
    updateFrameworkConfigDto: UpdateGovernanceFrameworkConfigDto,
    userId: string,
  ): Promise<GovernanceFrameworkConfig> {
    const config = await this.findOne(id);

    // Validate linked framework if being updated
    if (
      updateFrameworkConfigDto.linked_framework_id &&
      updateFrameworkConfigDto.linked_framework_id !==
        config.linked_framework_id
    ) {
      const linkedFramework = await this.complianceFrameworkRepository.findOne({
        where: { id: updateFrameworkConfigDto.linked_framework_id },
      });
      if (!linkedFramework) {
        throw new BadRequestException(
          `Compliance framework with ID ${updateFrameworkConfigDto.linked_framework_id} not found`,
        );
      }
    }

    // Check for duplicate name if being updated
    if (updateFrameworkConfigDto.name && updateFrameworkConfigDto.name !== config.name) {
      const existingConfig = await this.frameworkConfigRepository.findOne({
        where: { name: updateFrameworkConfigDto.name, deleted_at: null },
      });
      if (existingConfig) {
        throw new ConflictException(
          `A governance framework configuration with name "${updateFrameworkConfigDto.name}" already exists`,
        );
      }
    }

    // Merge and update
    const updatedConfig = this.frameworkConfigRepository.merge(config, {
      ...updateFrameworkConfigDto,
      updated_by: userId,
    });

    const savedConfig = await this.frameworkConfigRepository.save(
      updatedConfig,
    );

    this.logger.log(
      `Updated governance framework config: ${savedConfig.id} (${savedConfig.name})`,
    );

    return savedConfig;
  }

  async remove(id: string): Promise<void> {
    const config = await this.findOne(id);

    // Soft delete
    await this.frameworkConfigRepository.update(id, {
      deleted_at: new Date(),
    });

    this.logger.log(
      `Soft deleted governance framework config: ${id} (${config.name})`,
    );
  }

  async hardDelete(id: string): Promise<void> {
    const config = await this.frameworkConfigRepository.findOne({
      where: { id },
    });

    if (!config) {
      throw new NotFoundException(
        `Governance framework configuration with ID ${id} not found`,
      );
    }

    await this.frameworkConfigRepository.remove(config);

    this.logger.log(
      `Hard deleted governance framework config: ${id} (${config.name})`,
    );
  }

  async activate(id: string, userId: string): Promise<GovernanceFrameworkConfig> {
    const config = await this.findOne(id);

    if (config.is_active) {
      throw new BadRequestException('Configuration is already active');
    }

    return this.update(id, { is_active: true }, userId);
  }

  async deactivate(id: string, userId: string): Promise<GovernanceFrameworkConfig> {
    const config = await this.findOne(id);

    if (!config.is_active) {
      throw new BadRequestException('Configuration is already inactive');
    }

    return this.update(id, { is_active: false }, userId);
  }

  async findByFrameworkType(frameworkType: string) {
    return this.frameworkConfigRepository.find({
      where: { framework_type: frameworkType as any, deleted_at: null },
      relations: ['linked_framework', 'creator', 'updater'],
      order: { created_at: 'DESC' },
    });
  }

  async findActiveConfigs() {
    return this.frameworkConfigRepository.find({
      where: { is_active: true, deleted_at: null },
      relations: ['linked_framework', 'creator', 'updater'],
      order: { created_at: 'DESC' },
    });
  }

  private parseSortQuery(
    sort: string,
  ): Record<string, 'ASC' | 'DESC'> {
    const parts = sort.split(':');
    const field = parts[0];
    const direction = (parts[1] || 'ASC').toUpperCase() as 'ASC' | 'DESC';
    return { [field]: direction };
  }
}
