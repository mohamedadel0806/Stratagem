/**
 * Export utilities for converting data to CSV format
 */

export interface ExportableData {
  [key: string]: any;
}

/**
 * Convert an array of objects to CSV string
 */
export function convertToCSV(data: ExportableData[], headers?: string[]): string {
  if (!data || data.length === 0) {
    return '';
  }

  // Get headers from first object if not provided
  const csvHeaders = headers || Object.keys(data[0]);
  
  // Create header row
  const headerRow = csvHeaders.map(header => escapeCSVValue(header)).join(',');
  
  // Create data rows
  const dataRows = data.map(item => {
    return csvHeaders.map(header => {
      const value = getNestedValue(item, header);
      return escapeCSVValue(value);
    }).join(',');
  });
  
  // Combine header and data rows
  return [headerRow, ...dataRows].join('\n');
}

/**
 * Escape CSV value (handle commas, quotes, newlines)
 */
function escapeCSVValue(value: any): string {
  if (value === null || value === undefined) {
    return '';
  }
  
  const stringValue = String(value);
  
  // If value contains comma, quote, or newline, wrap in quotes and escape quotes
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  
  return stringValue;
}

/**
 * Get nested value from object using dot notation
 */
function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, prop) => current?.[prop], obj);
}

/**
 * Download CSV file
 */
export function downloadCSV(csvContent: string, filename: string): void {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}

/**
 * Format date for CSV export
 */
export function formatDateForExport(date: string | Date | null | undefined): string {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit' 
  });
}

/**
 * Format risk data for export
 */
export function formatRiskForExport(risk: any): any {
  return {
    'Title': risk.title,
    'Description': risk.description || '',
    'Category': risk.category?.replace('_', ' ') || '',
    'Status': risk.status || '',
    'Likelihood': risk.likelihood || '',
    'Impact': risk.impact || '',
    'Risk Score': (risk.likelihood || 0) * (risk.impact || 0),
    'Created At': formatDateForExport(risk.createdAt),
  };
}

/**
 * Format policy data for export
 */
export function formatPolicyForExport(policy: any): any {
  return {
    'Title': policy.title,
    'Description': policy.description || '',
    'Type': policy.policyType || '',
    'Status': policy.status?.replace('_', ' ') || '',
    'Version': policy.version || '',
    'Effective Date': formatDateForExport(policy.effectiveDate),
    'Review Date': formatDateForExport(policy.reviewDate),
    'Created At': formatDateForExport(policy.createdAt),
  };
}

/**
 * Format requirement data for export
 */
export function formatRequirementForExport(requirement: any): any {
  return {
    'Title': requirement.title,
    'Description': requirement.description || '',
    'Requirement Code': requirement.requirementCode || '',
    'Status': requirement.status?.replace('_', ' ') || '',
    'Category': requirement.category || '',
    'Compliance Deadline': requirement.complianceDeadline || '',
    'Applicability': requirement.applicability || '',
    'Created At': formatDateForExport(requirement.createdAt),
  };
}

/**
 * Format physical asset data for export
 */
export function formatPhysicalAssetForExport(asset: any): any {
  const assetTypeValue = asset.assetType 
    ? (typeof asset.assetType === 'string' 
        ? asset.assetType.replace('_', ' ')
        : asset.assetType.name || '')
    : '';
  
  return {
    'Asset ID': asset.uniqueIdentifier || asset.assetIdentifier || '',
    'Description': asset.assetDescription || '',
    'Type': assetTypeValue,
    'Manufacturer': asset.manufacturer || '',
    'Model': asset.model || '',
    'Serial Number': asset.serialNumber || '',
    'Location': asset.location || '',
    'Business Unit': asset.businessUnit || '',
    'Owner': asset.ownerName || '',
    'Criticality': asset.criticalityLevel || '',
    'Connectivity Status': asset.connectivityStatus || '',
    'IP Addresses': asset.ipAddresses?.join('; ') || '',
    'MAC Addresses': asset.macAddresses?.join('; ') || '',
    'Created At': formatDateForExport(asset.createdAt),
  };
}

