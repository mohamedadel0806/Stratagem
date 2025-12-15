"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePoliciesTable1701000000003 = void 0;
const typeorm_1 = require("typeorm");
class CreatePoliciesTable1701000000003 {
    async up(queryRunner) {
        const tableExists = await queryRunner.hasTable('policies');
        if (tableExists) {
            const columnsToAdd = [
                { name: 'version_number', type: 'integer', default: 1 },
                { name: 'content', type: 'text', isNullable: true },
                { name: 'purpose', type: 'text', isNullable: true },
                { name: 'scope', type: 'text', isNullable: true },
                { name: 'business_units', type: 'uuid[]', isNullable: true },
                { name: 'approval_date', type: 'date', isNullable: true },
                { name: 'review_frequency', type: 'review_frequency_enum', default: "'annual'", isNullable: true },
                { name: 'next_review_date', type: 'date', isNullable: true },
                { name: 'published_date', type: 'date', isNullable: true },
                { name: 'linked_influencers', type: 'uuid[]', isNullable: true },
                { name: 'supersedes_policy_id', type: 'uuid', isNullable: true },
                { name: 'attachments', type: 'jsonb', isNullable: true },
                { name: 'tags', type: 'varchar[]', isNullable: true },
                { name: 'custom_fields', type: 'jsonb', isNullable: true },
                { name: 'requires_acknowledgment', type: 'boolean', default: true },
                { name: 'acknowledgment_due_days', type: 'integer', default: 30 },
                { name: 'created_by', type: 'uuid', isNullable: true },
                { name: 'updated_by', type: 'uuid', isNullable: true },
                { name: 'deleted_at', type: 'timestamp', isNullable: true },
            ];
            for (const col of columnsToAdd) {
                const columnExists = await queryRunner.hasColumn('policies', col.name);
                if (!columnExists) {
                    const column = new typeorm_1.TableColumn(col);
                    await queryRunner.addColumn('policies', column);
                }
            }
            const foreignKeys = [
                { columnNames: ['supersedes_policy_id'], referencedTableName: 'policies', referencedColumnNames: ['id'] },
                { columnNames: ['created_by'], referencedTableName: 'users', referencedColumnNames: ['id'] },
                { columnNames: ['updated_by'], referencedTableName: 'users', referencedColumnNames: ['id'] },
            ];
            for (const fk of foreignKeys) {
                const fkExists = await queryRunner.getTable('policies').then(table => table === null || table === void 0 ? void 0 : table.foreignKeys.some(existingFk => existingFk.columnNames[0] === fk.columnNames[0]));
                if (!fkExists) {
                    await queryRunner.createForeignKey('policies', new typeorm_1.TableForeignKey(fk));
                }
            }
            await queryRunner.createIndex('policies', new typeorm_1.TableIndex({ columnNames: ['next_review_date'], where: 'next_review_date IS NOT NULL AND deleted_at IS NULL' }));
            await queryRunner.query(`
        CREATE INDEX IF NOT EXISTS idx_policies_linked_influencers ON policies USING gin(linked_influencers);
      `);
            await queryRunner.query(`
        CREATE INDEX IF NOT EXISTS idx_policies_search ON policies USING gin(
          to_tsvector('english', 
            coalesce(title, '') || ' ' || 
            coalesce(content, '')
          )
        );
      `);
        }
        else {
            await queryRunner.createTable(new typeorm_1.Table({
                name: 'policies',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                        default: 'uuid_generate_v4()',
                    },
                    {
                        name: 'policy_type',
                        type: 'varchar',
                        length: '200',
                        isNullable: false,
                    },
                    {
                        name: 'title',
                        type: 'varchar',
                        length: '500',
                        isNullable: false,
                    },
                    {
                        name: 'version',
                        type: 'varchar',
                        length: '50',
                        default: "'1.0'",
                    },
                    {
                        name: 'version_number',
                        type: 'integer',
                        default: 1,
                    },
                    {
                        name: 'content',
                        type: 'text',
                        isNullable: true,
                    },
                    {
                        name: 'purpose',
                        type: 'text',
                        isNullable: true,
                    },
                    {
                        name: 'scope',
                        type: 'text',
                        isNullable: true,
                    },
                    {
                        name: 'owner_id',
                        type: 'uuid',
                        isNullable: true,
                    },
                    {
                        name: 'business_units',
                        type: 'uuid[]',
                        isNullable: true,
                    },
                    {
                        name: 'status',
                        type: 'policy_status_enum',
                        default: "'draft'",
                    },
                    {
                        name: 'approval_date',
                        type: 'date',
                        isNullable: true,
                    },
                    {
                        name: 'effective_date',
                        type: 'date',
                        isNullable: true,
                    },
                    {
                        name: 'review_frequency',
                        type: 'review_frequency_enum',
                        default: "'annual'",
                    },
                    {
                        name: 'next_review_date',
                        type: 'date',
                        isNullable: true,
                    },
                    {
                        name: 'published_date',
                        type: 'date',
                        isNullable: true,
                    },
                    {
                        name: 'linked_influencers',
                        type: 'uuid[]',
                        isNullable: true,
                    },
                    {
                        name: 'supersedes_policy_id',
                        type: 'uuid',
                        isNullable: true,
                    },
                    {
                        name: 'attachments',
                        type: 'jsonb',
                        isNullable: true,
                    },
                    {
                        name: 'tags',
                        type: 'varchar[]',
                        isNullable: true,
                    },
                    {
                        name: 'custom_fields',
                        type: 'jsonb',
                        isNullable: true,
                    },
                    {
                        name: 'requires_acknowledgment',
                        type: 'boolean',
                        default: true,
                    },
                    {
                        name: 'acknowledgment_due_days',
                        type: 'integer',
                        default: 30,
                    },
                    {
                        name: 'created_by',
                        type: 'uuid',
                        isNullable: true,
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP',
                    },
                    {
                        name: 'updated_by',
                        type: 'uuid',
                        isNullable: true,
                    },
                    {
                        name: 'updated_at',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP',
                    },
                    {
                        name: 'deleted_at',
                        type: 'timestamp',
                        isNullable: true,
                    },
                ],
            }), true);
            await queryRunner.createForeignKey('policies', new typeorm_1.TableForeignKey({
                columnNames: ['owner_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'users',
                onDelete: 'SET NULL',
            }));
            await queryRunner.createForeignKey('policies', new typeorm_1.TableForeignKey({
                columnNames: ['supersedes_policy_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'policies',
                onDelete: 'SET NULL',
            }));
            await queryRunner.createIndex('policies', new typeorm_1.TableIndex({ columnNames: ['policy_type'] }));
            await queryRunner.createIndex('policies', new typeorm_1.TableIndex({ columnNames: ['status'] }));
            await queryRunner.createIndex('policies', new typeorm_1.TableIndex({ columnNames: ['owner_id'] }));
            await queryRunner.createIndex('policies', new typeorm_1.TableIndex({
                columnNames: ['next_review_date'],
                where: 'next_review_date IS NOT NULL AND deleted_at IS NULL',
            }));
            await queryRunner.createIndex('policies', new typeorm_1.TableIndex({ columnNames: ['title', 'version_number'] }));
            await queryRunner.query(`
      CREATE INDEX idx_policies_search ON policies USING gin(
        to_tsvector('english', 
          coalesce(title, '') || ' ' || 
          coalesce(content, '')
        )
      );
    `);
            await queryRunner.query(`
        CREATE INDEX idx_policies_linked_influencers ON policies USING gin(linked_influencers);
      `);
        }
        const acknowledgmentsTableExists = await queryRunner.hasTable('policy_acknowledgments');
        if (!acknowledgmentsTableExists) {
            await queryRunner.createTable(new typeorm_1.Table({
                name: 'policy_acknowledgments',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                        default: 'uuid_generate_v4()',
                    },
                    {
                        name: 'policy_id',
                        type: 'uuid',
                        isNullable: false,
                    },
                    {
                        name: 'user_id',
                        type: 'uuid',
                        isNullable: false,
                    },
                    {
                        name: 'policy_version',
                        type: 'varchar',
                        length: '50',
                        isNullable: true,
                    },
                    {
                        name: 'acknowledged_at',
                        type: 'timestamp',
                        isNullable: true,
                    },
                    {
                        name: 'ip_address',
                        type: 'inet',
                        isNullable: true,
                    },
                    {
                        name: 'user_agent',
                        type: 'text',
                        isNullable: true,
                    },
                    {
                        name: 'assigned_at',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP',
                    },
                    {
                        name: 'due_date',
                        type: 'date',
                        isNullable: true,
                    },
                    {
                        name: 'reminder_sent_count',
                        type: 'integer',
                        default: 0,
                    },
                    {
                        name: 'last_reminder_sent',
                        type: 'timestamp',
                        isNullable: true,
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP',
                    },
                ],
            }), true);
            await queryRunner.createForeignKey('policy_acknowledgments', new typeorm_1.TableForeignKey({
                columnNames: ['policy_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'policies',
                onDelete: 'CASCADE',
            }));
            await queryRunner.createForeignKey('policy_acknowledgments', new typeorm_1.TableForeignKey({
                columnNames: ['user_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'users',
                onDelete: 'CASCADE',
            }));
            await queryRunner.createIndex('policy_acknowledgments', new typeorm_1.TableIndex({ columnNames: ['policy_id'] }));
            await queryRunner.createIndex('policy_acknowledgments', new typeorm_1.TableIndex({ columnNames: ['user_id'] }));
            await queryRunner.createIndex('policy_acknowledgments', new typeorm_1.TableIndex({
                columnNames: ['policy_id', 'user_id'],
                where: 'acknowledged_at IS NULL',
            }));
            await queryRunner.query(`
        ALTER TABLE policy_acknowledgments
        ADD CONSTRAINT unique_policy_user_version UNIQUE (policy_id, user_id, policy_version);
      `);
        }
    }
    async down(queryRunner) {
        await queryRunner.dropTable('policy_acknowledgments', true);
    }
}
exports.CreatePoliciesTable1701000000003 = CreatePoliciesTable1701000000003;
//# sourceMappingURL=1701000000003-CreatePoliciesTable.js.map