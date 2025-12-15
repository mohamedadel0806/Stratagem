"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateRiskCategoriesTable1702000000001 = void 0;
const typeorm_1 = require("typeorm");
class CreateRiskCategoriesTable1702000000001 {
    async up(queryRunner) {
        await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE risk_tolerance_enum AS ENUM ('low', 'medium', 'high');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'risk_categories',
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                    generationStrategy: 'uuid',
                    default: 'uuid_generate_v4()',
                },
                {
                    name: 'name',
                    type: 'varchar',
                    length: '200',
                    isNullable: false,
                },
                {
                    name: 'code',
                    type: 'varchar',
                    length: '50',
                    isUnique: true,
                    isNullable: false,
                },
                {
                    name: 'description',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'parent_category_id',
                    type: 'uuid',
                    isNullable: true,
                },
                {
                    name: 'risk_tolerance',
                    type: 'risk_tolerance_enum',
                    default: "'medium'",
                },
                {
                    name: 'is_active',
                    type: 'boolean',
                    default: true,
                },
                {
                    name: 'display_order',
                    type: 'integer',
                    default: 0,
                },
                {
                    name: 'color',
                    type: 'varchar',
                    length: '20',
                    isNullable: true,
                },
                {
                    name: 'icon',
                    type: 'varchar',
                    length: '50',
                    isNullable: true,
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
        await queryRunner.createForeignKey('risk_categories', new typeorm_1.TableForeignKey({
            columnNames: ['parent_category_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'risk_categories',
            onDelete: 'SET NULL',
        }));
        await queryRunner.createIndex('risk_categories', new typeorm_1.TableIndex({ columnNames: ['code'] }));
        await queryRunner.createIndex('risk_categories', new typeorm_1.TableIndex({ columnNames: ['parent_category_id'] }));
        await queryRunner.createIndex('risk_categories', new typeorm_1.TableIndex({ columnNames: ['is_active'] }));
        await queryRunner.createIndex('risk_categories', new typeorm_1.TableIndex({ columnNames: ['display_order'] }));
        await queryRunner.query(`
      INSERT INTO risk_categories (id, name, code, description, risk_tolerance, display_order, color, icon) VALUES
        (uuid_generate_v4(), 'Strategic Risks', 'STRATEGIC', 'Risks related to business strategy, market positioning, and competitive landscape', 'medium', 1, '#6366f1', 'target'),
        (uuid_generate_v4(), 'Operational Risks', 'OPERATIONAL', 'Risks arising from internal processes, people, and systems failures', 'medium', 2, '#f59e0b', 'cog'),
        (uuid_generate_v4(), 'Technology/Cybersecurity Risks', 'CYBERSECURITY', 'Risks related to information technology, cyber threats, and data security', 'low', 3, '#ef4444', 'shield'),
        (uuid_generate_v4(), 'Financial Risks', 'FINANCIAL', 'Risks related to financial losses, market fluctuations, and liquidity', 'medium', 4, '#10b981', 'dollar-sign'),
        (uuid_generate_v4(), 'Compliance & Legal Risks', 'COMPLIANCE', 'Risks arising from regulatory requirements, legal obligations, and contractual commitments', 'low', 5, '#8b5cf6', 'scale'),
        (uuid_generate_v4(), 'Reputational Risks', 'REPUTATIONAL', 'Risks that could damage the organization''s reputation and stakeholder trust', 'low', 6, '#ec4899', 'users'),
        (uuid_generate_v4(), 'Third-Party/Vendor Risks', 'VENDOR', 'Risks arising from relationships with suppliers, partners, and service providers', 'medium', 7, '#14b8a6', 'link'),
        (uuid_generate_v4(), 'Human Resources Risks', 'HR', 'Risks related to workforce, talent management, and employee conduct', 'medium', 8, '#f97316', 'user-group'),
        (uuid_generate_v4(), 'Environmental/Physical Risks', 'ENVIRONMENTAL', 'Risks from natural disasters, climate change, and physical security', 'medium', 9, '#22c55e', 'globe'),
        (uuid_generate_v4(), 'Project Risks', 'PROJECT', 'Risks specific to project execution, delivery, and management', 'medium', 10, '#3b82f6', 'clipboard-list'),
        (uuid_generate_v4(), 'Data Privacy Risks', 'PRIVACY', 'Risks related to personal data protection and privacy regulations', 'low', 11, '#a855f7', 'lock'),
        (uuid_generate_v4(), 'Business Continuity Risks', 'CONTINUITY', 'Risks that could disrupt business operations and service delivery', 'low', 12, '#0ea5e9', 'refresh');
    `);
    }
    async down(queryRunner) {
        await queryRunner.dropTable('risk_categories', true);
        await queryRunner.query(`DROP TYPE IF EXISTS risk_tolerance_enum;`);
    }
}
exports.CreateRiskCategoriesTable1702000000001 = CreateRiskCategoriesTable1702000000001;
//# sourceMappingURL=1702000000001-CreateRiskCategoriesTable.js.map