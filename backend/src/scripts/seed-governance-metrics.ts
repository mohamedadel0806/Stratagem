import { DataSource } from 'typeorm';
import { GovernanceMetricSnapshot } from '../governance/metrics/entities/governance-metric-snapshot.entity';
import { AppDataSource } from '../data-source';

/**
 * Seeds baseline historical governance metric snapshots for the past 30 days.
 * Generates realistic trend data to populate the trends chart on first load.
 */
async function seedGovernanceMetrics() {
  console.log('Initializing data source...');
  await AppDataSource.initialize();

  try {
    const snapshotRepository = AppDataSource.getRepository(GovernanceMetricSnapshot);

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const snapshots: GovernanceMetricSnapshot[] = [];

    // Generate 30 days of baseline data with realistic trends
    for (let daysAgo = 30; daysAgo >= 0; daysAgo--) {
      const snapshotDate = new Date(today);
      snapshotDate.setUTCDate(snapshotDate.getUTCDate() - daysAgo);
      const dateKey = snapshotDate.toISOString().split('T')[0];

      // Simulate gradual improvement in compliance
      const progressFactor = (30 - daysAgo) / 30;
      const baseCompliance = 55;
      const complianceRate = Math.round((baseCompliance + progressFactor * 25) * 10) / 10; // 55% → 80%

      // Simulate control implementation ramping up
      const totalControls = 50;
      const implementedControls = Math.round(totalControls * (0.4 + progressFactor * 0.4)); // 20 → 40 controls

      // Simulate findings decreasing as controls implement
      const maxFindings = 30;
      const openFindings = Math.max(
        5,
        Math.round(maxFindings * (1 - progressFactor * 0.7)),
      ); // 30 → 9 findings

      // Critical findings follow similar trend
      const criticalFindings = Math.max(0, Math.round(openFindings * 0.2));

      // Assessment completion increases steadily
      const totalAssessments = 10;
      const completedAssessments = Math.round(totalAssessments * progressFactor * 0.9); // 0 → 9
      const assessmentCompletionRate = Math.round(
        (completedAssessments / totalAssessments) * 1000,
      ) / 10;

      // Risk closure rate improves as findings are remediated
      const riskClosureRate = Math.round(progressFactor * 70 * 10) / 10; // 0% → 70%

      const approvedEvidence = Math.round(20 + progressFactor * 30); // 20 → 50 pieces

      const snapshot = snapshotRepository.create({
        snapshot_date: dateKey,
        compliance_rate: complianceRate,
        implemented_controls: implementedControls,
        total_controls: totalControls,
        open_findings: openFindings,
        critical_findings: criticalFindings,
        assessment_completion_rate: assessmentCompletionRate,
        risk_closure_rate: riskClosureRate,
        completed_assessments: completedAssessments,
        total_assessments: totalAssessments,
        approved_evidence: approvedEvidence,
        metadata: {
          seeded: true,
          seedDate: new Date().toISOString(),
          comment: 'Baseline historical data for trend chart',
        },
      });

      snapshots.push(snapshot);
    }

    console.log(`Inserting ${snapshots.length} baseline snapshots...`);
    await snapshotRepository.save(snapshots, { chunk: 10 });

    console.log(`✅ Successfully seeded ${snapshots.length} governance metric snapshots`);
    console.log(`   Date range: ${snapshots[0].snapshot_date} to ${snapshots[snapshots.length - 1].snapshot_date}`);
    console.log(`   Compliance trajectory: ${snapshots[0].compliance_rate}% → ${snapshots[snapshots.length - 1].compliance_rate}%`);
    console.log(`   Open findings trend: ${snapshots[0].open_findings} → ${snapshots[snapshots.length - 1].open_findings}`);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  } finally {
    await AppDataSource.destroy();
  }
}

seedGovernanceMetrics().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
