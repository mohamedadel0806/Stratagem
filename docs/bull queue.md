Bull Queue Implementation Flows for Governance Module
Document Version: 1.1
Date: December 2024
Purpose: Define Bull Queue usage patterns for asynchronous operations in Governance Module

Table of Contents
Overview
Prerequisites & Dependencies
Queue Architecture
Core Governance Flows
Implementation Patterns
Rate Limiting & Throttling
Dead Letter Queue (DLQ) Handling
Error Handling & Retry Logic
Graceful Shutdown
Monitoring & Observability
Security Considerations
Testing Strategies
Production Considerations
Troubleshooting Guide
Code Examples
Overview
Why Bull Queue for Governance?
The Governance Module handles several time-consuming operations that benefit from asynchronous processing:

Policy Distribution - Send to thousands of users
Assessment Scheduling - Trigger periodic assessments
Report Generation - Create complex compliance reports
Evidence Collection - Fetch from external systems (SIEM, scanners)
Notification Delivery - Multi-channel notifications
Audit Package Generation - Compile evidence and controls
Data Export - Generate large Excel/PDF files
Framework Import - Process bulk control imports
Benefits
✅ Non-blocking operations (better UX)
✅ Automatic retry on failure
✅ Scheduled/delayed execution
✅ Job prioritization
✅ Rate limiting
✅ Job progress tracking
✅ Dead letter queues for failed jobs
✅ Horizontal scaling
Prerequisites & Dependencies
Required Packages
# Core Bull packages
npm install @nestjs/bull bull
npm install --save-dev @types/bull

# Redis client
npm install ioredis

# Optional: Bull Board for UI monitoring
npm install @bull-board/express @bull-board/api
Redis Configuration
// redis.config.ts
export const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT, 10) || 6379,
  password: process.env.REDIS_PASSWORD,
  db: parseInt(process.env.REDIS_DB, 10) || 0,
  maxRetriesPerRequest: 3,
  retryDelayOnFailover: 100,
  enableReadyCheck: true,
  // TLS for production
  tls: process.env.NODE_ENV === 'production' ? {} : undefined,
};
Environment Variables
# .env
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your-secure-password
REDIS_DB=0

# Queue settings
QUEUE_DEFAULT_ATTEMPTS=5
QUEUE_DEFAULT_BACKOFF=2000
QUEUE_STALLED_INTERVAL=30000
QUEUE_MAX_STALLED_COUNT=3
Module Setup
// app.module.ts
import { BullModule } from '@nestjs/bull';
import { redisConfig } from './config/redis.config';

@Module({
  imports: [
    BullModule.forRoot({
      redis: redisConfig,
      defaultJobOptions: {
        removeOnComplete: 100, // Keep last 100 completed jobs
        removeOnFail: 1000,    // Keep last 1000 failed jobs
      },
      settings: {
        stalledInterval: 30000,
        maxStalledCount: 3,
        lockDuration: 30000,
        lockRenewTime: 15000,
      },
    }),
    GovernanceQueuesModule,
  ],
})
export class AppModule {}
Queue Architecture
Queue Setup
┌─────────────────────────────────────────────────────────────┐
│                    Governance Module                         │
│                                                               │
│  ┌────────────────────────────────────────────────────────┐  │
│  │                   Redis (Bull Queue)                    │  │
│  │                                                          │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │  │
│  │  │   Policy Q   │  │  Assessment  │  │  Reporting   │  │  │
│  │  │              │  │      Q       │  │      Q       │  │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘  │  │
│  │                                                          │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │  │
│  │  │  Evidence Q  │  │Notification  │  │   Export Q   │  │  │
│  │  │              │  │      Q       │  │              │  │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘  │  │
│  │                                                          │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                               │
│  ┌────────────────────────────────────────────────────────┐  │
│  │              Queue Processors                          │  │
│  │  - Policy Processor                                    │  │
│  │  - Assessment Processor                                │  │
│  │  - Reporting Processor                                 │  │
│  │  - Evidence Processor                                  │  │
│  │  - Notification Processor                              │  │
│  │  - Export Processor                                    │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                               │
└─────────────────────────────────────────────────────────────┘
Queues Required
Queue	Purpose	Priority	Concurrency
governance:policy	Policy distribution, publication	Medium	5
governance:assessment	Assessment scheduling, execution	Medium	3
governance:reporting	Report generation	Low	2
governance:evidence	Evidence collection, processing	Medium	4
governance:notification	Email, in-app notifications	High	10
governance:export	Data export (Excel, PDF)	Low	2
governance:audit	Audit package generation	Low	1
governance:import	Control/framework import	Low	2
Core Governance Flows
Flow 1: Policy Publication & Distribution
User publishes policy
        │
        ▼
┌───────────────────────┐
│ POST /policies/:id/   │
│     publish           │
└───────────────────────┘
        │
        ▼
┌───────────────────────────────────────────┐
│ 1. Update policy status to "PUBLISHED"    │
│ 2. Get assigned users (roles/BUs)         │
│ 3. Create publishing transaction record   │
└───────────────────────────────────────────┘
        │
        ▼
┌──────────────────────────────────────────┐
│ Add job to governance:policy queue       │
│ Job Type: DISTRIBUTE_POLICY              │
│ Payload:                                 │
│  - policyId: UUID                        │
│  - recipientIds: UUID[]                  │
│  - publishedAt: timestamp                │
│ Priority: MEDIUM                         │
│ Attempts: 5                              │
│ Backoff: exponential (2s, 10s, 30s...)   │
└──────────────────────────────────────────┘
        │
        ▼ (Immediate Response to User)
   Return 202 Accepted
   { jobId: "policy-pub-123" }

        │
        ├─────────────────────────────────────────────┐
        │                                              │
        ▼                                              ▼
   User gets feedback                    Queue Processor Processes
                                               │
                                               ▼
                                    ┌──────────────────────────┐
                                    │ Process DISTRIBUTE_POLICY│
                                    │ - Get policy content     │
                                    │ - Get recipients         │
                                    │ - Chunk: 100 per batch   │
                                    └──────────────────────────┘
                                               │
                                               ▼
                                    ┌──────────────────────────┐
                                    │ For each batch:          │
                                    │ - Send notifications     │
                                    │ - Create assignments     │
                                    │ - Record delivery logs   │
                                    │ - Update progress (%)    │
                                    └──────────────────────────┘
                                               │
                                               ▼
                                    ┌──────────────────────────┐
                                    │ Job Complete             │
                                    │ - Log success            │
                                    │ - Send completion event  │
                                    │ - Update dashboard       │
                                    └──────────────────────────┘
Job Definition:

interface PolicyDistributionJob {
  policyId: string;
  recipientIds: string[];
  publishedAt: Date;
  batchSize?: number; // default: 100
  delayBetweenBatches?: number; // default: 1000ms
}
Flow 2: Assessment Scheduling & Execution
Admin creates assessment schedule
        │
        ▼
┌─────────────────────────────┐
│ POST /assessments/schedule  │
│ Frequency: MONTHLY          │
│ StartDate: 2024-01-15       │
│ Controls: [c1, c2, c3...]   │
└─────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────┐
│ 1. Create assessment_schedule record        │
│ 2. Calculate next execution date            │
│ 3. Return schedule ID                       │
└─────────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────┐
│ Create Recurring Job:                       │
│ Queue: governance:assessment                │
│ Type: SCHEDULE_ASSESSMENT                   │
│ Repeat: { pattern: "0 0 15 * *" }  // cron  │
│ Payload:                                    │
│  - scheduleId: UUID                         │
│  - assessmentType: "CONTROL_TESTING"        │
│  - controlIds: UUID[]                       │
│  - assignToRoles: ["auditor", "owner"]      │
│ JobId: `assessment-schedule-${scheduleId}`  │
└─────────────────────────────────────────────┘
        │
        ├─ Repeat Monthly ────────────┐
        │                              ▼
        │                     ┌──────────────────────────┐
        │                     │ Cron Trigger Fires       │
        │                     │ 00:00 on 15th of month   │
        │                     └──────────────────────────┘
        │                              │
        │                              ▼
        │                     ┌──────────────────────────┐
        │                     │ 1. Check if enabled      │
        │                     │ 2. Fetch schedule config │
        │                     │ 3. Create assessment     │
        │                     │ 4. Assign to users       │
        │                     │ 5. Send notifications    │
        │                     └──────────────────────────┘
        │                              │
        │                              ▼
        │                     ┌──────────────────────────┐
        │                     │ Assessment Created       │
        │                     │ Ready for execution      │
        │                     └──────────────────────────┘
        │
        └─ Returns immediately (scheduled in background)
Job Definition:

interface AssessmentScheduleJob {
  scheduleId: string;
  assessmentType: "CONTROL_TESTING" | "MANUAL" | "AUTO";
  controlIds: string[];
  assignToRoles: string[];
  assignToUsers?: string[];
  dueDate: Date;
  notifyAssignees?: boolean;
}
Flow 3: Report Generation
User requests compliance report
        │
        ▼
┌────────────────────────────────┐
│ POST /reports/generate         │
│ ReportType: FRAMEWORK_SCORECARD│
│ Framework: ISO27001            │
│ Format: PDF                     │
│ IncludeEvidence: true          │
└────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────┐
│ 1. Validate report parameters               │
│ 2. Create report_generation record          │
│ 3. Set status: QUEUED                       │
└─────────────────────────────────────────────┘
        │
        ▼
