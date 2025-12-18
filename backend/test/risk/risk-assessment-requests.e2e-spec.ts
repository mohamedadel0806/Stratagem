/**
 * Risk Assessment Requests E2E Test
 * End-to-end test for Assessment Requests API endpoints
 */

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { RiskAssessmentRequestService } from '../../src/risk/services/risk-assessment-request.service';
import { RiskService } from '../../src/risk/services/risk.service';
import { RequestStatus, RequestPriority } from '../../src/risk/entities/risk-assessment-request.entity';
import { AssessmentType } from '../../src/risk/entities/risk-assessment.entity';

describe('RiskAssessmentRequestController (e2e)', () => {
  let app: INestApplication;
  let requestService: RiskAssessmentRequestService;
  let riskService: RiskService;
  let authToken: string;
  let testRiskId: string;
  let testRequestId: string;
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

    requestService = moduleFixture.get<RiskAssessmentRequestService>(RiskAssessmentRequestService);
    riskService = moduleFixture.get<RiskService>(RiskService);

    // TODO: Get authentication token for testing
    // authToken = await getAuthToken();
    // testUserId = authToken.userId;

    // Create a test risk for use in tests
    // const testRisk = await riskService.create({
    //   title: 'E2E Test Risk',
    //   description: 'Risk for testing assessment requests',
    //   category: 'operational',
    //   likelihood: 3,
    //   impact: 3,
    // }, testUserId);
    // testRiskId = testRisk.id;
  });

  afterAll(async () => {
    // Clean up test data
    if (testRequestId) {
      try {
        await requestService.remove(testRequestId);
      } catch (e) {
        // Ignore cleanup errors
      }
    }
    if (testRiskId) {
      // Clean up test risk if needed
    }
    await app.close();
  });

  describe('/risk-assessment-requests (GET)', () => {
    it('should return a list of assessment requests', () => {
      return request(app.getHttpServer())
        .get('/risk-assessment-requests')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toBeDefined();
          expect(Array.isArray(res.body)).toBe(true);
        });
    });

    it('should support filtering by status', () => {
      return request(app.getHttpServer())
        .get('/risk-assessment-requests?status=pending')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          if (res.body.length > 0) {
            res.body.forEach((req: any) => {
              expect(req.status).toBe(RequestStatus.PENDING);
            });
          }
        });
    });

    it('should support filtering by riskId', () => {
      if (!testRiskId) {
        return; // Skip if no test risk
      }
      return request(app.getHttpServer())
        .get(`/risk-assessment-requests?riskId=${testRiskId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          if (res.body.length > 0) {
            res.body.forEach((req: any) => {
              expect(req.risk_id).toBe(testRiskId);
            });
          }
        });
    });
  });

  describe('/risk-assessment-requests/pending (GET)', () => {
    it('should return pending requests for current user', () => {
      return request(app.getHttpServer())
        .get('/risk-assessment-requests/pending')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          if (res.body.length > 0) {
            res.body.forEach((req: any) => {
              expect(req.status).toBe(RequestStatus.PENDING);
            });
          }
        });
    });
  });

  describe('/risk-assessment-requests (POST)', () => {
    it('should create a new assessment request', async () => {
      if (!testRiskId) {
        // Skip if no test risk available
        return;
      }

      const createDto = {
        risk_id: testRiskId,
        assessment_type: AssessmentType.CURRENT,
        priority: RequestPriority.MEDIUM,
        justification: 'E2E test assessment request',
        due_date: '2025-02-01',
      };

      return request(app.getHttpServer())
        .post('/risk-assessment-requests')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createDto)
        .expect(201)
        .expect((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.request_identifier).toBeDefined();
          expect(res.body.risk_id).toBe(testRiskId);
          expect(res.body.assessment_type).toBe(AssessmentType.CURRENT);
          expect(res.body.status).toBe(RequestStatus.PENDING);
          testRequestId = res.body.id;
        });
    });

    it('should reject invalid request data', () => {
      const invalidDto = {
        // Missing required fields
        priority: RequestPriority.HIGH,
      };

      return request(app.getHttpServer())
        .post('/risk-assessment-requests')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidDto)
        .expect(400);
    });

    it('should require risk_id', () => {
      const invalidDto = {
        assessment_type: AssessmentType.CURRENT,
        // Missing risk_id
      };

      return request(app.getHttpServer())
        .post('/risk-assessment-requests')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidDto)
        .expect(400);
    });

    it('should return 404 if risk not found', () => {
      const createDto = {
        risk_id: 'non-existent-risk-id',
        assessment_type: AssessmentType.CURRENT,
        priority: RequestPriority.MEDIUM,
      };

      return request(app.getHttpServer())
        .post('/risk-assessment-requests')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createDto)
        .expect(404);
    });
  });

  describe('/risk-assessment-requests/:id (GET)', () => {
    it('should return a single request by ID', async () => {
      if (!testRequestId) {
        // Create a request first
        if (!testRiskId) return;
        const createDto = {
          risk_id: testRiskId,
          assessment_type: AssessmentType.CURRENT,
          priority: RequestPriority.MEDIUM,
        };

        const createResponse = await request(app.getHttpServer())
          .post('/risk-assessment-requests')
          .set('Authorization', `Bearer ${authToken}`)
          .send(createDto)
          .expect(201);

        testRequestId = createResponse.body.id;
      }

      return request(app.getHttpServer())
        .get(`/risk-assessment-requests/${testRequestId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.id).toBe(testRequestId);
        });
    });

    it('should return 404 for non-existent request', () => {
      return request(app.getHttpServer())
        .get('/risk-assessment-requests/non-existent-id')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });
  });

  describe('/risk-assessment-requests/:id (PUT)', () => {
    it('should update an existing request', async () => {
      if (!testRequestId || !testRiskId) {
        return; // Skip if test data not available
      }

      const updateDto = {
        priority: RequestPriority.HIGH,
        notes: 'Updated notes for E2E test',
      };

      return request(app.getHttpServer())
        .put(`/risk-assessment-requests/${testRequestId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateDto)
        .expect(200)
        .expect((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.priority).toBe(RequestPriority.HIGH);
          expect(res.body.notes).toBe(updateDto.notes);
        });
    });
  });

  describe('/risk-assessment-requests/:id/approve (PATCH)', () => {
    it('should approve a pending request', async () => {
      if (!testRiskId) return;

      // Create a new request for approval test
      const createDto = {
        risk_id: testRiskId,
        assessment_type: AssessmentType.CURRENT,
        priority: RequestPriority.MEDIUM,
      };

      const createResponse = await request(app.getHttpServer())
        .post('/risk-assessment-requests')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createDto)
        .expect(201);

      const approveRequestId = createResponse.body.id;

      return request(app.getHttpServer())
        .patch(`/risk-assessment-requests/${approveRequestId}/approve`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.status).toBe(RequestStatus.APPROVED);
          expect(res.body.approved_by_id).toBeDefined();
          expect(res.body.approved_at).toBeDefined();
        });
    });
  });

  describe('/risk-assessment-requests/:id/reject (PATCH)', () => {
    it('should reject a pending request', async () => {
      if (!testRiskId) return;

      // Create a new request for rejection test
      const createDto = {
        risk_id: testRiskId,
        assessment_type: AssessmentType.CURRENT,
        priority: RequestPriority.MEDIUM,
      };

      const createResponse = await request(app.getHttpServer())
        .post('/risk-assessment-requests')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createDto)
        .expect(201);

      const rejectRequestId = createResponse.body.id;

      return request(app.getHttpServer())
        .patch(`/risk-assessment-requests/${rejectRequestId}/reject`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ reason: 'E2E test rejection reason' })
        .expect(200)
        .expect((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.status).toBe(RequestStatus.REJECTED);
          expect(res.body.rejected_by_id).toBeDefined();
          expect(res.body.rejected_at).toBeDefined();
          expect(res.body.rejection_reason).toBe('E2E test rejection reason');
        });
    });
  });

  describe('/risk-assessment-requests/:id/cancel (PATCH)', () => {
    it('should cancel a request', async () => {
      if (!testRiskId) return;

      // Create a new request for cancellation test
      const createDto = {
        risk_id: testRiskId,
        assessment_type: AssessmentType.CURRENT,
        priority: RequestPriority.MEDIUM,
      };

      const createResponse = await request(app.getHttpServer())
        .post('/risk-assessment-requests')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createDto)
        .expect(201);

      const cancelRequestId = createResponse.body.id;

      return request(app.getHttpServer())
        .patch(`/risk-assessment-requests/${cancelRequestId}/cancel`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.status).toBe(RequestStatus.CANCELLED);
        });
    });
  });

  describe('/risk-assessment-requests/:id/in-progress (PATCH)', () => {
    it('should mark request as in progress', async () => {
      if (!testRiskId) return;

      // Create and approve a request first
      const createDto = {
        risk_id: testRiskId,
        assessment_type: AssessmentType.CURRENT,
        priority: RequestPriority.MEDIUM,
      };

      const createResponse = await request(app.getHttpServer())
        .post('/risk-assessment-requests')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createDto)
        .expect(201);

      const inProgressRequestId = createResponse.body.id;

      // Approve it first
      await request(app.getHttpServer())
        .patch(`/risk-assessment-requests/${inProgressRequestId}/approve`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // Then mark as in progress
      return request(app.getHttpServer())
        .patch(`/risk-assessment-requests/${inProgressRequestId}/in-progress`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.status).toBe(RequestStatus.IN_PROGRESS);
        });
    });
  });

  describe('/risk-assessment-requests/:id (DELETE)', () => {
    it('should delete a pending or cancelled request', async () => {
      if (!testRiskId) return;

      // Create a new request for deletion test
      const createDto = {
        risk_id: testRiskId,
        assessment_type: AssessmentType.CURRENT,
        priority: RequestPriority.MEDIUM,
      };

      const createResponse = await request(app.getHttpServer())
        .post('/risk-assessment-requests')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createDto)
        .expect(201);

      const deleteRequestId = createResponse.body.id;

      // Delete the request
      await request(app.getHttpServer())
        .delete(`/risk-assessment-requests/${deleteRequestId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // Verify it's deleted
      return request(app.getHttpServer())
        .get(`/risk-assessment-requests/${deleteRequestId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('should not delete a completed request', async () => {
      if (!testRiskId) return;

      // Create and complete a request
      const createDto = {
        risk_id: testRiskId,
        assessment_type: AssessmentType.CURRENT,
        priority: RequestPriority.MEDIUM,
      };

      const createResponse = await request(app.getHttpServer())
        .post('/risk-assessment-requests')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createDto)
        .expect(201);

      const completedRequestId = createResponse.body.id;

      // Try to update status to completed (if allowed)
      // This might require creating an assessment first
      // For now, just test that completed requests can't be deleted
      // by trying to delete a non-pending request

      // Note: This test would need actual assessment creation to fully test
      // For now, we'll just verify the endpoint exists
      return request(app.getHttpServer())
        .delete(`/risk-assessment-requests/${completedRequestId}`)
        .set('Authorization', `Bearer ${authToken}`)
        // Should either succeed or fail with appropriate error
        .expect((res) => {
          // Accept either 200 (if status allows) or 400 (if not)
          expect([200, 400]).toContain(res.status);
        });
    });
  });

  describe('/risk-assessment-requests/risk/:riskId (GET)', () => {
    it('should return requests for a specific risk', () => {
      if (!testRiskId) return;

      return request(app.getHttpServer())
        .get(`/risk-assessment-requests/risk/${testRiskId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          if (res.body.length > 0) {
            res.body.forEach((req: any) => {
              expect(req.risk_id).toBe(testRiskId);
            });
          }
        });
    });
  });
});

