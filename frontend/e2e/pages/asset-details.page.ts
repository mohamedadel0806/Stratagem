/**
 * Page Object Model for Asset Details page
 */
import { Page, Locator } from '@playwright/test';

export class AssetDetailsPage {
  readonly page: Page;
  readonly navigationTabs: Locator;
  readonly controlsTab: Locator;
  readonly risksTab: Locator;
  readonly dependenciesTab: Locator;
  readonly overviewTab: Locator;
  readonly ownershipTab: Locator;
  readonly networkTab: Locator;
  readonly complianceTab: Locator;
  readonly classificationTab: Locator;
  readonly graphViewTab: Locator;
  readonly auditTrailTab: Locator;

  constructor(page: Page) {
    this.page = page;
    this.navigationTabs = page.locator('[role="tab"]');
    this.controlsTab = page.locator('[role="tab"]:has-text("Controls")');
    this.risksTab = page.locator('[role="tab"]:has-text("Risks")');
    this.dependenciesTab = page.locator('[role="tab"]:has-text("Dependencies")');
    this.overviewTab = page.locator('[role="tab"]:has-text("Overview")');
    this.ownershipTab = page.locator('[role="tab"]:has-text("Ownership")');
    this.networkTab = page.locator('[role="tab"]:has-text("Location & Network")');
    this.complianceTab = page.locator('[role="tab"]:has-text("Compliance & Security")');
    this.classificationTab = page.locator('[role="tab"]:has-text("Classification")');
    this.graphViewTab = page.locator('[role="tab"]:has-text("Graph View")');
    this.auditTrailTab = page.locator('[role="tab"]:has-text("Audit Trail")');
  }

