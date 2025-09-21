const seedPlans = require("./plans")

module.exports = async (strapi) => {
  console.log("🌱 Starting database seeding...")

  try {
    // Seed plans
    await seedPlans(strapi)

    // Add more seeders here as needed
    // await seedProjects(strapi);
    // await seedUsers(strapi);

    console.log("✅ Database seeding completed successfully!")
  } catch (error) {
    console.error("❌ Error during database seeding:", error)
    throw error
  }
}
