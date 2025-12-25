import { test } from './fixtures/auth-storage';
import { expect } from '@playwright/test';

test('debug page content', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/en/dashboard/governance/policies');
    await authenticatedPage.waitForLoadState('domcontentloaded');
    await authenticatedPage.waitForTimeout(5000);

    const h1 = await authenticatedPage.locator('h1').allTextContents();
    console.log('H1 contents:', h1);

    const bodyText = await authenticatedPage.innerText('body');
    console.log('Body snippet:', bodyText.substring(0, 1000));

    const buttons = await authenticatedPage.locator('button').allTextContents();
    console.log('Buttons:', buttons);

    await authenticatedPage.screenshot({ path: 'debug-policies.png' });
});
