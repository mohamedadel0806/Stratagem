# Report Template System - Usage Guide

## Overview

The Report Template system allows you to create reusable report configurations that can generate Excel, CSV, or PDF reports on-demand or on a schedule. Previously, templates only created database records without actual report generation. This has been fixed to provide full functionality.

## How It Works

### 1. **Create a Report Template**

Navigate to `/dashboard/assets/reports` and click "New Template" to create a report template with:

- **Name & Description**: Identify the report
- **Report Type**: Choose from:
  - Asset Inventory
  - Compliance Report
  - Security Test Report
  - Software Inventory
  - Contract Expiration
  - Supplier Criticality
  - Custom
- **Export Format**: Excel (.xlsx), PDF, or CSV
- **Field Selection**: (Optional) Select specific fields to include
- **Filters**: (Optional) Apply filters to the data
- **Grouping**: (Optional) Group data by specific criteria
- **Scheduling**: (Optional) Set up automatic report generation:
  - Frequency: Daily, Weekly, Monthly, Quarterly, Yearly
  - Time: Specific time of day
  - Distribution List: Email addresses to receive the report

### 2. **Generate Reports**

#### Manual Generation
1. Go to `/dashboard/assets/reports`
2. Find your template card
3. Click **"Generate Report"** button
4. The report will be automatically downloaded in the configured format

#### Scheduled Generation
- Templates with `isScheduled: true` are automatically processed by the scheduler
- The scheduler runs every hour and checks for templates with `nextRunAt <= now`
- Reports are generated and sent to the configured email distribution list
- You can also manually trigger scheduled reports using the **"Send Now"** button

### 3. **Backend Implementation**

#### Report Generation Flow

```
User clicks "Generate Report"
    ↓
Frontend calls: POST /assets/report-templates/:id/generate
    ↓
Backend ReportTemplateService.generateReport()
    ↓
1. Fetch data based on report type
2. Apply field selection (if configured)
3. Apply filters (if configured)
4. Generate file (Excel/CSV/PDF)
    ↓
Return file buffer with proper headers
    ↓
Frontend downloads the file
```

#### File Generation

- **Excel (.xlsx)**: Uses `xlsx` library to create Excel workbooks
- **CSV**: Uses `csv-stringify` to generate CSV files
- **PDF**: Currently generates CSV format (can be enhanced with PDF library)

#### Scheduled Reports

- Scheduler runs via `@Cron(CronExpression.EVERY_HOUR)`
- Checks for templates where `nextRunAt <= now`
- Generates report and sends via email distribution list
- Updates `lastRunAt` and calculates `nextRunAt` for next run

## API Endpoints

### Create Template
```
POST /assets/report-templates
Body: CreateReportTemplateDto
```

### List Templates
```
GET /assets/report-templates
```

### Get Template
```
GET /assets/report-templates/:id
```

### Update Template
```
PUT /assets/report-templates/:id
Body: UpdateReportTemplateDto
```

### Generate Report (Download)
```
POST /assets/report-templates/:id/generate
Response: File download (blob)
```

### Send Scheduled Report
```
POST /assets/report-templates/:id/send
```

### Delete Template
```
DELETE /assets/report-templates/:id
```

## Report Types and Data Sources

### Asset Inventory
- **Data Source**: `PhysicalAssetService.findAll()`
- **Fields**: All physical asset fields
- **Filters**: Asset type, criticality, location, etc.

### Compliance Report
- **Data Source**: `InformationAssetService.getComplianceReport()`
- **Fields**: Asset name, classification, compliance requirements, owner
- **Filters**: Compliance requirement (ISO 27001, SOC 2, etc.)

### Security Test Report
- **Data Source**: `BusinessApplicationService.findAll()`
- **Fields**: Application details, security test results, severity
- **Filters**: Test status, severity level

### Software Inventory
- **Data Source**: `SoftwareAssetService.getInventoryReport()`
- **Fields**: Software name, version, patch level, license info
- **Grouping**: By type, vendor, or none

