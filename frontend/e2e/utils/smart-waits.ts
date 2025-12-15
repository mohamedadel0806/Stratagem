import { Page } from '@playwright/test';

/**
 * Smart wait utilities that wait for page rendering rather than fixed timeouts
 */

/**
 * Wait for page to be fully loaded and interactive
 */
export async function waitForPageLoad(page: Page, timeout: number = 30000): Promise<void> {
  await page.waitForLoadState('domcontentloaded');
  await page.waitForLoadState('networkidle');

  // Wait for React hydration to complete
  await page.waitForFunction(() => {
    return document.readyState === 'complete' &&
           !document.querySelector('.loading, .spinner, [data-testid="loading"]') &&
           document.body.children.length > 0;
  }, { timeout });
}

/**
 * Wait for table content to load (not just skeleton)
 */
export async function waitForTableContent(page: Page, timeout: number = 30000): Promise<void> {
  await page.waitForSelector('table tbody tr, [data-testid="assets-table"], .data-table, .table-wrapper', {
    state: 'visible',
    timeout
  });

  // Wait for actual content, not loading skeleton
  await page.waitForFunction(() => {
    const tableRows = document.querySelectorAll('table tbody tr');
    return tableRows.length > 0 && !Array.from(tableRows).every(row =>
      row.textContent?.includes('Loading') || row.classList.contains('skeleton')
    );
  }, { timeout });
}

/**
 * Wait for assets content to load (cards or table)
 */
export async function waitForAssetsContent(page: Page, timeout: number = 30000): Promise<void> {
  // Try card layout first (physical assets use cards)
  await page.waitForSelector('.grid > div > div > .card, .grid .card, .grid [role="button"]', {
    state: 'visible',
    timeout
  }).catch(async () => {
    // Fallback to table layout
    return page.waitForSelector('table tbody tr, [data-testid="assets-table"], .data-table', {
      state: 'visible',
      timeout
    });
  });

  // Wait for actual content, not loading skeleton
  await page.waitForFunction(() => {
    // Check for cards
    const cards = document.querySelectorAll('.grid > div > div > .card, .grid .card, .grid [role="button"]');
    if (cards.length > 0) {
      return !Array.from(cards).every(card =>
        card.textContent?.includes('Loading') || card.classList.contains('skeleton') || card.classList.contains('loading')
      );
    }

    // Check for table rows
    const tableRows = document.querySelectorAll('table tbody tr');
    if (tableRows.length > 0) {
      return !Array.from(tableRows).every(row =>
        row.textContent?.includes('Loading') || row.classList.contains('skeleton')
      );
    }

    // If no cards or rows, check for empty state message
    return document.body.textContent?.includes('No') && document.body.textContent?.includes('found');
  }, { timeout });
}

/**
 * Wait for form to be ready and interactive
 */
export async function waitForFormReady(page: Page, timeout: number = 15000): Promise<void> {
  await page.waitForSelector('form, [role="dialog"], .modal', {
    state: 'visible',
    timeout
  });

  // Wait for form to be interactive (not just visible)
  await page.waitForFunction(() => {
    const form = document.querySelector('form, [role="dialog"], .modal');
    return form &&
           !form.classList.contains('loading') &&
           !form.querySelector('.loading, .spinner') &&
           getComputedStyle(form).display !== 'none' &&
           getComputedStyle(form).visibility !== 'hidden';
  }, { timeout });
}

/**
 * Wait for button to be clickable
 */
export async function waitForButtonClickable(page: Page, selector: string, timeout: number = 10000): Promise<void> {
  const button = page.locator(selector).first();
  await button.waitFor({ state: 'visible', timeout });
  await button.waitFor({ state: 'enabled', timeout });
}

/**
 * Wait for element to appear on page with content
 */
export async function waitForElementWithContent(page: Page, selector: string, content: string, timeout: number = 15000): Promise<void> {
  await page.waitForFunction((sel, cont) => {
    const element = document.querySelector(sel);
    return element && element.textContent && element.textContent.includes(cont);
  }, { selector, content, timeout });
}

/**
 * Wait for navigation to complete and page to be ready
 */
export async function waitForNavigationReady(page: Page, timeout: number = 30000): Promise<void> {
  await page.waitForLoadState('networkidle', { timeout });

  // Additional check that page is interactive
  await page.waitForFunction(() => {
    return document.readyState === 'complete' &&
           !document.querySelector('[data-testid="loading"], .loading, .spinner');
  }, { timeout });
}

/**
 * Wait for success message or toast notification
 */
export async function waitForSuccessMessage(page: Page, timeout: number = 10000): Promise<void> {
  const successSelectors = [
    '.toast[role="status"]',
    '[role="alert"].success',
    '[data-testid="success-message"]',
    'text=Success',
    'text=Created',
    'text=Updated',
    'text=Deleted'
  ];

  for (const selector of successSelectors) {
    try {
      await page.waitForSelector(selector, {
        state: 'visible',
        timeout: timeout / successSelectors.length
      });
      return;
    } catch {
      // Continue to next selector
    }
  }
}

/**
 * Wait for error message to appear
 */
export async function waitForErrorMessage(page: Page, timeout: number = 10000): Promise<void> {
  const errorSelectors = [
    '.toast.error',
    '[role="alert"].error',
    '[data-testid="error-message"]',
    '.text-red-500',
    '.text-red-800',
    'text=Error',
    'text=Failed'
  ];

  for (const selector of errorSelectors) {
    try {
      await page.waitForSelector(selector, {
        state: 'visible',
        timeout: timeout / errorSelectors.length
      });
      return;
    } catch {
      // Continue to next selector
    }
  }
}

/**
 * Wait for element to stop being in loading state
 */
export async function waitForElementStable(page: Page, selector: string, timeout: number = 10000): Promise<void> {
  const element = page.locator(selector).first();
  await element.waitFor({ state: 'visible', timeout });

  await page.waitForFunction((sel) => {
    const el = document.querySelector(sel);
    return el &&
           !el.classList.contains('loading') &&
           !el.classList.contains('disabled') &&
           !el.querySelector('.loading, .spinner');
  }, { selector, timeout });
}

export default {
  waitForPageLoad,
  waitForTableContent,
  waitForFormReady,
  waitForButtonClickable,
  waitForElementWithContent,
  waitForNavigationReady,
  waitForSuccessMessage,
  waitForErrorMessage,
  waitForElementStable
};