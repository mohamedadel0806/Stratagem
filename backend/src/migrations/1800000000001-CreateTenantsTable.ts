import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateTenantsTable1800000000001 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'tenants',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'uuid',
                    },
                    {
                        name: 'name',
                        type: 'varchar',
                        isUnique: true,
                    },
                    {
                        name: 'code',
                        type: 'varchar',
                        isUnique: true,
                    },
                    {
                        name: 'status',
                        type: 'enum',
                        enum: ['active', 'suspended', 'trial', 'deleted'],
                        default: "'trial'",
                    },
                    {
                        name: 'subscription_tier',
                        type: 'enum',
                        enum: ['starter', 'professional', 'enterprise'],
                        default: "'starter'",
                    },
                    {
                        name: 'settings',
                        type: 'jsonb',
                        isNullable: true,
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp',
                        default: 'now()',
                    },
                    {
                        name: 'updated_at',
                        type: 'timestamp',
                        default: 'now()',
                    },
                    {
                        name: 'deleted_at',
                        type: 'timestamp',
                        isNullable: true,
                    },
                ],
            }),
            true,
        );

        await queryRunner.createIndex(
            'tenants',
            new TableIndex({
                name: 'idx_tenants_code',
                columnNames: ['code'],
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropIndex('tenants', 'idx_tenants_code');
        await queryRunner.dropTable('tenants');
    }
}
