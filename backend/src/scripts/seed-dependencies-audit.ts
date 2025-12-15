import { DataSource, Repository } from 'typeorm';
import { config } from 'dotenv';
import { User } from '../users/entities/user.entity';
import { PhysicalAsset } from '../asset/entities/physical-asset.entity';
import { InformationAsset } from '../asset/entities/information-asset.entity';
import { BusinessApplication } from '../asset/entities/business-application.entity';
import { SoftwareAsset } from '../asset/entities/software-asset.entity';
import { Supplier } from '../asset/entities/supplier.entity';
import { AssetDependency, RelationshipType } from '../asset/entities/asset-dependency.entity';
import { AssetAuditLog, AssetType, AuditAction } from '../asset/entities/asset-audit-log.entity';

config();

// Parse DATABASE_URL if provided, otherwise use individual env vars or defaults
const parseDatabaseUrl = (url?: string): {
  username?: string;
  password?: string;
  host?: string;
  port?: number;
  database?: string;
} | null => {
  if (!url) return null;
  try {
    const match = url.match(/postgresql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);
    if (match) {
      return {
        username: match[1],
        password: match[2],
        host: match[3],
        port: parseInt(match[4]),
        database: match[5],
      };
    }
  } catch {
    // Ignore parsing errors
  }
  return null;
};

const dbConfig = parseDatabaseUrl(process.env.DATABASE_URL);

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || dbConfig?.host || 'postgres',
  port: parseInt(process.env.DB_PORT || String(dbConfig?.port) || '5432'),
  username: process.env.POSTGRES_USER || dbConfig?.username || 'postgres',
  password: process.env.POSTGRES_PASSWORD || dbConfig?.password || 'password',
  database: process.env.POSTGRES_DB || dbConfig?.database || 'grc_platform',
  entities: [
    User,
    PhysicalAsset,
    InformationAsset,
    BusinessApplication,
    SoftwareAsset,
    Supplier,
    AssetDependency,
    AssetAuditLog,
  ],
  migrations: [],
  synchronize: false,
});

async function seedDependenciesAndAudit() {
  try {
    await AppDataSource.initialize();
    console.log('Database connection established');

    // Get repositories
    const userRepo = AppDataSource.getRepository(User);
    const physicalAssetRepo = AppDataSource.getRepository(PhysicalAsset);
    const informationAssetRepo = AppDataSource.getRepository(InformationAsset);
    const businessApplicationRepo = AppDataSource.getRepository(BusinessApplication);
    const softwareAssetRepo = AppDataSource.getRepository(SoftwareAsset);
    const supplierRepo = AppDataSource.getRepository(Supplier);
    const dependencyRepo = AppDataSource.getRepository(AssetDependency);
    const auditLogRepo = AppDataSource.getRepository(AssetAuditLog);

    // Find existing user
    const users = await userRepo.find({ take: 1 });
    if (users.length === 0) {
      console.log('No users found. Please run user seeding first.');
      return;
    }
    const user = users[0];
    console.log(`Using user: ${user.email}`);

    // Get existing assets
    const physicalAssets = await physicalAssetRepo.find({ take: 5 });
    const informationAssets = await informationAssetRepo.find({ take: 5 });
    const businessApplications = await businessApplicationRepo.find({ take: 5 });
    const softwareAssets = await softwareAssetRepo.find({ take: 5 });
    const suppliers = await supplierRepo.find({ take: 5 });

    console.log(`Found assets: ${physicalAssets.length} physical, ${informationAssets.length} information, ${businessApplications.length} applications, ${softwareAssets.length} software, ${suppliers.length} suppliers`);

    // Seed asset dependencies
    console.log('Seeding asset dependencies...');
    await seedAssetDependencies(dependencyRepo, user, {
      physicalAssets,
      informationAssets,
      businessApplications,
      softwareAssets,
      suppliers,
    });

    // Seed audit logs
    console.log('Seeding audit logs...');
    await seedAuditLogs(auditLogRepo, user, {
      physicalAssets,
      informationAssets,
      businessApplications,
      softwareAssets,
      suppliers,
    });

    console.log('Dependencies and audit logs seeding completed successfully');
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  } finally {
    await AppDataSource.destroy();
  }
}

