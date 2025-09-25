const axios = require("axios")

async function seedLivingFaith() {
  const strapiUrl = "http://127.0.0.1:1337"

  // First, let's create a project directly
  const projectData = {
    data: {
      title: "Living Faith Church",
      slug: "living-faith-church",
      description:
        "A modern, responsive church website template designed to inspire faith, connect communities, and facilitate spiritual growth. Perfect for churches of all sizes looking to establish a powerful online presence.",
      remixUrl: "https://framer.link/1KgbfXD",
      previewUrl: "https://livingfaith.framer.website/",
      featured: true,
      order: 1,
      tags: [
        "church",
        "religious",
        "faith",
        "community",
        "nonprofit",
        "ministry",
        "worship",
        "responsive",
        "cms",
        "events",
      ],
      remixCount: 0,
      publishedAt: new Date().toISOString(),
    },
  }

  try {
    // Try with the custom API key
    const response = await axios.post(
      `${strapiUrl}/api/projects`,
      projectData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Bearer badd3bf2e62155e9216dbe2252b428348dc586ebbea21318274aab2eb085385520f93e30fac1b14277299cf8f4591a5d6efcbf29e2a5bcbe292da61db124452edb5594fc5e3a1be85f5ec06474c629228500a7efc27fc5aa67e9b65820b07d7abc2ea7e2659bd96e4ada1ab9180dca292ad8153b62ea6de73517e09bdd91e855",
        },
      }
    )

    console.log("✅ Living Faith template created successfully!")
    console.log("Project ID:", response.data.data.id)
    console.log("Access at: http://localhost:3000/templates")
  } catch (error) {
    console.error(
      "❌ Error creating project:",
      error.response?.data || error.message
    )

    // If custom key fails, try to login as admin
    if (error.response?.status === 401) {
      console.log(
        "\n🔐 Custom API key failed. Please create the template manually in Strapi Admin:"
      )
      console.log("1. Go to http://localhost:1337/admin")
      console.log("2. Navigate to Content Manager > Projects")
      console.log('3. Click "Create new entry"')
      console.log("4. Fill in the Living Faith template details")
      console.log("5. Save and Publish")
    }
  }
}

seedLivingFaith()
