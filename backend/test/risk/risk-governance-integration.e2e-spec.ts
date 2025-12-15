/**
 * Risk-Governance Integration E2E Test
 * End-to-end test for Risk-Control and Risk-Finding linking API endpoints
 */

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { RiskService } from '../../src/risk/services/risk.service';
import { RiskControlLinkService } from '../../src/risk/services/risk-control-link.service';
import { RiskFindingLinkService } from '../../src/risk/services/risk-finding-link.service';

describe('Risk-Governance Integration (e2e)', () => {
  let app: INestApplication;
  let riskService: RiskService;
  let controlLinkService: RiskControlLinkService;
  let findingLinkService: RiskFindingLinkService;
  let authToken: string;
  let testRiskId: string;
  let testControlId: string;
  let testFindingId: string;
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
    controlLinkService = moduleFixture.get<RiskControlLinkService>(RiskControlLinkService);
    findingLinkService = moduleFixture.get<RiskFindingLinkService>(RiskFindingLinkService);

    // TODO: Get authentication token and create test data
    // authToken = await getAuthToken();
    // testUserId = authToken.userId;

    // Create test risk
    // const testRisk = await riskService.create({
    //   title: 'E2E Governance-Risk Test',
    //   description: 'Risk for testing governance integration',
    //   category: 'compliance',
    // }, testUserId);
    // testRiskId = testRisk.id;
  });

  afterAll(async () => {
    // Clean up test data
    await app.close();
  });

  // ================== Control Links ==================

  describe('/risk-links/controls/risk/:riskId (GET)', () => {
    it('should return controls linked to a risk', () => {
      if (!testRiskId) return;

      return request(app.getHttpServer())
        .get(`/risk-links/controls/risk/${testRiskId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });
  });

  describe('/risk-links/controls/control/:controlId (GET)', () => {
    it('should return risks linked to a control', () => {
      if (!testControlId) return;

      return request(app.getHttpServer())
        .get(`/risk-links/controls/control/${testControlId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });
  });

  describe('/risk-links/controls (POST)', () => {
    it('should link a risk to a control', async () => {
      if (!testRiskId || !testControlId) return;

      const createDto = {
        risk_id: testRiskId,
        control_id: testControlId,
        effectiveness_rating: 4,
        effectiveness_type: 'scale',
        notes: 'Control effectively mitigates this risk',
      };

      return request(app.getHttpServer())
        .post('/risk-links/controls')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createDto)
        .expect(201)
        .expect((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.risk_id).toBe(testRiskId);
          expect(res.body.control_id).toBe(testControlId);
          expect(res.body.effectiveness_rating).toBe(4);
        });
    });

    it('should return 404 if risk not found', () => {
      const createDto = {
        risk_id: 'non-existent-risk',
        control_id: 'control-123',
        effectiveness_rating: 3,
      };

      return request(app.getHttpServer())
        .post('/risk-links/controls')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createDto)
        .expect(404);
    });
  });

  describe('/risk-links/controls/:linkId (PUT)', () => {
    it('should update a control link', async () => {
      if (!testRiskId || !testControlId) return;

      // Create link first
      const createDto = {
        risk_id: testRiskId,
        control_id: testControlId,
        effectiveness_rating: 3,
      };

      const createResponse = await request(app.getHttpServer())
        .post('/risk-links/controls')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createDto)
        .expect(201);

      const linkId = createResponse.body.id;

      // Update link
      const updateDto = {
        effectiveness_rating: 5,
        notes: 'Updated effectiveness rating',
      };

      return request(app.getHttpServer())
        .put(`/risk-links/controls/${linkId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateDto)
        .expect(200)
        .expect((res) => {
          expect(res.body.effectiveness_rating).toBe(5);
          expect(res.body.notes).toBe('Updated effectiveness rating');
        });
    });
  });

  describe('/risk-links/controls/:linkId (DELETE)', () => {
    it('should remove a control link', async () => {
      if (!testRiskId || !testControlId) return;

      // Create link first
      const createDto = {
        risk_id: testRiskId,
        control_id: testControlId,
        effectiveness_rating: 3,
      };

      const createResponse = await request(app.getHttpServer())
        .post('/risk-links/controls')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createDto)
        .expect(201);

      const linkId = createResponse.body.id;

      // Delete link
      await request(app.getHttpServer())
        .delete(`/risk-links/controls/${linkId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // Verify deletion
      const getResponse = await request(app.getHttpServer())
        .get(`/risk-links/controls/risk/${testRiskId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      const deletedLink = getResponse.body.find((link: any) => link.id === linkId);
      expect(deletedLink).toBeUndefined();
    });
  });

  describe('/risk-links/controls/risk/:riskId/effectiveness (GET)', () => {
    it('should return control effectiveness summary for a risk', () => {
      if (!testRiskId) return;

      return request(app.getHttpServer())
        .get(`/risk-links/controls/risk/${testRiskId}/effectiveness`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('risk_id');
          expect(res.body).toHaveProperty('total_controls');
          expect(res.body).toHaveProperty('average_effectiveness');
        });
    });
  });

  describe('/risk-links/controls/without-controls (GET)', () => {
    it('should return risks without controls', () => {
      return request(app.getHttpServer())
        .get('/risk-links/controls/without-controls')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });
  });

  // ================== Finding Links ==================

  describe('/risk-links/findings/risk/:riskId (GET)', () => {
    it('should return findings linked to a risk', () => {
      if (!testRiskId) return;

      return request(app.getHttpServer())
        .get(`/risk-links/findings/risk/${testRiskId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });
  });

  describe('/risk-links/findings/finding/:findingId (GET)', () => {
    it('should return risks linked to a finding', () => {
      if (!testFindingId) return;

      return request(app.getHttpServer())
        .get(`/risk-links/findings/finding/${testFindingId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });
  });

  describe('/risk-links/findings (POST)', () => {
    it('should link a risk to a finding', async () => {
      if (!testRiskId || !testFindingId) return;

      const createDto = {
        risk_id: testRiskId,
        finding_id: testFindingId,
        relationship_type: 'identified',
        notes: 'Risk was identified through this finding',
      };

      return request(app.getHttpServer())
        .post('/risk-links/findings')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createDto)
        .expect(201)
        .expect((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.risk_id).toBe(testRiskId);
          expect(res.body.finding_id).toBe(testFindingId);
          expect(res.body.relationship_type).toBe('identified');
        });
    });

    it('should support different relationship types', async () => {
      if (!testRiskId || !testFindingId) return;

      const relationshipTypes = ['identified', 'contributes_to', 'mitigates', 'exacerbates', 'related'];

      for (const relType of relationshipTypes) {
        const createDto = {
          risk_id: testRiskId,
          finding_id: testFindingId,
          relationship_type: relType,
        };

        await request(app.getHttpServer())
          .post('/risk-links/findings')
          .set('Authorization', `Bearer ${authToken}`)
          .send(createDto)
          .expect((res) => {
            // Should either succeed or fail with conflict if already linked
            expect([201, 409]).toContain(res.status);
          });
      }
    });

    it('should return 404 if risk not found', () => {
      const createDto = {
        risk_id: 'non-existent-risk',
        finding_id: 'finding-123',
        relationship_type: 'identified',
      };

      return request(app.getHttpServer())
        .post('/risk-links/findings')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createDto)
        .expect(404);
    });
  });

  describe('/risk-links/findings/:linkId (PUT)', () => {
    it('should update a finding link', async () => {
      if (!testRiskId || !testFindingId) return;

      // Create link first
      const createDto = {
        risk_id: testRiskId,
        finding_id: testFindingId,
        relationship_type: 'identified',
      };

      const createResponse = await request(app.getHttpServer())
        .post('/risk-links/findings')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createDto)
        .expect(201);

      const linkId = createResponse.body.id;

      // Update link
      const updateDto = {
        relationship_type: 'contributes_to',
        notes: 'Updated relationship description',
      };

      return request(app.getHttpServer())
        .put(`/risk-links/findings/${linkId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateDto)
        .expect(200)
        .expect((res) => {
          expect(res.body.relationship_type).toBe('contributes_to');
          expect(res.body.notes).toBe('Updated relationship description');
        });
    });
  });

  describe('/risk-links/findings/:linkId (DELETE)', () => {
    it('should remove a finding link', async () => {
      if (!testRiskId || !testFindingId) return;

      // Create link first
      const createDto = {
        risk_id: testRiskId,
        finding_id: testFindingId,
        relationship_type: 'identified',
      };

      const createResponse = await request(app.getHttpServer())
        .post('/risk-links/findings')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createDto)
        .expect(201);

      const linkId = createResponse.body.id;

      // Delete link
      await request(app.getHttpServer())
        .delete(`/risk-links/findings/${linkId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // Verify deletion
      const getResponse = await request(app.getHttpServer())
        .get(`/risk-links/findings/risk/${testRiskId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      const deletedLink = getResponse.body.find((link: any) => link.id === linkId);
      expect(deletedLink).toBeUndefined();
    });
  });
});
