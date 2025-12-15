export interface PolicyTemplate {
  id: string;
  name: string;
  description: string;
  category: 'security' | 'compliance' | 'operational' | 'it' | 'hr' | 'finance';
  content: string;
  metadata?: {
    framework?: string;
    applicableFrameworks?: string[];
    tags?: string[];
  };
}

export const POLICY_TEMPLATES: PolicyTemplate[] = [
  {
    id: 'information-security-policy',
    name: 'Information Security Policy',
    description: 'A comprehensive policy for information security management',
    category: 'security',
    content: `<h1>Information Security Policy</h1>

<h2>1. Purpose</h2>
<p>The purpose of this Information Security Policy is to establish guidelines and procedures to protect the organization's information assets from unauthorized access, use, disclosure, disruption, modification, or destruction.</p>

<h2>2. Scope</h2>
<p>This policy applies to all employees, contractors, and third parties who have access to the organization's information systems and data.</p>

<h2>3. Policy Statement</h2>
<p>The organization is committed to maintaining the confidentiality, integrity, and availability of all information assets.</p>

<h2>4. Information Classification</h2>
<ul>
  <li><strong>Confidential:</strong> Highly sensitive information requiring strict access controls</li>
  <li><strong>Internal:</strong> Information intended for internal use only</li>
  <li><strong>Public:</strong> Information that can be shared publicly</li>
</ul>

<h2>5. Access Control</h2>
<p>Access to information systems and data shall be granted based on the principle of least privilege and business need.</p>

<h2>6. Responsibilities</h2>
<ul>
  <li>All employees are responsible for protecting information assets</li>
  <li>IT Department is responsible for implementing technical controls</li>
  <li>Management is responsible for policy enforcement</li>
</ul>

<h2>7. Review and Compliance</h2>
<p>This policy shall be reviewed annually and updated as necessary to reflect changes in business requirements and regulatory environment.</p>`,
    metadata: {
      framework: 'ISO 27001',
      applicableFrameworks: ['ISO 27001', 'NIST', 'SOC 2'],
      tags: ['security', 'information', 'access control'],
    },
  },
  {
    id: 'data-privacy-policy',
    name: 'Data Privacy Policy',
    description: 'Policy for handling personal and sensitive data in compliance with privacy regulations',
    category: 'compliance',
    content: `<h1>Data Privacy Policy</h1>

<h2>1. Purpose</h2>
<p>This Data Privacy Policy outlines how the organization collects, uses, stores, and protects personal data in compliance with applicable data protection regulations.</p>

<h2>2. Scope</h2>
<p>This policy applies to all personal data processed by the organization, including data collected from employees, customers, partners, and other stakeholders.</p>

<h2>3. Data Collection Principles</h2>
<ul>
  <li>Personal data shall be collected only for specified, explicit, and legitimate purposes</li>
  <li>Data collection shall be limited to what is necessary</li>
  <li>Data shall be accurate and kept up to date</li>
  <li>Data shall be retained only for as long as necessary</li>
</ul>

<h2>4. Data Subject Rights</h2>
<p>Data subjects have the right to:</p>
<ul>
  <li>Access their personal data</li>
  <li>Rectify inaccurate data</li>
  <li>Request deletion of data</li>
  <li>Object to processing</li>
  <li>Data portability</li>
</ul>

<h2>5. Data Security</h2>
<p>The organization implements appropriate technical and organizational measures to protect personal data against unauthorized access, loss, or destruction.</p>

<h2>6. Data Breach Response</h2>
<p>In the event of a data breach, the organization will:</p>
<ol>
  <li>Immediately assess the scope and impact</li>
  <li>Contain the breach</li>
  <li>Notify affected data subjects and authorities as required</li>
  <li>Document and investigate the incident</li>
</ol>`,
    metadata: {
      framework: 'GDPR',
      applicableFrameworks: ['GDPR', 'CCPA', 'PDPA'],
      tags: ['privacy', 'data protection', 'compliance'],
    },
  },
  {
    id: 'acceptable-use-policy',
    name: 'Acceptable Use Policy',
    description: 'Guidelines for acceptable use of organization IT resources',
    category: 'it',
    content: `<h1>Acceptable Use Policy</h1>

<h2>1. Purpose</h2>
<p>This Acceptable Use Policy defines the acceptable use of the organization's information technology resources, including computers, networks, and internet access.</p>

<h2>2. Scope</h2>
<p>This policy applies to all users of the organization's IT resources, including employees, contractors, and temporary staff.</p>

<h2>3. Acceptable Use</h2>
<p>IT resources are provided for business purposes. Users may:</p>
<ul>
  <li>Use resources for legitimate business activities</li>
  <li>Access resources in accordance with their job responsibilities</li>
  <li>Follow all applicable laws and regulations</li>
</ul>

<h2>4. Prohibited Activities</h2>
<p>Users are prohibited from:</p>
<ul>
  <li>Accessing unauthorized systems or data</li>
  <li>Introducing malware or malicious code</li>
  <li>Violating intellectual property rights</li>
  <li>Engaging in harassment or discriminatory behavior</li>
  <li>Using resources for personal commercial activities</li>
  <li>Circumventing security controls</li>
</ul>

<h2>5. Monitoring and Compliance</h2>
<p>The organization reserves the right to monitor IT resource usage to ensure compliance with this policy and applicable laws.</p>

<h2>6. Violations</h2>
<p>Violations of this policy may result in disciplinary action, up to and including termination of employment, and may involve legal action.</p>`,
    metadata: {
      tags: ['IT', 'usage', 'security'],
    },
  },
  {
    id: 'incident-response-policy',
    name: 'Incident Response Policy',
    description: 'Policy for responding to security and operational incidents',
    category: 'security',
    content: `<h1>Incident Response Policy</h1>

<h2>1. Purpose</h2>
<p>This Incident Response Policy establishes procedures for detecting, responding to, and recovering from security and operational incidents.</p>

<h2>2. Scope</h2>
<p>This policy applies to all security and operational incidents that may impact the confidentiality, integrity, or availability of the organization's information assets or operations.</p>

<h2>3. Incident Classification</h2>
<p>Incidents are classified by severity:</p>
<ul>
  <li><strong>Critical:</strong> Immediate threat to operations or data</li>
  <li><strong>High:</strong> Significant impact on operations</li>
  <li><strong>Medium:</strong> Moderate impact</li>
  <li><strong>Low:</strong> Minimal impact</li>
</ul>

<h2>4. Incident Response Team</h2>
<p>The Incident Response Team (IRT) is responsible for:</p>
<ul>
  <li>Coordinating incident response activities</li>
  <li>Investigating incidents</li>
  <li>Implementing containment measures</li>
  <li>Managing recovery efforts</li>
  <li>Documenting lessons learned</li>
</ul>

<h2>5. Incident Response Process</h2>
<ol>
  <li><strong>Preparation:</strong> Maintain readiness through training and procedures</li>
  <li><strong>Identification:</strong> Detect and confirm incidents</li>
  <li><strong>Containment:</strong> Limit the scope and impact</li>
  <li><strong>Eradication:</strong> Remove the cause of the incident</li>
  <li><strong>Recovery:</strong> Restore systems and operations</li>
  <li><strong>Lessons Learned:</strong> Review and improve processes</li>
</ol>

<h2>6. Reporting Requirements</h2>
<p>All incidents must be reported immediately to the IT Security team and documented in the incident management system.</p>`,
    metadata: {
      applicableFrameworks: ['ISO 27001', 'NIST'],
      tags: ['incident', 'security', 'response'],
    },
  },
  {
    id: 'remote-work-policy',
    name: 'Remote Work Policy',
    description: 'Guidelines and requirements for remote work arrangements',
    category: 'hr',
    content: `<h1>Remote Work Policy</h1>

<h2>1. Purpose</h2>
<p>This Remote Work Policy establishes guidelines and requirements for employees working remotely to ensure productivity, security, and compliance.</p>

<h2>2. Eligibility</h2>
<p>Remote work arrangements are available to eligible employees based on:</p>
<ul>
  <li>Job function and responsibilities</li>
  <li>Performance history</li>
  <li>Manager approval</li>
  <li>Business needs</li>
</ul>

<h2>3. Remote Work Requirements</h2>
<p>Remote workers must:</p>
<ul>
  <li>Maintain a dedicated, secure workspace</li>
  <li>Use approved devices and software</li>
  <li>Follow all security policies and procedures</li>
  <li>Ensure reliable internet connectivity</li>
  <li>Be available during core business hours</li>
</ul>

<h2>4. Security Requirements</h2>
<ul>
  <li>Use VPN for accessing company resources</li>
  <li>Enable multi-factor authentication</li>
  <li>Keep devices updated and secured</li>
  <li>Protect company data and information</li>
  <li>Follow data classification guidelines</li>
</ul>

<h2>5. Communication Expectations</h2>
<p>Remote workers are expected to:</p>
<ul>
  <li>Maintain regular communication with team and manager</li>
  <li>Participate in required meetings and calls</li>
  <li>Respond to communications in a timely manner</li>
  <li>Use approved communication tools</li>
</ul>

<h2>6. Review and Modification</h2>
<p>Remote work arrangements may be reviewed and modified based on business needs, performance, or policy changes.</p>`,
    metadata: {
      tags: ['HR', 'remote work', 'workplace'],
    },
  },
  {
    id: 'password-policy',
    name: 'Password Policy',
    description: 'Standards for password creation, management, and security',
    category: 'security',
    content: `<h1>Password Policy</h1>

<h2>1. Purpose</h2>
<p>This Password Policy establishes minimum requirements for password creation, management, and security to protect organizational systems and data.</p>

<h2>2. Scope</h2>
<p>This policy applies to all users of organizational information systems, including employees, contractors, and third-party users.</p>

<h2>3. Password Requirements</h2>
<p>All passwords must meet the following requirements:</p>
<ul>
  <li><strong>Minimum Length:</strong> At least 12 characters</li>
  <li><strong>Complexity:</strong> Must contain uppercase, lowercase, numbers, and special characters</li>
  <li><strong>Uniqueness:</strong> Cannot reuse the last 12 passwords</li>
  <li><strong>No Common Words:</strong> Cannot contain dictionary words or personal information</li>
</ul>

<h2>4. Password Management</h2>
<ul>
  <li>Passwords must be changed every 90 days for standard accounts</li>
  <li>Privileged accounts must be changed every 60 days</li>
  <li>Passwords must not be shared or written down</li>
  <li>Password managers are recommended for storing passwords</li>
</ul>

<h2>5. Multi-Factor Authentication</h2>
<p>MFA is required for:</p>
<ul>
  <li>All privileged accounts</li>
  <li>Remote access connections</li>
  <li>Cloud-based services</li>
  <li>Financial systems</li>
</ul>

<h2>6. Password Storage</h2>
<p>Passwords must be stored using secure methods:</p>
<ul>
  <li>Hashed using industry-standard algorithms (e.g., bcrypt, Argon2)</li>
  <li>Never stored in plain text</li>
  <li>Encrypted in transit and at rest</li>
</ul>

<h2>7. Violations</h2>
<p>Violations of this policy may result in disciplinary action, including account suspension or termination.</p>`,
    metadata: {
      applicableFrameworks: ['ISO 27001', 'NIST', 'SAMA'],
      tags: ['security', 'authentication', 'access control'],
    },
  },
  {
    id: 'business-continuity-policy',
    name: 'Business Continuity Policy',
    description: 'Policy for maintaining business operations during disruptions',
    category: 'operational',
    content: `<h1>Business Continuity Policy</h1>

<h2>1. Purpose</h2>
<p>This Business Continuity Policy establishes the framework for maintaining business operations during and after a disruption, ensuring the organization can continue to deliver critical services.</p>

<h2>2. Scope</h2>
<p>This policy applies to all business units, processes, and systems that are critical to organizational operations.</p>

<h2>3. Objectives</h2>
<p>The objectives of this policy are to:</p>
<ul>
  <li>Minimize the impact of disruptions on business operations</li>
  <li>Ensure timely recovery of critical business functions</li>
  <li>Maintain service delivery to customers and stakeholders</li>
  <li>Protect organizational assets and reputation</li>
</ul>

<h2>4. Business Impact Analysis</h2>
<p>A Business Impact Analysis (BIA) shall be conducted to:</p>
<ul>
  <li>Identify critical business functions and processes</li>
  <li>Determine maximum tolerable downtime (MTD)</li>
  <li>Assess financial and operational impacts</li>
  <li>Prioritize recovery activities</li>
</ul>

<h2>5. Recovery Strategies</h2>
<p>Recovery strategies must be developed for:</p>
<ul>
  <li>IT systems and infrastructure</li>
  <li>Facilities and workspace</li>
  <li>Key personnel and skills</li>
  <li>Third-party dependencies</li>
  <li>Communication and notification</li>
</ul>

<h2>6. Testing and Maintenance</h2>
<ul>
  <li>Business Continuity Plans (BCP) shall be tested annually</li>
  <li>Tests shall include tabletop exercises and full-scale simulations</li>
  <li>Plans shall be reviewed and updated quarterly or after significant changes</li>
  <li>Lessons learned from tests and actual incidents shall be incorporated</li>
</ul>

<h2>7. Roles and Responsibilities</h2>
<ul>
  <li><strong>Executive Sponsor:</strong> Provides strategic direction and resources</li>
  <li><strong>BCP Coordinator:</strong> Manages the BCP program</li>
  <li><strong>Business Unit Managers:</strong> Maintain unit-specific plans</li>
  <li><strong>IT Team:</strong> Ensures IT systems recovery capabilities</li>
</ul>`,
    metadata: {
      applicableFrameworks: ['ISO 22301', 'ISO 27001'],
      tags: ['business continuity', 'disaster recovery', 'operations'],
    },
  },
  {
    id: 'vendor-management-policy',
    name: 'Vendor Management Policy',
    description: 'Guidelines for managing third-party vendors and suppliers',
    category: 'operational',
    content: `<h1>Vendor Management Policy</h1>

<h2>1. Purpose</h2>
<p>This Vendor Management Policy establishes standards and procedures for selecting, managing, and monitoring third-party vendors and suppliers to ensure they meet organizational requirements and standards.</p>

<h2>2. Scope</h2>
<p>This policy applies to all vendors, suppliers, contractors, and service providers who have access to organizational information, systems, or processes.</p>

<h2>3. Vendor Selection</h2>
<p>All vendors must be evaluated based on:</p>
<ul>
  <li>Financial stability and reputation</li>
  <li>Technical capabilities and expertise</li>
  <li>Security and compliance posture</li>
  <li>References and past performance</li>
  <li>Pricing and contractual terms</li>
</ul>

<h2>4. Due Diligence</h2>
<p>Prior to engagement, vendors must undergo due diligence including:</p>
<ul>
  <li>Background checks and verification</li>
  <li>Security assessment</li>
  <li>Compliance verification (certifications, audits)</li>
  <li>Legal and contractual review</li>
  <li>Risk assessment</li>
</ul>

<h2>5. Contract Requirements</h2>
<p>All vendor contracts must include:</p>
<ul>
  <li>Service Level Agreements (SLAs)</li>
  <li>Security and data protection requirements</li>
  <li>Compliance obligations</li>
  <li>Right to audit</li>
  <li>Incident reporting procedures</li>
  <li>Termination clauses</li>
</ul>

<h2>6. Ongoing Monitoring</h2>
<p>Vendors shall be continuously monitored through:</p>
<ul>
  <li>Regular performance reviews</li>
  <li>Security assessments and audits</li>
  <li>Compliance verification</li>
  <li>Risk assessments</li>
  <li>Incident tracking</li>
</ul>

<h2>7. Vendor Classification</h2>
<p>Vendors are classified by risk level:</p>
<ul>
  <li><strong>High Risk:</strong> Access to sensitive data or critical systems</li>
  <li><strong>Medium Risk:</strong> Limited access or moderate business impact</li>
  <li><strong>Low Risk:</strong> Minimal access or low business impact</li>
</ul>

<h2>8. Vendor Offboarding</h2>
<p>When terminating vendor relationships:</p>
<ul>
  <li>Return or securely delete all organizational data</li>
  <li>Revoke all system access and credentials</li>
  <li>Document lessons learned</li>
  <li>Update risk registers and dependencies</li>
</ul>`,
    metadata: {
      applicableFrameworks: ['ISO 27001', 'SOC 2'],
      tags: ['vendor', 'third-party', 'supply chain'],
    },
  },
  {
    id: 'code-of-conduct',
    name: 'Code of Conduct',
    description: 'Standards of behavior and ethical guidelines for all employees',
    category: 'hr',
    content: `<h1>Code of Conduct</h1>

<h2>1. Purpose</h2>
<p>This Code of Conduct establishes the ethical standards and behavioral expectations for all employees, contractors, and representatives of the organization.</p>

<h2>2. Scope</h2>
<p>This code applies to all individuals associated with the organization, regardless of role, location, or employment status.</p>

<h2>3. Core Values</h2>
<p>The organization is committed to:</p>
<ul>
  <li><strong>Integrity:</strong> Acting honestly and ethically in all dealings</li>
  <li><strong>Respect:</strong> Treating all individuals with dignity and respect</li>
  <li><strong>Accountability:</strong> Taking responsibility for our actions</li>
  <li><strong>Excellence:</strong> Striving for excellence in all we do</li>
</ul>

<h2>4. Ethical Behavior</h2>
<p>All employees must:</p>
<ul>
  <li>Comply with all applicable laws and regulations</li>
  <li>Avoid conflicts of interest</li>
  <li>Protect confidential information</li>
  <li>Use organizational resources responsibly</li>
  <li>Report violations and concerns</li>
</ul>

<h2>5. Professional Conduct</h2>
<p>Employees are expected to:</p>
<ul>
  <li>Maintain professional relationships</li>
  <li>Communicate respectfully and constructively</li>
  <li>Collaborate effectively with colleagues</li>
  <li>Contribute to a positive work environment</li>
  <li>Respect diversity and inclusion</li>
</ul>

<h2>6. Workplace Environment</h2>
<p>The organization is committed to:</p>
<ul>
  <li>Providing a safe and healthy workplace</li>
  <li>Promoting diversity and inclusion</li>
  <li>Preventing harassment and discrimination</li>
  <li>Supporting work-life balance</li>
</ul>

<h2>7. Compliance and Reporting</h2>
<p>All employees must:</p>
<ul>
  <li>Read and understand this code</li>
  <li>Complete required training</li>
  <li>Report violations or concerns</li>
  <li>Cooperate with investigations</li>
</ul>

<h2>8. Consequences</h2>
<p>Violations of this code may result in disciplinary action, up to and including termination of employment and legal action.</p>`,
    metadata: {
      tags: ['HR', 'ethics', 'compliance'],
    },
  },
  {
    id: 'financial-controls-policy',
    name: 'Financial Controls Policy',
    description: 'Internal controls and procedures for financial operations',
    category: 'finance',
    content: `<h1>Financial Controls Policy</h1>

<h2>1. Purpose</h2>
<p>This Financial Controls Policy establishes internal controls and procedures to ensure the accuracy, completeness, and integrity of financial reporting and transactions.</p>

<h2>2. Scope</h2>
<p>This policy applies to all financial transactions, accounting processes, and financial reporting activities across the organization.</p>

<h2>3. Segregation of Duties</h2>
<p>Financial duties shall be segregated to prevent errors and fraud:</p>
<ul>
  <li>Authorization, recording, and custody of assets shall be separated</li>
  <li>No single individual shall have control over all aspects of a transaction</li>
  <li>Approval and payment authority shall be clearly defined and limited</li>
</ul>

<h2>4. Authorization and Approval</h2>
<p>All financial transactions require appropriate authorization:</p>
<ul>
  <li>Expenditures must be approved according to authorization limits</li>
  <li>Authorization limits are based on position and responsibility</li>
  <li>All authorizations must be documented</li>
  <li>Exceptions require additional approval</li>
</ul>

<h2>5. Financial Reporting</h2>
<p>Financial reports must be:</p>
<ul>
  <li>Accurate and complete</li>
  <li>Prepared in accordance with accounting standards</li>
  <li>Reviewed and approved by appropriate management</li>
  <li>Submitted on time</li>
  <li>Retained according to retention policies</li>
</ul>

<h2>6. Internal Controls</h2>
<p>Key internal controls include:</p>
<ul>
  <li>Regular reconciliations of accounts</li>
  <li>Periodic physical inventory counts</li>
  <li>Access controls for financial systems</li>
  <li>Regular reviews and audits</li>
  <li>Documentation of all transactions</li>
</ul>

<h2>7. Compliance and Monitoring</h2>
<p>The organization shall:</p>
<ul>
  <li>Conduct regular internal audits</li>
  <li>Monitor compliance with financial policies</li>
  <li>Investigate discrepancies and irregularities</li>
  <li>Take corrective action as needed</li>
</ul>`,
    metadata: {
      applicableFrameworks: ['SOX', 'IFRS'],
      tags: ['finance', 'controls', 'compliance'],
    },
  },
];

export function getTemplatesByCategory(category: PolicyTemplate['category']): PolicyTemplate[] {
  return POLICY_TEMPLATES.filter((template) => template.category === category);
}

export function getTemplateById(id: string): PolicyTemplate | undefined {
  return POLICY_TEMPLATES.find((template) => template.id === id);
}

export function getTemplatesByFramework(framework: string): PolicyTemplate[] {
  return POLICY_TEMPLATES.filter(
    (template) =>
      template.metadata?.framework === framework ||
      template.metadata?.applicableFrameworks?.includes(framework)
  );
}

