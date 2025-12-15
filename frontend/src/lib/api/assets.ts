import { apiClient } from './client';

export interface InstalledSoftware {
  name: string;
  version: string;
  patch_level: string;
}

export interface ActivePortsServices {
  port: number;
  service: string;
  protocol: string;
}

export interface SecurityTestResults {
  last_test_date: string;
  findings: string;
  severity: string;
}

export interface AssetType {
  id: string;
  category: 'physical' | 'information' | 'application' | 'software' | 'supplier';
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PhysicalAsset {
  id: string;
  assetTypeId?: string; // UUID reference to asset_types
  uniqueIdentifier: string; // Primary identifier field (REQUIRED)
  assetDescription: string; // REQUIRED
  manufacturer?: string;
  model?: string;
  businessPurpose?: string;
  ownerId?: string; // UUID reference
  businessUnitId?: string; // UUID reference
  physicalLocation?: string; // Single field (not location/building/floor/room)
  criticalityLevel?: 'critical' | 'high' | 'medium' | 'low';
  macAddresses?: string[];
  ipAddresses?: string[];
  installedSoftware?: InstalledSoftware[];
  activePortsServices?: ActivePortsServices[];
  networkApprovalStatus?: 'approved' | 'pending' | 'rejected' | 'not_required';
  connectivityStatus?: 'connected' | 'disconnected' | 'unknown';
  lastConnectivityCheck?: string;
  serialNumber?: string;
  assetTag?: string;
  purchaseDate?: string;
  warrantyExpiry?: string;
  complianceRequirements?: string[];
  securityTestResults?: SecurityTestResults;
  riskCount?: number; // Number of risks linked to this asset
  createdAt: string;
  updatedAt: string;
  // Legacy fields for backward compatibility (deprecated)
  assetIdentifier?: string; // Deprecated, use uniqueIdentifier
  location?: string; // Deprecated, use physicalLocation
  building?: string; // Deprecated, use physicalLocation
  floor?: string; // Deprecated, use physicalLocation
  room?: string; // Deprecated, use physicalLocation
  businessUnit?: string; // Deprecated, use businessUnitId
  warrantyExpiryDate?: string; // Deprecated, use warrantyExpiry
}

export interface CreatePhysicalAssetData {
  assetTypeId?: string; // UUID reference to asset_types
  uniqueIdentifier: string; // REQUIRED
  assetDescription: string; // REQUIRED
  manufacturer?: string;
  model?: string;
  businessPurpose?: string;
  ownerId?: string; // UUID reference
  businessUnitId?: string; // UUID reference
  physicalLocation?: string; // Single field
  criticalityLevel?: 'critical' | 'high' | 'medium' | 'low';
  macAddresses?: string[];
  ipAddresses?: string[];
  installedSoftware?: InstalledSoftware[];
  activePortsServices?: ActivePortsServices[];
  networkApprovalStatus?: 'approved' | 'pending' | 'rejected' | 'not_required';
  connectivityStatus?: 'connected' | 'disconnected' | 'unknown';
  lastConnectivityCheck?: string;
  serialNumber?: string;
  assetTag?: string;
  purchaseDate?: string;
  warrantyExpiry?: string;
  complianceRequirements?: string[];
  securityTestResults?: SecurityTestResults;
}

export interface PhysicalAssetQueryParams {
  search?: string;
  assetType?: string; // UUID string for asset type ID
  criticalityLevel?: PhysicalAsset['criticalityLevel'];
  connectivityStatus?: PhysicalAsset['connectivityStatus'];
  businessUnit?: string; // UUID string for business unit ID
  ownerId?: string; // UUID string for owner ID
  hasDependencies?: boolean;
  page?: number;
  limit?: number;
}

export interface ImportPreview {
  headers: string[];
  rows: Array<{
    rowNumber: number;
    data: Record<string, any>;
    errors?: string[];
  }>;
  totalRows: number;
}

export interface ImportResult {
  importLogId: string;
  totalRecords: number;
  successfulImports: number;
  failedImports: number;
  errors: Array<{ row: number; errors: string[] }>;
}

export interface ImportLog {
  id: string;
  fileName: string;
  fileType: 'csv' | 'excel';
  assetType: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'partial';
  totalRecords: number;
  successfulImports: number;
  failedImports: number;
  errorReport?: string;
  fieldMapping: Record<string, string>;
  importedById: string;
  importedByName?: string;
  notes?: string;
  createdAt: string;
  completedAt?: string;
}

export const assetsApi = {
  // Physical Assets
  getPhysicalAssets: async (params?: PhysicalAssetQueryParams): Promise<{
    data: PhysicalAsset[];
    total: number;
    page: number;
    limit: number;
  }> => {
    // Helper function to check if a string is a valid UUID
    const isValidUUID = (str: string): boolean => {
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      return uuidRegex.test(str);
    };

    // Clean up params - remove undefined/null/empty values
    const cleanParams: Record<string, any> = {};
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        // Skip undefined, null, and empty strings
        if (value === undefined || value === null || value === '') {
          return;
        }

        // Handle UUID fields - backend expects UUIDs, validate before sending
        if (key === 'assetType' || key === 'businessUnit' || key === 'ownerId') {
          // If it's an object, extract the id
          if (typeof value === 'object' && value !== null && 'id' in value) {
            const id = (value as { id: string }).id;
            if (isValidUUID(id)) {
              cleanParams[key] = id;
            }
          } 
          // If it's a string, only include if it's a valid UUID
          else if (typeof value === 'string' && isValidUUID(value)) {
            cleanParams[key] = value;
          }
          // Otherwise, skip it (don't send non-UUID values like "server", "workstation", etc.)
        } 
        // Handle boolean values - ensure they're proper booleans
        else if (key === 'hasDependencies') {
          if (typeof value === 'boolean') {
            cleanParams[key] = value;
          } else if (typeof value === 'string') {
            // Convert string "true"/"false" to boolean
            cleanParams[key] = value.toLowerCase() === 'true';
          }
        }
        // Handle number fields - ensure they're numbers
        else if (key === 'page' || key === 'limit') {
          const numValue = typeof value === 'number' ? value : Number(value);
          if (!isNaN(numValue) && numValue > 0) {
            cleanParams[key] = numValue;
          }
        }
        // For all other fields, include as-is
        else {
          cleanParams[key] = value;
        }
      });
    }
    
    // Ensure page and limit have defaults if not provided
    if (!cleanParams.page || cleanParams.page < 1) cleanParams.page = 1;
    if (!cleanParams.limit || cleanParams.limit < 1) cleanParams.limit = 20;
    
    const response = await apiClient.get<{
      data: PhysicalAsset[];
      total: number;
      page: number;
      limit: number;
    }>('/assets/physical', { 
      params: cleanParams,
      timeout: 10000, // 10 second timeout
    });
    return response.data;
  },

  getPhysicalAsset: async (id: string): Promise<PhysicalAsset> => {
    const response = await apiClient.get<PhysicalAsset>(`/assets/physical/${id}`);
    return response.data;
  },

  createPhysicalAsset: async (data: CreatePhysicalAssetData): Promise<PhysicalAsset> => {
    // Helper function to check if a string is a valid UUID
    const isValidUUID = (str: string): boolean => {
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      return uuidRegex.test(str);
    };

    // Required fields validation
    if (!data.assetDescription) {
      throw new Error('assetDescription is required');
    }
    if (!data.uniqueIdentifier) {
      throw new Error('uniqueIdentifier is required');
    }

    const backendData: any = {
      assetDescription: data.assetDescription,
      uniqueIdentifier: data.uniqueIdentifier,
    };

    // Map all fields according to requirements
    if (data.assetTypeId && isValidUUID(data.assetTypeId)) {
      backendData.assetTypeId = data.assetTypeId;
    }
    if (data.manufacturer) backendData.manufacturer = data.manufacturer;
    if (data.model) backendData.model = data.model;
    if (data.businessPurpose) backendData.businessPurpose = data.businessPurpose;
    if (data.ownerId && isValidUUID(data.ownerId)) backendData.ownerId = data.ownerId;
    if (data.businessUnitId && isValidUUID(data.businessUnitId)) backendData.businessUnitId = data.businessUnitId;
    if (data.physicalLocation) backendData.physicalLocation = data.physicalLocation;
    if (data.criticalityLevel) backendData.criticalityLevel = data.criticalityLevel;
    if (data.macAddresses && Array.isArray(data.macAddresses)) backendData.macAddresses = data.macAddresses;
    if (data.ipAddresses && Array.isArray(data.ipAddresses)) backendData.ipAddresses = data.ipAddresses;
    if (data.installedSoftware && Array.isArray(data.installedSoftware)) backendData.installedSoftware = data.installedSoftware;
    if (data.activePortsServices && Array.isArray(data.activePortsServices)) backendData.activePortsServices = data.activePortsServices;
    if (data.networkApprovalStatus) {
      if (['approved', 'pending', 'rejected', 'not_required'].includes(data.networkApprovalStatus)) {
        backendData.networkApprovalStatus = data.networkApprovalStatus;
      }
    }
    if (data.connectivityStatus) backendData.connectivityStatus = data.connectivityStatus;
    if (data.lastConnectivityCheck) backendData.lastConnectivityCheck = data.lastConnectivityCheck;
    if (data.serialNumber) backendData.serialNumber = data.serialNumber;
    if (data.assetTag) backendData.assetTag = data.assetTag;
    if (data.purchaseDate) backendData.purchaseDate = data.purchaseDate;
    if (data.warrantyExpiry) backendData.warrantyExpiry = data.warrantyExpiry;
    if (data.complianceRequirements && Array.isArray(data.complianceRequirements)) {
      backendData.complianceRequirements = data.complianceRequirements;
    }
    if (data.securityTestResults) backendData.securityTestResults = data.securityTestResults;

    const response = await apiClient.post<PhysicalAsset>('/assets/physical', backendData);
    return response.data;
  },

  updatePhysicalAsset: async (id: string, data: Partial<CreatePhysicalAssetData>): Promise<PhysicalAsset> => {
    // Helper function to check if a string is a valid UUID
    const isValidUUID = (str: string): boolean => {
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      return uuidRegex.test(str);
    };

    const backendData: any = {};

    // Map all fields according to requirements
    if (data.assetDescription !== undefined) backendData.assetDescription = data.assetDescription;
    if (data.uniqueIdentifier !== undefined) backendData.uniqueIdentifier = data.uniqueIdentifier;
    if (data.assetTypeId !== undefined && isValidUUID(data.assetTypeId)) backendData.assetTypeId = data.assetTypeId;
    if (data.manufacturer !== undefined) backendData.manufacturer = data.manufacturer;
    if (data.model !== undefined) backendData.model = data.model;
    if (data.businessPurpose !== undefined) backendData.businessPurpose = data.businessPurpose;
    if (data.ownerId !== undefined && isValidUUID(data.ownerId)) backendData.ownerId = data.ownerId;
    if (data.businessUnitId !== undefined && isValidUUID(data.businessUnitId)) backendData.businessUnitId = data.businessUnitId;
    if (data.physicalLocation !== undefined) backendData.physicalLocation = data.physicalLocation;
    if (data.criticalityLevel !== undefined) backendData.criticalityLevel = data.criticalityLevel;
    if (data.macAddresses !== undefined) backendData.macAddresses = data.macAddresses;
    if (data.ipAddresses !== undefined) backendData.ipAddresses = data.ipAddresses;
    if (data.installedSoftware !== undefined) backendData.installedSoftware = data.installedSoftware;
    if (data.activePortsServices !== undefined) backendData.activePortsServices = data.activePortsServices;
    if (data.networkApprovalStatus !== undefined) {
      if (['approved', 'pending', 'rejected', 'not_required'].includes(data.networkApprovalStatus)) {
        backendData.networkApprovalStatus = data.networkApprovalStatus;
      }
    }
    if (data.connectivityStatus !== undefined) backendData.connectivityStatus = data.connectivityStatus;
    if (data.lastConnectivityCheck !== undefined) backendData.lastConnectivityCheck = data.lastConnectivityCheck;
    if (data.serialNumber !== undefined) backendData.serialNumber = data.serialNumber;
    if (data.assetTag !== undefined) backendData.assetTag = data.assetTag;
    if (data.purchaseDate !== undefined) backendData.purchaseDate = data.purchaseDate;
    if (data.warrantyExpiry !== undefined) backendData.warrantyExpiry = data.warrantyExpiry;
    if (data.complianceRequirements !== undefined) backendData.complianceRequirements = data.complianceRequirements;
    if (data.securityTestResults !== undefined) backendData.securityTestResults = data.securityTestResults;

    const response = await apiClient.put<PhysicalAsset>(`/assets/physical/${id}`, backendData);
    return response.data;
  },

  deletePhysicalAsset: async (id: string): Promise<void> => {
    await apiClient.delete(`/assets/physical/${id}`);
  },

  // Import - Physical Assets (backward compatibility)
  previewImport: async (file: File, fileType: 'csv' | 'excel'): Promise<ImportPreview> => {
    return assetsApi.previewImportByType('physical', file, fileType);
  },

  importAssets: async (
    file: File,
    fileType: 'csv' | 'excel',
    fieldMapping: Record<string, string>,
  ): Promise<ImportResult> => {
    return assetsApi.importAssetsByType('physical', file, fileType, fieldMapping);
  },

  getImportHistory: async (assetType?: string): Promise<ImportLog[]> => {
    const response = await apiClient.get<ImportLog[]>('/assets/physical/import/history', {
      params: assetType ? { assetType } : undefined,
    });
    return response.data;
  },

  getImportLog: async (id: string): Promise<ImportLog> => {
    const response = await apiClient.get<ImportLog>(`/assets/physical/import/${id}`);
    return response.data;
  },

  // Generic Import Methods (supports all asset types)
  previewImportByType: async (
    assetType: 'physical' | 'information' | 'software' | 'application' | 'supplier',
    file: File,
    fileType: 'csv' | 'excel',
  ): Promise<ImportPreview> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileType', fileType);

    const endpointMap = {
      physical: '/assets/physical/import/preview',
      information: '/assets/information/import/preview',
      software: '/assets/software/import/preview',
      application: '/assets/applications/import/preview',
      supplier: '/assets/suppliers/import/preview',
    };

    const response = await apiClient.post<ImportPreview>(endpointMap[assetType], formData);
    return response.data;
  },

  importAssetsByType: async (
    assetType: 'physical' | 'information' | 'software' | 'application' | 'supplier',
    file: File,
    fileType: 'csv' | 'excel',
    fieldMapping: Record<string, string>,
  ): Promise<ImportResult> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileType', fileType);
    formData.append('fieldMapping', JSON.stringify(fieldMapping));

    const endpointMap = {
      physical: '/assets/physical/import',
      information: '/assets/information/import',
      software: '/assets/software/import',
      application: '/assets/applications/import',
      supplier: '/assets/suppliers/import',
    };

    const response = await apiClient.post<ImportResult>(endpointMap[assetType], formData);
    return response.data;
  },

  getImportHistoryByType: async (
    assetType: 'physical' | 'information' | 'software' | 'application' | 'supplier',
  ): Promise<ImportLog[]> => {
    const endpointMap = {
      physical: '/assets/physical/import/history',
      information: '/assets/information/import/history',
      software: '/assets/software/import/history',
      application: '/assets/applications/import/history',
      supplier: '/assets/suppliers/import/history',
    };

    const response = await apiClient.get<ImportLog[]>(endpointMap[assetType]);
    return response.data;
  },

  getImportLogByType: async (
    assetType: 'physical' | 'information' | 'software' | 'application' | 'supplier',
    id: string,
  ): Promise<ImportLog> => {
    const endpointMap = {
      physical: '/assets/physical/import',
      information: '/assets/information/import',
      software: '/assets/software/import',
      application: '/assets/applications/import',
      supplier: '/assets/suppliers/import',
    };

    const response = await apiClient.get<ImportLog>(`${endpointMap[assetType]}/${id}`);
    return response.data;
  },

  // Information Assets
  getInformationAssets: async (params?: {
    search?: string;
    dataClassification?: string;
    criticalityLevel?: string;
    businessUnit?: string;
    ownerId?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    data: any[];
    total: number;
    page: number;
    limit: number;
  }> => {
    // Clean up params - remove undefined, null, and empty string values
    const cleanParams: Record<string, any> = {};
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          // Convert page and limit to numbers
          if (key === 'page' || key === 'limit') {
            cleanParams[key] = Number(value);
          } else {
            cleanParams[key] = value;
          }
        }
      });
    }
    const response = await apiClient.get('/assets/information', { params: cleanParams, timeout: 10000 });
    return response.data;
  },

  getInformationAsset: async (id: string): Promise<any> => {
    const response = await apiClient.get(`/assets/information/${id}`);
    return response.data;
  },

  createInformationAsset: async (data: any): Promise<any> => {
    // Helper function to check if a string is a valid UUID
    const isValidUUID = (str: string): boolean => {
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      return uuidRegex.test(str);
    };

    // Transform frontend data format to backend DTO format
    // Required fields: name, informationType, classificationLevel
    if (!data.assetName && !data.name) {
      throw new Error('Asset name is required');
    }
    if (!data.informationType) {
      throw new Error('Information type is required');
    }
    if (!data.dataClassification && !data.classificationLevel) {
      throw new Error('Classification level is required');
    }

    const backendData: any = {
      name: data.assetName || data.name,
      informationType: data.informationType || 'Information Asset', // Default if not provided
      classificationLevel: data.dataClassification || data.classificationLevel,
    };

    // Map optional fields
    if (data.description) backendData.description = data.description;
    if (data.classificationDate) backendData.classificationDate = data.classificationDate;
    if (data.reclassificationDate) backendData.reclassificationDate = data.reclassificationDate;
    
    // Map UUID fields - only include if valid UUIDs
    if (data.ownerId && isValidUUID(data.ownerId)) {
      backendData.informationOwnerId = data.ownerId;
    }
    if (data.custodianId && isValidUUID(data.custodianId)) {
      backendData.assetCustodianId = data.custodianId;
    }
    if (data.businessUnit && isValidUUID(data.businessUnit)) {
      backendData.businessUnitId = data.businessUnit;
    }
    
    // Map storage fields
    if (data.storageLocation) backendData.assetLocation = data.storageLocation;
    if (data.storageType) backendData.storageMedium = data.storageType;
    if (data.retentionPolicy) backendData.retentionPeriod = data.retentionPolicy;
    if (data.retentionExpiryDate) backendData.retentionExpiryDate = data.retentionExpiryDate;
    
    // Map compliance requirements
    if (data.complianceRequirements && Array.isArray(data.complianceRequirements)) {
      backendData.complianceRequirements = data.complianceRequirements;
    }

    console.log('[assetsApi] Creating information asset with data:', JSON.stringify(backendData, null, 2));

    const response = await apiClient.post('/assets/information', backendData);
    return response.data;
  },

  updateInformationAsset: async (id: string, data: any): Promise<any> => {
    // Helper function to check if a string is a valid UUID
    const isValidUUID = (str: string): boolean => {
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      return uuidRegex.test(str);
    };

    // Transform frontend data format to backend DTO format (same as create)
    const backendData: any = {};

    if (data.assetName !== undefined || data.name !== undefined) {
      backendData.name = data.assetName || data.name;
    }
    if (data.informationType !== undefined) {
      backendData.informationType = data.informationType;
    }
    if (data.description !== undefined) backendData.description = data.description;
    if (data.dataClassification !== undefined || data.classificationLevel !== undefined) {
      backendData.classificationLevel = data.dataClassification || data.classificationLevel;
    }
    if (data.classificationDate !== undefined) backendData.classificationDate = data.classificationDate;
    if (data.reclassificationDate !== undefined) backendData.reclassificationDate = data.reclassificationDate;
    
    // Map UUID fields
    if (data.ownerId !== undefined && isValidUUID(data.ownerId)) {
      backendData.informationOwnerId = data.ownerId;
    }
    if (data.custodianId !== undefined && isValidUUID(data.custodianId)) {
      backendData.assetCustodianId = data.custodianId;
    }
    if (data.businessUnit !== undefined && isValidUUID(data.businessUnit)) {
      backendData.businessUnitId = data.businessUnit;
    }
    
    // Map storage fields
    if (data.storageLocation !== undefined) backendData.assetLocation = data.storageLocation;
    if (data.storageType !== undefined) backendData.storageMedium = data.storageType;
    if (data.retentionPolicy !== undefined) backendData.retentionPeriod = data.retentionPolicy;
    
    // Map compliance requirements
    if (data.complianceRequirements !== undefined && Array.isArray(data.complianceRequirements)) {
      backendData.complianceRequirements = data.complianceRequirements;
    }

    const response = await apiClient.put(`/assets/information/${id}`, backendData);
    return response.data;
  },

  deleteInformationAsset: async (id: string): Promise<void> => {
    await apiClient.delete(`/assets/information/${id}`);
  },

  // Business Applications
  getBusinessApplications: async (params?: {
    search?: string;
    applicationType?: string;
    status?: string;
    criticalityLevel?: string;
    businessUnit?: string;
    ownerId?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    data: any[];
    total: number;
    page: number;
    limit: number;
  }> => {
    // Clean up params - remove undefined, null, and empty string values
    const cleanParams: Record<string, any> = {};
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          // Convert page and limit to numbers
          if (key === 'page' || key === 'limit') {
            cleanParams[key] = Number(value);
          } else {
            cleanParams[key] = value;
          }
        }
      });
    }
    const response = await apiClient.get('/assets/applications', { params: cleanParams, timeout: 10000 });
    return response.data;
  },

  getBusinessApplication: async (id: string): Promise<any> => {
    const response = await apiClient.get(`/assets/applications/${id}`);
    return response.data;
  },

  createBusinessApplication: async (data: any): Promise<any> => {
    // Helper function to check if a string is a valid UUID
    const isValidUUID = (str: string): boolean => {
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      return uuidRegex.test(str);
    };

    // Transform frontend data format to backend DTO format
    // Required field: applicationName
    if (!data.applicationName) {
      throw new Error('Application name is required');
    }

    const backendData: any = {
      applicationName: data.applicationName,
    };

    // Map optional fields
    if (data.applicationType) backendData.applicationType = data.applicationType;
    if (data.version) backendData.versionNumber = data.version;
    if (data.patchLevel) backendData.patchLevel = data.patchLevel;
    if (data.description || data.businessPurpose) backendData.businessPurpose = data.description || data.businessPurpose;
    
    // Map UUID fields
    if (data.ownerId && isValidUUID(data.ownerId)) {
      backendData.ownerId = data.ownerId;
    }
    if (data.businessUnit && isValidUUID(data.businessUnit)) {
      backendData.businessUnitId = data.businessUnit;
    }
    
    // Map data fields
    if (data.dataTypesProcessed && Array.isArray(data.dataTypesProcessed)) {
      backendData.dataProcessed = data.dataTypesProcessed;
    }
    if (data.dataClassification) backendData.dataClassification = data.dataClassification;
    
    // Map vendor fields
    if (data.vendor) backendData.vendorName = data.vendor;
    
    // Combine vendor contact fields into object
    if (data.vendorContact || data.vendorEmail || data.vendorPhone) {
      backendData.vendorContact = {
        name: data.vendorContact || data.vendor || '',
        email: data.vendorEmail || '',
        phone: data.vendorPhone || '',
      };
    }
    
    // Map license fields
    if (data.licenseType) backendData.licenseType = data.licenseType;
    if (data.licenseCount !== undefined) backendData.licenseCount = data.licenseCount;
    if (data.licenseExpiry) backendData.licenseExpiry = data.licenseExpiry;
    
    // Map hosting fields
    if (data.hostingType) backendData.hostingType = data.hostingType;
    if (data.hostingLocation) backendData.hostingLocation = data.hostingLocation;
    if (data.url) backendData.accessUrl = data.url;
    
    // Map security fields
    if (data.lastSecurityTestDate) backendData.lastSecurityTestDate = data.lastSecurityTestDate;
    if (data.authenticationMethod) backendData.authenticationMethod = data.authenticationMethod;
    
    // Map compliance and criticality
    if (data.complianceRequirements && Array.isArray(data.complianceRequirements)) {
      backendData.complianceRequirements = data.complianceRequirements;
    }
    if (data.criticalityLevel) backendData.criticalityLevel = data.criticalityLevel;

    console.log('[assetsApi] Creating business application with data:', JSON.stringify(backendData, null, 2));

    const response = await apiClient.post('/assets/applications', backendData);
    return response.data;
  },

  updateBusinessApplication: async (id: string, data: any): Promise<any> => {
    // Helper function to check if a string is a valid UUID
    const isValidUUID = (str: string): boolean => {
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      return uuidRegex.test(str);
    };

    // Transform frontend data format to backend DTO format (same as create)
    const backendData: any = {};

    if (data.applicationName !== undefined) backendData.applicationName = data.applicationName;
    if (data.applicationType !== undefined) backendData.applicationType = data.applicationType;
    if (data.version !== undefined) backendData.versionNumber = data.version;
    if (data.patchLevel !== undefined) backendData.patchLevel = data.patchLevel;
    if (data.description !== undefined || data.businessPurpose !== undefined) {
      backendData.businessPurpose = data.description || data.businessPurpose;
    }
    
    // Map UUID fields
    if (data.ownerId !== undefined && isValidUUID(data.ownerId)) {
      backendData.ownerId = data.ownerId;
    }
    if (data.businessUnit !== undefined && isValidUUID(data.businessUnit)) {
      backendData.businessUnitId = data.businessUnit;
    }
    
    // Map data fields
    if (data.dataTypesProcessed !== undefined && Array.isArray(data.dataTypesProcessed)) {
      backendData.dataProcessed = data.dataTypesProcessed;
    }
    if (data.dataClassification !== undefined) backendData.dataClassification = data.dataClassification;
    
    // Map vendor fields
    if (data.vendor !== undefined) backendData.vendorName = data.vendor;
    
    // Combine vendor contact fields into object
    if (data.vendorContact !== undefined || data.vendorEmail !== undefined || data.vendorPhone !== undefined) {
      backendData.vendorContact = {
        name: data.vendorContact || data.vendor || '',
        email: data.vendorEmail || '',
        phone: data.vendorPhone || '',
      };
    }
    
    // Map license fields
    if (data.licenseType !== undefined) backendData.licenseType = data.licenseType;
    if (data.licenseCount !== undefined) backendData.licenseCount = data.licenseCount;
    if (data.licenseExpiry !== undefined) backendData.licenseExpiry = data.licenseExpiry;
    
    // Map hosting fields
    if (data.hostingType !== undefined) backendData.hostingType = data.hostingType;
    if (data.hostingLocation !== undefined) backendData.hostingLocation = data.hostingLocation;
    if (data.url !== undefined) backendData.accessUrl = data.url;
    
    // Map security fields
    if (data.lastSecurityTestDate !== undefined) backendData.lastSecurityTestDate = data.lastSecurityTestDate;
    if (data.authenticationMethod !== undefined) backendData.authenticationMethod = data.authenticationMethod;
    
    // Map compliance and criticality
    if (data.complianceRequirements !== undefined && Array.isArray(data.complianceRequirements)) {
      backendData.complianceRequirements = data.complianceRequirements;
    }
    if (data.criticalityLevel !== undefined) backendData.criticalityLevel = data.criticalityLevel;

    const response = await apiClient.put(`/assets/applications/${id}`, backendData);
    return response.data;
  },

  deleteBusinessApplication: async (id: string): Promise<void> => {
    await apiClient.delete(`/assets/applications/${id}`);
  },

  // Software Assets
  getSoftwareAssets: async (params?: {
    search?: string;
    softwareType?: string;
    criticalityLevel?: string;
    vendor?: string;
    businessUnit?: string;
    ownerId?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    data: any[];
    total: number;
    page: number;
    limit: number;
  }> => {
    // Clean up params - remove undefined, null, and empty string values
    const cleanParams: Record<string, any> = {};
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          // Convert page and limit to numbers
          if (key === 'page' || key === 'limit') {
            cleanParams[key] = Number(value);
          } else {
            cleanParams[key] = value;
          }
        }
      });
    }
    const response = await apiClient.get('/assets/software', { params: cleanParams, timeout: 10000 });
    return response.data;
  },

  getSoftwareAsset: async (id: string): Promise<any> => {
    const response = await apiClient.get(`/assets/software/${id}`);
    return response.data;
  },

  createSoftwareAsset: async (data: any): Promise<any> => {
    // Helper function to check if a string is a valid UUID
    const isValidUUID = (str: string): boolean => {
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      return uuidRegex.test(str);
    };

    // Transform frontend data format to backend DTO format
    // Required field: softwareName
    if (!data.softwareName) {
      throw new Error('Software name is required');
    }

    const backendData: any = {
      softwareName: data.softwareName,
    };

    // Map optional fields
    if (data.softwareType) backendData.softwareType = data.softwareType;
    if (data.version) backendData.versionNumber = data.version;
    if (data.patchLevel) backendData.patchLevel = data.patchLevel;
    if (data.description || data.businessPurpose) backendData.businessPurpose = data.description || data.businessPurpose;
    
    // Map UUID fields
    if (data.ownerId && isValidUUID(data.ownerId)) {
      backendData.ownerId = data.ownerId;
    }
    if (data.businessUnit && isValidUUID(data.businessUnit)) {
      backendData.businessUnitId = data.businessUnit;
    }
    
    // Map vendor fields
    if (data.vendor) backendData.vendorName = data.vendor;
    
    // Combine vendor contact fields into object
    if (data.vendorContact || data.vendorEmail || data.vendorPhone) {
      backendData.vendorContact = {
        name: data.vendorContact || data.vendor || '',
        email: data.vendorEmail || '',
        phone: data.vendorPhone || '',
      };
    }
    
    // Map license fields
    if (data.licenseType) backendData.licenseType = data.licenseType;
    if (data.numberOfLicenses !== undefined) backendData.licenseCount = data.numberOfLicenses;
    if (data.licenseKey) backendData.licenseKey = data.licenseKey;
    if (data.licenseExpiryDate) backendData.licenseExpiry = data.licenseExpiryDate;
    if (data.installationCount !== undefined) backendData.installationCount = data.installationCount;
    
    // Map security fields
    if (data.lastSecurityTestDate) backendData.lastSecurityTestDate = data.lastSecurityTestDate;
    if (data.supportEndDate) backendData.supportEndDate = data.supportEndDate;
    
    // Map compliance requirements
    if (data.complianceRequirements && Array.isArray(data.complianceRequirements)) {
      backendData.complianceRequirements = data.complianceRequirements;
    }

    console.log('[assetsApi] Creating software asset with data:', JSON.stringify(backendData, null, 2));

    const response = await apiClient.post('/assets/software', backendData);
    return response.data;
  },

  updateSoftwareAsset: async (id: string, data: any): Promise<any> => {
    // Helper function to check if a string is a valid UUID
    const isValidUUID = (str: string): boolean => {
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      return uuidRegex.test(str);
    };

    // Transform frontend data format to backend DTO format (same as create)
    const backendData: any = {};

    if (data.softwareName !== undefined) backendData.softwareName = data.softwareName;
    if (data.softwareType !== undefined) backendData.softwareType = data.softwareType;
    if (data.version !== undefined) backendData.versionNumber = data.version;
    if (data.patchLevel !== undefined) backendData.patchLevel = data.patchLevel;
    if (data.description !== undefined || data.businessPurpose !== undefined) {
      backendData.businessPurpose = data.description || data.businessPurpose;
    }
    
    // Map UUID fields
    if (data.ownerId !== undefined && isValidUUID(data.ownerId)) {
      backendData.ownerId = data.ownerId;
    }
    if (data.businessUnit !== undefined && isValidUUID(data.businessUnit)) {
      backendData.businessUnitId = data.businessUnit;
    }
    
    // Map vendor fields
    if (data.vendor !== undefined) backendData.vendorName = data.vendor;
    
    // Combine vendor contact fields into object
    if (data.vendorContact !== undefined || data.vendorEmail !== undefined || data.vendorPhone !== undefined) {
      backendData.vendorContact = {
        name: data.vendorContact || data.vendor || '',
        email: data.vendorEmail || '',
        phone: data.vendorPhone || '',
      };
    }
    
    // Map license fields
    if (data.licenseType !== undefined) backendData.licenseType = data.licenseType;
    if (data.numberOfLicenses !== undefined) backendData.licenseCount = data.numberOfLicenses;
    if (data.licenseKey !== undefined) backendData.licenseKey = data.licenseKey;
    if (data.licenseExpiryDate !== undefined) backendData.licenseExpiry = data.licenseExpiryDate;
    if (data.installationCount !== undefined) backendData.installationCount = data.installationCount;
    
    // Map security fields
    if (data.lastSecurityTestDate !== undefined) backendData.lastSecurityTestDate = data.lastSecurityTestDate;
    if (data.supportEndDate !== undefined) backendData.supportEndDate = data.supportEndDate;
    
    // Map compliance requirements
    if (data.complianceRequirements !== undefined && Array.isArray(data.complianceRequirements)) {
      backendData.complianceRequirements = data.complianceRequirements;
    }

    const response = await apiClient.put(`/assets/software/${id}`, backendData);
    return response.data;
  },

  deleteSoftwareAsset: async (id: string): Promise<void> => {
    await apiClient.delete(`/assets/software/${id}`);
  },

  // Suppliers
  getSuppliers: async (params?: {
    search?: string;
    supplierType?: string;
    criticalityLevel?: string;
    businessUnit?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    data: any[];
    total: number;
    page: number;
    limit: number;
  }> => {
    // Return mock data during build time to prevent prerendering failures
    if (typeof window === 'undefined') {
      return {
        data: [],
        total: 0,
        page: params?.page || 1,
        limit: params?.limit || 20,
      };
    }

    // Clean up params - remove undefined, null, and empty string values
    const cleanParams: Record<string, any> = {};
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          // Convert page and limit to numbers
          if (key === 'page' || key === 'limit') {
            cleanParams[key] = Number(value);
          } else {
            cleanParams[key] = value;
          }
        }
      });
    }
    const response = await apiClient.get('/assets/suppliers', { params: cleanParams, timeout: 10000 });
    return response.data;
  },

  getSupplier: async (id: string): Promise<any> => {
    const response = await apiClient.get(`/assets/suppliers/${id}`);
    return response.data;
  },

  createSupplier: async (data: any): Promise<any> => {
    // Helper function to check if a string is a valid UUID
    const isValidUUID = (str: string): boolean => {
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      return uuidRegex.test(str);
    };

    // Transform frontend data format to backend DTO format
    // Required fields: uniqueIdentifier, supplierName
    if (!data.supplierName) {
      throw new Error('Supplier name is required');
    }

    const backendData: any = {
      supplierName: data.supplierName,
      // Generate unique identifier if not provided
      uniqueIdentifier: data.supplierIdentifier || data.uniqueIdentifier || `SUP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };

    // Map optional fields
    if (data.supplierType) backendData.supplierType = data.supplierType;
    if (data.description || data.businessPurpose) backendData.businessPurpose = data.description || data.businessPurpose;
    
    // Map UUID fields
    if (data.ownerId && isValidUUID(data.ownerId)) {
      backendData.ownerId = data.ownerId;
    }
    if (data.businessUnit && isValidUUID(data.businessUnit)) {
      backendData.businessUnitId = data.businessUnit;
    }
    
    // Map goods/services - convert string to array if needed
    if (data.goodsOrServicesProvided) {
      if (typeof data.goodsOrServicesProvided === 'string') {
        backendData.goodsServicesType = data.goodsOrServicesProvided.split(/[;,]/).map((s: string) => s.trim()).filter(Boolean);
      } else if (Array.isArray(data.goodsOrServicesProvided)) {
        backendData.goodsServicesType = data.goodsOrServicesProvided;
      }
    }
    
    if (data.criticalityLevel) backendData.criticalityLevel = data.criticalityLevel;
    
    // Map contract fields
    if (data.contractReference) backendData.contractReference = data.contractReference;
    if (data.contractStartDate) backendData.contractStartDate = data.contractStartDate;
    if (data.contractEndDate) backendData.contractEndDate = data.contractEndDate;
    if (data.contractValue !== undefined) backendData.contractValue = data.contractValue;
    if (data.currency) backendData.currency = data.currency;
    if (data.autoRenewal !== undefined) backendData.autoRenewal = data.autoRenewal;
    
    // Combine primary contact fields into object
    if (data.primaryContactName || data.primaryContactEmail || data.primaryContactPhone) {
      backendData.primaryContact = {
        name: data.primaryContactName || '',
        title: data.primaryContactTitle || '',
        email: data.primaryContactEmail || '',
        phone: data.primaryContactPhone || '',
      };
    }
    
    // Map secondary contact if provided
    if (data.secondaryContactName || data.secondaryContactEmail || data.secondaryContactPhone) {
      backendData.secondaryContact = {
        name: data.secondaryContactName || '',
        title: data.secondaryContactTitle || '',
        email: data.secondaryContactEmail || '',
        phone: data.secondaryContactPhone || '',
      };
    }
    
    // Map other fields
    if (data.taxId) backendData.taxId = data.taxId;
    if (data.registrationNumber) backendData.registrationNumber = data.registrationNumber;
    if (data.address) backendData.address = data.address;
    if (data.country) backendData.country = data.country;
    if (data.website) backendData.website = data.website;
    if (data.riskAssessmentDate) backendData.riskAssessmentDate = data.riskAssessmentDate;
    if (data.riskLevel) backendData.riskLevel = data.riskLevel;
    if (data.complianceCertifications && Array.isArray(data.complianceCertifications)) {
      backendData.complianceCertifications = data.complianceCertifications;
    }
    if (data.insuranceVerified !== undefined) backendData.insuranceVerified = data.insuranceVerified;
    if (data.backgroundCheckDate) backendData.backgroundCheckDate = data.backgroundCheckDate;
    if (data.performanceRating !== undefined) backendData.performanceRating = data.performanceRating;
    if (data.lastReviewDate) backendData.lastReviewDate = data.lastReviewDate;

    console.log('[assetsApi] Creating supplier with data:', JSON.stringify(backendData, null, 2));

    const response = await apiClient.post('/assets/suppliers', backendData);
    return response.data;
  },

  updateSupplier: async (id: string, data: any): Promise<any> => {
    // Helper function to check if a string is a valid UUID
    const isValidUUID = (str: string): boolean => {
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      return uuidRegex.test(str);
    };

    // Transform frontend data format to backend DTO format (same as create)
    const backendData: any = {};

    if (data.supplierName !== undefined) backendData.supplierName = data.supplierName;
    if (data.supplierIdentifier !== undefined || data.uniqueIdentifier !== undefined) {
      backendData.uniqueIdentifier = data.supplierIdentifier || data.uniqueIdentifier;
    }
    if (data.supplierType !== undefined) backendData.supplierType = data.supplierType;
    if (data.description !== undefined || data.businessPurpose !== undefined) {
      backendData.businessPurpose = data.description || data.businessPurpose;
    }
    
    // Map UUID fields
    if (data.ownerId !== undefined && isValidUUID(data.ownerId)) {
      backendData.ownerId = data.ownerId;
    }
    if (data.businessUnit !== undefined && isValidUUID(data.businessUnit)) {
      backendData.businessUnitId = data.businessUnit;
    }
    
    // Map goods/services
    if (data.goodsOrServicesProvided !== undefined) {
      if (typeof data.goodsOrServicesProvided === 'string') {
        backendData.goodsServicesType = data.goodsOrServicesProvided.split(/[;,]/).map((s: string) => s.trim()).filter(Boolean);
      } else if (Array.isArray(data.goodsOrServicesProvided)) {
        backendData.goodsServicesType = data.goodsOrServicesProvided;
      }
    }
    
    if (data.criticalityLevel !== undefined) backendData.criticalityLevel = data.criticalityLevel;
    
    // Map contract fields
    if (data.contractReference !== undefined) backendData.contractReference = data.contractReference;
    if (data.contractStartDate !== undefined) backendData.contractStartDate = data.contractStartDate;
    if (data.contractEndDate !== undefined) backendData.contractEndDate = data.contractEndDate;
    if (data.contractValue !== undefined) backendData.contractValue = data.contractValue;
    if (data.currency !== undefined) backendData.currency = data.currency;
    if (data.autoRenewal !== undefined) backendData.autoRenewal = data.autoRenewal;
    
    // Combine primary contact fields into object
    if (data.primaryContactName !== undefined || data.primaryContactEmail !== undefined || data.primaryContactPhone !== undefined) {
      backendData.primaryContact = {
        name: data.primaryContactName || '',
        title: data.primaryContactTitle || '',
        email: data.primaryContactEmail || '',
        phone: data.primaryContactPhone || '',
      };
    }
    
    // Map secondary contact
    if (data.secondaryContactName !== undefined || data.secondaryContactEmail !== undefined || data.secondaryContactPhone !== undefined) {
      backendData.secondaryContact = {
        name: data.secondaryContactName || '',
        title: data.secondaryContactTitle || '',
        email: data.secondaryContactEmail || '',
        phone: data.secondaryContactPhone || '',
      };
    }
    
    // Map other fields
    if (data.taxId !== undefined) backendData.taxId = data.taxId;
    if (data.registrationNumber !== undefined) backendData.registrationNumber = data.registrationNumber;
    if (data.address !== undefined) backendData.address = data.address;
    if (data.country !== undefined) backendData.country = data.country;
    if (data.website !== undefined) backendData.website = data.website;
    if (data.riskAssessmentDate !== undefined) backendData.riskAssessmentDate = data.riskAssessmentDate;
    if (data.riskLevel !== undefined) backendData.riskLevel = data.riskLevel;
    if (data.complianceCertifications !== undefined && Array.isArray(data.complianceCertifications)) {
      backendData.complianceCertifications = data.complianceCertifications;
    }
    if (data.insuranceVerified !== undefined) backendData.insuranceVerified = data.insuranceVerified;
    if (data.backgroundCheckDate !== undefined) backendData.backgroundCheckDate = data.backgroundCheckDate;
    if (data.performanceRating !== undefined) backendData.performanceRating = data.performanceRating;
    if (data.lastReviewDate !== undefined) backendData.lastReviewDate = data.lastReviewDate;

    const response = await apiClient.put(`/assets/suppliers/${id}`, backendData);
    return response.data;
  },

  deleteSupplier: async (id: string): Promise<void> => {
    await apiClient.delete(`/assets/suppliers/${id}`);
  },

  // Global Asset Search
  searchAssets: async (params?: {
    q?: string;
    type?: 'physical' | 'information' | 'application' | 'software' | 'supplier' | 'all';
    criticality?: string;
    businessUnit?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    data: Array<{
      id: string;
      type: 'physical' | 'information' | 'application' | 'software' | 'supplier';
      name: string;
      identifier: string;
      criticality?: string;
      owner?: string;
      businessUnit?: string;
      createdAt: string;
      updatedAt: string;
    }>;
    total: number;
    page: number;
    limit: number;
  }> => {
    // Clean up params - remove undefined, null, and empty string values
    const cleanParams: Record<string, any> = {};
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          // Convert page and limit to numbers
          if (key === 'page' || key === 'limit') {
            cleanParams[key] = Number(value);
          } else {
            cleanParams[key] = value;
          }
        }
      });
    }
    const response = await apiClient.get('/assets/search', { 
      params: cleanParams,
      timeout: 10000,
    });
    return response.data;
  },

  // Unified All Assets View
  getAllAssets: async (params?: {
    type?: 'physical' | 'information' | 'application' | 'software' | 'supplier' | 'all';
    criticality?: string;
    businessUnit?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    data: Array<{
      id: string;
      type: 'physical' | 'information' | 'application' | 'software' | 'supplier';
      name: string;
      identifier: string;
      criticality?: string;
      owner?: string;
      businessUnit?: string;
      createdAt: string;
      updatedAt: string;
    }>;
    total: number;
    page: number;
    limit: number;
  }> => {
    // Clean up params - remove undefined, null, and empty string values
    const cleanParams: Record<string, any> = {};
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          // Convert page and limit to numbers
          if (key === 'page' || key === 'limit') {
            cleanParams[key] = Number(value);
          } else {
            cleanParams[key] = value;
          }
        }
      });
    }
    const response = await apiClient.get('/assets', { 
      params: cleanParams,
      timeout: 10000,
    });
    return response.data;
  },

  // Asset Dependencies
  getAssetDependencies: async (
    assetType: 'physical' | 'information' | 'application' | 'software' | 'supplier',
    assetId: string,
  ): Promise<Array<{
    id: string;
    sourceAssetType: string;
    sourceAssetId: string;
    sourceAssetName: string;
    sourceAssetIdentifier: string;
    targetAssetType: string;
    targetAssetId: string;
    targetAssetName: string;
    targetAssetIdentifier: string;
    relationshipType: string;
    description?: string;
    createdAt: string;
    updatedAt: string;
  }>> => {
    const response = await apiClient.get(`/assets/${assetType}/${assetId}/dependencies`);
    return response.data;
  },

  getIncomingDependencies: async (
    assetType: 'physical' | 'information' | 'application' | 'software' | 'supplier',
    assetId: string,
  ): Promise<Array<{
    id: string;
    sourceAssetType: string;
    sourceAssetId: string;
    sourceAssetName: string;
    sourceAssetIdentifier: string;
    targetAssetType: string;
    targetAssetId: string;
    targetAssetName: string;
    targetAssetIdentifier: string;
    relationshipType: string;
    description?: string;
    createdAt: string;
    updatedAt: string;
  }>> => {
    const response = await apiClient.get(`/assets/${assetType}/${assetId}/dependencies/incoming`);
    return response.data;
  },

  createAssetDependency: async (
    assetType: 'physical' | 'information' | 'application' | 'software' | 'supplier',
    assetId: string,
    data: {
      targetAssetType: 'physical' | 'information' | 'application' | 'software' | 'supplier';
      targetAssetId: string;
      relationshipType: 'depends_on' | 'uses' | 'contains' | 'hosts' | 'processes' | 'stores' | 'other';
      description?: string;
    },
  ): Promise<any> => {
    const response = await apiClient.post(`/assets/${assetType}/${assetId}/dependencies`, data);
    return response.data;
  },

  deleteAssetDependency: async (dependencyId: string): Promise<void> => {
    await apiClient.delete(`/assets/dependencies/${dependencyId}`);
  },

  checkAssetDependencies: async (
    assetType: 'physical' | 'information' | 'application' | 'software' | 'supplier',
    assetId: string,
  ): Promise<{
    hasDependencies: boolean;
    outgoingCount: number;
    incomingCount: number;
    totalCount: number;
    outgoing: Array<{
      id: string;
      sourceAssetType: string;
      sourceAssetId: string;
      sourceAssetName: string;
      targetAssetType: string;
      targetAssetId: string;
      targetAssetName: string;
      relationshipType: string;
    }>;
    incoming: Array<{
      id: string;
      sourceAssetType: string;
      sourceAssetId: string;
      sourceAssetName: string;
      targetAssetType: string;
      targetAssetId: string;
      targetAssetName: string;
      relationshipType: string;
    }>;
  }> => {
    const response = await apiClient.get(`/assets/${assetType}/${assetId}/dependencies/check`);
    return response.data;
  },

  // Asset Audit Trail
  getAssetAuditTrail: async (
    assetType: 'physical' | 'information' | 'application' | 'software' | 'supplier',
    assetId: string,
    params?: {
      from?: string;
      to?: string;
      userId?: string;
      action?: 'create' | 'update' | 'delete';
      page?: number;
      limit?: number;
    },
  ): Promise<{
    data: Array<{
      id: string;
      assetType: string;
      assetId: string;
      action: 'create' | 'update' | 'delete';
      fieldName?: string;
      oldValue?: string;
      newValue?: string;
      changedBy?: {
        id: string;
        email: string;
        firstName?: string;
        lastName?: string;
      };
      changeReason?: string;
      createdAt: string;
    }>;
    total: number;
    page: number;
    limit: number;
  }> => {
    const cleanParams: Record<string, any> = {};
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          if (key === 'page' || key === 'limit') {
            cleanParams[key] = Number(value);
          } else {
            cleanParams[key] = value;
          }
        }
      });
    }
    try {
      const response = await apiClient.get(`/assets/${assetType}/${assetId}/audit`, {
        params: cleanParams,
        timeout: 10000,
      });
      return response.data;
    } catch (error: any) {
      console.error('API Error:', error.response?.data || error.message);
      // If 404, return empty result instead of throwing
      if (error.response?.status === 404) {
        return {
          data: [],
          total: 0,
          page: params?.page || 1,
          limit: params?.limit || 50,
        };
      }
      throw error;
    }
  },

  // Integration Management
  getIntegrations: async (): Promise<IntegrationConfig[]> => {
    const response = await apiClient.get<IntegrationConfig[]>('/assets/integrations');
    return response.data;
  },

  getIntegration: async (id: string): Promise<IntegrationConfig> => {
    const response = await apiClient.get<IntegrationConfig>(`/assets/integrations/${id}`);
    return response.data;
  },

  createIntegration: async (data: CreateIntegrationConfigData): Promise<IntegrationConfig> => {
    const response = await apiClient.post<IntegrationConfig>('/assets/integrations', data);
    return response.data;
  },

  updateIntegration: async (id: string, data: Partial<CreateIntegrationConfigData>): Promise<IntegrationConfig> => {
    const response = await apiClient.put<IntegrationConfig>(`/assets/integrations/${id}`, data);
    return response.data;
  },

  deleteIntegration: async (id: string): Promise<void> => {
    await apiClient.delete(`/assets/integrations/${id}`);
  },

  testIntegrationConnection: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.post<{ success: boolean; message: string }>(`/assets/integrations/${id}/test`);
    return response.data;
  },

  syncIntegration: async (id: string): Promise<any> => {
    const response = await apiClient.post(`/assets/integrations/${id}/sync`);
    return response.data;
  },

  getIntegrationSyncHistory: async (id: string, limit?: number): Promise<any[]> => {
    const response = await apiClient.get<any[]>(`/assets/integrations/${id}/sync-history`, {
      params: limit ? { limit } : undefined,
    });
    return response.data;
  },

  // Asset Field Configuration
  getFieldConfigs: async (assetType?: string): Promise<AssetFieldConfig[]> => {
    const response = await apiClient.get<AssetFieldConfig[]>('/assets/field-configs', {
      params: assetType ? { assetType } : undefined,
    });
    return response.data;
  },

  getFieldConfigsForForm: async (assetType: string): Promise<AssetFieldConfig[]> => {
    const response = await apiClient.get<AssetFieldConfig[]>(`/assets/field-configs/for-form/${assetType}`);
    return response.data;
  },

  getFieldConfig: async (id: string): Promise<AssetFieldConfig> => {
    const response = await apiClient.get<AssetFieldConfig>(`/assets/field-configs/${id}`);
    return response.data;
  },

  createFieldConfig: async (data: CreateAssetFieldConfigData): Promise<AssetFieldConfig> => {
    const response = await apiClient.post<AssetFieldConfig>('/assets/field-configs', data);
    return response.data;
  },

  updateFieldConfig: async (id: string, data: Partial<CreateAssetFieldConfigData>): Promise<AssetFieldConfig> => {
    const response = await apiClient.put<AssetFieldConfig>(`/assets/field-configs/${id}`, data);
    return response.data;
  },

  deleteFieldConfig: async (id: string): Promise<void> => {
    await apiClient.delete(`/assets/field-configs/${id}`);
  },

  validateFieldValue: async (data: {
    assetType: string;
    fieldName: string;
    value: any;
  }): Promise<{ valid: boolean; message?: string }> => {
    const response = await apiClient.post<{ valid: boolean; message?: string }>('/assets/field-configs/validate', data);
    return response.data;
  },

  // Bulk Operations
  bulkUpdate: async (
    assetType: 'physical' | 'information' | 'application' | 'software' | 'supplier',
    data: {
      assetIds: string[];
      ownerId?: string;
      criticalityLevel?: 'critical' | 'high' | 'medium' | 'low';
      complianceTags?: string[];
      businessUnit?: string;
      department?: string;
    },
  ): Promise<{ successful: number; failed: number; errors: Array<{ assetId: string; error: string }> }> => {
    const response = await apiClient.post<{ successful: number; failed: number; errors: Array<{ assetId: string; error: string }> }>(
      `/assets/bulk/${assetType}/update`,
      data,
    );
    return response.data;
  },

  bulkDelete: async (
    assetType: 'physical' | 'information' | 'application' | 'software' | 'supplier',
    assetIds: string[],
  ): Promise<{ successful: number; failed: number; errors: Array<{ assetId: string; error: string }> }> => {
    const response = await apiClient.post<{ successful: number; failed: number; errors: Array<{ assetId: string; error: string }> }>(
      `/assets/bulk/${assetType}/delete`,
      { assetIds },
    );
    return response.data;
  },

  // Asset Types
  getAssetTypes: async (category?: 'physical' | 'information' | 'application' | 'software' | 'supplier'): Promise<AssetType[]> => {
    const params = category ? { category } : undefined;
    const response = await apiClient.get<AssetType[]>('/assets/types', { params });
    return response.data;
  },

  getAssetType: async (id: string): Promise<AssetType> => {
    const response = await apiClient.get<AssetType>(`/assets/types/${id}`);
    return response.data;
  },
};

// Integration Types
export interface IntegrationConfig {
  id: string;
  name: string;
  integrationType: 'cmdb' | 'asset_management_system' | 'rest_api' | 'webhook';
  endpointUrl: string;
  authenticationType: 'api_key' | 'bearer_token' | 'basic_auth' | 'oauth2';
  fieldMapping?: Record<string, string>;
  syncInterval?: string;
  status: 'active' | 'inactive' | 'error';
  lastSyncError?: string;
  lastSyncAt?: Date;
  nextSyncAt?: Date;
  createdById: string;
  createdByName?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateIntegrationConfigData {
  name: string;
  integrationType: IntegrationConfig['integrationType'];
  endpointUrl: string;
  authenticationType: IntegrationConfig['authenticationType'];
  apiKey?: string;
  bearerToken?: string;
  username?: string;
  password?: string;
  fieldMapping?: Record<string, string>;
  syncInterval?: string;
  notes?: string;
}

// Asset Field Configuration Types
export interface AssetFieldConfig {
  id: string;
  assetType: 'physical' | 'information' | 'application' | 'software' | 'supplier';
  fieldName: string;
  displayName: string;
  fieldType: 'text' | 'number' | 'date' | 'boolean' | 'select' | 'multi_select' | 'textarea' | 'email' | 'url';
  isRequired: boolean;
  isEnabled: boolean;
  displayOrder?: number;
  validationRule?: string;
  validationMessage?: string;
  selectOptions?: string[];
  defaultValue?: string;
  helpText?: string;
  fieldDependencies?: Record<string, any>;
  createdById: string;
  createdByName?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateAssetFieldConfigData {
  assetType: AssetFieldConfig['assetType'];
  fieldName: string;
  displayName: string;
  fieldType: AssetFieldConfig['fieldType'];
  isRequired?: boolean;
  isEnabled?: boolean;
  displayOrder?: number;
  validationRule?: string;
  validationMessage?: string;
  selectOptions?: string[];
  defaultValue?: string;
  helpText?: string;
  fieldDependencies?: Record<string, any>;
}
