/**
 * Policy Test Fixtures
 * Sample data for testing
 */

import { Policy, PolicyStatus, ReviewFrequency } from '../../src/governance/policies/entities/policy.entity';

export const createPolicyFixture = (overrides: Partial<Policy> = {}): Partial<Policy> => {
  return {
    policy_type: 'Information Security',
    title: 'Test Information Security Policy',
    version: '1.0',
    version_number: 1,
    content: '<p>Test policy content</p>',
    purpose: 'Test purpose',
    scope: 'Test scope',
    status: PolicyStatus.DRAFT,
    review_frequency: ReviewFrequency.ANNUAL,
    effective_date: new Date('2024-12-31'),
    requires_acknowledgment: true,
    acknowledgment_due_days: 30,
    ...overrides,
  };
};

export const createPolicyArrayFixture = (count: number = 3): Partial<Policy>[] => {
  return Array.from({ length: count }, (_, index) =>
    createPolicyFixture({
      title: `Test Policy ${index + 1}`,
      policy_type: index % 2 === 0 ? 'Information Security' : 'Data Privacy',
    }),
  );
};







