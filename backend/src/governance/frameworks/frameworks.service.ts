import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ComplianceFramework, FrameworkStatus } from '../../common/entities/compliance-framework.entity';
import { FrameworkRequirement } from '../unified-controls/entities/framework-requirement.entity';
import { FrameworkVersion } from './entities/framework-version.entity';
import { CreateFrameworkVersionDto } from './dto/create-framework-version.dto';
import { ImportFrameworkStructureDto } from './dto/import-framework-structure.dto';

@Injectable()
export class FrameworksService {
  constructor(
    @InjectRepository(ComplianceFramework)
    private frameworkRepository: Repository<ComplianceFramework>,
    @InjectRepository(FrameworkRequirement)
    private requirementRepository: Repository<FrameworkRequirement>,
    @InjectRepository(FrameworkVersion)
    private versionRepository: Repository<FrameworkVersion>,
  ) {}

  async getAllFrameworks(): Promise<ComplianceFramework[]> {
    return this.frameworkRepository.find({
      where: { status: FrameworkStatus.ACTIVE },
      order: { name: 'ASC' },
    });
  }

  async getFramework(id: string): Promise<ComplianceFramework> {
    const framework = await this.frameworkRepository.findOne({ where: { id } });
    if (!framework) {
      throw new NotFoundException(`Framework with ID ${id} not found`);
    }
    return framework;
  }

  async createVersion(frameworkId: string, createDto: CreateFrameworkVersionDto, userId: string): Promise<FrameworkVersion> {
    const framework = await this.frameworkRepository.findOne({ where: { id: frameworkId } });
    if (!framework) {
      throw new NotFoundException(`Framework with ID ${frameworkId} not found`);
    }

    // Check if version already exists
    const existingVersion = await this.versionRepository.findOne({
      where: { framework_id: frameworkId, version: createDto.version },
    });

    if (existingVersion) {
      throw new BadRequestException(`Version ${createDto.version} already exists for this framework`);
    }

    // If this is marked as current, unset other current versions
    if (createDto.is_current) {
      await this.versionRepository.update(
        { framework_id: frameworkId },
        { is_current: false },
      );
    }

    const version = this.versionRepository.create({
      ...createDto,
      framework_id: frameworkId,
      created_by: userId,
      structure: createDto.structure || framework.structure,
    });

    const savedVersion = await this.versionRepository.save(version);

    // Update framework version if this is current
    if (createDto.is_current) {
      await this.frameworkRepository.update(frameworkId, {
        version: createDto.version,
        structure: createDto.structure || framework.structure,
        updated_by: userId,
      });
    }

    return savedVersion;
  }

  async getVersions(frameworkId: string): Promise<FrameworkVersion[]> {
    return this.versionRepository.find({
      where: { framework_id: frameworkId },
      relations: ['creator'],
      order: { created_at: 'DESC' },
    });
  }

  async getVersion(frameworkId: string, version: string): Promise<FrameworkVersion> {
    const frameworkVersion = await this.versionRepository.findOne({
      where: { framework_id: frameworkId, version },
      relations: ['framework', 'creator'],
    });

    if (!frameworkVersion) {
      throw new NotFoundException(`Version ${version} not found for framework ${frameworkId}`);
    }

    return frameworkVersion;
  }

  async setCurrentVersion(frameworkId: string, version: string, userId: string): Promise<FrameworkVersion> {
    const frameworkVersion = await this.getVersion(frameworkId, version);

    // Unset all current versions
    await this.versionRepository.update(
      { framework_id: frameworkId },
      { is_current: false },
    );

    // Set this as current
    frameworkVersion.is_current = true;
    await this.versionRepository.save(frameworkVersion);

    // Update framework
    await this.frameworkRepository.update(frameworkId, {
      version: frameworkVersion.version,
      structure: frameworkVersion.structure,
      updated_by: userId,
    });

    return frameworkVersion;
  }

  async importFrameworkStructure(importDto: ImportFrameworkStructureDto, userId: string): Promise<{
    framework: ComplianceFramework;
    requirementsCreated: number;
    version?: FrameworkVersion;
  }> {
    const framework = await this.frameworkRepository.findOne({
      where: { id: importDto.framework_id },
    });

    if (!framework) {
      throw new NotFoundException(`Framework with ID ${importDto.framework_id} not found`);
    }

    if (!importDto.structure) {
      throw new BadRequestException('Structure is required for import');
    }

    let requirementsCreated = 0;

    // If replace_existing, delete existing requirements
    if (importDto.replace_existing) {
      await this.requirementRepository.delete({ framework_id: importDto.framework_id });
    }

    // Import structure and create requirements
    if (importDto.structure.domains) {
      for (const domain of importDto.structure.domains) {
        if (domain.categories) {
          for (const category of domain.categories) {
            if (category.requirements) {
              for (const req of category.requirements) {
                // Check if requirement already exists
                const existing = await this.requirementRepository.findOne({
                  where: {
                    framework_id: importDto.framework_id,
                    requirement_identifier: req.identifier,
                  },
                });

                if (!existing) {
                  const requirement = this.requirementRepository.create({
                    framework_id: importDto.framework_id,
                    requirement_identifier: req.identifier,
                    title: req.title,
                    requirement_text: req.text,
                    description: req.description,
                    domain: domain.name,
                    category: category.name,
                    subcategory: req.subcategory,
                    display_order: req.display_order,
                  });

                  await this.requirementRepository.save(requirement);
                  requirementsCreated++;
                }
              }
            }
          }
        }
      }
    }

    // Update framework structure
    framework.structure = importDto.structure;
    if (importDto.version) {
      framework.version = importDto.version;
    }
    framework.updated_by = userId;
    await this.frameworkRepository.save(framework);

    // Create version if requested
    let version: FrameworkVersion | undefined;
    if (importDto.create_version && importDto.version) {
      version = await this.createVersion(
        importDto.framework_id,
        {
          version: importDto.version,
          structure: importDto.structure,
          is_current: true,
        },
        userId,
      );
    }

    return {
      framework,
      requirementsCreated,
      version,
    };
  }

