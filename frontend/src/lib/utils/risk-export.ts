'use client';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Types
export interface Risk {
  id: string;
  risk_id?: string;
  title: string;
  description?: string;
  category: string;
  category_name?: string;
  status: string;
  likelihood: number;
  impact: number;
  inherent_risk_score?: number;
  inherent_risk_level?: string;
  current_risk_score?: number;
  current_risk_level?: string;
  target_risk_score?: number;
  target_risk_level?: string;
  owner_name?: string;
  date_identified?: string;
  next_review_date?: string;
  control_effectiveness?: number;
  linked_assets_count?: number;
  linked_controls_count?: number;
  active_treatments_count?: number;
  kri_count?: number;
  createdAt?: string;
}

export interface Treatment {
  id: string;
  treatment_id?: string;
  title: string;
  description?: string;
  risk_title?: string;
  strategy: string;
  status: string;
  priority: string;
  progress_percentage: number;
  treatment_owner_name?: string;
  start_date?: string;
  target_completion_date?: string;
  estimated_cost?: number;
  actual_cost?: number;
}

export interface KRI {
  id: string;
  kri_id?: string;
  name: string;
  description?: string;
  measurement_unit?: string;
  measurement_frequency: string;
  current_value?: number;
  current_status?: string;
  trend?: string;
  threshold_green?: number;
  threshold_amber?: number;
  threshold_red?: number;
  owner_name?: string;
  last_measured_at?: string;
}

export interface HeatmapCell {
  likelihood: number;
  impact: number;
  count: number;
  riskScore: number;
  riskLevel: string;
}

// Color helpers
const getRiskLevelColor = (level?: string): [number, number, number] => {
  switch (level?.toLowerCase()) {
    case 'critical': return [220, 38, 38]; // red-600
    case 'high': return [234, 88, 12]; // orange-600
    case 'medium': return [202, 138, 4]; // yellow-600
    case 'low': return [22, 163, 74]; // green-600
    default: return [100, 116, 139]; // slate-500
  }
};

const getStatusColor = (status: string): [number, number, number] => {
  switch (status?.toLowerCase()) {
    case 'mitigated':
    case 'completed': return [22, 163, 74];
    case 'assessed':
    case 'in_progress': return [37, 99, 235];
    case 'identified':
    case 'planned': return [202, 138, 4];
    case 'accepted': return [147, 51, 234];
    case 'closed':
    case 'cancelled': return [100, 116, 139];
    default: return [100, 116, 139];
  }
};

// ====================
// PDF EXPORTS
// ====================

/**
 * Generate Risk Register PDF Report
 */
