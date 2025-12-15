import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { User, UserRole } from '../users/entities/user.entity';
import { Influencer, InfluencerCategory, InfluencerStatus, ApplicabilityStatus } from '../governance/influencers/entities/influencer.entity';
import { Policy, PolicyStatus, ReviewFrequency } from '../governance/policies/entities/policy.entity';
import { ControlObjective, ImplementationStatus as ControlObjectiveImplementationStatus } from '../governance/control-objectives/entities/control-objective.entity';
import { UnifiedControl, ControlType, ControlComplexity, ControlCostImpact, ControlStatus, ImplementationStatus } from '../governance/unified-controls/entities/unified-control.entity';
import { Assessment, AssessmentType, AssessmentStatus } from '../governance/assessments/entities/assessment.entity';
import { AssessmentResult, AssessmentResultEnum } from '../governance/assessments/entities/assessment-result.entity';
import { Evidence, EvidenceType, EvidenceStatus } from '../governance/evidence/entities/evidence.entity';
import { Finding, FindingSeverity, FindingStatus } from '../governance/findings/entities/finding.entity';

config();

async function seedGovernance() {
  const dbHost = process.env.DB_HOST || 'localhost';
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
    const influencerRepository = dataSource.getRepository(Influencer);
    const policyRepository = dataSource.getRepository(Policy);
    const controlObjectiveRepository = dataSource.getRepository(ControlObjective);
    const unifiedControlRepository = dataSource.getRepository(UnifiedControl);
    const assessmentRepository = dataSource.getRepository(Assessment);
    const assessmentResultRepository = dataSource.getRepository(AssessmentResult);
    const evidenceRepository = dataSource.getRepository(Evidence);
    const findingRepository = dataSource.getRepository(Finding);

    // Get users
    const users = await userRepository.find();
    if (users.length === 0) {
      console.log('⚠️  No users found. Please run the main seed script first.');
      await dataSource.destroy();
      return;
    }

    const adminUser = users.find((u) => u.role === UserRole.SUPER_ADMIN) || users[0];
    const complianceOfficer = users.find((u) => u.role === UserRole.COMPLIANCE_OFFICER) || users[0];
    const riskManager = users.find((u) => u.role === UserRole.RISK_MANAGER) || users[0];
    const auditor = users.find((u) => u.role === UserRole.AUDITOR) || users[0];

    // Check if governance data already exists
    const existingInfluencers = await influencerRepository.count();
    const existingControls = await unifiedControlRepository.count();
    const existingAssessments = await assessmentRepository.count();
    const existingFindings = await findingRepository.count();
    
    if (existingInfluencers > 0 && existingControls > 0 && existingAssessments > 0 && existingFindings > 0) {
      console.log(`Found existing governance data:`);
      console.log(`  - ${existingInfluencers} influencers`);
      console.log(`  - ${existingControls} unified controls`);
      console.log(`  - ${existingAssessments} assessments`);
      console.log(`  - ${existingFindings} findings`);
      console.log('\n✅ Governance data already seeded!');
      console.log('To re-seed, delete existing governance data first.');
      await dataSource.destroy();
      return;
    }
    
    if (existingInfluencers > 0) {
      console.log(`Found ${existingInfluencers} existing influencers. Continuing with remaining data...\n`);
    }

    console.log('🌱 Seeding Governance Module...\n');

    // Initialize variables for summary
    let createdPolicies: any[] = [];
    let createdControlObjectives: any[] = [];

    // 1. Seed Influencers (only if they don't exist)
    let createdInfluencers: Influencer[] = [];
    const existingInfluencersCount = await influencerRepository.count();
    
    if (existingInfluencersCount === 0) {
      console.log('📋 Seeding Influencers...');
      const influencersData = [
      {
        name: 'NCA Cybersecurity Framework',
        category: InfluencerCategory.REGULATORY,
        sub_category: 'Cybersecurity',
        issuing_authority: 'National Cybersecurity Authority',
        jurisdiction: 'Saudi Arabia',
        reference_number: 'NCA-CSF-2023',
        description: 'National Cybersecurity Authority Cybersecurity Framework for critical infrastructure protection.',
        publication_date: new Date('2023-01-15'),
        effective_date: new Date('2023-03-01'),
        last_revision_date: new Date('2023-01-15'),
        next_review_date: new Date('2024-12-31'),
        status: InfluencerStatus.ACTIVE,
        applicability_status: ApplicabilityStatus.APPLICABLE,
        applicability_justification: 'Organization operates critical infrastructure in Saudi Arabia',
        source_url: 'https://nca.gov.sa/frameworks',
        owner_id: complianceOfficer.id,
        tags: ['cybersecurity', 'critical-infrastructure', 'saudi-arabia'],
      },
      {
        name: 'SAMA Cybersecurity Framework',
        category: InfluencerCategory.REGULATORY,
        sub_category: 'Financial Services',
        issuing_authority: 'Saudi Arabian Monetary Authority',
        jurisdiction: 'Saudi Arabia',
        reference_number: 'SAMA-CSF-2022',
        description: 'SAMA Cybersecurity Framework for financial institutions operating in Saudi Arabia.',
        publication_date: new Date('2022-06-01'),
        effective_date: new Date('2022-09-01'),
        last_revision_date: new Date('2022-06-01'),
        next_review_date: new Date('2024-12-31'),
        status: InfluencerStatus.ACTIVE,
        applicability_status: ApplicabilityStatus.APPLICABLE,
        applicability_justification: 'Organization is a financial services provider',
        source_url: 'https://sama.gov.sa/cybersecurity',
        owner_id: complianceOfficer.id,
        tags: ['cybersecurity', 'financial-services', 'sama'],
      },
      {
        name: 'ADGM Data Protection Regulations',
        category: InfluencerCategory.REGULATORY,
        sub_category: 'Data Protection',
        issuing_authority: 'Abu Dhabi Global Market',
        jurisdiction: 'UAE',
        reference_number: 'ADGM-DPR-2021',
        description: 'Data Protection Regulations for entities operating in ADGM.',
        publication_date: new Date('2021-02-14'),
        effective_date: new Date('2021-02-14'),
        last_revision_date: new Date('2021-02-14'),
        next_review_date: new Date('2024-12-31'),
        status: InfluencerStatus.ACTIVE,
        applicability_status: ApplicabilityStatus.APPLICABLE,
        applicability_justification: 'Organization has operations in ADGM',
        source_url: 'https://www.adgm.com/data-protection',
        owner_id: complianceOfficer.id,
        tags: ['data-protection', 'privacy', 'adgm', 'uae'],
      },
      {
        name: 'ISO 27001:2022',
        category: InfluencerCategory.INDUSTRY_STANDARD,
        sub_category: 'Information Security',
        issuing_authority: 'International Organization for Standardization',
        jurisdiction: 'International',
        reference_number: 'ISO/IEC 27001:2022',
        description: 'Information security management systems - Requirements.',
        publication_date: new Date('2022-10-25'),
        effective_date: new Date('2022-10-25'),
        last_revision_date: new Date('2022-10-25'),
        next_review_date: new Date('2027-10-25'),
        status: InfluencerStatus.ACTIVE,
        applicability_status: ApplicabilityStatus.APPLICABLE,
        applicability_justification: 'Organization maintains ISO 27001 certification',
        source_url: 'https://www.iso.org/standard/27001',
        owner_id: complianceOfficer.id,
        tags: ['iso27001', 'information-security', 'certification'],
      },
      {
        name: 'PCI DSS v4.0',
        category: InfluencerCategory.INDUSTRY_STANDARD,
        sub_category: 'Payment Security',
        issuing_authority: 'PCI Security Standards Council',
        jurisdiction: 'International',
        reference_number: 'PCI-DSS-4.0',
        description: 'Payment Card Industry Data Security Standard version 4.0.',
        publication_date: new Date('2022-03-31'),
        effective_date: new Date('2024-03-31'),
        last_revision_date: new Date('2022-03-31'),
        next_review_date: new Date('2025-03-31'),
        status: InfluencerStatus.ACTIVE,
        applicability_status: ApplicabilityStatus.APPLICABLE,
        applicability_justification: 'Organization processes payment card data',
        source_url: 'https://www.pcisecuritystandards.org',
        owner_id: complianceOfficer.id,
        tags: ['pci-dss', 'payment-security', 'card-data'],
      },
      {
        name: 'GDPR',
        category: InfluencerCategory.STATUTORY,
        sub_category: 'Data Protection',
        issuing_authority: 'European Union',
        jurisdiction: 'EU/EEA',
        reference_number: 'EU-2016/679',
        description: 'General Data Protection Regulation for processing personal data of EU residents.',
        publication_date: new Date('2016-04-27'),
        effective_date: new Date('2018-05-25'),
        last_revision_date: new Date('2016-04-27'),
        next_review_date: new Date('2024-12-31'),
        status: InfluencerStatus.ACTIVE,
        applicability_status: ApplicabilityStatus.APPLICABLE,
        applicability_justification: 'Organization processes personal data of EU residents',
        source_url: 'https://gdpr.eu',
        owner_id: complianceOfficer.id,
        tags: ['gdpr', 'data-protection', 'privacy', 'eu'],
      },
    ];

      createdInfluencers = await influencerRepository.save(influencersData);
      console.log(`✓ Created ${createdInfluencers.length} influencers`);
    } else {
      console.log('📋 Influencers already exist, using existing ones...');
      createdInfluencers = await influencerRepository.find();
      console.log(`✓ Found ${createdInfluencers.length} existing influencers`);
    }

    // 2. Seed Policies (skip if policy_type column doesn't exist)
    console.log('\n📄 Seeding Policies...');
    
    // Check if policy_type column exists
    const hasPolicyTypeColumn = await dataSource.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'policies' AND column_name = 'policy_type'
    `);
    
    if (hasPolicyTypeColumn.length === 0) {
      console.log('⚠️  Skipping policies - policy_type column not found in policies table.');
      console.log('   The policies table needs to be migrated to add governance columns.');
      console.log('   Skipping policy-dependent data (Control Objectives).\n');
      
      // Use raw query to get existing policies (without governance fields)
      const existingPoliciesRaw = await dataSource.query('SELECT id, title, version, status FROM policies LIMIT 4');
      createdPolicies = existingPoliciesRaw.map((p: any) => ({ id: p.id, title: p.title, version: p.version, status: p.status }));
      console.log(`✓ Found ${createdPolicies.length} existing policies (from main seed, cannot link to governance)`);
    } else {
      const ncaInfluencer = createdInfluencers.find((i) => i.reference_number === 'NCA-CSF-2023');
      const samaInfluencer = createdInfluencers.find((i) => i.reference_number === 'SAMA-CSF-2022');
      const isoInfluencer = createdInfluencers.find((i) => i.reference_number === 'ISO/IEC 27001:2022');

      // Use raw query to insert policies with both old and new column structures
      const policiesData = [
      {
        title: 'Information Security Policy',
        description: 'This policy establishes the framework for protecting organizational information assets...',
        version: '2.1',
        ownerId: adminUser.id,
        effectiveDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
        reviewDate: new Date(Date.now() + 275 * 24 * 60 * 60 * 1000),
        // Governance-specific fields (will be added via raw query)
        policy_type: 'security',
        version_number: 2,
        content: 'This policy establishes the framework for protecting organizational information assets...',
        purpose: 'To ensure the confidentiality, integrity, and availability of information assets',
        scope: 'All employees, contractors, and third parties with access to organizational information',
        status: 'active' as any, // Using old enum value 'active' for compatibility
        approval_date: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
        review_frequency: ReviewFrequency.ANNUAL,
        next_review_date: new Date(Date.now() + 275 * 24 * 60 * 60 * 1000),
        published_date: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
        linked_influencers: [ncaInfluencer.id, isoInfluencer.id],
        requires_acknowledgment: true,
        acknowledgment_due_days: 30,
        tags: ['security', 'information-security', 'iso27001'],
        created_by: adminUser.id,
      },
      {
        title: 'Data Privacy and Protection Policy',
        description: 'This policy governs the collection, use, and protection of personal data...',
        version: '1.5',
        ownerId: complianceOfficer.id,
        effectiveDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
        reviewDate: new Date(Date.now() + 305 * 24 * 60 * 60 * 1000),
        policy_type: 'compliance',
        version_number: 1,
        content: 'This policy governs the collection, use, and protection of personal data...',
        purpose: 'To ensure compliance with data protection regulations including GDPR, PDPL, and ADGM DPR',
        scope: 'All personal data processing activities',
        status: 'active' as any, // Using old enum value 'active' for compatibility
        approval_date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
        review_frequency: ReviewFrequency.ANNUAL,
        next_review_date: new Date(Date.now() + 305 * 24 * 60 * 60 * 1000),
        published_date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
        linked_influencers: [createdInfluencers.find((i) => i.reference_number === 'EU-2016/679').id],
        requires_acknowledgment: true,
        acknowledgment_due_days: 30,
        tags: ['privacy', 'data-protection', 'gdpr'],
        created_by: complianceOfficer.id,
      },
      {
        title: 'Access Control Policy',
        description: 'This policy governs user access to systems, applications, and data...',
        version: '2.2',
        ownerId: adminUser.id,
        effectiveDate: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000),
        reviewDate: new Date(Date.now() + 265 * 24 * 60 * 60 * 1000),
        policy_type: 'security',
        version_number: 2,
        content: 'This policy governs user access to systems, applications, and data...',
        purpose: 'To implement principles of least privilege and ensure appropriate access controls',
        scope: 'All information systems and data',
        status: 'active' as any, // Using old enum value 'active' for compatibility
        approval_date: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000),
        review_frequency: ReviewFrequency.ANNUAL,
        next_review_date: new Date(Date.now() + 265 * 24 * 60 * 60 * 1000),
        published_date: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000),
        linked_influencers: [ncaInfluencer.id, samaInfluencer.id, isoInfluencer.id],
        requires_acknowledgment: true,
        acknowledgment_due_days: 30,
        tags: ['access-control', 'iam', 'security'],
        created_by: adminUser.id,
      },
      {
        title: 'Password Management Policy',
        description: 'This policy establishes requirements for password creation, storage, and management...',
        version: '1.8',
        ownerId: adminUser.id,
        effectiveDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        reviewDate: new Date(Date.now() + 335 * 24 * 60 * 60 * 1000),
        policy_type: 'security',
        version_number: 1,
        content: 'This policy establishes requirements for password creation, storage, and management...',
        purpose: 'To ensure strong password practices and prevent unauthorized access',
        scope: 'All users with system access',
        status: 'active' as any, // Using old enum value 'active' for compatibility
        approval_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        review_frequency: ReviewFrequency.ANNUAL,
        next_review_date: new Date(Date.now() + 335 * 24 * 60 * 60 * 1000),
        published_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        linked_influencers: [ncaInfluencer.id, isoInfluencer.id],
        requires_acknowledgment: true,
        acknowledgment_due_days: 14,
        tags: ['password', 'authentication', 'security'],
        created_by: adminUser.id,
      },
      ];

      // Insert policies using raw query to handle both column sets
      const createdPoliciesList = [];
    for (const policyData of policiesData) {
      const { policy_type, version_number, content, purpose, scope, approval_date, review_frequency, next_review_date, published_date, linked_influencers, requires_acknowledgment, acknowledgment_due_days, tags, created_by, ...basePolicy } = policyData;
      
      // First insert base policy fields
      const baseResult = await policyRepository.save(basePolicy);
      
      // Build update query based on available columns
      const updateFields = [];
      const updateValues = [];
      let paramIndex = 1;

      if (hasPolicyTypeColumn.length > 0) {
        updateFields.push(`policy_type = $${paramIndex++}`);
        updateValues.push(policy_type);
      }
      
      updateFields.push(`version_number = $${paramIndex++}`);
      updateValues.push(version_number);
      updateFields.push(`content = $${paramIndex++}`);
      updateValues.push(content);
      updateFields.push(`purpose = $${paramIndex++}`);
      updateValues.push(purpose);
      updateFields.push(`scope = $${paramIndex++}`);
      updateValues.push(scope);
      updateFields.push(`approval_date = $${paramIndex++}`);
      updateValues.push(approval_date);
      updateFields.push(`review_frequency = $${paramIndex++}`);
      updateValues.push(review_frequency);
      updateFields.push(`next_review_date = $${paramIndex++}`);
      updateValues.push(next_review_date);
      updateFields.push(`published_date = $${paramIndex++}`);
      updateValues.push(published_date);
      updateFields.push(`linked_influencers = $${paramIndex++}`);
      updateValues.push(linked_influencers);
      updateFields.push(`requires_acknowledgment = $${paramIndex++}`);
      updateValues.push(requires_acknowledgment);
      updateFields.push(`acknowledgment_due_days = $${paramIndex++}`);
      updateValues.push(acknowledgment_due_days);
      updateFields.push(`tags = $${paramIndex++}`);
      updateValues.push(tags);
      updateFields.push(`created_by = $${paramIndex++}`);
      updateValues.push(created_by);
      updateValues.push(baseResult.id);

      if (updateFields.length > 0) {
        await dataSource.query(
          `UPDATE policies SET ${updateFields.join(', ')} WHERE id = $${paramIndex}`,
          updateValues
        );
      }
      
      createdPoliciesList.push(await policyRepository.findOne({ where: { id: baseResult.id } }));
      }
      
      createdPolicies = createdPoliciesList.filter(p => p !== null);
      console.log(`✓ Created ${createdPolicies.length} policies`);
    }

    // 3. Seed Control Objectives
    console.log('\n🎯 Seeding Control Objectives...');
    const existingControlObjectivesCount = await controlObjectiveRepository.count();
    
    if (existingControlObjectivesCount > 0) {
      console.log(`Found ${existingControlObjectivesCount} existing control objectives. Using existing ones...`);
      createdControlObjectives = await controlObjectiveRepository.find();
      console.log(`✓ Using ${createdControlObjectives.length} existing control objectives\n`);
    } else {
      // Get governance policies
      const governancePolicies = await dataSource.query(`
        SELECT id, title FROM policies WHERE version_number IS NOT NULL LIMIT 10
      `);
      
      if (governancePolicies.length === 0) {
        console.log('⚠️  Skipping Control Objectives - no governance policies found.');
        console.log('   Control Objectives require policies with version_number.\n');
      } else {
        const securityPolicy = governancePolicies.find((p: any) => p.title === 'Information Security Policy');
        const accessPolicy = governancePolicies.find((p: any) => p.title === 'Access Control Policy');
        const passwordPolicy = governancePolicies.find((p: any) => p.title === 'Password Management Policy');
        
        if (securityPolicy && accessPolicy && passwordPolicy) {
          const isoInfluencer = createdInfluencers.find((i) => i.reference_number === 'ISO/IEC 27001:2022');
          const ncaInfluencer = createdInfluencers.find((i) => i.reference_number === 'NCA-CSF-2023');
          const samaInfluencer = createdInfluencers.find((i) => i.reference_number === 'SAMA-CSF-2022');

          const controlObjectivesData = [
            {
              objective_identifier: 'CO-IS-001',
              policy_id: securityPolicy.id,
              statement: 'Ensure all information assets are classified and protected according to their classification level',
              rationale: 'Proper classification enables appropriate security controls',
              domain: 'Information Security',
              priority: 'high',
              mandatory: true,
              responsible_party_id: complianceOfficer.id,
              implementation_status: ControlObjectiveImplementationStatus.IMPLEMENTED,
              target_implementation_date: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
              actual_implementation_date: new Date(Date.now() - 175 * 24 * 60 * 60 * 1000),
              linked_influencers: [isoInfluencer?.id].filter(Boolean),
              display_order: 1,
            },
            {
              objective_identifier: 'CO-IS-002',
              policy_id: securityPolicy.id,
              statement: 'Implement encryption for data at rest and in transit',
              rationale: 'Encryption protects data confidentiality',
              domain: 'Information Security',
              priority: 'high',
              mandatory: true,
              responsible_party_id: adminUser.id,
              implementation_status: ImplementationStatus.IMPLEMENTED,
              target_implementation_date: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000),
              actual_implementation_date: new Date(Date.now() - 115 * 24 * 60 * 60 * 1000),
              linked_influencers: [ncaInfluencer?.id, isoInfluencer?.id].filter(Boolean),
              display_order: 2,
            },
            {
              objective_identifier: 'CO-AC-001',
              policy_id: accessPolicy.id,
              statement: 'Implement role-based access control (RBAC) for all systems',
              rationale: 'RBAC ensures users have appropriate access based on their roles',
              domain: 'Access Control',
              priority: 'high',
              mandatory: true,
              responsible_party_id: adminUser.id,
              implementation_status: ImplementationStatus.IMPLEMENTED,
              target_implementation_date: new Date(Date.now() - 200 * 24 * 60 * 60 * 1000),
              actual_implementation_date: new Date(Date.now() - 195 * 24 * 60 * 60 * 1000),
              linked_influencers: [ncaInfluencer?.id, samaInfluencer?.id].filter(Boolean),
              display_order: 1,
            },
            {
              objective_identifier: 'CO-AC-002',
              policy_id: accessPolicy.id,
              statement: 'Conduct quarterly access reviews for all privileged accounts',
              rationale: 'Regular reviews ensure access remains appropriate',
              domain: 'Access Control',
              priority: 'medium',
              mandatory: true,
              responsible_party_id: complianceOfficer.id,
              implementation_status: ControlObjectiveImplementationStatus.IN_PROGRESS,
              target_implementation_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
              linked_influencers: [samaInfluencer?.id].filter(Boolean),
              display_order: 2,
            },
            {
              objective_identifier: 'CO-PM-001',
              policy_id: passwordPolicy.id,
              statement: 'Enforce strong password requirements (minimum 12 characters, complexity)',
              rationale: 'Strong passwords reduce risk of unauthorized access',
              domain: 'Authentication',
              priority: 'high',
              mandatory: true,
              responsible_party_id: adminUser.id,
              implementation_status: ImplementationStatus.IMPLEMENTED,
              target_implementation_date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
              actual_implementation_date: new Date(Date.now() - 55 * 24 * 60 * 60 * 1000),
              linked_influencers: [ncaInfluencer?.id].filter(Boolean),
              display_order: 1,
            },
            {
              objective_identifier: 'CO-PM-002',
              policy_id: passwordPolicy.id,
              statement: 'Implement multi-factor authentication (MFA) for all privileged accounts',
              rationale: 'MFA provides additional security layer beyond passwords',
              domain: 'Authentication',
              priority: 'high',
              mandatory: true,
              responsible_party_id: adminUser.id,
              implementation_status: ImplementationStatus.IN_PROGRESS,
              target_implementation_date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
              linked_influencers: [ncaInfluencer?.id, samaInfluencer?.id].filter(Boolean),
              display_order: 2,
            },
          ];

          createdControlObjectives = await controlObjectiveRepository.save(controlObjectivesData);
          console.log(`✓ Created ${createdControlObjectives.length} control objectives`);
        } else {
          console.log('⚠️  Skipping Control Objectives - required policies not found.');
        }
      }
    }

    // 4. Seed Unified Controls (only if they don't exist)
    console.log('\n🔒 Seeding Unified Controls...');
    const existingControlsCount = await unifiedControlRepository.count();
    
    let createdUnifiedControls: UnifiedControl[] = [];
    if (existingControlsCount === 0) {
      const unifiedControlsData = [
      {
        control_identifier: 'UCL-IAM-001',
        title: 'Multi-Factor Authentication',
        description: 'Implement MFA for all privileged accounts and remote access',
        control_type: ControlType.PREVENTIVE,
        control_category: 'Identity and Access Management',
        domain: 'IAM',
        complexity: ControlComplexity.MEDIUM,
        cost_impact: ControlCostImpact.MEDIUM,
        status: ControlStatus.ACTIVE,
        implementation_status: ImplementationStatus.IN_PROGRESS,
        control_owner_id: adminUser.id,
        control_procedures: '1. Enable MFA on all privileged accounts\n2. Configure MFA for remote access\n3. Train users on MFA usage',
        testing_procedures: '1. Attempt login without MFA (should fail)\n2. Verify MFA prompts appear\n3. Test MFA backup codes',
        tags: ['mfa', 'authentication', 'iam'],
      },
      {
        control_identifier: 'UCL-ENC-001',
        title: 'Data Encryption at Rest',
        description: 'Encrypt all sensitive data stored in databases and file systems',
        control_type: ControlType.PREVENTIVE,
        control_category: 'Cryptography',
        domain: 'Data Protection',
        complexity: ControlComplexity.HIGH,
        cost_impact: ControlCostImpact.MEDIUM,
        status: ControlStatus.ACTIVE,
        implementation_status: ImplementationStatus.IMPLEMENTED,
        control_owner_id: adminUser.id,
        control_procedures: '1. Enable database encryption\n2. Encrypt file systems\n3. Manage encryption keys securely',
        testing_procedures: '1. Verify encryption is enabled\n2. Test data access with encryption\n3. Verify key management',
        tags: ['encryption', 'data-protection', 'cryptography'],
      },
      {
        control_identifier: 'UCL-ENC-002',
        title: 'Data Encryption in Transit',
        description: 'Use TLS 1.2+ for all data transmission',
        control_type: ControlType.PREVENTIVE,
        control_category: 'Cryptography',
        domain: 'Data Protection',
        complexity: ControlComplexity.MEDIUM,
        cost_impact: ControlCostImpact.LOW,
        status: ControlStatus.ACTIVE,
        implementation_status: ImplementationStatus.IMPLEMENTED,
        control_owner_id: adminUser.id,
        control_procedures: '1. Configure TLS 1.2+ on all services\n2. Disable weak protocols\n3. Monitor certificate expiry',
        testing_procedures: '1. Test TLS handshake\n2. Verify weak protocols are disabled\n3. Check certificate validity',
        tags: ['encryption', 'tls', 'network-security'],
      },
      {
        control_identifier: 'UCL-AC-001',
        title: 'Role-Based Access Control',
        description: 'Implement RBAC for all applications and systems',
        control_type: ControlType.PREVENTIVE,
        control_category: 'Access Control',
        domain: 'IAM',
        complexity: ControlComplexity.HIGH,
        cost_impact: ControlCostImpact.MEDIUM,
        status: ControlStatus.ACTIVE,
        implementation_status: ImplementationStatus.IMPLEMENTED,
        control_owner_id: adminUser.id,
        control_procedures: '1. Define roles and permissions\n2. Assign users to roles\n3. Review and update roles quarterly',
        testing_procedures: '1. Verify role assignments\n2. Test permission enforcement\n3. Review access logs',
        tags: ['rbac', 'access-control', 'iam'],
      },
      {
        control_identifier: 'UCL-LOG-001',
        title: 'Security Event Logging',
        description: 'Log all security-relevant events for monitoring and investigation',
        control_type: ControlType.DETECTIVE,
        control_category: 'Logging and Monitoring',
        domain: 'Security Operations',
        complexity: ControlComplexity.MEDIUM,
        cost_impact: ControlCostImpact.MEDIUM,
        status: ControlStatus.ACTIVE,
        implementation_status: ImplementationStatus.IMPLEMENTED,
        control_owner_id: riskManager.id,
        control_procedures: '1. Enable logging on all systems\n2. Centralize logs in SIEM\n3. Retain logs for 1 year minimum',
        testing_procedures: '1. Verify logs are generated\n2. Test log aggregation\n3. Verify log retention',
        tags: ['logging', 'monitoring', 'siem'],
      },
      {
        control_identifier: 'UCL-PW-001',
        title: 'Password Policy Enforcement',
        description: 'Enforce strong password requirements through technical controls',
        control_type: ControlType.PREVENTIVE,
        control_category: 'Authentication',
        domain: 'IAM',
        complexity: ControlComplexity.LOW,
        cost_impact: ControlCostImpact.LOW,
        status: ControlStatus.ACTIVE,
        implementation_status: ImplementationStatus.IMPLEMENTED,
        control_owner_id: adminUser.id,
        control_procedures: '1. Configure password complexity rules\n2. Set minimum password length\n3. Enforce password history',
        testing_procedures: '1. Attempt weak password (should fail)\n2. Verify complexity requirements\n3. Test password history',
        tags: ['password', 'authentication', 'policy'],
      },
    ];

      createdUnifiedControls = await unifiedControlRepository.save(unifiedControlsData);
      console.log(`✓ Created ${createdUnifiedControls.length} unified controls`);
    } else {
      console.log(`Found ${existingControlsCount} existing unified controls. Using existing ones...`);
      createdUnifiedControls = await unifiedControlRepository.find();
      console.log(`✓ Using ${createdUnifiedControls.length} existing unified controls`);
    }

    // 5. Seed Assessments
    console.log('\n📊 Seeding Assessments...');
    const existingAssessmentsCount = await assessmentRepository.count();
    
    // Get control references for assessments
    const mfaControl = createdUnifiedControls.find((c) => c.control_identifier === 'UCL-IAM-001');
    const encControl = createdUnifiedControls.find((c) => c.control_identifier === 'UCL-ENC-001');
    const rbacControl = createdUnifiedControls.find((c) => c.control_identifier === 'UCL-AC-001');
    
    let createdAssessments: Assessment[] = [];
    if (existingAssessmentsCount === 0 && mfaControl && encControl && rbacControl) {
      const assessmentsData = [
        {
          assessment_identifier: 'ASSESS-2024-Q1',
          name: 'Q1 2024 Security Controls Assessment',
          description: 'Quarterly assessment of key security controls',
          assessment_type: AssessmentType.OPERATING_EFFECTIVENESS,
          scope_description: 'Assessment of IAM and encryption controls',
          selected_control_ids: [mfaControl.id, encControl.id, rbacControl.id],
          start_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          status: AssessmentStatus.IN_PROGRESS,
          lead_assessor_id: auditor.id,
          assessor_ids: [auditor.id, complianceOfficer.id],
          controls_total: 3,
          controls_assessed: 1,
          findings_critical: 0,
          findings_high: 1,
          findings_medium: 0,
          findings_low: 0,
          overall_score: 75.0,
          assessment_procedures: '1. Review control documentation\n2. Test control effectiveness\n3. Interview control owners\n4. Review evidence',
          tags: ['quarterly', 'security', 'iam'],
          created_by: auditor.id,
        },
        {
          assessment_identifier: 'ASSESS-2024-ISO',
          name: 'ISO 27001 Compliance Assessment',
          description: 'Annual ISO 27001 compliance assessment',
          assessment_type: AssessmentType.COMPLIANCE,
          scope_description: 'Full ISO 27001 control set assessment',
          selected_control_ids: createdUnifiedControls.map((c) => c.id),
          start_date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
          end_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          status: AssessmentStatus.COMPLETED,
          lead_assessor_id: auditor.id,
          assessor_ids: [auditor.id, complianceOfficer.id],
          controls_total: createdUnifiedControls.length,
          controls_assessed: createdUnifiedControls.length,
          findings_critical: 0,
          findings_high: 2,
          findings_medium: 3,
          findings_low: 1,
          overall_score: 85.0,
          assessment_procedures: 'ISO 27001 audit procedures',
          tags: ['iso27001', 'annual', 'compliance'],
          created_by: auditor.id,
        },
      ];

      createdAssessments = await assessmentRepository.save(assessmentsData);
      console.log(`✓ Created ${createdAssessments.length} assessments`);
    } else {
      if (existingAssessmentsCount > 0) {
        console.log(`Found ${existingAssessmentsCount} existing assessments. Using existing ones...`);
        createdAssessments = await assessmentRepository.find();
        console.log(`✓ Using ${createdAssessments.length} existing assessments`);
      } else {
        console.log('⚠️  Skipping Assessments - required controls not found.');
      }
    }

    // 6. Seed Assessment Results
    console.log('\n📈 Seeding Assessment Results...');
    const existingResultsCount = await assessmentResultRepository.count();
    
    let createdAssessmentResults: AssessmentResult[] = [];
    if (existingResultsCount === 0 && createdAssessments.length > 0 && mfaControl && encControl && rbacControl) {
      const q1Assessment = createdAssessments.find((a) => a.assessment_identifier === 'ASSESS-2024-Q1');
      const isoAssessment = createdAssessments.find((a) => a.assessment_identifier === 'ASSESS-2024-ISO');

      if (q1Assessment && isoAssessment) {
        const assessmentResultsData = [
          {
            assessment_id: q1Assessment.id,
            unified_control_id: mfaControl.id,
            assessor_id: auditor.id,
            assessment_date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
            assessment_procedure_followed: 'Tested MFA configuration and user access',
            result: AssessmentResultEnum.PARTIALLY_COMPLIANT,
            effectiveness_rating: 3,
            findings: 'MFA not fully implemented for all privileged accounts',
            observations: 'Some legacy systems still use password-only authentication',
            recommendations: 'Complete MFA rollout for all privileged accounts within 60 days',
            requires_remediation: true,
            remediation_due_date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
          },
          {
            assessment_id: isoAssessment.id,
            unified_control_id: encControl.id,
            assessor_id: auditor.id,
            assessment_date: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
            assessment_procedure_followed: 'Verified encryption configuration and key management',
            result: AssessmentResultEnum.COMPLIANT,
            effectiveness_rating: 5,
            findings: null,
            observations: 'Encryption properly implemented and keys managed securely',
            recommendations: 'Continue current practices',
            requires_remediation: false,
          },
          {
            assessment_id: isoAssessment.id,
            unified_control_id: rbacControl.id,
            assessor_id: auditor.id,
            assessment_date: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000),
            assessment_procedure_followed: 'Reviewed RBAC implementation and tested access',
            result: AssessmentResultEnum.COMPLIANT,
            effectiveness_rating: 4,
            findings: null,
            observations: 'RBAC properly implemented with regular access reviews',
            recommendations: 'Continue quarterly access reviews',
            requires_remediation: false,
          },
        ];

        createdAssessmentResults = await assessmentResultRepository.save(assessmentResultsData);
        console.log(`✓ Created ${createdAssessmentResults.length} assessment results`);
      }
    } else {
      if (existingResultsCount > 0) {
        console.log(`Found ${existingResultsCount} existing assessment results. Skipping.`);
      } else {
        console.log('⚠️  Skipping assessment results - missing prerequisites.');
      }
    }

    // 7. Seed Evidence
    console.log('\n📎 Seeding Evidence...');
    const existingEvidenceCount = await evidenceRepository.count();
    
    let createdEvidence: Evidence[] = [];
    if (existingEvidenceCount === 0) {
      const evidenceData = [
      {
        evidence_identifier: 'EVID-2024-001',
        title: 'MFA Configuration Screenshot',
        description: 'Screenshot showing MFA configuration for privileged accounts',
        evidence_type: EvidenceType.CONFIGURATION_SCREENSHOT,
        filename: 'mfa-config-2024-01.png',
        file_path: '/uploads/evidence/mfa-config-2024-01.png',
        file_size: 245760,
        mime_type: 'image/png',
        collection_date: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
        valid_until_date: new Date(Date.now() + 335 * 24 * 60 * 60 * 1000),
        collector_id: auditor.id,
        status: EvidenceStatus.APPROVED,
        approved_by: complianceOfficer.id,
        approval_date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
        tags: ['mfa', 'configuration', 'iam'],
        confidential: false,
      },
      {
        evidence_identifier: 'EVID-2024-002',
        title: 'Encryption Key Management Policy',
        description: 'Documentation of encryption key management procedures',
        evidence_type: EvidenceType.POLICY_DOCUMENT,
        filename: 'encryption-key-mgmt-policy.pdf',
        file_path: '/uploads/evidence/encryption-key-mgmt-policy.pdf',
        file_size: 524288,
        mime_type: 'application/pdf',
        collection_date: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000),
        valid_until_date: new Date(Date.now() + 315 * 24 * 60 * 60 * 1000),
        collector_id: complianceOfficer.id,
        status: EvidenceStatus.APPROVED,
        approved_by: adminUser.id,
        approval_date: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
        tags: ['encryption', 'key-management', 'policy'],
        confidential: true,
      },
      {
        evidence_identifier: 'EVID-2024-003',
        title: 'Access Review Report - Q1 2024',
        description: 'Quarterly access review report showing RBAC compliance',
        evidence_type: EvidenceType.SCAN_REPORT,
        filename: 'access-review-q1-2024.pdf',
        file_path: '/uploads/evidence/access-review-q1-2024.pdf',
        file_size: 1048576,
        mime_type: 'application/pdf',
        collection_date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        valid_until_date: new Date(Date.now() + 80 * 24 * 60 * 60 * 1000),
        collector_id: complianceOfficer.id,
        status: EvidenceStatus.APPROVED,
        approved_by: adminUser.id,
        approval_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        tags: ['access-review', 'rbac', 'quarterly'],
        confidential: false,
      },
      ];

      createdEvidence = await evidenceRepository.save(evidenceData);
      console.log(`✓ Created ${createdEvidence.length} evidence items`);
    } else {
      console.log(`Found ${existingEvidenceCount} existing evidence items. Using existing ones...`);
      createdEvidence = await evidenceRepository.find();
      console.log(`✓ Using ${createdEvidence.length} existing evidence items`);
    }

    // 8. Seed Findings
    console.log('\n🔍 Seeding Findings...');
    const existingFindingsCount = await findingRepository.count();
    
    let createdFindings: Finding[] = [];
    if (existingFindingsCount === 0 && createdAssessments.length > 0) {
      // Get assessment results if they exist
      const allAssessmentResults = await assessmentResultRepository.find({
        where: { assessment_id: createdAssessments[0].id },
      });
      
      const q1Assessment = createdAssessments.find((a) => a.assessment_identifier === 'ASSESS-2024-Q1');
      const mfaResult = allAssessmentResults.find((r) => r.requires_remediation === true) || allAssessmentResults[0];

      if (q1Assessment && mfaControl) {
        const findingsData = [
          {
            finding_identifier: 'FIND-2024-001',
            assessment_id: q1Assessment.id,
            assessment_result_id: mfaResult?.id,
            unified_control_id: mfaControl.id,
            title: 'MFA not fully implemented for all privileged accounts',
            description: 'During the assessment, it was discovered that MFA is not fully implemented for all privileged accounts. Some legacy systems still use password-only authentication, which poses a security risk.',
            severity: FindingSeverity.HIGH,
            finding_date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
            status: FindingStatus.OPEN,
            remediation_owner_id: adminUser.id,
            remediation_plan: 'Complete MFA rollout for all privileged accounts within 60 days. Prioritize critical systems first, then migrate legacy systems.',
            remediation_due_date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
            retest_required: true,
            tags: ['mfa', 'authentication', 'privileged-access'],
          },
          {
            finding_identifier: 'FIND-2024-002',
            assessment_id: q1Assessment.id,
            unified_control_id: encControl.id,
            title: 'Encryption key rotation not documented',
            description: 'While encryption is properly implemented, the key rotation procedures are not fully documented. This could lead to compliance issues during audits.',
            severity: FindingSeverity.MEDIUM,
            finding_date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
            status: FindingStatus.IN_PROGRESS,
            remediation_owner_id: complianceOfficer.id,
            remediation_plan: 'Document encryption key rotation procedures and schedule. Ensure all key management activities are logged.',
            remediation_due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            retest_required: false,
            tags: ['encryption', 'key-management', 'documentation'],
          },
          {
            finding_identifier: 'FIND-2024-003',
            assessment_id: q1Assessment.id,
            unified_control_id: rbacControl.id,
            title: 'Access review process needs automation',
            description: 'Access reviews are being conducted manually, which is time-consuming and error-prone. Automation would improve efficiency and accuracy.',
            severity: FindingSeverity.LOW,
            finding_date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
            status: FindingStatus.OPEN,
            remediation_owner_id: adminUser.id,
            remediation_plan: 'Implement automated access review system. Set up quarterly automated reviews with approval workflow.',
            remediation_due_date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
            retest_required: false,
            tags: ['access-review', 'automation', 'rbac'],
          },
        ];

        createdFindings = await findingRepository.save(findingsData);
        console.log(`✓ Created ${createdFindings.length} findings`);
      } else {
        console.log('⚠️  Skipping Findings - required assessments or results not found.');
      }
    } else {
      if (existingFindingsCount > 0) {
        console.log(`Found ${existingFindingsCount} existing findings. Using existing ones...`);
        createdFindings = await findingRepository.find();
        console.log(`✓ Using ${createdFindings.length} existing findings`);
      } else {
        console.log('⚠️  Skipping Findings - missing prerequisites.');
      }
    }

    console.log('\n✅ Governance Module seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - ${createdInfluencers.length} Influencers`);
    console.log(`   - ${createdPolicies.length} Policies`);
    console.log(`   - ${createdControlObjectives.length} Control Objectives`);
    console.log(`   - ${createdUnifiedControls.length} Unified Controls`);
    console.log(`   - ${createdAssessments.length} Assessments`);
    console.log(`   - ${createdAssessmentResults.length} Assessment Results`);
    console.log(`   - ${createdEvidence.length} Evidence Items`);
    console.log(`   - ${createdFindings.length} Findings`);

    await dataSource.destroy();
  } catch (error) {
    console.error('Error seeding governance data:', error);
    await dataSource.destroy();
    process.exit(1);
  }
}

seedGovernance();

