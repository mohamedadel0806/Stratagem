"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateRiskFindingLinks1702000000006 = void 0;
const typeorm_1 = require("typeorm");
class CreateRiskFindingLinks1702000000006 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'risk_finding_links',
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                    generationStrategy: 'uuid',
                    default: 'uuid_generate_v4()',
                },
                {
                    name: 'risk_id',
                    type: 'uuid',
                    isNullable: false,
                },
                {
                    name: 'finding_id',
                    type: 'uuid',
                    isNullable: false,
                },
                {
                    name: 'relationship_type',
                    type: 'varchar',
                    length: '50',
                    isNullable: true,
                    comment: 'How the finding relates to the risk: identified, contributes_to, mitigates, etc.',
                },
                {
                    name: 'notes',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'linked_by',
                    type: 'uuid',
                    isNullable: true,
                },
                {
                    name: 'linked_at',
                    type: 'timestamp',
                    default: 'CURRENT_TIMESTAMP',
                },
                {
                    name: 'updated_at',
                    type: 'timestamp',
                    default: 'CURRENT_TIMESTAMP',
                },
            ],
        }), true);
        await queryRunner.createForeignKey('risk_finding_links', new typeorm_1.TableForeignKey({
            columnNames: ['risk_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'risks',
            onDelete: 'CASCADE',
        }));
        await queryRunner.createForeignKey('risk_finding_links', new typeorm_1.TableForeignKey({
            columnNames: ['finding_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'findings',
            onDelete: 'CASCADE',
        }));
        await queryRunner.createForeignKey('risk_finding_links', new typeorm_1.TableForeignKey({
            columnNames: ['linked_by'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            onDelete: 'SET NULL',
        }));
        await queryRunner.createIndex('risk_finding_links', new typeorm_1.TableIndex({ columnNames: ['risk_id'] }));
        await queryRunner.createIndex('risk_finding_links', new typeorm_1.TableIndex({ columnNames: ['finding_id'] }));
        await queryRunner.createIndex('risk_finding_links', new typeorm_1.TableIndex({ columnNames: ['relationship_type'] }));
        await queryRunner.query(`
      ALTER TABLE risk_finding_links
      ADD CONSTRAINT unique_risk_finding_link UNIQUE (risk_id, finding_id);
    `);
    }
    async down(queryRunner) {
        await queryRunner.dropTable('risk_finding_links', true);
    }
}
exports.CreateRiskFindingLinks1702000000006 = CreateRiskFindingLinks1702000000006;
//# sourceMappingURL=1702000000006-CreateRiskFindingLinks.js.map