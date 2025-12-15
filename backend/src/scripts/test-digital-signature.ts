import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { User, UserRole, UserStatus } from '../users/entities/user.entity';
import { Policy, PolicyStatus, PolicyType } from '../policy/entities/policy.entity';
import { Workflow, WorkflowType, WorkflowTrigger, EntityType, WorkflowStatus } from '../workflow/entities/workflow.entity';
import { WorkflowExecution, WorkflowExecutionStatus } from '../workflow/entities/workflow-execution.entity';
import { WorkflowApproval, ApprovalStatus } from '../workflow/entities/workflow-approval.entity';

config();

let dataSource: DataSource;
let testUser: User;

async function initialize() {
  try {
    const dbHost = process.env.DB_HOST || 'localhost';
    const dbPort = parseInt(process.env.DB_PORT || '5432');
    const dbUser = process.env.POSTGRES_USER || 'postgres';
    const dbPassword = process.env.POSTGRES_PASSWORD || 'password';
    const dbName = process.env.POSTGRES_DB || 'grc_platform';

    console.log(`Connecting to database: ${dbHost}:${dbPort}/${dbName}`);

    dataSource = new DataSource({
      type: 'postgres',
      host: dbHost,
      port: dbPort,
      username: dbUser,
      password: dbPassword,
      database: dbName,
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: false,
      logging: false,
      namingStrategy: new SnakeNamingStrategy(), // Database uses snake_case columns
    });

    await dataSource.initialize();
    console.log('✅ Database connection established\n');
  } catch (error) {
    console.error('❌ Failed to initialize database:', error);
    process.exit(1);
  }
}

async function createTestUser() {
  try {
    const userRepository = dataSource.getRepository(User);
    
    // Try to find existing admin user
    testUser = await userRepository.findOne({
      where: { email: 'admin@example.com' },
    });

    if (!testUser) {
      // Try to find any user
      const users = await userRepository.find({ take: 1 });
      if (users.length > 0) {
        testUser = users[0];
        console.log(`✅ Using existing user: ${testUser.email}`);
      } else {
        console.log('⚠️  No users found. Creating test user...');
        testUser = userRepository.create({
          email: 'admin@example.com',
          firstName: 'Test',
          lastName: 'User',
          role: UserRole.ADMIN,
          status: UserStatus.ACTIVE,
          password: 'password123', // Note: In production, this should be hashed
        });
        testUser = await userRepository.save(testUser);
        console.log(`✅ Created test user: ${testUser.email}`);
      }
    } else {
      console.log(`✅ Using existing test user: ${testUser.email}`);
    }

    return testUser;
  } catch (error) {
    console.error('❌ Failed to create/get test user:', error);
    throw error;
  }
}

async function createTestPolicy() {
  try {
    if (!testUser) {
      throw new Error('Test user must be initialized first');
    }

    const policyRepository = dataSource.getRepository(Policy);

    // Check if test policy already exists
    const existingPolicy = await policyRepository.findOne({
      where: { title: 'Test Digital Signature Policy' },
    });

    if (existingPolicy) {
      console.log(`✅ Using existing test policy: ${existingPolicy.id}`);
      return existingPolicy;
    }

    const testPolicy = policyRepository.create({
      title: 'Test Digital Signature Policy',
      description: 'This is a test policy for testing digital signature functionality',
      policyType: PolicyType.COMPLIANCE,
      status: PolicyStatus.DRAFT,
      ownerId: testUser.id,
    });

    const saved = await policyRepository.save(testPolicy);
    console.log(`✅ Created test policy: ${saved.id}`);
    return saved;
  } catch (error) {
    console.error('❌ Failed to create test policy:', error);
    throw error;
  }
}

async function createApprovalWorkflow() {
  try {
    if (!testUser) {
      throw new Error('Test user must be initialized first');
    }

    const workflowRepository = dataSource.getRepository(Workflow);

    // Check if test workflow already exists
    const existingWorkflow = await workflowRepository.findOne({
      where: { name: 'Policy Approval Workflow' },
    });

    if (existingWorkflow) {
      console.log(`✅ Using existing workflow: ${existingWorkflow.id}`);
      return existingWorkflow;
    }

    const workflow = workflowRepository.create({
      name: 'Policy Approval Workflow',
      description: 'Workflow for testing digital signatures',
      type: WorkflowType.APPROVAL,
      trigger: WorkflowTrigger.MANUAL,
      entityType: EntityType.POLICY,
      status: WorkflowStatus.ACTIVE,
      conditions: {},
      actions: {
        approvers: [testUser.id],
        changeStatus: 'active',
        notify: [testUser.id],
      },
      createdById: testUser.id,
    });

    const saved = await workflowRepository.save(workflow);
    console.log(`✅ Created approval workflow: ${saved.id}`);
    return saved;
  } catch (error) {
    console.error('❌ Failed to create approval workflow:', error);
    throw error;
  }
}

