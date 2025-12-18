import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { config } from 'dotenv';
import { ReportTemplate } from '../asset/entities/report-template.entity';
import { ReportTemplateService } from '../asset/services/report-template.service';
import * as fs from 'fs';
import * as path from 'path';

config();

async function testReportDownload() {
  // Create DataSource with naming strategy
  const dbHost = process.env.DB_HOST || 'localhost';
  const dbPort = parseInt(process.env.DB_PORT || '5432');
  const dbUser = process.env.POSTGRES_USER || 'postgres';
  const dbPassword = process.env.POSTGRES_PASSWORD || 'password';
  const dbName = process.env.POSTGRES_DB || 'grc_platform';

  const dataSource = new DataSource({
    type: 'postgres',
    host: dbHost,
    port: dbPort,
    username: dbUser,
    password: dbPassword,
    database: dbName,
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: false,
    logging: false,
    namingStrategy: new SnakeNamingStrategy(),
  });

  try {
    await dataSource.initialize();
    console.log('Database connected');

    // Find the "Audit Trail Report (Copy)" template
    const templateRepository = dataSource.getRepository(ReportTemplate);
    const templates = await templateRepository.find({
      where: { name: 'Audit Trail Report (Copy)' },
    });

    if (templates.length === 0) {
      console.log('Template "Audit Trail Report (Copy)" not found. Available templates:');
      const allTemplates = await templateRepository.find();
      allTemplates.forEach((t) => {
        console.log(`  - ${t.name} (${t.id})`);
      });
      await dataSource.destroy();
      return;
    }

    const template = templates[0];
    console.log(`Found template: ${template.name} (${template.id})`);
    
    // Parse JSON fields safely
    let fieldSelection: any = [];
    let filters: any = {};
    try {
      if (template.fieldSelection) {
        const fs = typeof template.fieldSelection === 'string' 
          ? template.fieldSelection 
          : JSON.stringify(template.fieldSelection);
        if (fs && fs !== 'undefined' && fs !== 'null') {
          fieldSelection = JSON.parse(fs);
        }
      }
    } catch (e) {
      console.warn('Could not parse fieldSelection:', e);
    }
    
    try {
      if (template.filters) {
        const f = typeof template.filters === 'string' 
          ? template.filters 
          : JSON.stringify(template.filters);
        if (f && f !== 'undefined' && f !== 'null') {
          filters = JSON.parse(f);
        }
      }
    } catch (e) {
      console.warn('Could not parse filters:', e);
    }
    
    console.log(`Template config:`, {
      reportType: template.reportType,
      format: template.format,
      fieldSelection,
      filters,
    });

    // Create a minimal service instance to generate the report
    // We need to mock the dependencies with test data
    const physicalAssetService = {
      findAll: async () => ({ 
        data: [
          {
            id: 'test-1',
            uniqueIdentifier: 'ASSET-001',
            assetDescription: 'Test Asset 1',
            assetTypeId: 'type-1',
            manufacturer: 'Test Manufacturer',
            model: 'Model X',
            serialNumber: 'SN123456',
            assetTag: 'TAG-001',
            ownerId: 'user-1',
            businessUnitId: 'bu-1',
            physicalLocation: 'Office A',
            criticalityLevel: 'high',
          },
          {
            id: 'test-2',
            uniqueIdentifier: 'ASSET-002',
            assetDescription: 'Test Asset 2',
            assetTypeId: 'type-2',
            manufacturer: 'Another Manufacturer',
            model: 'Model Y',
            serialNumber: 'SN789012',
            assetTag: 'TAG-002',
            ownerId: 'user-2',
            businessUnitId: 'bu-2',
            physicalLocation: 'Office B',
            criticalityLevel: 'medium',
          },
        ] 
      }),
    } as any;

    const reportTemplateService = new ReportTemplateService(
      templateRepository,
      physicalAssetService,
      {} as any, // informationAssetService
      {} as any, // businessApplicationService
      {} as any, // softwareAssetService
      {} as any, // supplierService
      {} as any, // emailDistributionListService
    );

    console.log('Generating report...');
    console.log(`Note: Template format is ${template.format}, but we'll test Excel generation`);
    
    // Temporarily change format to excel for testing
    const originalFormat = template.format;
    template.format = 'excel' as any;
    
    try {
      const result = await reportTemplateService.generateReport(template.id);
      
      console.log(`Report generated: ${result.filename}, size: ${result.buffer.length} bytes`);
      console.log(`Content type: ${result.contentType}`);
      
      // Save to file
      const outputPath = path.join(__dirname, '../../test-report-output.xlsx');
      fs.writeFileSync(outputPath, result.buffer);
      console.log(`Report saved to: ${outputPath}`);
      
      // Check file signature
      const signature = result.buffer.slice(0, 2).toString('hex');
      console.log(`File signature: ${signature} (expected: 504b for ZIP/Excel)`);
      
      if (signature !== '504b') {
        console.error('ERROR: File signature is invalid! The file is corrupted.');
        console.error(`First 100 bytes (hex): ${result.buffer.slice(0, 100).toString('hex')}`);
        console.error(`First 100 bytes (ascii): ${result.buffer.slice(0, 100).toString('ascii')}`);
      } else {
        console.log('✓ File signature is valid.');
      }
      
      // Check file size
      if (result.buffer.length < 100) {
        console.error(`WARNING: File is very small (${result.buffer.length} bytes), might be corrupted`);
      }
    } finally {
      // Restore original format
      template.format = originalFormat;
    }

    await dataSource.destroy();
  } catch (error: any) {
    console.error('Error:', error.message);
    console.error(error.stack);
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
    process.exit(1);
  }
}

testReportDownload();
