import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, ILike } from 'typeorm';
import { DocumentTemplate } from './entities/document-template.entity';
import { CreateDocumentTemplateDto } from './dto/create-template.dto';
import { TemplateQueryDto } from './dto/template-query.dto';

@Injectable()
export class DocumentTemplatesService {
  private readonly logger = new Logger(DocumentTemplatesService.name);

  constructor(
    @InjectRepository(DocumentTemplate)
    private templateRepository: Repository<DocumentTemplate>,
  ) {}

  async create(dto: CreateDocumentTemplateDto, userId: string): Promise<DocumentTemplate> {
    const template = this.templateRepository.create({
      ...dto,
      created_by: userId,
    });
    return this.templateRepository.save(template);
  }

  async findAll(query: TemplateQueryDto): Promise<DocumentTemplate[]> {
    const { type, category, isActive, search } = query;
    const queryBuilder = this.templateRepository
      .createQueryBuilder('template')
      .leftJoinAndSelect('template.creator', 'creator')
      .where('template.deleted_at IS NULL');

    if (type) {
      queryBuilder.andWhere('template.type = :type', { type });
    }

    if (category) {
      queryBuilder.andWhere('template.category = :category', { category });
    }

    if (isActive !== undefined) {
      queryBuilder.andWhere('template.isActive = :isActive', { isActive });
    }

    if (search) {
      queryBuilder.andWhere(
        '(template.name ILIKE :search OR template.description ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    return queryBuilder.orderBy('template.name', 'ASC').getMany();
  }

  async findOne(id: string): Promise<DocumentTemplate> {
    const template = await this.templateRepository.findOne({
      where: { id, deleted_at: IsNull() },
      relations: ['creator', 'updater'],
    });

    if (!template) {
      throw new NotFoundException(`Template with ID ${id} not found`);
    }

    return template;
  }

  async update(id: string, dto: Partial<CreateDocumentTemplateDto>, userId: string): Promise<DocumentTemplate> {
    const template = await this.findOne(id);
    Object.assign(template, {
      ...dto,
      updated_by: userId,
    });
    return this.templateRepository.save(template);
  }

  async remove(id: string): Promise<void> {
    const template = await this.findOne(id);
    await this.templateRepository.softDelete(id);
  }
}


