export const TEST_STATUS = {
  DRAFT: 'Draft',
  ACTIVE: 'Active',
  NOT_STARTED: 'Not Started',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
  PUBLISHED: 'Published',
  APPROVED: 'Approved',
  OPEN: 'Open',
  CLOSED: 'Closed',
} as const;

export const TEST_SEVERITY = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
  CRITICAL: 'Critical',
} as const;

export const TEST_CONTROL_TYPE = {
  PREVENTIVE: 'Preventive',
  DETECTIVE: 'Detective',
  CORRECTIVE: 'Corrective',
} as const;

export const TEST_ASSESSMENT_TYPE = {
  OPERATING_EFFECTIVENESS: 'Operating Effectiveness',
  DESIGN_EFFECTIVENESS: 'Design Effectiveness',
} as const;

export const TEST_EVIDENCE_TYPE = {
  POLICY_DOCUMENT: 'Policy Document',
  PROCEDURE_DOCUMENT: 'Procedure Document',
  EVIDENCE_FILE: 'Evidence File',
} as const;

export const TEST_INFLUENCER_CATEGORY = {
  REGULATORY: 'Regulatory',
  INTERNAL: 'Internal',
  EXTERNAL: 'External',
} as const;

export const TEST_IMPLEMENTATION_STATUS = {
  NOT_IMPLEMENTED: 'Not Implemented',
  PARTIALLY_IMPLEMENTED: 'Partially Implemented',
  FULLY_IMPLEMENTED: 'Fully Implemented',
} as const;

export const TEST_REVIEW_FREQUENCY = {
  ANNUAL: 'Annual',
  SEMI_ANNUAL: 'Semi-Annual',
  QUARTERLY: 'Quarterly',
} as const;

export const TEST_FREQUENCY = {
  IMMEDIATE: 'IMMEDIATE',
  DAILY: 'DAILY',
  WEEKLY: 'WEEKLY',
} as const;

export const TEST_TIMEOUTS = {
  SHORT: 5000,
  MEDIUM: 10000,
  LONG: 15000,
  NAVIGATION: 8000,
  FORM_SUBMISSION: 10000,
  VERIFICATION: 8000,
} as const;

export const ASSET_TYPES = {
  PHYSICAL: 'Physical',
  INFORMATION: 'Information',
  SOFTWARE: 'Software',
  BUSINESS_APPLICATION: 'Business Application',
  SUPPLIER: 'Supplier',
} as const;

export const ASSET_STATUS = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
  DRAFT: 'Draft',
  DECOMMISSIONED: 'Decommissioned',
} as const;

export const ASSET_CRITICALITY = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
  CRITICAL: 'Critical',
} as const;

export const ASSET_CLASSIFICATION = {
  PUBLIC: 'Public',
  INTERNAL: 'Internal',
  CONFIDENTIAL: 'Confidential',
  RESTRICTED: 'Restricted',
} as const;

export const APPLICATION_TYPE = {
  WEB_APPLICATION: 'Web Application',
  MOBILE_APPLICATION: 'Mobile Application',
  DESKTOP_APPLICATION: 'Desktop Application',
  API: 'API',
  SERVICE: 'Service',
} as const;

export const HOSTING_LOCATION = {
  CLOUD: 'Cloud',
  ON_PREMISES: 'On-Premises',
  HYBRID: 'Hybrid',
} as const;
