import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../../src/app.module';
import { TenantContextService } from '../../src/common/context/tenant-context.service';
import { TenantsService } from '../../src/tenants/tenants.service';
import { RiskService } from '../../src/risk/services/risk.service';
import { RiskCategoryLegacy, RiskLikelihood, RiskImpact, RiskStatus, Risk } from '../../src/risk/entities/risk.entity';
import { v4 as uuidv4 } from 'uuid';
import { getQueueToken } from '@nestjs/bull';
import { DataSource } from 'typeorm';

describe('RLS Isolation (Integration)', () => {
    let app: INestApplication;
    let tenantContextService: TenantContextService;
    let tenantsService: TenantsService;
    let riskService: RiskService;
    let dataSource: DataSource;

    let tenantAId: string;
    let tenantBId: string;

    beforeAll(async () => {
        const mockQueue = {
            add: jest.fn(),
            process: jest.fn(),
            on: jest.fn(),
        };

        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        })
            .overrideProvider(getQueueToken('workflows'))
            .useValue(mockQueue)
            .overrideProvider(getQueueToken('notifications'))
            .useValue(mockQueue)
            .overrideProvider(getQueueToken('risk-sync'))
            .useValue(mockQueue)
            .compile();

        app = moduleFixture.createNestApplication();
        await app.init();

        tenantContextService = app.get(TenantContextService);
        tenantsService = app.get(TenantsService);
        riskService = app.get(RiskService);
        dataSource = app.get(DataSource);

        // Cleanup existing data to ensure isolation - MUST BYPASS RLS to see everything
        // Use a non-RLS DataSource if possible, but here we just use bypass
        await tenantContextService.run({ tenantId: null, bypassRLS: true }, async () => {
            await dataSource.query('DELETE FROM risks');
            await dataSource.query("DELETE FROM tenants WHERE code LIKE 'tenant-%'");
        });

        // Create two test tenants
        const suffixA = uuidv4().substring(0, 8);
        const tenantA = await tenantsService.create({
            name: `Tenant A Isolation Test ${suffixA}`,
            code: `tenant-a-${suffixA}`,
        });
        tenantAId = tenantA.id;

        const suffixB = uuidv4().substring(0, 8);
        const tenantB = await tenantsService.create({
            name: `Tenant B Isolation Test ${suffixB}`,
            code: `tenant-b-${suffixB}`,
        });
        tenantBId = tenantB.id;
    });

    afterAll(async () => {
        if (tenantContextService && dataSource) {
            await tenantContextService.run({ tenantId: null, bypassRLS: true }, async () => {
                await dataSource.query('DELETE FROM risks');
                await dataSource.query("DELETE FROM tenants WHERE code LIKE 'tenant-%'");
            });
        }
        if (app) await app.close();
    });

    it('should isolate data between Tenant A and Tenant B', async () => {
        // 1. Create a risk for Tenant A
        let riskAId: string;
        await tenantContextService.run({ tenantId: tenantAId }, async () => {
            const risk = await riskService.create({
                title: 'Risk for Tenant A',
                description: 'Should only be visible to Tenant A',
                category: RiskCategoryLegacy.OPERATIONAL,
                likelihood: RiskLikelihood.HIGH,
                impact: RiskImpact.HIGH,
                status: RiskStatus.IDENTIFIED,
            });
            riskAId = risk.id;
        });

        // 2. Create a risk for Tenant B
        let riskBId: string;
        await tenantContextService.run({ tenantId: tenantBId }, async () => {
            const risk = await riskService.create({
                title: 'Risk for Tenant B',
                description: 'Should only be visible to Tenant B',
                category: RiskCategoryLegacy.OPERATIONAL,
                likelihood: RiskLikelihood.LOW,
                impact: RiskImpact.LOW,
                status: RiskStatus.IDENTIFIED,
            });
            riskBId = risk.id;
        });

        // 3. Verify Tenant A cannot see Tenant B's risk
        await tenantContextService.run({ tenantId: tenantAId }, async () => {
            const risks = await riskService.findAll({ limit: 1000 });
            const riskTitles = risks.data.map(r => r.title);

            expect(riskTitles).toContain('Risk for Tenant A');
            expect(riskTitles).not.toContain('Risk for Tenant B');

            try {
                await riskService.findOne(riskBId);
                throw new Error('Tenant A should not be able to find Tenant B\'s risk');
            } catch (e: any) {
                expect(e.status).toBe(404);
            }
        });

        // 4. Verify Tenant B cannot see Tenant A's risk
        await tenantContextService.run({ tenantId: tenantBId }, async () => {
            const risks = await riskService.findAll({ limit: 1000 });
            const riskTitles = risks.data.map(r => r.title);

            expect(riskTitles).toContain('Risk for Tenant B');
            expect(riskTitles).not.toContain('Risk for Tenant A');

            try {
                await riskService.findOne(riskAId);
                throw new Error('Tenant B should not be able to find Tenant A\'s risk');
            } catch (e: any) {
                expect(e.status).toBe(404);
            }
        });
    });

    it('should bypass RLS when requested', async () => {
        await tenantContextService.run({ tenantId: null, bypassRLS: true }, async () => {
            // Use a transaction to ensure RLS context is captured
            await dataSource.transaction(async (manager) => {
                const risks = await manager.find(Risk, {
                    take: 1000,
                    order: { createdAt: 'DESC' }
                });
                const riskTitles = risks.map(r => r.title);

                expect(riskTitles).toContain('Risk for Tenant A');
                expect(riskTitles).toContain('Risk for Tenant B');
            });
        });
    });
});
