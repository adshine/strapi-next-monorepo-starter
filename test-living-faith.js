const { chromium } = require("playwright")

;(async () => {
  const browser = await chromium.launch({ headless: false })
  const context = await browser.newContext()
  const page = await context.newPage()

  // Navigate directly to Living Faith template detail page
  console.log("Navigating directly to Living Faith template detail page...")
  await page.goto("http://localhost:3000/templates/living-faith-church")

  // Wait for page to load
  await page.waitForLoadState("networkidle")

  // Check for error message
  const errorElement = await page.$("text=Cannot read properties")
  if (errorElement) {
    console.log("❌ ERROR STILL EXISTS: Page shows null reference error")
    const errorText = await errorElement.textContent()
    console.log("Error message:", errorText)
  } else {
    console.log("✅ SUCCESS: No null reference error detected")

    // Check if page loaded correctly
    const title = await page.$("h1")
    if (title) {
      const titleText = await title.textContent()
      console.log("Page title:", titleText)
    }

    // Check for remix button
    const remixButton = await page.$('button:has-text("Remix")')
    if (remixButton) {
      console.log("Remix button found")
    }

    // Check for loading state
    const loadingText = await page.$("text=Loading template")
    if (loadingText) {
      console.log("Page is still loading...")
    }
  }

  // Take screenshot
  await page.screenshot({ path: "living-faith-test-result.png" })
  console.log("Screenshot saved as living-faith-test-result.png")

  // Keep browser open for 3 seconds
  await page.waitForTimeout(3000)

  await browser.close()
})()