┌──────────────────────────────────────────┐
│ Add job to governance:reporting queue    │
│ Job Type: GENERATE_REPORT                │
│ JobId: `report-${reportId}`              │
│ Priority: LOW (can wait)                 │
│ Timeout: 300000ms (5 min)                │
│ Payload:                                 │
│  - reportId: UUID                        │
│  - reportType: string                    │
│  - framework: string                     │
│  - format: "PDF" | "XLSX" | "JSON"       │
│  - includeEvidence: boolean               │
│  - userId: UUID                          │
└──────────────────────────────────────────┘
        │
        ▼ (Immediate Response)
    Return 202 Accepted
    { reportId: "rpt-123", 
      statusUrl: "/api/reports/rpt-123/status",
      downloadUrl: "/api/reports/rpt-123/download" }

    User sees report as "Generating..."

        │
        ├──────────────────────────────┐
        │                               ▼
        │                      Queue Processor
        │                               │
        │                               ▼
        │                      ┌──────────────────────┐
        │                      │ Load report config   │
        │                      │ Get data from DB:    │
        │                      │ - Controls (500+)    │
        │                      │ - Assessments        │
        │                      │ - Evidence           │
        │                      │ - Compliance status  │
        │                      └──────────────────────┘
        │                               │
        │                               ▼
        │                      ┌──────────────────────┐
        │                      │ Update job.progress  │
        │                      │ progress: 25%        │
        │                      └──────────────────────┘
        │                               │
        │                               ▼
        │                      ┌──────────────────────┐
        │                      │ Generate PDF         │
        │                      │ (using pdf-lib)      │
        │                      │ - Headers/footers    │
        │                      │ - Charts/graphs      │
        │                      │ - Tables             │
        │                      └──────────────────────┘
        │                               │
        │                               ▼
        │                      ┌──────────────────────┐
        │                      │ progress: 75%        │
        │                      └──────────────────────┘
        │                               │
        │                               ▼
        │                      ┌──────────────────────┐
        │                      │ Upload to MinIO      │
        │                      │ Path:                │
        │                      │ /reports/2024/       │
        │                      │ report-${id}.pdf     │
        │                      └──────────────────────┘
        │                               │
        │                               ▼
        │                      ┌──────────────────────┐
        │                      │ progress: 90%        │
        │                      │ Save file reference  │
        │                      │ to report record     │
        │                      └──────────────────────┘
        │                               │
        │                               ▼
        │                      ┌──────────────────────┐
        │                      │ Send completion      │
        │                      │ notification to user │
        │                      └──────────────────────┘
        │                               │
        │                               ▼
        │                      ┌──────────────────────┐
        │                      │ Job Completed        │
        │                      │ status: COMPLETED    │
        │                      │ progress: 100%       │
        │                      └──────────────────────┘
        │
        └─────────────────────────────────────┐
                                              ▼
                                    User polls for status
                                    GET /reports/rpt-123/status
                                    
                                    Response: {
                                      status: "COMPLETED",
                                      progress: 100,
                                      downloadUrl: "..."
                                    }
                                    
                                    User clicks download ✓
Job Definition:

interface ReportGenerationJob {
  reportId: string;
  reportType: "FRAMEWORK_SCORECARD" | "GAP_ANALYSIS" | "CONTROL_MATRIX";
  framework?: string;
  format: "PDF" | "XLSX" | "JSON";
  includeEvidence: boolean;
  userId: string;
  filters?: {
    domain?: string;
    status?: string;
    businessUnit?: string;
  };
}
Flow 4: Automated Evidence Collection
Evidence collection schedule fires
        │
        ▼
┌──────────────────────────────────┐
│ Scheduled Job: COLLECT_EVIDENCE  │
│ Cron: "0 2 * * *" (2 AM daily)   │
└──────────────────────────────────┘
        │
        ▼
┌──────────────────────────────────────────────┐
│ 1. Fetch enabled integrations:               │
│    - SIEM (SplunkAPI)                        │
│    - Scanners (Qualys, Nessus)               │
│    - Cloud (AWS, Azure APIs)                 │
│ 2. Get mapped controls (which need evidence) │
│ 3. Create batch jobs                         │
└──────────────────────────────────────────────┘
        │
        ▼
┌──────────────────────────────────────────────┐
│ Add to governance:evidence queue             │
│ For each integration:                        │
│ - Job Type: FETCH_EVIDENCE_FROM_INTEGRATION │
│ - Integration: "SPLUNK" | "QUALYS" | "AWS"  │
│ - Priority: MEDIUM                          │
│ - Timeout: 120000ms (2 min)                 │
│ - Retry: 3 attempts                         │
└──────────────────────────────────────────────┘
        │
        ├─ SPLUNK ──────────────────┬─ QUALYS ──────────────────┬─ AWS ──────────────────┐
        │                           │                          │                       │
        ▼                           ▼                          ▼                       ▼
   ┌─────────────┐          ┌──────────────┐          ┌──────────────┐         ┌──────────────┐
   │ Query SIEM  │          │Query Scanner │          │Query Config  │         │Query Logs    │
   │ Last 24hrs  │          │For vulns     │          │Compliance    │         │For evidence  │
   │ Logs        │          │Found         │          │Snapshots     │         │              │
   └─────────────┘          └──────────────┘          └──────────────┘         └──────────────┘
        │                           │                          │                       │
        ▼                           ▼                          ▼                       ▼
   ┌─────────────┐          ┌──────────────┐          ┌──────────────┐         ┌──────────────┐
   │Parse logs   │          │ Parse vulns  │          │Parse configs │         │Parse logs    │
   │ Extract     │          │ Map to       │          │Map to        │         │Extract       │
   │ evidence    │          │ controls     │          │controls      │         │evidence      │
   └─────────────┘          └──────────────┘          └──────────────┘         └──────────────┘
        │                           │                          │                       │
        ▼                           ▼                          ▼                       ▼
   ┌─────────────┐          ┌──────────────┐          ┌──────────────┐         ┌──────────────┐
   │Create       │          │Create        │          │Create        │         │Create        │
   │Evidence     │          │Evidence      │          │Evidence      │         │Evidence      │
   │Records      │          │Records       │          │Records       │         │Records       │
   │ in DB       │          │ in DB        │          │ in DB        │         │ in DB        │
   └─────────────┘          └──────────────┘          └──────────────┘         └──────────────┘
        │                           │                          │                       │
        └───────────────────────────┴──────────────────────────┴───────────────────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │ Aggregation Job      │
                         │ - Count evidence     │
                         │   collected          │
                         │ - Update control     │
                         │   status             │
                         │ - Send notification  │
                         │ - Log results        │
                         └──────────────────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │ Dashboard Updated    │
                         │ "X% of evidence      │
                         │  auto-collected"     │
                         └──────────────────────┘
Job Definition:

interface EvidenceCollectionJob {
  integrationId: string;
  integrationType: "SPLUNK" | "QUALYS" | "NESSUS" | "AWS" | "AZURE";
  controlIds: string[];
  hoursBack?: number; // default: 24
  credentials?: {
    endpoint: string;
    apiKey: string; // encrypted
  };
}
Flow 5: Audit Package Generation
User requests audit package
        │
        ▼
┌────────────────────────────────┐
│ POST /audit/packages/generate  │
│ Framework: ISO27001            │
│ IncludeFrameworks: [ISO,PCI]   │
│ IncludeEvidence: true          │
│ DateRange: Last 6 months        │
└────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────┐
│ 1. Validate parameters                      │
│ 2. Create audit_package record              │
│ 3. Set status: QUEUED                       │
│ 4. Log audit action                         │
└─────────────────────────────────────────────┘
        │
        ▼
