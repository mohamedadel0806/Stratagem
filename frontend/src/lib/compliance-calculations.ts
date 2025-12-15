import { ControlAssetMapping, ImplementationStatus } from '@/lib/api/governance';

/**
 * Detailed metrics for asset compliance calculations
 */
export interface ComplianceMetrics {
  totalControls: number;
  implementedControls: number;
  plannedControls: number;
  inProgressControls: number;
  notImplementedControls: number;
  notApplicableControls: number;
  testedControls: number;
  passedControls: number;
  failedControls: number;
  averageEffectivenessScore: number;
  compliancePercentage: number;
  implementationPercentage: number;
  testCoveragePercentage: number;
  complianceStatus: 'compliant' | 'partially_compliant' | 'non_compliant';
  trend: 'improving' | 'stable' | 'declining';
}

/**
 * Calculate comprehensive compliance metrics for asset-control mappings
 *
 * Compliance Score Calculation:
 * - Implemented + Passed Test: 100 points
 * - Implemented + No Test: 75 points (assumed correct)
 * - Implemented + Failed Test: 25 points (partial credit)
 * - In Progress: 50 points
 * - Planned: 25 points
 * - Not Implemented: 0 points
 * - Not Applicable: Excluded from calculation
 *
 * Compliance Status Determination:
 * - Compliant: >= 90%
 * - Partially Compliant: 70-89%
 * - Non-Compliant: < 70%
 *
 * Trend Calculation:
 * - Improving: Test pass rate > implementation rate
 * - Declining: Test pass rate < implementation rate
 * - Stable: Test pass rate ≈ implementation rate
 */
export function calculateComplianceMetrics(mappings: ControlAssetMapping[]): ComplianceMetrics {
  const totalControls = mappings.length;

  // Count by implementation status
  const implementedControls = mappings.filter(
    (m) => m.implementation_status === ImplementationStatus.IMPLEMENTED
  ).length;
  const plannedControls = mappings.filter(
    (m) => m.implementation_status === ImplementationStatus.PLANNED
  ).length;
  const inProgressControls = mappings.filter(
    (m) => m.implementation_status === ImplementationStatus.IN_PROGRESS
  ).length;
  const notImplementedControls = mappings.filter(
    (m) => m.implementation_status === ImplementationStatus.NOT_IMPLEMENTED
  ).length;
  const notApplicableControls = mappings.filter(
    (m) => m.implementation_status === ImplementationStatus.NOT_APPLICABLE
  ).length;

  // Count tested controls and results
  const testedControls = mappings.filter((m) => m.last_test_date).length;
  const passedControls = mappings.filter((m) => m.last_test_result === 'passed').length;
  const failedControls = mappings.filter((m) => m.last_test_result === 'failed').length;

  // Calculate percentages
  const applicableControls = totalControls - notApplicableControls;
  const implementationPercentage =
    applicableControls > 0 ? (implementedControls / applicableControls) * 100 : 0;
  const testCoveragePercentage = totalControls > 0 ? (testedControls / totalControls) * 100 : 0;

  // Calculate average effectiveness score
  const effectivenessScores = mappings
    .filter((m) => m.effectiveness_score !== null && m.effectiveness_score !== undefined)
    .map((m) => m.effectiveness_score as number);
  const averageEffectivenessScore =
    effectivenessScores.length > 0
      ? effectivenessScores.reduce((a, b) => a + b, 0) / effectivenessScores.length
      : 0;

  // Calculate compliance percentage with weighted scoring
  let compliancePercentage = 0;
  let complianceStatus: 'compliant' | 'partially_compliant' | 'non_compliant' = 'compliant';

  if (applicableControls > 0) {
    let complianceScore = 0;

    mappings.forEach((m) => {
      if (m.implementation_status === ImplementationStatus.NOT_APPLICABLE) {
        return; // Skip non-applicable
      }

      if (m.implementation_status === ImplementationStatus.IMPLEMENTED) {
        if (m.last_test_result === 'passed') {
          complianceScore += 100; // Fully compliant
        } else if (m.last_test_result === 'failed') {
          complianceScore += 25; // Partial credit - implemented but failing
        } else {
          complianceScore += 75; // No test, assume implemented correctly
        }
      } else if (m.implementation_status === ImplementationStatus.IN_PROGRESS) {
        complianceScore += 50; // Half credit for in-progress
      } else if (m.implementation_status === ImplementationStatus.PLANNED) {
        complianceScore += 25; // Quarter credit for planned
      }
      // Not implemented adds 0 points
    });

    compliancePercentage = (complianceScore / (applicableControls * 100)) * 100;

    // Determine compliance status based on percentage
    if (compliancePercentage >= 90) {
      complianceStatus = 'compliant';
    } else if (compliancePercentage >= 70) {
      complianceStatus = 'partially_compliant';
    } else {
      complianceStatus = 'non_compliant';
    }
  }

  // Calculate trend based on test pass rate vs implementation rate
  const testPassRate = testedControls > 0 ? (passedControls / testedControls) * 100 : 0;
  const trend: 'improving' | 'stable' | 'declining' =
    testPassRate > implementationPercentage + 5
      ? 'improving'
      : testPassRate < implementationPercentage - 5
        ? 'declining'
        : 'stable';

  return {
    totalControls,
    implementedControls,
    plannedControls,
    inProgressControls,
    notImplementedControls,
    notApplicableControls,
    testedControls,
    passedControls,
    failedControls,
    averageEffectivenessScore,
    compliancePercentage: Math.round(compliancePercentage),
    implementationPercentage: Math.round(implementationPercentage),
    testCoveragePercentage: Math.round(testCoveragePercentage),
    complianceStatus,
    trend,
  };
}

