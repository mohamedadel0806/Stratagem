import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { SOPTemplate, TemplateStatus } from '../entities/sop-template.entity';
import { CreateSOPTemplateDto, UpdateSOPTemplateDto, SOPTemplateQueryDto } from '../dto/sop-template.dto';

@Injectable()
export class SOPTemplatesService {
  private readonly logger = new Logger(SOPTemplatesService.name);

  constructor(
    @InjectRepository(SOPTemplate)
    private templateRepository: Repository<SOPTemplate>,
  ) {}

  async create(createDto: CreateSOPTemplateDto, userId: string): Promise<SOPTemplate> {
    // Check if template_key already exists
    const existing = await this.templateRepository.findOne({
      where: { template_key: createDto.template_key },
    });

    if (existing) {
      throw new Error(`Template with key ${createDto.template_key} already exists`);
    }

    const template = this.templateRepository.create({
      ...createDto,
      created_by: userId,
      status: createDto.status || TemplateStatus.DRAFT,
    });

    return this.templateRepository.save(template);
  }

  async findAll(queryDto: SOPTemplateQueryDto) {
    const { page = 1, limit = 25, status, category, search, sort } = queryDto;
    const skip = (page - 1) * limit;

    const queryBuilder = this.templateRepository
      .createQueryBuilder('template')
      .leftJoinAndSelect('template.owner', 'owner')
      .leftJoinAndSelect('template.creator', 'creator')
      .leftJoinAndSelect('template.updater', 'updater');

    if (status) {
      queryBuilder.andWhere('template.status = :status', { status });
    }

    if (category) {
      queryBuilder.andWhere('template.category = :category', { category });
    }

    if (search) {
      queryBuilder.andWhere(
        '(template.title ILIKE :search OR template.description ILIKE :search OR template.template_key ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (sort) {
      const [field, order] = sort.split(':');
      queryBuilder.orderBy(`template.${field}`, order.toUpperCase() as 'ASC' | 'DESC');
    } else {
      queryBuilder.orderBy('template.created_at', 'DESC');
    }

    const [data, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<SOPTemplate> {
    const template = await this.templateRepository.findOne({
      where: { id },
      relations: ['owner', 'creator', 'updater'],
    });

    if (!template) {
      throw new NotFoundException(`SOP template with ID ${id} not found`);
    }

    return template;
  }

  async findByKey(templateKey: string): Promise<SOPTemplate> {
    const template = await this.templateRepository.findOne({
      where: { template_key: templateKey },
      relations: ['owner', 'creator', 'updater'],
    });

    if (!template) {
      throw new NotFoundException(`SOP template with key ${templateKey} not found`);
    }

    return template;
  }

  async update(id: string, updateDto: UpdateSOPTemplateDto, userId: string): Promise<SOPTemplate> {
    const template = await this.findOne(id);

    // Template key is immutable and cannot be changed after creation
    Object.assign(template, {
      ...updateDto,
      updated_by: userId,
    });

    return this.templateRepository.save(template);
  }

  async remove(id: string): Promise<void> {
    const template = await this.findOne(id);
    await this.templateRepository.softRemove(template);
  }

  async getActiveTemplates(): Promise<SOPTemplate[]> {
    return this.templateRepository.find({
      where: { status: TemplateStatus.ACTIVE },
      relations: ['owner'],
      order: { title: 'ASC' },
    });
  }

  async getTemplatesByCategory(category: string): Promise<SOPTemplate[]> {
    return this.templateRepository.find({
      where: {
        category,
        status: TemplateStatus.ACTIVE,
      },
      relations: ['owner'],
      order: { title: 'ASC' },
    });
  }

  async cloneTemplate(id: string, newKey: string, userId: string): Promise<SOPTemplate> {
    const original = await this.findOne(id);

    const cloned = this.templateRepository.create({
      template_key: newKey,
      title: `${original.title} (Clone)`,
      category: original.category,
      description: original.description,
      purpose_template: original.purpose_template,
      scope_template: original.scope_template,
      content_template: original.content_template,
      success_criteria_template: original.success_criteria_template,
      status: TemplateStatus.DRAFT,
      tags: [...(original.tags || [])],
      metadata: { ...original.metadata },
      created_by: userId,
    });

    return this.templateRepository.save(cloned);
  }
}
