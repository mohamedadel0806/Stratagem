"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddConflictResolutionStrategyToIntegrationConfigs1766429000002 = void 0;
class AddConflictResolutionStrategyToIntegrationConfigs1766429000002 {
    constructor() {
        this.name = 'AddConflictResolutionStrategyToIntegrationConfigs1766429000002';
    }
    async up(queryRunner) {
        await queryRunner.query(`
      CREATE TYPE conflict_resolution_strategy AS ENUM (
        'skip',
        'overwrite',
        'merge'
      );
    `);
        await queryRunner.query(`
      ALTER TABLE "integration_configs"
      ADD COLUMN "conflict_resolution_strategy" conflict_resolution_strategy DEFAULT 'skip';
    `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
      ALTER TABLE "integration_configs"
      DROP COLUMN "conflict_resolution_strategy";
    `);
        await queryRunner.query('DROP TYPE IF EXISTS conflict_resolution_strategy');
    }
}
exports.AddConflictResolutionStrategyToIntegrationConfigs1766429000002 = AddConflictResolutionStrategyToIntegrationConfigs1766429000002;
//# sourceMappingURL=1766429000002-AddConflictResolutionStrategyToIntegrationConfigs.js.map