### Contract Expiration
- **Data Source**: `SupplierService.getExpiringContracts(days)`
- **Fields**: Supplier name, contract dates, status, days until expiration
- **Filters**: Days until expiration (default: 90)

### Supplier Criticality
- **Data Source**: `SupplierService.getCriticalSuppliersReport()`
- **Fields**: Supplier name, criticality level, risk assessment, owner
- **Filters**: Criticality level

## Field Selection

When `fieldSelection` is configured, only the specified fields are included in the report:

```typescript
fieldSelection: ['name', 'criticalityLevel', 'owner', 'createdAt']
```

This allows you to create focused reports with only relevant information.

## Scheduling

### Frequency Options
- **Daily**: Runs every day at the specified time
- **Weekly**: Runs once per week
- **Monthly**: Runs once per month
- **Quarterly**: Runs every 3 months
- **Yearly**: Runs once per year
- **Custom**: Use cron expression for complex schedules

### Next Run Calculation
The system automatically calculates `nextRunAt` based on:
- Current date/time
- Schedule frequency
- Schedule time (HH:mm format)
- Custom cron expression (if provided)

## Email Distribution

Reports can be automatically sent to email distribution lists:

1. Create an email distribution list at `/dashboard/assets/email-distribution-lists`
2. Add email addresses or link users
3. Assign the distribution list to a report template
4. Scheduled reports will be sent to all addresses in the list

**Note**: Email sending is currently a placeholder. Integrate with your email service (nodemailer, SendGrid, AWS SES) in `EmailDistributionListService.sendReportEmail()`.

## Example Usage

### Creating a Weekly Asset Inventory Report

1. **Create Template**:
   - Name: "Weekly Physical Assets Report"
   - Type: Asset Inventory
   - Format: Excel
   - Field Selection: `['uniqueIdentifier', 'assetDescription', 'criticalityLevel', 'owner', 'businessUnit']`
   - Schedule: Weekly, Monday 9:00 AM
   - Distribution List: "IT Management Team"

2. **Result**:
   - Every Monday at 9 AM, the system generates an Excel file
   - File contains only selected fields
   - File is emailed to the IT Management Team
   - You can also manually generate it anytime using "Generate Report"

### Generating a One-Time Compliance Report

1. **Create Template**:
   - Name: "ISO 27001 Compliance Report"
   - Type: Compliance Report
   - Format: PDF
   - Filters: `{ complianceRequirement: 'ISO 27001' }`

2. **Generate**:
   - Click "Generate Report" button
   - Report downloads immediately with filtered data

## Troubleshooting

### Report Not Generating
- Check that the template is active (`isActive: true`)
- Verify the report type has a valid data source
- Check backend logs for errors

### Scheduled Reports Not Sending
- Verify `isScheduled: true` and `isActive: true`
- Check that `nextRunAt` is in the past
- Verify email distribution list is configured
- Check scheduler logs: `ScheduledReportScheduler`

### File Download Issues
- Ensure browser allows file downloads
- Check network tab for API errors
- Verify file format is supported (Excel/CSV)

## Future Enhancements

1. **PDF Generation**: Integrate proper PDF library (pdfkit, puppeteer) for formatted PDF reports
2. **Email Integration**: Complete email sending functionality
3. **Report Preview**: Add preview before generation
4. **Custom Templates**: Support for custom report layouts
5. **Report History**: Track all generated reports with download links
6. **Advanced Filtering**: UI for building complex filter criteria
7. **Field Mapping**: Rename fields in reports for better readability

## Technical Details

### Dependencies
- `xlsx`: Excel file generation
- `csv-stringify`: CSV file generation
- `@nestjs/schedule`: Cron job scheduling

### Database Schema
- `report_templates` table stores template configurations
- `email_distribution_lists` table stores email recipients
- Templates track `lastRunAt` and `nextRunAt` for scheduling

### File Storage
- Reports are generated in-memory as buffers
- Files are streamed directly to the client (no disk storage)
- For scheduled reports, files are attached to emails



