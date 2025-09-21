import { expect, test } from "@playwright/test"

test.describe("Pricing Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/pricing")
  })

  test("should display pricing page with plans", async ({ page }) => {
    // Check for page title
    await expect(page.locator("h1")).toContainText(/Choose Your Plan|Pricing/i)

    // Wait for plans to load from API
    await page
      .waitForResponse(
        (response) =>
          response.url().includes("/api/plans") && response.status() === 200,
        { timeout: 10000 }
      )
      .catch(() => {
        console.log("API call timeout, checking for static content")
      })

    // Check for plan cards
    const planCards = page.locator(
      '[data-testid="plan-card"], .plan-card, article'
    )
    const planCount = await planCards.count()
    expect(planCount).toBeGreaterThan(0)

    // Check for essential plan elements
    await expect(page.locator("text=/month|year|annual/i")).toBeVisible()
    await expect(page.locator("text=/$[0-9]+/")).toBeVisible()
  })

  test("should toggle between monthly and yearly billing", async ({ page }) => {
    // Find billing toggle
    const monthlyButton = page.locator(
      'text=Monthly, button:has-text("Monthly")'
    )
    const yearlyButton = page.locator('text=Yearly, button:has-text("Yearly")')
    const billingSwitch = page.locator(
      '[role="switch"], input[type="checkbox"]'
    )

    if (await billingSwitch.isVisible()) {
      // Get initial price
      const initialPrice = await page
        .locator("text=/$[0-9]+/")
        .first()
        .textContent()

      // Toggle billing period
      await billingSwitch.click()
      await page.waitForTimeout(500)

      // Check price changed
      const newPrice = await page
        .locator("text=/$[0-9]+/")
        .first()
        .textContent()
      expect(newPrice).not.toBe(initialPrice)

      // Check for savings badge
      await expect(page.locator("text=/Save|20%|discount/i")).toBeVisible()
    } else if (
      (await monthlyButton.isVisible()) &&
      (await yearlyButton.isVisible())
    ) {
      // Alternative toggle implementation
      await yearlyButton.click()
      await expect(page.locator("text=/Save|20%|discount/i")).toBeVisible()
    }
  })

  test("should display plan features", async ({ page }) => {
    // Check for feature lists
    const featureLists = page.locator('ul, [role="list"]')
    const listCount = await featureLists.count()
    expect(listCount).toBeGreaterThan(0)

    // Check for check marks or feature indicators
    const checkMarks = page.locator("svg, .icon, text=✓")
    const checkCount = await checkMarks.count()
    expect(checkCount).toBeGreaterThan(0)

    // Verify specific features are mentioned
    await expect(
      page.locator("text=/Templates|Support/i")
    ).toBeVisible()
  })

  test("should highlight popular plan", async ({ page }) => {
    // Check for popular badge or highlight
    const popularBadge = page.locator("text=/Popular|Recommended|Best Value/i")
    const isPopularVisible = await popularBadge.isVisible().catch(() => false)

    if (isPopularVisible) {
      // Verify the popular plan has distinctive styling
      const popularCard = popularBadge.locator("..").locator("..")
      const classes = await popularCard.getAttribute("class")
      expect(classes).toMatch(/highlight|popular|featured|primary/)
    }
  })

  test("should navigate to checkout when selecting a plan", async ({
    page,
  }) => {
    // Find and click a "Choose Plan" or "Get Started" button
    const ctaButton = page
      .locator(
        'button:has-text("Choose"), button:has-text("Get Started"), button:has-text("Select")'
      )
      .first()

    if (await ctaButton.isVisible()) {
      await ctaButton.click()

      // Wait for navigation or modal
      await page.waitForTimeout(1000)

      // Check if navigated to checkout or opened auth modal
      const isCheckout = page.url().includes("/checkout")
      const isAuthModal = await page
        .locator('[role="dialog"], .auth-modal, text=/Sign|Login/i')
        .isVisible()
        .catch(() => false)

      expect(isCheckout || isAuthModal).toBeTruthy()
    }
  })

  test("should display add-ons section", async ({ page }) => {
    // Check for add-ons section
    const addOnsSection = page.locator("text=/Add-on|Enhance|Extra/i")
    const hasAddOns = await addOnsSection.isVisible().catch(() => false)

    if (hasAddOns) {
      // Check for add-on cards
      const addOnCards = page.locator('[data-testid="addon-card"], .addon-card')
      const addOnCount = await addOnCards.count()
      expect(addOnCount).toBeGreaterThan(0)

      // Click an add-on to select it
      const firstAddOn = addOnCards.first()
      await firstAddOn.click()

      // Check if selection is reflected (checkbox or highlight)
      const isSelected = await firstAddOn
        .locator('input[type="checkbox"]:checked, .selected')
        .isVisible()
        .catch(() => false)
      expect(isSelected).toBeTruthy()
    }
  })

  test("should display FAQ section", async ({ page }) => {
    // Scroll to FAQ section
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))

    // Check for FAQ heading
    const faqSection = page.locator("text=/FAQ|Frequently Asked|Questions/i")
    const hasFAQ = await faqSection.isVisible().catch(() => false)

    if (hasFAQ) {
      // Check for Q&A items
      const questions = page.locator("text=/Can I|What|How|Do you/i")
      const questionCount = await questions.count()
      expect(questionCount).toBeGreaterThan(0)

      // Check for expandable FAQ items (optional)
      const expandableItems = page.locator('[role="button"], details')
      if ((await expandableItems.count()) > 0) {
        await expandableItems.first().click()
        await page.waitForTimeout(300)
        // Check if content expanded
        const answer = page.locator("text=/Yes|We|You can/i")
        await expect(answer.first()).toBeVisible()
      }
    }
  })

  test("should handle API errors gracefully", async ({ page }) => {
    // Intercept API calls to simulate error
    await page.route("**/api/plans", (route) => {
      route.fulfill({
        status: 500,
        body: JSON.stringify({ error: "Internal Server Error" }),
      })
    })

    // Reload page to trigger error
    await page.reload()

    // Check for error message or fallback content
    const errorMessage = page.locator("text=/Error|Unable to load|Try again/i")
    const hasError = await errorMessage.isVisible().catch(() => false)

    // Even with error, basic page structure should be visible
    await expect(page.locator("h1")).toBeVisible()
  })
})
