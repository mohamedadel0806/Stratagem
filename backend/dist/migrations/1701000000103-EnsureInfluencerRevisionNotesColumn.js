"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnsureInfluencerRevisionNotesColumn1701000000103 = void 0;
class EnsureInfluencerRevisionNotesColumn1701000000103 {
    async up(queryRunner) {
        await queryRunner.query(`
      ALTER TABLE influencers 
      ADD COLUMN IF NOT EXISTS revision_notes TEXT;
    `);
        await queryRunner.query(`
      ALTER TABLE influencers 
      ADD COLUMN IF NOT EXISTS review_frequency_days INTEGER;
    `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
      ALTER TABLE influencers 
      DROP COLUMN IF EXISTS revision_notes;
    `);
        await queryRunner.query(`
      ALTER TABLE influencers 
      DROP COLUMN IF EXISTS review_frequency_days;
    `);
    }
}
exports.EnsureInfluencerRevisionNotesColumn1701000000103 = EnsureInfluencerRevisionNotesColumn1701000000103;
//# sourceMappingURL=1701000000103-EnsureInfluencerRevisionNotesColumn.js.map