import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReportTemplate, ReportType, ReportFormat } from '../entities/report-template.entity';
import { ReportTemplateVersion } from '../entities/report-template-version.entity';
import { CreateReportTemplateDto } from '../dto/create-report-template.dto';
import { UpdateReportTemplateDto } from '../dto/update-report-template.dto';
import { forwardRef, Inject } from '@nestjs/common';
import { BusinessApplicationService } from './business-application.service';
import { SoftwareAssetService } from './software-asset.service';
import { InformationAssetService } from './information-asset.service';
import { SupplierService } from './supplier.service';
import { PhysicalAssetService } from './physical-asset.service';
import { EmailDistributionListService } from './email-distribution-list.service';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const XLSX = require('xlsx');

// Lazy load csv-stringify to avoid module loading errors at startup
function getStringify() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const csvStringifySync = require('csv-stringify/sync');
    return csvStringifySync.stringify || csvStringifySync;
  } catch (error) {
    console.error('Failed to load csv-stringify/sync:', error);
    throw new Error('CSV export functionality is not available');
  }
}

@Injectable()
export class ReportTemplateService {
  private readonly logger = new Logger(ReportTemplateService.name);

  constructor(
    @InjectRepository(ReportTemplate)
    private templateRepository: Repository<ReportTemplate>,
    @InjectRepository(ReportTemplateVersion)
    private versionRepository: Repository<ReportTemplateVersion>,
    @Inject(forwardRef(() => BusinessApplicationService))
    private businessApplicationService: BusinessApplicationService,
    @Inject(forwardRef(() => SoftwareAssetService))
    private softwareAssetService: SoftwareAssetService,
    @Inject(forwardRef(() => InformationAssetService))
    private informationAssetService: InformationAssetService,
    @Inject(forwardRef(() => SupplierService))
    private supplierService: SupplierService,
    @Inject(forwardRef(() => PhysicalAssetService))
    private physicalAssetService: PhysicalAssetService,
    private emailDistributionListService: EmailDistributionListService,
  ) {}

  async create(dto: CreateReportTemplateDto, userId: string): Promise<ReportTemplate> {
    const template = this.templateRepository.create({
      ...dto,
      createdById: userId,
      isActive: dto.isScheduled !== false,
      fieldSelection: dto.fieldSelection || [],
      version: 1,
      ...(dto.isShared !== undefined && { isShared: dto.isShared }),
      ...(dto.sharedWithUserIds !== undefined && { sharedWithUserIds: dto.sharedWithUserIds }),
      ...(dto.sharedWithTeamIds !== undefined && { sharedWithTeamIds: dto.sharedWithTeamIds }),
      ...(dto.isOrganizationWide !== undefined && { isOrganizationWide: dto.isOrganizationWide }),
    });

    if (dto.isScheduled) {
      template.nextRunAt = this.calculateNextRun(dto.scheduleFrequency, dto.scheduleTime, dto.scheduleCron);
    }

    const saved = await this.templateRepository.save(template);
    
    // Save initial version (only if versioning table exists)
    try {
      await this.saveVersion(saved, userId, 'Initial version');
    } catch (error: any) {
      // If versioning fails (e.g., table doesn't exist yet), log and continue
      this.logger.warn(`Versioning not available: ${error.message}`);
    }
    
    return saved;
  }

