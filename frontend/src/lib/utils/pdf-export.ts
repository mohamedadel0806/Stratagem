'use client';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface PDFExportOptions {
  title: string;
  subtitle?: string;
  filename: string;
  orientation?: 'portrait' | 'landscape';
  pageSize?: 'a4' | 'letter';
}

export interface TableColumn {
  header: string;
  dataKey: string;
  width?: number;
}

/**
 * Generate a PDF document with a table
 */
export function generatePDFTable(
  data: Record<string, any>[],
  columns: TableColumn[],
  options: PDFExportOptions
): void {
  const doc = new jsPDF({
    orientation: options.orientation || 'portrait',
    unit: 'mm',
    format: options.pageSize || 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;

  // Add header with logo placeholder and title
  doc.setFillColor(30, 41, 59); // slate-800
  doc.rect(0, 0, pageWidth, 25, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('GRC Platform', margin, 15);
  
  // Title
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(options.title, margin, 38);
  
  // Subtitle
  if (options.subtitle) {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139); // slate-500
    doc.text(options.subtitle, margin, 45);
  }

  // Generated date
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184); // slate-400
  doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth - margin - 50, 38);

  // Table
  const tableHeaders = columns.map(col => col.header);
  const tableData = data.map(row => 
    columns.map(col => {
      const value = row[col.dataKey];
      if (value === null || value === undefined) return '';
      if (typeof value === 'object') return JSON.stringify(value);
      return String(value);
    })
  );

  autoTable(doc, {
    head: [tableHeaders],
    body: tableData,
    startY: options.subtitle ? 52 : 45,
    margin: { left: margin, right: margin },
    styles: {
      fontSize: 8,
      cellPadding: 3,
      overflow: 'linebreak',
      lineColor: [226, 232, 240], // slate-200
      lineWidth: 0.1,
    },
    headStyles: {
      fillColor: [51, 65, 85], // slate-700
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 9,
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252], // slate-50
    },
    columnStyles: columns.reduce((acc, col, index) => {
      if (col.width) {
        acc[index] = { cellWidth: col.width };
      }
      return acc;
    }, {} as Record<number, { cellWidth: number }>),
  });

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `Page ${i} of ${pageCount}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );
  }

  // Download
  doc.save(`${options.filename}.pdf`);
}

/**
 * Generate a PDF document for a single asset detail
 */
export function generateAssetDetailPDF(
  asset: Record<string, any>,
  assetType: string,
  sections: { title: string; fields: { label: string; value: string }[] }[]
): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 14;
  let yPosition = 0;

  // Header
  doc.setFillColor(30, 41, 59);
  doc.rect(0, 0, pageWidth, 30, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('GRC Platform', margin, 15);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Asset Management Report', margin, 23);

  yPosition = 40;

  // Asset title and type badge
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(asset.assetName || asset.assetDescription || 'Asset Details', margin, yPosition);
  
  // Type badge
  doc.setFillColor(219, 234, 254); // blue-100
  doc.setTextColor(29, 78, 216); // blue-700
  doc.setFontSize(8);
  const typeText = assetType.charAt(0).toUpperCase() + assetType.slice(1);
  const typeWidth = doc.getTextWidth(typeText) + 6;
  doc.roundedRect(margin, yPosition + 4, typeWidth, 6, 1, 1, 'F');
  doc.text(typeText, margin + 3, yPosition + 8);

  // Asset identifier
  if (asset.assetIdentifier) {
    doc.setTextColor(100, 116, 139);
    doc.setFontSize(10);
    doc.text(asset.assetIdentifier, margin + typeWidth + 5, yPosition + 8);
  }

  yPosition += 20;

  // Sections
  sections.forEach((section) => {
    // Check if we need a new page
    if (yPosition > 260) {
      doc.addPage();
      yPosition = 20;
    }

    // Section header
    doc.setFillColor(248, 250, 252); // slate-50
    doc.rect(margin, yPosition - 4, pageWidth - margin * 2, 8, 'F');
    doc.setTextColor(51, 65, 85); // slate-700
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(section.title, margin + 3, yPosition);
    yPosition += 10;

    // Fields
    section.fields.forEach((field) => {
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(100, 116, 139);
      doc.text(`${field.label}:`, margin, yPosition);
      
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(30, 41, 59);
      const valueX = margin + 50;
      const maxWidth = pageWidth - valueX - margin;
      
      // Handle long values with text wrapping
      const splitText = doc.splitTextToSize(field.value || '-', maxWidth);
      doc.text(splitText, valueX, yPosition);
      yPosition += splitText.length * 5 + 2;
    });

    yPosition += 8;
  });

  // Generated timestamp
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text(`Generated: ${new Date().toLocaleString()}`, margin, doc.internal.pageSize.getHeight() - 10);

  // Download
  const filename = `${assetType}-${asset.assetIdentifier || asset.id || 'asset'}-details`;
  doc.save(`${filename}.pdf`);
}

/**
 * Generate Audit Trail PDF
 */
export function generateAuditTrailPDF(
  logs: any[],
  assetName: string,
  assetType: string
): void {
  const columns: TableColumn[] = [
    { header: 'Date/Time', dataKey: 'createdAt', width: 35 },
    { header: 'Action', dataKey: 'action', width: 20 },
    { header: 'Field', dataKey: 'fieldName', width: 25 },
    { header: 'Old Value', dataKey: 'oldValue', width: 35 },
    { header: 'New Value', dataKey: 'newValue', width: 35 },
    { header: 'Changed By', dataKey: 'changedByName', width: 25 },
    { header: 'Reason', dataKey: 'changeReason', width: 30 },
  ];

  const formattedData = logs.map(log => ({
    createdAt: new Date(log.createdAt).toLocaleString(),
    action: log.action,
    fieldName: log.fieldName || '-',
    oldValue: formatAuditValue(log.oldValue),
    newValue: formatAuditValue(log.newValue),
    changedByName: log.changedBy ? `${log.changedBy.firstName} ${log.changedBy.lastName}` : 'System',
    changeReason: log.changeReason || '-',
  }));

  generatePDFTable(formattedData, columns, {
    title: `Audit Trail - ${assetName}`,
    subtitle: `Complete change history for this ${assetType} asset`,
    filename: `${assetType}-audit-trail-${Date.now()}`,
    orientation: 'landscape',
  });
}

/**
 * Generate Asset Report PDF (multiple assets)
 */
export function generateAssetReportPDF(
  assets: any[],
  reportType: 'by-type' | 'by-criticality' | 'without-owner' | 'all',
  title: string
): void {
  let columns: TableColumn[];
  let formattedData: Record<string, any>[];

  switch (reportType) {
    case 'without-owner':
      columns = [
        { header: 'Asset Name', dataKey: 'name', width: 50 },
        { header: 'Type', dataKey: 'type', width: 25 },
        { header: 'Identifier', dataKey: 'identifier', width: 35 },
        { header: 'Criticality', dataKey: 'criticality', width: 25 },
        { header: 'Created', dataKey: 'createdAt', width: 30 },
      ];
      formattedData = assets.map(a => ({
        name: a.assetName || a.assetDescription || a.name || '-',
        type: a.assetType || a.type || '-',
        identifier: a.assetIdentifier || a.identifier || '-',
        criticality: a.criticalityLevel || '-',
        createdAt: a.createdAt ? new Date(a.createdAt).toLocaleDateString() : '-',
      }));
      break;
    
    case 'by-criticality':
      columns = [
        { header: 'Criticality', dataKey: 'criticality', width: 25 },
        { header: 'Asset Name', dataKey: 'name', width: 45 },
        { header: 'Type', dataKey: 'type', width: 25 },
        { header: 'Identifier', dataKey: 'identifier', width: 35 },
        { header: 'Owner', dataKey: 'owner', width: 30 },
      ];
      formattedData = assets.map(a => ({
        criticality: a.criticalityLevel || '-',
        name: a.assetName || a.assetDescription || a.name || '-',
        type: a.assetType || a.type || '-',
        identifier: a.assetIdentifier || a.identifier || '-',
        owner: a.ownerName || a.owner?.email || '-',
      }));
      break;
    
    default:
      columns = [
        { header: 'Type', dataKey: 'type', width: 25 },
        { header: 'Asset Name', dataKey: 'name', width: 45 },
        { header: 'Identifier', dataKey: 'identifier', width: 35 },
        { header: 'Criticality', dataKey: 'criticality', width: 25 },
        { header: 'Owner', dataKey: 'owner', width: 30 },
      ];
      formattedData = assets.map(a => ({
        type: a.assetType || a.type || '-',
        name: a.assetName || a.assetDescription || a.name || '-',
        identifier: a.assetIdentifier || a.identifier || '-',
        criticality: a.criticalityLevel || '-',
        owner: a.ownerName || a.owner?.email || '-',
      }));
  }

  generatePDFTable(formattedData, columns, {
    title,
    subtitle: `${assets.length} assets • Generated from GRC Platform`,
    filename: `asset-report-${reportType}-${Date.now()}`,
    orientation: 'landscape',
  });
}

/**
 * Helper to format audit values
 */
function formatAuditValue(value: any): string {
  if (value === null || value === undefined) return '-';
  if (typeof value === 'object') {
    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  }
  const str = String(value);
  return str.length > 50 ? str.substring(0, 47) + '...' : str;
}









