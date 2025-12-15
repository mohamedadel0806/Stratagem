/**
 * Test Utilities
 * Common helper functions for testing
 */

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as request from 'supertest';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

/**
 * Create a test application module
 */
export async function createTestModule(modules: any[]): Promise<TestingModule> {
  return Test.createTestingModule({
    imports: modules,
  }).compile();
}

/**
 * Create a test NestJS application
 */
export async function createTestApp(module: TestingModule): Promise<INestApplication> {
  const app = module.createNestApplication();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  await app.init();
  return app;
}

/**
 * Get a repository for testing
 */
export function getTestRepository<T>(
  app: INestApplication,
  entity: new () => T,
): Repository<T> {
  return app.get<Repository<T>>(getRepositoryToken(entity));
}

/**
 * Make a request to the test application
 */
export function requestTestApp(app: INestApplication): request.SuperTest<request.Test> {
  return request(app.getHttpServer());
}

/**
 * Create test user data
 */
export function createTestUser(overrides: Partial<any> = {}) {
  return {
    email: 'test@example.com',
    first_name: 'Test',
    last_name: 'User',
    password: 'TestPassword123!',
    ...overrides,
  };
}

/**
 * Wait for async operations
 */
export function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Clean up test data
 */
export async function cleanupTestData(repository: Repository<any>): Promise<void> {
  await repository.delete({});
}

/**
 * Create test database URL
 */
export function getTestDatabaseUrl(): string {
  return (
    process.env.TEST_DATABASE_URL ||
    'postgresql://postgres:password@localhost:5432/grc_platform_test'
  );
}