  async getFrameworkWithStructure(frameworkId: string): Promise<ComplianceFramework & { requirements: FrameworkRequirement[] }> {
    const framework = await this.frameworkRepository.findOne({
      where: { id: frameworkId },
    });

    if (!framework) {
      throw new NotFoundException(`Framework with ID ${frameworkId} not found`);
    }

    const requirements = await this.requirementRepository.find({
      where: { framework_id: frameworkId },
      order: { display_order: 'ASC', requirement_identifier: 'ASC' },
    });

    return {
      ...framework,
      requirements,
    } as ComplianceFramework & { requirements: FrameworkRequirement[] };
  }

  /**
   * Get all requirements for a specific framework
   */
  async getFrameworkRequirements(frameworkId: string): Promise<FrameworkRequirement[]> {
    const framework = await this.frameworkRepository.findOne({ where: { id: frameworkId } });
    if (!framework) {
      throw new NotFoundException(`Framework with ID ${frameworkId} not found`);
    }

    return this.requirementRepository.find({
      where: { framework_id: frameworkId },
      order: { display_order: 'ASC', requirement_identifier: 'ASC' },
    });
  }

  /**
   * Get framework domains from structure
   */
  async getFrameworkDomains(frameworkId: string): Promise<string[]> {
    const framework = await this.frameworkRepository.findOne({ where: { id: frameworkId } });
    if (!framework) {
      throw new NotFoundException(`Framework with ID ${frameworkId} not found`);
    }

    const domains: string[] = [];
    if (framework.structure?.domains) {
      framework.structure.domains.forEach((domain) => {
        if (domain.name && !domains.includes(domain.name)) {
          domains.push(domain.name);
        }
      });
    }
    return domains;
  }

  /**
   * Get framework categories for a specific domain
   */
  async getFrameworkCategories(frameworkId: string, domain?: string): Promise<string[]> {
    const framework = await this.frameworkRepository.findOne({ where: { id: frameworkId } });
    if (!framework) {
      throw new NotFoundException(`Framework with ID ${frameworkId} not found`);
    }

    const categories: string[] = [];
    if (framework.structure?.domains) {
      framework.structure.domains.forEach((d) => {
        if (!domain || d.name === domain) {
          d.categories?.forEach((category) => {
            if (category.name && !categories.includes(category.name)) {
              categories.push(category.name);
            }
          });
        }
      });
    }
    return categories;
  }

  /**
   * Get framework statistics
   */
  async getFrameworkStatistics(frameworkId: string): Promise<{
    totalDomains: number;
    totalCategories: number;
    totalRequirements: number;
    version?: string;
    status: string;
  }> {
    const framework = await this.frameworkRepository.findOne({ where: { id: frameworkId } });
    if (!framework) {
      throw new NotFoundException(`Framework with ID ${frameworkId} not found`);
    }

    let totalDomains = 0;
    let totalCategories = 0;
    let totalRequirements = 0;

    if (framework.structure?.domains) {
      totalDomains = framework.structure.domains.length;
      framework.structure.domains.forEach((domain) => {
        if (domain.categories) {
          totalCategories += domain.categories.length;
          domain.categories.forEach((category) => {
            if (category.requirements) {
              totalRequirements += category.requirements.length;
            }
          });
        }
      });
    }

    return {
      totalDomains,
      totalCategories,
      totalRequirements,
      version: framework.version,
      status: framework.status,
    };
  }

  /**
   * Check if a framework is active in the system
   */
  async isFrameworkActive(frameworkId: string): Promise<boolean> {
    const framework = await this.frameworkRepository.findOne({ where: { id: frameworkId } });
    if (!framework) {
      return false;
    }
    return framework.status === FrameworkStatus.ACTIVE;
  }

  /**
   * Get all active frameworks
   */
  async getAllActiveFrameworks(): Promise<ComplianceFramework[]> {
    return this.frameworkRepository.find({
      where: { status: FrameworkStatus.ACTIVE },
      order: { name: 'ASC' },
    });
  }

  /**
   * Search frameworks by name or code
   */
  async searchFrameworks(query: string): Promise<ComplianceFramework[]> {
    const frameworks = await this.frameworkRepository
      .createQueryBuilder('framework')
      .where('framework.name ILIKE :query', { query: `%${query}%` })
      .orWhere('framework.framework_code ILIKE :query', { query: `%${query}%` })
      .andWhere('framework.status = :status', { status: 'active' })
      .orderBy('framework.name', 'ASC')
      .getMany();

    return frameworks;
  }
}