┌──────────────────────────────────────────┐
│ Add job to governance:audit queue        │
│ Job Type: GENERATE_AUDIT_PACKAGE         │
│ JobId: `audit-pkg-${packageId}`          │
│ Priority: LOW                            │
│ Timeout: 600000ms (10 min)               │
│ Payload:                                 │
│  - packageId: UUID                       │
│  - frameworks: string[]                  │
│  - includeEvidence: boolean               │
│  - dateRange: { from, to }               │
│  - userId: UUID                          │
└──────────────────────────────────────────┘
        │
        ▼ (Immediate Response)
    Return 202 Accepted

        │
        ├────────────────────────────────┐
        │                                 ▼
        │                        Queue Processor
        │                                 │
        │                                 ▼
        │                    ┌────────────────────────────┐
        │                    │ Create ZIP file structure: │
        │                    │ audit-package/             │
        │                    │  ├── README.txt            │
        │                    │  ├── summary.pdf           │
        │                    │  ├── frameworks/           │
        │                    │  │   ├── ISO27001/         │
        │                    │  │   │   ├── matrix.xlsx   │
        │                    │  │   │   └── controls.json │
        │                    │  │   └── PCI-DSS/          │
        │                    │  │       └── ...           │
        │                    │  ├── controls/             │
        │                    │  │   ├── C0001.md          │
        │                    │  │   ├── C0002.md          │
        │                    │  │   └── ...               │
        │                    │  ├── evidence/             │
        │                    │  │   ├── C0001_001.pdf     │
        │                    │  │   ├── C0001_002.jpg     │
        │                    │  │   └── ...               │
        │                    │  ├── assessments/          │
        │                    │  │   └── results.csv       │
        │                    │  └── metadata.json         │
        │                    └────────────────────────────┘
        │                                 │
        │                                 ▼
        │                    ┌────────────────────────────┐
        │                    │ progress: 25%              │
        │                    │ 1. Query all controls      │
        │                    │ 2. Query assessments       │
        │                    │ 3. Query evidence files    │
        │                    └────────────────────────────┘
        │                                 │
        │                                 ▼
        │                    ┌────────────────────────────┐
        │                    │ progress: 50%              │
        │                    │ Generate documents:        │
        │                    │ - Compliance matrices      │
        │                    │ - Control listings         │
        │                    │ - Assessment results       │
        │                    └────────────────────────────┘
        │                                 │
        │                                 ▼
        │                    ┌────────────────────────────┐
        │                    │ progress: 75%              │
        │                    │ Copy evidence files to     │
        │                    │ temporary directory        │
        │                    │ (1000+ files possible)     │
        │                    └────────────────────────────┘
        │                                 │
        │                                 ▼
        │                    ┌────────────────────────────┐
        │                    │ progress: 90%              │
        │                    │ Create ZIP file            │
        │                    │ Size: typically 100-500MB  │
        │                    │ Compression: DEFLATE       │
        │                    └────────────────────────────┘
        │                                 │
        │                                 ▼
        │                    ┌────────────────────────────┐
        │                    │ progress: 95%              │
        │                    │ Upload ZIP to MinIO        │
        │                    │ Path: /audit-packages/     │
        │                    │        2024/01/            │
        │                    │        audit-pkg-${id}.zip │
        │                    └────────────────────────────┘
        │                                 │
        │                                 ▼
        │                    ┌────────────────────────────┐
        │                    │ progress: 100%             │
        │                    │ Clean up temp files        │
        │                    │ Update package record:     │
        │                    │ - status: READY            │
        │                    │ - fileUrl: s3://...        │
        │                    │ - generatedAt: timestamp   │
        │                    │ - expiresAt: +30 days      │
        │                    └────────────────────────────┘
        │                                 │
        │                                 ▼
        │                    ┌────────────────────────────┐
        │                    │ Send notification to user  │
        │                    │ "Audit package ready for   │
        │                    │  download. Link expires in │
        │                    │  30 days"                  │
        │                    └────────────────────────────┘
        │
        └───────────────────────────────────┐
                                            ▼
                        User receives notification
                        Clicks download link
                        Gets audit-pkg-123.zip ✓
Job Definition:

interface AuditPackageJob {
  packageId: string;
  frameworks: string[];
  includeEvidence: boolean;
  dateRange: {
    from: Date;
    to: Date;
  };
  userId: string;
  includeAssessments?: boolean;
  includeFindings?: boolean;
}
Implementation Patterns
Pattern 1: Job Producers (Services)
// Base producer pattern
@Injectable()
export abstract class BaseQueueProducer<T> {
  protected abstract queueName: string;
  
  constructor(protected readonly queue: Queue<T>) {}
  
  async addJob(
    jobName: string,
    data: T,
    options?: JobOptions,
  ): Promise<Job<T>> {
    const defaultOptions: JobOptions = {
      attempts: 5,
      backoff: { type: 'exponential', delay: 2000 },
      removeOnComplete: true,
      ...options,
    };
    
    return this.queue.add(jobName, data, defaultOptions);
  }
  
  async addBulkJobs(
    jobs: Array<{ name: string; data: T; opts?: JobOptions }>,
  ): Promise<Job<T>[]> {
    return this.queue.addBulk(jobs);
  }
  
  async getJobStatus(jobId: string): Promise<JobStatus | null> {
    const job = await this.queue.getJob(jobId);
    return job ? job.getState() : null;
  }
}
Pattern 2: Job Processors (Consumers)
// Base processor pattern with lifecycle hooks
export abstract class BaseQueueProcessor<T> {
  protected abstract logger: Logger;
  
  @OnQueueActive()
  onActive(job: Job<T>) {
    this.logger.debug(`Processing job ${job.id} of type ${job.name}`);
  }
  
  @OnQueueCompleted()
  onCompleted(job: Job<T>, result: any) {
    this.logger.log(`Job ${job.id} completed with result: ${JSON.stringify(result)}`);
  }
  
  @OnQueueFailed()
  onFailed(job: Job<T>, error: Error) {
    this.logger.error(`Job ${job.id} failed: ${error.message}`, error.stack);
  }
  
  @OnQueueStalled()
  onStalled(job: Job<T>) {
    this.logger.warn(`Job ${job.id} has stalled`);
  }
  
  @OnQueueProgress()
  onProgress(job: Job<T>, progress: number) {
    this.logger.debug(`Job ${job.id} progress: ${progress}%`);
  }
  
  protected async safeExecute<R>(
    job: Job<T>,
    fn: () => Promise<R>,
  ): Promise<R> {
    try {
      return await fn();
    } catch (error) {
      this.logger.error(`Job ${job.id} execution error: ${error.message}`);
      throw error;
    }
  }
}
Pattern 3: Job Progress Tracking
// Progress tracking with database persistence
@Injectable()
export class JobProgressService {
  constructor(
    private readonly jobStatusRepo: Repository<JobStatus>,
    private readonly eventEmitter: EventEmitter2,
  ) {}
  
  async updateProgress(
    jobId: string,
    progress: number,
    message?: string,
  ): Promise<void> {
    await this.jobStatusRepo.update(
      { jobId },
      {
        progress,
        message,
        updatedAt: new Date(),
      },
    );
    
    // Emit event for real-time updates (WebSocket)
    this.eventEmitter.emit('job.progress', {
      jobId,
      progress,
      message,
    });
  }
  
  async markComplete(jobId: string, result: any): Promise<void> {
    await this.jobStatusRepo.update(
      { jobId },
      {
        status: 'COMPLETED',
        progress: 100,
        result: JSON.stringify(result),
        completedAt: new Date(),
      },
    );
    
    this.eventEmitter.emit('job.completed', { jobId, result });
  }
  
  async markFailed(jobId: string, error: Error): Promise<void> {
    await this.jobStatusRepo.update(
      { jobId },
      {
        status: 'FAILED',
        errorMessage: error.message,
        errorStack: error.stack,
        failedAt: new Date(),
      },
    );
    
    this.eventEmitter.emit('job.failed', { jobId, error: error.message });
  }
}
Pattern 4: Scheduled Jobs
// Comprehensive scheduled job patterns
@Injectable()
export class ScheduledJobsService {
  constructor(
    @InjectQueue('governance:assessment') 
    private assessmentQueue: Queue,
  ) {}
  
  // Daily at 2 AM
  async scheduleDaily(scheduleId: string, data: any): Promise<Job> {
    return this.assessmentQueue.add(
      'DAILY_ASSESSMENT',
      data,
      {
        repeat: { cron: '0 2 * * *', tz: 'UTC' },
        jobId: `daily-${scheduleId}`,
      },
    );
  }
  
  // Every Monday at 9 AM
  async scheduleWeekly(scheduleId: string, data: any): Promise<Job> {
    return this.assessmentQueue.add(
      'WEEKLY_ASSESSMENT',
      data,
      {
        repeat: { cron: '0 9 * * 1', tz: 'UTC' },
        jobId: `weekly-${scheduleId}`,
      },
    );
  }
  
  // Monthly on the 15th
  async scheduleMonthly(scheduleId: string, data: any): Promise<Job> {
    return this.assessmentQueue.add(
      'MONTHLY_ASSESSMENT',
      data,
      {
        repeat: { cron: '0 0 15 * *', tz: 'UTC' },
        jobId: `monthly-${scheduleId}`,
      },
    );
  }
  
  // Remove a scheduled job
  async removeScheduledJob(jobId: string): Promise<void> {
    const repeatableJobs = await this.assessmentQueue.getRepeatableJobs();
    const job = repeatableJobs.find(j => j.id === jobId);
    
    if (job) {
      await this.assessmentQueue.removeRepeatableByKey(job.key);
    }
  }
  
  // List all scheduled jobs
  async getScheduledJobs(): Promise<any[]> {
    return this.assessmentQueue.getRepeatableJobs();
  }
}
Pattern 5: Job Prioritization
// Priority levels
export enum JobPriority {
  CRITICAL = 1,
  HIGH = 2,
  MEDIUM = 5,
  LOW = 10,
  BACKGROUND = 20,
}

// Usage
await this.queue.add('URGENT_NOTIFICATION', data, {
  priority: JobPriority.CRITICAL,
  lifo: true, // Last In First Out for critical jobs
});

await this.queue.add('REPORT_GENERATION', data, {
  priority: JobPriority.LOW,
});
Pattern 6: Job Chaining (Workflows)
// Complex workflow with dependent jobs
@Injectable()
export class AuditWorkflowService {
  constructor(
    @InjectQueue('governance:audit') private auditQueue: Queue,
    @InjectQueue('governance:evidence') private evidenceQueue: Queue,
    @InjectQueue('governance:reporting') private reportQueue: Queue,
  ) {}
  
  async startAuditWorkflow(auditId: string): Promise<string> {
    const workflowId = `workflow-${auditId}-${Date.now()}`;
    
    // Step 1: Collect evidence
    const evidenceJob = await this.evidenceQueue.add(
      'COLLECT_ALL_EVIDENCE',
      {
        auditId,
        workflowId,
        step: 1,
      },
      {
        jobId: `${workflowId}-evidence`,
      },
    );
    
    // Step 2: Generate report (delayed until evidence is collected)
    await this.reportQueue.add(
      'GENERATE_AUDIT_REPORT',
      {
        auditId,
        workflowId,
        step: 2,
        dependsOn: evidenceJob.id,
      },
      {
        jobId: `${workflowId}-report`,
        delay: 0, // Will be activated by evidence job completion
      },
    );
    
    // Step 3: Finalize audit package
    await this.auditQueue.add(
      'FINALIZE_AUDIT_PACKAGE',
      {
        auditId,
        workflowId,
        step: 3,
      },
      {
        jobId: `${workflowId}-finalize`,
        delay: 0,
      },
    );
    
    return workflowId;
  }
}

