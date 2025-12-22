/**
 * Risks API E2E Test
 * End-to-end test for Risks API endpoints
 */

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { RiskService } from '../../src/risk/services/risk.service';
import { RiskStatus, RiskLikelihood, RiskImpact } from '../../src/risk/entities/risk.entity';

describe('RiskController (e2e)', () => {
  let app: INestApplication;
  let riskService: RiskService;
  let authToken: string;
  let testRiskId: string;
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

    // TODO: Get authentication token for testing
    // authToken = await getAuthToken();
    // testUserId = authToken.userId;

    // Create a test risk for use in tests
    // const testRisk = await riskService.create({
    //   title: 'E2E Test Risk',
    //   description: 'Risk for E2E testing',
    //   category: 'operational',
    //   likelihood: RiskLikelihood.MEDIUM,
    //   impact: RiskImpact.MEDIUM,
    // }, testUserId);
    // testRiskId = testRisk.id;
  });

  afterAll(async () => {
    // Clean up test data
    if (testRiskId) {
      try {
        await riskService.remove(testRiskId);
      } catch (e) {
        // Ignore cleanup errors
      }
    }
    await app.close();
  });

  describe('/risks (GET)', () => {
    it('should return a paginated list of risks', () => {
      return request(app.getHttpServer())
        .get('/risks')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('data');
          expect(res.body).toHaveProperty('total');
          expect(res.body).toHaveProperty('page');
          expect(res.body).toHaveProperty('limit');
          expect(Array.isArray(res.body.data)).toBe(true);
        });
    });

    it('should support pagination', () => {
      return request(app.getHttpServer())
        .get('/risks?page=1&limit=10')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.page).toBe(1);
          expect(res.body.limit).toBe(10);
        });
    });

    it('should support search filtering', () => {
      return request(app.getHttpServer())
        .get('/risks?search=test')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('data');
          expect(Array.isArray(res.body.data)).toBe(true);
        });
    });

    it('should support filtering by status', () => {
      return request(app.getHttpServer())
        .get('/risks?status=identified')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('data');
          if (res.body.data.length > 0) {
            res.body.data.forEach((risk: any) => {
              expect(risk.status).toBe(RiskStatus.IDENTIFIED);
            });
          }
        });
    });

    it('should support filtering by category', () => {
      return request(app.getHttpServer())
        .get('/risks?category=operational')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('data');
        });
    });

    it('should support filtering by likelihood and impact', () => {
      return request(app.getHttpServer())
        .get('/risks?likelihood=3&impact=4')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('data');
        });
    });
  });

  describe('/risks/:id (GET)', () => {
    it('should return a single risk by ID', async () => {
      if (!testRiskId) {
        // Skip if no test risk available
        return;
      }

      return request(app.getHttpServer())
        .get(`/risks/${testRiskId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.id).toBe(testRiskId);
        });
    });

    it('should return 404 for non-existent risk', () => {
      return request(app.getHttpServer())
        .get('/risks/non-existent-id')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });
  });

  describe('/risks (POST)', () => {
    it('should create a new risk', async () => {
      const createRiskDto = {
        title: 'E2E Test Risk Create',
        description: 'Risk created during E2E testing',
        category: 'operational',
        likelihood: RiskLikelihood.MEDIUM,
        impact: RiskImpact.HIGH,
        status: RiskStatus.IDENTIFIED,
      };

      return request(app.getHttpServer())
        .post('/risks')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createRiskDto)
        .expect(201)
        .expect((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.title).toBe(createRiskDto.title);
          expect(res.body.category).toBe(createRiskDto.category);
          expect(res.body.likelihood).toBe(createRiskDto.likelihood);
          expect(res.body.impact).toBe(createRiskDto.impact);
          testRiskId = res.body.id;
        });
    });

    it('should reject invalid risk data', () => {
      const invalidDto = {
        // Missing required fields
        description: 'Risk without title',
      };

      return request(app.getHttpServer())
        .post('/risks')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidDto)
        .expect(400);
    });

    it('should use default status when not provided', async () => {
      const createDto = {
        title: 'Risk with Default Status',
        description: 'Should default to identified',
        category: 'operational',
        likelihood: RiskLikelihood.LOW,
        impact: RiskImpact.LOW,
      };

      return request(app.getHttpServer())
        .post('/risks')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createDto)
        .expect(201)
        .expect((res) => {
          expect(res.body.status).toBe(RiskStatus.IDENTIFIED);
        });
    });
  });

  describe('/risks/:id (PUT)', () => {
    it('should update an existing risk', async () => {
      if (!testRiskId) {
        return;
      }

      const updateDto = {
        title: 'Updated Risk Title E2E',
        status: RiskStatus.ASSESSED,
        description: 'Updated description',
      };

      return request(app.getHttpServer())
        .put(`/risks/${testRiskId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateDto)
        .expect(200)
        .expect((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.title).toBe(updateDto.title);
          expect(res.body.status).toBe(updateDto.status);
        });
    });

    it('should return 404 for non-existent risk', () => {
      const updateDto = {
        title: 'Updated Title',
      };

      return request(app.getHttpServer())
        .put('/risks/non-existent-id')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateDto)
        .expect(404);
    });
  });

  describe('/risks/:id (DELETE)', () => {
    it('should soft delete a risk', async () => {
      if (!testRiskId) {
        return;
      }

      // Create a risk for deletion test
      const createDto = {
        title: 'Risk to Delete E2E',
        description: 'This risk will be deleted',
        category: 'operational',
        likelihood: RiskLikelihood.LOW,
        impact: RiskImpact.LOW,
      };

      const createResponse = await request(app.getHttpServer())
        .post('/risks')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createDto)
        .expect(201);

      const deleteRiskId = createResponse.body.id;

      // Delete the risk
      await request(app.getHttpServer())
        .delete(`/risks/${deleteRiskId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // Verify it's soft deleted (should not appear in list)
      const listResponse = await request(app.getHttpServer())
        .get('/risks')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      const deletedRisk = listResponse.body.data.find((r: any) => r.id === deleteRiskId);
      expect(deletedRisk).toBeUndefined();
    });

    it('should return 404 for non-existent risk', () => {
      return request(app.getHttpServer())
        .delete('/risks/non-existent-id')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });
  });

  describe('/risks/heatmap (GET)', () => {
    it('should return heatmap data', () => {
      return request(app.getHttpServer())
        .get('/risks/heatmap')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('cells');
          expect(res.body).toHaveProperty('totalRisks');
          expect(res.body).toHaveProperty('maxRiskScore');
          expect(Array.isArray(res.body.cells)).toBe(true);
        });
    });
  });

  describe('/risks/dashboard/summary (GET)', () => {
    it('should return dashboard summary', () => {
      return request(app.getHttpServer())
        .get('/risks/dashboard/summary')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('totalRisks');
          expect(res.body).toHaveProperty('byLevel');
          expect(res.body).toHaveProperty('byStatus');
          expect(res.body.byLevel).toHaveProperty('critical');
          expect(res.body.byLevel).toHaveProperty('high');
          expect(res.body.byLevel).toHaveProperty('medium');
          expect(res.body.byLevel).toHaveProperty('low');
        });
    });
  });

  describe('/risks/dashboard/top (GET)', () => {
    it('should return top risks by score', () => {
      return request(app.getHttpServer())
        .get('/risks/dashboard/top?limit=5')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          // Verify risks are sorted by score (descending)
          for (let i = 0; i < res.body.length - 1; i++) {
            const current = res.body[i].current_risk_score || 0;
            const next = res.body[i + 1].current_risk_score || 0;
            expect(current).toBeGreaterThanOrEqual(next);
          }
        });
    });

    it('should use default limit when not provided', () => {
      return request(app.getHttpServer())
        .get('/risks/dashboard/top')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeLessThanOrEqual(10); // Default limit
        });
    });
  });

  describe('/risks/dashboard/review-due (GET)', () => {
    it('should return risks due for review', () => {
      return request(app.getHttpServer())
        .get('/risks/dashboard/review-due?days=30')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });

    it('should use default days when not provided', () => {
      return request(app.getHttpServer())
        .get('/risks/dashboard/review-due')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });
  });

  describe('/risks/exceeding-appetite (GET)', () => {
    it('should return risks exceeding appetite threshold', () => {
      return request(app.getHttpServer())
        .get('/risks/exceeding-appetite')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          // All returned risks should exceed appetite
          res.body.forEach((risk: any) => {
            expect(risk.exceeds_risk_appetite).toBe(true);
          });
        });
    });
  });

  describe('/risks/check-appetite/:score (GET)', () => {
    it('should check if a score exceeds appetite', () => {
      return request(app.getHttpServer())
        .get('/risks/check-appetite/15')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('exceeds_appetite');
          expect(res.body).toHaveProperty('score');
          expect(res.body.score).toBe(15);
          expect(typeof res.body.exceeds_appetite).toBe('boolean');
        });
    });

    it('should handle low scores', () => {
      return request(app.getHttpServer())
        .get('/risks/check-appetite/3')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.exceeds_appetite).toBe(false);
        });
    });
  });

  describe('/risks/bulk-update (PATCH)', () => {
    it('should bulk update risk statuses', async () => {
      if (!testRiskId) {
        return;
      }

      const bulkUpdateDto = {
        ids: [testRiskId],
        status: RiskStatus.MITIGATED,
      };

      return request(app.getHttpServer())
        .patch('/risks/bulk-update')
        .set('Authorization', `Bearer ${authToken}`)
        .send(bulkUpdateDto)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('updated');
          expect(res.body).toHaveProperty('risks');
          expect(res.body.updated).toBeGreaterThanOrEqual(0);
          expect(Array.isArray(res.body.risks)).toBe(true);
        });
    });

    it('should return 404 if no risks found', () => {
      const bulkUpdateDto = {
        ids: ['non-existent-id-1', 'non-existent-id-2'],
        status: RiskStatus.ASSESSED,
      };

      return request(app.getHttpServer())
        .patch('/risks/bulk-update')
        .set('Authorization', `Bearer ${authToken}`)
        .send(bulkUpdateDto)
        .expect(404);
    });
  });
});



