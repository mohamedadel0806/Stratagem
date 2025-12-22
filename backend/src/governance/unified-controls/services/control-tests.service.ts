import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { ControlTest, ControlTestStatus } from '../entities/control-test.entity';
import { CreateControlTestDto } from '../dto/create-control-test.dto';
import { ControlTestQueryDto } from '../dto/control-test-query.dto';
import { ControlAssetMapping } from '../entities/control-asset-mapping.entity';

@Injectable()
export class ControlTestsService {
  private readonly logger = new Logger(ControlTestsService.name);

  constructor(
    @InjectRepository(ControlTest)
    private testRepository: Repository<ControlTest>,
    @InjectRepository(ControlAssetMapping)
    private mappingRepository: Repository<ControlAssetMapping>,
  ) {}

  async create(dto: CreateControlTestDto, userId: string): Promise<ControlTest> {
    const test = this.testRepository.create({
      ...dto,
      created_by: userId,
    });

    const savedTest = await this.testRepository.save(test);

    // If test is completed and linked to a mapping, update the mapping's last test info
    if (savedTest.status === ControlTestStatus.COMPLETED && savedTest.control_asset_mapping_id) {
      await this.updateMappingTestInfo(savedTest);
    }

    return this.findOne(savedTest.id);
  }

  async findAll(query: ControlTestQueryDto) {
    const { page = 1, limit = 20, unified_control_id, tester_id, test_type, status, result, search } = query;
    const skip = (page - 1) * limit;

    const queryBuilder = this.testRepository
      .createQueryBuilder('test')
      .leftJoinAndSelect('test.unified_control', 'control')
      .leftJoinAndSelect('test.tester', 'tester')
      .leftJoinAndSelect('test.creator', 'creator')
      .where('test.deleted_at IS NULL');

    if (unified_control_id) {
      queryBuilder.andWhere('test.unified_control_id = :unified_control_id', { unified_control_id });
    }

    if (tester_id) {
      queryBuilder.andWhere('test.tester_id = :tester_id', { tester_id });
    }

    if (test_type) {
      queryBuilder.andWhere('test.test_type = :test_type', { test_type });
    }

    if (status) {
      queryBuilder.andWhere('test.status = :status', { status });
    }

    if (result) {
      queryBuilder.andWhere('test.result = :result', { result });
    }

    if (search) {
      queryBuilder.andWhere(
        '(control.title ILIKE :search OR test.test_procedure ILIKE :search OR test.observations ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    const [data, total] = await queryBuilder
      .orderBy('test.test_date', 'DESC')
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

  async findOne(id: string): Promise<ControlTest> {
    const test = await this.testRepository.findOne({
      where: { id, deleted_at: IsNull() },
      relations: ['unified_control', 'control_asset_mapping', 'tester', 'creator', 'updater'],
    });

    if (!test) {
      throw new NotFoundException(`Control test with ID ${id} not found`);
    }

    return test;
  }

  async update(id: string, dto: Partial<CreateControlTestDto>, userId: string): Promise<ControlTest> {
    const test = await this.findOne(id);
    const oldStatus = test.status;

    Object.assign(test, {
      ...dto,
      updated_by: userId,
    });

    const updatedTest = await this.testRepository.save(test);

    // If status changed to completed, update linked mapping
    if (updatedTest.status === ControlTestStatus.COMPLETED && 
        oldStatus !== ControlTestStatus.COMPLETED && 
        updatedTest.control_asset_mapping_id) {
      await this.updateMappingTestInfo(updatedTest);
    }

    return updatedTest;
  }

  async remove(id: string): Promise<void> {
    const test = await this.findOne(id);
    await this.testRepository.softDelete(id);
  }

  private async updateMappingTestInfo(test: ControlTest) {
    if (!test.control_asset_mapping_id) return;

    await this.mappingRepository.update(test.control_asset_mapping_id, {
      last_test_date: test.test_date,
      last_test_result: test.result,
      effectiveness_score: test.effectiveness_score,
    });
  }
}