// Workflow coordinator
@Processor('governance:evidence')
export class EvidenceProcessor {
  @Process('COLLECT_ALL_EVIDENCE')
  async collectEvidence(job: Job): Promise<void> {
    const { workflowId } = job.data;
    
    // ... collect evidence ...
    
    // Trigger next step in workflow
    const reportJob = await this.reportQueue.getJob(`${workflowId}-report`);
    if (reportJob) {
      await reportJob.promote(); // Move from delayed to waiting
    }
  }
}
Pattern 7: Batch Processing
// Efficient batch processing for large datasets
@Processor('governance:import')
export class ImportProcessor {
  @Process('IMPORT_CONTROLS')
  async importControls(job: Job<ImportControlsJob>): Promise<void> {
    const { fileUrl, batchSize = 100 } = job.data;
    
    // Stream file to avoid memory issues
    const stream = await this.fileService.getReadStream(fileUrl);
    const parser = stream.pipe(csv.parse({ headers: true }));
    
    let batch: any[] = [];
    let totalProcessed = 0;
    let totalRows = await this.countRows(fileUrl);
    
    for await (const row of parser) {
      batch.push(row);
      
      if (batch.length >= batchSize) {
        await this.processBatch(batch);
        totalProcessed += batch.length;
        await job.progress((totalProcessed / totalRows) * 100);
        batch = [];
        
        // Prevent memory pressure
        if (global.gc) global.gc();
      }
    }
    
    // Process remaining
    if (batch.length > 0) {
      await this.processBatch(batch);
      totalProcessed += batch.length;
    }
    
    await job.progress(100);
  }
  
  private async processBatch(batch: any[]): Promise<void> {
    // Use transaction for atomicity
    await this.dataSource.transaction(async (manager) => {
      for (const item of batch) {
        await manager.insert(Control, this.mapToControl(item));
      }
    });
  }
}
Rate Limiting & Throttling
Queue-Level Rate Limiting
// Rate limiting configuration
BullModule.registerQueue({
  name: 'governance:notification',
  limiter: {
    max: 100,        // Max 100 jobs
    duration: 1000,  // Per 1 second
    bounceBack: false, // Don't re-add if rate limited
  },
});
Integration-Specific Rate Limiting
// Rate limiting for external API calls
@Processor('governance:evidence')
export class EvidenceProcessor {
  private rateLimiters: Map<string, Bottleneck> = new Map();
  
  constructor() {
    // Splunk: 10 requests per second
    this.rateLimiters.set('SPLUNK', new Bottleneck({
      maxConcurrent: 5,
      minTime: 100, // 100ms between requests
    }));
    
    // AWS: 5 requests per second
    this.rateLimiters.set('AWS', new Bottleneck({
      maxConcurrent: 3,
      minTime: 200,
    }));
    
    // Qualys: 2 requests per second
    this.rateLimiters.set('QUALYS', new Bottleneck({
      maxConcurrent: 1,
      minTime: 500,
    }));
  }
  
  @Process('FETCH_EVIDENCE_FROM_INTEGRATION')
  async handleEvidenceCollection(job: Job<EvidenceCollectionJob>) {
    const { integrationType } = job.data;
    const limiter = this.rateLimiters.get(integrationType);
    
    if (limiter) {
      return limiter.schedule(() => this.fetchEvidence(job));
    }
    
    return this.fetchEvidence(job);
  }
}
Adaptive Rate Limiting
// Adjust rate based on error responses
@Injectable()
export class AdaptiveRateLimiter {
  private currentDelay = 100; // ms
  private readonly minDelay = 50;
  private readonly maxDelay = 5000;
  private consecutiveErrors = 0;
  
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    await this.wait();
    
    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      if (this.isRateLimitError(error)) {
        this.onRateLimit();
      }
      throw error;
    }
  }
  
  private onSuccess(): void {
    this.consecutiveErrors = 0;
    // Gradually decrease delay
    this.currentDelay = Math.max(
      this.minDelay,
      this.currentDelay * 0.9,
    );
  }
  
  private onRateLimit(): void {
    this.consecutiveErrors++;
    // Exponentially increase delay
    this.currentDelay = Math.min(
      this.maxDelay,
      this.currentDelay * Math.pow(2, this.consecutiveErrors),
    );
  }
  
  private async wait(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, this.currentDelay));
  }
  
  private isRateLimitError(error: any): boolean {
    return error.status === 429 || error.code === 'RATE_LIMITED';
  }
}
Dead Letter Queue (DLQ) Handling
DLQ Configuration
// DLQ setup
@Module({
  imports: [
    BullModule.registerQueue(
      {
        name: 'governance:policy',
        defaultJobOptions: {
          attempts: 5,
          backoff: { type: 'exponential', delay: 2000 },
        },
      },
      {
        name: 'governance:policy:dlq',
        // DLQ has no retries - manual intervention required
        defaultJobOptions: {
          attempts: 1,
          removeOnComplete: false,
          removeOnFail: false,
        },
      },
    ),
  ],
})
export class PolicyQueueModule {}
DLQ Processor
// Move failed jobs to DLQ
@Processor('governance:policy')
export class PolicyProcessor {
  constructor(
    @InjectQueue('governance:policy:dlq') 
    private dlqQueue: Queue,
    private alertService: AlertService,
  ) {}
  
  @OnQueueFailed()
  async onFailed(job: Job, error: Error) {
    // Check if all retries exhausted
    if (job.attemptsMade >= job.opts.attempts) {
      // Move to DLQ
      await this.dlqQueue.add(
        'FAILED_POLICY_JOB',
        {
          originalJob: {
            id: job.id,
            name: job.name,
            data: job.data,
            opts: job.opts,
          },
          error: {
            message: error.message,
            stack: error.stack,
          },
          failedAt: new Date(),
          attemptsMade: job.attemptsMade,
        },
        {
          jobId: `dlq-${job.id}`,
        },
      );
      
      // Alert on-call team
      await this.alertService.sendAlert({
        severity: 'HIGH',
        title: 'Job moved to DLQ',
        message: `Job ${job.id} failed after ${job.attemptsMade} attempts`,
        metadata: { jobId: job.id, jobName: job.name },
      });
    }
  }
}
DLQ Management Service
// DLQ management and recovery
@Injectable()
export class DLQManagementService {
  constructor(
    @InjectQueue('governance:policy:dlq') 
    private dlqQueue: Queue,
    @InjectQueue('governance:policy') 
    private mainQueue: Queue,
  ) {}
  
  // Get all DLQ jobs
  async getDLQJobs(limit = 100): Promise<Job[]> {
    return this.dlqQueue.getJobs(['waiting', 'active', 'completed'], 0, limit);
  }
  
  // Retry a specific DLQ job
  async retryJob(dlqJobId: string): Promise<Job> {
    const dlqJob = await this.dlqQueue.getJob(dlqJobId);
    
    if (!dlqJob) {
      throw new NotFoundException('DLQ job not found');
    }
    
    const originalJob = dlqJob.data.originalJob;
    
    // Re-add to main queue with fresh attempts
    const newJob = await this.mainQueue.add(
      originalJob.name,
      originalJob.data,
      {
        ...originalJob.opts,
        attempts: originalJob.opts.attempts, // Reset attempts
        jobId: `retry-${originalJob.id}-${Date.now()}`,
      },
    );
    
    // Remove from DLQ
    await dlqJob.remove();
    
    return newJob;
  }
  
  // Retry all DLQ jobs
  async retryAllJobs(): Promise<{ retried: number; failed: number }> {
    const jobs = await this.getDLQJobs(1000);
    let retried = 0;
    let failed = 0;
    
    for (const job of jobs) {
      try {
        await this.retryJob(job.id);
        retried++;
      } catch (error) {
        failed++;
      }
    }
    
    return { retried, failed };
  }
  
  // Purge old DLQ jobs
  async purgeOldJobs(olderThanDays = 30): Promise<number> {
    const jobs = await this.getDLQJobs(10000);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);
    
    let purged = 0;
    for (const job of jobs) {
      if (new Date(job.data.failedAt) < cutoffDate) {
        await job.remove();
        purged++;
      }
    }
    
    return purged;
  }
}
DLQ API Endpoints
// DLQ management controller
@Controller('admin/dlq')
@UseGuards(AdminGuard)
export class DLQController {
  constructor(private dlqService: DLQManagementService) {}
  
  @Get(':queueName')
  async getJobs(
    @Param('queueName') queueName: string,
    @Query('limit') limit = 100,
  ) {
    return this.dlqService.getDLQJobs(limit);
  }
  
  @Post(':queueName/:jobId/retry')
  async retryJob(
    @Param('queueName') queueName: string,
    @Param('jobId') jobId: string,
  ) {
    return this.dlqService.retryJob(jobId);
  }
  
  @Post(':queueName/retry-all')
  async retryAll(@Param('queueName') queueName: string) {
    return this.dlqService.retryAllJobs();
  }
  
  @Delete(':queueName/purge')
  async purge(
    @Param('queueName') queueName: string,
    @Query('olderThanDays') days = 30,
  ) {
    return this.dlqService.purgeOldJobs(days);
  }
}
Error Handling & Retry Logic
Retry Strategy
Attempt 1: Immediate
          ↓ (if fails)
