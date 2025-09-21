import { expect, test } from "@playwright/test"

test.describe("Template Request Flow", () => {
  // Use actual authentication - will require login first
  // For now, we'll skip authentication tests and focus on public pages
  // In production, you'd have a proper auth setup or test user seeding

  test.skip("should display template request page (requires auth)", async ({
    page,
  }) => {
    // This test requires authentication setup
    await page.goto("/dashboard/requests")

    // Check for page elements
    await expect(page.locator("h1")).toContainText(
      /Custom Template|Template Request/i
    )

    // Check for request button
    const createButton = page.locator(
      'button:has-text("Create"), button:has-text("Request")'
    )
    await expect(createButton.first()).toBeVisible()
  })

  test("should open template request form", async ({ page }) => {
    await page.goto("/dashboard/requests")

    // Click create request button
    await page.click('button:has-text("Create Custom Request")')

    // Check for form fields
    await expect(
      page.locator('input[placeholder*="Title"], input[name="title"]')
    ).toBeVisible()
    await expect(
      page.locator(
        'textarea[placeholder*="Description"], textarea[name="description"]'
      )
    ).toBeVisible()
    await expect(page.locator('button:has-text("Submit")')).toBeVisible()
  })

  test("should fill and submit template request form", async ({ page }) => {
    await page.goto("/dashboard/requests")

    // Open form
    await page.click('button:has-text("Create Custom Request")')

    // Fill in form fields
    await page.fill('input[name="title"]', "E-commerce Dashboard Template")
    await page.fill(
      'textarea[name="description"]',
      "I need a modern e-commerce dashboard with analytics widgets, order management, and inventory tracking."
    )

    // Select category if available
    const categorySelect = page.locator('select[name="category"]')
    if (await categorySelect.isVisible()) {
      await categorySelect.selectOption({ index: 1 })
    }

    // Select priority
    const prioritySelect = page.locator('select[name="priority"]')
    if (await prioritySelect.isVisible()) {
      await prioritySelect.selectOption("high")
    }

    // Select budget
    const budgetSelect = page.locator('select:has-text("Budget")').first()
    if (await budgetSelect.isVisible()) {
      await budgetSelect.selectOption("$1,000-$2,500")
    }

    // API call will be made to real endpoint at /api/template-requests
    // The real API should handle the creation

    // Submit form
    await page.click('button:has-text("Submit Template Request")')

    // Check for success message or redirect
    await page.waitForTimeout(1000)
    const successMessage = page.locator("text=/success|submitted/i")
    const isSuccessVisible = await successMessage.isVisible().catch(() => false)

    if (!isSuccessVisible) {
      // Check if redirected to requests list
      await expect(
        page.locator("text=E-commerce Dashboard Template")
      ).toBeVisible()
    } else {
      expect(isSuccessVisible).toBeTruthy()
    }
  })

  test("should show quota information", async ({ page }) => {
    await page.goto("/dashboard/requests")

    // Check for quota display
    const quotaDisplay = page.locator(
      "text=/requests remaining|Monthly Requests/i"
    )
    await expect(quotaDisplay.first()).toBeVisible()

    // Check for quota numbers
    const quotaNumbers = page.locator("text=/[0-9]+ / [0-9]+|∞/")
    await expect(quotaNumbers.first()).toBeVisible()
  })

  test("should validate required fields", async ({ page }) => {
    await page.goto("/dashboard/requests")

    // Open form
    await page.click('button:has-text("Create Custom Request")')

    // Try to submit without filling required fields
    await page.click('button:has-text("Submit")')

    // Check for validation messages
    const validationMessage = page.locator(
      '.error, [role="alert"], text=/required|fill/i'
    )
    await expect(validationMessage.first()).toBeVisible()
  })
})
