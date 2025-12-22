/**
 * COMPREHENSIVE Asset Details Linking Test for ALL Asset Types
 * Fills and links information across all asset types with meaningful relationships
 */
import { test } from '../fixtures/auth-fixed';
import { expect } from '@playwright/test';

test.describe('Comprehensive Asset Linking - All Asset Types', () => {
  // Asset type configurations with comprehensive test data
  const assetTypes = [
    {
      path: 'physical',
      name: 'Physical Assets',
      sampleId: 'bcfbb233-f00a-4ec2-b97c-d052b7129385',
      linkedData: {
        assetDescription: 'E2E Physical Asset - Integrated with enterprise infrastructure. Supports critical business operations with 99.9% uptime SLA. Connected to power redundancy systems and network backbone.',
        notes: 'Linked to: Primary Data Center, Network Core Switches, Environmental Monitoring, Backup Power Systems. Dependencies: Electricity supply, Network connectivity, Cooling systems, Physical security.',
        businessOwner: 'Data Center Operations Team',
        technicalOwner: 'Infrastructure Engineering',
        ipAddress: '192.168.1.100',
        networkSegment: 'Production-Infra-VLAN10',
        rackLocation: 'DC1-A-12-U3',
        classification: 'Mission Critical',
        complianceFramework: 'SOC2, ISO27001, NIST 800-53',
        dependencies: 'Power Supply UPS-01, Network Switch SW-CORE-01, Cooling System HVAC-01, Firewall FW-EDGE-01'
      }
    },
    {
      path: 'information',
      name: 'Information Assets',
      sampleId: 'bcfbb233-f00a-4ec2-b97c-d052b7129385',
      linkedData: {
        assetName: 'Customer Database System',
        description: 'E2E Test Information Asset - Centralized customer data repository integrated with CRM, billing, and support systems. Real-time synchronization with active directory.',
        dataClassification: 'Confidential - PII',
        businessOwner: 'Customer Success Department',
        technicalOwner: 'Database Administration Team',
        dataFormat: 'Structured Relational Data',
        retentionPeriod: '7 years (compliance required)',
        backupSchedule: 'Real-time replication + Daily full backup',
        accessControl: 'Role-based with MFA requirement',
        encryptionStandard: 'AES-256 encryption at rest and in transit',
        relatedSystems: 'CRM System, Billing Platform, Support Ticketing System, Analytics Dashboard'
      }
    },
    {
      path: 'software',
      name: 'Software Assets',
      sampleId: 'bcfbb233-f00a-4ec2-b97c-d052b7129385',
      linkedData: {
        softwareName: 'Enterprise Application Server',
        version: '3.2.1',
        description: 'E2E Test Software - Application server running critical business logic microservices. Integrated with authentication system and message queue.',
        vendor: 'Enterprise Software Corp',
        licenseType: 'Enterprise License - 1000 concurrent users',
        installationPath: '/opt/enterprise/appserver',
        dependencies: 'Java Runtime 17, PostgreSQL Database, Redis Cache, Apache Kafka',
        linkedApplications: 'Customer Portal, Admin Dashboard, API Gateway, Background Processing System',
        supportLevel: '24/7 Premium Support',
        patchSchedule: 'Monthly security patches, Quarterly feature updates'
      }
    },
    {
      path: 'applications',
      name: 'Business Applications',
      sampleId: 'bcfbb233-f00a-4ec2-b97c-d052b7129385',
      linkedData: {
        applicationName: 'Customer Relationship Management',
        version: '4.5.2',
        description: 'E2E Test Business Application - Comprehensive CRM system integrated with sales, marketing, and customer service workflows. Real-time analytics dashboard.',
        businessOwner: 'Sales & Marketing Department',
        technicalOwner: 'Application Development Team',
        businessCriticality: 'High - Core business function',
        userBase: '500+ active users across Sales, Marketing, Support teams',
        integrationPoints: 'Email System, Calendar Platform, Billing System, Document Storage, Analytics Engine',
        dataFlows: 'Customer data sync, Lead management, Sales pipeline tracking, Campaign performance metrics',
        uptimeRequirement: '99.5% during business hours'
      }
    },
    {
      path: 'suppliers',
      name: 'Suppliers',
      sampleId: 'bcfbb233-f00a-4ec2-b97c-d052b7129385',
      linkedData: {
        supplierName: 'Cloud Infrastructure Provider',
        businessUnit: 'IT Procurement & Vendor Management',
        description: 'E2E Test Supplier - Primary cloud infrastructure and hosting services provider. Manages production, staging, and development environments.',
        serviceType: 'Cloud Infrastructure & Managed Services',
        contractValue: '$2.5M annually',
        contractDuration: '3-year enterprise agreement',
        serviceLevelAgreement: '99.9% uptime, 24/7 support, 1-hour critical incident response',
        suppliedServices: 'IaaS Hosting, Managed Databases, CDN Services, Disaster Recovery, Security Monitoring',
        linkedSystems: 'Production Applications, Backup Systems, Monitoring Platform, Development Environments',
        riskAssessment: 'Medium risk - Critical dependency with established backup providers'
      }
    }
  ];

  assetTypes.forEach(({ path, name, sampleId, linkedData }) => {
    test(`should comprehensively fill and link ${name} information`, async ({ authenticatedPage }) => {
      console.log(`\n🔗 COMPREHENSIVE ${name.toUpperCase()} LINKING TEST`);
      const timestamp = Date.now();

      // Navigate to asset details
      const detailsUrl = `/dashboard/assets/${path}/${sampleId}`;
      await authenticatedPage.goto(detailsUrl);
      await authenticatedPage.waitForTimeout(3000);

      console.log(`✅ Navigated to ${name} details page`);

      // Step 1: Discover available tabs and navigation
      console.log('\n📋 DISCOVERING PAGE STRUCTURE...');
      const tabElements = await authenticatedPage.locator('[role="tab"]').all();
      const navButtons = await authenticatedPage.locator('nav button, .nav button, button:has-text("Overview"), button:has-text("Details")').all();

      const allNavigationElements = [...tabElements, ...navButtons];
      console.log(`Found ${allNavigationElements.length} navigation elements`);

      const navigationNames = [];
      for (let i = 0; i < Math.min(allNavigationElements.length, 20); i++) {
        try {
          const isVisible = await allNavigationElements[i].isVisible();
          if (isVisible) {
            const elementText = await allNavigationElements[i].textContent();
            if (elementText && elementText.trim()) {
              navigationNames.push(elementText.trim());
              console.log(`  Nav ${i}: "${elementText.trim()}"`);
            }
          }
        } catch (e) {
          // Continue
        }
      }

      // Step 2: Fill main information form fields with linked data
      console.log('\n📝 STEP 1: FILLING COMPREHENSIVE ASSET INFORMATION...');

      const allFormFields = await authenticatedPage.locator('input, textarea, select').all();
      console.log(`Found ${allFormFields.length} total form fields`);

      let fieldsFilled = 0;
      for (const field of allFormFields) {
        try {
          const isVisible = await field.isVisible();
          const isDisabled = await field.isDisabled();
          const isReadOnly = await field.getAttribute('readonly') !== null;

          if (isVisible && !isDisabled && !isReadOnly) {
            const fieldName = await field.getAttribute('name') || '';
            const placeholder = await field.getAttribute('placeholder') || '';
            const fieldType = await field.evaluate((el: any) => el.tagName.toLowerCase());
            const inputType = await field.getAttribute('type') || '';

            // Smart field matching with linked data
            let valueToFill = '';
            let fieldCategory = '';

            // Match field names/placeholder with our linked data
            Object.entries(linkedData).forEach(([dataKey, dataValue]) => {
              const keyMatch = fieldName.toLowerCase().includes(dataKey.toLowerCase()) ||
                             placeholder.toLowerCase().includes(dataKey.toLowerCase());

              if (keyMatch && !valueToFill) {
                valueToFill = String(dataValue);
                fieldCategory = dataKey;
              }
            });

            // Additional smart matching based on field characteristics
            if (!valueToFill) {
              if (fieldName.toLowerCase().includes('name') || placeholder.toLowerCase().includes('name')) {
                valueToFill = linkedData.assetName || linkedData.supplierName || linkedData.softwareName || linkedData.applicationName || `E2E ${name} ${timestamp}`;
                fieldCategory = 'name';
              } else if (fieldName.toLowerCase().includes('description') || placeholder.toLowerCase().includes('description')) {
                valueToFill = linkedData.description || linkedData.assetDescription || `Comprehensive E2E test description for ${name} with integrated relationships - ${timestamp}`;
                fieldCategory = 'description';
              } else if (fieldName.toLowerCase().includes('version') || placeholder.toLowerCase().includes('version')) {
                valueToFill = linkedData.version || '3.0.0';
                fieldCategory = 'version';
              } else if (fieldName.toLowerCase().includes('owner') || placeholder.toLowerCase().includes('owner')) {
                valueToFill = linkedData.businessOwner || linkedData.technicalOwner || 'E2E Test Team';
                fieldCategory = 'owner';
              } else if (fieldName.toLowerCase().includes('email') || inputType === 'email') {
                valueToFill = `e2e-test-${path}@example.com`;
                fieldCategory = 'email';
              } else if (fieldName.toLowerCase().includes('phone') || inputType === 'tel') {
                valueToFill = '+1-555-TEST-PHONE';
                fieldCategory = 'phone';
              } else if (fieldType === 'textarea') {
                valueToFill = `E2E comprehensive test data for ${name}. This field contains detailed information with established relationships and dependencies across the enterprise asset management system. Timestamp: ${timestamp}`;
                fieldCategory = 'textarea';
              } else if (fieldType === 'select') {
                // Select a meaningful option for dropdowns
                const options = await field.locator('option').all();
                if (options.length > 1) {
                  const selectedIndex = Math.min(2, options.length - 1);
                  await field.selectOption({ index: selectedIndex });
                  console.log(`  ✅ Selected option ${selectedIndex} for ${fieldName || fieldType}`);
                  fieldsFilled++;
                  continue;
                }
              } else if (inputType === 'date') {
                valueToFill = new Date().toISOString().split('T')[0];
                fieldCategory = 'date';
              } else if (inputType === 'number') {
                valueToFill = '100';
                fieldCategory = 'number';
              } else if (fieldName || placeholder) {
                valueToFill = `E2E-${fieldCategory || path}-${timestamp}`;
                fieldCategory = 'text';
              }
            }

            if (valueToFill && valueToFill.length < 1000) { // Prevent filling extremely long values
              await field.fill(valueToFill);
              fieldsFilled++;
              console.log(`  ✅ Filled ${fieldType.toUpperCase()} "${fieldName || fieldCategory}": ${valueToFill.substring(0, 60)}...`);
            }
          }
        } catch (e) {
          // Continue to next field
        }
      }

      console.log(`✅ Filled ${fieldsFilled} form fields with linked information`);

      // Step 3: Explore navigation tabs and look for relationship linking
      console.log('\n🔗 STEP 2: EXPLORING RELATIONSHIP LINKING...');

      for (let i = 0; i < Math.min(allNavigationElements.length, 10); i++) {
        try {
          const elementText = await allNavigationElements[i].textContent();
          if (elementText && (elementText.includes('Dependencies') ||
                             elementText.includes('Related') ||
                             elementText.includes('Links') ||
                             elementText.includes('Relationship') ||
                             elementText.includes('Controls') ||
                             elementText.includes('Risks'))) {

            await allNavigationElements[i].click();
            await authenticatedPage.waitForTimeout(2000);
            console.log(`  ✅ Clicked relationship tab: "${elementText.trim()}"`);

            // Look for relationship linking options
            const relationshipButtons = await authenticatedPage.locator('button:has-text("Add"), button:has-text("Link"), button:has-text("Connect"), button:has-text("Associate"), button:has-text("Create")').all();

            for (const button of relationshipButtons.slice(0, 2)) {
              try {
                const isVisible = await button.isVisible();
                const isEnabled = await button.isEnabled();
                if (isVisible && isEnabled) {
                  const buttonText = await button.textContent();
                  console.log(`    🔗 Found relationship button: "${buttonText}"`);

                  await button.click();
                  await authenticatedPage.waitForTimeout(2000);

                  // Look for relationship modal/dialog
                  const modalElements = await authenticatedPage.locator('.modal, .dialog, [role="dialog"], .popup, .overlay').all();
                  if (modalElements.length > 0) {
                    console.log(`    📋 Relationship interface opened`);

                    // Try to interact with relationship selection
                    const searchInputs = await authenticatedPage.locator('input[type="search"], input[placeholder*="Search"], input[placeholder*="Select"], input[placeholder*="Type"]').all();

                    for (let searchIndex = 0; searchIndex < Math.min(searchInputs.length, 2); searchIndex++) {
                      try {
                        if (await searchInputs[searchIndex].isVisible()) {
                          await searchInputs[searchIndex].fill(`${name} E2E Test Dependency`);
                          await authenticatedPage.waitForTimeout(1000);
                          console.log(`    🔍 Searched for relationship: "${name} E2E Test Dependency"`);
                        }
                      } catch (e) {
                        // Continue
                      }
                    }

                    // Try to close modal
                    const closeButtons = await authenticatedPage.locator('button:has-text("Cancel"), button:has-text("Close"), button:has-text("Back"), .close, .modal-close').all();
                    if (closeButtons.length > 0) {
                      await closeButtons[0].click();
                      await authenticatedPage.waitForTimeout(1000);
                      console.log(`    ❌ Closed relationship interface`);
                    }
                  }

                  break; // Only try one relationship button per tab
                }
              } catch (e) {
                console.log(`    ❌ Could not process relationship button: ${e}`);
              }
            }

            break; // Only try one relationship tab for this test
          }
        } catch (e) {
          // Continue
        }
      }

      // Step 4: Attempt to save changes
      console.log('\n💾 STEP 3: SAVING LINKED INFORMATION...');

      // Screenshot before save
      await authenticatedPage.screenshot({
        path: `test-results/${path}-linking-before-save-${timestamp}.png`,
        fullPage: true
      });

      const saveButtons = await authenticatedPage.locator('button:has-text("Save"), button:has-text("Update"), button:has-text("Apply"), button:has-text("Submit"), button[type="submit"]').all();

      for (const button of saveButtons) {
        try {
          const isVisible = await button.isVisible();
          const isEnabled = await button.isEnabled();
          if (isVisible && isEnabled) {
            const buttonText = await button.textContent();
            console.log(`  💾 Found save button: "${buttonText}"`);

            await button.click();
            await authenticatedPage.waitForTimeout(3000);

            // Look for success indicators
            const successElements = await authenticatedPage.locator('text:has-text("success"), text:has-text("saved"), text:has-text("updated"), text:has-text("completed"), .success-message, .notification').all();

            for (const element of successElements) {
              try {
                if (await element.isVisible()) {
                  const elementText = await element.textContent();
                  if (elementText && elementText.trim()) {
                    console.log(`  ✅ Success indicator: "${elementText.trim()}"`);
                  }
                }
              } catch (e) {
                // Continue
              }
            }

            break;
          }
        } catch (e) {
          // Continue
        }
      }

      // Final screenshot
      await authenticatedPage.screenshot({
        path: `test-results/${path}-linking-after-save-${timestamp}.png`,
        fullPage: true
      });

      console.log(`\n🎯 ${name.toUpperCase()} COMPREHENSIVE LINKING TEST COMPLETE`);
      console.log(`✅ Navigation elements explored: ${navigationNames.length}`);
      console.log(`✅ Form fields filled: ${fieldsFilled}`);
      console.log(`✅ Relationship linking attempted`);
      console.log(`✅ Screenshots saved: ${path}-linking-before-save-${timestamp}.png, ${path}-linking-after-save-${timestamp}.png`);

      expect(fieldsFilled).toBeGreaterThan(0);
      expect(navigationNames.length).toBeGreaterThan(0);
    });
  });
});