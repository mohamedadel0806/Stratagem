import { Page, Locator, expect } from '@playwright/test';

/**
 * Page Object Model for Risk Details Page
 * Encapsulates all interactions with the risk details page
 */
export class RiskDetailsPage {
  readonly page: Page;
  
  // Tab locators
  readonly overviewTab: Locator;
  readonly assessmentsTab: Locator;
  readonly assetsTab: Locator;
  readonly controlsTab: Locator;
  readonly treatmentsTab: Locator;
  readonly krisTab: Locator;

  // Overview tab elements
  readonly editButton: Locator;

  // Assessments tab elements
  readonly newAssessmentButton: Locator;

  // Assets tab elements
  readonly linkAssetButton: Locator;

  // Controls tab elements
  readonly linkControlButton: Locator;

  // Treatments tab elements
  readonly newTreatmentButton: Locator;

  // KRIs tab elements
  readonly linkKriButton: Locator;

  // Common dialog/form elements
  readonly dialog: Locator;
  readonly cancelButton: Locator;

  // Wait times (can be configured)
  private readonly WAIT_SMALL = 500;
  private readonly WAIT_MEDIUM = 1000;
  private readonly WAIT_LARGE = 2000;
  private readonly WAIT_AFTER_SUBMIT = 3000;

  constructor(page: Page, waitTimes?: { small?: number; medium?: number; large?: number; afterSubmit?: number }) {
    this.page = page;

    // Configure wait times if provided
    if (waitTimes) {
      this.WAIT_SMALL = waitTimes.small || this.WAIT_SMALL;
      this.WAIT_MEDIUM = waitTimes.medium || this.WAIT_MEDIUM;
      this.WAIT_LARGE = waitTimes.large || this.WAIT_LARGE;
      this.WAIT_AFTER_SUBMIT = waitTimes.afterSubmit || this.WAIT_AFTER_SUBMIT;
    }

    // Tab locators - using getByTestId only (Playwright Advisory Guide compliant)
    this.overviewTab = page.getByTestId('risk-details-tab-overview');
    this.assessmentsTab = page.getByTestId('risk-details-tab-assessments');
    this.assetsTab = page.getByTestId('risk-details-tab-assets');
    this.controlsTab = page.getByTestId('risk-details-tab-controls');
    this.treatmentsTab = page.getByTestId('risk-details-tab-treatments');
    this.krisTab = page.getByTestId('risk-details-tab-kris');

    // Button locators - using getByTestId only (Playwright Advisory Guide compliant)
    this.editButton = page.getByTestId('risk-details-edit-button');
    this.newAssessmentButton = page.getByTestId('risk-details-new-assessment-button');
    this.linkAssetButton = page.getByTestId('risk-details-link-asset-button');
    this.linkControlButton = page.getByTestId('risk-details-link-control-button');
    this.newTreatmentButton = page.getByTestId('risk-details-new-treatment-button');
    this.linkKriButton = page.getByTestId('risk-details-link-kri-button');

    // Common elements
    this.dialog = page.locator('[role="dialog"]');
    this.cancelButton = page.locator('button:has-text("Cancel")').first();
  }

  /**
   * Navigate to risk details page
   */
  async goto(riskId: string) {
    await this.page.goto(`/en/dashboard/risks/${riskId}`, { waitUntil: 'domcontentloaded' });
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(this.WAIT_LARGE);
  }

  /**
   * Click on a specific tab
   * Uses testid if available, falls back to role/text
   * Note: Does NOT ensure dialog is closed here - call ensureNoDialogOpen() before if needed
   */
  async clickTab(tabName: 'Overview' | 'Assessments' | 'Assets' | 'Controls' | 'Treatments' | 'KRIs') {
    const tabMap = {
      'Overview': this.overviewTab,
      'Assessments': this.assessmentsTab,
      'Assets': this.assetsTab,
      'Controls': this.controlsTab,
      'Treatments': this.treatmentsTab,
      'KRIs': this.krisTab,
    };

    const tab = tabMap[tabName];
    await tab.waitFor({ state: 'visible', timeout: 10000 });
    
    // Check if tab is already active to avoid unnecessary clicks
    const isActive = await tab.getAttribute('data-state').catch(() => '');
    if (isActive === 'active') {
      // Tab is already active, just wait for content
      await this.page.waitForTimeout(this.WAIT_MEDIUM);
      return;
    }
    
    await tab.click();
    await this.page.waitForTimeout(this.WAIT_MEDIUM);
    
    // Wait a bit more to ensure tab content is loaded
    await this.page.waitForTimeout(this.WAIT_SMALL);
  }
  
  /**
   * Open Edit Risk form - uses testid
   */
  async openEditRiskForm() {
    await this.clickTab('Overview');
    const isVisible = await this.editButton.isVisible({ timeout: 5000 }).catch(() => false);
    if (!isVisible) {
      throw new Error('Edit button not found');
    }
    await this.editButton.click();
    await this.page.waitForTimeout(this.WAIT_MEDIUM);
    
    const dialogVisible = await this.isDialogVisible();
    if (!dialogVisible) {
      throw new Error('Edit Risk form did not open');
    }
  }