  async findAll(userId?: string): Promise<ReportTemplate[]> {
    try {
      // Don't load createdBy relation to avoid business_unit_id column error
      // Use raw query to handle missing columns gracefully
      const templates = await this.templateRepository
        .createQueryBuilder('template')
        .select([
          'template.id',
          'template.name',
          'template.description',
          'template.reportType',
          'template.format',
          'template.fieldSelection',
          'template.filters',
          'template.grouping',
          'template.isScheduled',
          'template.scheduleFrequency',
          'template.scheduleCron',
          'template.scheduleTime',
          'template.distributionListId',
          'template.isActive',
          'template.isSystemTemplate',
          'template.lastRunAt',
          'template.nextRunAt',
          'template.createdById',
          'template.createdAt',
          'template.updatedAt',
        ])
        .orderBy('template.createdAt', 'DESC')
        .getMany();
      
      // Filter templates based on sharing settings if userId is provided
      // Note: Sharing columns may not exist yet if migrations haven't run
      let filteredTemplates = templates;
      if (userId) {
        filteredTemplates = templates.filter(template => {
          // User's own templates
          if (template.createdById === userId) return true;
          // System templates are always visible
          if (template.isSystemTemplate) return true;
          // Organization-wide templates (if column exists)
          if ((template as any).isOrganizationWide === true) return true;
          // Shared templates (if column exists)
          if ((template as any).isShared === true) {
            // Check if shared with user
            const sharedWithUserIds = (template as any).sharedWithUserIds;
            if (sharedWithUserIds && Array.isArray(sharedWithUserIds) && sharedWithUserIds.includes(userId)) return true;
            // TODO: Check if shared with user's teams
          }
          return false;
        });
      }
      
      // Ensure fieldSelection is always an array
      return filteredTemplates.map(template => ({
        ...template,
        fieldSelection: template.fieldSelection || [],
      }));
    } catch (error: any) {
      this.logger.error(`Error fetching report templates: ${error?.message}`, error?.stack);
      throw new BadRequestException(`Failed to fetch report templates: ${error?.message}`);
    }
  }

  async findOne(id: string): Promise<ReportTemplate> {
    // Don't load createdBy relation to avoid business_unit_id column error
    // We don't need it for report generation
    const template = await this.templateRepository.findOne({
      where: { id },
      // relations: ['createdBy'], // Removed to avoid business_unit_id column error
    });

    if (!template) {
      throw new NotFoundException(`Report template with ID ${id} not found`);
    }

    return template;
  }

  async update(id: string, dto: UpdateReportTemplateDto, userId: string, versionComment?: string): Promise<ReportTemplate> {
    const template = await this.findOne(id);
    
    // Save current version before updating (only if version column exists)
    try {
      await this.saveVersion(template, userId, versionComment);
      // Increment version number
      if (template.version !== undefined) {
        template.version = (template.version || 1) + 1;
      }
    } catch (error: any) {
      // If versioning fails (e.g., table doesn't exist yet), log and continue
      this.logger.warn(`Versioning not available: ${error.message}`);
    }
    
    Object.assign(template, dto);

    if (dto.isScheduled !== undefined) {
      if (dto.isScheduled) {
        template.nextRunAt = this.calculateNextRun(
          dto.scheduleFrequency || template.scheduleFrequency,
          dto.scheduleTime || template.scheduleTime,
          dto.scheduleCron || template.scheduleCron,
        );
      } else {
        template.nextRunAt = null;
      }
    }

    return this.templateRepository.save(template);
  }

  private async saveVersion(template: ReportTemplate, userId: string, comment?: string): Promise<void> {
    try {
      const version = this.versionRepository.create({
        templateId: template.id,
        versionNumber: template.version || 1,
        name: template.name,
        description: template.description,
        reportType: template.reportType,
        format: template.format,
        fieldSelection: template.fieldSelection || [],
        filters: template.filters || {},
        grouping: template.grouping || {},
        isScheduled: template.isScheduled,
        scheduleFrequency: template.scheduleFrequency,
        scheduleCron: template.scheduleCron,
        scheduleTime: template.scheduleTime,
        distributionListId: template.distributionListId,
        isActive: template.isActive,
        versionComment: comment,
        createdById: userId,
      });
      await this.versionRepository.save(version);
    } catch (error: any) {
      this.logger.error(`Failed to save template version: ${error.message}`, error.stack);
      // Don't throw - versioning failure shouldn't prevent template update
    }
  }

  async getVersionHistory(templateId: string): Promise<ReportTemplateVersion[]> {
    const template = await this.findOne(templateId);
    const versions = await this.versionRepository.find({
      where: { templateId: template.id },
      order: { versionNumber: 'DESC' },
      relations: ['createdBy'],
    });
    return versions;
  }

