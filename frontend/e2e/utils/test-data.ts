/**
 * Test data fixtures for E2E tests
 */

export const testInfluencer = {
  name: `Test Influencer ${Date.now()}`,
  category: 'regulatory' as const,
  sub_category: 'Cybersecurity',
  issuing_authority: 'Test Authority',
  jurisdiction: 'Saudi Arabia',
  reference_number: `REF-${Date.now()}`,
  description: 'Test influencer description',
  status: 'active' as const,
  applicability_status: 'applicable' as const,
};

export const testPolicy = {
  policy_type: 'Information Security',
  title: `Test Policy ${Date.now()}`,
  content: '<p>Test policy content</p>',
  purpose: 'Test purpose',
  scope: 'Test scope',
  status: 'draft' as const,
  effective_date: new Date().toISOString().split('T')[0],
  review_frequency: 'annual' as const,
};

export const testControl = {
  control_identifier: `CTRL-${Date.now()}`,
  title: `Test Control ${Date.now()}`,
  description: 'Test control description',
  control_type: 'preventive' as const,
  control_category: 'Access Control',
  domain: 'Security',
  status: 'draft' as const,
  implementation_status: 'not_implemented' as const,
};

export const testAssessment = {
  assessment_identifier: `ASSESS-${Date.now()}`,
  name: `Test Assessment ${Date.now()}`,
  description: 'Test assessment description',
  assessment_type: 'implementation' as const,
  status: 'not_started' as const,
};

export const testFinding = {
  finding_identifier: `FIND-${Date.now()}`,
  title: `Test Finding ${Date.now()}`,
  description: 'Test finding description',
  severity: 'medium' as const,
  finding_date: new Date().toISOString().split('T')[0],
  status: 'open' as const,
};

export const testEvidence = {
  evidence_identifier: `EVID-${Date.now()}`,
  title: `Test Evidence ${Date.now()}`,
  description: 'Test evidence description',
  evidence_type: 'policy_document' as const,
  collection_date: new Date().toISOString().split('T')[0],
  status: 'draft' as const,
  confidential: false,
};




