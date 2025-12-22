import { MigrationInterface, QueryRunner } from 'typeorm';
export declare class AddPolicyHierarchySupport1702000000001 implements MigrationInterface {
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
