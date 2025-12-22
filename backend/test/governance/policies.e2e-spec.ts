/**
 * Policies E2E Test
 * End-to-end test for Policies API endpoints
 */

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { PoliciesService } from '../../src/governance/policies/policies.service';
import { Policy, PolicyStatus } from '../../src/governance/policies/entities/policy.entity';

describe('PoliciesController (e2e)', () => {
  let app: INestApplication;
  let policiesService: PoliciesService;
  let authToken: string;

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

    policiesService = moduleFixture.get<PoliciesService>(PoliciesService);

    // TODO: Get authentication token for testing
    // authToken = await getAuthToken();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/api/v1/governance/policies (GET)', () => {
    it('should return a list of policies', () => {
      return request(app.getHttpServer())
        .get('/api/v1/governance/policies')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('data');
          expect(Array.isArray(res.body.data)).toBe(true);
        });
    });

    it('should support pagination', () => {
      return request(app.getHttpServer())
        .get('/api/v1/governance/policies?page=1&limit=10')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('data');
          expect(res.body).toHaveProperty('meta');
          expect(res.body.meta).toHaveProperty('page', 1);
          expect(res.body.meta).toHaveProperty('limit', 10);
        });
    });

    it('should support filtering by status', () => {
      return request(app.getHttpServer())
        .get('/api/v1/governance/policies?status=draft')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('data');
          if (res.body.data.length > 0) {
            res.body.data.forEach((policy: Policy) => {
              expect(policy.status).toBe(PolicyStatus.DRAFT);
            });
          }
        });
    });
  });

  describe('/api/v1/governance/policies (POST)', () => {
    it('should create a new policy', () => {
      const createPolicyDto = {
        policy_type: 'Information Security',
        title: 'Test Policy E2E',
        effective_date: '2024-12-31',
        content: 'Test policy content',
      };

      return request(app.getHttpServer())
        .post('/api/v1/governance/policies')
        .send(createPolicyDto)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('data');
          expect(res.body.data.title).toBe(createPolicyDto.title);
          expect(res.body.data.policy_type).toBe(createPolicyDto.policy_type);
        });
    });

    it('should reject invalid policy data', () => {
      const invalidDto = {
        // Missing required fields
        title: 'Invalid Policy',
      };

      return request(app.getHttpServer())
        .post('/api/v1/governance/policies')
        .send(invalidDto)
        .expect(400);
    });

    it('should require effective_date', () => {
      const invalidDto = {
        policy_type: 'Information Security',
        title: 'Policy Without Date',
        // Missing effective_date
      };

      return request(app.getHttpServer())
        .post('/api/v1/governance/policies')
        .send(invalidDto)
        .expect(400);
    });
  });

  describe('/api/v1/governance/policies/:id (GET)', () => {
    it('should return a single policy by ID', async () => {
      // First create a policy
      const createDto = {
        policy_type: 'Information Security',
        title: 'Get Test Policy',
        effective_date: '2024-12-31',
      };

      const createResponse = await request(app.getHttpServer())
        .post('/api/v1/governance/policies')
        .send(createDto)
        .expect(201);

      const policyId = createResponse.body.data.id;

      // Then retrieve it
      return request(app.getHttpServer())
        .get(`/api/v1/governance/policies/${policyId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('data');
          expect(res.body.data.id).toBe(policyId);
          expect(res.body.data.title).toBe(createDto.title);
        });
    });

    it('should return 404 for non-existent policy', () => {
      return request(app.getHttpServer())
        .get('/api/v1/governance/policies/non-existent-id')
        .expect(404);
    });
  });

  describe('/api/v1/governance/policies/:id (PATCH)', () => {
    it('should update an existing policy', async () => {
      // Create a policy first
      const createDto = {
        policy_type: 'Information Security',
        title: 'Update Test Policy',
        effective_date: '2024-12-31',
      };

      const createResponse = await request(app.getHttpServer())
        .post('/api/v1/governance/policies')
        .send(createDto)
        .expect(201);

      const policyId = createResponse.body.data.id;

      // Update the policy
      const updateDto = {
        title: 'Updated Policy Title',
        status: PolicyStatus.APPROVED,
      };

      return request(app.getHttpServer())
        .patch(`/api/v1/governance/policies/${policyId}`)
        .send(updateDto)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('data');
          expect(res.body.data.title).toBe(updateDto.title);
          expect(res.body.data.status).toBe(updateDto.status);
        });
    });
  });

  describe('/api/v1/governance/policies/:id (DELETE)', () => {
    it('should delete a policy', async () => {
      // Create a policy first
      const createDto = {
        policy_type: 'Information Security',
        title: 'Delete Test Policy',
        effective_date: '2024-12-31',
      };

      const createResponse = await request(app.getHttpServer())
        .post('/api/v1/governance/policies')
        .send(createDto)
        .expect(201);

      const policyId = createResponse.body.data.id;

      // Delete the policy
      await request(app.getHttpServer())
        .delete(`/api/v1/governance/policies/${policyId}`)
        .expect(200);

      // Verify it's deleted
      return request(app.getHttpServer())
        .get(`/api/v1/governance/policies/${policyId}`)
        .expect(404);
    });
  });
});







