import { test, expect } from '../fixtures/auth';
import {
  waitForTable,
  selectDropdownOption,
  waitForDialog,
  generateRandomString,
  generateRandomEmail
} from '../utils/helpers';

test.describe('Asset Form Tabs Interaction Tests', () => {
  test.describe('Physical Asset Multi-tab Form', () => {
    test('should navigate through all tabs in physical asset form', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/dashboard/assets/physical');
      await waitForTable(authenticatedPage);

      await authenticatedPage.click('button:has-text("Add New Asset")');
      await waitForDialog(authenticatedPage);

      // Check all expected tabs are present
      const expectedTabs = ['Basic', 'Location', 'Network', 'Ownership', 'Compliance', 'Metadata'];

      for (const tabName of expectedTabs) {
        const tab = authenticatedPage.locator(`button:has-text("${tabName}")`).first();
        await expect(tab).toBeVisible({ timeout: 5000 });
      }

      // Navigate through each tab and verify content
      for (let i = 0; i < expectedTabs.length; i++) {
        const tabName = expectedTabs[i];
        const tab = authenticatedPage.locator(`button:has-text("${tabName}")`).first();

        await tab.click();
        await authenticatedPage.waitForTimeout(500);

        // Verify tab is active
        await expect(tab).toHaveClass(/active|selected|current/);

        // Verify content is visible (basic check)
        const contentArea = authenticatedPage.locator('[role="tabpanel"], .tab-content, [data-testid*="tab-content"]').first();
        await expect(contentArea).toBeVisible({ timeout: 5000 });
      }
    });

    test('should maintain data when switching between tabs', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/dashboard/assets/physical');
      await waitForTable(authenticatedPage);

      await authenticatedPage.click('button:has-text("Add New Asset")');
      await waitForDialog(authenticatedPage);

      // Fill data in Basic tab
      const assetDescription = `Test Server ${generateRandomString()}`;
      await authenticatedPage.fill('input[name="assetDescription"]', assetDescription);
      await authenticatedPage.fill('input[name="uniqueIdentifier"]', 'SRV-TAB-001');

      // Select criticality
      const criticalityField = authenticatedPage.locator('button[data-testid="criticalityLevel"], [data-testid="criticalityLevel"]').first();
      if (await criticalityField.isVisible()) {
        await selectDropdownOption(authenticatedPage, criticalityField, 'High');
      }

      // Switch to Location tab
      await authenticatedPage.click('button:has-text("Location")');
      await authenticatedPage.waitForTimeout(500);

      // Fill location data
      await authenticatedPage.fill('input[name*="building"], input[placeholder*="Building"]', 'Main Office');
      await authenticatedPage.fill('input[name*="floor"], input[placeholder*="Floor"]', '3');

      // Switch to Network tab
      await authenticatedPage.click('button:has-text("Network")');
      await authenticatedPage.waitForTimeout(500);

      // Fill network data
      await authenticatedPage.fill('input[name*="hostname"], input[placeholder*="Hostname"]', 'server-test.example.com');
      await authenticatedPage.fill('input[name*="ip"], input[placeholder*="IP Address"]', '192.168.1.100');

      // Switch back to Basic tab
      await authenticatedPage.click('button:has-text("Basic")');
      await authenticatedPage.waitForTimeout(500);

      // Verify data is still there
      await expect(authenticatedPage.locator('input[name="assetDescription"]')).toHaveValue(assetDescription);
      await expect(authenticatedPage.locator('input[name="uniqueIdentifier"]')).toHaveValue('SRV-TAB-001');

      // Switch to Location tab and verify
      await authenticatedPage.click('button:has-text("Location")');
      await authenticatedPage.waitForTimeout(500);

      await expect(authenticatedPage.locator('input[name*="building"], input[placeholder*="Building"]')).toHaveValue('Main Office');
      await expect(authenticatedPage.locator('input[name*="floor"], input[placeholder*="Floor"]')).toHaveValue('3');

      // Switch to Network tab and verify
      await authenticatedPage.click('button:has-text("Network")');
      await authenticatedPage.waitForTimeout(500);

      await expect(authenticatedPage.locator('input[name*="hostname"], input[placeholder*="Hostname"]')).toHaveValue('server-test.example.com');
      await expect(authenticatedPage.locator('input[name*="ip"], input[placeholder*="IP Address"]')).toHaveValue('192.168.1.100');
    });

    test('should allow adding and removing dynamic fields in Network tab', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/dashboard/assets/physical');
      await waitForTable(authenticatedPage);

      await authenticatedPage.click('button:has-text("Add New Asset")');
      await waitForDialog(authenticatedPage);

      // Fill required fields first
      await authenticatedPage.fill('input[name="assetDescription"]', 'Dynamic Test Server');
      await authenticatedPage.fill('input[name="uniqueIdentifier"]', 'SRV-DYN-001');

      // Navigate to Network tab
      await authenticatedPage.click('button:has-text("Network")');
      await authenticatedPage.waitForTimeout(500);

      // Test adding MAC addresses
      const addMacButton = authenticatedPage.locator('button:has-text("Add MAC"), button:has-text("Add MAC Address")').first();
      if (await addMacButton.isVisible()) {
        const initialMacCount = await authenticatedPage.locator('input[name*="mac"], input[placeholder*="MAC"]').count();

        await addMacButton.click();
        await authenticatedPage.waitForTimeout(500);

        const newMacCount = await authenticatedPage.locator('input[name*="mac"], input[placeholder*="MAC"]').count();
        expect(newMacCount).toBe(initialMacCount + 1);

        // Fill the new MAC input
        const newMacInput = authenticatedPage.locator('input[name*="mac"], input[placeholder*="MAC"]').last();
        await newMacInput.fill('00:1B:44:11:3A:B7');

        // Test removing MAC address
        const removeMacButton = authenticatedPage.locator('button:has-text("Remove"), button[aria-label*="Remove"]').last();
        if (await removeMacButton.isVisible()) {
          await removeMacButton.click();
          await authenticatedPage.waitForTimeout(500);

          const finalMacCount = await authenticatedPage.locator('input[name*="mac"], input[placeholder*="MAC"]').count();
          expect(finalMacCount).toBe(newMacCount - 1);
        }
      }

      // Test adding IP addresses
      const addIpButton = authenticatedPage.locator('button:has-text("Add IP"), button:has-text("Add IP Address")').first();
      if (await addIpButton.isVisible()) {
        const initialIpCount = await authenticatedPage.locator('input[name*="ip"], input[placeholder*="IP"]').count();

        await addIpButton.click();
        await authenticatedPage.waitForTimeout(500);

        const newIpCount = await authenticatedPage.locator('input[name*="ip"], input[placeholder*="IP"]').count();
        expect(newIpCount).toBe(initialIpCount + 1);

        // Fill the new IP input
        const newIpInput = authenticatedPage.locator('input[name*="ip"], input[placeholder*="IP"]').last();
        await newIpInput.fill('10.0.0.50');
      }
    });

    test('should handle dynamic fields in Compliance tab', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/dashboard/assets/physical');
      await waitForTable(authenticatedPage);

      await authenticatedPage.click('button:has-text("Add New Asset")');
      await waitForDialog(authenticatedPage);

      // Fill required fields
      await authenticatedPage.fill('input[name="assetDescription"]', 'Compliance Test Server');
      await authenticatedPage.fill('input[name="uniqueIdentifier"]', 'SRV-COMP-001');

      // Navigate to Compliance tab
      await authenticatedPage.click('button:has-text("Compliance")');
      await authenticatedPage.waitForTimeout(500);

      // Test adding compliance requirements
      const addComplianceButton = authenticatedPage.locator('button:has-text("Add Compliance"), button:has-text("Add Requirement")').first();
      if (await addComplianceButton.isVisible()) {
        const initialCount = await authenticatedPage.locator('[data-testid*="compliance"], [name*="compliance"]').count();

        await addComplianceButton.click();
        await authenticatedPage.waitForTimeout(500);

        const newCount = await authenticatedPage.locator('[data-testid*="compliance"], [name*="compliance"]').count();
        expect(newCount).toBeGreaterThan(initialCount);

        // Fill compliance fields if available
        const complianceType = authenticatedPage.locator('select[name*="complianceType"], [name*="complianceType"]').last();
        if (await complianceType.isVisible()) {
          await selectDropdownOption(authenticatedPage, complianceType, 'GDPR');
        }

        const complianceStatus = authenticatedPage.locator('select[name*="complianceStatus"], [name*="complianceStatus"]').last();
        if (await complianceStatus.isVisible()) {
          await selectDropdownOption(authenticatedPage, complianceStatus, 'Compliant');
        }
      }
    });
  });

  test.describe('Information Asset Multi-tab Form', () => {
    test('should navigate through information asset tabs', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/dashboard/assets/information');
      await waitForTable(authenticatedPage);

      await authenticatedPage.click('button:has-text("Add New Asset")');
      await waitForDialog(authenticatedPage);

      // Check expected tabs
      const expectedTabs = ['Basic Info', 'Classification', 'Ownership', 'Storage'];

      for (const tabName of expectedTabs) {
        const tab = authenticatedPage.locator(`button:has-text("${tabName}")`).first();
        await expect(tab).toBeVisible({ timeout: 5000 });
      }

      // Navigate and test content
      await authenticatedPage.click('button:has-text("Basic Info")');
      await authenticatedPage.waitForTimeout(500);

      await authenticatedPage.fill('input[name="assetName"]', 'Tab Test Document');
      await authenticatedPage.fill('input[name="informationType"]', 'Test Records');

      // Test Classification tab
      await authenticatedPage.click('button:has-text("Classification")');
      await authenticatedPage.waitForTimeout(500);

      // Test sensitive data checkboxes
      const piiCheckbox = authenticatedPage.locator('input[name*="pii"], input[name*="PII"]').first();
      if (await piiCheckbox.isVisible()) {
        await piiCheckbox.check();
        await expect(piiCheckbox).toBeChecked();
      }

      const phiCheckbox = authenticatedPage.locator('input[name*="phi"], input[name*="PHI"]').first();
      if (await phiCheckbox.isVisible()) {
        await phiCheckbox.check();
        await expect(phiCheckbox).toBeChecked();
      }

      // Test Ownership tab
      await authenticatedPage.click('button:has-text("Ownership")');
      await authenticatedPage.waitForTimeout(500);

      const ownerInput = authenticatedPage.locator('input[name*="owner"], input[placeholder*="Owner"]').first();
      if (await ownerInput.isVisible()) {
        await ownerInput.fill(generateRandomEmail('owner'));
      }

      // Test Storage tab
      await authenticatedPage.click('button:has-text("Storage")');
      await authenticatedPage.waitForTimeout(500);

      const locationInput = authenticatedPage.locator('input[name*="location"], input[placeholder*="Location"]').first();
      if (await locationInput.isVisible()) {
        await locationInput.fill('Secure Server Room A');
      }
    });

    test('should maintain sensitive data selections across tab switches', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/dashboard/assets/information');
      await waitForTable(authenticatedPage);

      await authenticatedPage.click('button:has-text("Add New Asset")');
      await waitForDialog(authenticatedPage);

      // Fill basic info
      await authenticatedPage.fill('input[name="assetName"]', 'Sensitive Data Test');
      await authenticatedPage.fill('input[name="informationType"]', 'Customer Data');

      // Go to Classification tab and select sensitive data types
      await authenticatedPage.click('button:has-text("Classification")');
      await authenticatedPage.waitForTimeout(500);

      const sensitiveDataTypes = ['PII', 'PHI', 'Financial Data', 'Intellectual Property'];

      for (const dataType of sensitiveDataTypes) {
        const checkbox = authenticatedPage.locator(`input[name*="${dataType.toLowerCase().replace(' ', '')}"], label:has-text("${dataType}") input`).first();
        if (await checkbox.isVisible()) {
          await checkbox.check();
        }
      }

      // Switch to other tabs and come back
      await authenticatedPage.click('button:has-text("Ownership")');
      await authenticatedPage.waitForTimeout(500);

      await authenticatedPage.click('button:has-text("Storage")');
      await authenticatedPage.waitForTimeout(500);

      // Come back to Classification tab
      await authenticatedPage.click('button:has-text("Classification")');
      await authenticatedPage.waitForTimeout(500);

      // Verify selections are maintained
      for (const dataType of sensitiveDataTypes) {
        const checkbox = authenticatedPage.locator(`input[name*="${dataType.toLowerCase().replace(' ', '')}"], label:has-text("${dataType}") input`).first();
        if (await checkbox.isVisible()) {
          await expect(checkbox).toBeChecked();
        }
      }
    });
  });

  test.describe('Software Asset Multi-tab Form', () => {
    test('should handle license management in Licensing tab', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/dashboard/assets/software');
      await waitForTable(authenticatedPage);

      await authenticatedPage.click('button:has-text("Add New Asset")');
      await waitForDialog(authenticatedPage);

      // Fill basic info
      await authenticatedPage.fill('input[name="softwareName"]', 'License Test Software');

      // Navigate to Licensing tab
      await authenticatedPage.click('button:has-text("Licensing")');
      await authenticatedPage.waitForTimeout(500);

      // Test license type selection
      const licenseTypeField = authenticatedPage.locator('select[name*="licenseType"], [data-testid="licenseType"]').first();
      if (await licenseTypeField.isVisible()) {
        await selectDropdownOption(authenticatedPage, licenseTypeField, 'Commercial');
      }

      // Fill license details
      const licenseKeyInput = authenticatedPage.locator('input[name*="licenseKey"], input[placeholder*="License Key"]').first();
      if (await licenseKeyInput.isVisible()) {
        await licenseKeyInput.fill('XXXX-XXXX-XXXX-XXXX');
      }

      const licenseCountInput = authenticatedPage.locator('input[name*="licenseCount"], input[name*="count"]').first();
      if (await licenseCountInput.isVisible()) {
        await licenseCountInput.fill('100');
      }

      const expiryInput = authenticatedPage.locator('input[name*="expiry"], input[placeholder*="Expiry"]').first();
      if (await expiryInput.isVisible()) {
        // Set future date
        const futureDate = new Date();
        futureDate.setFullYear(futureDate.getFullYear() + 1);
        await expiryInput.fill(futureDate.toISOString().split('T')[0]);
      }

      // Navigate to other tabs and verify data persistence
      await authenticatedPage.click('button:has-text("Vendor")');
      await authenticatedPage.waitForTimeout(500);

      await authenticatedPage.click('button:has-text("Licensing")');
      await authenticatedPage.waitForTimeout(500);

      // Verify license data is maintained
      if (await licenseKeyInput.isVisible()) {
        await expect(licenseKeyInput).toHaveValue('XXXX-XXXX-XXXX-XXXX');
      }
      if (await licenseCountInput.isVisible()) {
        await expect(licenseCountInput).toHaveValue('100');
      }
    });

    test('should handle vendor contact information', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/dashboard/assets/software');
      await waitForTable(authenticatedPage);

      await authenticatedPage.click('button:has-text("Add New Asset")');
      await waitForDialog(authenticatedPage);

      await authenticatedPage.fill('input[name="softwareName"]', 'Vendor Test Software');

      // Navigate to Vendor tab
      await authenticatedPage.click('button:has-text("Vendor")');
      await authenticatedPage.waitForTimeout(500);

      // Fill vendor information
      await authenticatedPage.fill('input[name*="vendorName"], input[placeholder*="Vendor Name"]', 'Test Vendor Corp');
      await authenticatedPage.fill('input[name*="contactName"], input[placeholder*="Contact Name"]', 'John Contact');
      await authenticatedPage.fill('input[name*="contactEmail"], input[placeholder*="Contact Email"]', generateRandomEmail('vendor-contact'));
      await authenticatedPage.fill('input[name*="supportPhone"], input[placeholder*="Support Phone"]', '+1-555-0123');
      await authenticatedPage.fill('input[name*="supportUrl"], input[placeholder*="Support URL"]', 'https://support.example.com');

      // Test adding multiple contacts if supported
      const addContactButton = authenticatedPage.locator('button:has-text("Add Contact"), button:has-text("Add Another Contact")').first();
      if (await addContactButton.isVisible()) {
        await addContactButton.click();
        await authenticatedPage.waitForTimeout(500);

        const newContactEmail = authenticatedPage.locator('input[name*="contactEmail"], input[placeholder*="Email"]').last();
        if (await newContactEmail.isVisible()) {
          await newContactEmail.fill(generateRandomEmail('additional-contact'));
        }
      }
    });
  });

  test.describe('Business Application Multi-tab Form', () => {
    test('should handle technology stack in Technical tab', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/dashboard/assets/applications');
      await waitForTable(authenticatedPage);

      await authenticatedPage.click('button:has-text("Add New Asset")');
      await waitForDialog(authenticatedPage);

      // Fill basic info
      await authenticatedPage.fill('input[name="applicationName"]', 'Tech Stack Test App');

      // Navigate to Technical tab
      await authenticatedPage.click('button:has-text("Technical")');
      await authenticatedPage.waitForTimeout(500);

      // Test technology stack fields
      const frameworkInput = authenticatedPage.locator('input[name*="framework"], input[placeholder*="Framework"]').first();
      if (await frameworkInput.isVisible()) {
        await frameworkInput.fill('React');
      }

      const databaseInput = authenticatedPage.locator('input[name*="database"], input[placeholder*="Database"]').first();
      if (await databaseInput.isVisible()) {
        await databaseInput.fill('PostgreSQL');
      }

      const languageInput = authenticatedPage.locator('input[name*="language"], input[placeholder*="Language"]').first();
      if (await languageInput.isVisible()) {
        await languageInput.fill('TypeScript');
      }

      // Test adding multiple technologies if supported
      const addTechButton = authenticatedPage.locator('button:has-text("Add Technology"), button:has-text("Add Stack")').first();
      if (await addTechButton.isVisible()) {
        await addTechButton.click();
        await authenticatedPage.waitForTimeout(500);

        const newTechInput = authenticatedPage.locator('input[name*="technology"], input[placeholder*="Technology"]').last();
        if (await newTechInput.isVisible()) {
          await newTechInput.fill('Node.js');
        }
      }
    });

    test('should handle data processing classifications', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/dashboard/assets/applications');
      await waitForTable(authenticatedPage);

      await authenticatedPage.click('button:has-text("Add New Asset")');
      await waitForDialog(authenticatedPage);

      await authenticatedPage.fill('input[name="applicationName"]', 'Data Processing Test App');

      // Navigate to Compliance tab
      await authenticatedPage.click('button:has-text("Compliance")');
      await authenticatedPage.waitForTimeout(500);

      // Test data processing checkboxes
      const dataProcessingTypes = ['Processes PII', 'Processes PHI', 'Financial Data', 'Personal Data'];

      for (const dataType of dataProcessingTypes) {
        const checkbox = authenticatedPage.locator(`input[name*="${dataType.toLowerCase().replace(' ', '-')}"], label:has-text("${dataType}") input`).first();
        if (await checkbox.isVisible()) {
          await checkbox.check();
          await expect(checkbox).toBeChecked();
        }
      }

      // Test compliance standards
      const complianceStandards = ['SOC 2', 'ISO 27001', 'GDPR', 'HIPAA'];

      for (const standard of complianceStandards) {
        const standardCheckbox = authenticatedPage.locator(`input[name*="${standard.toLowerCase().replace(' ', '-')}"], label:has-text("${standard}") input`).first();
        if (await standardCheckbox.isVisible()) {
          await standardCheckbox.check();
          await expect(standardCheckbox).toBeChecked();
        }
      }
    });
  });
});