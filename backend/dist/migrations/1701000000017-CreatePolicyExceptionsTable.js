"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePolicyExceptionsTable1701000000017 = void 0;
const typeorm_1 = require("typeorm");
class CreatePolicyExceptionsTable1701000000017 {
    async up(queryRunner) {
        await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE exception_status_enum AS ENUM (
          'requested',
          'under_review',
          'approved',
          'rejected',
          'expired',
          'revoked'
        );
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);
        const tableExists = await queryRunner.hasTable('policy_exceptions');
        if (!tableExists) {
            await queryRunner.createTable(new typeorm_1.Table({
                name: 'policy_exceptions',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                        default: 'uuid_generate_v4()',
                    },
                    {
                        name: 'exception_identifier',
                        type: 'varchar',
                        length: '100',
                        isUnique: true,
                        isNullable: false,
                    },
                    {
                        name: 'exception_type',
                        type: 'varchar',
                        length: '100',
                        isNullable: true,
                    },
                    {
                        name: 'entity_id',
                        type: 'uuid',
                        isNullable: false,
                    },
                    {
                        name: 'entity_type',
                        type: 'varchar',
                        length: '100',
                        isNullable: true,
                    },
                    {
                        name: 'requested_by',
                        type: 'uuid',
                        isNullable: true,
                    },
                    {
                        name: 'requesting_business_unit_id',
                        type: 'uuid',
                        isNullable: true,
                    },
                    {
                        name: 'request_date',
                        type: 'date',
                        default: 'CURRENT_DATE',
                    },
                    {
                        name: 'business_justification',
                        type: 'text',
                        isNullable: false,
                    },
                    {
                        name: 'compensating_controls',
                        type: 'text',
                        isNullable: true,
                    },
                    {
                        name: 'risk_assessment',
                        type: 'text',
                        isNullable: true,
                    },
                    {
                        name: 'start_date',
                        type: 'date',
                        isNullable: true,
                    },
                    {
                        name: 'end_date',
                        type: 'date',
                        isNullable: true,
                    },
                    {
                        name: 'auto_expire',
                        type: 'boolean',
                        default: true,
                    },
                    {
                        name: 'status',
                        type: 'enum',
                        enum: ['requested', 'under_review', 'approved', 'rejected', 'expired', 'revoked'],
                        default: "'requested'",
                    },
                    {
                        name: 'approved_by',
                        type: 'uuid',
                        isNullable: true,
                    },
                    {
                        name: 'approval_date',
                        type: 'date',
                        isNullable: true,
                    },
                    {
                        name: 'approval_conditions',
                        type: 'text',
                        isNullable: true,
                    },
                    {
                        name: 'rejection_reason',
                        type: 'text',
                        isNullable: true,
                    },
                    {
                        name: 'last_review_date',
                        type: 'date',
                        isNullable: true,
                    },
                    {
                        name: 'next_review_date',
                        type: 'date',
                        isNullable: true,
                    },
                    {
                        name: 'supporting_documents',
                        type: 'jsonb',
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
            await queryRunner.createForeignKey('policy_exceptions', new typeorm_1.TableForeignKey({
                columnNames: ['requested_by'],
                referencedColumnNames: ['id'],
                referencedTableName: 'users',
                onDelete: 'SET NULL',
            }));
            await queryRunner.createForeignKey('policy_exceptions', new typeorm_1.TableForeignKey({
                columnNames: ['requesting_business_unit_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'business_units',
                onDelete: 'SET NULL',
            }));
            await queryRunner.createForeignKey('policy_exceptions', new typeorm_1.TableForeignKey({
                columnNames: ['approved_by'],
                referencedColumnNames: ['id'],
                referencedTableName: 'users',
                onDelete: 'SET NULL',
            }));
            await queryRunner.createForeignKey('policy_exceptions', new typeorm_1.TableForeignKey({
                columnNames: ['updated_by'],
                referencedColumnNames: ['id'],
                referencedTableName: 'users',
                onDelete: 'SET NULL',
            }));
            await queryRunner.createIndex('policy_exceptions', new typeorm_1.TableIndex({ columnNames: ['exception_identifier'] }));
            await queryRunner.createIndex('policy_exceptions', new typeorm_1.TableIndex({ columnNames: ['entity_type', 'entity_id'] }));
            await queryRunner.createIndex('policy_exceptions', new typeorm_1.TableIndex({ columnNames: ['status'] }));
            await queryRunner.createIndex('policy_exceptions', new typeorm_1.TableIndex({ columnNames: ['requested_by'] }));
            await queryRunner.createIndex('policy_exceptions', new typeorm_1.TableIndex({ columnNames: ['end_date'], where: "status = 'approved' AND auto_expire = true" }));
        }
    }
    async down(queryRunner) {
        await queryRunner.dropTable('policy_exceptions', true);
        await queryRunner.query(`DROP TYPE IF EXISTS exception_status_enum;`);
    }
}
exports.CreatePolicyExceptionsTable1701000000017 = CreatePolicyExceptionsTable1701000000017;
//# sourceMappingURL=1701000000017-CreatePolicyExceptionsTable.js.map