/**
 * Get color class for compliance status badge
 */
export function getComplianceStatusColor(
  status: 'compliant' | 'partially_compliant' | 'non_compliant'
): string {
  switch (status) {
    case 'compliant':
      return 'bg-green-100 text-green-800 border-green-300';
    case 'partially_compliant':
      return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    case 'non_compliant':
      return 'bg-red-100 text-red-800 border-red-300';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

/**
 * Get display label for compliance status
 */
export function getComplianceStatusLabel(
  status: 'compliant' | 'partially_compliant' | 'non_compliant'
): string {
  switch (status) {
    case 'compliant':
      return 'Compliant';
    case 'partially_compliant':
      return 'Partially Compliant';
    case 'non_compliant':
      return 'Non-Compliant';
    default:
      return 'Unknown';
  }
}

/**
 * Get badge variant for implementation status
 */
export function getImplementationStatusBadgeVariant(
  status: ImplementationStatus
): 'destructive' | 'default' | 'secondary' | 'outline' {
  switch (status) {
    case ImplementationStatus.IMPLEMENTED:
      return 'default';
    case ImplementationStatus.IN_PROGRESS:
      return 'secondary';
    case ImplementationStatus.PLANNED:
      return 'outline';
    case ImplementationStatus.NOT_IMPLEMENTED:
      return 'destructive';
    case ImplementationStatus.NOT_APPLICABLE:
      return 'secondary';
    default:
      return 'outline';
  }
}

/**
 * Generate compliance report summary
 */
export function generateComplianceReport(
  mappings: ControlAssetMapping[],
  assetName?: string
): string {
  const metrics = calculateComplianceMetrics(mappings);

  const lines = [
    `Asset: ${assetName || 'Unknown'}`,
    `Date: ${new Date().toLocaleDateString()}`,
    '',
    'COMPLIANCE SUMMARY',
    `Overall Compliance: ${metrics.compliancePercentage}%`,
    `Status: ${getComplianceStatusLabel(metrics.complianceStatus)}`,
    `Trend: ${metrics.trend.charAt(0).toUpperCase() + metrics.trend.slice(1)}`,
    '',
    'IMPLEMENTATION STATUS',
    `Total Controls: ${metrics.totalControls}`,
    `Implemented: ${metrics.implementedControls} (${metrics.implementationPercentage}%)`,
    `In Progress: ${metrics.inProgressControls}`,
    `Planned: ${metrics.plannedControls}`,
    `Not Implemented: ${metrics.notImplementedControls}`,
    `Not Applicable: ${metrics.notApplicableControls}`,
    '',
    'TEST COVERAGE',
    `Controls Tested: ${metrics.testedControls} (${metrics.testCoveragePercentage}%)`,
    `Tests Passed: ${metrics.passedControls}`,
    `Tests Failed: ${metrics.failedControls}`,
    '',
    'EFFECTIVENESS',
    `Average Effectiveness Score: ${metrics.averageEffectivenessScore.toFixed(2)}/5.0`,
  ];

  return lines.join('\n');
}

/**
 * Export compliance data to CSV
 */
export function exportComplianceToCSV(
  mappings: ControlAssetMapping[],
  assetName: string = 'Asset'
): string {
  const metrics = calculateComplianceMetrics(mappings);

  const headers = [
    'Asset Name',
    'Total Controls',
    'Implemented',
    'In Progress',
    'Planned',
    'Not Implemented',
    'Not Applicable',
    'Tests Passed',
    'Tests Failed',
    'Not Tested',
    'Implementation %',
    'Test Coverage %',
    'Compliance %',
    'Compliance Status',
    'Trend',
    'Avg Effectiveness',
    'Report Date',
  ];

  const row = [
    assetName,
    metrics.totalControls,
    metrics.implementedControls,
    metrics.inProgressControls,
    metrics.plannedControls,
    metrics.notImplementedControls,
    metrics.notApplicableControls,
    metrics.passedControls,
    metrics.failedControls,
    metrics.totalControls - metrics.testedControls,
    metrics.implementationPercentage,
    metrics.testCoveragePercentage,
    metrics.compliancePercentage,
    metrics.complianceStatus,
    metrics.trend,
    metrics.averageEffectivenessScore.toFixed(2),
    new Date().toISOString().split('T')[0],
  ];

  return [headers.join(','), row.join(',')].join('\n');
}
