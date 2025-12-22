/**
 * SOPs E2E Test
 * End-to-end test for SOPs API endpoints
 */

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe, ExecutionContext } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { SOPsService } from '../../src/governance/sops/sops.service';
import { SOP, SOPStatus, SOPCategory } from '../../src/governance/sops/entities/sop.entity';
import { JwtAuthGuard } from '../../src/auth/guards/jwt-auth.guard';

describe('SOPsController (e2e)', () => {
  let app: INestApplication;
  let sopsService: SOPsService;
  let authToken: string;
  let createdSOPId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
    .overrideGuard(JwtAuthGuard)
    .useValue({
      canActivate: (context) => {
        // Add mock user to request
        const request = context.switchToHttp().getRequest();
        request.user = { id: '550e8400-e29b-41d4-a716-446655440000', email: 'test@example.com' };
        return true;
      },
    })
    .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    // Set global prefix like the main app
    app.setGlobalPrefix('api/v1');

    await app.init();

    sopsService = moduleFixture.get<SOPsService>(SOPsService);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/api/v1/governance/sops (GET)', () => {
    it('should return a list of SOPs', () => {
      return request(app.getHttpServer())
        .get('/api/v1/governance/sops')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('data');
          expect(Array.isArray(res.body.data)).toBe(true);
          expect(res.body).toHaveProperty('meta');
          expect(res.body.meta).toHaveProperty('total');
          expect(res.body.meta).toHaveProperty('page');
          expect(res.body.meta).toHaveProperty('limit');
        });
    });

    it('should support pagination', () => {
      return request(app.getHttpServer())
        .get('/api/v1/governance/sops?page=1&limit=10')
        .expect(200)
        .expect((res) => {
          expect(res.body.meta.page).toBe(1);
          expect(res.body.meta.limit).toBe(10);
        });
    });

    it('should support filtering by status', () => {
      return request(app.getHttpServer())
        .get('/api/v1/governance/sops?status=DRAFT')
        .expect(200)
        .expect((res) => {
          expect(res.body.data.every((sop: SOP) => sop.status === SOPStatus.DRAFT)).toBe(true);
        });
    });

    it('should support filtering by category', () => {
      return request(app.getHttpServer())
        .get('/api/v1/governance/sops?category=OPERATIONAL')
        .expect(200)
        .expect((res) => {
          expect(res.body.data.every((sop: SOP) => sop.category === SOPCategory.OPERATIONAL)).toBe(true);
        });
    });

    it('should support search functionality', () => {
      return request(app.getHttpServer())
        .get('/api/v1/governance/sops?search=test')
        .expect(200);
    });
  });

  describe('/api/v1/governance/sops (POST)', () => {
    it('should create a new SOP', () => {
      const createSOPDto = {
        sop_identifier: 'SOP-TEST-001',
        title: 'Test SOP',
        category: SOPCategory.OPERATIONAL,
        purpose: 'Testing SOP creation',
        scope: 'Test environment',
        content: 'Test content for SOP',
      };

      return request(app.getHttpServer())
        .post('/api/v1/governance/sops')
        .send(createSOPDto)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.sop_identifier).toBe(createSOPDto.sop_identifier);
          expect(res.body.title).toBe(createSOPDto.title);
          expect(res.body.category).toBe(createSOPDto.category);
          expect(res.body.status).toBe(SOPStatus.DRAFT);
          createdSOPId = res.body.id;
        });
    });

    it('should validate required fields', () => {
      return request(app.getHttpServer())
        .post('/api/v1/governance/sops')
        .send({})
        .expect(400);
    });

    it('should validate SOP identifier format', () => {
      const invalidDto = {
        sop_identifier: '',
        title: 'Test SOP',
      };

      return request(app.getHttpServer())
        .post('/api/v1/governance/sops')
        .send(invalidDto)
        .expect(400);
    });
  });

  describe('/api/v1/governance/sops/:id (GET)', () => {
    it('should return a SOP by ID', () => {
      return request(app.getHttpServer())
        .get(`/api/v1/governance/sops/${createdSOPId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(createdSOPId);
          expect(res.body).toHaveProperty('sop_identifier');
          expect(res.body).toHaveProperty('title');
          expect(res.body).toHaveProperty('status');
        });
    });

    it('should return 404 for non-existent SOP', () => {
      return request(app.getHttpServer())
        .get('/api/v1/governance/sops/non-existent-id')
        .expect(404);
    });
  });

  describe('/api/v1/governance/sops/:id (PATCH)', () => {
    it('should update a SOP', () => {
      const updateDto = {
        title: 'Updated Test SOP',
        purpose: 'Updated purpose for testing',
      };

      return request(app.getHttpServer())
        .patch(`/api/v1/governance/sops/${createdSOPId}`)
        .send(updateDto)
        .expect(200)
        .expect((res) => {
          expect(res.body.title).toBe(updateDto.title);
          expect(res.body.purpose).toBe(updateDto.purpose);
        });
    });

    it('should return 404 for non-existent SOP', () => {
      return request(app.getHttpServer())
        .patch('/api/v1/governance/sops/non-existent-id')
        .send({ title: 'Updated Title' })
        .expect(404);
    });
  });

  describe('/api/v1/governance/sops/:id/publish (POST)', () => {
    it('should publish a SOP', () => {
      return request(app.getHttpServer())
        .post(`/api/v1/governance/sops/${createdSOPId}/publish`)
        .send({})
        .expect(200)
        .expect((res) => {
          expect(res.body.status).toBe(SOPStatus.PUBLISHED);
          expect(res.body).toHaveProperty('published_date');
        });
    });

    it('should publish and assign to users/roles', () => {
      // Create another SOP for testing
      const createDto = {
        sop_identifier: 'SOP-TEST-002',
        title: 'Test SOP for Assignment',
        category: SOPCategory.SECURITY,
      };

      return request(app.getHttpServer())
        .post('/api/v1/governance/sops')
        .send(createDto)
        .expect(201)
        .then((createRes) => {
          const sopId = createRes.body.id;
          return request(app.getHttpServer())
            .post(`/api/v1/governance/sops/${sopId}/publish`)
            .send({
              assign_to_user_ids: ['test-user-id'],
              assign_to_role_ids: ['test-role-id'],
            })
            .expect(200)
            .expect((res) => {
              expect(res.body.status).toBe(SOPStatus.PUBLISHED);
            });
        });
    });
  });

  describe('/api/v1/governance/sops/my-assigned (GET)', () => {
    it('should return assigned SOPs for current user', () => {
      return request(app.getHttpServer())
        .get('/api/v1/governance/sops/my-assigned')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('data');
          expect(Array.isArray(res.body.data)).toBe(true);
        });
    });
  });

  describe('/api/v1/governance/sops/statistics/publication (GET)', () => {
    it('should return publication statistics', () => {
      return request(app.getHttpServer())
        .get('/api/v1/governance/sops/statistics/publication')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('totalPublished');
          expect(res.body).toHaveProperty('publishedThisMonth');
          expect(res.body).toHaveProperty('publishedThisYear');
          expect(res.body).toHaveProperty('assignmentsCount');
          expect(res.body).toHaveProperty('acknowledgedCount');
          expect(res.body).toHaveProperty('acknowledgmentRate');
        });
    });
  });

  describe('/api/v1/governance/sops/:id (DELETE)', () => {
    it('should delete a SOP', () => {
      return request(app.getHttpServer())
        .delete(`/api/v1/governance/sops/${createdSOPId}`)
        .expect(204);
    });

    it('should return 404 for non-existent SOP', () => {
      return request(app.getHttpServer())
        .delete('/api/v1/governance/sops/non-existent-id')
        .expect(404);
    });
  });
});