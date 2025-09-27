const { chromium } = require("playwright")

;(async () => {
  const browser = await chromium.launch({ headless: false })
  const context = await browser.newContext()
  const page = await context.newPage()

  // Navigate to templates page
  console.log("Navigating to templates page...")
  await page.goto("http://localhost:3000/templates")
  await page.waitForLoadState("networkidle")

  // Look for the Living Faith Church card
  console.log("Looking for Living Faith Church template card...")

  // Try to find the card by different selectors
  const card =
    (await page.$("text=Living Faith Church")) ||
    (await page.$("text=Living Faith")) ||
    (await page.$('[href="/templates/living-faith-church"]'))

  if (card) {
    console.log("Found Living Faith Church card!")

    // Get the card's parent element to inspect the full card
    const cardContainer = await card.evaluateHandle((el) => {
      // Find the nearest parent that looks like a card container
      let parent = el
      while (
        parent &&
        !parent.classList.contains("card") &&
        !parent.tagName.match(/ARTICLE|DIV/)
      ) {
        parent = parent.parentElement
      }
      return parent || el
    })

    // Extract card information
    const cardInfo = await cardContainer.evaluate((el) => {
      const info = {
        title: "",
        description: "",
        tags: [],
        category: "",
        imageUrl: "",
        price: "",
        hasRemixButton: false,
        allText: el.innerText,
      }

      // Get title
      const titleEl = el.querySelector('h2, h3, h4, [class*="title"]')
      if (titleEl) info.title = titleEl.innerText

      // Get description
      const descEl = el.querySelector(
        'p, [class*="description"], [class*="summary"]'
      )
      if (descEl) info.description = descEl.innerText

      // Get tags
      const tagEls = el.querySelectorAll('[class*="tag"], [class*="badge"]')
      tagEls.forEach((tag) => info.tags.push(tag.innerText))

      // Get category
      const catEl = el.querySelector('[class*="category"]')
      if (catEl) info.category = catEl.innerText

      // Get image
      const imgEl = el.querySelector("img")
      if (imgEl) info.imageUrl = imgEl.src

      // Get price/plan
      const priceEl = el.querySelector('[class*="price"], [class*="plan"]')
      if (priceEl) info.price = priceEl.innerText

      // Check for remix button
      const remixBtns = el.querySelectorAll("button, a")
      for (const btn of remixBtns) {
        if (btn.innerText && btn.innerText.includes("Remix")) {
          info.hasRemixButton = true
          break
        }
      }

      return info
    })

    console.log("\n=== LIVING FAITH CHURCH CARD DETAILS ===")
    console.log("Title:", cardInfo.title || "Not found")
    console.log("Description:", cardInfo.description || "Not found")
    console.log(
      "Tags:",
      cardInfo.tags.length > 0 ? cardInfo.tags.join(", ") : "None"
    )
    console.log("Category:", cardInfo.category || "Not found")
    console.log("Image URL:", cardInfo.imageUrl || "No image")
    console.log("Price/Plan:", cardInfo.price || "Not specified")
    console.log("Has Remix Button:", cardInfo.hasRemixButton)
    console.log("\nAll visible text in card:")
    console.log(cardInfo.allText)

    // Click on the card to go to detail page
    console.log("\n=== CLICKING ON THE CARD ===")
    await card.click()
    await page.waitForLoadState("networkidle")

    // Get detail page information
    console.log("\n=== DETAIL PAGE INFORMATION ===")
    const detailInfo = await page.evaluate(() => {
      const info = {
        url: window.location.href,
        title: "",
        description: "",
        remixUrl: "",
        tags: [],
        category: "",
        price: "",
        features: [],
      }

      // Get title
      const h1 = document.querySelector("h1")
      if (h1) info.title = h1.innerText

      // Get description
      const descEl = document.querySelector('[class*="description"], main p')
      if (descEl) info.description = descEl.innerText

      // Get remix button/link
      const remixEl = document.querySelector('a[href*="framer.com"]')
      if (remixEl) {
        info.remixUrl = remixEl.href || "Button found but no URL"
      } else {
        // Look for Remix button text
        const allLinks = document.querySelectorAll("a, button")
        for (const link of allLinks) {
          if (link.innerText && link.innerText.includes("Remix")) {
            info.remixUrl = link.href || "Remix button found (no href)"
            break
          }
        }
      }

      // Get tags
      const tagEls = document.querySelectorAll(
        '[class*="tag"], [class*="badge"]'
      )
      tagEls.forEach((tag) => info.tags.push(tag.innerText))

      // Get category
      const catEl = document.querySelector('[class*="category"]')
      if (catEl) info.category = catEl.innerText

      // Get price
      const priceEl = document.querySelector(
        '[class*="price"], [class*="plan"]'
      )
      if (priceEl) info.price = priceEl.innerText

      // Get features
      const featureEls = document.querySelectorAll('li, [class*="feature"]')
      featureEls.forEach((feat) => {
        if (feat.innerText.length < 100) {
          // Avoid long paragraphs
          info.features.push(feat.innerText)
        }
      })

      return info
    })

    console.log("Current URL:", detailInfo.url)
    console.log("Title:", detailInfo.title)
    console.log("Description:", detailInfo.description)
    console.log("Remix URL:", detailInfo.remixUrl)
    console.log("Tags:", detailInfo.tags.join(", "))
    console.log("Category:", detailInfo.category)
    console.log("Price/Plan:", detailInfo.price)
    console.log("Features:", detailInfo.features.slice(0, 5).join("\n  - "))

    // Take screenshots
    await page.screenshot({ path: "living-faith-detail.png", fullPage: true })
    console.log("\nScreenshot saved as living-faith-detail.png")
  } else {
    console.log("Could not find Living Faith Church card on the page")

    // List what's actually on the page
    const allCards = await page.$$eval(
      'article, [class*="card"], a[href*="/templates/"]',
      (els) =>
        els.map((el) => ({
          text: el.innerText.substring(0, 100),
          href: el.href || "no href",
        }))
    )

    console.log("\nFound these elements on the page:")
    allCards.forEach((card) => {
      console.log("- Text:", card.text)
      console.log("  Href:", card.href)
    })
  }

  // Keep browser open for viewing
  await page.waitForTimeout(10000)
  await browser.close()
})()
