import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { FrameworkControlMapping, MappingCoverage } from '../entities/framework-control-mapping.entity';
import { UnifiedControl } from '../entities/unified-control.entity';
import { FrameworkRequirement } from '../entities/framework-requirement.entity';

@Injectable()
export class FrameworkControlMappingService {
  private readonly logger = new Logger(FrameworkControlMappingService.name);

  constructor(
    @InjectRepository(FrameworkControlMapping)
    private mappingRepository: Repository<FrameworkControlMapping>,
    @InjectRepository(UnifiedControl)
    private controlRepository: Repository<UnifiedControl>,
    @InjectRepository(FrameworkRequirement)
    private requirementRepository: Repository<FrameworkRequirement>,
  ) {}

  /**
   * Create a mapping between a control and a framework requirement
   */
  async createMapping(
    controlId: string,
    requirementId: string,
    coverageLevel: MappingCoverage,
    mappingNotes?: string,
    userId?: string,
  ): Promise<FrameworkControlMapping> {
    // Verify control exists
    const control = await this.controlRepository.findOne({ where: { id: controlId } });
    if (!control) {
      throw new NotFoundException(`Control with ID ${controlId} not found`);
    }

    // Verify requirement exists
    const requirement = await this.requirementRepository.findOne({
      where: { id: requirementId },
      relations: ['framework'],
    });
    if (!requirement) {
      throw new NotFoundException(`Framework requirement with ID ${requirementId} not found`);
    }

    // Check if mapping already exists
    const existing = await this.mappingRepository.findOne({
      where: {
        unified_control_id: controlId,
        framework_requirement_id: requirementId,
      },
    });

    if (existing) {
      // Update existing mapping
      existing.coverage_level = coverageLevel;
      existing.mapping_notes = mappingNotes || null;
      if (userId) {
        existing.mapped_by = userId;
      }
      return this.mappingRepository.save(existing);
    }

    // Create new mapping
    const mapping = this.mappingRepository.create({
      unified_control_id: controlId,
      framework_requirement_id: requirementId,
      coverage_level: coverageLevel,
      mapping_notes: mappingNotes || null,
      mapped_by: userId || null,
    });

    return this.mappingRepository.save(mapping);
  }

  /**
   * Get all framework mappings for a control
   */
  async getMappingsForControl(controlId: string): Promise<FrameworkControlMapping[]> {
    return this.mappingRepository.find({
      where: { unified_control_id: controlId },
      relations: ['framework_requirement', 'framework_requirement.framework', 'mapper'],
      order: { mapped_at: 'DESC' },
    });
  }

  /**
   * Get all control mappings for a framework requirement
   */
  async getMappingsForRequirement(requirementId: string): Promise<FrameworkControlMapping[]> {
    return this.mappingRepository.find({
      where: { framework_requirement_id: requirementId },
      relations: ['unified_control', 'mapper'],
      order: { mapped_at: 'DESC' },
    });
  }

  /**
   * Bulk create mappings
   */
  async bulkCreateMappings(
    controlId: string,
    requirementIds: string[],
    coverageLevel: MappingCoverage,
    mappingNotes?: string,
    userId?: string,
  ): Promise<{ created: FrameworkControlMapping[]; alreadyLinked: string[] }> {
    // Verify control exists
    const control = await this.controlRepository.findOne({ where: { id: controlId } });
    if (!control) {
      throw new NotFoundException(`Control with ID ${controlId} not found`);
    }

    // Verify requirements exist
    const requirements = await this.requirementRepository.find({
      where: { id: In(requirementIds) },
    });

    const validRequirementIds = new Set(requirements.map((r) => r.id));
    const invalidIds = requirementIds.filter((id) => !validRequirementIds.has(id));

    if (invalidIds.length > 0) {
      this.logger.warn(`Invalid requirement IDs: ${invalidIds.join(', ')}`);
    }

    // Check existing mappings
    const existingMappings = await this.mappingRepository.find({
      where: {
        unified_control_id: controlId,
        framework_requirement_id: In(Array.from(validRequirementIds)),
      },
    });

    const existingRequirementIds = new Set(existingMappings.map((m) => m.framework_requirement_id));
    const newRequirementIds = Array.from(validRequirementIds).filter(
      (id) => !existingRequirementIds.has(id),
    );

    // Create new mappings
    const mappings = newRequirementIds.map((requirementId) =>
      this.mappingRepository.create({
        unified_control_id: controlId,
        framework_requirement_id: requirementId,
        coverage_level: coverageLevel,
        mapping_notes: mappingNotes || null,
        mapped_by: userId || null,
      }),
    );

    const created = mappings.length > 0 ? await this.mappingRepository.save(mappings) : [];

    return {
      created,
      alreadyLinked: Array.from(existingRequirementIds),
    };
  }

  /**
   * Update a mapping
   */
  async updateMapping(
    mappingId: string,
    coverageLevel?: MappingCoverage,
    mappingNotes?: string,
  ): Promise<FrameworkControlMapping> {
    const mapping = await this.mappingRepository.findOne({ where: { id: mappingId } });
    if (!mapping) {
      throw new NotFoundException(`Mapping with ID ${mappingId} not found`);
    }

    if (coverageLevel !== undefined) {
      mapping.coverage_level = coverageLevel;
    }
    if (mappingNotes !== undefined) {
      mapping.mapping_notes = mappingNotes;
    }

    return this.mappingRepository.save(mapping);
  }

  /**
   * Delete a mapping
   */
  async deleteMapping(mappingId: string): Promise<void> {
    const mapping = await this.mappingRepository.findOne({ where: { id: mappingId } });
    if (!mapping) {
      throw new NotFoundException(`Mapping with ID ${mappingId} not found`);
    }

    await this.mappingRepository.remove(mapping);
  }

  /**
   * Delete all mappings for a control
   */
  async deleteMappingsForControl(controlId: string): Promise<void> {
    await this.mappingRepository.delete({ unified_control_id: controlId });
  }

  /**
   * Get coverage matrix data for a specific framework
   */
  async getCoverageMatrix(frameworkId: string) {
    const mappings = await this.mappingRepository.find({
      where: {
        framework_requirement: {
          framework_id: frameworkId,
        },
      },
      relations: ['framework_requirement', 'unified_control'],
    });

    return mappings.map((m) => ({
      requirementId: m.framework_requirement_id,
      requirementIdentifier: m.framework_requirement.requirement_identifier,
      requirementTitle: m.framework_requirement.title,
      controlId: m.unified_control_id,
      controlIdentifier: m.unified_control.control_identifier,
      controlTitle: m.unified_control.title,
      coverageLevel: m.coverage_level,
    }));
  }
}


