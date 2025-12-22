import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { User } from '../users/entities/user.entity';
import { Risk } from '../risk/entities/risk.entity';
import { RiskAssessmentRequest, RequestStatus, RequestPriority } from '../risk/entities/risk-assessment-request.entity';
import { RiskAssessment, AssessmentType } from '../risk/entities/risk-assessment.entity';

config();

async function seedAssessmentRequests() {
  const dbHost = process.env.DB_HOST || 'postgres';
  const dbPort = parseInt(process.env.DB_PORT || '5432');
  const dbUser = process.env.POSTGRES_USER || 'postgres';
  const dbPassword = process.env.POSTGRES_PASSWORD || 'password';
  const dbName = process.env.POSTGRES_DB || 'grc_platform';

  console.log(`Connecting to database: ${dbHost}:${dbPort}/${dbName}`);

  const dataSource = new DataSource({
    type: 'postgres',
    host: dbHost,
    port: dbPort,
    username: dbUser,
    password: dbPassword,
    database: dbName,
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: false,
    logging: false,
  });

  try {
    await dataSource.initialize();
    console.log('Database connection established\n');

    const userRepository = dataSource.getRepository(User);
    const riskRepository = dataSource.getRepository(Risk);
    const requestRepository = dataSource.getRepository(RiskAssessmentRequest);
    const assessmentRepository = dataSource.getRepository(RiskAssessment);

    // Get existing data
    const users = await userRepository.find({ take: 10 });
    if (users.length === 0) {
      console.log('❌ No users found. Please seed users first.');
      await dataSource.destroy();
      return;
    }

    const risks = await riskRepository.find({ take: 20 });
    if (risks.length === 0) {
      console.log('❌ No risks found. Please seed risks first (npm run seed:risks).');
      await dataSource.destroy();
      return;
    }

    // Check if requests already exist
    const existingRequests = await requestRepository.count();
    if (existingRequests > 0) {
      console.log(`⚠️  Found ${existingRequests} existing assessment requests. Skipping seed.`);
      console.log('   To reseed, delete existing requests first.\n');
      await dataSource.destroy();
      return;
    }

    console.log(`Found ${users.length} users, ${risks.length} risks\n`);
    console.log('📋 Seeding Assessment Requests...\n');

    // Helper function to generate request identifier
    const generateRequestIdentifier = (index: number): string => {
      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const sequence = String(index + 1).padStart(4, '0');
      return `REQ-${year}${month}-${sequence}`;
    };

    // Sample assessment request templates
    const requestTemplates = [
      {
        assessment_type: AssessmentType.CURRENT,
        priority: RequestPriority.HIGH,
        status: RequestStatus.PENDING,
        justification: 'Risk landscape has changed significantly, need to reassess current state',
        notes: 'Please complete assessment by end of month',
        hasDueDate: true,
        daysFromNow: 15,
      },
      {
        assessment_type: AssessmentType.CURRENT,
        priority: RequestPriority.MEDIUM,
        status: RequestStatus.APPROVED,
        justification: 'Annual risk assessment cycle requirement',
        notes: 'Standard quarterly review',
        hasDueDate: true,
        daysFromNow: 30,
        hasApproval: true,
      },
      {
        assessment_type: AssessmentType.TARGET,
        priority: RequestPriority.HIGH,
        status: RequestStatus.IN_PROGRESS,
        justification: 'Need to establish target risk levels for strategic planning',
        notes: 'Priority for Q1 planning cycle',
        hasDueDate: true,
        daysFromNow: 45,
        hasApproval: true,
      },
      {
        assessment_type: AssessmentType.INHERENT,
        priority: RequestPriority.MEDIUM,
        status: RequestStatus.COMPLETED,
        justification: 'Baseline inherent risk assessment required',
        notes: 'Completed as part of initial risk assessment',
        hasDueDate: false,
        hasApproval: true,
        isCompleted: true,
      },
      {
        assessment_type: AssessmentType.CURRENT,
        priority: RequestPriority.LOW,
        status: RequestStatus.PENDING,
        justification: 'Routine update to current risk assessment',
        notes: 'Low priority update',
        hasDueDate: true,
        daysFromNow: 60,
      },
      {
        assessment_type: AssessmentType.CURRENT,
        priority: RequestPriority.CRITICAL,
        status: RequestStatus.APPROVED,
        justification: 'Critical risk requires immediate reassessment after control changes',
        notes: 'URGENT: Complete within 3 days',
        hasDueDate: true,
        daysFromNow: 3,
        hasApproval: true,
      },
      {
        assessment_type: AssessmentType.TARGET,
        priority: RequestPriority.MEDIUM,
        status: RequestStatus.REJECTED,
        justification: 'Target risk assessment for new initiative',
        notes: 'Rejected due to insufficient justification',
        rejection_reason: 'Insufficient business justification provided. Please provide more details.',
        hasDueDate: false,
        hasRejection: true,
      },
      {
        assessment_type: AssessmentType.CURRENT,
        priority: RequestPriority.HIGH,
        status: RequestStatus.CANCELLED,
        justification: 'Assessment no longer needed due to risk closure',
        notes: 'Cancelled - risk has been accepted',
        hasDueDate: false,
      },
      {
        assessment_type: AssessmentType.INHERENT,
        priority: RequestPriority.MEDIUM,
        status: RequestStatus.PENDING,
        justification: 'Need to establish baseline inherent risk',
        notes: 'Standard assessment for new risk',
        hasDueDate: true,
        daysFromNow: 20,
      },
      {
        assessment_type: AssessmentType.CURRENT,
        priority: RequestPriority.MEDIUM,
        status: RequestStatus.IN_PROGRESS,
        justification: 'Quarterly risk review cycle',
        notes: 'Q1 2025 quarterly assessment',
        hasDueDate: true,
        daysFromNow: 10,
        hasApproval: true,
      },
    ];

    const createdRequests: RiskAssessmentRequest[] = [];
    let requestIndex = 0;

    // Create requests for different risks
    for (let i = 0; i < Math.min(risks.length, requestTemplates.length * 2); i++) {
      const risk = risks[i % risks.length];
      const template = requestTemplates[i % requestTemplates.length];
      const requestedBy = users[Math.floor(Math.random() * users.length)];
      const requestedFor = Math.random() > 0.3 ? users[Math.floor(Math.random() * users.length)] : null;
      
      const dueDate = template.hasDueDate
        ? new Date(Date.now() + template.daysFromNow! * 24 * 60 * 60 * 1000)
        : null;

      const approvedBy = template.hasApproval ? users[Math.floor(Math.random() * users.length)] : null;
      const rejectedBy = template.hasRejection ? users[Math.floor(Math.random() * users.length)] : null;

      const request = requestRepository.create({
        request_identifier: generateRequestIdentifier(requestIndex++),
        risk_id: risk.id,
        requested_by_id: requestedBy.id,
        requested_for_id: requestedFor?.id,
        assessment_type: template.assessment_type,
        priority: template.priority,
        status: template.status,
        due_date: dueDate,
        justification: template.justification,
        notes: template.notes,
        approved_by_id: template.hasApproval ? approvedBy?.id : null,
        approved_at: template.hasApproval ? new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) : null,
        rejected_by_id: template.hasRejection ? rejectedBy?.id : null,
        rejected_at: template.hasRejection ? new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) : null,
        rejection_reason: template.rejection_reason || null,
        completed_at: template.isCompleted ? new Date(Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000) : null,
      });

      let savedRequest = await requestRepository.save(request);
      createdRequests.push(savedRequest);

      // If completed, try to link to an existing assessment
      if (template.isCompleted) {
        const matchingAssessment = await assessmentRepository.findOne({
          where: {
            risk_id: risk.id,
            assessment_type: template.assessment_type,
          },
          order: { created_at: 'DESC' },
        });

        if (matchingAssessment) {
          savedRequest.resulting_assessment_id = matchingAssessment.id;
          savedRequest = await requestRepository.save(savedRequest);
        }
      }

      console.log(`  ✓ Created request: ${savedRequest.request_identifier} (${template.status}) for risk: ${risk.title?.substring(0, 50)}...`);
    }

    // Create additional requests with various statuses
    console.log('\n📊 Creating additional requests with varied statuses...\n');
    
    // More pending requests
    for (let i = 0; i < 5 && requestIndex < risks.length; i++) {
      const risk = risks[requestIndex % risks.length];
      const requestedBy = users[Math.floor(Math.random() * users.length)];
      const requestedFor = users[Math.floor(Math.random() * users.length)];

      const request = requestRepository.create({
        request_identifier: generateRequestIdentifier(requestIndex++),
        risk_id: risk.id,
        requested_by_id: requestedBy.id,
        requested_for_id: requestedFor.id,
        assessment_type: [AssessmentType.CURRENT, AssessmentType.INHERENT, AssessmentType.TARGET][
          Math.floor(Math.random() * 3)
        ],
        priority: [RequestPriority.LOW, RequestPriority.MEDIUM, RequestPriority.HIGH][
          Math.floor(Math.random() * 3)
        ],
        status: RequestStatus.PENDING,
        due_date: new Date(Date.now() + (Math.floor(Math.random() * 30) + 7) * 24 * 60 * 60 * 1000),
        justification: `Standard assessment request for ${risk.title?.substring(0, 30)}`,
        notes: 'Please complete as per standard procedure',
      });

      const savedRequest = await requestRepository.save(request);
      createdRequests.push(savedRequest);
      console.log(`  ✓ Created pending request: ${savedRequest.request_identifier}`);
    }

    console.log(`\n✅ Created ${createdRequests.length} assessment requests\n`);

    // Summary by status
    const statusCounts = createdRequests.reduce((acc, req) => {
      acc[req.status] = (acc[req.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    console.log('Summary by status:');
    Object.entries(statusCounts).forEach(([status, count]) => {
      console.log(`  - ${status}: ${count}`);
    });

    // Summary by assessment type
    const typeCounts = createdRequests.reduce((acc, req) => {
      acc[req.assessment_type] = (acc[req.assessment_type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    console.log('\nSummary by assessment type:');
    Object.entries(typeCounts).forEach(([type, count]) => {
      console.log(`  - ${type}: ${count}`);
    });

    // Summary by priority
    const priorityCounts = createdRequests.reduce((acc, req) => {
      acc[req.priority] = (acc[req.priority] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    console.log('\nSummary by priority:');
    Object.entries(priorityCounts).forEach(([priority, count]) => {
      console.log(`  - ${priority}: ${count}`);
    });

    console.log('\n🎉 Assessment Requests seeding completed successfully!\n');

    await dataSource.destroy();
  } catch (error) {
    console.error('Error seeding assessment requests:', error);
    await dataSource.destroy();
    process.exit(1);
  }
}

seedAssessmentRequests();



