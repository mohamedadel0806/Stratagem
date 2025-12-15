/**
 * Generate sample Excel files for asset import templates
 */

type AssetType = 'physical' | 'information' | 'software' | 'application' | 'supplier';

interface SampleData {
  [key: string]: any;
}

/**
 * Get sample data for each asset type
 */
function getSampleData(assetType: AssetType): SampleData[] {
  switch (assetType) {
    case 'physical':
      return [
        {
          'Unique Identifier': 'SRV-PROD-001',
          'Asset Description': 'Production Server 01',
          'Asset Type ID (UUID)': '',
          'Manufacturer': 'Dell',
          'Model': 'PowerEdge R740',
          'Business Purpose': 'Primary database server for production environment',
          'Owner ID (UUID)': '',
          'Business Unit ID (UUID)': '',
          'Physical Location': 'HQ Building, 3rd Floor, Server Room 301',
          'Criticality Level': 'critical',
          'MAC Addresses': '00:1B:44:11:3A:B7, 00:1B:44:11:3A:B8',
          'IP Addresses': '192.168.1.10, 192.168.1.11',
          'Installed Software': '[{"name":"Windows Server","version":"2022","patch_level":"KB123456"}]',
          'Active Ports/Services': '[{"port":80,"service":"HTTP","protocol":"TCP"},{"port":443,"service":"HTTPS","protocol":"TCP"}]',
          'Network Approval Status': 'approved',
          'Connectivity Status': 'connected',
          'Last Connectivity Check': '2024-12-01T10:00:00Z',
          'Serial Number': 'DL123456789',
          'Asset Tag': 'TAG-001',
          'Purchase Date': '2023-01-15',
          'Warranty Expiry': '2026-01-15',
          'Compliance Requirements': 'ISO 27001, SOC 2',
          'Security Test Results': '{"last_test_date":"2024-11-15","findings":"No critical vulnerabilities found","severity":"Low"}',
        },
        {
          'Unique Identifier': 'WS-FIN-042',
          'Asset Description': 'Workstation - Finance Dept',
          'Asset Type ID (UUID)': '',
          'Manufacturer': 'HP',
          'Model': 'EliteDesk 800 G6',
          'Business Purpose': 'Finance department workstation for accounting operations',
          'Owner ID (UUID)': '',
          'Business Unit ID (UUID)': '',
          'Physical Location': 'HQ Building, 2nd Floor, Finance Office',
          'Criticality Level': 'high',
          'MAC Addresses': '00:1A:2B:3C:4D:5E',
          'IP Addresses': '192.168.2.42',
          'Installed Software': '[{"name":"Windows 11","version":"22H2","patch_level":"KB123789"}]',
          'Active Ports/Services': '[]',
          'Network Approval Status': 'approved',
          'Connectivity Status': 'connected',
          'Last Connectivity Check': '2024-12-01T09:30:00Z',
          'Serial Number': 'HP987654321',
          'Asset Tag': 'TAG-042',
          'Purchase Date': '2023-06-01',
          'Warranty Expiry': '2026-06-01',
          'Compliance Requirements': 'SOX, GDPR',
          'Security Test Results': '',
        },
        {
          'Unique Identifier': 'NET-CORE-001',
          'Asset Description': 'Network Switch - Core',
          'Asset Type ID (UUID)': '',
          'Manufacturer': 'Cisco',
          'Model': 'Catalyst 9300',
          'Business Purpose': 'Core network switch for data center connectivity',
          'Owner ID (UUID)': '',
          'Business Unit ID (UUID)': '',
          'Physical Location': 'HQ Building, 3rd Floor, Network Closet',
          'Criticality Level': 'critical',
          'MAC Addresses': '00:1E:7A:12:34:56',
          'IP Addresses': '192.168.1.1',
          'Installed Software': '[{"name":"IOS","version":"16.12.04","patch_level":"Latest"}]',
          'Active Ports/Services': '[{"port":22,"service":"SSH","protocol":"TCP"},{"port":161,"service":"SNMP","protocol":"UDP"}]',
          'Network Approval Status': 'approved',
          'Connectivity Status': 'connected',
          'Last Connectivity Check': '2024-12-01T08:00:00Z',
          'Serial Number': 'CS123456789',
          'Asset Tag': 'TAG-CORE-001',
          'Purchase Date': '2022-11-20',
          'Warranty Expiry': '2025-11-20',
          'Compliance Requirements': 'ISO 27001',
          'Security Test Results': '{"last_test_date":"2024-10-20","findings":"Firmware updated to latest version","severity":"Low"}',
        },
      ];

    case 'information':
      return [
        {
          'Name': 'Customer Database',
          'Information Type': 'Customer Records',
          'Description': 'Primary customer information database',
          'Classification Level': 'confidential',
          'Classification Date': '2023-01-10',
          'Information Owner ID': '',
          'Asset Custodian ID': '',
          'Business Unit ID': '',
          'Asset Location': 'Cloud - AWS S3',
          'Storage Medium': 'database',
          'Compliance Requirements': 'GDPR, PCI-DSS',
          'Retention Period': '7 years',
        },
        {
          'Name': 'Employee Handbook',
          'Information Type': 'Policy Document',
          'Description': 'Company employee handbook and policies',
          'Classification Level': 'internal',
          'Classification Date': '2023-03-15',
          'Information Owner ID': '',
          'Asset Custodian ID': '',
          'Business Unit ID': '',
          'Asset Location': 'SharePoint',
          'Storage Medium': 'file_server',
          'Compliance Requirements': '',
          'Retention Period': 'Indefinite',
        },
        {
          'Name': 'Financial Reports Q4',
          'Information Type': 'Financial Data',
          'Description': 'Quarterly financial reports and statements',
          'Classification Level': 'restricted',
          'Classification Date': '2023-12-31',
          'Information Owner ID': '',
          'Asset Custodian ID': '',
          'Business Unit ID': '',
          'Asset Location': 'Secure File Server',
          'Storage Medium': 'file_server',
          'Compliance Requirements': 'SOX, GDPR',
          'Retention Period': '10 years',
        },
      ];

    case 'software':
      return [
        {
          'Software Name': 'Microsoft Office 365',
          'Software Type': 'application_software',
          'Version Number': '2023',
          'Patch Level': 'Latest',
          'Business Purpose': 'Productivity suite for all employees',
          'Owner ID': '',
          'Business Unit ID': '',
          'Vendor Name': 'Microsoft',
          'Vendor Contact': '{"name":"Microsoft Support","email":"support@microsoft.com","phone":"1-800-642-7676"}',
          'License Type': 'Subscription',
          'License Count': '500',
          'License Key': '',
          'License Expiry': '2024-12-31',
          'Installation Count': '485',
          'Last Security Test Date': '2023-11-01',
          'Support End Date': '2024-12-31',
        },
        {
          'Software Name': 'Oracle Database Enterprise',
          'Software Type': 'database_software',
          'Version Number': '19c',
          'Patch Level': '19.17.0.0',
          'Business Purpose': 'Primary database for critical applications',
          'Owner ID': '',
          'Business Unit ID': '',
          'Vendor Name': 'Oracle',
          'Vendor Contact': '{"name":"Oracle Support","email":"support@oracle.com","phone":"1-800-633-0753"}',
          'License Type': 'Perpetual',
          'License Count': '10',
          'License Key': '',
          'License Expiry': '',
          'Installation Count': '8',
          'Last Security Test Date': '2023-10-15',
          'Support End Date': '2025-12-31',
        },
        {
          'Software Name': 'Adobe Creative Cloud',
          'Software Type': 'application_software',
          'Version Number': '2024',
          'Patch Level': 'Latest',
          'Business Purpose': 'Design and creative tools for marketing team',
          'Owner ID': '',
          'Business Unit ID': '',
          'Vendor Name': 'Adobe',
          'Vendor Contact': '{"name":"Adobe Support","email":"support@adobe.com","phone":"1-800-833-6687"}',
          'License Type': 'Subscription',
          'License Count': '25',
          'License Key': '',
          'License Expiry': '2024-06-30',
          'Installation Count': '23',
          'Last Security Test Date': '2023-09-20',
          'Support End Date': '2024-06-30',
        },
      ];

    case 'application':
      return [
        {
          'Application Name': 'Customer Portal',
          'Application Type': 'web_application',
          'Version Number': '2.5.1',
          'Patch Level': '2.5.1.3',
          'Business Purpose': 'Customer self-service portal for account management',
          'Owner ID': '',
          'Business Unit ID': '',
          'Data Processed': 'Customer Data, Payment Information',
          'Data Classification': 'confidential',
          'Vendor Name': 'Internal Development',
          'Vendor Contact': '{"name":"Dev Team","email":"dev@company.com","phone":"+1-555-0100"}',
          'License Type': 'Internal',
          'License Count': '1',
          'License Expiry': '',
          'Hosting Type': 'cloud',
          'Hosting Location': 'AWS',
          'Access URL': 'https://portal.company.com',
          'Last Security Test Date': '2023-11-15',
          'Authentication Method': 'OAuth 2.0',
          'Compliance Requirements': 'GDPR, PCI-DSS',
          'Criticality Level': 'critical',
        },
        {
          'Application Name': 'HR Management System',
          'Application Type': 'web_application',
          'Version Number': '3.2.0',
          'Patch Level': '3.2.0.1',
          'Business Purpose': 'Human resources management and employee records',
          'Owner ID': '',
          'Business Unit ID': '',
          'Data Processed': 'Employee Data, Personal Information',
          'Data Classification': 'restricted',
          'Vendor Name': 'Workday',
          'Vendor Contact': '{"name":"Workday Support","email":"support@workday.com","phone":"1-866-967-5293"}',
          'License Type': 'SaaS',
          'License Count': '1',
          'License Expiry': '2024-12-31',
          'Hosting Type': 'cloud',
          'Hosting Location': 'Workday Cloud',
          'Access URL': 'https://company.workday.com',
          'Last Security Test Date': '2023-10-01',
          'Authentication Method': 'SAML',
          'Compliance Requirements': 'GDPR, HIPAA',
          'Criticality Level': 'high',
        },
        {
          'Application Name': 'Internal Wiki',
          'Application Type': 'web_application',
          'Version Number': '1.8.2',
          'Patch Level': '1.8.2.5',
          'Business Purpose': 'Internal knowledge base and documentation',
          'Owner ID': '',
          'Business Unit ID': '',
          'Data Processed': 'Internal Documentation',
          'Data Classification': 'internal',
          'Vendor Name': 'Confluence',
          'Vendor Contact': '{"name":"Atlassian Support","email":"support@atlassian.com","phone":"1-800-425-9379"}',
          'License Type': 'Subscription',
          'License Count': '1',
          'License Expiry': '2024-08-31',
          'Hosting Type': 'cloud',
          'Hosting Location': 'Atlassian Cloud',
          'Access URL': 'https://company.atlassian.net',
          'Last Security Test Date': '2023-09-10',
          'Authentication Method': 'SSO',
          'Compliance Requirements': '',
          'Criticality Level': 'medium',
        },
      ];

    case 'supplier':
      return [
        {
          'Unique Identifier': 'SUP-001',
          'Supplier Name': 'Cloud Services Provider Inc',
          'Supplier Type': 'service_provider',
          'Business Purpose': 'Cloud infrastructure and hosting services',
          'Owner ID': '',
          'Business Unit ID': '',
          'Goods/Services Type': 'Cloud Services, Infrastructure',
          'Criticality Level': 'critical',
          'Contract Reference': 'CONTRACT-2023-001',
          'Contract Start Date': '2023-01-01',
          'Contract End Date': '2025-12-31',
          'Contract Value': '500000',
          'Currency': 'USD',
          'Auto Renewal': 'true',
          'Primary Contact': '{"name":"John Smith","title":"Account Manager","email":"john.smith@cloudprovider.com","phone":"+1-555-1000"}',
          'Secondary Contact': '{"name":"Jane Doe","title":"Technical Support","email":"jane.doe@cloudprovider.com","phone":"+1-555-1001"}',
          'Tax ID': '12-3456789',
          'Registration Number': 'REG-123456',
          'Address': '123 Cloud Street, San Francisco, CA 94105',
          'Country': 'United States',
          'Website': 'https://www.cloudprovider.com',
          'Risk Assessment Date': '2023-01-15',
          'Risk Level': 'low',
          'Compliance Certifications': 'ISO 27001, SOC 2 Type II',
          'Insurance Verified': 'true',
          'Background Check Date': '2023-01-10',
          'Performance Rating': '4.8',
          'Last Review Date': '2023-12-01',
        },
        {
          'Unique Identifier': 'SUP-002',
          'Supplier Name': 'Security Consulting Group',
          'Supplier Type': 'consultant',
          'Business Purpose': 'Cybersecurity consulting and penetration testing',
          'Owner ID': '',
          'Business Unit ID': '',
          'Goods/Services Type': 'Consulting Services, Security Assessments',
          'Criticality Level': 'high',
          'Contract Reference': 'CONTRACT-2023-045',
          'Contract Start Date': '2023-06-01',
          'Contract End Date': '2024-05-31',
          'Contract Value': '150000',
          'Currency': 'USD',
          'Auto Renewal': 'false',
          'Primary Contact': '{"name":"Mike Johnson","title":"Senior Consultant","email":"mike.j@securitygroup.com","phone":"+1-555-2000"}',
          'Secondary Contact': '',
          'Tax ID': '98-7654321',
          'Registration Number': 'REG-789012',
          'Address': '456 Security Blvd, New York, NY 10001',
          'Country': 'United States',
          'Website': 'https://www.securitygroup.com',
          'Risk Assessment Date': '2023-05-20',
          'Risk Level': 'low',
          'Compliance Certifications': 'ISO 27001',
          'Insurance Verified': 'true',
          'Background Check Date': '2023-05-15',
          'Performance Rating': '4.9',
          'Last Review Date': '2023-11-15',
        },
        {
          'Unique Identifier': 'SUP-003',
          'Supplier Name': 'Office Supplies Co',
          'Supplier Type': 'vendor',
          'Business Purpose': 'Office supplies and equipment',
          'Owner ID': '',
          'Business Unit ID': '',
          'Goods/Services Type': 'Office Supplies, Equipment',
          'Criticality Level': 'low',
          'Contract Reference': 'CONTRACT-2023-089',
          'Contract Start Date': '2023-01-01',
          'Contract End Date': '2023-12-31',
          'Contract Value': '50000',
          'Currency': 'USD',
          'Auto Renewal': 'true',
          'Primary Contact': '{"name":"Sarah Williams","title":"Sales Representative","email":"sarah.w@officesupplies.com","phone":"+1-555-3000"}',
          'Secondary Contact': '',
          'Tax ID': '11-2233445',
          'Registration Number': 'REG-345678',
          'Address': '789 Supply Avenue, Chicago, IL 60601',
          'Country': 'United States',
          'Website': 'https://www.officesupplies.com',
          'Risk Assessment Date': '2022-12-15',
          'Risk Level': 'low',
          'Compliance Certifications': '',
          'Insurance Verified': 'true',
          'Background Check Date': '2022-12-10',
          'Performance Rating': '4.5',
          'Last Review Date': '2023-10-01',
        },
      ];

    default:
      return [];
  }
}

/**
 * Generate and download a sample Excel file for asset import
 */
export async function downloadSampleExcel(assetType: AssetType): Promise<void> {
  try {
    // Dynamic import to handle case where xlsx might not be installed
    const XLSX = await import('xlsx').catch(() => {
      throw new Error('xlsx package is not installed. Run: npm install xlsx');
    });

    const sampleData = getSampleData(assetType);

    if (sampleData.length === 0) {
      throw new Error(`No sample data available for asset type: ${assetType}`);
    }

    // Create worksheet from sample data
    const worksheet = XLSX.utils.json_to_sheet(sampleData);

    // Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sample Data');

    // Generate filename
    const assetTypeNames: Record<AssetType, string> = {
      physical: 'Physical Assets',
      information: 'Information Assets',
      software: 'Software Assets',
      application: 'Business Applications',
      supplier: 'Suppliers',
    };

    const filename = `sample-${assetType}-import-template`;

    // Write file
    XLSX.writeFile(workbook, `${filename}.xlsx`);
  } catch (error: any) {
    if (error.message.includes('not installed')) {
      throw error;
    }
    throw new Error(`Failed to generate sample Excel file: ${error.message}`);
  }
}

