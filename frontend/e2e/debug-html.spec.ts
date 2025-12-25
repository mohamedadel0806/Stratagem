import { test } from './fixtures/auth-storage';
import { expect } from '@playwright/test';

test('debug page content after login', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/en/dashboard/governance/policies');
    await authenticatedPage.waitForLoadState('networkidle');
    await authenticatedPage.waitForTimeout(5000);

    console.log('URL:', authenticatedPage.url());
    const content = await authenticatedPage.content();
    console.log('Content Snippet:', content.substring(content.indexOf('<main'), content.indexOf('</main>') + 7));
});