  /**
   * Fill Edit Risk form with updated values
   */
  async fillEditRiskForm(options: { description?: string; statusNotes?: string }) {
    // Wait for form to be ready
    await this.page.waitForTimeout(this.WAIT_SMALL);

    // Update description field if provided
    // The form uses react-hook-form, so we need to find the textarea near the "Description" label
    if (options.description) {
      // Find the label first, then get the textarea that follows it
      const descriptionLabel = this.page.locator('label:has-text("Description")');
      const descriptionVisible = await descriptionLabel.isVisible({ timeout: 3000 }).catch(() => false);
      
      if (descriptionVisible) {
        // Get the textarea associated with this label (usually a sibling or in the same form item)
        const descriptionField = descriptionLabel.locator('..').locator('textarea').or(
          this.page.locator('textarea').filter({ has: descriptionLabel }).first()
        );
        
        // Alternative: find textarea by its position relative to the label
        const descriptionFieldAlt = this.page.locator('label:has-text("Description") ~ textarea').or(
          this.page.locator('form textarea').filter({ hasNot: this.page.locator('label:has-text("Risk Statement")') }).first()
        );
        
        const fieldToUse = descriptionFieldAlt;
        await fieldToUse.clear();
        // Use type() with delay for better React form handling (Playwright Advisory Guide compliant)
        await fieldToUse.type(options.description, { delay: 30 });
        await this.page.waitForTimeout(this.WAIT_SMALL);
        console.log(`✅ Filled description field: ${options.description.substring(0, 50)}...`);
      }
    }

    // Update status notes if provided
    // Status notes might be in the "Risk Scenario" tab
    if (options.statusNotes) {
      // First try to find it on the current tab
      const statusNotesLabel = this.page.locator('label:has-text("Status Notes")');
      let statusNotesVisible = await statusNotesLabel.isVisible({ timeout: 2000 }).catch(() => false);
      
      if (!statusNotesVisible) {
        // Try clicking the "Risk Scenario" tab
        const scenarioTab = this.page.locator('[role="tab"]:has-text("Risk Scenario")').first();
        const scenarioTabVisible = await scenarioTab.isVisible({ timeout: 2000 }).catch(() => false);
        
        if (scenarioTabVisible) {
          await scenarioTab.click();
          await this.page.waitForTimeout(this.WAIT_SMALL);
          statusNotesVisible = await statusNotesLabel.isVisible({ timeout: 3000 }).catch(() => false);
        }
      }
      
      if (statusNotesVisible) {
        const statusNotesField = this.page.locator('label:has-text("Status Notes") ~ textarea').or(
          this.page.locator('textarea').filter({ has: statusNotesLabel }).first()
        );
        await statusNotesField.clear();
        // Use type() with delay for better React form handling (Playwright Advisory Guide compliant)
        await statusNotesField.type(options.statusNotes, { delay: 30 });
        await this.page.waitForTimeout(this.WAIT_SMALL);
        console.log(`✅ Filled status notes field: ${options.statusNotes.substring(0, 50)}...`);
      } else {
        console.log('⚠️ Status Notes field not found, skipping...');
      }
    }
  }

  /**
   * Submit Edit Risk form (save changes)
   */
  async submitEditRiskForm() {
    // Find and click the "Update Risk" button
    const updateButton = this.page.getByRole('button', { name: /Update Risk/i }).or(
      this.page.locator('button[type="submit"]').filter({ hasText: /Update/i })
    );
    
    const isVisible = await updateButton.isVisible({ timeout: 5000 }).catch(() => false);
    if (!isVisible) {
      throw new Error('Update Risk button not found');
    }
    
    await updateButton.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(this.WAIT_SMALL);
    await updateButton.click();
    await this.page.waitForTimeout(this.WAIT_AFTER_SUBMIT);
    
    // Verify dialog is closed (form was submitted)
    const dialogStillVisible = await this.isDialogVisible();
    if (dialogStillVisible) {
      // Wait a bit more in case it's still closing
      await this.page.waitForTimeout(this.WAIT_MEDIUM);
      const stillVisibleAfterWait = await this.isDialogVisible();
      if (stillVisibleAfterWait) {
        throw new Error('Edit Risk form did not close after submit');
      }
    }
  }

  /**
   * Check if dialog/form is visible
   */
  async isDialogVisible(): Promise<boolean> {
    const dialogCheck1 = await this.dialog.isVisible({ timeout: 3000 }).catch(() => false);
    const dialogCheck2 = await this.page.locator('form').isVisible({ timeout: 2000 }).catch(() => false);
    return dialogCheck1 || dialogCheck2;
  }

  /**
   * Close dialog/form - cancels without saving
   */
  async closeDialog() {
    // Try multiple strategies to ensure dialog closes
    const cancelVisible = await this.cancelButton.isVisible({ timeout: 2000 }).catch(() => false);
    if (cancelVisible) {
      await this.cancelButton.click();
      await this.page.waitForTimeout(this.WAIT_SMALL);
    }
    
    // Press Escape as well to ensure it closes
    await this.page.keyboard.press('Escape');
    await this.page.waitForTimeout(this.WAIT_MEDIUM);
    
    // Verify dialog is actually closed
    const stillVisible = await this.isDialogVisible();
    if (stillVisible) {
      // Try Escape again
      await this.page.keyboard.press('Escape');
      await this.page.waitForTimeout(this.WAIT_MEDIUM);
    }
  }

  /**
   * Ensure dialog is closed
   */
  async ensureDialogClosed() {
    let attempts = 0;
    const maxAttempts = 5;
    while (attempts < maxAttempts) {
      const dialogVisible = await this.dialog.isVisible({ timeout: 1000 }).catch(() => false);
      if (!dialogVisible) {
        return; // Dialog is closed
      }
      // Try to close it
      await this.page.keyboard.press('Escape');
      await this.page.waitForTimeout(this.WAIT_SMALL);
      attempts++;
    }
  }

  /**
   * Ensure no dialog is open before starting a new action
   */
  async ensureNoDialogOpen() {
    const dialogVisible = await this.dialog.isVisible({ timeout: 1000 }).catch(() => false);
    if (dialogVisible) {
      // Close any open dialog
      await this.page.keyboard.press('Escape');
      await this.page.waitForTimeout(this.WAIT_MEDIUM);
      // Verify it's closed
      await this.ensureDialogClosed();
    }
  }

  // ========================================
  // OVERVIEW TAB METHODS
  // ========================================
  // (openEditRiskForm moved above)

  // ========================================
  // ASSESSMENTS TAB METHODS
  // ========================================

  /**
   * Open New Assessment form - uses testid
   */
  async openNewAssessmentForm() {
    // Ensure no dialogs are open first
    await this.ensureNoDialogOpen();
    
    // Navigate to Assessments tab - this will switch from Overview if we're there
    await this.clickTab('Assessments');
    
    // Wait for tab content to fully load
    await this.page.waitForTimeout(this.WAIT_MEDIUM);
    
    // Verify we're on Assessments tab by checking active tab state
    const assessmentsTabActive = await this.assessmentsTab.getAttribute('data-state').catch(() => '');
    if (assessmentsTabActive !== 'active') {
      // Force click again if not active
      await this.assessmentsTab.click();
      await this.page.waitForTimeout(this.WAIT_MEDIUM);
    }
    
    // Verify the button is visible and only look for it using testid (more specific)
    const buttonWithTestId = this.page.getByTestId('risk-details-new-assessment-button');
    const isVisible = await buttonWithTestId.isVisible({ timeout: 5000 }).catch(() => false);
    
    if (!isVisible) {
      // Double-check no dialog is blocking the view
      const dialogBlocking = await this.isDialogVisible();
      if (dialogBlocking) {
        console.log('⚠️ Dialog blocking view, closing it...');
        await this.ensureNoDialogOpen();
        await this.page.waitForTimeout(this.WAIT_MEDIUM);
      }
      
      // Try again after clearing dialog
      const isVisibleRetry = await buttonWithTestId.isVisible({ timeout: 5000 }).catch(() => false);
      if (!isVisibleRetry) {
        throw new Error('New Assessment button not found on Assessments tab');
      }
    }
    
    // Click the button using testid (most reliable)
    await buttonWithTestId.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(this.WAIT_SMALL);
    await buttonWithTestId.click();
    await this.page.waitForTimeout(this.WAIT_MEDIUM);
    
    const dialogVisible = await this.isDialogVisible();
    if (!dialogVisible) {
      throw new Error('Assessment form did not open after clicking button');
    }
  }

