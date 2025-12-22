import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { config } from 'dotenv';
import { User, UserRole, UserStatus } from '../users/entities/user.entity';
import { Task, TaskType, TaskPriority, TaskStatus } from '../common/entities/task.entity';
import { ComplianceFramework } from '../common/entities/compliance-framework.entity';
import { ComplianceRequirement, RequirementStatus } from '../common/entities/compliance-requirement.entity';
import { Policy, PolicyType, PolicyStatus } from '../policy/entities/policy.entity';
import { Risk, RiskCategory, RiskStatus, RiskLikelihood, RiskImpact } from '../risk/entities/risk.entity';
import { PhysicalAsset, CriticalityLevel, ConnectivityStatus, NetworkApprovalStatus } from '../asset/entities/physical-asset.entity';
import { InformationAsset, ClassificationLevel } from '../asset/entities/information-asset.entity';
import { BusinessApplication, CriticalityLevel as AppCriticalityLevel } from '../asset/entities/business-application.entity';
import { SoftwareAsset } from '../asset/entities/software-asset.entity';
import { Supplier, CriticalityLevel as SupplierCriticalityLevel } from '../asset/entities/supplier.entity';
import { BusinessUnit } from '../common/entities/business-unit.entity';

config();

async function seed() {
  // Use environment variables from docker-compose or defaults
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
    console.log('Database connection established');

    const userRepository = dataSource.getRepository(User);
    const frameworkRepository = dataSource.getRepository(ComplianceFramework);
    const requirementRepository = dataSource.getRepository(ComplianceRequirement);
    const taskRepository = dataSource.getRepository(Task);
    const policyRepository = dataSource.getRepository(Policy);
    const riskRepository = dataSource.getRepository(Risk);
    const physicalAssetRepository = dataSource.getRepository(PhysicalAsset);
    const informationAssetRepository = dataSource.getRepository(InformationAsset);
    const businessApplicationRepository = dataSource.getRepository(BusinessApplication);
    const softwareAssetRepository = dataSource.getRepository(SoftwareAsset);
    const supplierRepository = dataSource.getRepository(Supplier);
    const businessUnitRepository = dataSource.getRepository(BusinessUnit);

    // Check if users already exist
    const existingUsers = await userRepository.count();
    let createdUsers: User[] = [];

    if (existingUsers > 0) {
      console.log(`Found ${existingUsers} existing users. Skipping user creation.`);
      createdUsers = await userRepository.find();
    } else {
      console.log('Starting database seed...');

      // Hash password for all users (using same password for testing)
      const defaultPassword = await bcrypt.hash('password123', 10);

      // Create users with different roles
      const users = [
        {
          email: 'admin@grcplatform.com',
          firstName: 'Admin',
          lastName: 'User',
          password: defaultPassword,
          role: UserRole.SUPER_ADMIN,
          status: UserStatus.ACTIVE,
          emailVerified: true,
          phone: '+966501234567',
        },
        {
          email: 'manager@grcplatform.com',
          firstName: 'John',
          lastName: 'Manager',
          password: defaultPassword,
          role: UserRole.ADMIN,
          status: UserStatus.ACTIVE,
          emailVerified: true,
          phone: '+966501234568',
        },
        {
          email: 'compliance@grcplatform.com',
          firstName: 'Sarah',
          lastName: 'Compliance',
          password: defaultPassword,
          role: UserRole.COMPLIANCE_OFFICER,
          status: UserStatus.ACTIVE,
          emailVerified: true,
          phone: '+966501234569',
        },
        {
          email: 'risk@grcplatform.com',
          firstName: 'Ahmed',
          lastName: 'Risk',
          password: defaultPassword,
          role: UserRole.RISK_MANAGER,
          status: UserStatus.ACTIVE,
          emailVerified: true,
          phone: '+966501234570',
        },
        {
          email: 'auditor@grcplatform.com',
          firstName: 'Fatima',
          lastName: 'Auditor',
          password: defaultPassword,
          role: UserRole.AUDITOR,
          status: UserStatus.ACTIVE,
          emailVerified: true,
          phone: '+966501234571',
        },
        {
          email: 'user@grcplatform.com',
          firstName: 'Mohammed',
          lastName: 'User',
          password: defaultPassword,
          role: UserRole.USER,
          status: UserStatus.ACTIVE,
          emailVerified: true,
          phone: '+966501234572',
        },
        {
          email: 'demo@grcplatform.com',
          firstName: 'Demo',
          lastName: 'Account',
          password: defaultPassword,
          role: UserRole.USER,
          status: UserStatus.ACTIVE,
          emailVerified: true,
        },
      ];

      // Insert users
      createdUsers = await userRepository.save(users);
      console.log(`✓ Created ${createdUsers.length} users`);

      // Display created users
      console.log('\n📋 Created Users:');
      createdUsers.forEach((user) => {
        console.log(`  - ${user.email} (${user.role}) - ${user.firstName} ${user.lastName}`);
      });
    }

    // Seed Business Units (must be created before assets that reference them)
    const existingBusinessUnits = await businessUnitRepository.count();
    let businessUnitsMap: Map<string, BusinessUnit> = new Map();
    
    if (existingBusinessUnits > 0) {
      console.log(`Found ${existingBusinessUnits} existing business units. Skipping business unit creation.`);
      const allBusinessUnits = await businessUnitRepository.find();
      allBusinessUnits.forEach(bu => businessUnitsMap.set(bu.name, bu));
    } else {
      console.log('\n🏢 Seeding business units...');
      const adminUser = createdUsers.find((u) => u.role === UserRole.SUPER_ADMIN);
      
      // Get unique business unit names from the seed data
      const businessUnitNames = [
        'IT Operations',
        'Finance',
        'Human Resources',
        'Executive',
        'Customer Relations',
        'Legal',
        'Marketing',
        'Compliance',
        'Sales',
        'Product Development',
        'Business Intelligence',
        'IT Security',
        'Facilities',
      ];

      const businessUnitsData = businessUnitNames.map(name => ({
        name,
        code: name.toUpperCase().replace(/\s+/g, '-'),
        description: `${name} business unit`,
        managerId: adminUser?.id,
      }));

      const createdBusinessUnits = await businessUnitRepository.save(businessUnitsData);
      createdBusinessUnits.forEach(bu => businessUnitsMap.set(bu.name, bu));
      console.log(`✓ Created ${createdBusinessUnits.length} business units`);
    }

    // Seed compliance frameworks and requirements
    let frameworks = await frameworkRepository.find();
    
    if (frameworks.length === 0) {
      console.log('\n📋 Seeding compliance frameworks...');

      const frameworkData = [
        {
          name: 'NCA',
          code: 'NCA',
          description: 'National Cybersecurity Authority Framework',
          region: 'Saudi Arabia',
        },
        {
          name: 'SAMA',
          code: 'SAMA',
          description: 'Saudi Arabian Monetary Authority Framework',
          region: 'Saudi Arabia',
        },
        {
          name: 'ADGM',
          code: 'ADGM',
          description: 'Abu Dhabi Global Market Framework',
          region: 'UAE',
        },
      ];

      frameworks = await frameworkRepository.save(frameworkData);
      console.log(`✓ Created ${frameworks.length} compliance frameworks`);
    } else {
      console.log(`Found ${frameworks.length} existing compliance frameworks.`);
    }

    // Seed requirements (always check if they exist)
    const existingRequirements = await requirementRepository.count();
    if (existingRequirements === 0) {
      console.log('📋 Seeding compliance requirements...');
      
      // Create requirements for each framework
      const requirements = [];
      for (const framework of frameworks) {
        const reqCount = framework.code === 'NCA' ? 156 : framework.code === 'SAMA' ? 89 : 124;
        const compliantCount = framework.code === 'NCA' ? 128 : framework.code === 'SAMA' ? 67 : 105;
        
        for (let i = 1; i <= reqCount; i++) {
          const status =
            i <= compliantCount
              ? RequirementStatus.COMPLIANT
              : i <= compliantCount + 10
              ? RequirementStatus.IN_PROGRESS
              : RequirementStatus.NOT_STARTED;

          requirements.push({
            title: `${framework.code} Requirement ${i}`,
            description: `Compliance requirement ${i} for ${framework.name}`,
            requirementCode: `${framework.code}-REQ-${i.toString().padStart(3, '0')}`,
            framework: framework, // Use the framework object for the relationship
            status,
          });
        }
      }

      const createdRequirements = await requirementRepository.save(requirements);
      console.log(`✓ Created ${createdRequirements.length} compliance requirements`);
    } else {
      console.log(`Found ${existingRequirements} existing compliance requirements. Skipping.`);
    }

    // Seed tasks (always run if not exists)
    const existingTasks = await taskRepository.count();
    if (existingTasks === 0) {
      console.log('\n📝 Seeding tasks...');
      const adminUser = createdUsers.find((u) => u.role === UserRole.SUPER_ADMIN);

      const tasks = [
        {
          title: 'Review Access Policy',
          description: 'Review and update the organization access control policy',
          taskType: TaskType.POLICY_REVIEW,
          priority: TaskPriority.HIGH,
          status: TaskStatus.TODO,
          dueDate: new Date(),
          assignedToId: adminUser?.id,
        },
        {
          title: 'Update Risk Assessment',
          description: 'Complete quarterly risk assessment update',
          taskType: TaskType.RISK_MITIGATION,
          priority: TaskPriority.MEDIUM,
          status: TaskStatus.TODO,
          dueDate: new Date(Date.now() + 86400000), // Tomorrow
          assignedToId: adminUser?.id,
        },
        {
          title: 'Approve New Vendor',
          description: 'Review and approve new vendor compliance documentation',
          taskType: TaskType.COMPLIANCE_REQUIREMENT,
          priority: TaskPriority.LOW,
          status: TaskStatus.TODO,
          dueDate: new Date(Date.now() + 604800000), // Next week
          assignedToId: adminUser?.id,
        },
        {
          title: 'Complete NCA Compliance Review',
          description: 'Annual NCA framework compliance review',
          taskType: TaskType.COMPLIANCE_REQUIREMENT,
          priority: TaskPriority.HIGH,
          status: TaskStatus.IN_PROGRESS,
          dueDate: new Date(Date.now() + 259200000), // 3 days
          assignedToId: adminUser?.id,
        },
      ];

      const createdTasks = await taskRepository.save(tasks);
      console.log(`✓ Created ${createdTasks.length} tasks`);
    } else {
      console.log(`Found ${existingTasks} existing tasks. Skipping.`);
    }

    // Seed policies (always run if not exists)
    const existingPolicies = await policyRepository.count();
    if (existingPolicies === 0) {
      console.log('\n📄 Seeding policies...');
      const adminUser = createdUsers.find((u) => u.role === UserRole.SUPER_ADMIN);
      const complianceOfficer = createdUsers.find((u) => u.role === UserRole.COMPLIANCE_OFFICER);
      const riskManager = createdUsers.find((u) => u.role === UserRole.RISK_MANAGER);

      const policies = [
        {
          title: 'Information Security Policy',
          description: 'Comprehensive information security policy covering data protection, access controls, and incident response. This policy establishes the framework for protecting organizational information assets.',
          policyType: PolicyType.SECURITY,
          status: PolicyStatus.ACTIVE,
          version: '2.1',
          ownerId: adminUser?.id,
          effectiveDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // 90 days ago
          reviewDate: new Date(Date.now() + 275 * 24 * 60 * 60 * 1000), // 275 days from now
        },
        {
          title: 'Data Privacy and Protection Policy',
          description: 'Policy governing the collection, use, and protection of personal data in compliance with GDPR, PDPL, and local regulations. Ensures proper handling of sensitive information.',
          policyType: PolicyType.COMPLIANCE,
          status: PolicyStatus.ACTIVE,
          version: '1.5',
          ownerId: complianceOfficer?.id,
          effectiveDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 60 days ago
          reviewDate: new Date(Date.now() + 305 * 24 * 60 * 60 * 1000), // 305 days from now
        },
        {
          title: 'Acceptable Use Policy',
          description: 'Guidelines for acceptable use of company IT resources, systems, and networks. Defines acceptable and prohibited activities for all users.',
          policyType: PolicyType.IT,
          status: PolicyStatus.ACTIVE,
          version: '3.0',
          ownerId: adminUser?.id,
          effectiveDate: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000), // 120 days ago
          reviewDate: new Date(Date.now() + 245 * 24 * 60 * 60 * 1000), // 245 days from now
        },
        {
          title: 'Vendor Management Policy',
          description: 'Policy for managing third-party vendors, including due diligence, contracts, and ongoing monitoring. Ensures vendor relationships meet security and compliance standards.',
          policyType: PolicyType.OPERATIONAL,
          status: PolicyStatus.UNDER_REVIEW,
          version: '1.2',
          ownerId: complianceOfficer?.id,
          effectiveDate: null,
          reviewDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        },
        {
          title: 'Business Continuity Policy',
          description: 'Policy outlining procedures for maintaining business operations during disruptions and disasters. Includes disaster recovery and business resumption plans.',
          policyType: PolicyType.OPERATIONAL,
          status: PolicyStatus.ACTIVE,
          version: '2.0',
          ownerId: adminUser?.id,
          effectiveDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000), // 45 days ago
          reviewDate: new Date(Date.now() + 320 * 24 * 60 * 60 * 1000), // 320 days from now
        },
        {
          title: 'Password Management Policy',
          description: 'Establishes requirements for password creation, storage, and management. Includes password complexity requirements and rotation policies.',
          policyType: PolicyType.SECURITY,
          status: PolicyStatus.ACTIVE,
          version: '1.8',
          ownerId: adminUser?.id,
          effectiveDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
          reviewDate: new Date(Date.now() + 335 * 24 * 60 * 60 * 1000), // 335 days from now
        },
        {
          title: 'Incident Response Policy',
          description: 'Defines procedures for detecting, responding to, and recovering from security incidents. Includes escalation procedures and communication protocols.',
          policyType: PolicyType.SECURITY,
          status: PolicyStatus.ACTIVE,
          version: '1.3',
          ownerId: riskManager?.id,
          effectiveDate: new Date(Date.now() - 75 * 24 * 60 * 60 * 1000), // 75 days ago
          reviewDate: new Date(Date.now() + 290 * 24 * 60 * 60 * 1000), // 290 days from now
        },
        {
          title: 'Access Control Policy',
          description: 'Governs user access to systems, applications, and data. Includes principles of least privilege and regular access reviews.',
          policyType: PolicyType.SECURITY,
          status: PolicyStatus.ACTIVE,
          version: '2.2',
          ownerId: adminUser?.id,
          effectiveDate: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000), // 100 days ago
          reviewDate: new Date(Date.now() + 265 * 24 * 60 * 60 * 1000), // 265 days from now
        },
        {
          title: 'Code of Conduct',
          description: 'Establishes ethical standards and behavioral expectations for all employees. Covers professional conduct, conflicts of interest, and reporting mechanisms.',
          policyType: PolicyType.HR,
          status: PolicyStatus.ACTIVE,
          version: '1.0',
          ownerId: adminUser?.id,
          effectiveDate: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000), // 180 days ago
          reviewDate: new Date(Date.now() + 185 * 24 * 60 * 60 * 1000), // 185 days from now
        },
        {
          title: 'Financial Controls Policy',
          description: 'Establishes financial controls, approval processes, and reporting requirements. Ensures proper financial governance and compliance.',
          policyType: PolicyType.FINANCE,
          status: PolicyStatus.ACTIVE,
          version: '1.4',
          ownerId: adminUser?.id,
          effectiveDate: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000), // 50 days ago
          reviewDate: new Date(Date.now() + 315 * 24 * 60 * 60 * 1000), // 315 days from now
        },
        {
          title: 'Remote Work Policy',
          description: 'Guidelines for remote work arrangements, including security requirements, equipment standards, and communication expectations.',
          policyType: PolicyType.OPERATIONAL,
          status: PolicyStatus.DRAFT,
          version: '0.9',
          ownerId: adminUser?.id,
          effectiveDate: null,
          reviewDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
        },
        {
          title: 'Data Retention Policy',
          description: 'Defines how long different types of data should be retained and procedures for secure disposal. Ensures compliance with legal and regulatory requirements.',
          policyType: PolicyType.COMPLIANCE,
          status: PolicyStatus.ACTIVE,
          version: '1.1',
          ownerId: complianceOfficer?.id,
          effectiveDate: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000), // 25 days ago
          reviewDate: new Date(Date.now() + 340 * 24 * 60 * 60 * 1000), // 340 days from now
        },
      ];

      const createdPolicies = await policyRepository.save(policies);
      console.log(`✓ Created ${createdPolicies.length} policies`);
    } else {
      console.log(`Found ${existingPolicies} existing policies. Skipping.`);
    }

    // Seed risks (always run if not exists)
    const existingRisks = await riskRepository.count();
    if (existingRisks === 0) {
      console.log('\n⚠️  Seeding risks...');
      const adminUser = createdUsers.find((u) => u.role === UserRole.SUPER_ADMIN);
      const riskManager = createdUsers.find((u) => u.role === UserRole.RISK_MANAGER);
      const complianceOfficer = createdUsers.find((u) => u.role === UserRole.COMPLIANCE_OFFICER);

      const risks = [
        // Very High Impact Risks
        {
          title: 'Ransomware Attack',
          description: 'Risk of ransomware attack on critical systems causing business disruption. Could result in operational shutdown, data loss, and financial extortion.',
          category: RiskCategory.CYBERSECURITY,
          status: RiskStatus.IDENTIFIED,
          likelihood: RiskLikelihood.HIGH,
          impact: RiskImpact.VERY_HIGH,
          ownerId: riskManager?.id,
        },
        {
          title: 'Reputation Damage',
          description: 'Risk of reputation damage from security incidents, data breaches, or negative publicity. Could impact customer trust and business relationships.',
          category: RiskCategory.REPUTATIONAL,
          status: RiskStatus.IDENTIFIED,
          likelihood: RiskLikelihood.LOW,
          impact: RiskImpact.VERY_HIGH,
          ownerId: adminUser?.id,
        },
        {
          title: 'Business Continuity Failure',
          description: 'Risk of business continuity and disaster recovery plans failing during actual incidents, leading to extended operational disruption.',
          category: RiskCategory.OPERATIONAL,
          status: RiskStatus.ASSESSED,
          likelihood: RiskLikelihood.LOW,
          impact: RiskImpact.VERY_HIGH,
          ownerId: adminUser?.id,
        },
        {
          title: 'Critical System Compromise',
          description: 'Risk of complete compromise of critical business systems leading to total operational shutdown and data loss.',
          category: RiskCategory.CYBERSECURITY,
          status: RiskStatus.IDENTIFIED,
          likelihood: RiskLikelihood.MEDIUM,
          impact: RiskImpact.VERY_HIGH,
          ownerId: riskManager?.id,
        },
        {
          title: 'Major Data Breach',
          description: 'Risk of large-scale data breach exposing millions of customer records, resulting in massive regulatory fines and legal liability.',
          category: RiskCategory.DATA_PRIVACY,
          status: RiskStatus.ASSESSED,
          likelihood: RiskLikelihood.MEDIUM,
          impact: RiskImpact.VERY_HIGH,
          ownerId: complianceOfficer?.id,
        },
        {
          title: 'License Revocation',
          description: 'Risk of regulatory license revocation due to severe compliance violations, resulting in complete business shutdown.',
          category: RiskCategory.COMPLIANCE,
          status: RiskStatus.IDENTIFIED,
          likelihood: RiskLikelihood.VERY_LOW,
          impact: RiskImpact.VERY_HIGH,
          ownerId: complianceOfficer?.id,
        },
        // High Impact Risks
        {
          title: 'Data Breach Risk',
          description: 'Risk of unauthorized access to sensitive customer data leading to data breach. Potential impact includes regulatory fines, reputation damage, and customer loss.',
          category: RiskCategory.DATA_PRIVACY,
          status: RiskStatus.ASSESSED,
          likelihood: RiskLikelihood.MEDIUM,
          impact: RiskImpact.HIGH,
          ownerId: complianceOfficer?.id,
        },
        {
          title: 'Regulatory Non-Compliance',
          description: 'Risk of failing to meet regulatory requirements (NCA, SAMA, ADGM) resulting in fines, penalties, and potential license revocation.',
          category: RiskCategory.COMPLIANCE,
          status: RiskStatus.ASSESSED,
          likelihood: RiskLikelihood.LOW,
          impact: RiskImpact.HIGH,
          ownerId: complianceOfficer?.id,
        },
        {
          title: 'Insider Threat',
          description: 'Risk of malicious or negligent actions by employees or contractors leading to data theft, system compromise, or operational disruption.',
          category: RiskCategory.CYBERSECURITY,
          status: RiskStatus.ASSESSED,
          likelihood: RiskLikelihood.MEDIUM,
          impact: RiskImpact.HIGH,
          ownerId: riskManager?.id,
        },
        {
          title: 'Cloud Service Outage',
          description: 'Risk of extended cloud service provider outage affecting critical business applications and customer-facing services.',
          category: RiskCategory.OPERATIONAL,
          status: RiskStatus.IDENTIFIED,
          likelihood: RiskLikelihood.LOW,
          impact: RiskImpact.HIGH,
          ownerId: adminUser?.id,
        },
        {
          title: 'Financial Fraud',
          description: 'Risk of financial fraud through payment processing, accounting systems, or unauthorized transactions. Could result in significant financial losses.',
          category: RiskCategory.FINANCIAL,
          status: RiskStatus.ASSESSED,
          likelihood: RiskLikelihood.LOW,
          impact: RiskImpact.HIGH,
          ownerId: adminUser?.id,
        },
        {
          title: 'Supply Chain Compromise',
          description: 'Risk of supply chain compromise through compromised third-party software, hardware, or services. Could introduce backdoors or vulnerabilities.',
          category: RiskCategory.CYBERSECURITY,
          status: RiskStatus.IDENTIFIED,
          likelihood: RiskLikelihood.LOW,
          impact: RiskImpact.HIGH,
          ownerId: riskManager?.id,
        },
        {
          title: 'Advanced Persistent Threat',
          description: 'Risk of sophisticated APT attack remaining undetected for extended periods, causing significant data exfiltration and system compromise.',
          category: RiskCategory.CYBERSECURITY,
          status: RiskStatus.ASSESSED,
          likelihood: RiskLikelihood.MEDIUM,
          impact: RiskImpact.HIGH,
          ownerId: riskManager?.id,
        },
        {
          title: 'Payment System Failure',
          description: 'Risk of critical payment processing system failure resulting in inability to process transactions and significant revenue loss.',
          category: RiskCategory.OPERATIONAL,
          status: RiskStatus.IDENTIFIED,
          likelihood: RiskLikelihood.LOW,
          impact: RiskImpact.HIGH,
          ownerId: adminUser?.id,
        },
        {
          title: 'Compliance Audit Failure',
          description: 'Risk of failing external compliance audit resulting in regulatory penalties, mandatory remediation, and increased oversight.',
          category: RiskCategory.COMPLIANCE,
          status: RiskStatus.ASSESSED,
          likelihood: RiskLikelihood.MEDIUM,
          impact: RiskImpact.HIGH,
          ownerId: complianceOfficer?.id,
        },
        {
          title: 'DDoS Attack',
          description: 'Risk of large-scale DDoS attack causing extended service unavailability and customer impact.',
          category: RiskCategory.CYBERSECURITY,
          status: RiskStatus.IDENTIFIED,
          likelihood: RiskLikelihood.HIGH,
          impact: RiskImpact.HIGH,
          ownerId: riskManager?.id,
        },
        // Medium Impact Risks
        {
          title: 'Third-Party Vendor Failure',
          description: 'Risk of critical vendor service failure impacting business operations. Includes cloud service providers, payment processors, and key suppliers.',
          category: RiskCategory.OPERATIONAL,
          status: RiskStatus.MITIGATED,
          likelihood: RiskLikelihood.LOW,
          impact: RiskImpact.MEDIUM,
          ownerId: adminUser?.id,
        },
        {
          title: 'System Downtime',
          description: 'Risk of extended system downtime affecting customer service and revenue. Could result from infrastructure failures, cyber attacks, or natural disasters.',
          category: RiskCategory.OPERATIONAL,
          status: RiskStatus.IDENTIFIED,
          likelihood: RiskLikelihood.MEDIUM,
          impact: RiskImpact.MEDIUM,
          ownerId: adminUser?.id,
        },
        {
          title: 'Key Personnel Departure',
          description: 'Risk of losing key personnel with critical knowledge or skills, potentially disrupting operations or strategic initiatives.',
          category: RiskCategory.STRATEGIC,
          status: RiskStatus.IDENTIFIED,
          likelihood: RiskLikelihood.MEDIUM,
          impact: RiskImpact.MEDIUM,
          ownerId: adminUser?.id,
        },
        {
          title: 'API Security Vulnerability',
          description: 'Risk of API security vulnerabilities leading to unauthorized access, data exposure, or service disruption. Includes authentication and authorization flaws.',
          category: RiskCategory.CYBERSECURITY,
          status: RiskStatus.ASSESSED,
          likelihood: RiskLikelihood.MEDIUM,
          impact: RiskImpact.MEDIUM,
          ownerId: riskManager?.id,
        },
        {
          title: 'Market Competition',
          description: 'Risk of losing market share to competitors offering superior products, services, or pricing. Could impact revenue and growth objectives.',
          category: RiskCategory.STRATEGIC,
          status: RiskStatus.ASSESSED,
          likelihood: RiskLikelihood.MEDIUM,
          impact: RiskImpact.MEDIUM,
          ownerId: adminUser?.id,
        },
        {
          title: 'Technology Obsolescence',
          description: 'Risk of technology stack becoming obsolete, requiring expensive migrations or losing competitive advantage. Includes legacy system dependencies.',
          category: RiskCategory.STRATEGIC,
          status: RiskStatus.IDENTIFIED,
          likelihood: RiskLikelihood.LOW,
          impact: RiskImpact.MEDIUM,
          ownerId: adminUser?.id,
        },
        {
          title: 'Phishing Attack',
          description: 'Risk of successful phishing attack leading to credential compromise and potential unauthorized access to systems.',
          category: RiskCategory.CYBERSECURITY,
          status: RiskStatus.IDENTIFIED,
          likelihood: RiskLikelihood.HIGH,
          impact: RiskImpact.MEDIUM,
          ownerId: riskManager?.id,
        },
        {
          title: 'Data Loss',
          description: 'Risk of accidental or malicious data loss affecting business operations and requiring recovery efforts.',
          category: RiskCategory.OPERATIONAL,
          status: RiskStatus.ASSESSED,
          likelihood: RiskLikelihood.MEDIUM,
          impact: RiskImpact.MEDIUM,
          ownerId: adminUser?.id,
        },
        {
          title: 'Software Vulnerability',
          description: 'Risk of unpatched software vulnerabilities being exploited, leading to system compromise or data exposure.',
          category: RiskCategory.CYBERSECURITY,
          status: RiskStatus.IDENTIFIED,
          likelihood: RiskLikelihood.HIGH,
          impact: RiskImpact.MEDIUM,
          ownerId: riskManager?.id,
        },
        {
          title: 'Network Outage',
          description: 'Risk of network infrastructure failure causing connectivity issues and service disruption.',
          category: RiskCategory.OPERATIONAL,
          status: RiskStatus.IDENTIFIED,
          likelihood: RiskLikelihood.MEDIUM,
          impact: RiskImpact.MEDIUM,
          ownerId: adminUser?.id,
        },
        {
          title: 'Project Delay',
          description: 'Risk of critical project delays impacting business objectives and strategic initiatives.',
          category: RiskCategory.STRATEGIC,
          status: RiskStatus.ASSESSED,
          likelihood: RiskLikelihood.MEDIUM,
          impact: RiskImpact.MEDIUM,
          ownerId: adminUser?.id,
        },
        // Low Impact Risks
        {
          title: 'Minor Policy Violation',
          description: 'Risk of minor policy violations requiring corrective action but not resulting in significant impact.',
          category: RiskCategory.COMPLIANCE,
          status: RiskStatus.IDENTIFIED,
          likelihood: RiskLikelihood.MEDIUM,
          impact: RiskImpact.LOW,
          ownerId: complianceOfficer?.id,
        },
        {
          title: 'Equipment Failure',
          description: 'Risk of non-critical equipment failure causing minor operational disruption.',
          category: RiskCategory.OPERATIONAL,
          status: RiskStatus.IDENTIFIED,
          likelihood: RiskLikelihood.MEDIUM,
          impact: RiskImpact.LOW,
          ownerId: adminUser?.id,
        },
        {
          title: 'Staff Turnover',
          description: 'Risk of higher than expected staff turnover in non-critical roles.',
          category: RiskCategory.OPERATIONAL,
          status: RiskStatus.ASSESSED,
          likelihood: RiskLikelihood.HIGH,
          impact: RiskImpact.LOW,
          ownerId: adminUser?.id,
        },
        {
          title: 'Budget Overrun',
          description: 'Risk of minor budget overruns on non-critical projects.',
          category: RiskCategory.FINANCIAL,
          status: RiskStatus.IDENTIFIED,
          likelihood: RiskLikelihood.MEDIUM,
          impact: RiskImpact.LOW,
          ownerId: adminUser?.id,
        },
        {
          title: 'Documentation Gap',
          description: 'Risk of incomplete documentation requiring updates but not impacting operations.',
          category: RiskCategory.COMPLIANCE,
          status: RiskStatus.IDENTIFIED,
          likelihood: RiskLikelihood.HIGH,
          impact: RiskImpact.LOW,
          ownerId: complianceOfficer?.id,
        },
        // Very Low Impact Risks
        {
          title: 'Training Delay',
          description: 'Risk of minor delays in employee training programs with minimal business impact.',
          category: RiskCategory.OPERATIONAL,
          status: RiskStatus.IDENTIFIED,
          likelihood: RiskLikelihood.MEDIUM,
          impact: RiskImpact.VERY_LOW,
          ownerId: adminUser?.id,
        },
        {
          title: 'Minor Process Inefficiency',
          description: 'Risk of minor process inefficiencies requiring optimization but not causing significant issues.',
          category: RiskCategory.OPERATIONAL,
          status: RiskStatus.ASSESSED,
          likelihood: RiskLikelihood.HIGH,
          impact: RiskImpact.VERY_LOW,
          ownerId: adminUser?.id,
        },
      ];

      const createdRisks = await riskRepository.save(risks);
      console.log(`✓ Created ${createdRisks.length} risks`);
      
      // Display risk distribution
      const riskDistribution = createdRisks.reduce((acc, risk) => {
        const key = `${risk.likelihood}-${risk.impact}`;
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      console.log('\n📊 Risk Distribution (Likelihood × Impact):');
      Object.entries(riskDistribution).forEach(([key, count]) => {
        const [likelihood, impact] = key.split('-').map(Number);
        const score = likelihood * impact;
        console.log(`  ${likelihood}×${impact} (Score: ${score}): ${count} risks`);
      });
    } else {
      console.log(`Found ${existingRisks} existing risks. Skipping.`);
    }

    // Seed Physical Assets
    const existingPhysicalAssets = await physicalAssetRepository.count();
    let physicalAssets: PhysicalAsset[] = [];
    if (existingPhysicalAssets === 0) {
      console.log('\n💻 Seeding physical assets...');
      const adminUser = createdUsers.find((u) => u.role === UserRole.SUPER_ADMIN);
      const itManager = createdUsers.find((u) => u.role === UserRole.ADMIN);

      const physicalAssetsData = [
        {
          assetIdentifier: 'SRV-PROD-001',
          assetDescription: 'Production Database Server - Primary',
          assetTypeId: null, // TODO: Set to appropriate asset_type_id from asset_types table
          manufacturer: 'Dell',
          model: 'PowerEdge R740',
          serialNumber: 'DL-R740-2023-001',
          location: 'Data Center A',
          building: 'HQ Building',
          floor: 'Basement',
          room: 'DC-A-01',
          ipAddresses: JSON.stringify(['10.0.1.10', '10.0.1.11']),
          macAddresses: JSON.stringify(['00:1B:44:11:3A:B7', '00:1B:44:11:3A:B8']),
          connectivityStatus: ConnectivityStatus.CONNECTED,
          networkApprovalStatus: NetworkApprovalStatus.APPROVED,
          networkApprovalDate: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
          ownerId: adminUser?.id,
          businessUnit: 'IT Operations',
          department: 'Infrastructure',
          criticalityLevel: CriticalityLevel.CRITICAL,
          complianceRequirements: JSON.stringify([]),
          dataClassification: 'Confidential',
          containsPII: true,
          containsPHI: false,
          containsFinancialData: true,
          purchaseDate: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
          warrantyExpiryDate: new Date(Date.now() + 730 * 24 * 60 * 60 * 1000),
          vendor: 'Dell Technologies',
          notes: 'Primary database server. Requires 24/7 monitoring.',
        },
        {
          assetIdentifier: 'SRV-PROD-002',
          assetDescription: 'Production Application Server',
          assetTypeId: null, // TODO: Set to appropriate asset_type_id from asset_types table
          manufacturer: 'HP',
          model: 'ProLiant DL380 Gen10',
          serialNumber: 'HP-DL380-2023-002',
          location: 'Data Center A',
          building: 'HQ Building',
          floor: 'Basement',
          room: 'DC-A-02',
          ipAddresses: JSON.stringify(['10.0.1.20']),
          macAddresses: JSON.stringify(['00:1B:44:11:3A:C7']),
          connectivityStatus: ConnectivityStatus.CONNECTED,
          networkApprovalStatus: NetworkApprovalStatus.APPROVED,
          networkApprovalDate: new Date(Date.now() - 150 * 24 * 60 * 60 * 1000),
          ownerId: adminUser?.id,
          businessUnit: 'IT Operations',
          department: 'Infrastructure',
          criticalityLevel: CriticalityLevel.CRITICAL,
          complianceRequirements: JSON.stringify([]),
          dataClassification: 'Internal',
          containsPII: false,
          containsPHI: false,
          containsFinancialData: false,
          purchaseDate: new Date(Date.now() - 300 * 24 * 60 * 60 * 1000),
          warrantyExpiryDate: new Date(Date.now() + 65 * 24 * 60 * 60 * 1000),
          vendor: 'Hewlett Packard Enterprise',
          notes: 'Hosts critical business applications.',
        },
        {
          assetIdentifier: 'WS-FIN-001',
          assetDescription: 'Finance Department Workstation',
          assetTypeId: null, // TODO: Set to appropriate asset_type_id from asset_types table
          manufacturer: 'Lenovo',
          model: 'ThinkCentre M90q',
          serialNumber: 'LC-M90Q-2024-001',
          location: 'Office Floor 3',
          building: 'HQ Building',
          floor: '3rd Floor',
          room: 'Finance Office',
          ipAddresses: JSON.stringify(['192.168.1.101']),
          macAddresses: JSON.stringify(['00:1B:44:11:3A:D7']),
          connectivityStatus: ConnectivityStatus.CONNECTED,
          networkApprovalStatus: NetworkApprovalStatus.APPROVED,
          networkApprovalDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          ownerId: itManager?.id,
          businessUnit: 'Finance',
          department: 'Accounting',
          criticalityLevel: CriticalityLevel.HIGH,
          complianceRequirements: JSON.stringify([]),
          dataClassification: 'Confidential',
          containsPII: false,
          containsPHI: false,
          containsFinancialData: true,
          purchaseDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
          warrantyExpiryDate: new Date(Date.now() + 670 * 24 * 60 * 60 * 1000),
          vendor: 'Lenovo',
          notes: 'Used for financial reporting and analysis.',
        },
        {
          assetIdentifier: 'WS-HR-001',
          assetDescription: 'HR Department Workstation',
          assetTypeId: null, // TODO: Set to appropriate asset_type_id from asset_types table
          manufacturer: 'Dell',
          model: 'OptiPlex 7090',
          serialNumber: 'DL-7090-2024-002',
          location: 'Office Floor 2',
          building: 'HQ Building',
          floor: '2nd Floor',
          room: 'HR Office',
          ipAddresses: JSON.stringify(['192.168.1.102']),
          macAddresses: JSON.stringify(['00:1B:44:11:3A:E7']),
          connectivityStatus: ConnectivityStatus.CONNECTED,
          networkApprovalStatus: NetworkApprovalStatus.APPROVED,
          networkApprovalDate: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
          ownerId: itManager?.id,
          businessUnit: 'Human Resources',
          department: 'HR Operations',
          criticalityLevel: CriticalityLevel.HIGH,
          complianceRequirements: JSON.stringify([]),
          dataClassification: 'Restricted',
          containsPII: true,
          containsPHI: false,
          containsFinancialData: false,
          purchaseDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
          warrantyExpiryDate: new Date(Date.now() + 685 * 24 * 60 * 60 * 1000),
          vendor: 'Dell Technologies',
          notes: 'Handles sensitive employee data. Requires encryption.',
        },
        {
          assetIdentifier: 'NET-SW-001',
          assetDescription: 'Core Network Switch - Main Distribution',
          assetTypeId: null, // TODO: Set to appropriate asset_type_id from asset_types table
          manufacturer: 'Cisco',
          model: 'Catalyst 9300',
          serialNumber: 'CS-9300-2023-001',
          location: 'Data Center A',
          building: 'HQ Building',
          floor: 'Basement',
          room: 'DC-A-Network',
          ipAddresses: JSON.stringify(['10.0.0.1']),
          macAddresses: JSON.stringify(['00:1B:44:11:3A:F7']),
          connectivityStatus: ConnectivityStatus.CONNECTED,
          networkApprovalStatus: NetworkApprovalStatus.APPROVED,
          networkApprovalDate: new Date(Date.now() - 200 * 24 * 60 * 60 * 1000),
          ownerId: adminUser?.id,
          businessUnit: 'IT Operations',
          department: 'Network Infrastructure',
          criticalityLevel: CriticalityLevel.CRITICAL,
          complianceRequirements: JSON.stringify([]),
          dataClassification: 'Internal',
          containsPII: false,
          containsPHI: false,
          containsFinancialData: false,
          purchaseDate: new Date(Date.now() - 400 * 24 * 60 * 60 * 1000),
          warrantyExpiryDate: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
          vendor: 'Cisco Systems',
          notes: 'Core network infrastructure. Critical for all operations.',
        },
        {
          assetIdentifier: 'MOB-EXEC-001',
          assetDescription: 'Executive Mobile Device',
          assetTypeId: null, // TODO: Set to appropriate asset_type_id from asset_types table
          manufacturer: 'Apple',
          model: 'iPhone 15 Pro',
          serialNumber: 'AP-IP15P-2024-001',
          location: 'Mobile',
          building: null,
          floor: null,
          room: null,
          ipAddresses: JSON.stringify([]),
          macAddresses: JSON.stringify(['00:1B:44:11:3A:G7']),
          connectivityStatus: ConnectivityStatus.CONNECTED,
          networkApprovalStatus: NetworkApprovalStatus.APPROVED,
          networkApprovalDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
          ownerId: adminUser?.id,
          businessUnit: 'Executive',
          department: 'C-Suite',
          criticalityLevel: CriticalityLevel.HIGH,
          complianceRequirements: JSON.stringify([]),
          dataClassification: 'Confidential',
          containsPII: true,
          containsPHI: false,
          containsFinancialData: true,
          purchaseDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
          warrantyExpiryDate: new Date(Date.now() + 345 * 24 * 60 * 60 * 1000),
          vendor: 'Apple Inc.',
          notes: 'MDM managed device. Encrypted storage required.',
        },
        {
          assetIdentifier: 'PRT-FLOOR2-001',
          assetDescription: 'Multifunction Printer - Floor 2',
          assetTypeId: null, // TODO: Set to appropriate asset_type_id from asset_types table
          manufacturer: 'HP',
          model: 'LaserJet Pro MFP M430',
          serialNumber: 'HP-M430-2023-001',
          location: 'Office Floor 2',
          building: 'HQ Building',
          floor: '2nd Floor',
          room: 'Print Room',
          ipAddresses: JSON.stringify(['192.168.1.201']),
          macAddresses: JSON.stringify(['00:1B:44:11:3A:H7']),
          connectivityStatus: ConnectivityStatus.CONNECTED,
          networkApprovalStatus: NetworkApprovalStatus.APPROVED,
          networkApprovalDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
          ownerId: itManager?.id,
          businessUnit: 'IT Operations',
          department: 'Facilities',
          criticalityLevel: CriticalityLevel.LOW,
          complianceRequirements: JSON.stringify([]),
          dataClassification: 'Internal',
          containsPII: false,
          containsPHI: false,
          containsFinancialData: false,
          purchaseDate: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
          warrantyExpiryDate: new Date(Date.now() + 185 * 24 * 60 * 60 * 1000),
          vendor: 'HP Inc.',
          notes: 'Shared printer for floor 2. Regular maintenance required.',
        },
        {
          assetIdentifier: 'STRG-BACKUP-001',
          assetDescription: 'Backup Storage Array',
          assetTypeId: null, // TODO: Set to appropriate asset_type_id from asset_types table
          manufacturer: 'NetApp',
          model: 'FAS8300',
          serialNumber: 'NT-FAS8300-2023-001',
          location: 'Data Center B',
          building: 'HQ Building',
          floor: 'Basement',
          room: 'DC-B-01',
          ipAddresses: JSON.stringify(['10.0.2.10']),
          macAddresses: JSON.stringify(['00:1B:44:11:3A:I7']),
          connectivityStatus: ConnectivityStatus.CONNECTED,
          networkApprovalStatus: NetworkApprovalStatus.APPROVED,
          networkApprovalDate: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000),
          ownerId: adminUser?.id,
          businessUnit: 'IT Operations',
          department: 'Infrastructure',
          criticalityLevel: CriticalityLevel.CRITICAL,
          complianceRequirements: JSON.stringify([]),
          dataClassification: 'Confidential',
          containsPII: true,
          containsPHI: false,
          containsFinancialData: true,
          purchaseDate: new Date(Date.now() - 250 * 24 * 60 * 60 * 1000),
          warrantyExpiryDate: new Date(Date.now() + 115 * 24 * 60 * 60 * 1000),
          vendor: 'NetApp',
          notes: 'Primary backup storage. Critical for disaster recovery.',
        },
      ];

      const createdPhysicalAssets = await physicalAssetRepository.save(physicalAssetsData);
      physicalAssets = createdPhysicalAssets;
      console.log(`✓ Created ${physicalAssets.length} physical assets`);
    } else {
      console.log(`Found ${existingPhysicalAssets} existing physical assets.`);
      physicalAssets = await physicalAssetRepository.find({ take: 5 });
    }

    // Seed Information Assets
    const existingInformationAssets = await informationAssetRepository.count();
    let informationAssets: InformationAsset[] = [];
    if (existingInformationAssets === 0) {
      console.log('\n📄 Seeding information assets...');
      const adminUser = createdUsers.find((u) => u.role === UserRole.SUPER_ADMIN);
      const complianceOfficer = createdUsers.find((u) => u.role === UserRole.COMPLIANCE_OFFICER);

      const informationAssetsData = [
        {
          assetIdentifier: 'INFO-CUST-DB-001',
          assetName: 'Customer Database',
          description: 'Primary customer database containing personal information, purchase history, and preferences.',
          classificationLevel: ClassificationLevel.CONFIDENTIAL,
          classificationDate: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
          reclassificationDate: null,
          ownerId: adminUser?.id,
          custodianId: complianceOfficer?.id,
          businessUnit: 'Customer Relations',
          department: 'Data Management',
          criticalityLevel: CriticalityLevel.CRITICAL,
          complianceRequirements: JSON.stringify([]),
          containsPII: true,
          containsPHI: false,
          containsFinancialData: true,
          containsIntellectualProperty: false,
          storageLocation: 'Production Database Server',
          storageType: 'database',
          retentionPolicy: '7 years from last transaction',
          retentionExpiryDate: null,
          notes: 'Contains sensitive customer data. Requires encryption at rest and in transit.',
        },
        {
          assetIdentifier: 'INFO-EMP-HR-001',
          assetName: 'Employee HR Records',
          description: 'Comprehensive employee records including personal information, employment history, and performance data.',
          classificationLevel: ClassificationLevel.RESTRICTED,
          classificationDate: new Date(Date.now() - 730 * 24 * 60 * 60 * 1000),
          reclassificationDate: null,
          ownerId: adminUser?.id,
          custodianId: complianceOfficer?.id,
          businessUnit: 'Human Resources',
          department: 'HR Operations',
          criticalityLevel: CriticalityLevel.HIGH,
          complianceRequirements: JSON.stringify([]),
          containsPII: true,
          containsPHI: false,
          containsFinancialData: true,
          containsIntellectualProperty: false,
          storageLocation: 'HR System Database',
          storageType: 'database',
          retentionPolicy: '10 years post-employment',
          retentionExpiryDate: null,
          notes: 'Highly sensitive data. Access restricted to HR personnel only.',
        },
        {
          assetIdentifier: 'INFO-FIN-REPORTS-001',
          assetName: 'Financial Reports Archive',
          description: 'Historical financial reports, statements, and audit documentation.',
          classificationLevel: ClassificationLevel.CONFIDENTIAL,
          classificationDate: new Date(Date.now() - 1095 * 24 * 60 * 60 * 1000),
          reclassificationDate: null,
          ownerId: adminUser?.id,
          custodianId: adminUser?.id,
          businessUnit: 'Finance',
          department: 'Accounting',
          criticalityLevel: CriticalityLevel.HIGH,
          complianceRequirements: JSON.stringify([]),
          containsPII: false,
          containsPHI: false,
          containsFinancialData: true,
          containsIntellectualProperty: false,
          storageLocation: 'Finance File Server',
          storageType: 'file_server',
          retentionPolicy: '7 years for tax records, 10 years for audit records',
          retentionExpiryDate: null,
          notes: 'Required for regulatory compliance and audit purposes.',
        },
        {
          assetIdentifier: 'INFO-IP-PATENTS-001',
          assetName: 'Patent Documentation',
          description: 'Intellectual property including patents, trademarks, and proprietary technology documentation.',
          classificationLevel: ClassificationLevel.TOP_SECRET,
          classificationDate: new Date(Date.now() - 500 * 24 * 60 * 60 * 1000),
          reclassificationDate: null,
          ownerId: adminUser?.id,
          custodianId: adminUser?.id,
          businessUnit: 'Legal',
          department: 'Intellectual Property',
          criticalityLevel: CriticalityLevel.CRITICAL,
          complianceRequirements: JSON.stringify([]),
          containsPII: false,
          containsPHI: false,
          containsFinancialData: false,
          containsIntellectualProperty: true,
          storageLocation: 'Secure Document Repository',
          storageType: 'file_server',
          retentionPolicy: 'Permanent - until patent expiration',
          retentionExpiryDate: null,
          notes: 'Critical intellectual property. Maximum security required.',
        },
        {
          assetIdentifier: 'INFO-MKT-RESEARCH-001',
          assetName: 'Market Research Data',
          description: 'Market analysis, competitor intelligence, and customer research data.',
          classificationLevel: ClassificationLevel.INTERNAL,
          classificationDate: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
          reclassificationDate: null,
          ownerId: adminUser?.id,
          custodianId: adminUser?.id,
          businessUnit: 'Marketing',
          department: 'Market Research',
          criticalityLevel: CriticalityLevel.MEDIUM,
          complianceRequirements: JSON.stringify([]),
          containsPII: false,
          containsPHI: false,
          containsFinancialData: false,
          containsIntellectualProperty: true,
          storageLocation: 'Marketing File Server',
          storageType: 'file_server',
          retentionPolicy: '3 years',
          retentionExpiryDate: new Date(Date.now() + 915 * 24 * 60 * 60 * 1000),
          notes: 'Used for strategic planning and competitive analysis.',
        },
        {
          assetIdentifier: 'INFO-COMPLIANCE-AUDIT-001',
          assetName: 'Compliance Audit Records',
          description: 'Records of compliance audits, assessments, and remediation activities.',
          classificationLevel: ClassificationLevel.CONFIDENTIAL,
          classificationDate: new Date(Date.now() - 200 * 24 * 60 * 60 * 1000),
          reclassificationDate: null,
          ownerId: complianceOfficer?.id,
          custodianId: complianceOfficer?.id,
          businessUnit: 'Compliance',
          department: 'Audit & Compliance',
          criticalityLevel: CriticalityLevel.HIGH,
          complianceRequirements: JSON.stringify([]),
          containsPII: false,
          containsPHI: false,
          containsFinancialData: false,
          containsIntellectualProperty: false,
          storageLocation: 'Compliance Document Management System',
          storageType: 'database',
          retentionPolicy: '7 years',
          retentionExpiryDate: null,
          notes: 'Required for regulatory reporting and audit trail.',
        },
      ];

      const createdInformationAssets = await informationAssetRepository.save(informationAssetsData);
      informationAssets = createdInformationAssets;
      console.log(`✓ Created ${informationAssets.length} information assets`);
    } else {
      console.log(`Found ${existingInformationAssets} existing information assets.`);
      informationAssets = await informationAssetRepository.find({ take: 5 });
    }

    // Seed Business Applications
    const existingBusinessApplications = await businessApplicationRepository.count();
    let businessApplications: BusinessApplication[] = [];
    if (existingBusinessApplications === 0) {
      console.log('\n💼 Seeding business applications...');
      const adminUser = createdUsers.find((u) => u.role === UserRole.SUPER_ADMIN);
      const itManager = createdUsers.find((u) => u.role === UserRole.ADMIN);

      const businessApplicationsData = [
        {
          applicationIdentifier: 'APP-ERP-001',
          applicationName: 'Enterprise Resource Planning System',
          description: 'Core ERP system managing finance, HR, supply chain, and operations.',
          applicationType: ApplicationType.WEB_APPLICATION,
          version: '12.5',
          patchLevel: '12.5.3',
          vendor: 'Oracle Corporation',
          vendorContact: 'John Smith',
          vendorEmail: 'support@oracle.com',
          vendorPhone: '+1-800-ORACLE-1',
          ownerId: adminUser?.id,
          businessUnit: 'IT Operations',
          department: 'Enterprise Applications',
          status: ApplicationStatus.ACTIVE,
          criticalityLevel: CriticalityLevel.CRITICAL,
          dataTypesProcessed: JSON.stringify(['financial', 'hr', 'inventory', 'customer']),
          processesPII: true,
          processesPHI: false,
          processesFinancialData: true,
          hostingLocation: 'on_premise',
          technologyStack: 'Oracle Database, Java, WebLogic',
          url: 'https://erp.company.internal',
          complianceRequirements: JSON.stringify([]),
          deploymentDate: new Date(Date.now() - 1095 * 24 * 60 * 60 * 1000),
          lastUpdateDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          notes: 'Critical business system. Requires 99.9% uptime SLA.',
        },
        {
          applicationIdentifier: 'APP-CRM-001',
          applicationName: 'Customer Relationship Management',
          description: 'CRM system for managing customer interactions, sales pipeline, and marketing campaigns.',
          applicationType: ApplicationType.WEB_APPLICATION,
          version: '2024.1',
          patchLevel: '2024.1.2',
          vendor: 'Salesforce',
          vendorContact: 'Sarah Johnson',
          vendorEmail: 'support@salesforce.com',
          vendorPhone: '+1-800-SALESFORCE',
          ownerId: adminUser?.id,
          businessUnit: 'Sales',
          department: 'Sales Operations',
          status: ApplicationStatus.ACTIVE,
          criticalityLevel: CriticalityLevel.HIGH,
          dataTypesProcessed: JSON.stringify(['customer', 'sales', 'marketing']),
          processesPII: true,
          processesPHI: false,
          processesFinancialData: false,
          hostingLocation: 'cloud',
          technologyStack: 'Salesforce Platform, Apex, Lightning',
          url: 'https://company.salesforce.com',
          complianceRequirements: JSON.stringify([]),
          deploymentDate: new Date(Date.now() - 730 * 24 * 60 * 60 * 1000),
          lastUpdateDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          notes: 'Cloud-hosted SaaS application. Regular security reviews required.',
        },
        {
          applicationIdentifier: 'APP-MOBILE-001',
          applicationName: 'Customer Mobile App',
          description: 'Mobile application for customers to access services, make payments, and manage accounts.',
          applicationType: ApplicationType.MOBILE_APP,
          version: '3.2',
          patchLevel: '3.2.1',
          vendor: 'Internal Development',
          vendorContact: 'Development Team',
          vendorEmail: 'dev@company.com',
          vendorPhone: '+966-50-123-4567',
          ownerId: itManager?.id,
          businessUnit: 'Product Development',
          department: 'Mobile Development',
          status: ApplicationStatus.ACTIVE,
          criticalityLevel: CriticalityLevel.HIGH,
          dataTypesProcessed: JSON.stringify(['customer', 'payment', 'transaction']),
          processesPII: true,
          processesPHI: false,
          processesFinancialData: true,
          hostingLocation: 'cloud',
          technologyStack: 'React Native, Node.js, AWS',
          url: 'https://apps.apple.com/company-app',
          complianceRequirements: JSON.stringify([]),
          deploymentDate: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
          lastUpdateDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          notes: 'Public-facing mobile application. Security and privacy critical.',
        },
        {
          applicationIdentifier: 'APP-API-GATEWAY-001',
          applicationName: 'API Gateway Service',
          description: 'Central API gateway managing authentication, rate limiting, and routing for microservices.',
          applicationType: ApplicationType.API_SERVICE,
          version: '2.0',
          patchLevel: '2.0.5',
          vendor: 'Internal Development',
          vendorContact: 'Platform Team',
          vendorEmail: 'platform@company.com',
          vendorPhone: '+966-50-123-4568',
          ownerId: adminUser?.id,
          businessUnit: 'IT Operations',
          department: 'Platform Engineering',
          status: ApplicationStatus.ACTIVE,
          criticalityLevel: CriticalityLevel.CRITICAL,
          dataTypesProcessed: JSON.stringify(['api', 'authentication', 'routing']),
          processesPII: true,
          processesPHI: false,
          processesFinancialData: true,
          hostingLocation: 'cloud',
          technologyStack: 'Kong, Kubernetes, Docker',
          url: 'https://api.company.com',
          complianceRequirements: JSON.stringify([]),
          deploymentDate: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
          lastUpdateDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
          notes: 'Critical infrastructure component. All API traffic flows through this.',
        },
        {
          applicationIdentifier: 'APP-DB-PROD-001',
          applicationName: 'Production Database',
          description: 'Primary production database hosting all critical business data.',
          applicationType: ApplicationType.DATABASE,
          version: '15.2',
          patchLevel: '15.2.3',
          vendor: 'Oracle Corporation',
          vendorContact: 'Database Support',
          vendorEmail: 'db-support@oracle.com',
          vendorPhone: '+1-800-ORACLE-1',
          ownerId: adminUser?.id,
          businessUnit: 'IT Operations',
          department: 'Database Administration',
          status: ApplicationStatus.ACTIVE,
          criticalityLevel: CriticalityLevel.CRITICAL,
          dataTypesProcessed: JSON.stringify(['all']),
          processesPII: true,
          processesPHI: false,
          processesFinancialData: true,
          hostingLocation: 'on_premise',
          technologyStack: 'Oracle Database 15c, RAC',
          url: null,
          complianceRequirements: JSON.stringify([]),
          deploymentDate: new Date(Date.now() - 1095 * 24 * 60 * 60 * 1000),
          lastUpdateDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
          notes: 'Most critical system. Requires continuous monitoring and backup.',
        },
        {
          applicationIdentifier: 'APP-ANALYTICS-001',
          applicationName: 'Business Analytics Platform',
          description: 'Analytics and business intelligence platform for reporting and data visualization.',
          applicationType: ApplicationType.WEB_APPLICATION,
          version: '10.5',
          patchLevel: '10.5.1',
          vendor: 'Tableau Software',
          vendorContact: 'Support Team',
          vendorEmail: 'support@tableau.com',
          vendorPhone: '+1-800-TABLEAU',
          ownerId: itManager?.id,
          businessUnit: 'Business Intelligence',
          department: 'Analytics',
          status: ApplicationStatus.ACTIVE,
          criticalityLevel: CriticalityLevel.MEDIUM,
          dataTypesProcessed: JSON.stringify(['analytics', 'reporting', 'visualization']),
          processesPII: false,
          processesPHI: false,
          processesFinancialData: true,
          hostingLocation: 'cloud',
          technologyStack: 'Tableau Server, PostgreSQL',
          url: 'https://analytics.company.com',
          complianceRequirements: JSON.stringify([]),
          deploymentDate: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
          lastUpdateDate: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
          notes: 'Used for executive reporting and business insights.',
        },
      ];

      const createdBusinessApplications = await businessApplicationRepository.save(businessApplicationsData);
      businessApplications = createdBusinessApplications;
      console.log(`✓ Created ${businessApplications.length} business applications`);
    } else {
      console.log(`Found ${existingBusinessApplications} existing business applications.`);
      businessApplications = await businessApplicationRepository.find({ take: 5 });
    }

    // Seed Software Assets
    const existingSoftwareAssets = await softwareAssetRepository.count();
    let softwareAssets: SoftwareAsset[] = [];
    if (existingSoftwareAssets === 0) {
      console.log('\n💿 Seeding software assets...');
      const adminUser = createdUsers.find((u) => u.role === UserRole.SUPER_ADMIN);
      const itManager = createdUsers.find((u) => u.role === UserRole.ADMIN);

      const softwareAssetsData = [
        {
          softwareIdentifier: 'SW-OS-WIN-001',
          softwareName: 'Microsoft Windows Server',
          description: 'Windows Server operating system for production servers.',
          softwareType: SoftwareType.OPERATING_SYSTEM,
          version: '2022',
          patchLevel: '2022 Build 20348.2113',
          vendor: 'Microsoft Corporation',
          vendorContact: 'Microsoft Support',
          vendorEmail: 'support@microsoft.com',
          vendorPhone: '+1-800-MICROSOFT',
          licenseType: 'Volume License',
          licenseKey: 'XXXXX-XXXXX-XXXXX-XXXXX-XXXXX',
          numberOfLicenses: 50,
          licensesInUse: 45,
          licenseExpiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
          ownerId: adminUser?.id,
          businessUnit: 'IT Operations',
          criticalityLevel: CriticalityLevel.CRITICAL,
          installedOnAssets: JSON.stringify([]),
          complianceRequirements: JSON.stringify([]),
          purchaseDate: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
          installationDate: new Date(Date.now() - 175 * 24 * 60 * 60 * 1000),
          notes: 'Standard server OS. Regular security updates required.',
        },
        {
          softwareIdentifier: 'SW-OS-LINUX-001',
          softwareName: 'Red Hat Enterprise Linux',
          description: 'Enterprise Linux distribution for production servers.',
          softwareType: SoftwareType.OPERATING_SYSTEM,
          version: '9.2',
          patchLevel: '9.2.0',
          vendor: 'Red Hat Inc.',
          vendorContact: 'Red Hat Support',
          vendorEmail: 'support@redhat.com',
          vendorPhone: '+1-888-REDHAT1',
          licenseType: 'Subscription',
          licenseKey: null,
          numberOfLicenses: 100,
          licensesInUse: 78,
          licenseExpiryDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
          ownerId: adminUser?.id,
          businessUnit: 'IT Operations',
          criticalityLevel: CriticalityLevel.CRITICAL,
          installedOnAssets: JSON.stringify([]),
          complianceRequirements: JSON.stringify([]),
          purchaseDate: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
          installationDate: new Date(Date.now() - 360 * 24 * 60 * 60 * 1000),
          notes: 'Primary OS for Linux servers. Subscription includes support.',
        },
        {
          softwareIdentifier: 'SW-APP-OFFICE-001',
          softwareName: 'Microsoft Office 365',
          description: 'Office productivity suite including Word, Excel, PowerPoint, and Outlook.',
          softwareType: SoftwareType.APPLICATION_SOFTWARE,
          version: '2024',
          patchLevel: 'Version 2401',
          vendor: 'Microsoft Corporation',
          vendorContact: 'Microsoft Support',
          vendorEmail: 'support@microsoft.com',
          vendorPhone: '+1-800-MICROSOFT',
          licenseType: 'Subscription',
          licenseKey: null,
          numberOfLicenses: 500,
          licensesInUse: 487,
          licenseExpiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
          ownerId: itManager?.id,
          businessUnit: 'IT Operations',
          criticalityLevel: CriticalityLevel.HIGH,
          installedOnAssets: JSON.stringify([]),
          complianceRequirements: JSON.stringify([]),
          purchaseDate: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
          installationDate: new Date(Date.now() - 360 * 24 * 60 * 60 * 1000),
          notes: 'Standard productivity suite for all employees.',
        },
        {
          softwareIdentifier: 'SW-SEC-ANTIVIRUS-001',
          softwareName: 'Symantec Endpoint Protection',
          description: 'Enterprise antivirus and endpoint security solution.',
          softwareType: SoftwareType.SECURITY_SOFTWARE,
          version: '14.3',
          patchLevel: '14.3.8269.5000',
          vendor: 'Broadcom (Symantec)',
          vendorContact: 'Symantec Support',
          vendorEmail: 'support@symantec.com',
          vendorPhone: '+1-800-SYMANETC',
          licenseType: 'Subscription',
          licenseKey: null,
          numberOfLicenses: 1000,
          licensesInUse: 950,
          licenseExpiryDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000),
          ownerId: adminUser?.id,
          businessUnit: 'IT Security',
          criticalityLevel: CriticalityLevel.CRITICAL,
          installedOnAssets: JSON.stringify([]),
          complianceRequirements: JSON.stringify([]),
          purchaseDate: new Date(Date.now() - 730 * 24 * 60 * 60 * 1000),
          installationDate: new Date(Date.now() - 725 * 24 * 60 * 60 * 1000),
          notes: 'Critical security software. Must be kept up to date.',
        },
        {
          softwareIdentifier: 'SW-DB-ORACLE-001',
          softwareName: 'Oracle Database',
          description: 'Enterprise database management system.',
          softwareType: SoftwareType.DATABASE_SOFTWARE,
          version: '19c',
          patchLevel: '19.21.0.0',
          vendor: 'Oracle Corporation',
          vendorContact: 'Oracle Support',
          vendorEmail: 'support@oracle.com',
          vendorPhone: '+1-800-ORACLE-1',
          licenseType: 'Processor License',
          licenseKey: null,
          numberOfLicenses: 8,
          licensesInUse: 8,
          licenseExpiryDate: null,
          ownerId: adminUser?.id,
          businessUnit: 'IT Operations',
          criticalityLevel: CriticalityLevel.CRITICAL,
          installedOnAssets: JSON.stringify([]),
          complianceRequirements: JSON.stringify([]),
          purchaseDate: new Date(Date.now() - 1095 * 24 * 60 * 60 * 1000),
          installationDate: new Date(Date.now() - 1090 * 24 * 60 * 60 * 1000),
          notes: 'Core database software. Processor-based licensing.',
        },
        {
          softwareIdentifier: 'SW-DEV-VSCODE-001',
          softwareName: 'Visual Studio Code',
          description: 'Code editor for development teams.',
          softwareType: SoftwareType.DEVELOPMENT_TOOL,
          version: '1.85',
          patchLevel: '1.85.2',
          vendor: 'Microsoft Corporation',
          vendorContact: null,
          vendorEmail: null,
          vendorPhone: null,
          licenseType: 'Open Source (MIT)',
          licenseKey: null,
          numberOfLicenses: null,
          licensesInUse: null,
          licenseExpiryDate: null,
          ownerId: itManager?.id,
          businessUnit: 'Product Development',
          criticalityLevel: CriticalityLevel.MEDIUM,
          installedOnAssets: JSON.stringify([]),
          complianceRequirements: JSON.stringify([]),
          purchaseDate: null,
          installationDate: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
          notes: 'Free open-source editor. Widely used by development team.',
        },
      ];

      const createdSoftwareAssets = await softwareAssetRepository.save(softwareAssetsData);
      softwareAssets = createdSoftwareAssets;
      console.log(`✓ Created ${softwareAssets.length} software assets`);
    } else {
      console.log(`Found ${existingSoftwareAssets} existing software assets.`);
      softwareAssets = await softwareAssetRepository.find({ take: 5 });
    }

    // Seed Suppliers
    const existingSuppliers = await supplierRepository.count();
    let suppliers: Supplier[] = [];
    if (existingSuppliers === 0) {
      console.log('\n🏢 Seeding suppliers...');
      const adminUser = createdUsers.find((u) => u.role === UserRole.SUPER_ADMIN);
      const complianceOfficer = createdUsers.find((u) => u.role === UserRole.COMPLIANCE_OFFICER);

      const suppliersData = [
        {
          supplierIdentifier: 'SUP-IT-001',
          supplierName: 'Dell Technologies',
          description: 'Hardware vendor providing servers, workstations, and storage solutions.',
          supplierType: SupplierType.VENDOR,
          primaryContactName: 'Ahmed Al-Mansouri',
          primaryContactEmail: 'ahmed.almansouri@dell.com',
          primaryContactPhone: '+966-11-234-5678',
          address: 'King Fahd Road, Al Olaya',
          city: 'Riyadh',
          country: 'Saudi Arabia',
          postalCode: '12211',
          website: 'https://www.dell.com',
          criticalityLevel: CriticalityLevel.HIGH,
          businessUnit: 'IT Operations',
          contractReference: 'CTR-DELL-2023-001',
          contractStartDate: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
          contractEndDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
          goodsOrServicesProvided: 'Server hardware, workstations, storage arrays, maintenance services',
          complianceRequirements: JSON.stringify([]),
          hasDataAccess: false,
          requiresNDA: true,
          hasSecurityAssessment: true,
          additionalContacts: JSON.stringify([
            { name: 'Support Team', email: 'support@dell.com', phone: '+966-11-234-5679' }
          ]),
          notes: 'Primary hardware vendor. Annual security assessment completed.',
        },
        {
          supplierIdentifier: 'SUP-CLOUD-001',
          supplierName: 'Amazon Web Services',
          description: 'Cloud service provider for infrastructure and platform services.',
          supplierType: SupplierType.SERVICE_PROVIDER,
          primaryContactName: 'Mohammed Al-Rashid',
          primaryContactEmail: 'm.alrashid@aws.com',
          primaryContactPhone: '+966-11-345-6789',
          address: 'King Abdullah Financial District',
          city: 'Riyadh',
          country: 'Saudi Arabia',
          postalCode: '13519',
          website: 'https://aws.amazon.com',
          criticalityLevel: CriticalityLevel.CRITICAL,
          businessUnit: 'IT Operations',
          contractReference: 'CTR-AWS-2023-002',
          contractStartDate: new Date(Date.now() - 730 * 24 * 60 * 60 * 1000),
          contractEndDate: new Date(Date.now() + 730 * 24 * 60 * 60 * 1000),
          goodsOrServicesProvided: 'Cloud infrastructure, compute, storage, networking, managed services',
          complianceRequirements: JSON.stringify([]),
          hasDataAccess: true,
          requiresNDA: true,
          hasSecurityAssessment: true,
          additionalContacts: JSON.stringify([
            { name: 'Technical Support', email: 'support@aws.com', phone: '+966-11-345-6790' },
            { name: 'Account Manager', email: 'account@aws.com', phone: '+966-11-345-6791' }
          ]),
          notes: 'Critical cloud provider. Hosts production workloads. SOC 2 Type II certified.',
        },
        {
          supplierIdentifier: 'SUP-SEC-001',
          supplierName: 'Cybersecurity Consulting Group',
          description: 'Cybersecurity consulting and penetration testing services.',
          supplierType: SupplierType.CONSULTANT,
          primaryContactName: 'Fatima Al-Zahra',
          primaryContactEmail: 'fatima@cybersec-consulting.com',
          primaryContactPhone: '+966-11-456-7890',
          address: 'Al Tahlia Street',
          city: 'Riyadh',
          country: 'Saudi Arabia',
          postalCode: '12211',
          website: 'https://www.cybersec-consulting.com',
          criticalityLevel: CriticalityLevel.HIGH,
          businessUnit: 'IT Security',
          contractReference: 'CTR-CYBER-2024-001',
          contractStartDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
          contractEndDate: new Date(Date.now() + 275 * 24 * 60 * 60 * 1000),
          goodsOrServicesProvided: 'Penetration testing, security assessments, incident response, security consulting',
          complianceRequirements: JSON.stringify([]),
          hasDataAccess: true,
          requiresNDA: true,
          hasSecurityAssessment: true,
          additionalContacts: JSON.stringify([]),
          notes: 'Engaged for quarterly security assessments and incident response.',
        },
        {
          supplierIdentifier: 'SUP-SOFT-001',
          supplierName: 'Microsoft Corporation',
          description: 'Software vendor providing operating systems, productivity software, and cloud services.',
          supplierType: SupplierType.VENDOR,
          primaryContactName: 'Sarah Johnson',
          primaryContactEmail: 'sarah.johnson@microsoft.com',
          primaryContactPhone: '+1-425-882-8080',
          address: 'One Microsoft Way',
          city: 'Redmond',
          country: 'United States',
          postalCode: '98052',
          website: 'https://www.microsoft.com',
          criticalityLevel: CriticalityLevel.CRITICAL,
          businessUnit: 'IT Operations',
          contractReference: 'CTR-MSFT-2023-003',
          contractStartDate: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
          contractEndDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
          goodsOrServicesProvided: 'Windows Server, Office 365, Azure cloud services, software licenses',
          complianceRequirements: JSON.stringify([]),
          hasDataAccess: true,
          requiresNDA: true,
          hasSecurityAssessment: true,
          additionalContacts: JSON.stringify([
            { name: 'Volume Licensing', email: 'licensing@microsoft.com', phone: '+1-800-MICROSOFT' }
          ]),
          notes: 'Major software vendor. Enterprise Agreement in place.',
        },
        {
          supplierIdentifier: 'SUP-FAC-001',
          supplierName: 'Facilities Management Co.',
          description: 'Facilities maintenance and cleaning services.',
          supplierType: SupplierType.CONTRACTOR,
          primaryContactName: 'Khalid Al-Saud',
          primaryContactEmail: 'khalid@facilities-mgmt.com',
          primaryContactPhone: '+966-11-567-8901',
          address: 'Prince Sultan Road',
          city: 'Riyadh',
          country: 'Saudi Arabia',
          postalCode: '11564',
          website: 'https://www.facilities-mgmt.com',
          criticalityLevel: CriticalityLevel.LOW,
          businessUnit: 'Facilities',
          contractReference: 'CTR-FAC-2024-002',
          contractStartDate: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
          contractEndDate: new Date(Date.now() + 185 * 24 * 60 * 60 * 1000),
          goodsOrServicesProvided: 'Cleaning services, maintenance, facility management',
          complianceRequirements: JSON.stringify([]),
          hasDataAccess: false,
          requiresNDA: false,
          hasSecurityAssessment: false,
          additionalContacts: JSON.stringify([]),
          notes: 'Non-IT vendor. No data access required.',
        },
        {
          supplierIdentifier: 'SUP-DEV-001',
          supplierName: 'Offshore Development Team',
          description: 'Offshore software development and maintenance services.',
          supplierType: SupplierType.CONTRACTOR,
          primaryContactName: 'Rajesh Kumar',
          primaryContactEmail: 'rajesh@offshore-dev.com',
          primaryContactPhone: '+91-80-1234-5678',
          address: 'IT Park, Electronic City',
          city: 'Bangalore',
          country: 'India',
          postalCode: '560100',
          website: 'https://www.offshore-dev.com',
          criticalityLevel: CriticalityLevel.HIGH,
          businessUnit: 'Product Development',
          contractReference: 'CTR-DEV-2023-004',
          contractStartDate: new Date(Date.now() - 545 * 24 * 60 * 60 * 1000),
          contractEndDate: new Date(Date.now() + 220 * 24 * 60 * 60 * 1000),
          goodsOrServicesProvided: 'Software development, code maintenance, testing services',
          complianceRequirements: JSON.stringify([]),
          hasDataAccess: true,
          requiresNDA: true,
          hasSecurityAssessment: true,
          additionalContacts: JSON.stringify([
            { name: 'Project Manager', email: 'pm@offshore-dev.com', phone: '+91-80-1234-5679' }
          ]),
          notes: 'Offshore development team. Has access to development environments. Regular security reviews.',
        },
      ];

      const createdSuppliers = await supplierRepository.save(suppliersData);
      suppliers = createdSuppliers;
      console.log(`✓ Created ${suppliers.length} suppliers`);
    } else {
      console.log(`Found ${existingSuppliers} existing suppliers.`);
      suppliers = await supplierRepository.find({ take: 5 });
    }

    console.log('\n✅ Database seeding completed successfully!');
    console.log('\n🔑 Login Credentials:');
    console.log('   Email: Any of the emails above');
    console.log('   Password: password123');
    console.log('\n💡 Recommended test accounts:');
    console.log('   - admin@grcplatform.com (Super Admin)');
    console.log('   - compliance@grcplatform.com (Compliance Officer)');
    console.log('   - risk@grcplatform.com (Risk Manager)');
    console.log('   - user@grcplatform.com (Regular User)');

    await dataSource.destroy();
  } catch (error) {
    console.error('Error seeding database:', error);
    await dataSource.destroy();
    process.exit(1);
  }
}

seed();
