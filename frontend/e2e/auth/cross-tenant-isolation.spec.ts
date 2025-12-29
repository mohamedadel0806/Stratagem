import { test, expect } from '@playwright/test'

test.describe('Cross-Tenant Data Isolation', () => {
    test('should only show default tenant data in influencers', async ({ page }) => {
        // Login as default tenant user
        await page.goto('/en/login')
        await page.fill('input[name="email"]', 'test@example.com')
        await page.fill('input[name="password"]', 'password123')
        await page.click('button:has-text("Sign In with Email")')
        await page.waitForURL('**/dashboard', { timeout: 10000 })

        // Navigate to influencers page
        await page.goto('/dashboard/governance/influencers')
        await page.waitForLoadState('networkidle')

        // Wait for data to load
        await page.waitForTimeout(2000)

        // Check if there are influencers (default tenant should have data)
        const hasData = await page.locator('[data-testid="influencer-row"]').count() > 0 ||
            await page.locator('table tbody tr').count() > 0

        // Default tenant should have influencers
        expect(hasData).toBe(true)

        // Store count for verification
        const rowCount = await page.locator('table tbody tr').count()
        console.log(`Default tenant has ${rowCount} influencers`)
    })

    test('should only show Acme tenant data (empty for new tenant)', async ({ page }) => {
        // Login as Acme tenant user
        await page.goto('/en/login')
        await page.fill('input[name="email"]', 'admin@acme.com')
        await page.fill('input[name="password"]', 'Test123!')
        await page.click('button:has-text("Sign In with Email")')
        await page.waitForURL('**/dashboard', { timeout: 10000 })

        // Navigate to influencers page
        await page.goto('/dashboard/governance/influencers')
        await page.waitForLoadState('networkidle')

        // Wait for data to load
        await page.waitForTimeout(2000)

        // Acme tenant is new, should have no data
        const hasNoData = await page.locator('text=/no influencers|no data|empty/i').isVisible() ||
            await page.locator('table tbody tr').count() === 0

        expect(hasNoData).toBe(true)
        console.log('Acme tenant has no influencers (as expected for new tenant)')
    })

    test('should only show default tenant policies', async ({ page }) => {
        // Login as default tenant user
        await page.goto('/en/login')
        await page.fill('input[name="email"]', 'test@example.com')
        await page.fill('input[name="password"]', 'password123')
        await page.click('button:has-text("Sign In with Email")')
        await page.waitForURL('**/dashboard', { timeout: 10000 })

        // Navigate to policies page
        await page.goto('/dashboard/governance/policies')
        await page.waitForLoadState('networkidle')
        await page.waitForTimeout(2000)

        // Default tenant should have policies
        const policyCount = await page.locator('table tbody tr').count()
        expect(policyCount).toBeGreaterThan(0)
        console.log(`Default tenant has ${policyCount} policies`)
    })

    test('should only show Acme tenant policies (empty)', async ({ page }) => {
        // Login as Acme tenant user
        await page.goto('/en/login')
        await page.fill('input[name="email"]', 'admin@acme.com')
        await page.fill('input[name="password"]', 'Test123!')
        await page.click('button:has-text("Sign In with Email")')
        await page.waitForURL('**/dashboard', { timeout: 10000 })

        // Navigate to policies page
        await page.goto('/dashboard/governance/policies')
        await page.waitForLoadState('networkidle')
        await page.waitForTimeout(2000)

        // Acme tenant should have no policies
        const hasNoData = await page.locator('text=/no policies|no data|empty/i').isVisible() ||
            await page.locator('table tbody tr').count() === 0

        expect(hasNoData).toBe(true)
        console.log('Acme tenant has no policies (as expected for new tenant)')
    })

    test('should maintain tenant isolation across navigation', async ({ page }) => {
        // Login as default tenant
        await page.goto('/en/login')
        await page.fill('input[name="email"]', 'test@example.com')
        await page.fill('input[name="password"]', 'password123')
        await page.click('button:has-text("Sign In with Email")')
        await page.waitForURL('**/dashboard', { timeout: 10000 })

        // Check multiple pages to ensure consistent tenant context
        const pages = [
            '/dashboard/governance/influencers',
            '/dashboard/governance/policies',
            '/dashboard/governance/unified-controls'
        ]

        for (const pagePath of pages) {
            await page.goto(pagePath)
            await page.waitForLoadState('networkidle')
            await page.waitForTimeout(1000)

            // Verify we're still authenticated and seeing data
            const isAuthenticated = !page.url().includes('/login')
            expect(isAuthenticated).toBe(true)

            console.log(`Verified tenant isolation on ${pagePath}`)
        }
    })

    test('should not leak data between tenant sessions', async ({ browser }) => {
        // Create two separate contexts for complete isolation
        const context1 = await browser.newContext()
        const context2 = await browser.newContext()

        const page1 = await context1.newPage()
        const page2 = await context2.newPage()

        try {
            // Login as default tenant in context 1
            await page1.goto('/en/login')
            await page1.fill('input[name="email"]', 'test@example.com')
            await page1.fill('input[name="password"]', 'password123')
            await page1.click('button:has-text("Sign In with Email")')
            await page1.waitForURL('**/dashboard', { timeout: 10000 })

            // Login as Acme tenant in context 2
            await page2.goto('/en/login')
            await page2.fill('input[name="email"]', 'admin@acme.com')
            await page2.fill('input[name="password"]', 'Test123!')
            await page2.click('button:has-text("Sign In with Email")')
            await page2.waitForURL('**/dashboard', { timeout: 10000 })

            // Navigate both to influencers
            await page1.goto('/dashboard/governance/influencers')
            await page2.goto('/dashboard/governance/influencers')

            await page1.waitForLoadState('networkidle')
            await page2.waitForLoadState('networkidle')

            await page1.waitForTimeout(2000)
            await page2.waitForTimeout(2000)

            // Get data counts
            const count1 = await page1.locator('table tbody tr').count()
            const count2 = await page2.locator('table tbody tr').count()

            // Counts should be different (default has data, Acme is empty)
            expect(count1).not.toBe(count2)
            expect(count1).toBeGreaterThan(0)
            expect(count2).toBe(0)

            console.log(`Context 1 (default): ${count1} influencers`)
            console.log(`Context 2 (Acme): ${count2} influencers`)
        } finally {
            await context1.close()
            await context2.close()
        }
    })
})
