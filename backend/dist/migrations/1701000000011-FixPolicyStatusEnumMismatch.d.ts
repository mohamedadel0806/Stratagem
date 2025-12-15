import { MigrationInterface, QueryRunner } from 'typeorm';
export declare class FixPolicyStatusEnumMismatch1701000000011 implements MigrationInterface {
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
