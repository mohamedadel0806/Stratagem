"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddPolicyDocumentFields1700000000008 = void 0;
const typeorm_1 = require("typeorm");
class AddPolicyDocumentFields1700000000008 {
    async up(queryRunner) {
        await queryRunner.addColumn('policies', new typeorm_1.TableColumn({
            name: 'document_url',
            type: 'varchar',
            length: '500',
            isNullable: true,
        }));
        await queryRunner.addColumn('policies', new typeorm_1.TableColumn({
            name: 'document_name',
            type: 'varchar',
            length: '255',
            isNullable: true,
        }));
        await queryRunner.addColumn('policies', new typeorm_1.TableColumn({
            name: 'document_mime_type',
            type: 'varchar',
            length: '50',
            isNullable: true,
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropColumn('policies', 'document_mime_type');
        await queryRunner.dropColumn('policies', 'document_name');
        await queryRunner.dropColumn('policies', 'document_url');
    }
}
exports.AddPolicyDocumentFields1700000000008 = AddPolicyDocumentFields1700000000008;
//# sourceMappingURL=1700000000008-AddPolicyDocumentFields.js.map