  /**
   * Fill assessment form
   */
  async fillAssessmentForm(options: { likelihood?: number; impact?: number; notes?: string }) {
    // Fill likelihood
    if (options.likelihood !== undefined) {
      try {
        const likelihoodSelect = this.page.getByLabel('Likelihood').first();
        await likelihoodSelect.waitFor({ state: 'visible', timeout: 5000 });
        await this.page.waitForTimeout(this.WAIT_SMALL);
        await likelihoodSelect.click();
        await this.page.waitForTimeout(this.WAIT_MEDIUM);
        
        const option = this.page.locator(`[role="option"]:has-text("${options.likelihood} -")`).first();
        await option.waitFor({ state: 'visible', timeout: 3000 });
        await this.page.waitForTimeout(this.WAIT_SMALL);
        await option.click();
        await this.page.waitForTimeout(this.WAIT_MEDIUM);
      } catch (error) {
        console.log('⚠️ Could not set likelihood');
      }
    }

    // Fill impact
    if (options.impact !== undefined) {
      try {
        const impactSelect = this.page.getByLabel('Impact').first();
        await impactSelect.waitFor({ state: 'visible', timeout: 5000 });
        await this.page.waitForTimeout(this.WAIT_SMALL);
        await impactSelect.click();
        await this.page.waitForTimeout(this.WAIT_MEDIUM);
        
        const option = this.page.locator(`[role="option"]:has-text("${options.impact} -")`).first();
        await option.waitFor({ state: 'visible', timeout: 3000 });
        await this.page.waitForTimeout(this.WAIT_SMALL);
        await option.click();
        await this.page.waitForTimeout(this.WAIT_MEDIUM);
      } catch (error) {
        console.log('⚠️ Could not set impact');
      }
    }

    // Fill notes
    if (options.notes) {
      const notesTextarea = this.page.locator('textarea[name*="notes"], textarea[name*="description"], textarea[name*="comment"]').first();
      const notesExists = await notesTextarea.isVisible({ timeout: 2000 }).catch(() => false);
      if (notesExists) {
        // Use type() with delay for better React form handling (Playwright Advisory Guide compliant)
        await notesTextarea.type(options.notes, { delay: 30 });
        await this.page.waitForTimeout(this.WAIT_MEDIUM);
      }
    }
  }

  /**
   * Submit assessment form
   */
  async submitAssessmentForm() {
    const submitBtn = this.page.locator('button[type="submit"], button:has-text("Create"), button:has-text("Save")').first();
    const submitVisible = await submitBtn.isVisible({ timeout: 3000 }).catch(() => false);
    
    if (!submitVisible) {
      throw new Error('Submit button not found');
    }

    const isEnabled = await submitBtn.isEnabled().catch(() => false);
    if (!isEnabled) {
      throw new Error('Submit button is disabled');
    }

    await this.page.waitForTimeout(this.WAIT_SMALL);
    await submitBtn.click();
    await this.page.waitForTimeout(this.WAIT_AFTER_SUBMIT);

    const dialogStillVisible = await this.dialog.isVisible({ timeout: 3000 }).catch(() => false);
    if (dialogStillVisible) {
      throw new Error('Dialog still open after submit - submission may have failed');
    }
  }

  // ========================================
  // ASSETS TAB METHODS
  // ========================================

  /**
   * Open Link Asset dialog - uses testid with fallback
   */
  async openLinkAssetDialog() {
    // Ensure no dialogs are open first
    await this.ensureNoDialogOpen();
    await this.clickTab('Assets');
    
    // Wait for tab content to load
    await this.page.waitForTimeout(this.WAIT_MEDIUM);
    
    // Use the button locator which already has testid with fallback
    await this.clickLinkButton(this.linkAssetButton, 'Asset');
  }
  
  /**
   * Helper method to click link buttons with proper error handling
   * Uses getByTestId which is the recommended Playwright method
   */
  private async clickLinkButton(button: Locator, type: string) {
    console.log(`Attempting to click ${type} link button...`);
    
    // Use getByTestId first (recommended Playwright method)
    const testId = `risk-details-link-${type.toLowerCase()}-button`;
    let btn = this.page.getByTestId(testId).first();
    let isVisible = await btn.isVisible({ timeout: 2000 }).catch(() => false);
    
    if (!isVisible) {
      console.log(`Testid "${testId}" not found, trying fallback locator...`);
      btn = button; // Use the fallback locator passed in
      isVisible = await btn.isVisible({ timeout: 5000 }).catch(() => false);
    }
    
    if (!isVisible) {
      await this.page.screenshot({ path: `test-results/debug-link-${type.toLowerCase()}-button-not-found.png`, fullPage: true });
      throw new Error(`Link ${type} button not visible`);
    }
    
    console.log(`✅ ${type} button found, attempting click...`);
    
    try {
      await btn.scrollIntoViewIfNeeded();
      await this.page.waitForTimeout(this.WAIT_SMALL);
      
      const isEnabled = await btn.isEnabled().catch(() => false);
      if (!isEnabled) {
        throw new Error(`Link ${type} button is disabled`);
      }
      
      // Get button text for logging
      const buttonText = await btn.textContent().catch(() => '');
      console.log(`Button text: "${buttonText}", attempting click...`);
      
      // Try normal click first
      try {
        await btn.click({ timeout: 5000 });
        console.log(`✅ Clicked ${type} button`);
      } catch (clickError: any) {
        console.log(`Normal click failed: ${clickError?.message}, trying force click...`);
        // If overlay is blocking, try force click
        await btn.click({ force: true });
        console.log(`✅ Force clicked ${type} button`);
      }
      
      await this.page.waitForTimeout(this.WAIT_MEDIUM);
      
      const dialogVisible = await this.isDialogVisible();
      if (!dialogVisible) {
        await this.page.screenshot({ path: `test-results/debug-${type.toLowerCase()}-dialog-not-opened.png`, fullPage: true });
        throw new Error(`${type} linking dialog did not open after clicking button`);
      }
      
      console.log(`✅ ${type} dialog opened successfully`);
    } catch (error: any) {
      await this.page.screenshot({ path: `test-results/debug-link-${type.toLowerCase()}-error.png`, fullPage: true });
      console.log(`❌ Error clicking ${type} button: ${error?.message || error}`);
      throw error;
    }
  }