export function generateRiskRegisterPDF(
  risks: Risk[],
  options?: {
    title?: string;
    includeDetails?: boolean;
    filters?: string;
  }
): void {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;

  // Header
  doc.setFillColor(30, 41, 59);
  doc.rect(0, 0, pageWidth, 25, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('GRC Platform', margin, 15);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Risk Management', pageWidth - margin - 35, 15);

  // Title and summary
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(options?.title || 'Risk Register Report', margin, 38);

  // Summary stats
  const criticalCount = risks.filter(r => r.current_risk_level === 'critical').length;
  const highCount = risks.filter(r => r.current_risk_level === 'high').length;
  const mediumCount = risks.filter(r => r.current_risk_level === 'medium').length;
  const lowCount = risks.filter(r => r.current_risk_level === 'low').length;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  
  let summaryText = `Total: ${risks.length} risks`;
  if (criticalCount > 0) summaryText += ` | Critical: ${criticalCount}`;
  if (highCount > 0) summaryText += ` | High: ${highCount}`;
  if (mediumCount > 0) summaryText += ` | Medium: ${mediumCount}`;
  if (lowCount > 0) summaryText += ` | Low: ${lowCount}`;
  
  doc.text(summaryText, margin, 45);
  
  if (options?.filters) {
    doc.text(`Filters: ${options.filters}`, margin, 50);
  }

  // Generated date
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth - margin - 50, 38);

  // Table
  const tableData = risks.map(risk => {
    const score = risk.current_risk_score || (risk.likelihood * risk.impact);
    return [
      risk.risk_id || risk.id.substring(0, 8),
      risk.title.length > 40 ? risk.title.substring(0, 37) + '...' : risk.title,
      risk.category_name || risk.category?.replace('_', ' ') || '-',
      risk.status?.replace('_', ' ') || '-',
      `${risk.likelihood}`,
      `${risk.impact}`,
      `${score}`,
      risk.current_risk_level?.toUpperCase() || '-',
      risk.owner_name || '-',
      risk.next_review_date ? new Date(risk.next_review_date).toLocaleDateString() : '-',
    ];
  });

  autoTable(doc, {
    head: [['ID', 'Title', 'Category', 'Status', 'L', 'I', 'Score', 'Level', 'Owner', 'Review Date']],
    body: tableData,
    startY: options?.filters ? 55 : 50,
    margin: { left: margin, right: margin },
    styles: {
      fontSize: 8,
      cellPadding: 2,
      overflow: 'linebreak',
      lineColor: [226, 232, 240],
      lineWidth: 0.1,
    },
    headStyles: {
      fillColor: [51, 65, 85],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8,
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    columnStyles: {
      0: { cellWidth: 20 },
      1: { cellWidth: 55 },
      2: { cellWidth: 28 },
      3: { cellWidth: 22 },
      4: { cellWidth: 10, halign: 'center' },
      5: { cellWidth: 10, halign: 'center' },
      6: { cellWidth: 15, halign: 'center' },
      7: { cellWidth: 18, halign: 'center' },
      8: { cellWidth: 30 },
      9: { cellWidth: 25 },
    },
    didParseCell: (data) => {
      // Color-code risk level column
      if (data.column.index === 7 && data.section === 'body') {
        const level = data.cell.raw?.toString().toLowerCase();
        if (level) {
          const color = getRiskLevelColor(level);
          data.cell.styles.textColor = color;
          data.cell.styles.fontStyle = 'bold';
        }
      }
    },
  });

  // Footer on all pages
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `Page ${i} of ${pageCount} | Risk Register Report`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );
  }

  doc.save(`risk-register-${new Date().toISOString().split('T')[0]}.pdf`);
}

/**
 * Generate Risk Heatmap PDF
 */
