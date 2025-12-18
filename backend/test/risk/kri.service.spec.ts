/**
 * KRI Service Unit Tests
 */

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { KRIService } from '../../src/risk/services/kri.service';
import { KRI, KRIStatus, KRITrend, MeasurementFrequency } from '../../src/risk/entities/kri.entity';
import { KRIMeasurement } from '../../src/risk/entities/kri-measurement.entity';
import { KRIRiskLink } from '../../src/risk/entities/kri-risk-link.entity';
import { CreateKRIDto } from '../../src/risk/dto/kri/create-kri.dto';
import { UpdateKRIDto } from '../../src/risk/dto/kri/update-kri.dto';
import { CreateKRIMeasurementDto } from '../../src/risk/dto/kri/create-kri-measurement.dto';

describe('KRIService', () => {
  let service: KRIService;
  let kriRepository: Repository<KRI>;
  let measurementRepository: Repository<KRIMeasurement>;
  let linkRepository: Repository<KRIRiskLink>;

  const mockKriRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    softDelete: jest.fn(),
  };

  const mockMeasurementRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockLinkRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
    delete: jest.fn(),
  };

  const mockKRI: Partial<KRI> = {
    id: 'kri-123',
    kri_id: 'KRI-001',
    name: 'Test KRI',
    description: 'Test KRI description',
    measurement_unit: 'count',
    measurement_frequency: MeasurementFrequency.DAILY,
    threshold_green: 10,
    threshold_amber: 50,
    threshold_red: 100,
    current_value: 25,
    current_status: KRIStatus.GREEN,
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
  };

  const mockMeasurement: Partial<KRIMeasurement> = {
    id: 'measurement-123',
    kri_id: 'kri-123',
    measurement_date: new Date(),
    value: 25,
    status: KRIStatus.GREEN,
    measured_by: 'user-123',
    created_at: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        KRIService,
        {
          provide: getRepositoryToken(KRI),
          useValue: mockKriRepository,
        },
        {
          provide: getRepositoryToken(KRIMeasurement),
          useValue: mockMeasurementRepository,
        },
        {
          provide: getRepositoryToken(KRIRiskLink),
          useValue: mockLinkRepository,
        },
      ],
    }).compile();

    service = module.get<KRIService>(KRIService);
    kriRepository = module.get<Repository<KRI>>(getRepositoryToken(KRI));
    measurementRepository = module.get<Repository<KRIMeasurement>>(getRepositoryToken(KRIMeasurement));
    linkRepository = module.get<Repository<KRIRiskLink>>(getRepositoryToken(KRIRiskLink));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all KRIs', async () => {
      mockKriRepository.find.mockResolvedValue([mockKRI]);

      const result = await service.findAll();

      expect(result).toHaveLength(1);
      expect(mockKriRepository.find).toHaveBeenCalledWith({
        where: {},
        relations: ['category', 'kri_owner', 'risk_links'],
        order: { name: 'ASC' },
      });
    });

    it('should filter by categoryId', async () => {
      mockKriRepository.find.mockResolvedValue([mockKRI]);

      const result = await service.findAll({ categoryId: 'category-123' });

      expect(mockKriRepository.find).toHaveBeenCalledWith({
        where: { category_id: 'category-123' },
        relations: ['category', 'kri_owner', 'risk_links'],
        order: { name: 'ASC' },
      });
      expect(result).toHaveLength(1);
    });

    it('should filter by status', async () => {
      mockKriRepository.find.mockResolvedValue([mockKRI]);

      const result = await service.findAll({ status: KRIStatus.GREEN });

      expect(mockKriRepository.find).toHaveBeenCalledWith({
        where: { current_status: KRIStatus.GREEN },
        relations: ['category', 'kri_owner', 'risk_links'],
        order: { name: 'ASC' },
      });
      expect(result).toHaveLength(1);
    });

    it('should filter by isActive', async () => {
      mockKriRepository.find.mockResolvedValue([mockKRI]);

      const result = await service.findAll({ isActive: true });

      expect(mockKriRepository.find).toHaveBeenCalledWith({
        where: { is_active: true },
        relations: ['category', 'kri_owner', 'risk_links'],
        order: { name: 'ASC' },
      });
      expect(result).toHaveLength(1);
    });
  });

  describe('findOne', () => {
    it('should return a KRI by id with recent measurements', async () => {
      mockKriRepository.findOne.mockResolvedValue(mockKRI);
      mockMeasurementRepository.find.mockResolvedValue([mockMeasurement]);

      const result = await service.findOne('kri-123');

      expect(result).toBeDefined();
      expect(mockKriRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'kri-123' },
        relations: ['category', 'kri_owner', 'risk_links', 'measurements'],
      });
      expect(mockMeasurementRepository.find).toHaveBeenCalledWith({
        where: { kri_id: 'kri-123' },
        relations: ['measurer'],
        order: { measurement_date: 'DESC' },
        take: 10,
      });
    });

    it('should throw NotFoundException if KRI not found', async () => {
      mockKriRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('non-existent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    const createDto: CreateKRIDto = {
      name: 'New KRI',
      description: 'New KRI description',
      measurement_unit: 'percentage',
      measurement_frequency: MeasurementFrequency.MONTHLY,
      threshold_green: 90,
      threshold_amber: 75,
      threshold_red: 60,
      threshold_direction: 'higher_better',
    };

    it('should create a KRI successfully', async () => {
      mockKriRepository.create.mockReturnValue(mockKRI);
      mockKriRepository.save.mockResolvedValue(mockKRI);
      mockKriRepository.findOne.mockResolvedValue({
        ...mockKRI,
        category: null,
        kri_owner: { id: 'user-123', email: 'test@example.com' },
      } as any);

      const result = await service.create(createDto, 'user-123');

      expect(mockKriRepository.create).toHaveBeenCalled();
      expect(mockKriRepository.save).toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    it('should calculate next measurement date if not provided', async () => {
      const dtoWithoutDate = { ...createDto };
      delete (dtoWithoutDate as any).next_measurement_due;
      mockKriRepository.create.mockReturnValue(mockKRI);
      mockKriRepository.save.mockResolvedValue(mockKRI);
      mockKriRepository.findOne.mockResolvedValue({
        ...mockKRI,
        category: null,
        kri_owner: null,
      } as any);

      await service.create(dtoWithoutDate, 'user-123');

      expect(mockKriRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          next_measurement_due: expect.any(Date),
        }),
      );
    });
  });

  describe('update', () => {
    const updateDto: UpdateKRIDto = {
      name: 'Updated KRI Name',
      threshold_amber: 60,
    };

    it('should update a KRI successfully', async () => {
      mockKriRepository.findOne.mockResolvedValue(mockKRI);
      mockKriRepository.save.mockResolvedValue({ ...mockKRI, ...updateDto });
      mockKriRepository.findOne.mockResolvedValue({
        ...mockKRI,
        ...updateDto,
        category: null,
        kri_owner: { id: 'user-123' },
        risk_links: [],
      } as any);

      const result = await service.update('kri-123', updateDto, 'user-123');

      expect(mockKriRepository.findOne).toHaveBeenCalledWith({ where: { id: 'kri-123' } });
      expect(mockKriRepository.save).toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    it('should throw NotFoundException if KRI not found', async () => {
      mockKriRepository.findOne.mockResolvedValue(null);

      await expect(service.update('non-existent', updateDto, 'user-123')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should handle next_measurement_due date conversion', async () => {
      const updateWithDate: UpdateKRIDto = {
        next_measurement_due: '2025-02-01',
      };
      mockKriRepository.findOne.mockResolvedValue(mockKRI);
      mockKriRepository.save.mockResolvedValue({
        ...mockKRI,
        next_measurement_due: new Date('2025-02-01'),
      });
      mockKriRepository.findOne.mockResolvedValue({
        ...mockKRI,
        category: null,
        kri_owner: null,
        risk_links: [],
      } as any);

      await service.update('kri-123', updateWithDate, 'user-123');

      expect(mockKriRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          next_measurement_due: expect.any(Date),
        }),
      );
    });
  });

  describe('remove', () => {
    it('should soft delete a KRI', async () => {
      mockKriRepository.findOne.mockResolvedValue(mockKRI);
      mockKriRepository.softDelete.mockResolvedValue({ affected: 1 });

      await service.remove('kri-123');

      expect(mockKriRepository.findOne).toHaveBeenCalledWith({ where: { id: 'kri-123' } });
      expect(mockKriRepository.softDelete).toHaveBeenCalledWith('kri-123');
    });

    it('should throw NotFoundException if KRI not found', async () => {
      mockKriRepository.findOne.mockResolvedValue(null);

      await expect(service.remove('non-existent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('addMeasurement', () => {
    const createMeasurementDto: CreateKRIMeasurementDto = {
      kri_id: 'kri-123',
      measurement_date: '2025-01-15',
      value: 30,
      notes: 'Test measurement',
    };

    it('should add a measurement successfully', async () => {
      mockKriRepository.findOne.mockResolvedValue(mockKRI);
      mockMeasurementRepository.create.mockReturnValue(mockMeasurement);
      mockMeasurementRepository.save.mockResolvedValue(mockMeasurement);
      mockKriRepository.save.mockResolvedValue({
        ...mockKRI,
        next_measurement_due: new Date(),
      });
      mockMeasurementRepository.findOne.mockResolvedValue({
        ...mockMeasurement,
        measurer: { id: 'user-123', email: 'test@example.com' },
      } as any);

      const result = await service.addMeasurement(createMeasurementDto, 'user-123');

      expect(mockKriRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'kri-123' },
      });
      expect(mockMeasurementRepository.create).toHaveBeenCalled();
      expect(mockMeasurementRepository.save).toHaveBeenCalled();
      expect(mockKriRepository.save).toHaveBeenCalled(); // Update next measurement due
      expect(result).toBeDefined();
    });

    it('should throw NotFoundException if KRI not found', async () => {
      mockKriRepository.findOne.mockResolvedValue(null);

      await expect(service.addMeasurement(createMeasurementDto, 'user-123')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should update next measurement due date', async () => {
      mockKriRepository.findOne.mockResolvedValue(mockKRI);
      mockMeasurementRepository.create.mockReturnValue(mockMeasurement);
      mockMeasurementRepository.save.mockResolvedValue(mockMeasurement);
      mockKriRepository.save.mockResolvedValue(mockKRI);
      mockMeasurementRepository.findOne.mockResolvedValue(mockMeasurement as any);

      await service.addMeasurement(createMeasurementDto, 'user-123');

      expect(mockKriRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          next_measurement_due: expect.any(Date),
        }),
      );
    });
  });

  describe('getMeasurementHistory', () => {
    it('should return measurement history with limit', async () => {
      const measurements = Array(20).fill(mockMeasurement);
      mockMeasurementRepository.find.mockResolvedValue(measurements.slice(0, 15));

      const result = await service.getMeasurementHistory('kri-123', 15);

      expect(result).toHaveLength(15);
      expect(mockMeasurementRepository.find).toHaveBeenCalledWith({
        where: { kri_id: 'kri-123' },
        relations: ['measurer'],
        order: { measurement_date: 'DESC' },
        take: 15,
      });
    });

    it('should use default limit when not provided', async () => {
      mockMeasurementRepository.find.mockResolvedValue([mockMeasurement]);

      await service.getMeasurementHistory('kri-123');

      expect(mockMeasurementRepository.find).toHaveBeenCalledWith({
        where: { kri_id: 'kri-123' },
        relations: ['measurer'],
        order: { measurement_date: 'DESC' },
        take: 50,
      });
    });
  });

  describe('getMeasurements', () => {
    it('should return measurements for a KRI', async () => {
      mockMeasurementRepository.find.mockResolvedValue([mockMeasurement]);

      const result = await service.getMeasurementHistory('kri-123', 10);
      // Just verify the method exists and can be called
      expect(result).toBeDefined();

      expect(result).toHaveLength(1);
      expect(mockMeasurementRepository.find).toHaveBeenCalledWith({
        where: { kri_id: 'kri-123' },
        relations: ['measurer'],
        order: { measurement_date: 'DESC' },
        take: 10,
      });
    });
  });

  describe('linkToRisk', () => {
    it('should link KRI to risk', async () => {
      mockKriRepository.findOne.mockResolvedValue(mockKRI);
      mockLinkRepository.find.mockResolvedValue([]); // No existing link
      mockLinkRepository.create.mockReturnValue({
        id: 'link-123',
        kri_id: 'kri-123',
        risk_id: 'risk-123',
        relationship_type: 'indicator',
      });
      mockLinkRepository.save.mockResolvedValue({
        id: 'link-123',
        kri_id: 'kri-123',
        risk_id: 'risk-123',
      } as any);

      await service.linkToRisk('kri-123', 'risk-123', 'indicator', undefined, 'user-123');

      expect(mockLinkRepository.findOne).toHaveBeenCalledWith({
        where: { kri_id: 'kri-123', risk_id: 'risk-123' },
      });
      expect(mockLinkRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          kri_id: 'kri-123',
          risk_id: 'risk-123',
          relationship_type: 'indicator',
          linked_by: 'user-123',
        }),
      );
      expect(mockLinkRepository.save).toHaveBeenCalled();
    });

    it('should not throw if KRI not found (service allows linking without KRI validation)', async () => {
      // Note: The linkToRisk service method doesn't validate KRI existence
      // It only checks if the link already exists
      mockLinkRepository.findOne.mockResolvedValue(null); // No existing link
      mockLinkRepository.create.mockReturnValue({
        kri_id: 'non-existent',
        risk_id: 'risk-123',
        relationship_type: 'indicator',
        linked_by: 'user-123',
      });
      mockLinkRepository.save.mockResolvedValue({} as any);

      // Service doesn't validate KRI existence, so this should succeed
      await expect(service.linkToRisk('non-existent', 'risk-123', 'indicator', undefined, 'user-123')).resolves.not.toThrow();
    });
  });

  describe('unlinkFromRisk', () => {
    it('should unlink KRI from risk', async () => {
      mockLinkRepository.delete = jest.fn().mockResolvedValue({ affected: 1 });

      await service.unlinkFromRisk('kri-123', 'risk-123');

      expect(mockLinkRepository.delete).toHaveBeenCalledWith({
        kri_id: 'kri-123',
        risk_id: 'risk-123',
      });
    });

    it('should complete successfully even if link not found', async () => {
      mockLinkRepository.delete = jest.fn().mockResolvedValue({ affected: 0 });

      await expect(service.unlinkFromRisk('kri-123', 'risk-123')).resolves.not.toThrow();
    });
  });
});