  async restoreVersion(templateId: string, versionId: string, userId: string): Promise<ReportTemplate> {
    const template = await this.findOne(templateId);
    const version = await this.versionRepository.findOne({
      where: { id: versionId, templateId: template.id },
    });

    if (!version) {
      throw new NotFoundException(`Version ${versionId} not found for template ${templateId}`);
    }

    // Save current state as a version before restoring
    await this.saveVersion(template, userId, `Restored from version ${version.versionNumber}`);

    // Restore template from version
    template.name = version.name;
    template.description = version.description;
    template.reportType = version.reportType;
    template.format = version.format;
    template.fieldSelection = version.fieldSelection || [];
    template.filters = version.filters || {};
    template.grouping = version.grouping || {};
    template.isScheduled = version.isScheduled;
    template.scheduleFrequency = version.scheduleFrequency;
    template.scheduleCron = version.scheduleCron;
    template.scheduleTime = version.scheduleTime;
    template.distributionListId = version.distributionListId;
    template.isActive = version.isActive;
    if (template.version !== undefined) {
      template.version = (template.version || 1) + 1;
    }

    if (template.isScheduled) {
      template.nextRunAt = this.calculateNextRun(
        template.scheduleFrequency,
        template.scheduleTime,
        template.scheduleCron,
      );
    }

    return this.templateRepository.save(template);
  }

  async delete(id: string): Promise<void> {
    const template = await this.findOne(id);
    if (template.isSystemTemplate) {
      throw new BadRequestException('Cannot delete system templates. Create a copy to customize.');
    }
    await this.templateRepository.remove(template);
  }

  async previewReport(templateId: string): Promise<any[]> {
    try {
      const template = await this.findOne(templateId);
      
      this.logger.log(`Previewing report for template: ${template.name} (ID: ${templateId})`);

      let data: any[] = [];

      // Fetch data based on report type (same logic as generateReport)
      try {
        this.logger.log(`Fetching data for report type: ${template.reportType}`);
        switch (template.reportType) {
          case ReportType.ASSET_INVENTORY:
            this.logger.log('Calling generateAssetInventoryReport...');
            data = await this.generateAssetInventoryReport(template);
            this.logger.log(`Asset inventory report returned ${data.length} records`);
            break;
          case ReportType.COMPLIANCE_REPORT:
            this.logger.log('Calling generateComplianceReport...');
            data = await this.generateComplianceReport(template);
            break;
          case ReportType.SECURITY_TEST_REPORT:
            this.logger.log('Calling generateSecurityTestReport...');
            data = await this.generateSecurityTestReport(template);
            break;
          case ReportType.SOFTWARE_INVENTORY:
            this.logger.log('Calling generateSoftwareInventoryReport...');
            data = await this.generateSoftwareInventoryReport(template);
            break;
          case ReportType.CONTRACT_EXPIRATION:
            this.logger.log('Calling generateContractExpirationReport...');
            data = await this.generateContractExpirationReport(template);
            break;
          case ReportType.SUPPLIER_CRITICALITY:
            this.logger.log('Calling generateSupplierCriticalityReport...');
            data = await this.generateSupplierCriticalityReport(template);
            break;
          default:
            throw new BadRequestException(`Unsupported report type: ${template.reportType}`);
        }

        this.logger.log(`Fetched ${data.length} records for preview`);
      } catch (dataError: any) {
        this.logger.error(`Error fetching data for report type ${template.reportType}: ${dataError.message}`, dataError.stack);
        throw new BadRequestException(`Failed to fetch report data: ${dataError.message}`);
      }

      // Validate data structure
      if (!Array.isArray(data)) {
        this.logger.error(`Data is not an array, got: ${typeof data}`);
        throw new BadRequestException('Report data must be an array');
      }

      // Helper function to get user display name
      const getUserDisplayName = (user: any): string => {
        if (!user) return '';
        if (user.firstName && user.lastName) {
          return `${user.firstName} ${user.lastName}`;
        }
        return user.email || '';
      };

      // Transform data: replace IDs with names (same as generateReport)
      data = data.map(item => {
        const transformed: any = { ...item };
        
        // Handle ownerId
        if (item.ownerId !== undefined) {
          if (item.owner) {
            transformed.ownerId = getUserDisplayName(item.owner);
          } else if (item.ownerId) {
            transformed.ownerId = item.ownerId;
          }
        }
        
        // Handle informationOwnerId
        if (item.informationOwnerId !== undefined) {
          if (item.informationOwner) {
            transformed.informationOwnerId = getUserDisplayName(item.informationOwner);
          } else if (item.informationOwnerId) {
            transformed.informationOwnerId = item.informationOwnerId;
          }
        }
        
        // Handle assetCustodianId
        if (item.assetCustodianId !== undefined) {
          if (item.assetCustodian) {
            transformed.assetCustodianId = getUserDisplayName(item.assetCustodian);
          } else if (item.assetCustodianId) {
            transformed.assetCustodianId = item.assetCustodianId;
          }
        }
        
        // Handle businessUnitId
        if (item.businessUnitId !== undefined) {
          if (item.businessUnit) {
            transformed.businessUnitId = item.businessUnit.name || '';
          } else if (item.businessUnitId) {
            transformed.businessUnitId = item.businessUnitId;
          }
        }
        
        // Clean up nested objects
        delete transformed.owner;
        delete transformed.informationOwner;
        delete transformed.assetCustodian;
        delete transformed.businessUnit;
        
        return transformed;
      });

      // Field name mapping
      const fieldNameMap: Record<string, string> = {
        ownerId: 'Owner',
        informationOwnerId: 'Information Owner',
        assetCustodianId: 'Asset Custodian',
        businessUnitId: 'Business Unit',
        assetTypeId: 'Asset Type',
        uniqueIdentifier: 'Unique Identifier',
        assetDescription: 'Asset Description',
        criticalityLevel: 'Criticality Level',
        physicalLocation: 'Physical Location',
        businessPurpose: 'Business Purpose',
        networkApprovalStatus: 'Network Approval Status',
        connectivityStatus: 'Connectivity Status',
        lastConnectivityCheck: 'Last Connectivity Check',
        purchaseDate: 'Purchase Date',
        warrantyExpiry: 'Warranty Expiry',
        complianceRequirements: 'Compliance Requirements',
      };

      // Apply field selection
      if (template.fieldSelection && Array.isArray(template.fieldSelection) && template.fieldSelection.length > 0) {
        this.logger.log(`Applying field selection: ${template.fieldSelection.length} fields selected`);
        data = data.map((item) => {
          const filtered: any = {};
          template.fieldSelection.forEach(field => {
            const columnName = fieldNameMap[field] || field;
            if (field in item) {
              filtered[columnName] = item[field];
            } else {
              filtered[columnName] = '';
            }
          });
          return filtered;
        });
      } else {
        // If no field selection, include all fields with renamed headers
        this.logger.log('No field selection specified, including all fields');
        data = data.map(item => {
          const renamed: any = {};
          Object.keys(item).forEach(key => {
            const newKey = fieldNameMap[key] || key;
            renamed[newKey] = item[key];
          });
          return renamed;
        });
      }

      // Limit preview to first 100 rows for performance
      const MAX_PREVIEW_ROWS = 100;
      if (data.length > MAX_PREVIEW_ROWS) {
        this.logger.log(`Preview limited to first ${MAX_PREVIEW_ROWS} rows (total: ${data.length})`);
        return data.slice(0, MAX_PREVIEW_ROWS);
      }

      return data;
    } catch (error: any) {
      this.logger.error(`Error in previewReport: ${error.message}`, error.stack);
      throw error;
    }
  }

