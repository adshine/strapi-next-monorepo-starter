import { NextRequest, NextResponse } from "next/server"

import { getAuth } from "@/lib/auth"
import { PrivateStrapiClient, PublicStrapiClient } from "@/lib/strapi-api"

export async function GET(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  const session = await getAuth()

  if (!session?.strapiJWT) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    // Get the project/template
    const projectResponse = await PublicStrapiClient.fetchAPI(
      `/projects/${params.projectId}`,
      {
        populate: ["plan"],
      }
    )

    if (!projectResponse?.data) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 })
    }

    const project = projectResponse.data

    // Get user profile
    const profileResponse = await PrivateStrapiClient.fetchAPI(
      `/user-profiles`,
      {
        filters: {
          userId: session.user.userId,
        },
        populate: ["plan"],
      },
      undefined,
      { userJWT: session.strapiJWT }
    )

    if (!profileResponse?.data?.[0]) {
      return NextResponse.json(
        { error: "User profile not found" },
        { status: 404 }
      )
    }

    const userProfile = profileResponse.data[0]
    const userPlan = userProfile.attributes.currentPlan || "free"

    // Check if user has access to this template
    const requiredPlan = project.attributes.requiredPlan || "free"
    const planHierarchy = ["free", "starter", "professional", "enterprise"]
    const userPlanLevel = planHierarchy.indexOf(userPlan)
    const requiredPlanLevel = planHierarchy.indexOf(requiredPlan)

    if (userPlanLevel < requiredPlanLevel) {
      return NextResponse.json(
        {
          error: "Upgrade required",
          message: `This template requires ${requiredPlan} plan or higher`,
          requiredPlan,
          currentPlan: userPlan,
        },
        { status: 403 }
      )
    }

    // Check quota
    const quotaLimit = userProfile.attributes.monthlyRemixesLimit
    const quotaUsed = userProfile.attributes.monthlyRemixesUsed

    if (quotaLimit !== -1 && quotaUsed >= quotaLimit) {
      // Check if quota reset date has passed
      const resetDate = new Date(userProfile.attributes.quotaResetDate)
      const now = new Date()

      if (now < resetDate) {
        return NextResponse.json(
          {
            error: "Quota exceeded",
            message:
              "Monthly template quota exceeded. Please upgrade your plan or wait for quota reset.",
            quotaResetDate: resetDate,
            quotaLimit,
            quotaUsed,
          },
          { status: 429 }
        )
      } else {
        // Reset quota
        await PrivateStrapiClient.fetchAPI(
          `/user-profiles/${userProfile.id}`,
          undefined,
          {
            method: "PUT",
            body: JSON.stringify({
              data: {
                monthlyRemixesUsed: 0,
                quotaResetDate: new Date(now.setMonth(now.getMonth() + 1)),
              },
            }),
          },
          { userJWT: session.strapiJWT }
        )
      }
    }

    // Log the template access
    await PrivateStrapiClient.fetchAPI(
      `/template-access-logs`,
      undefined,
      {
        method: "POST",
        body: JSON.stringify({
          data: {
            userId: session.user.userId,
            projectId: params.projectId,
            initiatedAt: new Date(),
            templateTitle: project.attributes.title,
            userPlan,
          },
        }),
      },
      { userJWT: session.strapiJWT }
    )

    // Update user's template access count
    await PrivateStrapiClient.fetchAPI(
      `/user-profiles/${userProfile.id}`,
      undefined,
      {
        method: "PUT",
        body: JSON.stringify({
          data: {
            monthlyRemixesUsed: quotaUsed + 1,
            totalRemixes: (userProfile.attributes.totalRemixes || 0) + 1,
          },
        }),
      },
      { userJWT: session.strapiJWT }
    )

    // Get remix URL (Framer template link)
    const remixUrl = project.attributes.remixUrl || "#"

    // The remix URL is a Framer link that opens the template
    // for duplication in the user's Framer account

    return NextResponse.json({
      success: true,
      remixUrl,
      template: {
        id: project.id,
        title: project.attributes.title,
        description: project.attributes.description,
      },
      quota: {
        used: quotaUsed + 1,
        limit: quotaLimit,
        resetDate: userProfile.attributes.quotaResetDate,
      },
    })
  } catch (error) {
    console.error("Remix error:", error)
    return NextResponse.json(
      { error: "Failed to process template access" },
      { status: 500 }
    )
  }
}
