import { MigrationInterface, QueryRunner } from 'typeorm';
export declare class FixWorkflowColumnNames1701000000100 implements MigrationInterface {
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