Attempt 2: Wait 2 seconds
          ↓ (if fails)
Attempt 3: Wait 10 seconds
          ↓ (if fails)
Attempt 4: Wait 30 seconds
          ↓ (if fails)
Attempt 5: Wait 1 minute
          ↓ (if fails)
Dead Letter Queue (FAILED)
Error Types & Handling
Error Type	Retry	DLQ	Action
Network timeout	Yes (5x)	Yes	Exponential backoff
Database error	Yes (3x)	Yes	Log and notify
Invalid data	No	Yes	Manual review
Rate limit	Yes (10x)	No	Delayed retry
File not found	No	Yes	Investigate
Permission error	No	Yes	Admin notification
Custom Error Types
// Classifying errors for different handling
export class RetryableError extends Error {
  constructor(message: string, public readonly retryAfter?: number) {
    super(message);
    this.name = 'RetryableError';
  }
}

export class NonRetryableError extends Error {
  constructor(message: string, public readonly code: string) {
    super(message);
    this.name = 'NonRetryableError';
  }
}

export class RateLimitError extends RetryableError {
  constructor(retryAfter: number) {
    super(`Rate limited. Retry after ${retryAfter}ms`, retryAfter);
    this.name = 'RateLimitError';
  }
}

// Processor handling different error types
@Process('DISTRIBUTE_POLICY')
async handleDistribution(job: Job): Promise<void> {
  try {
    await this.distribute(job.data);
  } catch (error) {
    if (error instanceof NonRetryableError) {
      // Don't retry - move to DLQ immediately
      job.discard();
      throw error;
    }
    
    if (error instanceof RateLimitError) {
      // Delay retry
      job.moveToDelayed(Date.now() + error.retryAfter);
      throw error;
    }
    
    // Default: let Bull handle retry
    throw error;
  }
}
Circuit Breaker Pattern
// Prevent cascading failures
@Injectable()
export class CircuitBreaker {
  private failures = 0;
  private lastFailure: Date | null = null;
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';
  
  constructor(
    private readonly threshold = 5,
    private readonly resetTimeout = 30000,
  ) {}
  
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      if (this.shouldReset()) {
        this.state = 'HALF_OPEN';
      } else {
        throw new Error('Circuit breaker is OPEN');
      }
    }
    
    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }
  
  private onSuccess(): void {
    this.failures = 0;
    this.state = 'CLOSED';
  }
  
  private onFailure(): void {
    this.failures++;
    this.lastFailure = new Date();
    
    if (this.failures >= this.threshold) {
      this.state = 'OPEN';
    }
  }
  
  private shouldReset(): boolean {
    if (!this.lastFailure) return true;
    return Date.now() - this.lastFailure.getTime() > this.resetTimeout;
  }
  
  getState() {
    return { state: this.state, failures: this.failures };
  }
}
Graceful Shutdown
Shutdown Handler
// Graceful shutdown for queue processors
@Injectable()
export class QueueShutdownService implements OnModuleDestroy {
  private readonly logger = new Logger(QueueShutdownService.name);
  private readonly queues: Queue[] = [];
  
  registerQueue(queue: Queue): void {
    this.queues.push(queue);
  }
  
  async onModuleDestroy(): Promise<void> {
    this.logger.log('Initiating graceful shutdown of queues...');
    
    const shutdownPromises = this.queues.map(async (queue) => {
      const queueName = queue.name;
      
      try {
        // Pause the queue - no new jobs will be processed
        await queue.pause(true, true);
        this.logger.log(`Queue ${queueName}: Paused`);
        
        // Wait for active jobs to complete (with timeout)
        const activeJobs = await queue.getActiveCount();
        if (activeJobs > 0) {
          this.logger.log(
            `Queue ${queueName}: Waiting for ${activeJobs} active jobs...`,
          );
          
          await this.waitForActiveJobs(queue, 30000); // 30s timeout
        }
        
        // Close the queue connection
        await queue.close();
        this.logger.log(`Queue ${queueName}: Closed`);
      } catch (error) {
        this.logger.error(
          `Queue ${queueName}: Shutdown error - ${error.message}`,
        );
      }
    });
    
    await Promise.allSettled(shutdownPromises);
    this.logger.log('All queues shut down');
  }
  
  private async waitForActiveJobs(
    queue: Queue,
    timeout: number,
  ): Promise<void> {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
      const activeCount = await queue.getActiveCount();
      if (activeCount === 0) return;
      
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    this.logger.warn(
      `Queue ${queue.name}: Timeout waiting for active jobs`,
    );
  }
}
Health Check Endpoint
// Queue health checks
@Injectable()
export class QueueHealthIndicator extends HealthIndicator {
  constructor(
    @InjectQueue('governance:policy') private policyQueue: Queue,
    @InjectQueue('governance:assessment') private assessmentQueue: Queue,
  ) {
    super();
  }
  
  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    const queues = [
      { name: 'policy', queue: this.policyQueue },
      { name: 'assessment', queue: this.assessmentQueue },
    ];
    
    const results: Record<string, any> = {};
    let isHealthy = true;
    
    for (const { name, queue } of queues) {
      try {
        const client = await queue.client;
        const ping = await client.ping();
        
        results[name] = {
          status: ping === 'PONG' ? 'up' : 'down',
          waiting: await queue.getWaitingCount(),
          active: await queue.getActiveCount(),
          failed: await queue.getFailedCount(),
        };
        
        // Unhealthy if too many failed jobs
        if (results[name].failed > 100) {
          isHealthy = false;
          results[name].status = 'degraded';
        }
      } catch (error) {
        isHealthy = false;
        results[name] = { status: 'down', error: error.message };
      }
    }
    
    return this.getStatus(key, isHealthy, results);
  }
}
Monitoring & Observability
Key Metrics
Queue depth (jobs pending)
Processing time (avg, p95, p99)
Success rate %
Failure rate %
Retry count
Dead letter count
Logging
Job started (with payload summary)
Job progress (every 10% or significant milestone)
Job completed (with duration)
Job failed (with error details)
Job retried (with attempt number)
Prometheus Metrics
// Queue metrics for Prometheus
@Injectable()
export class QueueMetricsService {
  private readonly queueJobsActive: Gauge;
  private readonly queueJobsWaiting: Gauge;
  private readonly queueJobsFailed: Counter;
  private readonly queueJobsCompleted: Counter;
  private readonly queueJobDuration: Histogram;
  
  constructor(
    @InjectQueue('governance:policy') private policyQueue: Queue,
    @InjectQueue('governance:assessment') private assessmentQueue: Queue,
  ) {
    // Initialize Prometheus metrics
    this.queueJobsActive = new Gauge({
      name: 'governance_queue_jobs_active',
      help: 'Number of active jobs',
      labelNames: ['queue'],
    });
    
    this.queueJobsWaiting = new Gauge({
      name: 'governance_queue_jobs_waiting',
      help: 'Number of waiting jobs',
      labelNames: ['queue'],
    });
    
    this.queueJobsFailed = new Counter({
      name: 'governance_queue_jobs_failed_total',
      help: 'Total number of failed jobs',
      labelNames: ['queue', 'job_type'],
    });
    
    this.queueJobsCompleted = new Counter({
      name: 'governance_queue_jobs_completed_total',
      help: 'Total number of completed jobs',
      labelNames: ['queue', 'job_type'],
    });
    
    this.queueJobDuration = new Histogram({
      name: 'governance_queue_job_duration_seconds',
      help: 'Job processing duration in seconds',
      labelNames: ['queue', 'job_type'],
      buckets: [0.1, 0.5, 1, 5, 10, 30, 60, 120, 300],
    });
    
    this.setupEventListeners();
    this.startMetricsCollection();
  }
  
  private setupEventListeners(): void {
    const queues = [
      { name: 'policy', queue: this.policyQueue },
      { name: 'assessment', queue: this.assessmentQueue },
    ];
    
    for (const { name, queue } of queues) {
      queue.on('completed', (job) => {
        this.queueJobsCompleted.inc({ queue: name, job_type: job.name });
        
        const duration = (Date.now() - job.processedOn!) / 1000;
        this.queueJobDuration.observe(
          { queue: name, job_type: job.name },
          duration,
        );
      });
      
      queue.on('failed', (job) => {
        this.queueJobsFailed.inc({ queue: name, job_type: job.name });
      });
    }
  }
  
  private startMetricsCollection(): void {
    // Update gauges every 10 seconds
    setInterval(async () => {
      const queues = [
        { name: 'policy', queue: this.policyQueue },
        { name: 'assessment', queue: this.assessmentQueue },
      ];
      
      for (const { name, queue } of queues) {
        this.queueJobsActive.set(
          { queue: name },
          await queue.getActiveCount(),
        );
        this.queueJobsWaiting.set(
          { queue: name },
          await queue.getWaitingCount(),
        );
      }
    }, 10000);
  }
}
Alerting Rules
# prometheus-alerts.yml
groups:
  - name: governance-queues
    rules:
      - alert: QueueBacklogHigh
        expr: governance_queue_jobs_waiting > 1000
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High queue backlog detected"
          description: "Queue {{ $labels.queue }} has {{ $value }} waiting jobs"
      
      - alert: QueueFailureRateHigh
        expr: >
          rate(governance_queue_jobs_failed_total[5m]) /
          rate(governance_queue_jobs_completed_total[5m]) > 0.1
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "High job failure rate"
          description: "Queue {{ $labels.queue }} has >10% failure rate"
      
      - alert: QueueProcessingSlowdown
        expr: >
          histogram_quantile(0.95, 
            rate(governance_queue_job_duration_seconds_bucket[5m])
          ) > 60
        for: 10m
        labels:
          severity: warning
        annotations:
          summary: "Slow job processing"
          description: "95th percentile processing time > 60s"
      
      - alert: DLQJobsAccumulating
        expr: governance_queue_dlq_jobs_total > 50
        for: 15m
        labels:
          severity: critical
        annotations:
          summary: "DLQ jobs accumulating"
          description: "{{ $value }} jobs in DLQ require attention"
