import { DataSource } from 'typeorm';
import { AppDataSource } from '../data-source';

/**
 * Quick validation script to verify governance_metric_snapshots seed data.
 */
async function validateMetricsData() {
  console.log('Initializing data source...');
  await AppDataSource.initialize();

  try {
    const queryRunner = AppDataSource.createQueryRunner();

    // Count total snapshots
    const result = await queryRunner.query(
      `SELECT COUNT(*) as count FROM governance_metric_snapshots`,
    );
    const total = result[0]?.count || 0;

    // Get date range
    const dateRange = await queryRunner.query(
      `SELECT MIN(snapshot_date) as earliest, MAX(snapshot_date) as latest FROM governance_metric_snapshots`,
    );
    const { earliest, latest } = dateRange[0] || {};

    // Get trend summary
    const trendSummary = await queryRunner.query(`
      SELECT 
        snapshot_date,
        compliance_rate,
        implemented_controls,
        total_controls,
        open_findings,
        critical_findings,
        assessment_completion_rate,
        risk_closure_rate
      FROM governance_metric_snapshots
      ORDER BY snapshot_date ASC
      LIMIT 1
    `);
    const firstDay = trendSummary[0];

    const latestTrend = await queryRunner.query(`
      SELECT 
        snapshot_date,
        compliance_rate,
        implemented_controls,
        total_controls,
        open_findings,
        critical_findings,
        assessment_completion_rate,
        risk_closure_rate
      FROM governance_metric_snapshots
      ORDER BY snapshot_date DESC
      LIMIT 1
    `);
    const lastDay = latestTrend[0];

    console.log('\n✅ Governance Metrics Seed Data Validation');
    console.log(`   Total snapshots: ${total}`);
    console.log(`   Date range: ${earliest} to ${latest}`);
    console.log('\n📈 Trend Summary:');
    console.log(`   Day 1 (${firstDay?.snapshot_date}):`);
    console.log(`      • Compliance: ${firstDay?.compliance_rate}%`);
    console.log(`      • Controls: ${firstDay?.implemented_controls}/${firstDay?.total_controls} implemented`);
    console.log(`      • Open findings: ${firstDay?.open_findings} (${firstDay?.critical_findings} critical)`);
    console.log(`      • Assessment completion: ${firstDay?.assessment_completion_rate}%`);
    console.log(`      • Risk closure rate: ${firstDay?.risk_closure_rate}%`);
    console.log(`\n   Day 31 (${lastDay?.snapshot_date}):`);
    console.log(`      • Compliance: ${lastDay?.compliance_rate}%`);
    console.log(`      • Controls: ${lastDay?.implemented_controls}/${lastDay?.total_controls} implemented`);
    console.log(`      • Open findings: ${lastDay?.open_findings} (${lastDay?.critical_findings} critical)`);
    console.log(`      • Assessment completion: ${lastDay?.assessment_completion_rate}%`);
    console.log(`      • Risk closure rate: ${lastDay?.risk_closure_rate}%`);

    const complianceChange = lastDay?.compliance_rate - firstDay?.compliance_rate;
    const findingsChange = firstDay?.open_findings - lastDay?.open_findings;

    console.log('\n📊 30-Day Change:');
    console.log(`   • Compliance improved: +${complianceChange}%`);
    console.log(`   • Findings reduced: -${findingsChange} (${((findingsChange / firstDay?.open_findings) * 100).toFixed(1)}% decrease)`);
    console.log(`   • Risk closure improved: +${(lastDay?.risk_closure_rate - firstDay?.risk_closure_rate).toFixed(1)}%`);

    await queryRunner.release();
  } catch (error) {
    console.error('❌ Validation failed:', error);
    process.exit(1);
  } finally {
    await AppDataSource.destroy();
  }
}

validateMetricsData().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