export function generateRiskHeatmapPDF(
  cells: HeatmapCell[],
  risks: Risk[]
): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 14;

  // Header
  doc.setFillColor(30, 41, 59);
  doc.rect(0, 0, pageWidth, 25, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('GRC Platform', margin, 15);

  // Title
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Risk Heatmap Analysis', margin, 38);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text(`Generated: ${new Date().toLocaleString()}`, margin, 45);

  // Draw heatmap grid
  const gridStartX = margin + 15;
  const gridStartY = 60;
  const cellSize = 28;
  const gridSize = 5;

  // Y-axis label
  doc.setFontSize(10);
  doc.setTextColor(30, 41, 59);
  doc.text('LIKELIHOOD', margin, gridStartY + (cellSize * gridSize) / 2, { angle: 90 });

  // X-axis label
  doc.text('IMPACT', gridStartX + (cellSize * gridSize) / 2, gridStartY + cellSize * gridSize + 15, { align: 'center' });

  // Draw cells
  for (let l = 5; l >= 1; l--) {
    for (let i = 1; i <= 5; i++) {
      const x = gridStartX + (i - 1) * cellSize;
      const y = gridStartY + (5 - l) * cellSize;
      const score = l * i;
      
      // Cell color based on risk score
      let fillColor: [number, number, number];
      if (score >= 20) fillColor = [220, 38, 38];
      else if (score >= 12) fillColor = [234, 88, 12];
      else if (score >= 6) fillColor = [202, 138, 4];
      else fillColor = [22, 163, 74];

      doc.setFillColor(...fillColor);
      doc.rect(x, y, cellSize, cellSize, 'F');
      
      // Find count for this cell
      const cellData = cells.find(c => c.likelihood === l && c.impact === i);
      const count = cellData?.count || 0;
      
      if (count > 0) {
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text(String(count), x + cellSize / 2, y + cellSize / 2 + 2, { align: 'center' });
      }
      
      // Grid lines
      doc.setDrawColor(255, 255, 255);
      doc.setLineWidth(0.5);
      doc.rect(x, y, cellSize, cellSize, 'S');
    }
    
    // Y-axis labels
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(8);
    doc.text(String(l), gridStartX - 5, gridStartY + (5 - l) * cellSize + cellSize / 2, { align: 'right' });
  }

  // X-axis labels
  for (let i = 1; i <= 5; i++) {
    doc.text(String(i), gridStartX + (i - 1) * cellSize + cellSize / 2, gridStartY + gridSize * cellSize + 5, { align: 'center' });
  }

  // Legend
  const legendY = gridStartY + gridSize * cellSize + 25;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Risk Level Legend', margin, legendY);

  const legendItems = [
    { label: 'Critical (20-25)', color: [220, 38, 38] as [number, number, number] },
    { label: 'High (12-19)', color: [234, 88, 12] as [number, number, number] },
    { label: 'Medium (6-11)', color: [202, 138, 4] as [number, number, number] },
    { label: 'Low (1-5)', color: [22, 163, 74] as [number, number, number] },
  ];

  legendItems.forEach((item, index) => {
    const y = legendY + 8 + index * 8;
    doc.setFillColor(...item.color);
    doc.rect(margin, y - 3, 10, 5, 'F');
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(item.label, margin + 15, y);
  });

  // Summary statistics
  const summaryY = legendY + 50;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Summary Statistics', margin, summaryY);

  const criticalCount = risks.filter(r => r.current_risk_level === 'critical').length;
  const highCount = risks.filter(r => r.current_risk_level === 'high').length;
  const mediumCount = risks.filter(r => r.current_risk_level === 'medium').length;
  const lowCount = risks.filter(r => r.current_risk_level === 'low').length;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  const stats = [
    `Total Risks: ${risks.length}`,
    `Critical: ${criticalCount} (${risks.length ? Math.round(criticalCount / risks.length * 100) : 0}%)`,
    `High: ${highCount} (${risks.length ? Math.round(highCount / risks.length * 100) : 0}%)`,
    `Medium: ${mediumCount} (${risks.length ? Math.round(mediumCount / risks.length * 100) : 0}%)`,
    `Low: ${lowCount} (${risks.length ? Math.round(lowCount / risks.length * 100) : 0}%)`,
  ];

  stats.forEach((stat, index) => {
    doc.text(stat, margin, summaryY + 8 + index * 6);
  });

  doc.save(`risk-heatmap-${new Date().toISOString().split('T')[0]}.pdf`);
}

/**
 * Generate Treatment Plan PDF
 */
