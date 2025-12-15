import { generateRandomString, generateRandomEmail } from '../utils/helpers';

/**
 * Test data generators for asset forms
 */

// Physical Asset Test Data
export const generatePhysicalAssetData = () => ({
  basic: {
    assetDescription: `Test Server ${generateRandomString()}`,
    uniqueIdentifier: `SRV-${generateRandomString().toUpperCase()}`,
    assetType: 'server',
    criticalityLevel: 'high',
    status: 'active'
  },
  location: {
    building: 'Main Office Building',
    floor: '3',
    room: '301',
    rack: 'A15',
    datacenter: 'Primary DC'
  },
  network: {
    hostname: `server-${generateRandomString().toLowerCase()}.example.com`,
    ipAddress: `192.168.1.${Math.floor(Math.random() * 254) + 1}`,
    macAddress: generateRandomMacAddress(),
    port: `${Math.floor(Math.random() * 65534) + 1}`,
    networkSegment: 'Production'
  },
  ownership: {
    owner: generateRandomEmail('owner'),
    businessUnit: 'IT Infrastructure',
    costCenter: 'CC-001',
    purchaseDate: '2024-01-15',
    warrantyExpiry: '2025-01-15'
  },
  compliance: {
    complianceRequirements: ['SOC 2', 'ISO 27001'],
    securityClassification: 'Confidential',
    backupRequired: true,
    monitoringLevel: 'High'
  }
});

// Information Asset Test Data
export const generateInformationAssetData = () => ({
  basic: {
    assetName: `Test Document ${generateRandomString()}`,
    informationType: 'Customer Records',
    description: 'Test document for E2E testing',
    retentionPeriod: '7 years'
  },
  classification: {
    dataClassification: 'Confidential',
    sensitivityLevel: 'High',
    personalData: true,
    financialData: true,
    healthData: false
  },
  ownership: {
    dataOwner: generateRandomEmail('dataowner'),
    custodian: generateRandomEmail('custodian'),
    department: 'Compliance',
    accessLevel: 'Restricted'
  },
  storage: {
    storageLocation: 'Secure Server Room',
    encryptionRequired: true,
    backupFrequency: 'Daily',
    disasterRecoveryPlan: true
  }
});

// Software Asset Test Data
export const generateSoftwareAssetData = () => ({
  basic: {
    softwareName: `Test Software ${generateRandomString()}`,
    vendor: 'Test Vendor Corp',
    version: '2024.1.0',
    description: 'Test software for E2E testing'
  },
  licensing: {
    licenseType: 'Commercial',
    licenseKey: 'XXXX-XXXX-XXXX-XXXX',
    licenseCount: Math.floor(Math.random() * 100) + 1,
    licenseExpiry: generateFutureDate(365),
    supportLevel: 'Premium'
  },
  vendor: {
    vendorName: 'Test Software Solutions Inc',
    supportContact: 'John Support',
    supportEmail: generateRandomEmail('support'),
    supportPhone: '+1-555-0123',
    supportUrl: 'https://support.example.com',
    contractNumber: `CONTRACT-${generateRandomString().toUpperCase()}`
  },
  technical: {
    platform: 'Windows',
    architecture: 'x64',
    installationPath: 'C:\\Program Files\\TestSoftware',
    dependencies: ['Test Library 1.0', 'Runtime Components']
  }
});

// Business Application Test Data
export const generateBusinessApplicationData = () => ({
  basic: {
    applicationName: `Test Application ${generateRandomString()}`,
    applicationType: 'Web Application',
    status: 'Production',
    description: 'Test business application for E2E testing'
  },
  technical: {
    url: `https://app-${generateRandomString().toLowerCase()}.example.com`,
    technologyStack: ['React', 'Node.js', 'PostgreSQL'],
    framework: 'React',
    database: 'PostgreSQL',
    language: 'TypeScript'
  },
  vendor: {
    vendor: 'Test Application Solutions',
    vendorContact: generateRandomEmail('vendor'),
    supportLevel: '24/7',
    sla: '99.9% Uptime'
  },
  compliance: {
    dataProcessing: {
      processesPII: true,
      processesPHI: false,
      processesFinancialData: true,
      processesPersonalData: true
    },
    complianceStandards: ['SOC 2', 'GDPR', 'ISO 27001'],
    riskLevel: 'Medium'
  }
});

// Supplier Test Data
export const generateSupplierData = () => ({
  basic: {
    supplierName: `Test Supplier ${generateRandomString()}`,
    supplierIdentifier: `SUP-${generateRandomString().toUpperCase()}`,
    description: 'Test supplier for E2E testing',
    category: 'Technology Services'
  },
  contact: {
    primaryContactName: 'Jane Doe',
    primaryContactEmail: generateRandomEmail('contact'),
    primaryContactPhone: '+1-555-987-6543',
    address: '123 Test Street, Test City, TC 12345'
  },
  contract: {
    contractNumber: `CONTRACT-${generateRandomString().toUpperCase()}`,
    contractValue: Math.floor(Math.random() * 1000000) + 10000,
    startDate: '2024-01-01',
    endDate: generateFutureDate(365),
    renewalTerms: 'Annual',
    paymentTerms: 'Net 30'
  },
  services: {
    serviceCategories: ['Software Development', 'IT Support', 'Consulting'],
    serviceLevel: 'Premium',
    responseTime: '4 hours',
    availability: '24/7'
  }
});