async function seedAssetDependencies(
  dependencyRepo: Repository<AssetDependency>,
  user: User,
  assets: {
    physicalAssets: PhysicalAsset[];
    informationAssets: InformationAsset[];
    businessApplications: BusinessApplication[];
    softwareAssets: SoftwareAsset[];
    suppliers: Supplier[];
  },
) {
  const dependencies = [];

  // Create some realistic dependencies
  const dependencyData = [
    // Physical assets depend on suppliers
    ...assets.physicalAssets.slice(0, 2).map(asset => ({
      sourceAssetType: AssetType.PHYSICAL,
      sourceAssetId: asset.id,
      targetAssetType: AssetType.SUPPLIER,
      targetAssetId: assets.suppliers[0]?.id,
      relationshipType: RelationshipType.DEPENDS_ON,
      description: 'Physical asset depends on supplier for maintenance',
    })),

    // Information assets are stored on physical assets
    ...assets.informationAssets.slice(0, 2).map(asset => ({
      sourceAssetType: AssetType.INFORMATION,
      sourceAssetId: asset.id,
      targetAssetType: AssetType.PHYSICAL,
      targetAssetId: assets.physicalAssets[0]?.id,
      relationshipType: RelationshipType.STORES,
      description: 'Information asset is stored on physical server',
    })),

    // Business applications use information assets
    ...assets.businessApplications.slice(0, 2).map(app => ({
      sourceAssetType: AssetType.APPLICATION,
      sourceAssetId: app.id,
      targetAssetType: AssetType.INFORMATION,
      targetAssetId: assets.informationAssets[0]?.id,
      relationshipType: RelationshipType.USES,
      description: 'Business application processes customer data',
    })),

    // Business applications run on software
    ...assets.businessApplications.slice(0, 2).map(app => ({
      sourceAssetType: AssetType.APPLICATION,
      sourceAssetId: app.id,
      targetAssetType: AssetType.SOFTWARE,
      targetAssetId: assets.softwareAssets[0]?.id,
      relationshipType: RelationshipType.DEPENDS_ON,
      description: 'Application requires specific software to run',
    })),

    // Software is installed on physical assets
    ...assets.softwareAssets.slice(0, 2).map(software => ({
      sourceAssetType: AssetType.SOFTWARE,
      sourceAssetId: software.id,
      targetAssetType: AssetType.PHYSICAL,
      targetAssetId: assets.physicalAssets[0]?.id,
      relationshipType: RelationshipType.HOSTS,
      description: 'Software is installed on physical server',
    })),

    // Suppliers provide software
    ...assets.suppliers.slice(0, 2).map(supplier => ({
      sourceAssetType: AssetType.SOFTWARE,
      sourceAssetId: assets.softwareAssets[0]?.id,
      targetAssetType: AssetType.SUPPLIER,
      targetAssetId: supplier.id,
      relationshipType: RelationshipType.DEPENDS_ON,
      description: 'Software vendor provides support and updates',
    })),
  ];

  // Filter out dependencies with missing assets
  const validDependencies = dependencyData.filter(dep =>
    dep.sourceAssetId && dep.targetAssetId
  );

  for (const depData of validDependencies) {
    // Check if dependency already exists
    const existing = await dependencyRepo.findOne({
      where: {
        sourceAssetType: depData.sourceAssetType,
        sourceAssetId: depData.sourceAssetId,
        targetAssetType: depData.targetAssetType,
        targetAssetId: depData.targetAssetId,
      },
    });

    if (!existing) {
      const dependency = dependencyRepo.create({
        ...depData,
        createdById: user.id,
      });
      dependencies.push(await dependencyRepo.save(dependency));
    }
  }

  console.log(`Created ${dependencies.length} asset dependencies`);
}