  /**
   * Select asset checkbox by index
   */
  async selectAsset(index: number = 0) {
    const checkboxes = this.page.locator('[role="checkbox"], input[type="checkbox"]');
    const checkboxCount = await checkboxes.count();
    
    if (checkboxCount === 0) {
      throw new Error('No asset checkboxes found');
    }

    if (index >= checkboxCount) {
      throw new Error(`Asset index ${index} out of range. Found ${checkboxCount} assets.`);
    }

    const checkbox = checkboxes.nth(index);
    const isChecked = await checkbox.isChecked().catch(() => false);
    
    if (!isChecked) {
      await checkbox.check();
      await this.page.waitForTimeout(this.WAIT_MEDIUM);
    }
  }

  /**
   * Submit asset link - uses getByTestId for submit button
   */
  async submitAssetLink() {
    // Wait for dialog to be fully loaded
    await this.page.waitForTimeout(this.WAIT_MEDIUM);

    // Try testid first (recommended)
    const testIdBtn = this.page.getByTestId('risk-asset-dialog-submit-button');
    const testIdVisible = await testIdBtn.isVisible({ timeout: 2000 }).catch(() => false);

    if (testIdVisible) {
      const isEnabled = await testIdBtn.isEnabled().catch(() => false);
      if (isEnabled) {
        console.log('Using testid to submit asset link...');
        await testIdBtn.scrollIntoViewIfNeeded();
        await this.page.waitForTimeout(this.WAIT_SMALL);
        await testIdBtn.click({ timeout: 5000 });
        await this.page.waitForTimeout(this.WAIT_AFTER_SUBMIT);

        const dialogStillVisible = await this.dialog.isVisible({ timeout: 3000 }).catch(() => false);
        if (!dialogStillVisible) {
          console.log('✅ Asset link submitted successfully');
          return; // Success
        }
      }
    }

    // Fallback to text-based selectors (handles dynamic text like "Link 1 Asset", "Link 2 Assets")
    const submitSelectors = [
      'button:has-text("Link Asset")',  // Matches "Link Asset", "Link 1 Asset", "Link 2 Assets", etc.
      'button:has-text("Link")',  // Generic fallback
      'button[type="submit"]:not(:disabled)',
    ];

    for (const selector of submitSelectors) {
      const submitBtn = this.page.locator(selector).first();
      const submitVisible = await submitBtn.isVisible({ timeout: 2000 }).catch(() => false);

      if (submitVisible) {
        const isEnabled = await submitBtn.isEnabled().catch(() => false);
        if (isEnabled) {
          try {
            console.log(`Using fallback selector "${selector}" to submit asset link...`);
            await submitBtn.scrollIntoViewIfNeeded();
            await this.page.waitForTimeout(this.WAIT_SMALL);
            await submitBtn.click({ timeout: 5000 });
            await this.page.waitForTimeout(this.WAIT_AFTER_SUBMIT);

            const dialogStillVisible = await this.dialog.isVisible({ timeout: 3000 }).catch(() => false);
            if (!dialogStillVisible) {
              console.log('✅ Asset link submitted successfully (fallback)');
              return; // Success
            }
          } catch (error) {
            // Try force click as fallback
            try {
              await submitBtn.click({ force: true });
              await this.page.waitForTimeout(this.WAIT_AFTER_SUBMIT);
              const dialogStillVisible = await this.dialog.isVisible({ timeout: 3000 }).catch(() => false);
              if (!dialogStillVisible) {
                console.log('✅ Asset link submitted successfully (force click)');
                return; // Success
              }
            } catch (forceError) {
              console.log(`Failed to click submit button with selector "${selector}"`);
            }
          }
        }
      }
    }
    throw new Error('Could not submit asset link - no enabled submit button found');
  }

  // ========================================
  // CONTROLS TAB METHODS
  // ========================================

  /**
   * Open Link Control dialog - uses testid with fallback
   */
  async openLinkControlDialog() {
    // Ensure no dialogs are open first
    await this.ensureNoDialogOpen();
    await this.clickTab('Controls');
    
    // Wait for tab content to load
    await this.page.waitForTimeout(this.WAIT_MEDIUM);
    
    // Use the button locator which already has testid with fallback
    await this.clickLinkButton(this.linkControlButton, 'Control');
  }

  /**
   * Select control checkbox by index
   */
  async selectControl(index: number = 0) {
    const checkboxes = this.page.locator('[role="checkbox"], input[type="checkbox"]');
    const checkboxCount = await checkboxes.count();
    
    if (checkboxCount === 0) {
      throw new Error('No control checkboxes found');
    }

    if (index >= checkboxCount) {
      throw new Error(`Control index ${index} out of range. Found ${checkboxCount} controls.`);
    }

    const checkbox = checkboxes.nth(index);
    const isChecked = await checkbox.isChecked().catch(() => false);
    
    if (!isChecked) {
      await checkbox.check();
      await this.page.waitForTimeout(this.WAIT_MEDIUM);
    }
  }