export function generateTreatmentPlanPDF(treatments: Treatment[]): void {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;

  // Header
  doc.setFillColor(30, 41, 59);
  doc.rect(0, 0, pageWidth, 25, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('GRC Platform', margin, 15);

  // Title
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Risk Treatment Plan Report', margin, 38);

  // Summary
  const completed = treatments.filter(t => t.status === 'completed').length;
  const inProgress = treatments.filter(t => t.status === 'in_progress').length;
  const planned = treatments.filter(t => t.status === 'planned').length;
  const totalCost = treatments.reduce((sum, t) => sum + (t.estimated_cost || 0), 0);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text(
    `Total: ${treatments.length} | Completed: ${completed} | In Progress: ${inProgress} | Planned: ${planned} | Est. Cost: $${totalCost.toLocaleString()}`,
    margin, 45
  );

  const tableData = treatments.map(t => [
    t.treatment_id || t.id.substring(0, 8),
    t.title.length > 35 ? t.title.substring(0, 32) + '...' : t.title,
    t.risk_title ? (t.risk_title.length > 25 ? t.risk_title.substring(0, 22) + '...' : t.risk_title) : '-',
    t.strategy?.replace('_', ' ') || '-',
    t.status?.replace('_', ' ') || '-',
    t.priority || '-',
    `${t.progress_percentage}%`,
    t.treatment_owner_name || '-',
    t.target_completion_date ? new Date(t.target_completion_date).toLocaleDateString() : '-',
    t.estimated_cost ? `$${t.estimated_cost.toLocaleString()}` : '-',
  ]);

  autoTable(doc, {
    head: [['ID', 'Treatment', 'Risk', 'Strategy', 'Status', 'Priority', 'Progress', 'Owner', 'Target Date', 'Est. Cost']],
    body: tableData,
    startY: 52,
    margin: { left: margin, right: margin },
    styles: {
      fontSize: 8,
      cellPadding: 2,
      overflow: 'linebreak',
    },
    headStyles: {
      fillColor: [51, 65, 85],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    columnStyles: {
      0: { cellWidth: 18 },
      1: { cellWidth: 45 },
      2: { cellWidth: 35 },
      3: { cellWidth: 20 },
      4: { cellWidth: 22 },
      5: { cellWidth: 18 },
      6: { cellWidth: 18, halign: 'center' },
      7: { cellWidth: 28 },
      8: { cellWidth: 25 },
      9: { cellWidth: 22, halign: 'right' },
    },
  });

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `Page ${i} of ${pageCount} | Treatment Plan Report | Generated: ${new Date().toLocaleString()}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );
  }

  doc.save(`treatment-plan-${new Date().toISOString().split('T')[0]}.pdf`);
}

/**
 * Generate KRI Report PDF
 */
export function generateKRIReportPDF(kris: KRI[]): void {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;

  // Header
  doc.setFillColor(30, 41, 59);
  doc.rect(0, 0, pageWidth, 25, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('GRC Platform', margin, 15);

  doc.setTextColor(30, 41, 59);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Key Risk Indicators Report', margin, 38);

  // Summary
  const redCount = kris.filter(k => k.current_status === 'red').length;
  const amberCount = kris.filter(k => k.current_status === 'amber').length;
  const greenCount = kris.filter(k => k.current_status === 'green').length;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text(
    `Total KRIs: ${kris.length} | 🔴 Red: ${redCount} | 🟡 Amber: ${amberCount} | 🟢 Green: ${greenCount}`,
    margin, 45
  );

  const tableData = kris.map(kri => [
    kri.kri_id || kri.id.substring(0, 8),
    kri.name.length > 35 ? kri.name.substring(0, 32) + '...' : kri.name,
    kri.current_value !== undefined ? `${kri.current_value} ${kri.measurement_unit || ''}` : '-',
    kri.current_status?.toUpperCase() || '-',
    kri.trend || '-',
    kri.threshold_green !== undefined ? `≤${kri.threshold_green}` : '-',
    kri.threshold_amber !== undefined ? `≤${kri.threshold_amber}` : '-',
    kri.threshold_red !== undefined ? `>${kri.threshold_red}` : '-',
    kri.measurement_frequency || '-',
    kri.owner_name || '-',
  ]);

  autoTable(doc, {
    head: [['ID', 'KRI Name', 'Current Value', 'Status', 'Trend', 'Green', 'Amber', 'Red', 'Frequency', 'Owner']],
    body: tableData,
    startY: 52,
    margin: { left: margin, right: margin },
    styles: {
      fontSize: 8,
      cellPadding: 2,
    },
    headStyles: {
      fillColor: [51, 65, 85],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    columnStyles: {
      0: { cellWidth: 18 },
      1: { cellWidth: 50 },
      2: { cellWidth: 28 },
      3: { cellWidth: 18, halign: 'center' },
      4: { cellWidth: 20 },
      5: { cellWidth: 18, halign: 'center' },
      6: { cellWidth: 18, halign: 'center' },
      7: { cellWidth: 18, halign: 'center' },
      8: { cellWidth: 22 },
      9: { cellWidth: 28 },
    },
    didParseCell: (data) => {
      if (data.column.index === 3 && data.section === 'body') {
        const status = data.cell.raw?.toString().toLowerCase();
        if (status === 'red') {
          data.cell.styles.textColor = [220, 38, 38];
          data.cell.styles.fontStyle = 'bold';
        } else if (status === 'amber') {
          data.cell.styles.textColor = [202, 138, 4];
          data.cell.styles.fontStyle = 'bold';
        } else if (status === 'green') {
          data.cell.styles.textColor = [22, 163, 74];
          data.cell.styles.fontStyle = 'bold';
        }
      }
    },
  });

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `Page ${i} of ${pageCount} | KRI Report | Generated: ${new Date().toLocaleString()}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );
  }

  doc.save(`kri-report-${new Date().toISOString().split('T')[0]}.pdf`);
}

