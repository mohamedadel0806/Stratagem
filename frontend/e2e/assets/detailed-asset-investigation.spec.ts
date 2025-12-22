import { test } from '../fixtures/auth';
import { expect } from '@playwright/test';

test.describe('Detailed Asset Investigation', () => {
  test('should investigate the existing asset ID in detail', async ({ page }) => {
    console.log('🔍 DETAILED INVESTIGATION OF: 189d91ee-01dd-46a4-b6ef-76ccac11c60d');

    // Set up detailed monitoring
    const networkLogs: any[] = [];
    const consoleLogs: any[] = [];
    const jsErrors: any[] = [];

    // Monitor all network requests
    page.on('request', request => {
      const url = request.url();
      if (url.includes('assets') || url.includes('api/')) {
        networkLogs.push({
          type: 'request',
          url: url,
          method: request.method(),
          headers: request.headers(),
          timestamp: Date.now()
        });
        console.log(`📡 REQUEST: ${request.method()} ${url}`);
      }
    });

    page.on('response', response => {
      const url = response.url();
      if (url.includes('assets') || url.includes('api/')) {
        response.text().then(body => {
          networkLogs.push({
            type: 'response',
            url: url,
            status: response.status(),
            statusText: response.statusText(),
            headers: response.headers(),
            body: body.substring(0, 1000), // First 1000 chars
            timestamp: Date.now()
          });
          console.log(`📡 RESPONSE: ${response.status()} ${url} - ${response.statusText()}`);
        }).catch(() => {
          networkLogs.push({
            type: 'response',
            url: url,
            status: response.status(),
            statusText: response.statusText(),
            error: 'Could not read response body',
            timestamp: Date.now()
          });
        });
      }
    });

    // Monitor console
    page.on('console', msg => {
      consoleLogs.push({
        type: msg.type(),
        text: msg.text(),
        timestamp: Date.now()
      });

      if (msg.type() === 'error') {
        console.log(`🚨 ERROR: ${msg.text()}`);
        jsErrors.push(msg.text());
      } else if (msg.type() === 'warning') {
        console.log(`⚠️ WARNING: ${msg.text()}`);
      }
    });

    // Monitor page errors
    page.on('pageerror', error => {
      console.log(`💥 PAGE ERROR: ${error.message}`);
      jsErrors.push(`Page Error: ${error.message}`);
    });

    // Navigate to the asset URL
    console.log('📍 Navigating to asset URL...');
    await page.goto('http://localhost:3000/en/dashboard/assets/information/189d91ee-01dd-46a4-b6ef-76ccac11c60d');

    // Wait for initial load
    await page.waitForTimeout(3000);

    // Check if we're logged in properly
    console.log('🔍 Checking authentication status...');
    const isAuthenticated = await page.evaluate(() => {
      // Check for common auth indicators
      const hasToken = !!localStorage.getItem('token');
      const hasUser = !!localStorage.getItem('user');
      const hasSession = !!document.cookie.includes('session');
      const hasLogoutButton = !!document.querySelector('button:has-text("Logout")');

      return {
        hasToken,
        hasUser,
        hasSession,
        hasLogoutButton,
        currentPath: window.location.pathname
      };
    });

    console.log(`🔐 Authentication Status:`, isAuthenticated);

    // Wait longer for potential API calls
    console.log('⏳ Waiting for API calls to complete...');
    await page.waitForTimeout(10000);

    // Take screenshot of current state
    await page.screenshot({
      path: 'test-results/detailed-investigation-current-state.png',
      fullPage: true
    });

    // Check page content in detail
    console.log('🔍 Analyzing page content...');

    const pageAnalysis = await page.evaluate(() => {
      // Check if we can see the asset not found message
      const assetNotFound = document.body.innerText.includes('Asset not found');

      // Check for any error messages
      const errorMessages = Array.from(document.querySelectorAll('.error, .text-red-500, [role="alert"]'))
        .map(el => el.innerText.trim())
        .filter(text => text.length > 0);

      // Check for loading indicators
      const loadingMessages = Array.from(document.querySelectorAll('*'))
        .filter(el => el.innerText && el.innerText.toLowerCase().includes('loading'))
        .map(el => el.innerText.trim());

      // Check if tabs exist
      const tabs = Array.from(document.querySelectorAll('[data-testid*="tab"], [role="tab"]'))
        .map(el => ({
          testId: el.getAttribute('data-testid'),
          text: el.innerText.trim(),
          visible: el.offsetParent !== null
        }));

      // Check for asset name
      const h1Elements = Array.from(document.querySelectorAll('h1')).map(el => el.innerText.trim());

      // Check page title
      const title = document.title;

      return {
        assetNotFound,
        errorMessages,
        loadingMessages,
        tabs,
        h1Elements,
        title,
        bodyText: document.body.innerText.substring(0, 500)
      };
    });

    console.log('📊 Page Analysis Results:');
    console.log(`  Asset Not Found: ${pageAnalysis.assetNotFound}`);
    console.log(`  Error Messages: ${pageAnalysis.errorMessages.length}`);
    console.log(`  Loading Messages: ${pageAnalysis.loadingMessages.length}`);
    console.log(`  Tabs Found: ${pageAnalysis.tabs.length}`);
    console.log(`  H1 Elements: ${pageAnalysis.h1Elements.length}`);
    console.log(`  Page Title: ${pageAnalysis.title}`);

    pageAnalysis.errorMessages.forEach((error, i) => {
      console.log(`    Error ${i}: ${error}`);
    });

    pageAnalysis.tabs.forEach((tab, i) => {
      console.log(`    Tab ${i}: testId="${tab.testId}" text="${tab.text}" visible=${tab.visible}`);
    });

    // Try to manually trigger React Query
    console.log('🔄 Attempting to manually trigger data fetch...');

    try {
      const manualFetch = await page.evaluate(async () => {
        // Try to fetch the asset data directly
        const assetId = '189d91ee-01dd-46a4-b6ef-76ccac11c60d';

        try {
          const response = await fetch(`/api/assets/information/${assetId}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            }
          });

          return {
            status: response.status,
            statusText: response.statusText,
            ok: response.ok,
            headers: Object.fromEntries(response.headers.entries())
          };
        } catch (error) {
          return {
            error: error.message
          };
        }
      });

      console.log('📡 Manual Fetch Result:', manualFetch);
    } catch (error) {
      console.log(`❌ Manual fetch failed: ${error.message}`);
    }

    // Check React DevTools for component state
    try {
      const reactState = await page.evaluate(() => {
        // Look for React component instance
        const reactRoot = document.querySelector('#__next');
        if (reactRoot && (reactRoot as any)._reactRootContainer) {
          const root = (reactRoot as any)._reactRootContainer._internalRoot;
          if (root && root.current) {
            const component = root.current.child;
            if (component && component.memoizedState) {
              return {
                hasState: true,
                stateKeys: Object.keys(component.memoizedState)
              };
            }
          }
        }
        return { hasState: false };
      });

      console.log('⚛️ React Component State:', reactState);
    } catch (error) {
      console.log(`⚛️ Could not read React state: ${error.message}`);
    }

    // Final screenshot
    await page.screenshot({
      path: 'test-results/detailed-investigation-final.png',
      fullPage: true
    });

    // Summary
    console.log('🎯 DETAILED INVESTIGATION COMPLETE');
    console.log(`📊 SUMMARY:`);
    console.log(`📁 Network Logs: ${networkLogs.length}`);
    console.log(`📁 Console Logs: ${consoleLogs.length}`);
    console.log(`📁 JavaScript Errors: ${jsErrors.length}`);
    console.log(`📁 Page Shows "Asset Not Found": ${pageAnalysis.assetNotFound}`);
    console.log(`📁 Tabs Found: ${pageAnalysis.tabs.length}`);
    console.log(`📁 Authenticated: ${isAuthenticated}`);

    // Print network logs
    console.log('📡 Network Activity:');
    networkLogs.forEach((log, i) => {
      if (log.type === 'request') {
        console.log(`  ${i}. REQUEST: ${log.method} ${log.url}`);
      } else {
        console.log(`  ${i}. RESPONSE: ${log.status} ${log.url} - ${log.statusText}`);
        if (log.body) {
          console.log(`     Body preview: ${log.body.substring(0, 200)}...`);
        }
        if (log.error) {
          console.log(`     ERROR: ${log.error}`);
        }
      }
    });

    // Print JavaScript errors
    if (jsErrors.length > 0) {
      console.log('🚨 JavaScript Errors:');
      jsErrors.forEach((error, i) => {
        console.log(`  ${i}. ${error}`);
      });
    }
  });
});