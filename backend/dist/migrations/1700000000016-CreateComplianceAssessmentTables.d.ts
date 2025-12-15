import { MigrationInterface, QueryRunner } from 'typeorm';
export declare class CreateComplianceAssessmentTables1700000000016 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
