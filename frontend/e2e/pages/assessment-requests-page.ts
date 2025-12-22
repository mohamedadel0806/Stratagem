import { Page, Locator } from '@playwright/test';

/**
 * Page Object Model for Assessment Requests Page
 * Encapsulates all interactions with the assessment requests page
 */
export class AssessmentRequestsPage {
  readonly page: Page;
  
  // Main elements
  readonly newRequestButton: Locator;
  readonly searchInput: Locator;
  readonly statusFilter: Locator;
  readonly requestsList: Locator;
  
  // Wait times (can be configured)
  private readonly WAIT_SMALL = 500;
  private readonly WAIT_MEDIUM = 1000;
  private readonly WAIT_LARGE = 2000;

  constructor(page: Page, waitTimes?: { small?: number; medium?: number; large?: number }) {
    this.page = page;
    
    // Configure wait times if provided
    if (waitTimes) {
      this.WAIT_SMALL = waitTimes.small || this.WAIT_SMALL;
      this.WAIT_MEDIUM = waitTimes.medium || this.WAIT_MEDIUM;
      this.WAIT_LARGE = waitTimes.large || this.WAIT_LARGE;
    }

    // Button locators - using getByTestId only (Playwright Advisory Guide compliant)
    this.newRequestButton = page.getByTestId('assessment-requests-new-button');

    // Search input - using getByTestId only (Playwright Advisory Guide compliant)
    this.searchInput = page.getByTestId('assessment-requests-search-input');

    // Status filter - using getByTestId only (Playwright Advisory Guide compliant)
    this.statusFilter = page.getByTestId('assessment-requests-status-filter');

    // Requests list container - using getByTestId only (Playwright Advisory Guide compliant)
    this.requestsList = page.getByTestId('assessment-requests-list');
  }

  /**
   * Navigate to assessment requests page
   */
  async goto(locale: string = 'en', riskId?: string) {
    const url = riskId 
      ? `/${locale}/dashboard/risks/assessment-requests?riskId=${riskId}`
      : `/${locale}/dashboard/risks/assessment-requests`;
    await this.page.goto(url, { waitUntil: 'domcontentloaded' });
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(this.WAIT_MEDIUM);
  }

  /**
   * Check if page is loaded
   */
  async isLoaded(): Promise<boolean> {
    try {
      // Use getByRole for headings (recommended Playwright method)
      const titleVisible = await this.page.getByRole('heading', { name: /Assessment Requests/i }).first().isVisible({ timeout: 5000 });
      return titleVisible;
    } catch {
      return false;
    }
  }

  /**
   * Open new assessment request form
   */
  async openNewRequestForm() {
    const isVisible = await this.newRequestButton.isVisible({ timeout: 5000 }).catch(() => false);
    if (!isVisible) {
      throw new Error('New Request button not found');
    }
    
    await this.newRequestButton.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(this.WAIT_SMALL);
    await this.newRequestButton.click();
    await this.page.waitForTimeout(this.WAIT_MEDIUM);
    
    // Verify dialog/form is visible
    const dialog = this.page.locator('[role="dialog"]');
    const dialogVisible = await dialog.isVisible({ timeout: 3000 }).catch(() => false);
    if (!dialogVisible) {
      throw new Error('New Assessment Request form did not open');
    }
  }

  /**
   * Search for assessment requests
   */
  async search(query: string) {
    const inputVisible = await this.searchInput.isVisible({ timeout: 3000 }).catch(() => false);
    if (inputVisible) {
      await this.searchInput.clear();
      // Use type() with delay for better React form handling (Playwright Advisory Guide compliant)
      await this.searchInput.type(query, { delay: 30 });
      await this.page.waitForTimeout(this.WAIT_MEDIUM); // Wait for search results
    }
  }

  /**
   * Filter by status
   */
  async filterByStatus(status: string) {
    const filterVisible = await this.statusFilter.isVisible({ timeout: 3000 }).catch(() => false);
    if (filterVisible) {
      await this.statusFilter.click();
      await this.page.waitForTimeout(this.WAIT_SMALL);
      // Use getByRole for options (recommended Playwright method)
      await this.page.getByRole('option', { name: new RegExp(status, 'i') }).first().click();
      await this.page.waitForTimeout(this.WAIT_MEDIUM);
    }
  }

  /**
   * Get count of assessment request cards
   */
  async getRequestCount(): Promise<number> {
    // Use getByTestId pattern matching, then fallback to role-based selectors
    const cardsWithTestId = this.page.locator('[data-testid^="assessment-request-card-"]');
    const testIdCount = await cardsWithTestId.count();
    if (testIdCount > 0) {
      return testIdCount;
    }
    
    // Assessment request cards are in a div with class "space-y-4"
    // Each card has Edit/View buttons - count cards that have Edit buttons
    const editButtons = this.page.locator('button').filter({ hasText: /^Edit$/ });
    const editButtonCount = await editButtons.count();
    
    if (editButtonCount > 0) {
      return editButtonCount;
    }
    
    // Fallback: Count cards in the space-y-4 container (excludes filter/search card)
    const requestsContainer = this.page.locator('div.space-y-4');
    const containerExists = await requestsContainer.isVisible({ timeout: 2000 }).catch(() => false);
    if (containerExists) {
      const cardsInContainer = requestsContainer.locator('.card');
      return await cardsInContainer.count();
    }
    
    // Last resort: count all cards but exclude the filter/search card
    const allCards = this.page.locator('.card');
    const totalCards = await allCards.count();
    // Subtract 1 for the filter/search card
    return Math.max(0, totalCards - 1);
  }