  /**
   * Submit control link - uses getByTestId for submit button
   */
  async submitControlLink() {
    // Wait for dialog to be fully loaded
    await this.page.waitForTimeout(this.WAIT_MEDIUM);

    // Try testid first (recommended)
    const testIdBtn = this.page.getByTestId('risk-control-dialog-submit-button');
    const testIdVisible = await testIdBtn.isVisible({ timeout: 2000 }).catch(() => false);

    if (testIdVisible) {
      const isEnabled = await testIdBtn.isEnabled().catch(() => false);
      if (isEnabled) {
        console.log('Using testid to submit control link...');
        await testIdBtn.scrollIntoViewIfNeeded();
        await this.page.waitForTimeout(this.WAIT_SMALL);
        await testIdBtn.click({ timeout: 5000 });
        await this.page.waitForTimeout(this.WAIT_AFTER_SUBMIT);

        const dialogStillVisible = await this.dialog.isVisible({ timeout: 3000 }).catch(() => false);
        if (!dialogStillVisible) {
          console.log('✅ Control link submitted successfully');
          return; // Success
        }
      }
    }

    // Fallback to text-based selectors (handles dynamic text)
    const submitSelectors = [
      'button:has-text("Link Control")',  // Matches "Link Control", "Link 1 Control", etc.
      'button:has-text("Link")',  // Generic fallback
      'button[type="submit"]:not(:disabled)',
    ];

    for (const selector of submitSelectors) {
      const submitBtn = this.page.locator(selector).first();
      const submitVisible = await submitBtn.isVisible({ timeout: 2000 }).catch(() => false);

      if (submitVisible) {
        const isEnabled = await submitBtn.isEnabled().catch(() => false);
        if (isEnabled) {
          try {
            console.log(`Using fallback selector "${selector}" to submit control link...`);
            await submitBtn.scrollIntoViewIfNeeded();
            await this.page.waitForTimeout(this.WAIT_SMALL);
            await submitBtn.click({ timeout: 5000 });
            await this.page.waitForTimeout(this.WAIT_AFTER_SUBMIT);

            const dialogStillVisible = await this.dialog.isVisible({ timeout: 3000 }).catch(() => false);
            if (!dialogStillVisible) {
              console.log('✅ Control link submitted successfully (fallback)');
              return; // Success
            }
          } catch (error) {
            // Try force click as fallback
            try {
              await submitBtn.click({ force: true });
              await this.page.waitForTimeout(this.WAIT_AFTER_SUBMIT);
              const dialogStillVisible = await this.dialog.isVisible({ timeout: 3000 }).catch(() => false);
              if (!dialogStillVisible) {
                console.log('✅ Control link submitted successfully (force click)');
                return; // Success
              }
            } catch (forceError) {
              console.log(`Failed to click submit button with selector "${selector}"`);
            }
          }
        }
      }
    }
    throw new Error('Could not submit control link - no enabled submit button found');
  }

  // ========================================
  // TREATMENTS TAB METHODS
  // ========================================

  /**
   * Open New Treatment form - uses testid
   */
  async openNewTreatmentForm() {
    // Ensure no dialogs are open first
    await this.ensureNoDialogOpen();
    await this.clickTab('Treatments');
    
    // Wait for tab content to load
    await this.page.waitForTimeout(this.WAIT_MEDIUM);
    
    const isVisible = await this.newTreatmentButton.isVisible({ timeout: 5000 }).catch(() => false);
    if (!isVisible) {
      throw new Error('New Treatment button not found');
    }
    
    await this.newTreatmentButton.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(this.WAIT_SMALL);
    await this.newTreatmentButton.click();
    await this.page.waitForTimeout(this.WAIT_MEDIUM);
    
    const dialogVisible = await this.isDialogVisible();
    if (!dialogVisible) {
      throw new Error('Treatment form did not open');
    }
  }

  /**
   * Fill treatment form
   */
  /**
   * Fill treatment form - with slower, more deliberate filling
   */
  async fillTreatmentForm(options: { title?: string; description?: string; strategy?: string; status?: string }) {
    // Wait for form to be fully ready
    await this.page.waitForTimeout(this.WAIT_MEDIUM);

    // Fill title - required field (slower typing)
    if (options.title) {
      const titleInput = this.page.getByLabel('Title').or(
        this.page.locator('input[name*="title"]').first()
      );
      await titleInput.waitFor({ state: 'visible', timeout: 5000 });
      await titleInput.clear({ timeout: 3000 });
      await this.page.waitForTimeout(this.WAIT_SMALL);
      // Type slowly to simulate human input
      await titleInput.type(options.title, { delay: 50 });
      await this.page.waitForTimeout(this.WAIT_MEDIUM);
      console.log(`✅ Filled treatment title: ${options.title}`);
    }

    // Fill description (slower typing)
    if (options.description) {
      await this.page.waitForTimeout(this.WAIT_SMALL);
      const descriptionTextarea = this.page.getByLabel('Description').or(
        this.page.locator('textarea[name*="description"]').first()
      );
      await descriptionTextarea.waitFor({ state: 'visible', timeout: 3000 }).catch(() => {});
      await descriptionTextarea.clear({ timeout: 3000 });
      await this.page.waitForTimeout(this.WAIT_SMALL);
      // Type slowly
      await descriptionTextarea.type(options.description, { delay: 50 });
      await this.page.waitForTimeout(this.WAIT_MEDIUM);
      console.log(`✅ Filled treatment description`);
    }

    // Fill strategy - required field (with delays)
    if (options.strategy) {
      try {
        await this.page.waitForTimeout(this.WAIT_SMALL);
        const strategySelect = this.page.getByLabel('Strategy').first();
        await strategySelect.waitFor({ state: 'visible', timeout: 5000 });
        await this.page.waitForTimeout(this.WAIT_MEDIUM);
        await strategySelect.click();
        await this.page.waitForTimeout(this.WAIT_MEDIUM);
        
        const option = this.page.getByRole('option', { name: new RegExp(options.strategy, 'i') }).first();
        await option.waitFor({ state: 'visible', timeout: 3000 });
        await this.page.waitForTimeout(this.WAIT_SMALL);
        await option.click();
        await this.page.waitForTimeout(this.WAIT_MEDIUM);
        console.log(`✅ Selected strategy: ${options.strategy}`);
      } catch (error: any) {
        console.log(`⚠️ Could not set strategy: ${error?.message}`);
      }
    }

    // Fill status - required field (with delays)
    if (options.status) {
      try {
        await this.page.waitForTimeout(this.WAIT_SMALL);
        const statusSelect = this.page.getByLabel('Status').first();
        await statusSelect.waitFor({ state: 'visible', timeout: 5000 });
        await this.page.waitForTimeout(this.WAIT_MEDIUM);
        await statusSelect.click();
        await this.page.waitForTimeout(this.WAIT_MEDIUM);
        
        const option = this.page.getByRole('option', { name: new RegExp(options.status, 'i') }).first();
        await option.waitFor({ state: 'visible', timeout: 3000 });
        await this.page.waitForTimeout(this.WAIT_SMALL);
        await option.click();
        await this.page.waitForTimeout(this.WAIT_MEDIUM);
        console.log(`✅ Selected status: ${options.status}`);
      } catch (error: any) {
        console.log(`⚠️ Could not set status: ${error?.message}`);
      }
    }
    
    // Final wait after all fields filled
    await this.page.waitForTimeout(this.WAIT_MEDIUM);
  }

