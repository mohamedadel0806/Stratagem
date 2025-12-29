import { test, expect } from '@playwright/test'

test.describe('Multi-Tenant Authentication', () => {
    test.beforeEach(async ({ page }) => {
        // Clear any existing auth state
        await page.context().clearCookies()
        await page.goto('/en/login')
    })

    test('should login with default tenant user', async ({ page }) => {
        // Fill login form
        await page.fill('input[name="email"]', 'test@example.com')
        await page.fill('input[name="password"]', 'password123')

        // Submit form
        await page.click('button:has-text("Sign In with Email")')

        // Wait for redirect to dashboard
        await page.waitForURL('**/dashboard', { timeout: 10000 })

        // Verify NextAuth session cookie exists
        const cookies = await page.context().cookies()
        const sessionToken = cookies.find(c =>
            c.name.includes('next-auth.session-token') ||
            c.name.includes('__Secure-next-auth.session-token')
        )
        expect(sessionToken).toBeTruthy()

        // Verify user is logged in by checking for user menu
        const userMenu = page.locator('[data-testid="user-menu-trigger"]')
        await expect(userMenu).toBeVisible({ timeout: 5000 })

        console.log('✓ Default tenant user logged in successfully')
    })

    test('should login with Acme tenant user', async ({ page }) => {
        // Fill login form with Acme tenant credentials
        await page.fill('input[name="email"]', 'admin@acme.com')
        await page.fill('input[name="password"]', 'Test123!')

        // Submit form
        await page.click('button:has-text("Sign In with Email")')

        // Wait for redirect to dashboard
        await page.waitForURL('**/dashboard', { timeout: 10000 })

        // Verify session cookie exists
        const cookies = await page.context().cookies()
        const sessionToken = cookies.find(c =>
            c.name.includes('next-auth.session-token') ||
            c.name.includes('__Secure-next-auth.session-token')
        )
        expect(sessionToken).toBeTruthy()

        // Verify user is logged in
        const userMenu = page.locator('[data-testid="user-menu-trigger"]')
        await expect(userMenu).toBeVisible({ timeout: 5000 })

        console.log('✓ Acme tenant user logged in successfully')
    })

    test('should maintain session across page navigation', async ({ page }) => {
        // Login
        await page.fill('input[name="email"]', 'test@example.com')
        await page.fill('input[name="password"]', 'password123')
        await page.click('button:has-text("Sign In with Email")')
        await page.waitForURL('**/dashboard', { timeout: 10000 })

        // Navigate to different pages
        await page.goto('/en/dashboard/governance/influencers')
        await page.waitForLoadState('networkidle')

        // Should still be logged in
        const userMenu = page.locator('[data-testid="user-menu-trigger"]')
        await expect(userMenu).toBeVisible()

        console.log('✓ Session persisted across navigation')
    })

    test('should fail login with invalid credentials', async ({ page }) => {
        await page.fill('input[name="email"]', 'invalid@example.com')
        await page.fill('input[name="password"]', 'wrongpassword')
        await page.click('button:has-text("Sign In with Email")')

        // Should show error message
        await expect(page.locator('text=/invalid|password/i')).toBeVisible({ timeout: 5000 })

        // Should not redirect
        await expect(page).toHaveURL(/.*login.*/)

        console.log('✓ Invalid credentials rejected correctly')
    })
})