  async generateReport(templateId: string): Promise<{ buffer: Buffer; filename: string; contentType: string }> {
    try {
      const template = await this.findOne(templateId);
      
      // Note: We allow generating reports from inactive templates manually
      // isActive is mainly for scheduled reports
      if (!template.isActive) {
        this.logger.warn(`Generating report from inactive template: ${template.name}`);
      }
      
      this.logger.log(`Generating report for template: ${template.name} (ID: ${templateId})`);
      this.logger.log(`Template config: type=${template.reportType}, format=${template.format || 'excel'}, fields=${template.fieldSelection?.length || 0}, filters=${JSON.stringify(template.filters || {})}`);
      
      this.logger.log(`Generating report for template: ${template.name} (${template.reportType}), format: ${template.format || 'excel'}`);

      let data: any[] = [];

      // Fetch data based on report type
      try {
        this.logger.log(`Fetching data for report type: ${template.reportType}`);
        switch (template.reportType) {
          case ReportType.ASSET_INVENTORY:
            this.logger.log('Calling generateAssetInventoryReport...');
            data = await this.generateAssetInventoryReport(template);
            this.logger.log(`Asset inventory report returned ${data.length} records`);
            if (data.length > 0) {
              this.logger.log(`Sample record keys: ${Object.keys(data[0]).slice(0, 10).join(', ')}...`);
            }
            break;
          case ReportType.COMPLIANCE_REPORT:
            this.logger.log('Calling generateComplianceReport...');
            data = await this.generateComplianceReport(template);
            break;
          case ReportType.SECURITY_TEST_REPORT:
            this.logger.log('Calling generateSecurityTestReport...');
            data = await this.generateSecurityTestReport(template);
            break;
          case ReportType.SOFTWARE_INVENTORY:
            this.logger.log('Calling generateSoftwareInventoryReport...');
            data = await this.generateSoftwareInventoryReport(template);
            break;
          case ReportType.CONTRACT_EXPIRATION:
            this.logger.log('Calling generateContractExpirationReport...');
            data = await this.generateContractExpirationReport(template);
            break;
          case ReportType.SUPPLIER_CRITICALITY:
            this.logger.log('Calling generateSupplierCriticalityReport...');
            data = await this.generateSupplierCriticalityReport(template);
            break;
          default:
            throw new BadRequestException(`Unsupported report type: ${template.reportType}`);
        }
        this.logger.log(`Fetched ${data.length} records for report`);
        if (data.length > 0) {
          this.logger.log(`First record sample: ${JSON.stringify(Object.fromEntries(Object.entries(data[0]).slice(0, 5)))}`);
        }
      } catch (dataError: any) {
        this.logger.error(`Error fetching data for report type ${template.reportType}: ${dataError.message}`, dataError.stack);
        throw new BadRequestException(`Failed to fetch report data: ${dataError.message}`);
      }

      // Validate data structure
      if (!Array.isArray(data)) {
        this.logger.error(`Data is not an array, got: ${typeof data}`);
        throw new BadRequestException('Report data must be an array');
      }

      // Helper function to get user display name
      const getUserDisplayName = (user: any): string => {
        if (!user) return '';
        if (user.firstName && user.lastName) {
          return `${user.firstName} ${user.lastName}`;
        }
        return user.email || '';
      };

      // Transform data: replace IDs with names for owner and business unit
      data = data.map(item => {
        const transformed: any = { ...item };
        
        // Handle ownerId (for physical assets, business applications, software assets)
        if (item.ownerId !== undefined) {
          if (item.owner) {
            transformed.ownerId = getUserDisplayName(item.owner);
          } else if (item.ownerId) {
            transformed.ownerId = item.ownerId; // Keep ID if no owner object loaded
          }
        }
        
        // Handle informationOwnerId (for information assets)
        if (item.informationOwnerId !== undefined) {
          if (item.informationOwner) {
            transformed.informationOwnerId = getUserDisplayName(item.informationOwner);
          } else if (item.informationOwnerId) {
            transformed.informationOwnerId = item.informationOwnerId;
          }
        }
        
        // Handle assetCustodianId (for information assets)
        if (item.assetCustodianId !== undefined) {
          if (item.assetCustodian) {
            transformed.assetCustodianId = getUserDisplayName(item.assetCustodian);
          } else if (item.assetCustodianId) {
            transformed.assetCustodianId = item.assetCustodianId;
          }
        }
        
        // Handle businessUnitId (for all asset types)
        if (item.businessUnitId !== undefined) {
          if (item.businessUnit) {
            transformed.businessUnitId = item.businessUnit.name || '';
          } else if (item.businessUnitId) {
            transformed.businessUnitId = item.businessUnitId; // Keep ID if no business unit object loaded
          }
        }
        
        // Clean up nested objects (they're not needed in the export)
        delete transformed.owner;
        delete transformed.informationOwner;
        delete transformed.assetCustodian;
        delete transformed.businessUnit;
        
        return transformed;
      });

      // Field name mapping for better column headers
      const fieldNameMap: Record<string, string> = {
        ownerId: 'Owner',
        informationOwnerId: 'Information Owner',
        assetCustodianId: 'Asset Custodian',
        businessUnitId: 'Business Unit',
        assetTypeId: 'Asset Type',
        uniqueIdentifier: 'Unique Identifier',
        assetDescription: 'Asset Description',
        criticalityLevel: 'Criticality Level',
        physicalLocation: 'Physical Location',
        businessPurpose: 'Business Purpose',
        networkApprovalStatus: 'Network Approval Status',
        connectivityStatus: 'Connectivity Status',
        lastConnectivityCheck: 'Last Connectivity Check',
        purchaseDate: 'Purchase Date',
        warrantyExpiry: 'Warranty Expiry',
        complianceRequirements: 'Compliance Requirements',
      };

      this.logger.log(`Before field selection: ${data.length} records`);
      if (data.length > 0) {
        const sampleKeys = Object.keys(data[0]);
        this.logger.log(`Sample record has ${sampleKeys.length} fields: ${sampleKeys.slice(0, 10).join(', ')}${sampleKeys.length > 10 ? '...' : ''}`);
      }

      // Apply field selection
      // Empty array or null means "all fields"
      if (template.fieldSelection && Array.isArray(template.fieldSelection) && template.fieldSelection.length > 0) {
        this.logger.log(`Applying field selection: ${template.fieldSelection.length} fields selected: ${template.fieldSelection.slice(0, 10).join(', ')}${template.fieldSelection.length > 10 ? '...' : ''}`);
        data = data.map((item, index) => {
          const filtered: any = {};
          template.fieldSelection.forEach(field => {
            // Use mapped name if available, otherwise use original field name
            const columnName = fieldNameMap[field] || field;
            // Only include field if it exists in the item
            if (field in item) {
              filtered[columnName] = item[field];
            } else {
              // Field doesn't exist, set to empty string
              filtered[columnName] = '';
            }
          });
          return filtered;
        });
        if (data.length > 0) {
          this.logger.log(`After field selection: ${data.length} records, ${Object.keys(data[0]).length} columns`);
        }
      } else {
        // If no field selection (empty array or null), include all fields with renamed headers
        this.logger.log('No field selection specified, including all fields');
        data = data.map(item => {
          const renamed: any = {};
          Object.keys(item).forEach(key => {
            const newKey = fieldNameMap[key] || key;
            renamed[newKey] = item[key];
          });
          return renamed;
        });
        if (data.length > 0) {
          this.logger.log(`All fields included: ${data.length} records, ${Object.keys(data[0]).length} columns`);
        }
      }

      // Limit data size to prevent memory issues (Excel has row limits anyway)
      const MAX_ROWS = 100000; // Excel 2007+ supports up to 1,048,576 rows, but we'll limit for performance
      if (data.length > MAX_ROWS) {
        this.logger.warn(`Data has ${data.length} rows, limiting to ${MAX_ROWS} for Excel export`);
        data = data.slice(0, MAX_ROWS);
      }

      // Generate file based on format
      const format = template.format || ReportFormat.EXCEL;
      const dateStr = new Date().toISOString().split('T')[0];
      const sanitizedName = template.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      
      try {
        switch (format) {
          case ReportFormat.EXCEL:
            return this.generateExcelFile(data, `${sanitizedName}-${dateStr}`, template);
          case ReportFormat.CSV:
            return this.generateCSVFile(data, `${sanitizedName}-${dateStr}`);
          case ReportFormat.PDF:
            // For PDF, we'll generate a simple CSV-like text format
            // In production, you might want to use a proper PDF library like pdfkit
            return this.generateCSVFile(data, `${sanitizedName}-${dateStr}`, 'application/pdf');
          default:
            return this.generateExcelFile(data, `${sanitizedName}-${dateStr}`, template);
        }
      } catch (fileError: any) {
        this.logger.error(`Error generating file: ${fileError.message}`, fileError.stack);
        throw new BadRequestException(`Failed to generate report file: ${fileError.message}`);
      }
    } catch (error: any) {
      this.logger.error(`Error in generateReport: ${error.message}`, error.stack);
      throw error;
    }
  }