  /**
   * Submit treatment form - using getByTestId (recommended Playwright method)
   */
  async submitTreatmentForm() {
    // Use getByTestId (recommended Playwright method) - preferred approach
    const submitButton = this.page.getByTestId('treatment-form-submit-create').or(
      this.page.getByTestId('treatment-form-submit-update')
    );
    
    const isVisible = await submitButton.isVisible({ timeout: 5000 }).catch(() => false);
    if (!isVisible) {
      throw new Error('Treatment form submit button not found (testid: treatment-form-submit-create or treatment-form-submit-update)');
    }
    
    await submitButton.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(this.WAIT_MEDIUM);
    
    // Wait for button to be enabled
    await submitButton.waitFor({ state: 'visible', timeout: 3000 });
    const isEnabled = await submitButton.isEnabled().catch(() => false);
    if (!isEnabled) {
      await this.page.waitForTimeout(this.WAIT_MEDIUM);
    }
    
    await submitButton.click();
    await this.page.waitForTimeout(this.WAIT_AFTER_SUBMIT);
    
    // Verify dialog is closed (form was submitted)
    const dialogStillVisible = await this.isDialogVisible();
    if (dialogStillVisible) {
      // Wait a bit more in case it's still closing
      await this.page.waitForTimeout(this.WAIT_MEDIUM * 2);
      const stillVisibleAfterWait = await this.isDialogVisible();
      if (stillVisibleAfterWait) {
        throw new Error('Treatment form did not close after submit');
      }
    }
    
    console.log('✅ Treatment form submitted successfully');
  }

  // ========================================
  // KRIS TAB METHODS
  // ========================================

  /**
   * Open Link KRI dialog
   * Uses structural selector - finds button next to "Key Risk Indicators" heading
   */
  async openLinkKriDialog() {
    await this.clickTab('KRIs');
    await this.page.waitForTimeout(this.WAIT_MEDIUM);
    
    // Find the flex container that has both the heading and button
    // The structure is: <div class="flex justify-between items-center">
    //   <h3>Key Risk Indicators</h3>
    //   <Button>Link KRI</Button>
    // </div>
    const flexContainer = this.page.locator('div.flex.justify-between.items-center').filter({
      has: this.page.locator('h3:has-text("Key Risk Indicators")')
    }).first();
    
    await flexContainer.waitFor({ state: 'visible', timeout: 5000 });
    const button = flexContainer.locator('button').first();
    
    await this.clickLinkButton(button, 'KRI');
  }

  /**
   * Select KRI checkbox by index
   */
  async selectKri(index: number = 0) {
    const checkboxes = this.page.locator('[role="checkbox"], input[type="checkbox"]');
    const checkboxCount = await checkboxes.count();
    
    if (checkboxCount === 0) {
      throw new Error('No KRI checkboxes found');
    }

    if (index >= checkboxCount) {
      throw new Error(`KRI index ${index} out of range. Found ${checkboxCount} KRIs.`);
    }

    const checkbox = checkboxes.nth(index);
    const isChecked = await checkbox.isChecked().catch(() => false);
    
    if (!isChecked) {
      await checkbox.check();
      await this.page.waitForTimeout(this.WAIT_MEDIUM);
    }
  }

  /**
   * Submit KRI link - uses getByTestId for submit button
   */
  async submitKriLink() {
    // Wait for dialog to be fully loaded
    await this.page.waitForTimeout(this.WAIT_MEDIUM);

    // Try testid first (recommended)
    const testIdBtn = this.page.getByTestId('risk-kri-dialog-submit-button');
    const testIdVisible = await testIdBtn.isVisible({ timeout: 2000 }).catch(() => false);

    if (testIdVisible) {
      const isEnabled = await testIdBtn.isEnabled().catch(() => false);
      if (isEnabled) {
        console.log('Using testid to submit KRI link...');
        await testIdBtn.scrollIntoViewIfNeeded();
        await this.page.waitForTimeout(this.WAIT_SMALL);
        await testIdBtn.click({ timeout: 5000 });
        await this.page.waitForTimeout(this.WAIT_AFTER_SUBMIT);

        const dialogStillVisible = await this.dialog.isVisible({ timeout: 3000 }).catch(() => false);
        if (!dialogStillVisible) {
          console.log('✅ KRI link submitted successfully');
          return; // Success
        }
      }
    }

    // Fallback to text-based selectors (handles dynamic text)
    const submitSelectors = [
      'button:has-text("Link KRI")',  // Matches "Link KRI", "Link 1 KRI", "Link 2 KRIs", etc.
      'button:has-text("Link")',  // Generic fallback
      'button[type="submit"]:not(:disabled)',
    ];

    for (const selector of submitSelectors) {
      const submitBtn = this.page.locator(selector).first();
      const submitVisible = await submitBtn.isVisible({ timeout: 2000 }).catch(() => false);

      if (submitVisible) {
        const isEnabled = await submitBtn.isEnabled().catch(() => false);
        if (isEnabled) {
          try {
            console.log(`Using fallback selector "${selector}" to submit KRI link...`);
            await submitBtn.scrollIntoViewIfNeeded();
            await this.page.waitForTimeout(this.WAIT_SMALL);
            await submitBtn.click({ timeout: 5000 });
            await this.page.waitForTimeout(this.WAIT_AFTER_SUBMIT);

            const dialogStillVisible = await this.dialog.isVisible({ timeout: 3000 }).catch(() => false);
            if (!dialogStillVisible) {
              console.log('✅ KRI link submitted successfully (fallback)');
              return; // Success
            }
          } catch (error) {
            // Try force click as fallback
            try {
              await submitBtn.click({ force: true });
              await this.page.waitForTimeout(this.WAIT_AFTER_SUBMIT);
              const dialogStillVisible = await this.dialog.isVisible({ timeout: 3000 }).catch(() => false);
              if (!dialogStillVisible) {
                console.log('✅ KRI link submitted successfully (force click)');
                return; // Success
              }
            } catch (forceError) {
              console.log(`Failed to click submit button with selector "${selector}"`);
            }
          }
        }
      }
    }
    throw new Error('Could not submit KRI link - no enabled submit button found');
  }

  // ========================================
  // ASSESSMENT REQUESTS METHODS
  // ========================================

  /**
   * Open Request Assessment form - uses testid
   */
  async openRequestAssessmentForm() {
    // Ensure no dialogs are open first
    await this.ensureNoDialogOpen();
    
    // Navigate to Assessments tab
    await this.clickTab('Assessments');
    
    // Wait for tab content to load
    await this.page.waitForTimeout(this.WAIT_MEDIUM);
    
    // Find and click the "Request Assessment" button using testid
    const requestButton = this.page.getByTestId('risk-details-request-assessment-button')
      .or(this.page.locator('button:has-text("Request Assessment")').first());
    
    const isVisible = await requestButton.isVisible({ timeout: 5000 }).catch(() => false);
    if (!isVisible) {
      throw new Error('Request Assessment button not found on Assessments tab');
    }
    
    await requestButton.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(this.WAIT_SMALL);
    await requestButton.click();
    await this.page.waitForTimeout(this.WAIT_MEDIUM);
    
    // Verify dialog/form is visible
    const dialogVisible = await this.isDialogVisible();
    if (!dialogVisible) {
      throw new Error('Assessment request form did not open');
    }
  }