Bull Board Integration
// Bull Board UI setup
import { createBullBoard } from '@bull-board/api';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { ExpressAdapter } from '@bull-board/express';

@Module({})
export class BullBoardModule implements NestModule {
  constructor(
    @InjectQueue('governance:policy') private policyQueue: Queue,
    @InjectQueue('governance:assessment') private assessmentQueue: Queue,
    @InjectQueue('governance:reporting') private reportingQueue: Queue,
    @InjectQueue('governance:evidence') private evidenceQueue: Queue,
    @InjectQueue('governance:notification') private notificationQueue: Queue,
  ) {}
  
  configure(consumer: MiddlewareConsumer): void {
    const serverAdapter = new ExpressAdapter();
    serverAdapter.setBasePath('/admin/queues');
    
    createBullBoard({
      queues: [
        new BullAdapter(this.policyQueue),
        new BullAdapter(this.assessmentQueue),
        new BullAdapter(this.reportingQueue),
        new BullAdapter(this.evidenceQueue),
        new BullAdapter(this.notificationQueue),
      ],
      serverAdapter,
    });
    
    consumer
      .apply(serverAdapter.getRouter())
      .forRoutes('/admin/queues');
  }
}
Security Considerations
Secure Job Data
// Encrypt sensitive data in jobs
@Injectable()
export class SecureQueueService {
  constructor(
    private encryptionService: EncryptionService,
    @InjectQueue('governance:evidence') private queue: Queue,
  ) {}
  
  async addSecureJob(data: EvidenceCollectionJob): Promise<Job> {
    // Encrypt sensitive fields
    const secureData = {
      ...data,
      credentials: data.credentials 
        ? this.encryptionService.encrypt(JSON.stringify(data.credentials))
        : undefined,
    };
    
    return this.queue.add('FETCH_EVIDENCE', secureData);
  }
}

// Processor decrypts data
@Processor('governance:evidence')
export class EvidenceProcessor {
  @Process('FETCH_EVIDENCE')
  async handleEvidence(job: Job<EvidenceCollectionJob>): Promise<void> {
    const credentials = job.data.credentials
      ? JSON.parse(this.encryptionService.decrypt(job.data.credentials))
      : null;
    
    // Use decrypted credentials...
  }
}
Job Data Sanitization
// Sanitize job data to prevent log injection
@Injectable()
export class JobSanitizer {
  private readonly sensitiveFields = [
    'password',
    'apiKey',
    'token',
    'secret',
    'credentials',
  ];
  
  sanitizeForLogging(data: any): any {
    if (!data || typeof data !== 'object') return data;
    
    const sanitized = { ...data };
    
    for (const field of this.sensitiveFields) {
      if (field in sanitized) {
        sanitized[field] = '[REDACTED]';
      }
    }
    
    return sanitized;
  }
}
Access Control for Queue Management
// Role-based queue management
@Controller('admin/queues')
@UseGuards(JwtAuthGuard, RolesGuard)
export class QueueAdminController {
  @Get()
  @Roles('ADMIN', 'SUPER_ADMIN')
  async getQueueStats() {
    // ...
  }
  
  @Post(':queue/pause')
  @Roles('SUPER_ADMIN')
  async pauseQueue(@Param('queue') queueName: string) {
    // ...
  }
  
  @Post(':queue/resume')
  @Roles('SUPER_ADMIN')
  async resumeQueue(@Param('queue') queueName: string) {
    // ...
  }
  
  @Delete(':queue/jobs/:jobId')
  @Roles('SUPER_ADMIN')
  async deleteJob(
    @Param('queue') queueName: string,
    @Param('jobId') jobId: string,
  ) {
    // ...
  }
}
Testing Strategies
Unit Testing Processors
// processor.spec.ts
describe('PolicyDistributionProcessor', () => {
  let processor: PolicyDistributionProcessor;
  let mockPolicyRepository: jest.Mocked<Repository<Policy>>;
  let mockNotificationService: jest.Mocked<NotificationService>;
  
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        PolicyDistributionProcessor,
        {
          provide: getRepositoryToken(Policy),
          useValue: {
            findOne: jest.fn(),
            query: jest.fn(),
          },
        },
        {
          provide: NotificationService,
          useValue: {
            sendPolicyNotifications: jest.fn(),
          },
        },
      ],
    }).compile();
    
    processor = module.get(PolicyDistributionProcessor);
    mockPolicyRepository = module.get(getRepositoryToken(Policy));
    mockNotificationService = module.get(NotificationService);
  });
  
  it('should distribute policy to all recipients', async () => {
    const mockPolicy = { id: '1', title: 'Test Policy' };
    mockPolicyRepository.findOne.mockResolvedValue(mockPolicy);
    
    const mockJob = {
      id: 'job-1',
      data: {
        policyId: '1',
        recipientIds: ['user-1', 'user-2'],
        publishedAt: new Date(),
      },
      progress: jest.fn(),
    } as unknown as Job;
    
    const result = await processor.handlePolicyDistribution(mockJob);
    
    expect(result.success).toBe(true);
    expect(result.distributed).toBe(2);
    expect(mockNotificationService.sendPolicyNotifications).toHaveBeenCalled();
    expect(mockJob.progress).toHaveBeenCalledWith(100);
  });
  
  it('should throw error if policy not found', async () => {
    mockPolicyRepository.findOne.mockResolvedValue(null);
    
    const mockJob = {
      id: 'job-1',
      data: { policyId: 'invalid' },
    } as unknown as Job;
    
    await expect(
      processor.handlePolicyDistribution(mockJob),
    ).rejects.toThrow('Policy invalid not found');
  });
});
Integration Testing Queues
// queue.integration.spec.ts
describe('Policy Queue Integration', () => {
  let app: INestApplication;
  let queue: Queue;
  
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        BullModule.forRoot({
          redis: {
            host: 'localhost',
            port: 6380, // Test Redis instance
          },
        }),
        BullModule.registerQueue({ name: 'governance:policy:test' }),
      ],
    })
      .overrideProvider('BullModule')
      .useFactory({
        factory: () => ({
          redis: new Redis(),
        }),
      })
      .compile();
    
    app = moduleRef.createNestApplication();
    await app.init();
    
    queue = moduleRef.get(getQueueToken('governance:policy:test'));
  });
  
  afterAll(async () => {
    await queue.empty();
    await queue.close();
    await app.close();
  });
  
  it('should add job to queue', async () => {
    const job = await queue.add('TEST_JOB', { testData: 'value' });
    
    expect(job.id).toBeDefined();
    expect(job.name).toBe('TEST_JOB');
    expect(job.data.testData).toBe('value');
  });
  
  it('should process job and complete', async () => {
    const completedPromise = new Promise((resolve) => {
      queue.on('completed', (job, result) => {
        resolve({ job, result });
      });
    });
    
    await queue.add('TEST_JOB', { value: 42 });
    
    // Process the job
    queue.process('TEST_JOB', async (job) => {
      return { processed: job.data.value * 2 };
    });
    
    const { result } = await completedPromise;
    expect(result.processed).toBe(84);
  });
});
E2E Testing with Mock Redis
// e2e.spec.ts
import * as Redis from 'ioredis-mock';

describe('Policy API E2E', () => {
  let app: INestApplication;
  
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider('BullModule')
      .useFactory({
        factory: () => ({
          redis: new Redis(),
        }),
      })
      .compile();
    
    app = moduleRef.createNestApplication();
    await app.init();
  });
  
  it('POST /policies/:id/publish should queue distribution job', async () => {
    const response = await request(app.getHttpServer())
      .post('/policies/test-id/publish')
      .set('Authorization', 'Bearer valid-token')
      .expect(202);
    
    expect(response.body.jobId).toBeDefined();
    expect(response.body.status).toBe('QUEUED');
  });
});
Production Considerations
Redis Cluster Configuration
// For production with Redis Cluster
BullModule.forRoot({
  redis: {
    cluster: [
      { host: 'redis-node-1', port: 6379 },
      { host: 'redis-node-2', port: 6379 },
      { host: 'redis-node-3', port: 6379 },
    ],
    options: {
      enableReadyCheck: true,
      maxRedirections: 16,
      retryDelayOnFailover: 100,
      scaleReads: 'slave',
    },
  },
});
Horizontal Scaling
// Worker scaling configuration
@Processor('governance:policy')
export class PolicyProcessor {
  constructor() {}
  
  // Process 5 jobs concurrently per worker
  @Process({ 
    name: 'DISTRIBUTE_POLICY', 
    concurrency: 5,
  })
  async handle(job: Job): Promise<void> {
    // ...
  }
}

// Start multiple workers (in separate processes/containers)
// docker-compose.yml
// services:
//   worker-1:
//     command: npm run worker
//     scale: 3
Job Deduplication
// Prevent duplicate jobs
@Injectable()
export class DeduplicationService {
  constructor(
    private readonly redis: Redis,
    @InjectQueue('governance:policy') private queue: Queue,
  ) {}
  
