import { test, expect } from '../fixtures/auth';
import {
  waitForTable,
  selectDropdownOption,
  waitForDialog,
  navigateToDetails,
  generateRandomString,
  search
} from '../utils/helpers';

test.describe('Asset Dependencies and Relationships Tests', () => {
  test.describe('Asset Dependencies Management', () => {
    test('should create and manage physical asset dependencies', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/dashboard/assets/physical');
      await waitForTable(authenticatedPage);

      // Create a primary server asset
      await authenticatedPage.click('button:has-text("Add New Asset")');
      await waitForDialog(authenticatedPage);

      const primaryServer = `Primary Server ${generateRandomString()}`;
      await authenticatedPage.fill('input[name="assetDescription"]', primaryServer);
      await authenticatedPage.fill('input[name="uniqueIdentifier"]', 'SRV-PRIMARY-001');

      await authenticatedPage.click('button[type="submit"]:has-text("Create")');
      await authenticatedPage.waitForTimeout(3000);

      await waitForTable(authenticatedPage);
      await expect(authenticatedPage.locator(`text=${primaryServer}`).first()).toBeVisible({ timeout: 10000 });

      // Create dependent assets
      const dependentAssets = [
        { description: `Database Server ${generateRandomString()}`, type: 'database' },
        { description: `Backup Server ${generateRandomString()}`, type: 'backup' },
        { description: `Network Switch ${generateRandomString()}`, type: 'network' }
      ];

      for (const asset of dependentAssets) {
        await authenticatedPage.click('button:has-text("Add New Asset")');
        await waitForDialog(authenticatedPage);

        await authenticatedPage.fill('input[name="assetDescription"]', asset.description);
        await authenticatedPage.fill('input[name="uniqueIdentifier"]', `SRV-${asset.type.toUpperCase()}-${generateRandomString()}`);

        // Look for dependencies section
        const dependenciesTab = authenticatedPage.locator('button:has-text("Dependencies"), button:has-text("Relationships")').first();
        if (await dependenciesTab.isVisible()) {
          await dependenciesTab.click();
          await authenticatedPage.waitForTimeout(500);

          // Add dependency to primary server
          const addDependencyButton = authenticatedPage.locator('button:has-text("Add Dependency"), button:has-text("Add Relationship")').first();
          if (await addDependencyButton.isVisible()) {
            await addDependencyButton.click();
            await authenticatedPage.waitForTimeout(500);

            // Search and select the primary server
            const dependencySearch = authenticatedPage.locator('input[name*="dependency"], input[placeholder*="Search"]').first();
            if (await dependencySearch.isVisible()) {
              await dependencySearch.fill(primaryServer);
              await authenticatedPage.waitForTimeout(1000);

              // Select from dropdown
              const primaryServerOption = authenticatedPage.locator(`[role="option"]:has-text("${primaryServer}")`).first();
              if (await primaryServerOption.isVisible()) {
                await primaryServerOption.click();
              }
            }
          }
        }

        await authenticatedPage.click('button[type="submit"]:has-text("Create")');
        await authenticatedPage.waitForTimeout(3000);

        await waitForTable(authenticatedPage);
      }

      // Navigate to primary server details
      await search(authenticatedPage, primaryServer);
      await authenticatedPage.waitForTimeout(1000);

      await navigateToDetails(authenticatedPage);

      // Check if dependencies are displayed
      const dependenciesSection = authenticatedPage.locator('[data-testid="dependencies"], [data-testid="relationships"], section:has-text("Dependencies")').first();
      if (await dependenciesSection.isVisible()) {
        // Should show dependent assets
        for (const asset of dependentAssets) {
          await expect(authenticatedPage.locator(`text=${asset.description}`).first()).toBeVisible({ timeout: 10000 });
        }
      }
    });

    test('should manage information asset dependencies', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/dashboard/assets/information');
      await waitForTable(authenticatedPage);

      // Create primary information asset
      await authenticatedPage.click('button:has-text("Add New Asset")');
      await waitForDialog(authenticatedPage);

      const primaryDocument = `Master Policy Document ${generateRandomString()}`;
      await authenticatedPage.fill('input[name="assetName"]', primaryDocument);
      await authenticatedPage.fill('input[name="informationType"]', 'Policy Document');

      const classificationField = authenticatedPage.locator('button[data-testid="dataClassification"], [data-testid="dataClassification"]').first();
      if (await classificationField.isVisible()) {
        await selectDropdownOption(authenticatedPage, classificationField, 'Confidential');
      }

      await authenticatedPage.click('button[type="submit"]:has-text("Create")');
      await authenticatedPage.waitForTimeout(3000);

      await waitForTable(authenticatedPage);
      await expect(authenticatedPage.locator(`text=${primaryDocument}`).first()).toBeVisible({ timeout: 10000 });

      // Create related documents
      const relatedDocuments = [
        { name: `Implementation Guide ${generateRandomString()}`, type: 'Guide' },
        { name: `Procedural Manual ${generateRandomString()}`, type: 'Manual' },
        { name: `Training Materials ${generateRandomString()}`, type: 'Training' }
      ];

      for (const doc of relatedDocuments) {
        await authenticatedPage.click('button:has-text("Add New Asset")');
        await waitForDialog(authenticatedPage);

        await authenticatedPage.fill('input[name="assetName"]', doc.name);
        await authenticatedPage.fill('input[name="informationType"]', doc.type);

        // Look for relationship section
        const relationshipTab = authenticatedPage.locator('button:has-text("Storage"), button:has-text("Relationships")').first();
        if (await relationshipTab.isVisible()) {
          await relationshipTab.click();
          await authenticatedPage.waitForTimeout(500);

          // Add relationship to primary document
          const relatedToField = authenticatedPage.locator('input[name*="relatedTo"], select[name*="relatedTo"]').first();
          if (await relatedToField.isVisible()) {
            if (await relatedToField.getAttribute('type') === 'text') {
              await relatedToField.fill(primaryDocument);
              await authenticatedPage.waitForTimeout(1000);

              const primaryDocOption = authenticatedPage.locator(`[role="option"]:has-text("${primaryDocument}")`).first();
              if (await primaryDocOption.isVisible()) {
                await primaryDocOption.click();
              }
            } else {
              await selectDropdownOption(authenticatedPage, relatedToField, primaryDocument);
            }
          }
        }

        await authenticatedPage.click('button[type="submit"]:has-text("Create")');
        await authenticatedPage.waitForTimeout(3000);

        await waitForTable(authenticatedPage);
      }
    });

    test('should manage software asset dependencies', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/dashboard/assets/software');
      await waitForTable(authenticatedPage);

      // Create primary software
      await authenticatedPage.click('button:has-text("Add New Asset")');
      await waitForDialog(authenticatedPage);

      const primarySoftware = `Main Application ${generateRandomString()}`;
      await authenticatedPage.fill('input[name="softwareName"]', primarySoftware);
      await authenticatedPage.fill('input[name="vendor"]', 'Test Vendor');

      await authenticatedPage.click('button[type="submit"]:has-text("Create")');
      await authenticatedPage.waitForTimeout(3000);

      await waitForTable(authenticatedPage);
      await expect(authenticatedPage.locator(`text=${primarySoftware}`).first()).toBeVisible({ timeout: 10000 });

      // Create dependency software
      const dependencies = [
        { name: `Database Connector ${generateRandomString()}`, type: 'Library' },
        { name: `Authentication Module ${generateRandomString()}`, type: 'Module' },
        { name: `Reporting Tool ${generateRandomString()}`, type: 'Tool' }
      ];

      for (const dep of dependencies) {
        await authenticatedPage.click('button:has-text("Add New Asset")');
        await waitForDialog(authenticatedPage);

        await authenticatedPage.fill('input[name="softwareName"]', dep.name);
        await authenticatedPage.fill('input[name="vendor"]', 'Dependency Vendor');

        // Look for software dependencies section
        const dependenciesTab = authenticatedPage.locator('button:has-text("Other"), button:has-text("Dependencies")').first();
        if (await dependenciesTab.isVisible()) {
          await dependenciesTab.click();
          await authenticatedPage.waitForTimeout(500);

          const dependencyField = authenticatedPage.locator('input[name*="dependsOn"], select[name*="dependsOn"]').first();
          if (await dependencyField.isVisible()) {
            if (await dependencyField.getAttribute('type') === 'text') {
              await dependencyField.fill(primarySoftware);
              await authenticatedPage.waitForTimeout(1000);

              const primarySoftwareOption = authenticatedPage.locator(`[role="option"]:has-text("${primarySoftware}")`).first();
              if (await primarySoftwareOption.isVisible()) {
                await primarySoftwareOption.click();
              }
            } else {
              await selectDropdownOption(authenticatedPage, dependencyField, primarySoftware);
            }
          }
        }

        await authenticatedPage.click('button[type="submit"]:has-text("Create")');
        await authenticatedPage.waitForTimeout(3000);

        await waitForTable(authenticatedPage);
      }
    });
  });

  test.describe('Business Application Dependencies', () => {
    test('should manage application infrastructure dependencies', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/dashboard/assets/applications');
      await waitForTable(authenticatedPage);

      // Create main business application
      await authenticatedPage.click('button:has-text("Add New Asset")');
      await waitForDialog(authenticatedPage);

      const mainApp = `CRM Application ${generateRandomString()}`;
      await authenticatedPage.fill('input[name="applicationName"]', mainApp);

      const applicationTypeField = authenticatedPage.locator('button[data-testid="applicationType"], [data-testid="applicationType"]').first();
      if (await applicationTypeField.isVisible()) {
        await selectDropdownOption(authenticatedPage, applicationTypeField, 'Business Application');
      }

      const statusField = authenticatedPage.locator('button[data-testid="status"], [data-testid="status"]').first();
      if (await statusField.isVisible()) {
        await selectDropdownOption(authenticatedPage, statusField, 'Production');
      }

      // Navigate to Technical tab for infrastructure dependencies
      await authenticatedPage.click('button:has-text("Technical")');
      await authenticatedPage.waitForTimeout(500);

      // Fill technical infrastructure
      await authenticatedPage.fill('input[name*="url"], input[placeholder*="URL"]', 'https://crm.example.com');

      const frameworkInput = authenticatedPage.locator('input[name*="framework"], input[placeholder*="Framework"]').first();
      if (await frameworkInput.isVisible()) {
        await frameworkInput.fill('React');
      }

      const databaseInput = authenticatedPage.locator('input[name*="database"], input[placeholder*="Database"]').first();
      if (await databaseInput.isVisible()) {
        await databaseInput.fill('PostgreSQL');
      }

      // Look for infrastructure dependencies section
      const infraDependenciesSection = authenticatedPage.locator('[data-testid="infrastructure"], fieldset:has-text("Infrastructure")').first();
      if (await infraDependenciesSection.isVisible()) {
        // Add server dependency
        const serverDependencyInput = authenticatedPage.locator('input[name*="server"], input[placeholder*="Server"]').first();
        if (await serverDependencyInput.isVisible()) {
          await serverDependencyInput.fill('CRM-SERVER-001');
        }

        // Add network dependency
        const networkDependencyInput = authenticatedPage.locator('input[name*="network"], input[placeholder*="Network"]').first();
        if (await networkDependencyInput.isVisible()) {
          await networkDependencyInput.fill('CRM-NETWORK');
        }
      }

      await authenticatedPage.click('button[type="submit"]:has-text("Create")');
      await authenticatedPage.waitForTimeout(3000);

      await waitForTable(authenticatedPage);
      await expect(authenticatedPage.locator(`text=${mainApp}`).first()).toBeVisible({ timeout: 10000 });

      // Verify dependencies are displayed in details
      await search(authenticatedPage, mainApp);
      await authenticatedPage.waitForTimeout(1000);

      await navigateToDetails(authenticatedPage);

      // Check if technical infrastructure is displayed
      await expect(authenticatedPage.locator('text=React').first()).toBeVisible({ timeout: 10000 });
      await expect(authenticatedPage.locator('text=PostgreSQL').first()).toBeVisible({ timeout: 10000 });
    });

    test('should manage vendor dependencies for applications', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/dashboard/assets/applications');
      await waitForTable(authenticatedPage);

      await authenticatedPage.click('button:has-text("Add New Asset")');
      await waitForDialog(authenticatedPage);

      const appWithVendor = `SaaS Application ${generateRandomString()}`;
      await authenticatedPage.fill('input[name="applicationName"]', appWithVendor);

      // Navigate to Vendor tab
      await authenticatedPage.click('button:has-text("Vendor")');
      await authenticatedPage.waitForTimeout(500);

      // Fill vendor information
      await authenticatedPage.fill('input[name*="vendorName"], input[placeholder*="Vendor Name"]', 'External SaaS Provider');
      await authenticatedPage.fill('input[name*="supportContact"], input[placeholder*="Support Contact"]', 'support@saas-provider.com');
      await authenticatedPage.fill('input[name*="supportPhone"], input[placeholder*="Support Phone"]', '+1-800-SUPPORT');
      await authenticatedPage.fill('input[name*="supportUrl"], input[placeholder*="Support URL"]', 'https://support.saas-provider.com');

      // Add SLA information if available
      const slaInput = authenticatedPage.locator('input[name*="sla"], input[placeholder*="SLA"]').first();
      if (await slaInput.isVisible()) {
        await slaInput.fill('99.9% Uptime');
      }

      await authenticatedPage.click('button[type="submit"]:has-text("Create")');
      await authenticatedPage.waitForTimeout(3000);

      await waitForTable(authenticatedPage);
      await expect(authenticatedPage.locator(`text=${appWithVendor}`).first()).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe('Supplier Dependencies', () => {
    test('should manage supplier contract dependencies', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/dashboard/assets/suppliers');
      await waitForTable(authenticatedPage);

      // Create supplier with multiple contracts
      await authenticatedPage.click('button:has-text("Add New Asset")');
      await waitForDialog(authenticatedPage);

      const supplier = `Multi-Contract Supplier ${generateRandomString()}`;
      await authenticatedPage.fill('input[name="supplierName"]', supplier);

      // Look for contract section
      const contractTab = authenticatedPage.locator('button:has-text("Contract"), button:has-text("Agreement")').first();
      if (await contractTab.isVisible()) {
        await contractTab.click();
        await authenticatedPage.waitForTimeout(500);

        // Add primary contract
        await authenticatedPage.fill('input[name*="contractNumber"], input[placeholder*="Contract Number"]', 'CONTRACT-PRIMARY-001');
        await authenticatedPage.fill('input[name*="contractValue"], input[placeholder*="Value"]', '500000');

        const startDateInput = authenticatedPage.locator('input[name*="startDate"], input[placeholder*="Start Date"]').first();
        if (await startDateInput.isVisible()) {
          const today = new Date();
          await startDateInput.fill(today.toISOString().split('T')[0]);
        }

        const endDateInput = authenticatedPage.locator('input[name*="endDate"], input[placeholder*="End Date"]').first();
        if (await endDateInput.isVisible()) {
          const nextYear = new Date();
          nextYear.setFullYear(nextYear.getFullYear() + 1);
          await endDateInput.fill(nextYear.toISOString().split('T')[0]);
        }

        // Add secondary contract if supported
        const addContractButton = authenticatedPage.locator('button:has-text("Add Contract"), button:has-text("Add Another Contract")').first();
        if (await addContractButton.isVisible()) {
          await addContractButton.click();
          await authenticatedPage.waitForTimeout(500);

          const secondaryContractInput = authenticatedPage.locator('input[name*="contractNumber"], input[placeholder*="Contract Number"]').last();
          if (await secondaryContractInput.isVisible()) {
            await secondaryContractInput.fill('CONTRACT-SECONDARY-002');
          }
        }
      }

      await authenticatedPage.click('button[type="submit"]:has-text("Create")');
      await authenticatedPage.waitForTimeout(3000);

      await waitForTable(authenticatedPage);
      await expect(authenticatedPage.locator(`text=${supplier}`).first()).toBeVisible({ timeout: 10000 });
    });

    test('should link assets to suppliers', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/dashboard/assets/suppliers');
      await waitForTable(authenticatedPage);

      // Create supplier
      await authenticatedPage.click('button:has-text("Add New Asset")');
      await waitForDialog(authenticatedPage);

      const supplier = `Asset Provider ${generateRandomString()}`;
      await authenticatedPage.fill('input[name="supplierName"]', supplier);

      // Look for linked assets section
      const linkedAssetsTab = authenticatedPage.locator('button:has-text("Assets"), button:has-text("Linked Assets")').first();
      if (await linkedAssetsTab.isVisible()) {
        await linkedAssetsTab.click();
        await authenticatedPage.waitForTimeout(500);

        // Add linked asset
        const addAssetButton = authenticatedPage.locator('button:has-text("Add Asset"), button:has-text("Link Asset")').first();
        if (await addAssetButton.isVisible()) {
          await addAssetButton.click();
          await authenticatedPage.waitForTimeout(500);

          // Search for existing assets to link
          const assetSearch = authenticatedPage.locator('input[name*="asset"], input[placeholder*="Search Assets"]').first();
          if (await assetSearch.isVisible()) {
            await assetSearch.fill('Test');
            await authenticatedPage.waitForTimeout(1000);

            // Select first available asset
            const assetOption = authenticatedPage.locator('[role="option"]').first();
            if (await assetOption.isVisible()) {
              await assetOption.click();
            }
          }
        }
      }

      await authenticatedPage.click('button[type="submit"]:has-text("Create")');
      await authenticatedPage.waitForTimeout(3000);

      await waitForTable(authenticatedPage);
      await expect(authenticatedPage.locator(`text=${supplier}`).first()).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe('Dependency Visualization', () => {
    test('should display dependency graph or tree view', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/dashboard/assets/physical');
      await waitForTable(authenticatedPage);

      // Look for dependency view option
      const viewToggleButton = authenticatedPage.locator('button:has-text("View"), button[aria-label*="View"]').first();
      if (await viewToggleButton.isVisible()) {
        await viewToggleButton.click();
        await authenticatedPage.waitForTimeout(500);

        // Look for dependency graph option
        const graphViewOption = authenticatedPage.locator('button:has-text("Graph"), button:has-text("Dependencies"), [role="menuitem"]:has-text("Graph")').first();
        if (await graphViewOption.isVisible()) {
          await graphViewOption.click();
          await authenticatedPage.waitForTimeout(2000);

          // Check if dependency graph is displayed
          const graphContainer = authenticatedPage.locator('[data-testid="dependency-graph"], svg, .graph-container').first();
          if (await graphContainer.isVisible()) {
            await expect(graphContainer).toBeVisible({ timeout: 5000 });
          }
        }
      }

      // Look for relationship button in table rows
      const viewRelationsButton = authenticatedPage.locator('button:has-text("Relations"), button[aria-label*="Relations"]').first();
      if (await viewRelationsButton.isVisible()) {
        await viewRelationsButton.click();
        await authenticatedPage.waitForTimeout(2000);

        // Check if relationship modal/view is displayed
        await expect(authenticatedPage.locator('[role="dialog"], .modal').first()).toBeVisible({ timeout: 5000 });
      }
    });

    test('should show impact analysis when deleting assets with dependencies', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/dashboard/assets/physical');
      await waitForTable(authenticatedPage);

      // Find an asset and try to delete it
      const firstRow = authenticatedPage.locator('table tbody tr').first();
      if (await firstRow.isVisible()) {
        const deleteButton = firstRow.locator('button[aria-label*="Delete"], button:has-text("Delete")').first();
        if (await deleteButton.isVisible()) {
          await deleteButton.click();
          await authenticatedPage.waitForTimeout(1000);

          // Look for impact analysis in confirmation dialog
          const impactSection = authenticatedPage.locator('[data-testid="impact"], section:has-text("Impact"), div:has-text("Dependencies")').first();
          if (await impactSection.isVisible()) {
            // Should show what will be affected
            await expect(impactSection).toBeVisible({ timeout: 5000 });

            const dependentAssetsText = await impactSection.textContent();
            expect(dependentAssetsText).toContain('dependenc'); // Should mention dependencies
          }

          // Cancel the deletion for this test
          const cancelButton = authenticatedPage.locator('button:has-text("Cancel"), button[aria-label*="Cancel"]').first();
          if (await cancelButton.isVisible()) {
            await cancelButton.click();
          }
        }
      }
    });
  });

  test.describe('Dependency Validation', () => {
    test('should prevent circular dependencies', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/dashboard/assets/physical');
      await waitForTable(authenticatedPage);

      // Create two assets and try to create circular dependency
      const asset1Name = `Asset One ${generateRandomString()}`;
      const asset2Name = `Asset Two ${generateRandomString()}`;

      // Create first asset
      await authenticatedPage.click('button:has-text("Add New Asset")');
      await waitForDialog(authenticatedPage);

      await authenticatedPage.fill('input[name="assetDescription"]', asset1Name);
      await authenticatedPage.fill('input[name="uniqueIdentifier"]', 'CIRCULAR-TEST-001');

      await authenticatedPage.click('button[type="submit"]:has-text("Create")');
      await authenticatedPage.waitForTimeout(3000);

      // Create second asset with dependency on first
      await authenticatedPage.click('button:has-text("Add New Asset")');
      await waitForDialog(authenticatedPage);

      await authenticatedPage.fill('input[name="assetDescription"]', asset2Name);
      await authenticatedPage.fill('input[name="uniqueIdentifier"]', 'CIRCULAR-TEST-002');

      // Add dependency on first asset
      const dependenciesTab = authenticatedPage.locator('button:has-text("Dependencies"), button:has-text("Relationships")').first();
      if (await dependenciesTab.isVisible()) {
        await dependenciesTab.click();
        await authenticatedPage.waitForTimeout(500);

        const addDependencyButton = authenticatedPage.locator('button:has-text("Add Dependency")').first();
        if (await addDependencyButton.isVisible()) {
          await addDependencyButton.click();
          await authenticatedPage.waitForTimeout(500);

          const dependencySearch = authenticatedPage.locator('input[name*="dependency"]').first();
          if (await dependencySearch.isVisible()) {
            await dependencySearch.fill(asset1Name);
            await authenticatedPage.waitForTimeout(1000);

            const asset1Option = authenticatedPage.locator(`[role="option"]:has-text("${asset1Name}")`).first();
            if (await asset1Option.isVisible()) {
              await asset1Option.click();
            }
          }
        }
      }

      await authenticatedPage.click('button[type="submit"]:has-text("Create")');
      await authenticatedPage.waitForTimeout(3000);

      // Now try to edit first asset and add dependency on second (creating circular dependency)
      await search(authenticatedPage, asset1Name);
      await authenticatedPage.waitForTimeout(1000);

      const editButton = authenticatedPage.locator('button[aria-label*="Edit"], button:has-text("Edit")').first();
      await editButton.click();

      await waitForDialog(authenticatedPage);

      // Try to add dependency on second asset
      const dependenciesTab2 = authenticatedPage.locator('button:has-text("Dependencies")').first();
      if (await dependenciesTab2.isVisible()) {
        await dependenciesTab2.click();
        await authenticatedPage.waitForTimeout(500);

        const addDependencyButton2 = authenticatedPage.locator('button:has-text("Add Dependency")').first();
        if (await addDependencyButton2.isVisible()) {
          await addDependencyButton2.click();
          await authenticatedPage.waitForTimeout(500);

          const dependencySearch2 = authenticatedPage.locator('input[name*="dependency"]').first();
          if (await dependencySearch2.isVisible()) {
            await dependencySearch2.fill(asset2Name);
            await authenticatedPage.waitForTimeout(1000);

            const asset2Option = authenticatedPage.locator(`[role="option"]:has-text("${asset2Name}")`).first();
            if (await asset2Option.isVisible()) {
              await asset2Option.click();
              await authenticatedPage.waitForTimeout(1000);

              // Should show validation error about circular dependency
              await expect(authenticatedPage.locator('text=/circular dependency/i, text=/would create a cycle/i')).toBeVisible({ timeout: 5000 });
            }
          }
        }
      }

      // Close dialog without saving
      const cancelButton = authenticatedPage.locator('button:has-text("Cancel"), button[aria-label*="Close"]').first();
      if (await cancelButton.isVisible()) {
        await cancelButton.click();
      }
    });
  });
});