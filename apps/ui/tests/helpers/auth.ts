import { Page } from "@playwright/test"

export async function loginAsTestUser(page: Page) {
  // Navigate to login if not already there
  if (!page.url().includes("/auth/login")) {
    await page.goto("/auth/login")
  }

  // Use test credentials
  await page.fill('input[name="email"]', "test@example.com")
  await page.fill('input[name="password"]', "Test123456!")

  // Submit form
  await page.click('button[type="submit"]')

  // Wait for redirect to dashboard
  await page.waitForURL("**/dashboard/**", { timeout: 10000 })
}

export async function setupTestUser() {
  // This would normally create a test user in the database
  // For now, we'll assume the test user exists
  return {
    email: "test@example.com",
    password: "Test123456!",
    name: "Test User",
  }
}

export async function cleanupTestUser() {
  // This would normally clean up test data
  // For now, this is a no-op
}
