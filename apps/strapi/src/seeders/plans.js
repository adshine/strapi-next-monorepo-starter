module.exports = async (strapi) => {
  const plans = [
    {
      name: "Free",
      slug: "free",
      description: "Get started with basic templates",
      monthlyPrice: 0,
      annualPrice: 0,
      stripePriceIdMonthly: "price_free_monthly",
      stripePriceIdAnnual: "price_free_annual",
      features: [
        "3 template remixes per month",
        "Access to free templates",
        "Basic support",
        "Community access",
      ],
      monthlyRemixLimit: 3, // TODO: rename from monthlyDownloadLimit in schema
      isActive: true,
      sortOrder: 1,
      recommended: false,
      tier: "free",
    },
    {
      name: "Starter",
      slug: "starter",
      description: "Perfect for individual designers",
      monthlyPrice: 29,
      annualPrice: 290,
      stripePriceIdMonthly: "price_starter_monthly",
      stripePriceIdAnnual: "price_starter_annual",
      features: [
        "20 template remixes per month",
        "Access to all templates",
        "Priority support",
        "Early access to new templates",
        "Template access history",
      ],
      monthlyRemixLimit: 20, // TODO: rename from monthlyDownloadLimit in schema
      isActive: true,
      sortOrder: 2,
      recommended: true,
      tier: "starter",
    },
    {
      name: "Professional",
      slug: "professional",
      description: "For teams and agencies",
      monthlyPrice: 79,
      annualPrice: 790,
      stripePriceIdMonthly: "price_professional_monthly",
      stripePriceIdAnnual: "price_professional_annual",
      features: [
        "100 template remixes per month",
        "Access to all templates",
        "Priority support",
        "Early access to new templates",
        "Template access history",
        "Team collaboration",
        "Custom template requests",
        "API access",
      ],
      monthlyRemixLimit: 100, // TODO: rename from monthlyDownloadLimit in schema
      isActive: true,
      sortOrder: 3,
      recommended: false,
      tier: "professional",
    },
    {
      name: "Enterprise",
      slug: "enterprise",
      description: "Unlimited access for large teams",
      monthlyPrice: 199,
      annualPrice: 1990,
      stripePriceIdMonthly: "price_enterprise_monthly",
      stripePriceIdAnnual: "price_enterprise_annual",
      features: [
        "Unlimited template remixes",
        "Access to all templates",
        "Dedicated support",
        "Early access to new templates",
        "Template access history",
        "Team collaboration",
        "Custom template requests",
        "API access",
        "Custom integrations",
        "SLA guarantee",
      ],
      monthlyRemixLimit: 999999, // TODO: rename from monthlyDownloadLimit in schema
      isActive: true,
      sortOrder: 4,
      recommended: false,
      tier: "enterprise",
    },
  ]

  console.log("🌱 Seeding plans...")

  for (const plan of plans) {
    try {
      const existingPlan = await strapi.db.query("api::plan.plan").findOne({
        where: { slug: plan.slug },
      })

      if (!existingPlan) {
        await strapi.db.query("api::plan.plan").create({
          data: plan,
        })
        console.log(`✅ Created plan: ${plan.name}`)
      } else {
        console.log(`⏭️  Plan already exists: ${plan.name}`)
      }
    } catch (error) {
      console.error(`❌ Error creating plan ${plan.name}:`, error)
    }
  }

  console.log("✨ Plans seeding completed")
}
