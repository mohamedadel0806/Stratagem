import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { ControlDomain } from './entities/domain.entity';
import { CreateDomainDto } from './dto/create-domain.dto';
import { UpdateDomainDto } from './dto/update-domain.dto';

@Injectable()
export class DomainsService {
  constructor(
    @InjectRepository(ControlDomain)
    private domainRepository: Repository<ControlDomain>,
  ) { }

  async create(createDomainDto: CreateDomainDto, userId: string, tenantId?: string): Promise<ControlDomain> {
    // Check for circular reference if parent_id is provided
    if (createDomainDto.parent_id) {
      await this.validateNoCircularReference(createDomainDto.parent_id, null);
    }

    const domain = this.domainRepository.create({
      ...createDomainDto,
      created_by: userId,
      tenantId: tenantId,
    });

    return this.domainRepository.save(domain);
  }

  async findAll(includeInactive = false): Promise<ControlDomain[]> {
    const where: FindOptionsWhere<ControlDomain> = {};
    if (!includeInactive) {
      where.is_active = true;
    }

    return this.domainRepository.find({
      where,
      relations: ['parent', 'owner', 'children'],
      order: { display_order: 'ASC', name: 'ASC' },
    });
  }

  async findOne(id: string): Promise<ControlDomain> {
    const domain = await this.domainRepository.findOne({
      where: { id },
      relations: ['parent', 'owner', 'children', 'creator', 'updater'],
    });

    if (!domain) {
      throw new NotFoundException(`Domain with ID ${id} not found`);
    }

    return domain;
  }

  async findHierarchy(): Promise<ControlDomain[]> {
    // Get all root domains (no parent)
    const roots = await this.domainRepository.find({
      where: { parent_id: null, is_active: true },
      relations: ['owner'],
      order: { display_order: 'ASC', name: 'ASC' },
    });

    // Recursively load children
    for (const root of roots) {
      root.children = await this.loadChildren(root.id);
    }

    return roots;
  }

  private async loadChildren(parentId: string): Promise<ControlDomain[]> {
    const children = await this.domainRepository.find({
      where: { parent_id: parentId, is_active: true },
      relations: ['owner'],
      order: { display_order: 'ASC', name: 'ASC' },
    });

    for (const child of children) {
      child.children = await this.loadChildren(child.id);
    }

    return children;
  }

  async update(id: string, updateDomainDto: UpdateDomainDto, userId: string): Promise<ControlDomain> {
    const domain = await this.findOne(id);

    // Check for circular reference if parent_id is being updated
    if (updateDomainDto.parent_id !== undefined) {
      if (updateDomainDto.parent_id === id) {
        throw new BadRequestException('Domain cannot be its own parent');
      }
      await this.validateNoCircularReference(updateDomainDto.parent_id, id);
    }

    Object.assign(domain, {
      ...updateDomainDto,
      updated_by: userId,
    });

    return this.domainRepository.save(domain);
  }

  async remove(id: string): Promise<void> {
    const domain = await this.findOne(id);

    // Check if domain has children
    const children = await this.domainRepository.find({
      where: { parent_id: id },
    });

    if (children.length > 0) {
      throw new BadRequestException(
        `Cannot delete domain "${domain.name}" because it has ${children.length} child domain(s). Please delete or reassign children first.`,
      );
    }

    // Check if domain is used by controls
    // Note: This would require a query to unified_controls table
    // For now, we'll do a soft delete which is safer

    await this.domainRepository.softRemove(domain);
  }

  private async validateNoCircularReference(parentId: string, excludeId: string | null): Promise<void> {
    let currentId = parentId;
    const visited = new Set<string>();

    while (currentId) {
      if (currentId === excludeId) {
        throw new BadRequestException('Circular reference detected in domain hierarchy');
      }

      if (visited.has(currentId)) {
        throw new BadRequestException('Circular reference detected in domain hierarchy');
      }

      visited.add(currentId);

      const parent = await this.domainRepository.findOne({
        where: { id: currentId },
        select: ['id', 'parent_id'],
      });

      if (!parent) {
        break;
      }

      currentId = parent.parent_id;
    }
  }

  async getDomainStatistics(): Promise<{
    total: number;
    active: number;
    withChildren: number;
    withOwner: number;
  }> {
    const [total, active, withChildren, withOwner] = await Promise.all([
      this.domainRepository.count(),
      this.domainRepository.count({ where: { is_active: true } }),
      this.domainRepository
        .createQueryBuilder('domain')
        .innerJoin('control_domains', 'child', 'child.parent_id = domain.id')
        .getCount(),
      this.domainRepository.count({ where: { owner_id: null } }).then((count) => total - count),
    ]);

    return {
      total,
      active,
      withChildren,
      withOwner,
    };
  }
}