  async addUniqueJob(
    name: string,
    data: any,
    uniqueKey: string,
    ttl = 3600, // 1 hour
  ): Promise<Job | null> {
    const lockKey = `job:lock:${name}:${uniqueKey}`;
    
    // Try to acquire lock
    const acquired = await this.redis.set(lockKey, '1', 'EX', ttl, 'NX');
    
    if (!acquired) {
      // Job already exists
      return null;
    }
    
    return this.queue.add(name, data, {
      jobId: uniqueKey,
    });
  }
}
Performance Tuning
// Optimized queue configuration
BullModule.registerQueue({
  name: 'governance:notification',
  settings: {
    // Reduce Redis polling interval for faster processing
    stalledInterval: 5000, // Check for stalled jobs every 5s
    lockDuration: 30000,   // Lock job for 30s
    lockRenewTime: 15000,  // Renew lock every 15s
    
    // Batch settings for high throughput
    drainDelay: 5,         // Wait 5ms between job completions
  },
  limiter: {
    max: 1000,
    duration: 1000,
  },
});
Troubleshooting Guide
Common Issues & Solutions
Issue	Symptoms	Solution
Jobs stuck in active	Jobs never complete	Check processor timeout, increase lockDuration
High memory usage	Redis memory growing	Enable removeOnComplete, reduce removeOnFail retention
Jobs not processing	Waiting count growing	Check processor registration, verify queue name matches
Duplicate jobs	Same job runs multiple times	Implement job deduplication, use unique jobId
Stalled jobs	Jobs restart unexpectedly	Increase lockDuration, check processor performance
Redis connection errors	Jobs fail intermittently	Configure Redis reconnection, use Sentinel/Cluster
Diagnostic Commands
// Queue diagnostic service
@Injectable()
export class QueueDiagnosticService {
  async diagnose(queue: Queue): Promise<DiagnosticResult> {
    const [
      waiting,
      active,
      completed,
      failed,
      delayed,
      paused,
      repeatableJobs,
    ] = await Promise.all([
      queue.getWaitingCount(),
      queue.getActiveCount(),
      queue.getCompletedCount(),
      queue.getFailedCount(),
      queue.getDelayedCount(),
      queue.getPausedCount(),
      queue.getRepeatableJobs(),
    ]);
    
    const issues: string[] = [];
    
    // Check for potential issues
    if (active > 0 && waiting > 100) {
      issues.push('High backlog - consider scaling workers');
    }
    
    if (failed > 50) {
      issues.push('High failure count - check error logs');
    }
    
    if (delayed > 1000) {
      issues.push('Many delayed jobs - review scheduling logic');
    }
    
    // Get sample failed jobs for analysis
    const failedJobs = await queue.getFailed(0, 10);
    const failureReasons = failedJobs.map(job => ({
      jobId: job.id,
      name: job.name,
      error: job.failedReason,
      attempts: job.attemptsMade,
      failedAt: job.finishedOn,
    }));
    
    return {
      queueName: queue.name,
      counts: { waiting, active, completed, failed, delayed, paused },
      repeatableJobs: repeatableJobs.length,
      issues,
      recentFailures: failureReasons,
      healthy: issues.length === 0,
    };
  }
}
Logging Best Practices
// Structured logging for queue operations
@Injectable()
export class QueueLogger {
  private readonly logger = new Logger('QueueLogger');
  
  logJobStart(job: Job): void {
    this.logger.log({
      event: 'JOB_START',
      jobId: job.id,
      jobName: job.name,
      queue: job.queue.name,
      attempt: job.attemptsMade + 1,
      data: this.sanitize(job.data),
    });
  }
  
  logJobComplete(job: Job, result: any, duration: number): void {
    this.logger.log({
      event: 'JOB_COMPLETE',
      jobId: job.id,
      jobName: job.name,
      queue: job.queue.name,
      duration: `${duration}ms`,
      result: this.sanitize(result),
    });
  }
  
  logJobFailed(job: Job, error: Error): void {
    this.logger.error({
      event: 'JOB_FAILED',
      jobId: job.id,
      jobName: job.name,
      queue: job.queue.name,
      attempt: job.attemptsMade,
      maxAttempts: job.opts.attempts,
      error: error.message,
      stack: error.stack,
    });
  }
  
  private sanitize(data: any): any {
    // Remove sensitive fields from logs
    const sensitiveKeys = ['password', 'token', 'apiKey', 'secret', 'credentials'];
    if (!data || typeof data !== 'object') return data;
    
    return Object.fromEntries(
      Object.entries(data).map(([key, value]) =>
        sensitiveKeys.some(k => key.toLowerCase().includes(k))
          ? [key, '[REDACTED]']
          : [key, value]
      )
    );
  }
}
Code Examples
Example 1: Policy Distribution Service
// producer: policy.service.ts
@Injectable()
export class PolicyService {
  constructor(
    private policyQueue: Queue<PolicyDistributionJob>,
    private policyRepository: Repository<Policy>,
  ) {}

  async publishPolicy(policyId: string, userId: string) {
    const policy = await this.policyRepository.findOne(policyId);
    
    if (!policy) throw new NotFoundException('Policy not found');
    
    // Get recipients
    const recipients = await this.getRecipients(policy.assignedRoles, policy.assignedBUs);
    
    // Update policy status
    policy.status = PolicyStatus.PUBLISHED;
    policy.publishedAt = new Date();
    policy.publishedBy = userId;
    await this.policyRepository.save(policy);
    
    // Add job to queue
    const job = await this.policyQueue.add(
      'DISTRIBUTE_POLICY',
      {
        policyId,
        recipientIds: recipients.map(r => r.id),
        publishedAt: policy.publishedAt,
      },
      {
        priority: JobPriority.MEDIUM,
        attempts: 5,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
        removeOnComplete: true,
      },
    );
    
    return { jobId: job.id, status: 'QUEUED' };
  }

  private async getRecipients(roles: string[], businessUnits: string[]) {
    const qb = this.userRepository.createQueryBuilder('user');
    
    if (roles.length > 0) {
      qb.orWhereInIds(
        this.roleRepository
          .createQueryBuilder('role')
          .select('role.userId')
          .where('role.name IN (:...roles)', { roles }),
      );
    }
    
    if (businessUnits.length > 0) {
      qb.orWhere('user.businessUnitId IN (:...businessUnits)', { businessUnits });
    }
    
    return qb.getMany();
  }
}
Example 2: Policy Distribution Processor
// processor: policy-distribution.processor.ts
@Processor('governance:policy')
export class PolicyDistributionProcessor {
  private logger = new Logger(PolicyDistributionProcessor.name);

  constructor(
    private policyRepository: Repository<Policy>,
    private userRepository: Repository<User>,
    private notificationService: NotificationService,
    private auditService: AuditService,
  ) {}