  /**
   * Navigate to a specific asset
   */
  async navigateToAsset(assetUrl: string): Promise<void> {
    await this.page.goto(assetUrl);
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Click on a specific tab using testids for reliable selection
   */
  async clickTab(tabName: string): Promise<void> {
    // Map tab names to their testids
    const tabTestIdMap: { [key: string]: string } = {
      'Overview': 'tab-overview',
      'Classification': 'tab-classification',
      'Ownership': 'tab-ownership',
      'Compliance': 'tab-compliance',
      'Controls': 'tab-controls',
      'Risks': 'tab-risks',
      'Dependencies': 'tab-dependencies',
      'Graph View': 'tab-graph',
      'Graph': 'tab-graph',
      'Audit Trail': 'tab-audit',
      'Audit': 'tab-audit',
      'Location & Network': 'tab-location-network',
      'Compliance & Security': 'tab-compliance-security'
    };

    // First try using testid (most reliable)
    const testId = tabTestIdMap[tabName];
    if (testId) {
      const tab = this.page.getByTestId(testId).first();
      const isVisible = await tab.isVisible().catch(() => false);
      if (isVisible) {
        await tab.click();
        await this.page.waitForLoadState('domcontentloaded');
        return;
      }
    }

    // Fallback to role="tab" approach (for physical assets)
    const roleTab = this.page.locator(`[role="tab"]:has-text("${tabName}")`).first();
    const roleTabVisible = await roleTab.isVisible().catch(() => false);

    if (roleTabVisible) {
      await roleTab.click();
      await this.page.waitForLoadState('domcontentloaded');
      return;
    }

    // Final fallback - try text-based approach
    const genericTab = this.page.locator(`button:has-text("${tabName}")`).first();
    await genericTab.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Get all available tabs using testids for reliable detection
   */
  async getAvailableTabs(): Promise<string[]> {
    let tabNames: string[] = [];

    // Map testids to display names for information assets
    const testIdToTabMap: { [key: string]: string } = {
      'tab-overview': 'Overview',
      'tab-classification': 'Classification',
      'tab-ownership': 'Ownership',
      'tab-compliance': 'Compliance',
      'tab-controls': 'Controls',
      'tab-risks': 'Risks',
      'tab-dependencies': 'Dependencies',
      'tab-graph': 'Graph View',
      'tab-audit': 'Audit Trail'
    };

    // First try using testids (most reliable for information assets)
    for (const [testId, tabName] of Object.entries(testIdToTabMap)) {
      const tab = this.page.getByTestId(testId).first();
      const isVisible = await tab.isVisible().catch(() => false);
      if (isVisible) {
        tabNames.push(tabName);
      }
    }

    // If no tabs found via testids, fallback to standard role="tab" approach
    if (tabNames.length === 0) {
      const roleTabs = await this.navigationTabs.all();
      for (const tab of roleTabs) {
        try {
          const isVisible = await tab.isVisible();
          if (isVisible) {
            const text = await tab.textContent();
            if (text && text.trim()) {
              tabNames.push(text.trim());
            }
          }
        } catch (e) {
          continue;
        }
      }
    }

    return tabNames;
  }

  /**
   * Click Controls tab
   */
  async clickControlsTab(): Promise<void> {
    await this.controlsTab.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Click Risks tab
   */
  async clickRisksTab(): Promise<void> {
    await this.risksTab.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Click Dependencies tab
   */
  async clickDependenciesTab(): Promise<void> {
    await this.dependenciesTab.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Get edit button
   */
  getEditButton(): Locator {
    return this.page.locator('button:has-text("Edit")').first();
  }

  /**
   * Screenshot helper
   */
  async takeScreenshot(name: string): Promise<void> {
    await this.page.screenshot({
      path: `test-results/${name}.png`,
      fullPage: true
    });
  }
}

/**
 * Controls tab Page Object
 */
export class ControlsTabPage {
  readonly page: Page;
  readonly linkControlsButton: Locator;
  readonly modal: Locator;
  readonly modalCloseButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.linkControlsButton = page.locator('button:has-text("Link Controls")');
    this.modal = page.locator('[role="dialog"]');
    this.modalCloseButton = page.locator('button:has-text("Cancel")').first();
  }

  /**
   * Click Link Controls button
   */
  async clickLinkControlsButton(): Promise<void> {
    await this.linkControlsButton.click();
    await expect(this.modal).toBeVisible({ timeout: 5000 });
  }

  /**
   * Get all control checkbox buttons
   */
  getControlCheckboxes(): Locator {
    return this.modal.locator('button[role="checkbox"]');
  }

  /**
   * Get link button in modal
   */
  getLinkButton(): Locator {
    return this.modal.locator('button:has-text("Link")');
  }

  /**
   * Select a specific number of controls
   */
  async selectControls(count: number = 1): Promise<void> {
    const checkboxes = await this.getControlCheckboxes().all();

    for (let i = 0; i < Math.min(count, checkboxes.length); i++) {
      const checkbox = checkboxes[i];
      if (await checkbox.isVisible()) {
        const ariaChecked = await checkbox.getAttribute('aria-checked');
        if (ariaChecked !== 'true') {
          await checkbox.click();
          await expect(checkbox).toHaveAttribute('aria-checked', 'true', { timeout: 1000 });
        }
      }
    }
  }

  /**
   * Complete the linking process
   */
  async linkSelectedControls(): Promise<void> {
    const linkButton = this.getLinkButton();
    const isEnabled = await linkButton.isEnabled();

    if (isEnabled) {
      await linkButton.click();
      await expect(this.modal).not.toBeVisible({ timeout: 10000 });
    } else {
      throw new Error('Link button is not enabled. Please select controls first.');
    }
  }

  /**
   * Close modal if still open
   */
  async closeModal(): Promise<void> {
    const modalVisible = await this.modal.isVisible();
    if (modalVisible) {
      await this.modalCloseButton.click();
      await expect(this.modal).not.toBeVisible({ timeout: 5000 });
    }
  }
}

/**
 * Risks tab Page Object
 */
export class RisksTabPage {
  readonly page: Page;
  readonly linkRiskButton: Locator;
  readonly modal: Locator;
  readonly riskSearchInput: Locator;
  readonly riskDropdownTrigger: Locator;
  readonly riskDialogSubmitButton: Locator;
  readonly modalCloseButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.linkRiskButton = page.locator('button:has-text("Link Risk"), button:has-text("Add Risk")');
    this.modal = page.locator('[role="dialog"]');
    this.riskSearchInput = page.locator('[data-testid="risk-search-input"]');
    this.riskDropdownTrigger = page.locator('[data-testid="risk-dropdown-trigger"]');
    this.riskDialogSubmitButton = page.locator('[data-testid="risk-asset-dialog-submit-button"]');
    this.modalCloseButton = page.locator('button:has-text("Cancel")').first();
  }

  /**
   * Click Link Risk button
   */
  async clickLinkRiskButton(): Promise<void> {
    await this.linkRiskButton.first().click();
    await expect(this.modal).toBeVisible({ timeout: 5000 });
  }

  /**
   * Search for a risk
   */
  async searchForRisk(searchTerm: string): Promise<void> {
    await this.riskSearchInput.fill(searchTerm);
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Open risk dropdown
   */
  async openRiskDropdown(): Promise<void> {
    await this.riskDropdownTrigger.click();
    await expect(this.riskDropdownTrigger).toHaveAttribute('aria-expanded', 'true', { timeout: 3000 });
  }

  /**
   * Select a risk by index
   */
  async selectRiskByIndex(index: number): Promise<void> {
    const riskOption = this.page.locator(`[data-testid="risk-option-${index}"]`);
    await riskOption.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Get all risk options
   */
  getRiskOptions(): Locator {
    return this.page.locator('[data-testid^="risk-option-"]');
  }

  /**
   * Complete risk linking
   */
  async linkSelectedRisk(): Promise<void> {
    await this.riskDialogSubmitButton.click();
    await expect(this.modal).not.toBeVisible({ timeout: 10000 });
  }

  /**
   * Close modal if still open
   */
  async closeModal(): Promise<void> {
    const modalVisible = await this.modal.isVisible();
    if (modalVisible) {
      await this.modalCloseButton.click();
      await expect(this.modal).not.toBeVisible({ timeout: 5000 });
    }
  }

  /**
   * Check if there are any linked risks
   */
  async hasLinkedRisks(): Promise<boolean> {
    const riskElements = await this.page.locator('[data-testid^="risk-"]').all();
    const visibleRiskElements = [];

    for (const element of riskElements) {
      if (await element.isVisible()) {
        visibleRiskElements.push(element);
      }
    }

    return visibleRiskElements.length > 0;
  }

  /**
   * Get count of linked risks
   */
  async getLinkedRisksCount(): Promise<number> {
    const riskElements = await this.page.locator('[data-testid^="risk-"]').all();
    let count = 0;

    for (const element of riskElements) {
      if (await element.isVisible()) {
        count++;
      }
    }

    return count;
  }
}

/**
 * Dependencies tab Page Object
 */
export class DependenciesTabPage {
  readonly page: Page;
  readonly addDependencyButton: Locator;
  readonly modal: Locator;
  readonly modalCloseButton: Locator;
  readonly searchInput: Locator;
  readonly targetTypeSelect: Locator;
  readonly relationshipTypeSelect: Locator;
  readonly targetAssetSelect: Locator;
  readonly descriptionTextarea: Locator;
  readonly createDependencyButton: Locator;
  readonly outgoingDependenciesCard: Locator;
  readonly incomingDependenciesCard: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addDependencyButton = page.locator('button:has-text("Add Dependency")');
    this.modal = page.locator('[role="dialog"]');
    this.modalCloseButton = page.locator('button:has-text("Cancel")').first();
    this.searchInput = page.locator('input[placeholder*="Search"]');
    this.targetTypeSelect = page.locator('select'); // Will need to be more specific
    this.relationshipTypeSelect = page.locator('select'); // Will need to be more specific
    this.targetAssetSelect = page.locator('select'); // Will need to be more specific
    this.descriptionTextarea = page.locator('textarea');
    this.createDependencyButton = page.locator('button:has-text("Create Dependency"), button:has-text("Creating...")');
    this.outgoingDependenciesCard = page.locator('text=Outgoing Dependencies').locator('..').locator('..');
    this.incomingDependenciesCard = page.locator('text=Incoming Dependencies').locator('..').locator('..');
  }

  /**
   * Click Add Dependency button
   */
  async clickAddDependencyButton(): Promise<void> {
    await this.addDependencyButton.first().click();
    await expect(this.modal).toBeVisible({ timeout: 5000 });
  }

  /**
   * Search for target assets
   */
  async searchForAssets(searchTerm: string): Promise<void> {
    const modalSearchInput = await this.modal.locator('input[placeholder*="Search"]').first();
    if (await modalSearchInput.isVisible()) {
      await modalSearchInput.fill(searchTerm);
      await this.page.waitForLoadState('domcontentloaded');
    }
  }

  /**
   * Select target asset type
   */
  async selectTargetAssetType(assetType: string): Promise<void> {
    const selects = await this.modal.locator('select').all();
    for (const select of selects) {
      try {
        const options = await select.locator('option').all();
        for (const option of options) {
          const text = await option.textContent();
          if (text && text.toLowerCase().includes(assetType.toLowerCase())) {
            await select.selectOption({ label: text });
            await this.page.waitForLoadState('domcontentloaded');
            return;
          }
        }
      } catch (e) {
        continue;
      }
    }
  }

  /**
   * Select relationship type
   */
  async selectRelationshipType(relationshipType: string): Promise<void> {
    const selects = await this.modal.locator('select').all();
    for (const select of selects) {
      try {
        const options = await select.locator('option').all();
        for (const option of options) {
          const value = await option.getAttribute('value');
          if (value === relationshipType) {
            await select.selectOption({ value });
            await this.page.waitForLoadState('domcontentloaded');
            return;
          }
        }
      } catch (e) {
        continue;
      }
    }
  }

  /**
   * Fill dependency description
   */
  async fillDescription(description: string): Promise<void> {
    const textarea = await this.modal.locator('textarea').first();
    if (await textarea.isVisible()) {
      await textarea.fill(description);
      await expect(textarea).toHaveValue(description);
    }
  }

  /**
   * Create the dependency
   */
  async createDependency(): Promise<void> {
    const createButton = await this.createDependencyButton.first();
    if (await createButton.isVisible() && await createButton.isEnabled()) {
      await createButton.click();
      await expect(this.modal).not.toBeVisible({ timeout: 10000 });
    }
  }

  /**
   * Close modal if still open
   */
  async closeModal(): Promise<void> {
    const modalVisible = await this.modal.isVisible();
    if (modalVisible) {
      await this.modalCloseButton.click();
      await expect(this.modal).not.toBeVisible({ timeout: 5000 });
    }
  }

  /**
   * Get count of outgoing dependencies
   */
  async getOutgoingDependenciesCount(): Promise<number> {
    try {
      const card = await this.outgoingDependenciesCard.first();
      if (await card.isVisible()) {
        // Look for dependency items within the card
        const dependencyItems = await card.locator('*').all();
        let count = 0;

        for (const item of dependencyItems) {
          try {
            const text = await item.textContent();
            if (text && text.trim().length > 10 &&
                (text.toLowerCase().includes('identifier') ||
                 text.toLowerCase().includes('dependency') ||
                 text.toLowerCase().includes('asset'))) {
              count++;
            }
          } catch (e) {
            continue;
          }
        }

        return Math.floor(count / 3); // Rough estimate
      }
    } catch (e) {
      // Continue
    }

    return 0;
  }

  /**
   * Get count of incoming dependencies
   */
  async getIncomingDependenciesCount(): Promise<number> {
    try {
      const card = await this.incomingDependenciesCard.first();
      if (await card.isVisible()) {
        // Look for dependency items within the card
        const dependencyItems = await card.locator('*').all();
        let count = 0;

        for (const item of dependencyItems) {
          try {
            const text = await item.textContent();
            if (text && text.trim().length > 10 &&
                (text.toLowerCase().includes('identifier') ||
                 text.toLowerCase().includes('dependency') ||
                 text.toLowerCase().includes('asset'))) {
              count++;
            }
          } catch (e) {
            continue;
          }
        }

        return Math.floor(count / 3); // Rough estimate
      }
    } catch (e) {
      // Continue
    }

    return 0;
  }

  /**
   * Check if there are any dependencies
   */
  async hasDependencies(): Promise<boolean> {
    const outgoing = await this.getOutgoingDependenciesCount();
    const incoming = await this.getIncomingDependenciesCount();
    return outgoing > 0 || incoming > 0;
  }

  /**
   * Look for dependency graph
   */
  getDependencyGraph(): Locator {
    return this.page.locator('.dependency-graph, [data-testid*="dependency"]');
  }

  /**
   * Look for dependency graph by text content
   */
  getDependencyGraphByText(): Locator {
    return this.page.locator('text=Dependency Graph');
  }
}