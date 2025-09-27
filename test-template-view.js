const { chromium } = require("playwright")

;(async () => {
  const browser = await chromium.launch({ headless: false })
  const context = await browser.newContext()
  const page = await context.newPage()

  // Navigate to templates page
  console.log("Navigating to templates page...")
  await page.goto("http://localhost:3000/templates")
  await page.waitForLoadState("networkidle")

  // Take screenshot of templates page
  await page.screenshot({ path: "templates-page.png" })
  console.log("Templates page loaded, screenshot saved as templates-page.png")

  // Wait for template cards to load
  await page
    .waitForSelector('[data-testid="template-card"], .template-card, article', {
      timeout: 5000,
    })
    .catch(() => {
      console.log("No template cards found, trying generic link...")
    })

  // Click on Living Faith template (try multiple selectors)
  const clicked = await page
    .click('a[href="/templates/living-faith-church"]')
    .catch(async () => {
      console.log("Direct link not found, trying text-based click...")
      return await page.click("text=Living Faith").catch(async () => {
        console.log("Text click failed, trying partial text...")
        return await page.click("text=/Living/i").catch(() => {
          console.log("Could not find Living Faith template link")
          return false
        })
      })
    })

  if (clicked !== false) {
    console.log("Clicked on Living Faith template")
    await page.waitForLoadState("networkidle")

    // Take screenshot of detail page
    await page.screenshot({ path: "template-detail.png" })
    console.log("Detail page loaded, screenshot saved as template-detail.png")

    // Get the current URL
    console.log("Current URL:", page.url())

    // Check for remix button
    const remixButton = await page.$(
      'button:has-text("Remix"), a:has-text("Remix")'
    )
    if (remixButton) {
      console.log("Found Remix button on the page")
    }
  }

  // Keep browser open for 10 seconds to view
  await page.waitForTimeout(10000)

  await browser.close()
})()
