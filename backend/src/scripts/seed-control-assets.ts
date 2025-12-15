import { v4 as uuidv4 } from 'uuid';
import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

async function seedControlAssets() {
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'postgres',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.POSTGRES_USER || 'postgres',
    password: process.env.POSTGRES_PASSWORD || 'password',
    database: process.env.POSTGRES_DB || 'grc_platform',
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: false,
    logging: false,
    namingStrategy: new SnakeNamingStrategy(),
  });

  await dataSource.initialize();

  const controlIds = [
    'f4b89f75-b20a-46c5-949e-350a3bdd1f53',
    '21850ae0-0d3d-4255-b763-f3be1bbc0f97',
    'b5ee8b21-32b5-49ce-9214-4a23ec0cd419',
    'ccc179a0-95c4-4d0b-9073-fd5321875893',
    '57ab59e4-0a22-47ca-9f63-90b1cb2d5ad0',
    'e40a782a-a26d-423e-8a17-5488f9cdfb88',
    '4f26dfa5-2e88-4160-9741-e8d4753fd703',
    '99df57a6-1efc-4693-bd96-222a0e1d72bb',
  ];

  const assetTypes = ['physical', 'information', 'application', 'software', 'supplier'];
  const implementationStatuses = ['not_implemented', 'planned', 'in_progress', 'implemented', 'not_applicable'];

  for (const controlId of controlIds) {
    for (let i = 0; i < 5; i++) {
      const assetId = uuidv4();
      const assetType = assetTypes[i % assetTypes.length];
      const implementationStatus = implementationStatuses[i % implementationStatuses.length];
      const effectivenessScore = Math.floor(Math.random() * 5) + 1;

      await dataSource.query(
        `INSERT INTO control_asset_mappings (id, unified_control_id, asset_id, asset_type, implementation_status, effectiveness_score) VALUES ($1, $2, $3, $4, $5, $6)`,
        [uuidv4(), controlId, assetId, assetType, implementationStatus, effectivenessScore]
      );
    }
  }

  console.log('✅ Seeded assets for all controls');
  await dataSource.destroy();
}

seedControlAssets().catch((error) => {
  console.error('❌ Error seeding control assets:', error);
});