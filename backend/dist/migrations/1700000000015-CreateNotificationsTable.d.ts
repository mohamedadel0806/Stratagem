import { MigrationInterface, QueryRunner } from 'typeorm';
export declare class CreateNotificationsTable1700000000015 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