  /**
   * Fill assessment request form
   * Note: assessment_type is required, priority defaults to "medium"
   * Fills all fields: assessment_type, priority, due_date, requested_for_id, justification, notes
   */
  async fillAssessmentRequestForm(options: { 
    assessmentType?: string; 
    priority?: string; 
    dueDate?: string;
    assignTo?: string;
    notes?: string; 
    justification?: string;
  }) {
    // Wait for form to be fully ready
    await this.page.waitForTimeout(this.WAIT_MEDIUM);

    // Fill assessment type (required field) - use getByLabel (recommended)
    try {
      // Check current value first
      const assessmentTypeSelect = this.page.locator('label:has-text("Assessment Type")').locator('..').locator('[role="combobox"], select').first();
      const currentValue = await assessmentTypeSelect.textContent().catch(() => '');
      
      // Only change if different from what we want
      const targetType = options.assessmentType || 'current';
      if (!currentValue.toLowerCase().includes(targetType.toLowerCase())) {
        const assessmentTypeLabel = this.page.getByLabel('Assessment Type');
        const typeLabelVisible = await assessmentTypeLabel.isVisible({ timeout: 3000 }).catch(() => false);
        
        if (typeLabelVisible) {
          await assessmentTypeLabel.click();
          await this.page.waitForTimeout(this.WAIT_MEDIUM);
          
          // Select based on value: "inherent", "current", or "target"
          let optionText = '';
          if (targetType.toLowerCase().includes('inherent')) {
            optionText = 'Inherent Risk';
          } else if (targetType.toLowerCase().includes('target')) {
            optionText = 'Target Risk';
          } else {
            optionText = 'Current Risk'; // default
          }
          
          const option = this.page.getByRole('option', { name: new RegExp(optionText, 'i') }).first();
          await option.waitFor({ state: 'visible', timeout: 3000 });
          await this.page.waitForTimeout(this.WAIT_SMALL);
          await option.click();
          await this.page.waitForTimeout(this.WAIT_MEDIUM);
          console.log(`✅ Selected assessment type: ${optionText}`);
        }
      } else {
        console.log(`✅ Assessment type already set: ${currentValue}`);
      }
    } catch (error: any) {
      console.log(`⚠️ Could not set assessment type: ${error?.message}`);
    }

    // Fill priority if provided (defaults to "medium") - with delays
    if (options.priority) {
      try {
        await this.page.waitForTimeout(this.WAIT_SMALL);
        const prioritySelect = this.page.getByLabel('Priority');
        const priorityVisible = await prioritySelect.isVisible({ timeout: 5000 }).catch(() => false);
        
        if (priorityVisible) {
          await prioritySelect.click();
          await this.page.waitForTimeout(this.WAIT_MEDIUM);
          
          const priorityOption = this.page.getByRole('option', { name: new RegExp(options.priority, 'i') }).first();
          await priorityOption.waitFor({ state: 'visible', timeout: 3000 });
          await this.page.waitForTimeout(this.WAIT_SMALL);
          await priorityOption.click();
          await this.page.waitForTimeout(this.WAIT_MEDIUM);
          console.log(`✅ Selected priority: ${options.priority}`);
        }
      } catch (error: any) {
        console.log(`⚠️ Could not set priority: ${error?.message}`);
      }
    }

    // Fill justification if provided (slower typing)
    if (options.justification) {
      try {
        await this.page.waitForTimeout(this.WAIT_SMALL);
        const justificationField = this.page.getByLabel('Justification').or(
          this.page.locator('textarea[name*="justification"]').first()
        );
        const justificationExists = await justificationField.isVisible({ timeout: 3000 }).catch(() => false);
        if (justificationExists) {
          await justificationField.clear({ timeout: 3000 });
          await this.page.waitForTimeout(this.WAIT_SMALL);
          // Type slowly
          await justificationField.type(options.justification, { delay: 50 });
          await this.page.waitForTimeout(this.WAIT_MEDIUM);
          console.log('✅ Filled justification');
        }
      } catch (error: any) {
        console.log(`⚠️ Could not fill justification: ${error?.message}`);
      }
    }

    // Fill due date if provided
    if (options.dueDate) {
      try {
        await this.page.waitForTimeout(this.WAIT_SMALL);
        const dueDateField = this.page.getByLabel('Due Date').or(
          this.page.locator('input[type="date"]').first()
        );
        const dueDateExists = await dueDateField.isVisible({ timeout: 3000 }).catch(() => false);
        if (dueDateExists) {
          // Date fields can use fill() directly (no typing simulation needed)
          await dueDateField.fill(options.dueDate);
          await this.page.waitForTimeout(this.WAIT_MEDIUM);
          console.log(`✅ Filled due date: ${options.dueDate}`);
        }
      } catch (error: any) {
        console.log(`⚠️ Could not fill due date: ${error?.message}`);
      }
    } else {
      // Set a default due date (30 days from now)
      try {
        await this.page.waitForTimeout(this.WAIT_SMALL);
        const dueDateField = this.page.getByLabel('Due Date').or(
          this.page.locator('input[type="date"]').first()
        );
        const dueDateExists = await dueDateField.isVisible({ timeout: 3000 }).catch(() => false);
        if (dueDateExists) {
          const futureDate = new Date();
          futureDate.setDate(futureDate.getDate() + 30);
          const dateString = futureDate.toISOString().split('T')[0];
          // Date fields can use fill() directly (no typing simulation needed)
          await dueDateField.fill(dateString);
          await this.page.waitForTimeout(this.WAIT_MEDIUM);
          console.log(`✅ Filled due date: ${dateString}`);
        }
      } catch (error: any) {
        console.log(`⚠️ Could not fill due date: ${error?.message}`);
      }
    }

    // Fill "Assign To" (requested_for_id) if provided (with delays)
    if (options.assignTo) {
      try {
        await this.page.waitForTimeout(this.WAIT_SMALL);
        const assignToSelect = this.page.getByLabel('Assign To');
        const assignToExists = await assignToSelect.isVisible({ timeout: 3000 }).catch(() => false);
        if (assignToExists) {
          await assignToSelect.click();
          await this.page.waitForTimeout(this.WAIT_MEDIUM);
          
          // Try to find user by name or email
          const userOption = this.page.getByRole('option', { name: new RegExp(options.assignTo, 'i') }).first();
          const optionVisible = await userOption.isVisible({ timeout: 3000 }).catch(() => false);
          
          if (optionVisible) {
            await userOption.waitFor({ state: 'visible', timeout: 3000 });
            await this.page.waitForTimeout(this.WAIT_SMALL);
            await userOption.click();
            await this.page.waitForTimeout(this.WAIT_MEDIUM);
            console.log(`✅ Selected assignee: ${options.assignTo}`);
          } else {
            // Try selecting first available user (skip "None" option)
            const allOptions = await this.page.getByRole('option').allTextContents();
            const userOptions = allOptions.filter(opt => opt.toLowerCase() !== 'none (unassigned)');
            if (userOptions.length > 0) {
              const firstUserOption = this.page.getByRole('option', { name: userOptions[0] }).first();
              await firstUserOption.waitFor({ state: 'visible', timeout: 3000 });
              await this.page.waitForTimeout(this.WAIT_SMALL);
              await firstUserOption.click();
              await this.page.waitForTimeout(this.WAIT_MEDIUM);
              console.log(`✅ Selected first available user: ${userOptions[0]}`);
            }
          }
        }
      } catch (error: any) {
        console.log(`⚠️ Could not assign to user: ${error?.message}`);
      }
    }

    // Fill notes if provided (slower typing)
    if (options.notes) {
      try {
        await this.page.waitForTimeout(this.WAIT_SMALL);
        const notesField = this.page.getByLabel('Notes').or(
          this.page.locator('textarea[name*="notes"]').first()
        );
        const notesExists = await notesField.isVisible({ timeout: 3000 }).catch(() => false);
        if (notesExists) {
          await notesField.clear({ timeout: 3000 });
          await this.page.waitForTimeout(this.WAIT_SMALL);
          // Type slowly
          await notesField.type(options.notes, { delay: 50 });
          await this.page.waitForTimeout(this.WAIT_MEDIUM);
          console.log('✅ Filled assessment request notes');
        }
      } catch (error: any) {
        console.log(`⚠️ Could not fill notes: ${error?.message}`);
      }
    }
    
    // Final wait after all fields filled
    await this.page.waitForTimeout(this.WAIT_MEDIUM);
  }