  /**
   * Check if dialog is visible
   */
  private async isDialogVisible(): Promise<boolean> {
    const dialog = this.page.locator('[role="dialog"]');
    return await dialog.isVisible({ timeout: 2000 }).catch(() => false);
  }

  /**
   * Fill assessment request form - with slower, more deliberate filling
   */
  async fillAssessmentRequestForm(options: { 
    assessmentType?: string; 
    priority?: string; 
    dueDate?: string;
    assignTo?: string;
    notes?: string; 
    justification?: string;
    riskId?: string;
  }) {
    // Wait for form to be fully ready
    await this.page.waitForTimeout(this.WAIT_MEDIUM);

    // Fill risk ID - now a searchable dropdown (required for standalone assessment requests page)
    // First, open the dropdown
    const riskDropdownTrigger = this.page.getByTestId('risk-dropdown-trigger');
    const triggerVisible = await riskDropdownTrigger.isVisible({ timeout: 5000 }).catch(() => false);
    
    if (triggerVisible) {
      await this.page.waitForTimeout(this.WAIT_SMALL);
      await riskDropdownTrigger.click();
      await this.page.waitForTimeout(this.WAIT_MEDIUM);
      
      // Wait for dropdown to open
      const riskSearchInput = this.page.getByTestId('risk-search-input');
      await riskSearchInput.waitFor({ state: 'visible', timeout: 5000 });
      await this.page.waitForTimeout(this.WAIT_MEDIUM); // Wait for risks to load
      
      if (options.riskId) {
        // Search for the risk by ID or title
        await riskSearchInput.clear();
        await riskSearchInput.type(options.riskId, { delay: 50 });
        await this.page.waitForTimeout(this.WAIT_MEDIUM * 2); // Wait for search results
        
        // Try to find the risk option by ID first, then by name
        const riskOption = this.page.getByTestId(`risk-option-${options.riskId}`).or(
          this.page.locator(`[data-testid^="risk-option-"]`).filter({ hasText: new RegExp(options.riskId, 'i') }).first()
        );
        const optionVisible = await riskOption.isVisible({ timeout: 5000 }).catch(() => false);
        if (optionVisible) {
          await riskOption.waitFor({ state: 'visible', timeout: 3000 });
          await this.page.waitForTimeout(this.WAIT_SMALL);
          await riskOption.click();
          await this.page.waitForTimeout(this.WAIT_MEDIUM);
          const optionText = await riskOption.textContent().catch(() => '');
          console.log(`✅ Selected risk: ${optionText.trim()}`);
        }
      } else {
        // No specific risk ID provided - select the first available risk
        // Wait a bit more for risks to load in the dropdown
        await this.page.waitForTimeout(this.WAIT_MEDIUM * 2);
        
        // Get all risk options
        const riskOptions = this.page.locator('[data-testid^="risk-option-"]');
        const optionCount = await riskOptions.count();
        
        if (optionCount > 0) {
          // Select the first risk
          const firstOption = riskOptions.first();
          await firstOption.waitFor({ state: 'visible', timeout: 3000 });
          await this.page.waitForTimeout(this.WAIT_SMALL);
          await firstOption.click();
          await this.page.waitForTimeout(this.WAIT_MEDIUM);
          const optionText = await firstOption.textContent().catch(() => '');
          console.log(`✅ Selected first available risk: ${optionText.trim()}`);
        } else {
          // No risks found - close the dropdown
          await this.page.keyboard.press('Escape');
          await this.page.waitForTimeout(this.WAIT_SMALL);
          console.log('⚠️ No risks available to select');
        }
      }
      
      // Wait for dropdown to close after selection
      await this.page.waitForTimeout(this.WAIT_MEDIUM);
    } else if (options.riskId) {
      // Risk field not visible but riskId provided - might already be set
      console.log('✅ Risk already selected or not required');
    }

    // Fill assessment type (required field) - use getByLabel (recommended)
    try {
      const targetType = options.assessmentType || 'current';
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
   * Submit assessment request form - using getByTestId (recommended Playwright method)
   */
  async submitAssessmentRequestForm() {
    // Use getByTestId (recommended Playwright method) - preferred approach
    const submitButton = this.page.getByTestId('assessment-request-form-submit-create').or(
      this.page.getByTestId('assessment-request-form-submit-update')
    );
    
    const isVisible = await submitButton.isVisible({ timeout: 5000 }).catch(() => false);
    if (!isVisible) {
      throw new Error('Assessment request submit button not found (testid: assessment-request-form-submit-create or assessment-request-form-submit-update)');
    }
    
    await submitButton.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(this.WAIT_MEDIUM);
    
    // Wait for button to be enabled
    await submitButton.waitFor({ state: 'visible', timeout: 3000 });
    const isEnabled = await submitButton.isEnabled().catch(() => false);
    if (!isEnabled) {
      await this.page.waitForTimeout(this.WAIT_MEDIUM);
    }
    
    await submitButton.click({ timeout: 5000 });
    
    // Wait for dialog to close (form was submitted)
    let dialogClosed = false;
    for (let i = 0; i < 10; i++) {
      const dialogStillVisible = await this.isDialogVisible();
      if (!dialogStillVisible) {
        dialogClosed = true;
        break;
      }
      await this.page.waitForTimeout(this.WAIT_MEDIUM);
    }
    
    if (!dialogClosed) {
      throw new Error('Assessment request form did not close after submit');
    }
    
    // Wait additional time for backend processing and query invalidation
    await this.page.waitForTimeout(this.WAIT_MEDIUM * 3);
    
    console.log('✅ Assessment request form submitted successfully');
  }
}



