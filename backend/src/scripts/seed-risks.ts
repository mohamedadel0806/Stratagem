import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../users/entities/user.entity';
import { RiskCategory } from '../risk/entities/risk-category.entity';
import { Risk, RiskStatus, RiskLikelihood, RiskImpact, ThreatSource, RiskVelocity } from '../risk/entities/risk.entity';
import { RiskAssessment, AssessmentType, ImpactLevel, ConfidenceLevel } from '../risk/entities/risk-assessment.entity';
import { RiskTreatment, TreatmentStrategy, TreatmentStatus, TreatmentPriority } from '../risk/entities/risk-treatment.entity';
import { TreatmentTask } from '../risk/entities/treatment-task.entity';
import { KRI, MeasurementFrequency, KRIStatus, KRITrend } from '../risk/entities/kri.entity';
import { KRIMeasurement } from '../risk/entities/kri-measurement.entity';
import { RiskAssetLink, RiskAssetType } from '../risk/entities/risk-asset-link.entity';
import { RiskControlLink } from '../risk/entities/risk-control-link.entity';
import { UnifiedControl } from '../governance/unified-controls/entities/unified-control.entity';
import { PhysicalAsset } from '../asset/entities/physical-asset.entity';
import { InformationAsset } from '../asset/entities/information-asset.entity';
import { BusinessApplication } from '../asset/entities/business-application.entity';

config();

