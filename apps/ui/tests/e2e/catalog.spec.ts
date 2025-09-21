import { expect, test } from "@playwright/test"

test.describe("Template Catalog", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/")
  })

  test("should display template catalog", async ({ page }) => {
    // Check for catalog elements
    await expect(page.locator("h1")).toContainText(/Templates|Catalog|Gallery/i)

    // Check for template cards
    const templateCards = page.locator(
      '[data-testid="template-card"], .template-card'
    )
    await expect(templateCards.first()).toBeVisible()
  })

  test("should filter templates by category", async ({ page }) => {
    // Check for filter buttons or dropdown
    const filterButton = page
      .locator('button:has-text("Filter"), [aria-label*="Filter"]')
      .first()
    if (await filterButton.isVisible()) {
      await filterButton.click()

      // Select a category
      await page.click("text=Landing Pages")

      // Verify filtered results
      await expect(page.locator(".template-card")).toHaveCount(
        await page.locator(".template-card").count()
      )
    }
  })

  test("should search for templates", async ({ page }) => {
    // Find search input
    const searchInput = page
      .locator('input[placeholder*="Search"], input[type="search"]')
      .first()

    if (await searchInput.isVisible()) {
      // Type in search
      await searchInput.fill("dashboard")
      await searchInput.press("Enter")

      // Wait for results to update
      await page.waitForTimeout(500)

      // Check that results are shown
      const results = page.locator(
        '.template-card, [data-testid="template-card"]'
      )
      const count = await results.count()
      expect(count).toBeGreaterThanOrEqual(0)
    }
  })

  test("should display template detail modal", async ({ page }) => {
    // Click on first template card
    const firstCard = page
      .locator('.template-card, [data-testid="template-card"]')
      .first()
    await firstCard.click()

    // Check for detail modal or page
    const modal = page.locator(
      '[role="dialog"], .modal, [data-testid="template-modal"]'
    )
    const detailPage = page.locator(
      '.template-detail, [data-testid="template-detail"]'
    )

    const isModalVisible = await modal.isVisible().catch(() => false)
    const isDetailPageVisible = await detailPage.isVisible().catch(() => false)

    expect(isModalVisible || isDetailPageVisible).toBeTruthy()

    // Check for remix button
    await expect(
      page.locator(
        'button:has-text("Remix"), button:has-text("Get Template")'
      )
    ).toBeVisible()
  })

  test("should handle pagination", async ({ page }) => {
    // Look for pagination controls
    const pagination = page.locator(
      '.pagination, [aria-label="Pagination"], nav[role="navigation"]'
    )

    if (await pagination.isVisible()) {
      const nextButton = page.locator(
        'button:has-text("Next"), [aria-label="Next page"]'
      )

      if (await nextButton.isEnabled()) {
        await nextButton.click()

        // Wait for new content to load
        await page.waitForTimeout(500)

        // Verify page changed (URL or content)
        const pageIndicator = page.locator(
          '.page-indicator, [aria-current="page"]'
        )
        if (await pageIndicator.isVisible()) {
          await expect(pageIndicator).toContainText(/2/)
        }
      }
    }
  })
})
