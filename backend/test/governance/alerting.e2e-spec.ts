/**
 * Alerting E2E Test
 * End-to-end test for Alerting API endpoints
 */

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe, ExecutionContext } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { AlertingService } from '../../src/governance/services/alerting.service';
import { Alert, AlertSeverity, AlertStatus, AlertType } from '../../src/governance/entities/alert.entity';
import { AlertRule, AlertRuleTriggerType, AlertRuleCondition } from '../../src/governance/entities/alert-rule.entity';
import { AlertSubscription, NotificationChannel, NotificationFrequency } from '../../src/governance/entities/alert-subscription.entity';
import { JwtAuthGuard } from '../../src/auth/guards/jwt-auth.guard';

describe('AlertingController (e2e)', () => {
  let app: INestApplication;
  let alertingService: AlertingService;
  let authToken: string;
  let createdAlertId: string;
  let createdRuleId: string;
  let createdSubscriptionId: string;

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

    alertingService = moduleFixture.get<AlertingService>(AlertingService);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/api/v1/governance/alerting/alerts (POST)', () => {
    it('should create a new alert', () => {
      const createAlertDto = {
        title: 'Test Alert',
        description: 'Detailed description of the test alert',
        message: 'This is a test alert',
        type: AlertType.CUSTOM,
        severity: AlertSeverity.HIGH,
        entityType: 'policy',
        entityId: '550e8400-e29b-41d4-a716-446655440001',
      };

      return request(app.getHttpServer())
        .post('/api/v1/governance/alerting/alerts')
        .send(createAlertDto)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.title).toBe(createAlertDto.title);
          expect(res.body.message).toBe(createAlertDto.message);
          expect(res.body.type).toBe(createAlertDto.type);
          expect(res.body.severity).toBe(createAlertDto.severity);
          expect(res.body.status).toBe(AlertStatus.ACTIVE);
          createdAlertId = res.body.id;
        });
    });

    it('should validate required fields', () => {
      return request(app.getHttpServer())
        .post('/api/v1/governance/alerting/alerts')
        .send({})
        .expect(400);
    });
  });

  describe('/api/v1/governance/alerting/alerts (GET)', () => {
    it('should return a list of alerts', () => {
      return request(app.getHttpServer())
        .get('/api/v1/governance/alerting/alerts')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('alerts');
          expect(res.body).toHaveProperty('total');
          expect(Array.isArray(res.body.alerts)).toBe(true);
        });
    });

    it('should support filtering by status', () => {
      return request(app.getHttpServer())
        .get('/api/v1/governance/alerting/alerts?status=ACTIVE')
        .expect(200)
        .expect((res) => {
          expect(res.body.alerts.every((alert: Alert) => alert.status === AlertStatus.ACTIVE)).toBe(true);
        });
    });

    it('should support filtering by severity', () => {
      return request(app.getHttpServer())
        .get('/api/v1/governance/alerting/alerts?severity=HIGH')
        .expect(200)
        .expect((res) => {
          expect(res.body.alerts.every((alert: Alert) => alert.severity === AlertSeverity.HIGH)).toBe(true);
        });
    });

    it('should support pagination', () => {
      return request(app.getHttpServer())
        .get('/api/v1/governance/alerting/alerts?limit=5&offset=0')
        .expect(200)
        .expect((res) => {
          expect(res.body.alerts.length).toBeLessThanOrEqual(5);
        });
    });
  });

  describe('/api/v1/governance/alerting/alerts/:id (GET)', () => {
    it('should return an alert by ID', () => {
      return request(app.getHttpServer())
        .get(`/api/v1/governance/alerting/alerts/${createdAlertId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(createdAlertId);
          expect(res.body).toHaveProperty('title');
          expect(res.body).toHaveProperty('message');
          expect(res.body).toHaveProperty('status');
        });
    });

    it('should return 404 for non-existent alert', () => {
      return request(app.getHttpServer())
        .get('/api/v1/governance/alerting/alerts/non-existent-id')
        .expect(404);
    });
  });

  describe('/api/v1/governance/alerting/alerts/:id/acknowledge (PUT)', () => {
    it('should acknowledge an alert', () => {
      return request(app.getHttpServer())
        .put(`/api/v1/governance/alerting/alerts/${createdAlertId}/acknowledge`)
        .send({})
        .expect(200)
        .expect((res) => {
          expect(res.body.status).toBe(AlertStatus.ACKNOWLEDGED);
          expect(res.body).toHaveProperty('acknowledgedAt');
          expect(res.body).toHaveProperty('acknowledgedBy');
        });
    });
  });

  describe('/api/v1/governance/alerting/alerts/:id/resolve (PUT)', () => {
    it('should resolve an alert', () => {
      const resolutionData = {
        resolution: 'Issue has been resolved',
      };

      return request(app.getHttpServer())
        .put(`/api/v1/governance/alerting/alerts/${createdAlertId}/resolve`)
        .send(resolutionData)
        .expect(200)
        .expect((res) => {
          expect(res.body.status).toBe(AlertStatus.RESOLVED);
          expect(res.body.resolution).toBe(resolutionData.resolution);
          expect(res.body).toHaveProperty('resolvedAt');
          expect(res.body).toHaveProperty('resolvedBy');
        });
    });
  });

  describe('/api/v1/governance/alerting/rules (POST)', () => {
    it('should create a new alert rule', () => {
      const createRuleDto = {
        name: 'Test Rule',
        description: 'Test alert rule',
        triggerType: AlertRuleTriggerType.CUSTOM_CONDITION,
        entityType: 'policy',
        condition: AlertRuleCondition.EQUALS,
        conditionValue: 'test-value',
        alertType: AlertType.CUSTOM,
        alertSeverity: AlertSeverity.MEDIUM,
        alertMessage: 'Test alert message',
        isActive: true,
      };

      return request(app.getHttpServer())
        .post('/api/v1/governance/alerting/rules')
        .send(createRuleDto)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.name).toBe(createRuleDto.name);
          expect(res.body.triggerType).toBe(createRuleDto.triggerType);
          expect(res.body.isActive).toBe(createRuleDto.isActive);
          createdRuleId = res.body.id;
        });
    });
  });

  describe('/api/v1/governance/alerting/rules (GET)', () => {
    it('should return a list of alert rules', () => {
      return request(app.getHttpServer())
        .get('/api/v1/governance/alerting/rules')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });

    it('should support filtering by active status', () => {
      return request(app.getHttpServer())
        .get('/api/v1/governance/alerting/rules?isActive=true')
        .expect(200)
        .expect((res) => {
          expect(res.body.every((rule: AlertRule) => rule.isActive === true)).toBe(true);
        });
    });
  });

  describe('/api/v1/governance/alerting/rules/:id (PUT)', () => {
    it('should update an alert rule', () => {
      const updateDto = {
        name: 'Updated Test Rule',
        isActive: false,
      };

      return request(app.getHttpServer())
        .put(`/api/v1/governance/alerting/rules/${createdRuleId}`)
        .send(updateDto)
        .expect(200)
        .expect((res) => {
          expect(res.body.name).toBe(updateDto.name);
          expect(res.body.isActive).toBe(updateDto.isActive);
        });
    });
  });

  describe('/api/v1/governance/alerting/rules/:id (DELETE)', () => {
    it('should delete an alert rule', () => {
      return request(app.getHttpServer())
        .delete(`/api/v1/governance/alerting/rules/${createdRuleId}`)
        .expect(204);
    });
  });

  describe('/api/v1/governance/alerting/subscriptions (POST)', () => {
    it('should create a new alert subscription', () => {
      const createSubscriptionDto = {
        userId: '550e8400-e29b-41d4-a716-446655440000',
        alertType: AlertType.CUSTOM,
        severity: AlertSeverity.HIGH,
        channels: [NotificationChannel.EMAIL],
        frequency: NotificationFrequency.IMMEDIATE,
        isActive: true,
      };

      return request(app.getHttpServer())
        .post('/api/v1/governance/alerting/subscriptions')
        .send(createSubscriptionDto)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.userId).toBe(createSubscriptionDto.userId);
          expect(res.body.alertType).toBe(createSubscriptionDto.alertType);
          expect(res.body.isActive).toBe(createSubscriptionDto.isActive);
          createdSubscriptionId = res.body.id;
        });
    });
  });

  describe('/api/v1/governance/alerting/subscriptions/user/:userId (GET)', () => {
    it('should return user alert subscriptions', () => {
      return request(app.getHttpServer())
        .get('/api/v1/governance/alerting/subscriptions/user/550e8400-e29b-41d4-a716-446655440000')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });
  });

  describe('/api/v1/governance/alerting/subscriptions/:id (PUT)', () => {
    it('should update an alert subscription', () => {
      const updateDto = {
        isActive: false,
        frequency: NotificationFrequency.DAILY,
      };

      return request(app.getHttpServer())
        .put(`/api/v1/governance/alerting/subscriptions/${createdSubscriptionId}`)
        .send(updateDto)
        .expect(200)
        .expect((res) => {
          expect(res.body.isActive).toBe(updateDto.isActive);
          expect(res.body.frequency).toBe(updateDto.frequency);
        });
    });
  });

  describe('/api/v1/governance/alerting/subscriptions/:id (DELETE)', () => {
    it('should delete an alert subscription', () => {
      return request(app.getHttpServer())
        .delete(`/api/v1/governance/alerting/subscriptions/${createdSubscriptionId}`)
        .expect(204);
    });
  });

  describe('/api/v1/governance/alerting/rules/evaluate (POST)', () => {
    it('should manually trigger alert rule evaluation', () => {
      return request(app.getHttpServer())
        .post('/api/v1/governance/alerting/rules/evaluate')
        .send({})
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('message');
          expect(res.body.message).toBe('Alert rule evaluation completed');
        });
    });
  });
});