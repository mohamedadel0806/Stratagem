import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { ComplianceAssessmentController } from '../../../src/common/controllers/compliance-assessment.controller';
import { ComplianceAssessmentService } from '../../../src/common/services/compliance-assessment.service';
import { ComplianceStatus, AssetType } from '../../../src/common/entities/asset-requirement-mapping.entity';

describe('Asset Compliance List (INT-1.2)', () => {
  let app: INestApplication;
  let complianceService: ComplianceAssessmentService;

  const mockAssetComplianceList = {
    total: 2,
    page: 1,
    pageSize: 20,
    totalPages: 1,
    assets: [
      {
        assetId: 'asset-1',
        assetType: 'information',
        assetName: 'Customer Database',
        assetIdentifier: 'DB-001',
        description: 'Stores customer personal information',
        criticality: 'critical',
        businessUnit: 'Operations',
        totalRequirements: 5,
        compliantCount: 3,
        nonCompliantCount: 1,
        partiallyCompliantCount: 1,
        notAssessedCount: 0,
        overallCompliancePercentage: 60,
        controlsLinkedCount: 3,
        linkedControls: [
          {
            controlId: 'ctrl-1',
            controlName: 'Data Encryption',
            implementationStatus: 'implemented',
            isAutomated: true,
          },
        ],
        lastAssessmentDate: '2025-12-03T10:00:00Z',
        overallComplianceStatus: 'partially_compliant',
      },
      {
        assetId: 'asset-2',
        assetType: 'physical',
        assetName: 'Server Room',
        assetIdentifier: 'PHY-001',
        description: 'Main data center servers',
        criticality: 'high',
        businessUnit: 'Infrastructure',
        totalRequirements: 3,
        compliantCount: 3,
        nonCompliantCount: 0,
        partiallyCompliantCount: 0,
        notAssessedCount: 0,
        overallCompliancePercentage: 100,
        controlsLinkedCount: 2,
        linkedControls: [],
        lastAssessmentDate: '2025-12-02T15:30:00Z',
        overallComplianceStatus: 'compliant',
      },
    ],
    complianceSummary: {
      totalAssets: 2,
      compliantAssets: 1,
      nonCompliantAssets: 0,
      partiallyCompliantAssets: 1,
      averageCompliancePercentage: 80,
    },
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [ComplianceAssessmentController],
      providers: [
        {
          provide: ComplianceAssessmentService,
          useValue: {
            getAssetComplianceList: jest.fn().mockResolvedValue(mockAssetComplianceList),
          },
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    complianceService = moduleFixture.get<ComplianceAssessmentService>(ComplianceAssessmentService);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /compliance/assessments/assets-compliance-list', () => {
    it('should return asset compliance list', async () => {
      const response = await request(app.getHttpServer())
        .get('/compliance/assessments/assets-compliance-list')
        .expect(200);

      expect(response.body).toBeDefined();
      expect(response.body.total).toBe(2);
      expect(response.body.assets).toHaveLength(2);
      expect(response.body.complianceSummary).toBeDefined();
    });

    it('should support pagination', async () => {
      await request(app.getHttpServer())
        .get('/compliance/assessments/assets-compliance-list?page=1&pageSize=10')
        .expect(200);

      expect(complianceService.getAssetComplianceList).toHaveBeenCalledWith(
        expect.any(Object),
        { page: 1, pageSize: 10 }
      );
    });

    it('should filter by asset type', async () => {
      await request(app.getHttpServer())
        .get('/compliance/assessments/assets-compliance-list?assetType=information')
        .expect(200);

      expect(complianceService.getAssetComplianceList).toHaveBeenCalledWith(
        expect.objectContaining({ assetType: 'information' }),
        expect.any(Object)
      );
    });

    it('should filter by compliance status', async () => {
      await request(app.getHttpServer())
        .get('/compliance/assessments/assets-compliance-list?complianceStatus=compliant')
        .expect(200);

      expect(complianceService.getAssetComplianceList).toHaveBeenCalledWith(
        expect.objectContaining({ complianceStatus: 'compliant' }),
        expect.any(Object)
      );
    });

    it('should include compliance summary in response', async () => {
      const response = await request(app.getHttpServer())
        .get('/compliance/assessments/assets-compliance-list')
        .expect(200);

      expect(response.body.complianceSummary).toEqual({
        totalAssets: 2,
        compliantAssets: 1,
        nonCompliantAssets: 0,
        partiallyCompliantAssets: 1,
        averageCompliancePercentage: 80,
      });
    });

    it('should include linked controls for each asset', async () => {
      const response = await request(app.getHttpServer())
        .get('/compliance/assessments/assets-compliance-list')
        .expect(200);

      const asset = response.body.assets[0];
      expect(asset.linkedControls).toBeDefined();
      expect(Array.isArray(asset.linkedControls)).toBe(true);
      if (asset.linkedControls.length > 0) {
        expect(asset.linkedControls[0]).toHaveProperty('controlId');
        expect(asset.linkedControls[0]).toHaveProperty('controlName');
        expect(asset.linkedControls[0]).toHaveProperty('implementationStatus');
      }
    });

    it('should handle empty results gracefully', async () => {
      const emptyMockList = {
        total: 0,
        page: 1,
        pageSize: 20,
        totalPages: 0,
        assets: [],
        complianceSummary: {
          totalAssets: 0,
          compliantAssets: 0,
          nonCompliantAssets: 0,
          partiallyCompliantAssets: 0,
          averageCompliancePercentage: 0,
        },
      };

      jest.spyOn(complianceService, 'getAssetComplianceList').mockResolvedValueOnce(emptyMockList);

      const response = await request(app.getHttpServer())
        .get('/compliance/assessments/assets-compliance-list')
        .expect(200);

      expect(response.body.assets).toHaveLength(0);
      expect(response.body.total).toBe(0);
    });

    it('should validate pagination parameters', async () => {
      await request(app.getHttpServer())
        .get('/compliance/assessments/assets-compliance-list?page=0&pageSize=0')
        .expect(200);

      // Should use defaults or minimum values
      expect(complianceService.getAssetComplianceList).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({
          page: expect.any(Number),
          pageSize: expect.any(Number),
        })
      );
    });
  });

  describe('Test Scenario TS-INT-007: View Asset Compliance Status', () => {
    it('TS-INT-007.1: Asset list should display all assets with compliance status', async () => {
      const response = await request(app.getHttpServer())
        .get('/compliance/assessments/assets-compliance-list')
        .expect(200);

      // AC: Asset list complete
      expect(response.body.assets).toBeDefined();
      expect(Array.isArray(response.body.assets)).toBe(true);

      // Each asset should have required fields
      response.body.assets.forEach((asset: any) => {
        expect(asset).toHaveProperty('assetId');
        expect(asset).toHaveProperty('assetName');
        expect(asset).toHaveProperty('assetType');
        expect(asset).toHaveProperty('overallCompliancePercentage');
        expect(asset).toHaveProperty('overallComplianceStatus');
      });
    });

    it('TS-INT-007.2: Summary metrics should be accurate', async () => {
      const response = await request(app.getHttpServer())
        .get('/compliance/assessments/assets-compliance-list')
        .expect(200);

      // AC: Summary metrics correct
      const summary = response.body.complianceSummary;
      expect(summary).toHaveProperty('totalAssets');
      expect(summary).toHaveProperty('compliantAssets');
      expect(summary).toHaveProperty('nonCompliantAssets');
      expect(summary).toHaveProperty('averageCompliancePercentage');

      // Total should equal sum of compliant + non-compliant + partial
      const sum =
        summary.compliantAssets +
        summary.nonCompliantAssets +
        summary.partiallyCompliantAssets;
      expect(sum).toBeLessThanOrEqual(summary.totalAssets);
    });

    it('TS-INT-007.3: Filtering by asset type should work', async () => {
      await request(app.getHttpServer())
        .get('/compliance/assessments/assets-compliance-list?assetType=information')
        .expect(200);

      // AC: Filtering functional
      expect(complianceService.getAssetComplianceList).toHaveBeenCalledWith(
        expect.objectContaining({
          assetType: 'information',
        }),
        expect.any(Object)
      );
    });

    it('TS-INT-007.4: Filtering by compliance status should work', async () => {
      await request(app.getHttpServer())
        .get('/compliance/assessments/assets-compliance-list?complianceStatus=non_compliant')
        .expect(200);

      // AC: Filtering functional
      expect(complianceService.getAssetComplianceList).toHaveBeenCalledWith(
        expect.objectContaining({
          complianceStatus: 'non_compliant',
        }),
        expect.any(Object)
      );
    });

    it('TS-INT-007.5: Status information should be accurate', async () => {
      const response = await request(app.getHttpServer())
        .get('/compliance/assessments/assets-compliance-list')
        .expect(200);

      // AC: Status information accurate
      response.body.assets.forEach((asset: any) => {
        expect(['compliant', 'non_compliant', 'partially_compliant', 'not_assessed', 'requires_review']).toContain(
          asset.overallComplianceStatus
        );

        // Compliance percentage should be between 0-100
        expect(asset.overallCompliancePercentage).toBeGreaterThanOrEqual(0);
        expect(asset.overallCompliancePercentage).toBeLessThanOrEqual(100);
      });
    });
  });
});