// Import/Export Test Data
export const generateImportCsvData = (assetType: string, count: number = 5) => {
  switch (assetType) {
    case 'physical':
      return generatePhysicalImportCsv(count);
    case 'information':
      return generateInformationImportCsv(count);
    case 'software':
      return generateSoftwareImportCsv(count);
    case 'applications':
      return generateApplicationImportCsv(count);
    case 'suppliers':
      return generateSupplierImportCsv(count);
    default:
      return '';
  }
};

const generatePhysicalImportCsv = (count: number) => {
  const headers = 'Asset Description,Unique Identifier,Asset Type,Criticality Level,Status,Building,Floor,Room';
  const rows = [];

  for (let i = 1; i <= count; i++) {
    rows.push([
      `Import Server ${i}`,
      `IMP-SRV-${String(i).padStart(3, '0')}`,
      'Server',
      'High',
      'Active',
      'Main Office',
      `${Math.floor(Math.random() * 10) + 1}`,
      `${Math.floor(Math.random() * 50) + 1}`
    ].join(','));
  }

  return [headers, ...rows].join('\n');
};

const generateInformationImportCsv = (count: number) => {
  const headers = 'Asset Name,Information Type,Data Classification,Data Owner,Retention Period';
  const rows = [];

  for (let i = 1; i <= count; i++) {
    rows.push([
      `Import Document ${i}`,
      'Customer Records',
      'Confidential',
      `owner${i}@example.com`,
      '7 years'
    ].join(','));
  }

  return [headers, ...rows].join('\n');
};

const generateSoftwareImportCsv = (count: number) => {
  const headers = 'Software Name,Vendor,Version,License Type,License Count';
  const rows = [];

  for (let i = 1; i <= count; i++) {
    rows.push([
      `Import Software ${i}`,
      'Test Vendor',
      `${2023 + Math.floor(Math.random() * 3)}.0`,
      'Commercial',
      `${Math.floor(Math.random() * 100) + 1}`
    ].join(','));
  }

  return [headers, ...rows].join('\n');
};

const generateApplicationImportCsv = (count: number) => {
  const headers = 'Application Name,Application Type,Status,Vendor,URL';
  const rows = [];

  for (let i = 1; i <= count; i++) {
    rows.push([
      `Import Application ${i}`,
      'Web Application',
      'Production',
      'Test Vendor',
      `https://app${i}.example.com`
    ].join(','));
  }

  return [headers, ...rows].join('\n');
};

const generateSupplierImportCsv = (count: number) => {
  const headers = 'Supplier Name,Contact Name,Contact Email,Category,Contract Value';
  const rows = [];

  for (let i = 1; i <= count; i++) {
    rows.push([
      `Import Supplier ${i}`,
      `Contact Person ${i}`,
      `contact${i}@example.com`,
      'Technology Services',
      `${Math.floor(Math.random() * 100000) + 10000}`
    ].join(','));
  }

  return [headers, ...rows].join('\n');
};

// Helper functions
export const generateRandomMacAddress = (): string => {
  const hexChars = '0123456789ABCDEF';
  let macAddress = '';

  for (let i = 0; i < 6; i++) {
    if (i > 0) macAddress += ':';
    macAddress += hexChars[Math.floor(Math.random() * 16)];
    macAddress += hexChars[Math.floor(Math.random() * 16)];
  }

  return macAddress;
};

export const generateFutureDate = (daysFromNow: number = 365): string => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString().split('T')[0];
};

export const generatePastDate = (daysAgo: number = 30): string => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split('T')[0];
};

// Edge case test data
export const generateEdgeCaseData = () => ({
  physicalAsset: {
    veryLongName: 'A'.repeat(255), // Maximum length
    specialChars: 'Test Server @#$%^&*()_+-={}[]|\\:";\'<>?,./',
    unicodeName: 'Test Servér 𝒯𝑒𝑠𝑡 测试服務器',
    minimalData: {
      assetDescription: 'Min',
      uniqueIdentifier: 'A'
    }
  },
  validationErrors: {
    emptyRequired: {
      assetDescription: '',
      uniqueIdentifier: ''
    },
    invalidFormats: {
      macAddress: 'invalid-mac',
      ipAddress: 'invalid-ip',
      email: 'invalid-email',
      port: '99999',
      url: 'not-a-url'
    }
  },
  boundaryValues: {
    zeroPort: '0',
    maxPort: '65535',
    invalidPort: '65536',
    negativeLicenseCount: '-1',
    veryLargeCount: '999999999'
  }
});

// Performance test data
export const generatePerformanceTestData = (assetCount: number) => {
  const assets = [];

  for (let i = 1; i <= assetCount; i++) {
    assets.push(generatePhysicalAssetData());
  }

  return assets;
};

// Pre-defined test scenarios
export const TEST_SCENARIOS = {
  happyPath: {
    description: 'Standard happy path test with valid data',
    data: generatePhysicalAssetData()
  },
  edgeCaseValidation: {
    description: 'Test edge cases and boundary values',
    data: generateEdgeCaseData()
  },
  bulkOperations: {
    description: 'Test bulk create/update operations',
    data: generatePerformanceTestData(50)
  },
  complexRelationships: {
    description: 'Test assets with complex dependencies',
    data: {
      primary: generateBusinessApplicationData(),
      dependencies: [
        generatePhysicalAssetData(),
        generateSoftwareAssetData(),
        generateInformationAssetData()
      ]
    }
  }
};

export default {
  generatePhysicalAssetData,
  generateInformationAssetData,
  generateSoftwareAssetData,
  generateBusinessApplicationData,
  generateSupplierData,
  generateImportCsvData,
  generateRandomMacAddress,
  generateFutureDate,
  generatePastDate,
  generateEdgeCaseData,
  generatePerformanceTestData,
  TEST_SCENARIOS
};