async function seedRisks() {
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
    const categoryRepository = dataSource.getRepository(RiskCategory);
    const riskRepository = dataSource.getRepository(Risk);
    const assessmentRepository = dataSource.getRepository(RiskAssessment);
    const treatmentRepository = dataSource.getRepository(RiskTreatment);
    const taskRepository = dataSource.getRepository(TreatmentTask);
    const kriRepository = dataSource.getRepository(KRI);
    const measurementRepository = dataSource.getRepository(KRIMeasurement);
    const assetLinkRepository = dataSource.getRepository(RiskAssetLink);
    const controlLinkRepository = dataSource.getRepository(RiskControlLink);
    const controlRepository = dataSource.getRepository(UnifiedControl);
    const physicalAssetRepository = dataSource.getRepository(PhysicalAsset);
    const informationAssetRepository = dataSource.getRepository(InformationAsset);
    const applicationRepository = dataSource.getRepository(BusinessApplication);

    // Get existing data
    const users = await userRepository.find({ take: 10 });
    if (users.length === 0) {
      console.log('❌ No users found. Please seed users first.');
      await dataSource.destroy();
      return;
    }

    const categories = await categoryRepository.find();
    if (categories.length === 0) {
      console.log('❌ No risk categories found. Please run migrations first.');
      await dataSource.destroy();
      return;
    }

    const controls = await controlRepository.find({ take: 20 });
    
    // Try to get assets, but don't fail if they don't exist
    let physicalAssets: PhysicalAsset[] = [];
    let informationAssets: InformationAsset[] = [];
    let applications: BusinessApplication[] = [];
    
    try {
      physicalAssets = await physicalAssetRepository.find({ take: 10 });
    } catch (e) {
      console.log('  ⚠️  Could not load physical assets (skipping asset links)');
    }
    
    try {
      informationAssets = await informationAssetRepository.find({ take: 10 });
    } catch (e) {
      console.log('  ⚠️  Could not load information assets (skipping asset links)');
    }
    
    try {
      applications = await applicationRepository.find({ take: 10 });
    } catch (e) {
      console.log('  ⚠️  Could not load applications (skipping asset links)');
    }

    console.log(`Found ${users.length} users, ${categories.length} categories, ${controls.length} controls, ${physicalAssets.length + informationAssets.length + applications.length} assets\n`);

    // Sample risk data
    const riskTemplates = [
      {
        title: 'Data Breach from Unauthorized Access',
        description: 'Risk of unauthorized access to sensitive customer data leading to data breach and regulatory penalties.',
        risk_statement: 'If malicious actors exploit weak authentication controls, then customer PII may be exposed, resulting in GDPR violations and reputational damage.',
        category_code: 'CYBERSECURITY',
        status: RiskStatus.IDENTIFIED,
        threat_source: ThreatSource.EXTERNAL,
        risk_velocity: RiskVelocity.FAST,
        likelihood: RiskLikelihood.HIGH,
        impact: RiskImpact.HIGH,
        inherent_likelihood: 4,
        inherent_impact: 5,
        current_likelihood: 3,
        current_impact: 4,
        target_likelihood: 2,
        target_impact: 3,
        early_warning_signs: 'Multiple failed login attempts, unusual access patterns, security alerts from SIEM',
        tags: ['GDPR', 'Customer Data', 'Authentication'],
      },
      {
        title: 'Third-Party Vendor Data Leak',
        description: 'Risk of data exposure through third-party vendor systems or services.',
        risk_statement: 'If vendor security controls fail, then sensitive business data may be leaked, resulting in competitive disadvantage and customer trust loss.',
        category_code: 'OPERATIONAL',
        status: RiskStatus.ASSESSED,
        threat_source: ThreatSource.EXTERNAL,
        risk_velocity: RiskVelocity.MEDIUM,
        likelihood: RiskLikelihood.MEDIUM,
        impact: RiskImpact.HIGH,
        inherent_likelihood: 3,
        inherent_impact: 4,
        current_likelihood: 3,
        current_impact: 4,
        target_likelihood: 2,
        target_impact: 3,
        tags: ['Vendor', 'Data Privacy', 'Third-Party'],
      },
      {
        title: 'Regulatory Non-Compliance Penalties',
        description: 'Risk of financial penalties and sanctions due to non-compliance with industry regulations.',
        risk_statement: 'If compliance controls are not properly implemented, then regulatory violations may occur, resulting in fines and operational restrictions.',
        category_code: 'COMPLIANCE',
        status: RiskStatus.ASSESSED,
        threat_source: ThreatSource.INTERNAL,
        risk_velocity: RiskVelocity.SLOW,
        likelihood: RiskLikelihood.LOW,
        impact: RiskImpact.VERY_HIGH,
        inherent_likelihood: 2,
        inherent_impact: 5,
        current_likelihood: 2,
        current_impact: 5,
        target_likelihood: 1,
        target_impact: 4,
        tags: ['Compliance', 'Regulatory', 'Fines'],
      },
      {
        title: 'Critical System Downtime',
        description: 'Risk of extended downtime of critical business systems affecting operations.',
        risk_statement: 'If infrastructure fails without proper redundancy, then critical systems may be unavailable, resulting in business disruption and revenue loss.',
        category_code: 'OPERATIONAL',
        status: RiskStatus.MITIGATED,
        threat_source: ThreatSource.INTERNAL,
        risk_velocity: RiskVelocity.IMMEDIATE,
        likelihood: RiskLikelihood.VERY_LOW,
        impact: RiskImpact.VERY_HIGH,
        inherent_likelihood: 2,
        inherent_impact: 5,
        current_likelihood: 1,
        current_impact: 4,
        target_likelihood: 1,
        target_impact: 3,
        tags: ['Infrastructure', 'Availability', 'Business Continuity'],
      },
      {
        title: 'Key Personnel Departure',
        description: 'Risk of losing critical knowledge and expertise due to key employee departure.',
        risk_statement: 'If key personnel leave without knowledge transfer, then critical business processes may be disrupted, resulting in operational inefficiencies.',
        category_code: 'OPERATIONAL',
        status: RiskStatus.IDENTIFIED,
        threat_source: ThreatSource.INTERNAL,
        risk_velocity: RiskVelocity.SLOW,
        likelihood: RiskLikelihood.MEDIUM,
        impact: RiskImpact.MEDIUM,
        inherent_likelihood: 3,
        inherent_impact: 3,
        current_likelihood: 3,
        current_impact: 3,
        target_likelihood: 2,
        target_impact: 2,
        tags: ['HR', 'Knowledge Management', 'Succession Planning'],
      },
      {
        title: 'Cloud Service Provider Outage',
        description: 'Risk of extended cloud service provider outage affecting business operations.',
        risk_statement: 'If cloud provider experiences extended outage, then cloud-hosted applications may be unavailable, resulting in service disruption.',
        category_code: 'CYBERSECURITY', // Using CYBERSECURITY as TECHNOLOGY doesn't exist in enum
        status: RiskStatus.ASSESSED,
        threat_source: ThreatSource.EXTERNAL,
        risk_velocity: RiskVelocity.FAST,
        likelihood: RiskLikelihood.LOW,
        impact: RiskImpact.HIGH,
        inherent_likelihood: 2,
        inherent_impact: 4,
        current_likelihood: 2,
        current_impact: 4,
        target_likelihood: 1,
        target_impact: 3,
        tags: ['Cloud', 'Infrastructure', 'Vendor'],
      },
      {
        title: 'Financial Fraud Through System Manipulation',
        description: 'Risk of financial loss due to fraudulent transactions or system manipulation.',
        risk_statement: 'If financial controls are bypassed, then fraudulent transactions may occur, resulting in financial loss and regulatory scrutiny.',
        category_code: 'FINANCIAL',
        status: RiskStatus.ASSESSED,
        threat_source: ThreatSource.INTERNAL,
        risk_velocity: RiskVelocity.MEDIUM,
        likelihood: RiskLikelihood.VERY_LOW,
        impact: RiskImpact.VERY_HIGH,
        inherent_likelihood: 1,
        inherent_impact: 5,
        current_likelihood: 1,
        current_impact: 5,
        target_likelihood: 1,
        target_impact: 4,
        tags: ['Financial', 'Fraud', 'Controls'],
      },
      {
        title: 'Reputational Damage from Data Incident',
        description: 'Risk of reputational damage following a data security incident.',
        risk_statement: 'If data breach becomes public, then customer trust may be lost, resulting in brand damage and customer churn.',
        category_code: 'REPUTATIONAL',
        status: RiskStatus.IDENTIFIED,
        threat_source: ThreatSource.EXTERNAL,
        risk_velocity: RiskVelocity.FAST,
        likelihood: RiskLikelihood.MEDIUM,
        impact: RiskImpact.HIGH,
        inherent_likelihood: 3,
        inherent_impact: 4,
        current_likelihood: 3,
        current_impact: 4,
        target_likelihood: 2,
        target_impact: 3,
        tags: ['Reputation', 'Data Breach', 'Public Relations'],
      },
    ];

    console.log('Creating risks...');
    const createdRisks: Risk[] = [];

    for (const template of riskTemplates) {
      const category = categories.find(c => c.code === template.category_code);
      if (!category) continue;

      const owner = users[Math.floor(Math.random() * users.length)];
      const analyst = users[Math.floor(Math.random() * users.length)];

      const risk = riskRepository.create({
        title: template.title,
        description: template.description,
        risk_statement: template.risk_statement,
        category: template.category_code.toLowerCase() as any,
        category_id: category.id,
        status: template.status,
        likelihood: template.likelihood,
        impact: template.impact,
        ownerId: owner.id,
        risk_analyst_id: analyst.id,
        threat_source: template.threat_source,
        risk_velocity: template.risk_velocity,
        early_warning_signs: template.early_warning_signs,
        tags: template.tags,
        inherent_likelihood: template.inherent_likelihood,
        inherent_impact: template.inherent_impact,
        current_likelihood: template.current_likelihood,
        current_impact: template.current_impact,
        target_likelihood: template.target_likelihood,
        target_impact: template.target_impact,
        date_identified: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000), // Random date in last 90 days
        next_review_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        created_by: owner.id,
      });

      const savedRisk = await riskRepository.save(risk);
      createdRisks.push(savedRisk);
      console.log(`  ✓ Created risk: ${savedRisk.title}`);
    }

    console.log(`\n✅ Created ${createdRisks.length} risks\n`);

    // Create assessments
    console.log('Creating risk assessments...');
    for (const risk of createdRisks) {
      const assessor = users[Math.floor(Math.random() * users.length)];

      // Inherent assessment
      if (risk.inherent_likelihood && risk.inherent_impact) {
        const inherentAssessment = assessmentRepository.create({
          risk_id: risk.id,
          assessment_type: AssessmentType.INHERENT,
          likelihood: risk.inherent_likelihood,
          impact: risk.inherent_impact,
          risk_score: risk.inherent_likelihood * risk.inherent_impact,
          financial_impact: ImpactLevel.MODERATE,
          operational_impact: ImpactLevel.MODERATE,
          reputational_impact: ImpactLevel.MINOR,
          compliance_impact: ImpactLevel.MINOR,
          assessment_date: risk.date_identified || new Date(),
          assessor_id: assessor.id,
          assessment_method: 'qualitative_5x5',
          confidence_level: ConfidenceLevel.MEDIUM,
          is_latest: true,
          created_by: assessor.id,
        });
        await assessmentRepository.save(inherentAssessment);
      }

      // Current assessment
      if (risk.current_likelihood && risk.current_impact) {
        const currentAssessment = assessmentRepository.create({
          risk_id: risk.id,
          assessment_type: AssessmentType.CURRENT,
          likelihood: risk.current_likelihood,
          impact: risk.current_impact,
          risk_score: risk.current_likelihood * risk.current_impact,
          financial_impact: ImpactLevel.MODERATE,
          operational_impact: ImpactLevel.MODERATE,
          reputational_impact: ImpactLevel.MINOR,
          compliance_impact: ImpactLevel.MINOR,
          assessment_date: new Date(),
          assessor_id: assessor.id,
          assessment_method: 'qualitative_5x5',
          confidence_level: ConfidenceLevel.MEDIUM,
          is_latest: true,
          created_by: assessor.id,
        });
        await assessmentRepository.save(currentAssessment);
      }

      // Target assessment
      if (risk.target_likelihood && risk.target_impact) {
        const targetAssessment = assessmentRepository.create({
          risk_id: risk.id,
          assessment_type: AssessmentType.TARGET,
          likelihood: risk.target_likelihood,
          impact: risk.target_impact,
          risk_score: risk.target_likelihood * risk.target_impact,
          financial_impact: ImpactLevel.MINOR,
          operational_impact: ImpactLevel.MINOR,
          reputational_impact: ImpactLevel.NEGLIGIBLE,
          compliance_impact: ImpactLevel.NEGLIGIBLE,
          assessment_date: new Date(),
          assessor_id: assessor.id,
          assessment_method: 'qualitative_5x5',
          confidence_level: ConfidenceLevel.HIGH,
          is_latest: true,
          created_by: assessor.id,
        });
        await assessmentRepository.save(targetAssessment);
      }
    }
    console.log(`✅ Created assessments for ${createdRisks.length} risks\n`);

    // Create treatments
    console.log('Creating risk treatments...');
    const treatmentTemplates = [
      {
        strategy: TreatmentStrategy.MITIGATE,
        title: 'Implement Multi-Factor Authentication',
        description: 'Deploy MFA across all critical systems to reduce unauthorized access risk.',
        priority: TreatmentPriority.HIGH,
        status: TreatmentStatus.IN_PROGRESS,
      },
      {
        strategy: TreatmentStrategy.MITIGATE,
        title: 'Vendor Security Assessment Program',
        description: 'Establish regular security assessments for all third-party vendors.',
        priority: TreatmentPriority.MEDIUM,
        status: TreatmentStatus.PLANNED,
      },
      {
        strategy: TreatmentStrategy.MITIGATE,
        title: 'Compliance Monitoring System',
        description: 'Implement automated compliance monitoring and reporting.',
        priority: TreatmentPriority.HIGH,
        status: TreatmentStatus.IN_PROGRESS,
      },
      {
        strategy: TreatmentStrategy.MITIGATE,
        title: 'Infrastructure Redundancy',
        description: 'Deploy redundant systems and failover mechanisms.',
        priority: TreatmentPriority.CRITICAL,
        status: TreatmentStatus.COMPLETED,
      },
      {
        strategy: TreatmentStrategy.MITIGATE,
        title: 'Knowledge Management Program',
        description: 'Document critical processes and establish succession planning.',
        priority: TreatmentPriority.MEDIUM,
        status: TreatmentStatus.PLANNED,
      },
      {
        strategy: TreatmentStrategy.TRANSFER,
        title: 'Cloud Service Level Agreements',
        description: 'Negotiate enhanced SLAs with cloud providers including penalties.',
        priority: TreatmentPriority.MEDIUM,
        status: TreatmentStatus.PLANNED,
      },
      {
        strategy: TreatmentStrategy.MITIGATE,
        title: 'Enhanced Financial Controls',
        description: 'Implement additional approval workflows and transaction monitoring.',
        priority: TreatmentPriority.HIGH,
        status: TreatmentStatus.IN_PROGRESS,
      },
      {
        strategy: TreatmentStrategy.MITIGATE,
        title: 'Incident Response Plan',
        description: 'Develop and test comprehensive incident response procedures.',
        priority: TreatmentPriority.MEDIUM,
        status: TreatmentStatus.PLANNED,
      },
    ];

    for (let i = 0; i < createdRisks.length && i < treatmentTemplates.length; i++) {
      const risk = createdRisks[i];
      const template = treatmentTemplates[i];
      const owner = users[Math.floor(Math.random() * users.length)];

      const treatment = treatmentRepository.create({
        risk_id: risk.id,
        strategy: template.strategy,
        title: template.title,
        description: template.description,
        treatment_owner_id: owner.id,
        status: template.status,
        priority: template.priority,
        start_date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        target_completion_date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        estimated_cost: Math.floor(Math.random() * 50000) + 10000,
        expected_risk_reduction: 'Reduce likelihood by 1-2 points',
        residual_likelihood: risk.current_likelihood ? risk.current_likelihood - 1 : 2,
        residual_impact: risk.current_impact ? risk.current_impact - 1 : 3,
        created_by: owner.id,
      });

      const savedTreatment = await treatmentRepository.save(treatment);

      // Create tasks for treatment
      const taskTemplates = [
        { title: 'Conduct risk assessment', status: 'completed' },
        { title: 'Develop implementation plan', status: 'completed' },
        { title: 'Obtain management approval', status: 'in_progress' },
        { title: 'Execute implementation', status: 'planned' },
        { title: 'Test and validate', status: 'planned' },
      ];

      for (const taskTemplate of taskTemplates) {
        const assignee = users[Math.floor(Math.random() * users.length)];
        const task = taskRepository.create({
          treatment_id: savedTreatment.id,
          title: taskTemplate.title,
          description: `Task for ${savedTreatment.title}`,
          assignee_id: assignee.id,
          due_date: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000),
          status: taskTemplate.status,
          display_order: taskTemplates.indexOf(taskTemplate),
        });
        await taskRepository.save(task);
      }

      console.log(`  ✓ Created treatment: ${savedTreatment.title} with ${taskTemplates.length} tasks`);
    }
    console.log(`✅ Created treatments for ${Math.min(createdRisks.length, treatmentTemplates.length)} risks\n`);

    // Create KRIs
    console.log('Creating Key Risk Indicators...');
    const kriTemplates = [
      {
        name: 'Failed Authentication Attempts',
        description: 'Number of failed login attempts per day',
        measurement_unit: 'count',
        measurement_frequency: MeasurementFrequency.DAILY,
        threshold_green: 10,
        threshold_amber: 50,
        threshold_red: 100,
        threshold_direction: 'lower_better',
      },
      {
        name: 'Vendor Security Assessment Completion Rate',
        description: 'Percentage of vendors with completed security assessments',
        measurement_unit: '%',
        measurement_frequency: MeasurementFrequency.MONTHLY,
        threshold_green: 90,
        threshold_amber: 75,
        threshold_red: 60,
        threshold_direction: 'higher_better',
      },
      {
        name: 'Compliance Control Gap Count',
        description: 'Number of compliance controls with identified gaps',
        measurement_unit: 'count',
        measurement_frequency: MeasurementFrequency.MONTHLY,
        threshold_green: 0,
        threshold_amber: 5,
        threshold_red: 10,
        threshold_direction: 'lower_better',
      },
      {
        name: 'System Uptime Percentage',
        description: 'Percentage of time critical systems are available',
        measurement_unit: '%',
        measurement_frequency: MeasurementFrequency.DAILY,
        threshold_green: 99.9,
        threshold_amber: 99.5,
        threshold_red: 99.0,
        threshold_direction: 'higher_better',
      },
    ];

    const createdKRIs: KRI[] = [];
    for (let i = 0; i < Math.min(createdRisks.length, kriTemplates.length); i++) {
      const risk = createdRisks[i];
      const template = kriTemplates[i];
      const category = categories.find(c => c.code === risk.category?.toUpperCase());
      const owner = users[Math.floor(Math.random() * users.length)];

      const kri = kriRepository.create({
        name: template.name,
        description: template.description,
        category_id: category?.id,
        measurement_unit: template.measurement_unit,
        measurement_frequency: template.measurement_frequency,
        threshold_green: template.threshold_green,
        threshold_amber: template.threshold_amber,
        threshold_red: template.threshold_red,
        threshold_direction: template.threshold_direction,
        current_value: template.threshold_direction === 'lower_better' 
          ? template.threshold_amber + Math.random() * (template.threshold_red - template.threshold_amber)
          : template.threshold_green - Math.random() * (template.threshold_green - template.threshold_amber),
        kri_owner_id: owner.id,
        is_active: true,
        last_measured_at: new Date(),
        next_measurement_due: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        created_by: owner.id,
      });

      const savedKRI = await kriRepository.save(kri);
      createdKRIs.push(savedKRI);

      // Create measurements
      for (let j = 0; j < 10; j++) {
        const measurementDate = new Date(Date.now() - (10 - j) * 7 * 24 * 60 * 60 * 1000);
        const value = template.threshold_direction === 'lower_better'
          ? template.threshold_amber + Math.random() * (template.threshold_red - template.threshold_amber)
          : template.threshold_green - Math.random() * (template.threshold_green - template.threshold_amber);

        const measurement = measurementRepository.create({
          kri_id: savedKRI.id,
          measurement_date: measurementDate,
          value: value,
          measured_by: owner.id,
        });
        await measurementRepository.save(measurement);
      }

      // Link KRI to risk
      await dataSource.query(
        `INSERT INTO kri_risk_links (id, kri_id, risk_id, relationship_type, linked_by, linked_at) VALUES ($1, $2, $3, $4, $5, $6)`,
        [uuidv4(), savedKRI.id, risk.id, 'indicator', owner.id, new Date()]
      );

      console.log(`  ✓ Created KRI: ${savedKRI.name} with 10 measurements`);
    }
    console.log(`✅ Created ${createdKRIs.length} KRIs\n`);

    // Link risks to assets
    console.log('Linking risks to assets...');
    let linkCount = 0;
    for (const risk of createdRisks) {
      // Link to physical assets
      if (physicalAssets.length > 0 && Math.random() > 0.5) {
        const asset = physicalAssets[Math.floor(Math.random() * physicalAssets.length)];
        const link = assetLinkRepository.create({
          risk_id: risk.id,
          asset_type: RiskAssetType.PHYSICAL,
          asset_id: asset.id,
          impact_description: `Risk impacts ${asset.assetDescription}`,
        });
        await assetLinkRepository.save(link);
        linkCount++;
      }

      // Link to information assets
      if (informationAssets.length > 0 && Math.random() > 0.5) {
        const asset = informationAssets[Math.floor(Math.random() * informationAssets.length)];
        const link = assetLinkRepository.create({
          risk_id: risk.id,
          asset_type: RiskAssetType.INFORMATION,
          asset_id: asset.id,
          impact_description: `Risk impacts information asset ${(asset as any).name || asset.id.substring(0, 8)}`,
        });
        await assetLinkRepository.save(link);
        linkCount++;
      }

      // Link to applications
      if (applications.length > 0 && Math.random() > 0.5) {
        const asset = applications[Math.floor(Math.random() * applications.length)];
        const link = assetLinkRepository.create({
          risk_id: risk.id,
          asset_type: RiskAssetType.APPLICATION,
          asset_id: asset.id,
          impact_description: `Risk impacts ${asset.applicationName}`,
        });
        await assetLinkRepository.save(link);
        linkCount++;
      }
    }
    console.log(`✅ Created ${linkCount} risk-asset links\n`);

    // Link risks to controls
    console.log('Linking risks to controls...');
    let controlLinkCount = 0;
    for (const risk of createdRisks) {
      if (controls.length > 0 && Math.random() > 0.6) {
        const control = controls[Math.floor(Math.random() * controls.length)];
        const effectiveness = Math.floor(Math.random() * 40) + 60; // 60-100%

        const link = controlLinkRepository.create({
          risk_id: risk.id,
          control_id: control.id,
          effectiveness_rating: Math.floor(effectiveness / 20), // 1-5 scale
          effectiveness_type: 'scale',
          notes: `Control ${control.control_identifier} mitigates this risk`,
          linked_by: users[Math.floor(Math.random() * users.length)].id,
        });
        await controlLinkRepository.save(link);
        controlLinkCount++;
      }
    }
    console.log(`✅ Created ${controlLinkCount} risk-control links\n`);

    console.log('\n🎉 Risk seeding completed successfully!');
    console.log(`\nSummary:`);
    console.log(`  - Risks: ${createdRisks.length}`);
    console.log(`  - Assessments: ${createdRisks.length * 3}`);
    console.log(`  - Treatments: ${Math.min(createdRisks.length, treatmentTemplates.length)}`);
    console.log(`  - KRIs: ${createdKRIs.length}`);
    console.log(`  - Asset Links: ${linkCount}`);
    console.log(`  - Control Links: ${controlLinkCount}\n`);

    await dataSource.destroy();
  } catch (error) {
    console.error('Error seeding risks:', error);
    await dataSource.destroy();
    process.exit(1);
  }
}

seedRisks();