// ====================
// EXCEL EXPORTS
// ====================

/**
 * Export Risk Register to Excel with multiple sheets
 */
export async function exportRiskRegisterExcel(
  risks: Risk[],
  treatments?: Treatment[],
  kris?: KRI[]
): Promise<void> {
  const XLSX = await import('xlsx');
  const workbook = XLSX.utils.book_new();

  // Sheet 1: Risk Register
  const riskData = risks.map(risk => ({
    'Risk ID': risk.risk_id || risk.id,
    'Title': risk.title,
    'Description': risk.description || '',
    'Category': risk.category_name || risk.category?.replace('_', ' ') || '',
    'Status': risk.status?.replace('_', ' ') || '',
    'Likelihood': risk.likelihood,
    'Impact': risk.impact,
    'Inherent Score': risk.inherent_risk_score || '',
    'Inherent Level': risk.inherent_risk_level || '',
    'Current Score': risk.current_risk_score || (risk.likelihood * risk.impact),
    'Current Level': risk.current_risk_level || '',
    'Target Score': risk.target_risk_score || '',
    'Target Level': risk.target_risk_level || '',
    'Owner': risk.owner_name || '',
    'Date Identified': risk.date_identified ? new Date(risk.date_identified).toLocaleDateString() : '',
    'Next Review': risk.next_review_date ? new Date(risk.next_review_date).toLocaleDateString() : '',
    'Control Effectiveness': risk.control_effectiveness ? `${risk.control_effectiveness}%` : '',
    'Linked Assets': risk.linked_assets_count || 0,
    'Linked Controls': risk.linked_controls_count || 0,
    'Active Treatments': risk.active_treatments_count || 0,
    'KRIs': risk.kri_count || 0,
    'Created': risk.createdAt ? new Date(risk.createdAt).toLocaleDateString() : '',
  }));

  const riskSheet = XLSX.utils.json_to_sheet(riskData);
  XLSX.utils.book_append_sheet(workbook, riskSheet, 'Risk Register');

  // Sheet 2: Summary Statistics
  const criticalRisks = risks.filter(r => r.current_risk_level === 'critical');
  const highRisks = risks.filter(r => r.current_risk_level === 'high');
  const mediumRisks = risks.filter(r => r.current_risk_level === 'medium');
  const lowRisks = risks.filter(r => r.current_risk_level === 'low');

  const summaryData = [
    { 'Metric': 'Total Risks', 'Value': risks.length },
    { 'Metric': 'Critical Risks', 'Value': criticalRisks.length },
    { 'Metric': 'High Risks', 'Value': highRisks.length },
    { 'Metric': 'Medium Risks', 'Value': mediumRisks.length },
    { 'Metric': 'Low Risks', 'Value': lowRisks.length },
    { 'Metric': '', 'Value': '' },
    { 'Metric': 'By Status', 'Value': '' },
    ...['identified', 'assessed', 'mitigated', 'accepted', 'closed'].map(status => ({
      'Metric': `  ${status.charAt(0).toUpperCase() + status.slice(1)}`,
      'Value': risks.filter(r => r.status === status).length
    })),
    { 'Metric': '', 'Value': '' },
    { 'Metric': 'Average Risk Score', 'Value': risks.length ? Math.round(risks.reduce((sum, r) => sum + (r.current_risk_score || r.likelihood * r.impact), 0) / risks.length * 10) / 10 : 0 },
    { 'Metric': 'Risks Needing Review (< 30 days)', 'Value': risks.filter(r => {
      if (!r.next_review_date) return false;
      const reviewDate = new Date(r.next_review_date);
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
      return reviewDate <= thirtyDaysFromNow;
    }).length },
    { 'Metric': '', 'Value': '' },
    { 'Metric': 'Report Generated', 'Value': new Date().toLocaleString() },
  ];

  const summarySheet = XLSX.utils.json_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');

  // Sheet 3: Treatments (if provided)
  if (treatments && treatments.length > 0) {
    const treatmentData = treatments.map(t => ({
      'Treatment ID': t.treatment_id || t.id,
      'Title': t.title,
      'Description': t.description || '',
      'Risk': t.risk_title || '',
      'Strategy': t.strategy?.replace('_', ' ') || '',
      'Status': t.status?.replace('_', ' ') || '',
      'Priority': t.priority || '',
      'Progress': `${t.progress_percentage}%`,
      'Owner': t.treatment_owner_name || '',
      'Start Date': t.start_date ? new Date(t.start_date).toLocaleDateString() : '',
      'Target Completion': t.target_completion_date ? new Date(t.target_completion_date).toLocaleDateString() : '',
      'Estimated Cost': t.estimated_cost || '',
      'Actual Cost': t.actual_cost || '',
    }));

    const treatmentSheet = XLSX.utils.json_to_sheet(treatmentData);
    XLSX.utils.book_append_sheet(workbook, treatmentSheet, 'Treatments');
  }

  // Sheet 4: KRIs (if provided)
  if (kris && kris.length > 0) {
    const kriData = kris.map(k => ({
      'KRI ID': k.kri_id || k.id,
      'Name': k.name,
      'Description': k.description || '',
      'Current Value': k.current_value !== undefined ? `${k.current_value} ${k.measurement_unit || ''}` : '',
      'Status': k.current_status || '',
      'Trend': k.trend || '',
      'Threshold Green': k.threshold_green || '',
      'Threshold Amber': k.threshold_amber || '',
      'Threshold Red': k.threshold_red || '',
      'Frequency': k.measurement_frequency || '',
      'Owner': k.owner_name || '',
      'Last Measured': k.last_measured_at ? new Date(k.last_measured_at).toLocaleDateString() : '',
    }));

    const kriSheet = XLSX.utils.json_to_sheet(kriData);
    XLSX.utils.book_append_sheet(workbook, kriSheet, 'KRIs');
  }

  XLSX.writeFile(workbook, `risk-register-${new Date().toISOString().split('T')[0]}.xlsx`);
}

