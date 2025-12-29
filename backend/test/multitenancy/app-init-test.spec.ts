import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';

describe('AppModule Initialization', () => {
    it('should compile AppModule', async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        const app = moduleFixture.createNestApplication();
        await app.init();
        await app.close();
    });
});