async function seedAuditLogs(
  auditLogRepo: Repository<AssetAuditLog>,
  user: User,
  assets: {
    physicalAssets: PhysicalAsset[];
    informationAssets: InformationAsset[];
    businessApplications: BusinessApplication[];
    softwareAssets: SoftwareAsset[];
    suppliers: Supplier[];
  },
) {
  const auditLogs = [];
  const now = new Date();

  // Create audit logs for different asset types
  const auditData = [
    // Physical asset changes
    ...assets.physicalAssets.slice(0, 3).map((asset, index) => ({
      assetType: AssetType.PHYSICAL,
      assetId: asset.id,
      action: AuditAction.UPDATE,
      fieldName: 'assetName',
      oldValue: `Old ${asset.assetDescription}`,
      newValue: asset.assetDescription,
      changedById: user.id,
      changeReason: 'Updated asset name during inventory review',
      createdAt: new Date(now.getTime() - (index + 1) * 24 * 60 * 60 * 1000), // Days ago
    })),

    // Information asset changes
    ...assets.informationAssets.slice(0, 3).map((asset, index) => ({
      assetType: AssetType.INFORMATION,
      assetId: asset.id,
      action: AuditAction.UPDATE,
      fieldName: 'dataClassification',
      oldValue: 'Internal',
      newValue: asset.dataClassification,
      changedById: user.id,
      changeReason: 'Updated classification during compliance audit',
      createdAt: new Date(now.getTime() - (index + 2) * 24 * 60 * 60 * 1000),
    })),

    // Business application changes
    ...assets.businessApplications.slice(0, 3).map((asset, index) => ({
      assetType: AssetType.APPLICATION,
      assetId: asset.id,
      action: AuditAction.UPDATE,
      fieldName: 'criticalityLevel',
      oldValue: 'Low',
      newValue: asset.criticalityLevel,
      changedById: user.id,
      changeReason: 'Updated criticality based on business impact analysis',
      createdAt: new Date(now.getTime() - (index + 3) * 24 * 60 * 60 * 1000),
    })),

    // Software asset changes
    ...assets.softwareAssets.slice(0, 3).map((asset, index) => ({
      assetType: AssetType.SOFTWARE,
      assetId: asset.id,
      action: AuditAction.UPDATE,
      fieldName: 'licenseType',
      oldValue: 'Perpetual',
      newValue: asset.licenseType,
      changedById: user.id,
      changeReason: 'Updated license type during software audit',
      createdAt: new Date(now.getTime() - (index + 4) * 24 * 60 * 60 * 1000),
    })),

    // Supplier changes
    ...assets.suppliers.slice(0, 3).map((asset, index) => ({
      assetType: AssetType.SUPPLIER,
      assetId: asset.id,
      action: AuditAction.UPDATE,
      fieldName: 'contractStatus',
      oldValue: 'Draft',
      newValue: 'Active',
      changedById: user.id,
      changeReason: 'Updated supplier information after contract review',
      createdAt: new Date(now.getTime() - (index + 5) * 24 * 60 * 60 * 1000),
    })),

    // Some create actions
    ...assets.physicalAssets.slice(0, 2).map((asset, index) => ({
      assetType: AssetType.PHYSICAL,
      assetId: asset.id,
      action: AuditAction.CREATE,
      fieldName: null,
      oldValue: null,
      newValue: null,
      changedById: user.id,
      changeReason: 'Initial asset registration',
      createdAt: new Date(now.getTime() - (index + 10) * 24 * 60 * 60 * 1000),
    })),
  ];

  for (const logData of auditData) {
    // Check if audit log already exists (avoid duplicates)
    const existing = await auditLogRepo.findOne({
      where: {
        assetType: logData.assetType,
        assetId: logData.assetId,
        action: logData.action,
        fieldName: logData.fieldName,
        createdAt: logData.createdAt,
      },
    });

    if (!existing) {
      const auditLog = auditLogRepo.create(logData);
      auditLogs.push(await auditLogRepo.save(auditLog));
    }
  }

  console.log(`Created ${auditLogs.length} audit log entries`);
}

seedDependenciesAndAudit();