async function triggerWorkflow(policyId: string, workflowId: string) {
  try {
    // Use raw query with camelCase column names (as per actual database schema)
    const result = await dataSource.query(
      `INSERT INTO workflow_executions (id, "workflowId", "entityType", "entityId", status, "inputData", "startedAt", "createdAt", "updatedAt")
       VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, NOW(), NOW())
       RETURNING id, status, "createdAt", "updatedAt"`,
      [workflowId, EntityType.POLICY, policyId, WorkflowExecutionStatus.IN_PROGRESS, JSON.stringify({ test: true }), new Date()]
    );

    const savedExecution = result[0];
    console.log(`✅ Created workflow execution: ${savedExecution.id}`);

    // Create approval record using raw query (columns are camelCase)
    const approvalResult = await dataSource.query(
      `INSERT INTO workflow_approvals (id, "workflowExecutionId", "approverId", status, "stepOrder", "createdAt", "updatedAt")
       VALUES (gen_random_uuid(), $1, $2, $3, $4, NOW(), NOW())
       RETURNING id, status, "stepOrder"`,
      [savedExecution.id, testUser.id, ApprovalStatus.PENDING, 1]
    );

    const approval = approvalResult[0];
    console.log(`✅ Created pending approval: ${approval.id}`);

    return savedExecution;
  } catch (error) {
    console.error('❌ Failed to trigger workflow:', error);
    throw error;
  }
}

async function showPendingApprovals(userId: string) {
  try {
    // Use raw query to avoid column name issues
    const pendingApprovals = await dataSource.query(
      `SELECT 
        wa.id,
        wa.status,
        wa."stepOrder",
        wa."workflowExecutionId",
        we."entityType",
        we."entityId",
        w.name as workflow_name
      FROM workflow_approvals wa
      LEFT JOIN workflow_executions we ON we.id = wa."workflowExecutionId"
      LEFT JOIN workflows w ON w.id = we."workflowId"
      WHERE wa."approverId" = $1 AND wa.status = $2
      ORDER BY wa."createdAt" DESC`,
      [userId, ApprovalStatus.PENDING]
    );

    console.log(`✅ Found ${pendingApprovals.length} pending approvals for user\n`);

    if (pendingApprovals.length > 0) {
      pendingApprovals.forEach((approval: any, index: number) => {
        console.log(`  ${index + 1}. Approval ID: ${approval.id}`);
        console.log(`      Execution ID: ${approval.workflowExecutionId}`);
        console.log(`      Status: ${approval.status}`);
        console.log(`      Step: ${approval.stepOrder}`);
        if (approval.workflow_name) {
          console.log(`      Workflow: ${approval.workflow_name}`);
        }
      });
    }

    return pendingApprovals;
  } catch (error) {
    console.error('❌ Failed to get pending approvals:', error);
    throw error;
  }
}

async function main() {
  console.log('🚀 Starting Digital Signature Test Script\n');

  try {
    await initialize();

    // Create test data
    await createTestUser();

    if (!testUser) {
      throw new Error('Test user not found. Please run seed script first.');
    }

    const testPolicy = await createTestPolicy();
    const approvalWorkflow = await createApprovalWorkflow();

    // Trigger workflow
    const execution = await triggerWorkflow(testPolicy.id, approvalWorkflow.id);

    // Get pending approvals
    const pendingApprovals = await showPendingApprovals(testUser.id);

    if (pendingApprovals.length === 0) {
      console.log('\n⚠️  No pending approvals found. Workflow may not have triggered correctly.');
      return;
    }

    console.log('\n📋 TEST INSTRUCTIONS:');
    console.log('1. Access the frontend: http://localhost:3000');
    console.log('2. Navigate to: Governance → Policies');
    console.log('3. Find the policy: "Test Digital Signature Policy"');
    console.log('4. Click the actions menu (⋮) and select "Execute Workflow"');
    console.log('5. Select the "Policy Approval Workflow" and click "Execute"');
    console.log('6. Go to: My Approvals (http://localhost:3000/en/dashboard/workflows/my-approvals)');
    console.log('7. You should see a pending approval for "Test Digital Signature Policy"');
    console.log('8. Click "Sign & Approve" to test the signature capture dialog');
    console.log('9. Try drawing a signature or uploading an image');
    console.log('10. Submit the approval to test the complete flow');
    console.log('\n✅ The digital signature should now be stored in the database!');
    console.log(`\n📝 Test Data Created:`);
    console.log(`   - Policy ID: ${testPolicy.id}`);
    console.log(`   - Workflow ID: ${approvalWorkflow.id}`);
    console.log(`   - Execution ID: ${execution.id}`);
    console.log(`   - Approval ID: ${pendingApprovals[0]?.id}`);

  } catch (error) {
    console.error('\n❌ Test failed:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
      console.error('Stack:', error.stack);
    }
    process.exit(1);
  } finally {
    if (dataSource && dataSource.isInitialized) {
      await dataSource.destroy();
      console.log('\n✅ Database connection closed');
    }
  }
}

// Run the test
if (require.main === module) {
  main().catch((error) => {
    console.error('Unhandled error:', error);
    process.exit(1);
  });
}