  /**
   * Submit assessment request form
   */
  async submitAssessmentRequestForm() {
    // Wait for dialog overlay to be fully loaded
    await this.page.waitForTimeout(this.WAIT_MEDIUM);
    
    // Check for form validation errors before submitting
    const errorLocators = [
      this.page.locator('[role="alert"]'),
      this.page.locator('.text-destructive'),
      this.page.locator('[class*="error"]'),
      this.page.locator('[class*="invalid"]'),
      this.page.locator('p[class*="text-sm font-medium text-destructive"]'), // Form error messages
    ];
    
    for (const errorLocator of errorLocators) {
      const errorCount = await errorLocator.count();
      if (errorCount > 0) {
        const errorTexts = await errorLocator.allTextContents();
        if (errorTexts.length > 0 && errorTexts[0].trim()) {
          console.log(`⚠️ Form validation errors found: ${errorTexts.join(', ')}`);
        }
      }
    }
    
    // Use getByTestId (recommended Playwright method) - preferred approach
    const submitButton = this.page.getByTestId('assessment-request-form-submit-create').or(
      this.page.getByTestId('assessment-request-form-submit-update')
    );

    const isVisible = await submitButton.isVisible({ timeout: 5000 }).catch(() => false);
    if (!isVisible) {
      throw new Error('Assessment request submit button not found (testid: assessment-request-form-submit-create or assessment-request-form-submit-update)');
    }

    // Use getByTestId button click (recommended approach)
    await submitButton.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(this.WAIT_MEDIUM);
    
    // Wait for button to be visible and enabled
    await submitButton.waitFor({ state: 'visible', timeout: 3000 });
    const isEnabled = await submitButton.isEnabled().catch(() => false);
    if (!isEnabled) {
      // Check for validation error messages
      const validationErrors = await this.page.locator('[class*="error"], [role="alert"]').allTextContents();
      if (validationErrors.length > 0) {
        throw new Error(`Assessment request submit button is disabled - validation errors: ${validationErrors.join(', ')}`);
      }
      await this.page.waitForTimeout(this.WAIT_MEDIUM);
    }
    
    await submitButton.click({ timeout: 5000 });
    await this.page.waitForTimeout(this.WAIT_AFTER_SUBMIT);
    
    // Wait for success message or dialog to close
    // The form shows a toast on success, then closes the dialog
    // Also wait for any success toast/alert
    try {
      // Wait for success message (toast might appear briefly)
      await this.page.waitForSelector('text=/success|created|submitted/i', { timeout: 3000, state: 'visible' }).catch(() => {});
    } catch {
      // Success message might not be visible, continue
    }
    
    await this.page.waitForTimeout(this.WAIT_MEDIUM);
    
    // Verify dialog is closed
    const dialogStillVisible = await this.isDialogVisible();
    if (dialogStillVisible) {
      // Wait a bit more in case it's still closing (toast might take time)
      await this.page.waitForTimeout(this.WAIT_MEDIUM);
      const stillVisibleAfterWait = await this.isDialogVisible();
      if (stillVisibleAfterWait) {
        // Check if there's an error message visible in the form
        const formErrorVisible = await this.page.locator('form [role="alert"], form .text-destructive, form [class*="error"]').first().isVisible({ timeout: 2000 }).catch(() => false);
        if (formErrorVisible) {
          const errorText = await this.page.locator('form [role="alert"], form .text-destructive').first().textContent().catch(() => 'Unknown error');
          throw new Error(`Assessment request submission failed - validation error: ${errorText}`);
        }
        
        // Check if button is still enabled (form might be processing)
        const buttonStillEnabled = await submitButton.isEnabled().catch(() => false);
        if (!buttonStillEnabled) {
          // Button is disabled, might be processing
          await this.page.waitForTimeout(this.WAIT_MEDIUM * 2);
          const dialogStillOpen = await this.isDialogVisible();
          if (!dialogStillOpen) {
            console.log('✅ Dialog closed after waiting');
            return;
          }
        }
        
        throw new Error('Assessment request form did not close after submit');
      }
    }
    
    console.log('✅ Assessment request submitted successfully');
  }
}