  @Process('DISTRIBUTE_POLICY')
  async handlePolicyDistribution(job: Job<PolicyDistributionJob>) {
    const { policyId, recipientIds, publishedAt } = job.data;
    
    try {
      const policy = await this.policyRepository.findOne(policyId);
      
      if (!policy) {
        throw new Error(`Policy ${policyId} not found`);
      }
      
      const totalRecipients = recipientIds.length;
      const batchSize = job.data.batchSize || 100;
      let processed = 0;
      
      // Process in batches
      for (let i = 0; i < recipientIds.length; i += batchSize) {
        const batch = recipientIds.slice(i, i + batchSize);
        
        // Send notifications to batch
        await this.notificationService.sendPolicyNotifications({
          policyId,
          recipientIds: batch,
          notificationType: 'POLICY_PUBLISHED',
        });
        
        // Create assignment records
        for (const userId of batch) {
          await this.policyRepository.query(
            `INSERT INTO policy_assignments 
             (policy_id, user_id, assigned_at, status)
             VALUES ($1, $2, $3, $4)`,
            [policyId, userId, publishedAt, 'PENDING_ACKNOWLEDGMENT'],
          );
        }
        
        processed += batch.length;
        
        // Update job progress
        await job.progress((processed / totalRecipients) * 100);
        
        // Log progress
        this.logger.debug(
          `Policy distribution progress: ${processed}/${totalRecipients}`,
        );
        
        // Wait between batches if specified
        if (i + batchSize < recipientIds.length) {
          await new Promise(resolve =>
            setTimeout(resolve, job.data.delayBetweenBatches || 1000),
          );
        }
      }
      
      // Log audit event
      await this.auditService.log({
        action: 'POLICY_DISTRIBUTED',
        resourceId: policyId,
        resourceType: 'POLICY',
        details: {
          recipientCount: totalRecipients,
          distributedAt: new Date(),
        },
      });
      
      this.logger.log(
        `Policy distribution completed: ${policyId} to ${totalRecipients} recipients`,
      );
      
      return { success: true, distributed: totalRecipients };
    } catch (error) {
      this.logger.error(
        `Policy distribution failed: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
Example 3: Report Generation Processor
// processor: report-generation.processor.ts
@Processor('governance:reporting')
export class ReportGenerationProcessor {
  private logger = new Logger(ReportGenerationProcessor.name);

  constructor(
    private reportRepository: Repository<Report>,
    private reportingService: ReportingService,
    private fileService: FileService,
    private notificationService: NotificationService,
  ) {}

  @Process('GENERATE_REPORT')
  async handleReportGeneration(job: Job<ReportGenerationJob>) {
    const { reportId, userId, ...options } = job.data;
    
    let report = await this.reportRepository.findOne(reportId);
    
    try {
      report.status = ReportStatus.PROCESSING;
      await this.reportRepository.save(report);
      
      // Update progress
      await job.progress(10);
      this.logger.log(`Generating report ${reportId}: Loading data...`);
      
      // Load data
      const data = await this.reportingService.loadReportData(options);
      await job.progress(25);
      
      this.logger.log(`Generating report ${reportId}: Generating PDF...`);
      
      // Generate PDF
      const pdfBuffer = await this.reportingService.generatePDF(
        data,
        options,
      );
      await job.progress(75);
      
      this.logger.log(`Generating report ${reportId}: Uploading file...`);
      
      // Upload to file storage
      const fileUrl = await this.fileService.upload({
        buffer: pdfBuffer,
        filename: `report-${reportId}.pdf`,
        path: `/reports/2024/${new Date().getMonth() + 1}/`,
        contentType: 'application/pdf',
      });
      await job.progress(90);
      
      // Update report record
      report.status = ReportStatus.COMPLETED;
      report.fileUrl = fileUrl;
      report.completedAt = new Date();
      report.fileSize = pdfBuffer.length;
      await this.reportRepository.save(report);
      
      // Send completion notification
      await this.notificationService.send({
        userId,
        type: NotificationType.REPORT_READY,
        data: {
          reportId,
          downloadUrl: fileUrl,
          expiresIn: '7 days',
        },
      });
      
      await job.progress(100);
      
      this.logger.log(
        `Report generation completed: ${reportId} (${pdfBuffer.length} bytes)`,
      );
      
      return { success: true, fileUrl };
    } catch (error) {
      this.logger.error(
        `Report generation failed: ${error.message}`,
        error.stack,
      );
      
      report.status = ReportStatus.FAILED;
      report.errorMessage = error.message;
      await this.reportRepository.save(report);
      
      throw error;
    }
  }
}
Example 4: Evidence Collection Processor
// processor: evidence-collection.processor.ts
@Processor('governance:evidence')
export class EvidenceCollectionProcessor {
  private logger = new Logger(EvidenceCollectionProcessor.name);

  constructor(
    private evidenceService: EvidenceService,
    private integrationService: IntegrationService,
    private encryptionService: EncryptionService,
  ) {}

  @Process('FETCH_EVIDENCE_FROM_INTEGRATION')
  async handleEvidenceCollection(job: Job<EvidenceCollectionJob>) {
    const { integrationId, integrationType, controlIds, hoursBack } = job.data;
    
    try {
      this.logger.log(
        `Collecting evidence from ${integrationType}: ${integrationId}`,
      );
      
      // Get integration credentials
      const integration =
        await this.integrationService.getIntegration(integrationId);
      
      if (!integration.isEnabled) {
        this.logger.warn(`Integration ${integrationId} is disabled`);
        return { success: false, reason: 'Integration disabled' };
      }
      
      // Decrypt credentials
      const credentials = this.encryptionService.decrypt(
        integration.encryptedCredentials,
      );
      
      await job.progress(10);
      
      // Fetch evidence based on type
      let evidence: EvidenceData[] = [];
      
      switch (integrationType) {
        case 'SPLUNK':
          evidence = await this.fetchFromSplunk(credentials, hoursBack);
          break;
        case 'QUALYS':
          evidence = await this.fetchFromQualys(credentials);
          break;
        case 'AWS':
          evidence = await this.fetchFromAWS(credentials);
          break;
        default:
          throw new Error(`Unknown integration type: ${integrationType}`);
      }
      
      await job.progress(50);
      
      this.logger.log(`Fetched ${evidence.length} evidence items`);
      
      // Process and save evidence
      let saved = 0;
      for (const ev of evidence) {
        try {
          await this.evidenceService.createOrUpdate({
            ...ev,
            integrationType,
            controlIds,
          });
          saved++;
        } catch (error) {
          this.logger.error(`Failed to save evidence: ${error.message}`);
        }
      }
      
      await job.progress(100);
      
      this.logger.log(
        `Evidence collection completed: ${saved}/${evidence.length} saved`,
      );
      
      return { success: true, collected: evidence.length, saved };
    } catch (error) {
      this.logger.error(
        `Evidence collection failed: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  private async fetchFromSplunk(
    credentials: any,
    hoursBack: number = 24,
  ): Promise<EvidenceData[]> {
    // Implementation
    return [];
  }

  private async fetchFromQualys(credentials: any): Promise<EvidenceData[]> {
    // Implementation
    return [];
  }

  private async fetchFromAWS(credentials: any): Promise<EvidenceData[]> {
    // Implementation
    return [];
  }
}
Example 5: Queue Configuration
// governance-queues.module.ts
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    BullModule.registerQueue(
      {
        name: 'governance:policy',
        defaultJobOptions: {
          attempts: 5,
          backoff: {
            type: 'exponential',
            delay: 2000,
          },
          removeOnComplete: true,
          removeOnFail: false,
        },
      },
      {
        name: 'governance:assessment',
        defaultJobOptions: {
          attempts: 3,
          backoff: { type: 'fixed', delay: 5000 },
        },
      },
      {
        name: 'governance:reporting',
        defaultJobOptions: {
          attempts: 2,
          timeout: 300000,
          removeOnComplete: false,
        },
      },
      {
        name: 'governance:evidence',
        defaultJobOptions: {
          attempts: 5,
          backoff: { type: 'exponential', delay: 3000 },
        },
      },
      {
        name: 'governance:notification',
        defaultJobOptions: {
          attempts: 10,
          backoff: { type: 'fixed', delay: 1000 },
        },
      },
      {
        name: 'governance:export',
        defaultJobOptions: {
          attempts: 3,
          timeout: 180000,
        },
      },
      {
        name: 'governance:audit',
        defaultJobOptions: {
          attempts: 2,
          timeout: 600000,
        },
      },
      {
        name: 'governance:import',
        defaultJobOptions: {
          attempts: 3,
          timeout: 120000,
        },
      },
    ),
  ],
})
export class GovernanceQueuesModule {}
Example 6: Monitoring Service
// governance-queue.monitor.ts
@Injectable()
export class GovernanceQueueMonitor {
  constructor(
    @InjectQueue('governance:policy') private policyQueue: Queue,
    @InjectQueue('governance:assessment') private assessmentQueue: Queue,
    @InjectQueue('governance:reporting') private reportingQueue: Queue,
    private logger: Logger,
  ) {
    this.setupListeners();
  }

  private setupListeners() {
    // Policy Queue listeners
    this.policyQueue.on('completed', (job) => {
      this.logger.log(`Policy job completed: ${job.id}`);
    });

    this.policyQueue.on('failed', (job, error) => {
      this.logger.error(
        `Policy job failed: ${job.id} - ${error.message}`,
      );
    });

    // Similar for other queues...
  }

  async getQueueMetrics() {
    return {
      policy: {
        active: await this.policyQueue.getActiveCount(),
        waiting: await this.policyQueue.getWaitingCount(),
        failed: await this.policyQueue.getFailedCount(),
        delayed: await this.policyQueue.getDelayedCount(),
      },
      assessment: {
        active: await this.assessmentQueue.getActiveCount(),
        waiting: await this.assessmentQueue.getWaitingCount(),
        failed: await this.assessmentQueue.getFailedCount(),
      },
      reporting: {
        active: await this.reportingQueue.getActiveCount(),
        waiting: await this.reportingQueue.getWaitingCount(),
        failed: await this.reportingQueue.getFailedCount(),
      },
    };
  }
}
Summary Table
Flow	Queue	Job Type	Concurrency	Timeout	Retries
Policy Distribution	governance:policy	DISTRIBUTE_POLICY	5	30s	5
Assessment Scheduling	governance:assessment	SCHEDULE_ASSESSMENT	3	5m	3
Report Generation	governance:reporting	GENERATE_REPORT	2	5m	2
Evidence Collection	governance:evidence	FETCH_EVIDENCE	4	2m	5
Notifications	governance:notification	SEND_NOTIFICATION	10	10s	10
Audit Package	governance:audit	GENERATE_AUDIT_PACKAGE	1	10m	2
Data Export	governance:export	EXPORT_DATA	2	3m	3
Control Import	governance:import	IMPORT_CONTROLS	2	2m	3
Appendix: Migration Guide
Migrating from Basic Async to Bull Queue
// Before: Basic async (fire and forget)
async publishPolicy(policyId: string) {
  await this.updateStatus(policyId, 'PUBLISHED');
  
  // This blocks the response!
  const recipients = await this.getRecipients();
  for (const user of recipients) {
    await this.sendNotification(user); // Slow!
  }
  
  return { status: 'published' };
}

// After: Bull Queue (async processing)
async publishPolicy(policyId: string) {
  await this.updateStatus(policyId, 'PUBLISHED');
  
  // Queue the work - returns immediately
  const job = await this.policyQueue.add('DISTRIBUTE_POLICY', {
    policyId,
    recipientIds: await this.getRecipientIds(),
  });
  
  return { 
    status: 'publishing',
    jobId: job.id,
    trackingUrl: `/api/jobs/${job.id}/status`,
  };
}
Next Steps
✅ Implement queue configuration module
✅ Create service producers for each flow
✅ Create queue processors for each job type
✅ Set up error handling and retry logic
✅ Implement monitoring and observability
⬜ Create UI for job status tracking
⬜ Add integration tests for all flows
⬜ Document operational procedures
⬜ Set up alerting and on-call procedures
⬜ Performance benchmarking and tuning