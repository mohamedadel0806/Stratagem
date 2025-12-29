import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from "typeorm";

export class CreateInvitationsTable1735240000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "invitations",
            columns: [
                {
                    name: "id",
                    type: "uuid",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "uuid",
                },
                {
                    name: "email",
                    type: "varchar",
                },
                {
                    name: "token",
                    type: "varchar",
                    isUnique: true,
                },
                {
                    name: "role",
                    type: "varchar",
                    default: "'user'",
                },
                {
                    name: "tenant_id",
                    type: "uuid",
                },
                {
                    name: "invited_by",
                    type: "uuid",
                },
                {
                    name: "status",
                    type: "varchar",
                    default: "'pending'",
                },
                {
                    name: "expires_at",
                    type: "timestamp",
                },
                {
                    name: "created_at",
                    type: "timestamp",
                    default: "now()",
                },
                {
                    name: "updated_at",
                    type: "timestamp",
                    default: "now()",
                }
            ]
        }), true);

        await queryRunner.createIndex("invitations", new TableIndex({
            name: "IDX_INVITATION_EMAIL",
            columnNames: ["email"]
        }));

        await queryRunner.createIndex("invitations", new TableIndex({
            name: "IDX_INVITATION_TOKEN",
            columnNames: ["token"]
        }));

        await queryRunner.createForeignKey("invitations", new TableForeignKey({
            columnNames: ["tenant_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "tenants",
            onDelete: "CASCADE"
        }));

        await queryRunner.createForeignKey("invitations", new TableForeignKey({
            columnNames: ["invited_by"],
            referencedColumnNames: ["id"],
            referencedTableName: "users",
            onDelete: "CASCADE"
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("invitations");
    }
}
