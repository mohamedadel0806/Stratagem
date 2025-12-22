import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { SOP, SOPStatus, SOPCategory } from '../governance/sops/entities/sop.entity';
import { SOPAssignment } from '../governance/sops/entities/sop-assignment.entity';
import { User, UserRole } from '../users/entities/user.entity';
import { UnifiedControl } from '../governance/unified-controls/entities/unified-control.entity';

config();

async function seedSOPs() {
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

    const sopRepository = dataSource.getRepository(SOP);
    const sopAssignmentRepository = dataSource.getRepository(SOPAssignment);
    const userRepository = dataSource.getRepository(User);
    const controlRepository = dataSource.getRepository(UnifiedControl);

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
    const regularUsers = users.filter((u) => u.role === UserRole.USER).slice(0, 5);

    // Check if SOPs already exist
    const existingSOPsCount = await sopRepository.count();
    if (existingSOPsCount > 0) {
      console.log(`Found ${existingSOPsCount} existing SOPs. Skipping SOP seeding.`);
      await dataSource.destroy();
      return;
    }

    console.log('🌱 Seeding SOPs...\n');

    // Get controls for linking
    const controls = await controlRepository.find({ take: 10 });

    // Create SOPs
    const sopsData = [
      {
        sop_identifier: 'SOP-SEC-001',
        title: 'User Account Provisioning and Deprovisioning',
        category: SOPCategory.SECURITY,
        subcategory: 'Identity Management',
        purpose: 'To ensure proper lifecycle management of user accounts',
        scope: 'All employees, contractors, and third parties requiring system access',
        content: `# User Account Provisioning and Deprovisioning

## Purpose
This procedure ensures proper lifecycle management of user accounts to maintain security and compliance.

## Scope
All employees, contractors, and third parties requiring access to organizational systems.

## Responsibilities
- **HR Department**: Notify IT of new hires, transfers, and terminations
- **IT Security Team**: Provision/deprovision accounts and manage access rights
- **Department Managers**: Approve access requests for their teams

## Procedure

### Account Provisioning
1. **Request Initiation**
   - HR submits new hire/transfer form to IT
   - Department manager submits access request for contractors

2. **Access Determination**
   - IT Security reviews business justification
   - Department manager approves role-based access requirements

3. **Account Creation**
   - Create user account in Active Directory
   - Set up email and basic applications
   - Assign appropriate security groups

4. **Access Provisioning**
   - Grant access to required systems based on role
   - Configure multi-factor authentication
   - Provide account credentials securely

5. **Verification and Training**
   - Verify account creation and access
   - Provide security awareness training
   - Document account details

### Account Deprovisioning
1. **Termination Notification**
   - HR notifies IT Security of employee/contractor termination

2. **Immediate Actions**
   - Disable user account immediately
   - Forward email to manager
   - Disable VPN/remote access

3. **Access Removal**
   - Remove from all security groups
   - Revoke access to applications and systems
   - Cancel any pending access requests

4. **Data Transfer**
   - Transfer critical data to appropriate personnel
   - Archive user data as required

5. **Account Deletion**
   - Delete or archive account after retention period
   - Document deprovisioning activities

## References
- Access Control Policy
- Password Management Policy
- ISO 27001:2022 A.9.2`,
        version: '2.1',
        status: SOPStatus.PUBLISHED,
        owner_id: adminUser.id,
        review_frequency: 'annual',
        next_review_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        published_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        linked_policies: [],
        linked_standards: [],
        control_ids: controls.filter(c => c.control_identifier.includes('IAM') || c.control_identifier.includes('AC')).map(c => c.id),
        tags: ['user-provisioning', 'account-management', 'security', 'iam'],
      },
      {
        sop_identifier: 'SOP-SEC-002',
        title: 'Incident Response and Management',
        category: SOPCategory.SECURITY,
        subcategory: 'Incident Management',
        purpose: 'To provide structured approach to handling security incidents',
        scope: 'All organizational systems and personnel involved in incident response',
        content: `# Incident Response and Management

## Purpose
This procedure provides a structured approach to detecting, responding to, and recovering from security incidents.

## Scope
All organizational systems and personnel involved in incident response activities.

## Responsibilities
- **Security Operations Center (SOC)**: 24/7 monitoring and initial response
- **Incident Response Team**: Investigation and containment
- **Communications Team**: Internal/external notifications
- **Legal Department**: Regulatory reporting requirements

## Incident Classification

### Severity Levels
- **Critical**: System-wide compromise, data breach, regulatory violation
- **High**: Single system compromise, unauthorized access to sensitive data
- **Medium**: Attempted attacks, policy violations, unusual activities
- **Low**: Minor security events, false positives

## Response Procedure

### Phase 1: Detection and Analysis (0-1 hour)
1. **Detection**
   - SOC identifies potential security event
   - Automated alerts from monitoring systems
   - User reports of suspicious activity

2. **Initial Assessment**
   - Verify incident validity
   - Determine severity and scope
   - Notify incident response team

3. **Classification**
   - Assign severity level
   - Determine response timeline

### Phase 2: Containment (1-4 hours)
1. **Short-term Containment**
   - Isolate affected systems
   - Block malicious activity
   - Preserve evidence

2. **Long-term Containment**
   - Implement additional controls
   - Update security policies if needed

### Phase 3: Eradication (4-24 hours)
1. **Root Cause Analysis**
   - Identify attack vectors
   - Determine exploitation methods
   - Assess damage extent

2. **System Recovery**
   - Remove malware/backdoors
   - Patch vulnerabilities
   - Restore from clean backups

### Phase 4: Recovery and Lessons Learned (1-7 days)
1. **System Restoration**
   - Test recovered systems
   - Gradually restore production access
   - Monitor for reoccurrence

2. **Post-Incident Review**
   - Document incident details
   - Identify improvement opportunities
   - Update procedures and training

## Communication Plan

### Internal Notifications
- Incident Response Team: Immediate
- Senior Management: Within 1 hour of critical incidents
- Affected Departments: As appropriate

### External Notifications
- Regulatory Bodies: As required by law
- Customers: In case of data breach
- Partners: If incident affects them

## References
- Information Security Policy
- Incident Response Plan
- NCA Cybersecurity Framework
- ISO 27001:2022 A.16`,
        version: '1.3',
        status: SOPStatus.PUBLISHED,
        owner_id: riskManager.id,
        review_frequency: 'semi-annual',
        next_review_date: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
        published_date: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
        linked_policies: [],
        linked_standards: [],
        control_ids: controls.filter(c => c.control_identifier.includes('LOG') || c.control_identifier.includes('INC')).map(c => c.id),
        tags: ['incident-response', 'security-incident', 'breach-response', 'cybersecurity'],
      },
      {
        sop_identifier: 'SOP-SEC-003',
        title: 'Data Backup and Recovery',
        category: SOPCategory.SECURITY,
        subcategory: 'Data Protection',
        purpose: 'To ensure regular backups and reliable data recovery capabilities',
        scope: 'All critical systems and data repositories',
        content: `# Data Backup and Recovery

## Purpose
This procedure ensures that critical organizational data is regularly backed up and can be reliably recovered in case of data loss incidents.

## Scope
All critical systems, databases, and data repositories containing sensitive or operational data.

## Responsibilities
- **IT Operations**: Perform backups and test recoveries
- **Database Administrators**: Database-specific backup procedures
- **Security Team**: Encryption and secure storage
- **Business Owners**: Define recovery time objectives (RTO) and recovery point objectives (RPO)

## Backup Strategy

### Backup Types
- **Full Backup**: Complete copy of all data (weekly)
- **Incremental Backup**: Only changed data since last backup (daily)
- **Differential Backup**: All changes since last full backup (daily)

### Backup Frequency
- **Critical Systems**: Daily full backups + hourly transaction logs
- **Important Data**: Daily incremental backups
- **User Data**: Weekly full backups
- **System Configurations**: Daily backups

## Backup Procedures

### Automated Backups
1. **Database Backups**
   - Full backups every Sunday at 2:00 AM
   - Transaction log backups every 4 hours
   - Backup verification and integrity checks

2. **File System Backups**
   - Incremental backups Monday-Friday at 10:00 PM
   - Full backups every Saturday at 2:00 AM
   - Archive backups retained for 7 years

3. **Application Backups**
   - Configuration files daily
   - Application data with business logic
   - Custom scripts and automation tools

### Manual Backup Procedures
1. **Pre-Backup Checklist**
   - Verify backup media availability
   - Check system performance
   - Notify stakeholders of maintenance window

2. **Backup Execution**
   - Run backup jobs in sequence
   - Monitor progress and resolve issues
   - Verify backup completion

3. **Post-Backup Verification**
   - Check backup logs for errors
   - Verify backup size and integrity
   - Test backup readability

## Recovery Procedures

### Recovery Time Objectives (RTO)
- **Critical Systems**: 4 hours
- **Important Systems**: 24 hours
- **Standard Systems**: 72 hours

### Recovery Point Objectives (RPO)
- **Critical Data**: 1 hour data loss tolerance
- **Important Data**: 8 hours data loss tolerance
- **Standard Data**: 24 hours data loss tolerance

### Recovery Steps
1. **Assessment**
   - Determine scope of data loss
   - Identify recovery method
   - Estimate recovery time

2. **Preparation**
   - Prepare recovery environment
   - Gather necessary resources
   - Notify stakeholders

3. **Recovery Execution**
   - Restore from backup media
   - Verify data integrity
   - Test system functionality

4. **Post-Recovery**
   - Monitor system performance
   - Update documentation
   - Conduct lessons learned review

## Testing and Maintenance

### Regular Testing
- **Monthly**: Restore test for critical systems
- **Quarterly**: Full disaster recovery test
- **Annually**: Complete business continuity test

### Backup Media Management
- **Storage**: Secure offsite storage facility
- **Rotation**: Follow 3-2-1 backup rule
- **Retention**: 7 years for financial records, 3 years for operational data
- **Encryption**: All backup media encrypted

## References
- Data Protection Policy
- Business Continuity Plan
- ISO 27001:2022 A.12.3
- ISO 27001:2022 A.17.1`,
        version: '1.2',
        status: SOPStatus.APPROVED,
        owner_id: adminUser.id,
        review_frequency: 'annual',
        next_review_date: new Date(Date.now() + 300 * 24 * 60 * 60 * 1000),
        approval_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        linked_policies: [],
        linked_standards: [],
        control_ids: controls.filter(c => c.control_identifier.includes('ENC') || c.control_identifier.includes('BAK')).map(c => c.id),
        tags: ['backup', 'recovery', 'data-protection', 'business-continuity'],
      },
      {
        sop_identifier: 'SOP-COM-001',
        title: 'Change Management Process',
        category: SOPCategory.COMPLIANCE,
        subcategory: 'Change Control',
        purpose: 'To ensure changes to IT systems are implemented in a controlled manner',
        scope: 'All changes to production systems, applications, and infrastructure',
        content: `# Change Management Process

## Purpose
This procedure ensures that changes to IT systems are implemented in a controlled manner to minimize risks and maintain system stability.

## Scope
All changes to production systems, applications, infrastructure, and supporting processes.

## Change Classification

### Emergency Changes
- **Definition**: Immediate implementation required to restore service or prevent significant impact
- **Approval**: Change Manager or designated approver
- **Implementation**: Immediate, with post-implementation review
- **Documentation**: Complete documentation required within 24 hours

### Standard Changes
- **Definition**: Pre-approved changes following established patterns
- **Approval**: Automatic approval for pre-approved changes
- **Implementation**: Follow documented procedures
- **Documentation**: Minimal documentation required

### Normal Changes
- **Definition**: All other changes requiring formal approval
- **Approval**: Change Advisory Board (CAB) review
- **Implementation**: Scheduled during maintenance windows
- **Documentation**: Full change record required

## Change Process

### Phase 1: Request for Change (RFC)
1. **Change Initiation**
   - Identify need for change
   - Complete RFC form with details
   - Assign change owner and implementer

2. **Change Evaluation**
   - Assess impact, risk, and resource requirements
   - Determine change classification
   - Identify testing requirements

3. **Schedule Planning**
   - Coordinate with stakeholders
   - Schedule implementation and backout plans
   - Plan communication and notification

### Phase 2: Change Approval
1. **Technical Review**
   - Technical team reviews implementation plan
   - Verify backout procedures
   - Confirm testing completion

2. **CAB Review (for Normal Changes)**
   - Present change to Change Advisory Board
   - Discuss risks and mitigation strategies
   - Obtain formal approval

3. **Final Authorization**
   - Obtain approval from change sponsor
   - Confirm all prerequisites met

### Phase 3: Change Implementation
1. **Pre-Implementation**
   - Final verification of change plan
   - Backup current configuration
   - Notify stakeholders of change window

2. **Implementation**
   - Execute change according to plan
   - Monitor implementation progress
   - Document actual vs. planned activities

3. **Post-Implementation**
   - Verify change success
   - Monitor system performance
   - Update documentation

### Phase 4: Change Closure
1. **Change Verification**
   - Confirm change objectives achieved
   - Verify no unexpected side effects
   - Obtain user acceptance

2. **Documentation Update**
   - Update system documentation
   - Record lessons learned
   - Update change calendar

3. **Post-Implementation Review**
   - Review change success
   - Identify improvement opportunities
   - Close change record

## Risk Assessment

### Risk Levels
- **Low**: Minimal impact, well-tested change
- **Medium**: Moderate impact, requires coordination
- **High**: Significant impact, requires extensive planning
- **Critical**: System-wide impact, requires executive approval

### Risk Mitigation
- **Testing**: All changes tested in development environment
- **Backout Plans**: Detailed procedures for change reversal
- **Monitoring**: Enhanced monitoring during change window
- **Communication**: Stakeholder notification and status updates

## References
- Change Management Policy
- ITIL Change Management Process
- ISO 27001:2022 A.12.1.2`,
        version: '2.0',
        status: SOPStatus.PUBLISHED,
        owner_id: complianceOfficer.id,
        review_frequency: 'annual',
        next_review_date: new Date(Date.now() + 250 * 24 * 60 * 60 * 1000),
        published_date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
        linked_policies: [],
        linked_standards: [],
        control_ids: controls.filter(c => c.control_identifier.includes('CHG') || c.control_identifier.includes('VER')).map(c => c.id),
        tags: ['change-management', 'itil', 'configuration-management', 'change-control'],
      },
      {
        sop_identifier: 'SOP-SEC-004',
        title: 'Vulnerability Management',
        category: SOPCategory.SECURITY,
        subcategory: 'Vulnerability Assessment',
        purpose: 'To systematically identify, assess, and remediate security vulnerabilities',
        scope: 'All systems, applications, and network infrastructure',
        content: `# Vulnerability Management

## Purpose
This procedure provides a systematic approach to identifying, assessing, prioritizing, and remediating security vulnerabilities across all organizational systems.

## Scope
All systems, applications, network infrastructure, and third-party components.

## Vulnerability Classification

### Severity Levels
- **Critical**: Immediate threat to confidentiality, integrity, or availability
- **High**: Significant vulnerability with potential for exploitation
- **Medium**: Moderate vulnerability requiring remediation
- **Low**: Minor vulnerability with limited impact
- **Informational**: Potential issues requiring monitoring

### Risk Factors
- **Exploitability**: How easily vulnerability can be exploited
- **Impact**: Potential damage if exploited
- **Exposure**: How accessible the vulnerable component is
- **Threat Intelligence**: Known active exploitation in the wild

## Vulnerability Management Process

### Phase 1: Discovery and Assessment
1. **Automated Scanning**
   - Weekly vulnerability scans of all systems
   - Continuous monitoring with agent-based scanners
   - Integration with threat intelligence feeds

2. **Manual Assessment**
   - Code reviews for custom applications
   - Configuration reviews
   - Third-party component analysis

3. **Vulnerability Validation**
   - Verify scan results
   - Eliminate false positives
   - Assess exploitability in our environment

### Phase 2: Prioritization and Planning
1. **Risk Scoring**
   - Calculate risk scores based on CVSS
   - Consider business context and threat intelligence
   - Factor in compensating controls

2. **Remediation Planning**
   - Define remediation timelines
   - Identify responsible teams
   - Plan testing and validation procedures

3. **Resource Allocation**
   - Assign remediation tasks
   - Schedule maintenance windows
   - Coordinate with business units

### Phase 3: Remediation and Verification
1. **Patch Management**
   - Apply security patches within defined timelines
   - Test patches in development environment
   - Schedule production deployment

2. **Configuration Changes**
   - Implement security hardening measures
   - Update firewall rules and access controls
   - Modify system configurations

3. **Verification Testing**
   - Confirm vulnerability remediation
   - Test system functionality after changes
   - Validate security controls

### Phase 4: Monitoring and Reporting
1. **Ongoing Monitoring**
   - Continuous vulnerability scanning
   - Monitor for new vulnerabilities
   - Track remediation progress

2. **Reporting**
   - Monthly vulnerability reports
   - Executive dashboards
   - Compliance reporting

3. **Continuous Improvement**
   - Analyze remediation effectiveness
   - Update scanning procedures
   - Enhance prevention measures

## Remediation Timelines

### Critical Vulnerabilities
- **Discovery to Assessment**: 24 hours
- **Assessment to Remediation Plan**: 48 hours
- **Remediation Implementation**: 7 days
- **Verification**: 24 hours after remediation

### High Vulnerabilities
- **Discovery to Assessment**: 72 hours
- **Assessment to Remediation Plan**: 1 week
- **Remediation Implementation**: 30 days
- **Verification**: 1 week after remediation

### Medium/Low Vulnerabilities
- **Discovery to Assessment**: 1 week
- **Assessment to Remediation Plan**: 2 weeks
- **Remediation Implementation**: 90 days
- **Verification**: 2 weeks after remediation

## Exception Process

### Vulnerability Exceptions
- **Justification Required**: Business impact assessment
- **Temporary Nature**: Maximum 90 days
- **Compensating Controls**: Required for exceptions
- **Regular Review**: Monthly exception reviews

## References
- Vulnerability Management Policy
- Patch Management Policy
- ISO 27001:2022 A.12.6.1
- NIST SP 800-40`,
        version: '1.1',
        status: SOPStatus.IN_REVIEW,
        owner_id: riskManager.id,
        review_frequency: 'semi-annual',
        next_review_date: new Date(Date.now() + 150 * 24 * 60 * 60 * 1000),
        approval_date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        linked_policies: [],
        linked_standards: [],
        control_ids: controls.filter(c => c.control_identifier.includes('VUL') || c.control_identifier.includes('PAT')).map(c => c.id),
        tags: ['vulnerability-management', 'patch-management', 'security-scanning', 'risk-assessment'],
      },
      {
        sop_identifier: 'SOP-SEC-005',
        title: 'Third Party Risk Assessment',
        category: SOPCategory.THIRD_PARTY,
        subcategory: 'Vendor Management',
        purpose: 'To assess and manage risks associated with third-party vendors and suppliers',
        scope: 'All third-party vendors providing critical services or having access to sensitive data',
        content: `# Third Party Risk Assessment

## Purpose
This procedure establishes a systematic approach to assessing and managing risks associated with third-party vendors and suppliers.

## Scope
All third-party vendors providing critical services or having access to sensitive data.

## Vendor Classification

### Risk Tiers
- **Critical**: Access to sensitive data, core business processes
- **High**: Important business functions, significant data access
- **Medium**: Standard business services, limited data access
- **Low**: Basic services, no sensitive data access

### Assessment Frequency
- **Critical Vendors**: Annual comprehensive assessment
- **High Risk Vendors**: Biennial assessment
- **Medium Risk Vendors**: Triennial assessment
- **Low Risk Vendors**: Initial assessment only

## Assessment Process

### Phase 1: Vendor Onboarding
1. **Vendor Identification**
   - Identify new vendors requiring assessment
   - Determine vendor risk tier
   - Assign assessment lead

2. **Initial Documentation**
   - Request vendor information questionnaire
   - Collect basic vendor details
   - Review contract requirements

3. **Risk Profile Creation**
   - Document vendor services and data access
   - Identify potential risk areas
   - Determine assessment scope

### Phase 2: Risk Assessment
1. **Documentation Review**
   - Security policies and procedures
   - Incident response capabilities
   - Business continuity plans
   - Insurance coverage

2. **Technical Assessment**
   - Security controls evaluation
   - Network security review
   - Access control mechanisms
   - Encryption practices

3. **Operational Assessment**
   - Financial stability review
   - Reference checks
   - Performance history
   - Compliance certifications

4. **Contract Review**
   - Service level agreements
   - Security requirements
   - Termination clauses
   - Liability provisions

### Phase 3: Risk Scoring and Mitigation
1. **Risk Scoring**
   - Quantitative risk assessment
   - Qualitative risk evaluation
   - Overall risk rating determination

2. **Risk Mitigation Planning**
   - Identify required controls
   - Develop remediation plans
   - Establish monitoring requirements

3. **Contract Negotiations**
   - Security requirement inclusion
   - Right-to-audit clauses
   - Breach notification requirements
   - Termination rights

### Phase 4: Ongoing Monitoring
1. **Performance Monitoring**
   - Service delivery metrics
   - Security incident tracking
   - Compliance status monitoring

2. **Periodic Reassessment**
   - Annual risk reviews
   - Significant change evaluations
   - Contract renewal assessments

3. **Issue Management**
   - Incident response coordination
   - Breach notification handling
   - Remediation tracking

## Risk Scoring Methodology

### Risk Factors
- **Data Sensitivity**: Type and volume of data accessed
- **Access Level**: System and network access permissions
- **Contractual Protections**: Strength of contract terms
- **Vendor Security Posture**: Security controls and certifications
- **Geographic Location**: Data residency and transfer risks
- **Financial Stability**: Vendor financial health indicators

### Risk Levels
- **Very High**: Immediate mitigation required
- **High**: Mitigation within 90 days
- **Medium**: Mitigation within 180 days
- **Low**: Acceptable risk level

## Documentation Requirements

### Assessment Documentation
- Risk assessment questionnaire
- Vendor security documentation review
- Contract security provisions
- Assessment report and findings

### Ongoing Documentation
- Annual risk reassessments
- Security incident reports
- Performance monitoring results
- Contract amendments

## References
- Third Party Risk Management Policy
- Vendor Management Policy
- ISO 27001:2022 A.15.2
- NIST SP 800-161`,
        version: '1.0',
        status: SOPStatus.DRAFT,
        owner_id: complianceOfficer.id,
        review_frequency: 'annual',
        next_review_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        linked_policies: [],
        linked_standards: [],
        control_ids: controls.filter(c => c.control_identifier.includes('VEN') || c.control_identifier.includes('THI')).map(c => c.id),
        tags: ['third-party-risk', 'vendor-management', 'supply-chain', 'risk-assessment'],
      },
    ];

    const createdSOPs = await sopRepository.save(sopsData);
    console.log(`✓ Created ${createdSOPs.length} SOPs`);

    // Create SOP assignments
    console.log('\n📋 Creating SOP Assignments...');

    const assignments = [];
    for (const sop of createdSOPs) {
      if (sop.status === SOPStatus.PUBLISHED) {
        // Assign to a few users
        const assignedUsers = regularUsers.slice(0, Math.min(3, regularUsers.length));
        for (const user of assignedUsers) {
          assignments.push({
            sop_id: sop.id,
            user_id: user.id,
            assigned_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
            assigned_by: adminUser.id,
            acknowledged: Math.random() > 0.5, // Random acknowledgment
          });
        }

        // Assign to roles (compliance officer role)
        assignments.push({
          sop_id: sop.id,
          role_id: 'compliance_officer', // This would need to be a real role ID
          assigned_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
          assigned_by: adminUser.id,
        });
      }
    }

    if (assignments.length > 0) {
      const createdAssignments = await sopAssignmentRepository.save(assignments);
      console.log(`✓ Created ${createdAssignments.length} SOP assignments`);
    }

    console.log('\n✅ SOP seeding completed successfully!');
    console.log(`📊 Summary: ${createdSOPs.length} SOPs created`);

    await dataSource.destroy();
  } catch (error) {
    console.error('Error seeding SOPs:', error);
    await dataSource.destroy();
    process.exit(1);
  }
}

seedSOPs();