/**
 * Export Comprehensive Risk Report to Excel
 */
export async function exportComprehensiveRiskReportExcel(
  risks: Risk[],
  heatmapCells: HeatmapCell[],
  treatments: Treatment[],
  kris: KRI[]
): Promise<void> {
  await exportRiskRegisterExcel(risks, treatments, kris);
}

export interface DashboardSummary {
  total_risks?: number;
  critical_risks?: number;
  high_risks?: number;
  medium_risks?: number;
  low_risks?: number;
  active_treatments?: number;
  overdue_reviews?: number;
}

/**
 * Generate Comprehensive Dashboard PDF Report
 * Includes: Executive Summary, Risk Register, Heatmap, Treatments, KRIs
 */
export function generateComprehensiveDashboardPDF(
  risks: Risk[],
  treatments: Treatment[],
  kris: KRI[],
  heatmapCells: HeatmapCell[],
  summary?: DashboardSummary
): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  let yPos = 0;

  // Helper to add page header
  const addHeader = (title: string) => {
    doc.setFillColor(30, 41, 59);
    doc.rect(0, 0, pageWidth, 25, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('GRC Platform', margin, 15);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(title, pageWidth - margin - 60, 15);
    
    return 35;
  };

  // Helper to add page footer
  const addFooter = (pageNum: number, totalPages: number) => {
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `Page ${pageNum} of ${totalPages} | Risk Management Dashboard | Generated: ${new Date().toLocaleString()}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );
  };

  // =====================
  // PAGE 1: EXECUTIVE SUMMARY
  // =====================
  yPos = addHeader('Executive Summary');

  // Title
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('Risk Management Dashboard', margin, yPos);
  yPos += 8;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text(`Report Date: ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`, margin, yPos);
  yPos += 15;

  // Summary Statistics Box
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin, yPos, pageWidth - margin * 2, 45, 3, 3, 'F');
  
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Summary Statistics', margin + 5, yPos + 8);

  const criticalCount = summary?.critical_risks || risks.filter(r => r.current_risk_level === 'critical').length;
  const highCount = summary?.high_risks || risks.filter(r => r.current_risk_level === 'high').length;
  const mediumCount = summary?.medium_risks || risks.filter(r => r.current_risk_level === 'medium').length;
  const lowCount = summary?.low_risks || risks.filter(r => r.current_risk_level === 'low').length;

  // Stats grid
  const statsY = yPos + 18;
  const colWidth = (pageWidth - margin * 2 - 10) / 4;
  
  const drawStatBox = (x: number, label: string, value: number, color: [number, number, number]) => {
    doc.setFillColor(...color);
    doc.roundedRect(x, statsY, colWidth - 5, 22, 2, 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(String(value), x + (colWidth - 5) / 2, statsY + 10, { align: 'center' });
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text(label, x + (colWidth - 5) / 2, statsY + 17, { align: 'center' });
  };

  drawStatBox(margin + 5, 'Critical', criticalCount, [220, 38, 38]);
  drawStatBox(margin + 5 + colWidth, 'High', highCount, [234, 88, 12]);
  drawStatBox(margin + 5 + colWidth * 2, 'Medium', mediumCount, [202, 138, 4]);
  drawStatBox(margin + 5 + colWidth * 3, 'Low', lowCount, [22, 163, 74]);

  yPos += 55;

  // Key Metrics
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Key Metrics', margin, yPos);
  yPos += 8;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const metrics = [
    ['Total Risks', String(risks.length)],
    ['Active Treatments', String(treatments.filter(t => t.status === 'in_progress').length)],
    ['Completed Treatments', String(treatments.filter(t => t.status === 'completed').length)],
    ['Active KRIs', String(kris.length)],
    ['KRIs in Red Status', String(kris.filter(k => k.current_status === 'red').length)],
    ['Average Risk Score', risks.length ? String(Math.round(risks.reduce((sum, r) => {
      const score = r.current_risk_score || (r.likelihood * r.impact) || 0;
      return sum + score;
    }, 0) / risks.length * 10) / 10) : '0'],
  ];

  metrics.forEach(([label, value], i) => {
    doc.setTextColor(100, 116, 139);
    doc.text(label + ':', margin, yPos + i * 6);
    doc.setTextColor(30, 41, 59);
    doc.setFont('helvetica', 'bold');
    doc.text(value, margin + 50, yPos + i * 6);
    doc.setFont('helvetica', 'normal');
  });
  yPos += 45;

  // Risk Heatmap Mini-view
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Risk Heatmap Overview', margin, yPos);
  yPos += 8;

  // Draw mini heatmap
  const cellSize = 15;
  const gridStartX = margin + 10;
  const gridStartY = yPos;

  for (let l = 5; l >= 1; l--) {
    for (let i = 1; i <= 5; i++) {
      const x = gridStartX + (i - 1) * cellSize;
      const y = gridStartY + (5 - l) * cellSize;
      const score = l * i;
      
      let fillColor: [number, number, number];
      if (score >= 20) fillColor = [220, 38, 38];
      else if (score >= 12) fillColor = [234, 88, 12];
      else if (score >= 6) fillColor = [202, 138, 4];
      else fillColor = [22, 163, 74];

      doc.setFillColor(...fillColor);
      doc.rect(x, y, cellSize, cellSize, 'F');
      
      const cellData = heatmapCells.find(c => c.likelihood === l && c.impact === i);
      if (cellData && cellData.count > 0) {
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.text(String(cellData.count), x + cellSize / 2, y + cellSize / 2 + 2, { align: 'center' });
      }
      
      doc.setDrawColor(255, 255, 255);
      doc.setLineWidth(0.3);
      doc.rect(x, y, cellSize, cellSize, 'S');
    }
  }

  // Axis labels
  doc.setTextColor(100, 116, 139);
  doc.setFontSize(8);
  doc.text('Impact →', gridStartX + cellSize * 2.5, gridStartY + cellSize * 5 + 8, { align: 'center' });
  doc.text('Likelihood', gridStartX - 8, gridStartY + cellSize * 2.5, { angle: 90 });

  // =====================
  // PAGE 2: TOP RISKS TABLE
  // =====================
  doc.addPage();
  yPos = addHeader('Top Risks');

  doc.setTextColor(30, 41, 59);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Risk Register - Top 15 Risks by Score', margin, yPos);
  yPos += 5;

  // Sort risks by score and take top 15
  const topRisks = [...risks]
    .sort((a, b) => {
      const scoreA = a.current_risk_score || (a.likelihood * a.impact) || 0;
      const scoreB = b.current_risk_score || (b.likelihood * b.impact) || 0;
      return scoreB - scoreA;
    })
    .slice(0, 15);

  const riskTableData = topRisks.map(risk => {
    const score = risk.current_risk_score || (risk.likelihood * risk.impact) || 0;
    return [
      risk.risk_id || risk.id.substring(0, 8),
      risk.title.length > 35 ? risk.title.substring(0, 32) + '...' : risk.title,
      risk.category_name || risk.category?.replace('_', ' ') || '-',
      risk.status?.replace('_', ' ') || '-',
      String(score),
      risk.current_risk_level?.toUpperCase() || '-',
      risk.owner_name || '-',
    ];
  });

  autoTable(doc, {
    head: [['ID', 'Title', 'Category', 'Status', 'Score', 'Level', 'Owner']],
    body: riskTableData,
    startY: yPos,
    margin: { left: margin, right: margin },
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [51, 65, 85], textColor: [255, 255, 255], fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    columnStyles: {
      0: { cellWidth: 18 },
      1: { cellWidth: 50 },
      2: { cellWidth: 28 },
      3: { cellWidth: 22 },
      4: { cellWidth: 15, halign: 'center' },
      5: { cellWidth: 18, halign: 'center' },
      6: { cellWidth: 28 },
    },
  });

  // =====================
  // PAGE 3: TREATMENTS
  // =====================
  if (treatments.length > 0) {
    doc.addPage();
    yPos = addHeader('Treatment Plans');

    doc.setTextColor(30, 41, 59);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Active Treatment Plans', margin, yPos);
    yPos += 5;

    const treatmentTableData = treatments.slice(0, 15).map(t => [
      t.treatment_id || t.id.substring(0, 8),
      t.title.length > 30 ? t.title.substring(0, 27) + '...' : t.title,
      t.strategy?.replace('_', ' ') || '-',
      t.status?.replace('_', ' ') || '-',
      t.priority || '-',
      `${t.progress_percentage}%`,
      t.target_completion_date ? new Date(t.target_completion_date).toLocaleDateString() : '-',
    ]);

    autoTable(doc, {
      head: [['ID', 'Treatment', 'Strategy', 'Status', 'Priority', 'Progress', 'Target Date']],
      body: treatmentTableData,
      startY: yPos,
      margin: { left: margin, right: margin },
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [51, 65, 85], textColor: [255, 255, 255], fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [248, 250, 252] },
    });
  }

  // =====================
  // PAGE 4: KRIs
  // =====================
  if (kris.length > 0) {
    doc.addPage();
    yPos = addHeader('Key Risk Indicators');

    doc.setTextColor(30, 41, 59);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Key Risk Indicators Status', margin, yPos);
    yPos += 5;

    const kriTableData = kris.slice(0, 15).map(kri => [
      kri.kri_id || kri.id.substring(0, 8),
      kri.name.length > 30 ? kri.name.substring(0, 27) + '...' : kri.name,
      kri.current_value !== undefined ? `${kri.current_value} ${kri.measurement_unit || ''}` : '-',
      kri.current_status?.toUpperCase() || '-',
      kri.trend || '-',
      kri.owner_name || '-',
    ]);

    autoTable(doc, {
      head: [['ID', 'KRI Name', 'Current Value', 'Status', 'Trend', 'Owner']],
      body: kriTableData,
      startY: yPos,
      margin: { left: margin, right: margin },
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [51, 65, 85], textColor: [255, 255, 255], fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      didParseCell: (data) => {
        if (data.column.index === 3 && data.section === 'body') {
          const status = data.cell.raw?.toString().toLowerCase();
          if (status === 'red') {
            data.cell.styles.textColor = [220, 38, 38];
            data.cell.styles.fontStyle = 'bold';
          } else if (status === 'amber') {
            data.cell.styles.textColor = [202, 138, 4];
            data.cell.styles.fontStyle = 'bold';
          } else if (status === 'green') {
            data.cell.styles.textColor = [22, 163, 74];
            data.cell.styles.fontStyle = 'bold';
          }
        }
      },
    });
  }

  // Add footers to all pages
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    addFooter(i, pageCount);
  }

  doc.save(`risk-dashboard-report-${new Date().toISOString().split('T')[0]}.pdf`);
}

