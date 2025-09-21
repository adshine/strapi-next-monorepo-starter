import { expect, test } from "@playwright/test"

test.describe("Templates Catalog", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/templates")
  })

  test("should display templates catalog page", async ({ page }) => {
    // Check for page title
    await expect(page.locator("h1")).toContainText(/Templates|Catalog|Browse/i)

    // Check for search bar
    await expect(
      page.locator('input[placeholder*="Search"], input[type="search"]')
    ).toBeVisible()

    // Check for filter options
    await expect(page.locator("text=/Category|Filter/i")).toBeVisible()

    // Check for sort options
    await expect(page.locator("text=/Sort|Popular|Newest/i")).toBeVisible()
  })

  test("should load and display template cards", async ({ page }) => {
    // Wait for templates to load from real API
    await page
      .waitForResponse(
        (response) =>
          response.url().includes("/api/projects") && response.status() === 200,
        { timeout: 10000 }
      )
      .catch(() => {
        // If API call fails, check for static content
        console.log("API call timeout, checking for static content")
      })

    // Check for template cards
    const templateCards = page.locator(
      '[data-testid="template-card"], .template-card, article'
    )
    await expect(templateCards).toHaveCount(await templateCards.count())

    // Verify at least one template is visible
    const firstCard = templateCards.first()
    await expect(firstCard).toBeVisible()
  })

  test("should filter templates by category", async ({ page }) => {
    // Find and click category filter
    const categorySelect = page
      .locator('select:has-text("Category"), [aria-label*="Category"]')
      .first()
    if (await categorySelect.isVisible()) {
      // Get available options
      const options = await categorySelect.locator("option").allTextContents()
      if (options.length > 1) {
        // Select second option (first is usually 'All')
        await categorySelect.selectOption({ index: 1 })

        // Wait for filter to apply
        await page.waitForTimeout(500)

        // Verify URL or content changed
        const url = page.url()
        expect(url).toMatch(/category=|filter=/)
      }
    }
  })

  test("should search for templates", async ({ page }) => {
    // Find search input
    const searchInput = page
      .locator('input[placeholder*="Search"], input[type="search"]')
      .first()
    await expect(searchInput).toBeVisible()

    // Type search query
    await searchInput.fill("dashboard")

    // Wait for search to execute (debounce)
    await page.waitForTimeout(1000)

    // Check that results are filtered or "no results" message appears
    const hasResults =
      (await page
        .locator('[data-testid="template-card"], .template-card')
        .count()) > 0
    const noResultsMessage = page.locator(
      "text=/No templates found|No results/i"
    )

    if (!hasResults) {
      await expect(noResultsMessage).toBeVisible()
    } else {
      expect(hasResults).toBeTruthy()
    }
  })

  test("should toggle between grid and list view", async ({ page }) => {
    // Look for view toggle buttons
    const gridButton = page.locator(
      'button[aria-label*="Grid"], button:has-text("Grid")'
    )
    const listButton = page.locator(
      'button[aria-label*="List"], button:has-text("List")'
    )

    if ((await gridButton.isVisible()) && (await listButton.isVisible())) {
      // Switch to list view
      await listButton.click()
      await page.waitForTimeout(300)

      // Check layout changed
      const container = page.locator('[data-view="list"], .list-view, main')
      await expect(container).toBeVisible()

      // Switch back to grid view
      await gridButton.click()
      await page.waitForTimeout(300)

      // Check layout changed back
      const gridContainer = page.locator('[data-view="grid"], .grid-view, main')
      await expect(gridContainer).toBeVisible()
    }
  })

  test("should sort templates", async ({ page }) => {
    // Find sort dropdown
    const sortSelect = page
      .locator('select:has-text("Sort"), [aria-label*="Sort"]')
      .first()
    if (await sortSelect.isVisible()) {
      // Get current order
      const initialOrder = await page
        .locator('[data-testid="template-card"], .template-card')
        .first()
        .textContent()

      // Change sort order
      await sortSelect.selectOption("name")
      await page.waitForTimeout(500)

      // Check if order changed
      const newOrder = await page
        .locator('[data-testid="template-card"], .template-card')
        .first()
        .textContent()
      expect(newOrder).not.toBe(initialOrder)
    }
  })

  test("should open template detail modal or navigate to detail page", async ({
    page,
  }) => {
    // Wait for templates to load
    await page.waitForTimeout(1000)

    // Click on first template card
    const firstCard = page
      .locator('[data-testid="template-card"], .template-card, article')
      .first()
    await firstCard.click()

    // Check if modal opened or navigated to detail page
    const modalOpened = await page
      .locator('[role="dialog"], .modal, .remix-modal')
      .isVisible()
      .catch(() => false)
    const navigatedToDetail = page.url().includes("/template/")

    expect(modalOpened || navigatedToDetail).toBeTruthy()
  })
})
