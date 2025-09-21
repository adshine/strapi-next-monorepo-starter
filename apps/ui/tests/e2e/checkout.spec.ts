import { expect, test } from "@playwright/test"

test.describe("Checkout Flow", () => {
  test("should display pricing page", async ({ page }) => {
    await page.goto("/pricing")

    // Check for pricing plans
    await expect(page.locator("h1")).toContainText(/Pricing|Plans|Choose/i)

    // Check for plan cards
    const planCards = page.locator('.plan-card, [data-testid="plan-card"]')
    await expect(planCards).toHaveCount(4) // Free, Starter, Professional, Enterprise
  })

  test("should show plan features", async ({ page }) => {
    await page.goto("/pricing")

    // Check for feature lists
    const features = page.locator(
      '.feature-list li, [data-testid="plan-feature"]'
    )
    await expect(features.first()).toBeVisible()

    // Check for template limits
    await expect(page.locator("text=/templates per month/i")).toBeVisible()
  })

  test("should initiate checkout for paid plan", async ({ page }) => {
    await page.goto("/pricing")

    // Find and click on a paid plan's CTA button
    const starterPlanButton = page
      .locator(
        '.plan-card:has-text("Starter") button:has-text("Get Started"), [data-testid="plan-starter"] button'
      )
      .first()
    await starterPlanButton.click()

    // Should either redirect to Stripe or show a login prompt
    await page.waitForTimeout(1000)

    // Check if redirected to auth or Stripe
    const url = page.url()
    const isAuthPage = url.includes("/auth")
    const isStripePage = url.includes("stripe.com")
    const isCheckoutModal = await page
      .locator('[role="dialog"]:has-text("Checkout")')
      .isVisible()

    expect(isAuthPage || isStripePage || isCheckoutModal).toBeTruthy()
  })

  test("should toggle between monthly and annual billing", async ({ page }) => {
    await page.goto("/pricing")

    // Find billing toggle
    const billingToggle = page
      .locator(
        '[role="switch"], button:has-text("Annual"), input[type="checkbox"]'
      )
      .first()

    if (await billingToggle.isVisible()) {
      // Get initial price
      const initialPrice = await page
        .locator(
          '.plan-card:has-text("Starter") .price, [data-testid="plan-starter-price"]'
        )
        .first()
        .textContent()

      // Toggle billing
      await billingToggle.click()
      await page.waitForTimeout(500)

      // Get new price
      const newPrice = await page
        .locator(
          '.plan-card:has-text("Starter") .price, [data-testid="plan-starter-price"]'
        )
        .first()
        .textContent()

      // Prices should be different
      expect(initialPrice).not.toEqual(newPrice)
    }
  })

  test("should handle free plan selection", async ({ page }) => {
    await page.goto("/pricing")

    // Click on free plan
    const freePlanButton = page
      .locator(
        '.plan-card:has-text("Free") button, [data-testid="plan-free"] button'
      )
      .first()
    await freePlanButton.click()

    // Should either show sign up or redirect to dashboard
    await page.waitForTimeout(1000)

    const url = page.url()
    const isAuthPage =
      url.includes("/auth/register") || url.includes("/auth/signup")
    const isDashboard = url.includes("/dashboard")

    expect(isAuthPage || isDashboard).toBeTruthy()
  })
})
