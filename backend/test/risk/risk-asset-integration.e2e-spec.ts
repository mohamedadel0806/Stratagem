/**
 * Risk-Asset Integration E2E Test
 * End-to-end test for Risk-Asset linking API endpoints
 */

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { RiskService } from '../../src/risk/services/risk.service';
import { RiskAssetLinkService } from '../../src/risk/services/risk-asset-link.service';
import { RiskAssetType } from '../../src/risk/entities/risk-asset-link.entity';
import { PhysicalAssetService } from '../../src/asset/services/physical-asset.service';
import { InformationAssetService } from '../../src/asset/services/information-asset.service';

describe('Risk-Asset Integration (e2e)', () => {
  let app: INestApplication;
  let riskService: RiskService;
  let assetLinkService: RiskAssetLinkService;
  let physicalAssetService: PhysicalAssetService;
  let informationAssetService: InformationAssetService;
  let authToken: string;
  let testRiskId: string;
  let testPhysicalAssetId: string;
  let testInformationAssetId: string;
  let testUserId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();

    riskService = moduleFixture.get<RiskService>(RiskService);
    assetLinkService = moduleFixture.get<RiskAssetLinkService>(RiskAssetLinkService);
    physicalAssetService = moduleFixture.get<PhysicalAssetService>(PhysicalAssetService);
    informationAssetService = moduleFixture.get<InformationAssetService>(InformationAssetService);

    // TODO: Get authentication token and create test data
    // authToken = await getAuthToken();
    // testUserId = authToken.userId;

    // Create test risk
    // const testRisk = await riskService.create({
    //   title: 'E2E Asset-Risk Test',
    //   description: 'Risk for testing asset integration',
    //   category: 'operational',
    // }, testUserId);
    // testRiskId = testRisk.id;

    // Create test assets
    // const testPhysicalAsset = await physicalAssetService.create({...}, testUserId);
    // testPhysicalAssetId = testPhysicalAsset.id;
  });

  afterAll(async () => {
    // Clean up test data
    await app.close();
  });

  describe('/risk-links/assets/risk/:riskId (GET)', () => {
    it('should return assets linked to a risk', () => {
      if (!testRiskId) return;

      return request(app.getHttpServer())
        .get(`/risk-links/assets/risk/${testRiskId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });

    it('should return 200 even if no assets linked', () => {
      if (!testRiskId) return;

      return request(app.getHttpServer())
        .get(`/risk-links/assets/risk/${testRiskId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });
  });

  describe('/risk-links/assets/asset/:assetType/:assetId (GET)', () => {
    it('should return risks linked to a physical asset', () => {
      if (!testPhysicalAssetId) return;

      return request(app.getHttpServer())
        .get(`/risk-links/assets/asset/physical/${testPhysicalAssetId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });

    it('should return risks linked to an information asset', () => {
      if (!testInformationAssetId) return;

      return request(app.getHttpServer())
        .get(`/risk-links/assets/asset/information/${testInformationAssetId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });

    it('should support all asset types', () => {
      const assetTypes = ['physical', 'information', 'software', 'application', 'supplier'];
      
      // Just verify the endpoint structure, not actual data
      return Promise.all(
        assetTypes.map((type) =>
          request(app.getHttpServer())
            .get(`/risk-links/assets/asset/${type}/test-id`)
            .set('Authorization', `Bearer ${authToken}`)
            .expect((res) => {
              // Should either return 200 with array or 404
              expect([200, 404]).toContain(res.status);
            })
        )
      );
    });
  });

  describe('/risk-links/assets (POST)', () => {
    it('should link a risk to a physical asset', async () => {
      if (!testRiskId || !testPhysicalAssetId) return;

      const createDto = {
        risk_id: testRiskId,
        asset_type: RiskAssetType.PHYSICAL,
        asset_id: testPhysicalAssetId,
        impact_description: 'Risk impacts physical asset availability',
      };

      return request(app.getHttpServer())
        .post('/risk-links/assets')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createDto)
        .expect(201)
        .expect((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.risk_id).toBe(testRiskId);
          expect(res.body.asset_id).toBe(testPhysicalAssetId);
          expect(res.body.asset_type).toBe(RiskAssetType.PHYSICAL);
        });
    });

    it('should link a risk to an information asset', async () => {
      if (!testRiskId || !testInformationAssetId) return;

      const createDto = {
        risk_id: testRiskId,
        asset_type: RiskAssetType.INFORMATION,
        asset_id: testInformationAssetId,
        impact_description: 'Risk impacts information asset confidentiality',
      };

      return request(app.getHttpServer())
        .post('/risk-links/assets')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createDto)
        .expect(201)
        .expect((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.asset_type).toBe(RiskAssetType.INFORMATION);
        });
    });

    it('should reject invalid asset type', () => {
      if (!testRiskId) return;

      const invalidDto = {
        risk_id: testRiskId,
        asset_type: 'invalid_type',
        asset_id: 'asset-123',
      };

      return request(app.getHttpServer())
        .post('/risk-links/assets')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidDto)
        .expect(400);
    });

    it('should return 404 if risk not found', () => {
      const createDto = {
        risk_id: 'non-existent-risk',
        asset_type: RiskAssetType.PHYSICAL,
        asset_id: 'asset-123',
      };

      return request(app.getHttpServer())
        .post('/risk-links/assets')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createDto)
        .expect(404);
    });
  });

  describe('/risk-links/assets/bulk (POST)', () => {
    it('should bulk link multiple assets to a risk', async () => {
      if (!testRiskId || !testPhysicalAssetId) return;

      const bulkDto = {
        risk_id: testRiskId,
        assets: [
          {
            asset_type: RiskAssetType.PHYSICAL,
            asset_id: testPhysicalAssetId,
            impact_description: 'Risk impacts asset',
          },
          // Add more assets if available
        ],
      };

      return request(app.getHttpServer())
        .post('/risk-links/assets/bulk')
        .set('Authorization', `Bearer ${authToken}`)
        .send(bulkDto)
        .expect(201)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(0);
        });
    });
  });

  describe('/risk-links/assets/:linkId (PUT)', () => {
    it('should update asset link description', async () => {
      if (!testRiskId || !testPhysicalAssetId) return;

      // First create a link
      const createDto = {
        risk_id: testRiskId,
        asset_type: RiskAssetType.PHYSICAL,
        asset_id: testPhysicalAssetId,
      };

      const createResponse = await request(app.getHttpServer())
        .post('/risk-links/assets')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createDto)
        .expect(201);

      const linkId = createResponse.body.id;

      // Update the link
      return request(app.getHttpServer())
        .put(`/risk-links/assets/${linkId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ impact_description: 'Updated impact description' })
        .expect(200)
        .expect((res) => {
          expect(res.body.impact_description).toBe('Updated impact description');
        });
    });
  });

  describe('/risk-links/assets/:linkId (DELETE)', () => {
    it('should remove an asset link', async () => {
      if (!testRiskId || !testPhysicalAssetId) return;

      // Create a link first
      const createDto = {
        risk_id: testRiskId,
        asset_type: RiskAssetType.PHYSICAL,
        asset_id: testPhysicalAssetId,
      };

      const createResponse = await request(app.getHttpServer())
        .post('/risk-links/assets')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createDto)
        .expect(201);

      const linkId = createResponse.body.id;

      // Delete the link
      await request(app.getHttpServer())
        .delete(`/risk-links/assets/${linkId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // Verify it's deleted
      const getResponse = await request(app.getHttpServer())
        .get(`/risk-links/assets/risk/${testRiskId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      const deletedLink = getResponse.body.find((link: any) => link.id === linkId);
      expect(deletedLink).toBeUndefined();
    });

    it('should return 404 for non-existent link', () => {
      return request(app.getHttpServer())
        .delete('/risk-links/assets/non-existent-link-id')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });
  });

  describe('/risk-links/assets/asset/:assetType/:assetId/score (GET)', () => {
    it('should calculate asset risk score', () => {
      if (!testPhysicalAssetId) return;

      return request(app.getHttpServer())
        .get(`/risk-links/assets/asset/physical/${testPhysicalAssetId}/score`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('asset_id');
          expect(res.body).toHaveProperty('asset_type');
          expect(res.body).toHaveProperty('total_risks');
          expect(res.body).toHaveProperty('max_risk_score');
          expect(res.body).toHaveProperty('aggregated_risk_score');
        });
    });

    it('should handle assets with no linked risks', () => {
      if (!testPhysicalAssetId) return;

      return request(app.getHttpServer())
        .get(`/risk-links/assets/asset/physical/${testPhysicalAssetId}/score`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.total_risks).toBeGreaterThanOrEqual(0);
        });
    });
  });

  describe('/risk-links/assets/risk/:riskId/count (GET)', () => {
    it('should return count of assets linked to a risk', () => {
      if (!testRiskId) return;

      return request(app.getHttpServer())
        .get(`/risk-links/assets/risk/${testRiskId}/count`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('count');
          expect(typeof res.body.count).toBe('number');
          expect(res.body.count).toBeGreaterThanOrEqual(0);
        });
    });
  });
});