  private generateExcelFile(
    data: any[],
    baseFilename: string,
    _template?: ReportTemplate,
  ): { buffer: Buffer; filename: string; contentType: string } {
    // Keep this implementation intentionally simple and close to the XLSX docs,
    // to avoid generating corrupted files.
    try {
      if (!XLSX || !XLSX.utils) {
        this.logger.error('XLSX library is not available');
        throw new BadRequestException('Excel generation library is not available');
      }

      if (!Array.isArray(data)) {
        this.logger.error('Excel generation received non-array data');
        throw new BadRequestException('Invalid data format: expected array');
      }

      // If there is no data, return a minimal valid workbook
      if (data.length === 0) {
        const worksheet = XLSX.utils.json_to_sheet([{ message: 'No data available' }]);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');
        const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' }) as Buffer;
        return {
          buffer: Buffer.isBuffer(buffer) ? buffer : Buffer.from(buffer),
          filename: `${baseFilename}.xlsx`,
          contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        };
      }

      this.logger.log(`Generating Excel (simple) with ${data.length} rows`);

      // Clean data: ensure all values are primitives (string, number, boolean, null, undefined)
      // XLSX can't handle complex objects, arrays, or Date objects directly
      const cleanedData = data.map((item) => {
        const cleaned: any = {};
        Object.keys(item).forEach((key) => {
          const value = item[key];
          
          // Handle null/undefined
          if (value === null || value === undefined) {
            cleaned[key] = '';
            return;
          }
          
          // Handle Date objects
          if (value instanceof Date) {
            cleaned[key] = isNaN(value.getTime()) ? '' : value.toISOString();
            return;
          }
          
          // Handle arrays
          if (Array.isArray(value)) {
            cleaned[key] = value.length === 0 ? '' : value.join(', ');
            return;
          }
          
          // Handle objects (convert to JSON string, but limit length)
          if (typeof value === 'object') {
            try {
              const jsonStr = JSON.stringify(value);
              cleaned[key] = jsonStr.length > 32700 ? jsonStr.substring(0, 32700) + '...' : jsonStr;
            } catch {
              cleaned[key] = String(value).substring(0, 32700);
            }
            return;
          }
          
          // Handle primitives (string, number, boolean)
          if (typeof value === 'string') {
            // Excel cell limit is 32,767 characters
            cleaned[key] = value.length > 32700 ? value.substring(0, 32700) + '...' : value;
          } else if (typeof value === 'number') {
            // Check for NaN or Infinity
            cleaned[key] = isNaN(value) || !isFinite(value) ? '' : value;
          } else {
            // boolean or other primitives
            cleaned[key] = value;
          }
        });
        return cleaned;
      });

      // XLSX can handle plain JS objects with primitive values
      const worksheet = XLSX.utils.json_to_sheet(cleanedData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');

      const buffer = XLSX.write(workbook, {
        type: 'buffer',
        bookType: 'xlsx',
      }) as Buffer;

      const finalBuffer = Buffer.isBuffer(buffer) ? buffer : Buffer.from(buffer);

      return {
        buffer: finalBuffer,
        filename: `${baseFilename}.xlsx`,
        contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      };
    } catch (error: any) {
      this.logger.error(`Failed to generate Excel file (simple): ${error.message}`, error.stack);
      throw new BadRequestException(`Failed to generate Excel file: ${error.message}`);
    }
  }

  private generateCSVFile(data: any[], baseFilename: string, contentType?: string): { buffer: Buffer; filename: string; contentType: string } {
    try {
      if (!data || data.length === 0) {
        const emptyCsv = 'No data available\n';
        return {
          buffer: Buffer.from(emptyCsv, 'utf-8'),
          filename: `${baseFilename}.csv`,
          contentType: contentType || 'text/csv; charset=utf-8',
        };
      }

      this.logger.log(`Generating CSV file with ${data.length} rows`);
      const stringify = getStringify();
      const csvContent = stringify(data, { header: true });
      const buffer = Buffer.from(csvContent, 'utf-8');
      
      this.logger.log(`CSV file generated successfully, size: ${buffer.length} bytes`);
      return {
        buffer,
        filename: `${baseFilename}.csv`,
        contentType: contentType || 'text/csv; charset=utf-8',
      };
    } catch (error: any) {
      this.logger.error(`Failed to generate CSV file: ${error.message}`, error.stack);
      throw new BadRequestException(`Failed to generate CSV file: ${error.message}`);
    }
  }

  private async generateAssetInventoryReport(template: ReportTemplate): Promise<any[]> {
    try {
      this.logger.log('Fetching physical assets...');
      const result = await this.physicalAssetService.findAll({ page: 1, limit: 10000 });
      this.logger.log(`Found ${result?.data?.length || 0} physical assets`);
      return result.data || [];
    } catch (error: any) {
      this.logger.error(`Error in generateAssetInventoryReport: ${error.message}`, error.stack);
      throw error;
    }
  }

  private async generateComplianceReport(template: ReportTemplate): Promise<any[]> {
    try {
      this.logger.log(`Fetching compliance report with requirement: ${template.filters?.complianceRequirement || 'all'}`);
      const report = await this.informationAssetService.getComplianceReport(
        template.filters?.complianceRequirement,
      );
      this.logger.log(`Found ${Array.isArray(report) ? report.length : 0} compliance records`);
      // getComplianceReport returns an array directly, not wrapped in { data }
      return Array.isArray(report) ? report : [];
    } catch (error: any) {
      this.logger.error(`Error in generateComplianceReport: ${error.message}`, error.stack);
      throw error;
    }
  }

  private async generateSecurityTestReport(template: ReportTemplate): Promise<any[]> {
    // Fetch applications/software with security test results
    const result = await this.businessApplicationService.findAll({ page: 1, limit: 10000 });
    return result.data || [];
  }

  private async generateSoftwareInventoryReport(template: ReportTemplate): Promise<any[]> {
    const report = await this.softwareAssetService.getInventoryReport(
      template.grouping?.groupBy || 'none',
    );
    // getInventoryReport returns an object with summary and grouped data
    // Flatten the grouped data for export
    const allSoftware: any[] = [];
    if (report.grouped) {
      Object.values(report.grouped).forEach((group: any) => {
        if (Array.isArray(group)) {
          allSoftware.push(...group);
        }
      });
    }
    if (report.unlicensed && Array.isArray(report.unlicensed)) {
      allSoftware.push(...report.unlicensed);
    }
    return allSoftware;
  }

  private async generateContractExpirationReport(template: ReportTemplate): Promise<any[]> {
    const days = template.filters?.days || 90;
    const report = await this.supplierService.getExpiringContracts(days);
    // getExpiringContracts returns an array directly
    return Array.isArray(report) ? report : [];
  }

  private async generateSupplierCriticalityReport(template: ReportTemplate): Promise<any[]> {
    const report = await this.supplierService.getCriticalSuppliersReport();
    // getCriticalSuppliersReport returns an array directly
    return Array.isArray(report) ? report : [];
  }

  async sendScheduledReport(templateId: string): Promise<void> {
    const template = await this.findOne(templateId);

    if (!template.isScheduled || !template.isActive) {
      return;
    }

    try {
      const { buffer, filename } = await this.generateReport(templateId);

      if (template.distributionListId) {
        const distributionList = await this.emailDistributionListService.findOne(
          template.distributionListId,
        );

        // Get all email addresses
        const emailAddresses = [
          ...distributionList.emailAddresses,
          ...(distributionList.users?.map(u => u.email) || []),
        ];

        // Send email with report attachment
        // Note: Email sending implementation depends on your email service setup
        // This is a placeholder - implement actual email sending with attachments
        await this.emailDistributionListService.sendReportEmail(
          emailAddresses,
          template.name,
          buffer,
          template.format,
          filename,
        );
      }

      // Update last run and next run times
      template.lastRunAt = new Date();
      template.nextRunAt = this.calculateNextRun(
        template.scheduleFrequency,
        template.scheduleTime,
        template.scheduleCron,
      );
      await this.templateRepository.save(template);

      this.logger.log(`Scheduled report ${template.name} sent successfully`);
    } catch (error) {
      this.logger.error(`Failed to send scheduled report ${template.name}:`, error);
      throw error;
    }
  }

  private calculateNextRun(
    frequency: string | null,
    time: string | null,
    cron: string | null,
  ): Date | null {
    if (cron) {
      // Parse cron expression and calculate next run
      // For simplicity, using basic calculation
      return new Date(Date.now() + 24 * 60 * 60 * 1000); // Default to tomorrow
    }

    if (!frequency || !time) {
      return null;
    }

    const now = new Date();
    const [hours, minutes] = time.split(':').map(Number);
    const nextRun = new Date();
    nextRun.setHours(hours, minutes, 0, 0);

    switch (frequency) {
      case 'daily':
        if (nextRun <= now) {
          nextRun.setDate(nextRun.getDate() + 1);
        }
        break;
      case 'weekly':
        nextRun.setDate(nextRun.getDate() + 7);
        break;
      case 'monthly':
        nextRun.setMonth(nextRun.getMonth() + 1);
        break;
      case 'quarterly':
        nextRun.setMonth(nextRun.getMonth() + 3);
        break;
      case 'yearly':
        nextRun.setFullYear(nextRun.getFullYear() + 1);
        break;
    }

    return nextRun;
  }
}

