import { NextRequest, NextResponse } from "next/server"

import { getAuth } from "@/lib/auth"
import { PrivateStrapiClient } from "@/lib/strapi-api"

export async function GET() {
  const session = await getAuth()

  if (!session?.strapiJWT) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    // Fetch user profile from Strapi
    const userProfile = await PrivateStrapiClient.fetchAPI(
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

    if (!userProfile?.data?.[0]) {
      // Create user profile if it doesn't exist
      const newProfile = await PrivateStrapiClient.fetchAPI(
        `/user-profiles`,
        undefined,
        {
          method: "POST",
          body: JSON.stringify({
            data: {
              userId: session.user.userId,
              email: session.user.email,
              currentPlan: "free",
              monthlyRemixesLimit: 5,
              monthlyRemixesUsed: 0,
              quotaResetDate: new Date(
                new Date().setMonth(new Date().getMonth() + 1)
              ),
              totalRemixes: 0,
              subscriptionStatus: "active",
            },
          }),
        },
        { userJWT: session.strapiJWT }
      )

      return NextResponse.json(newProfile.data)
    }

    return NextResponse.json(userProfile.data[0])
  } catch (error) {
    console.error("Error fetching user profile:", error)
    return NextResponse.json(
      { error: "Failed to fetch user profile" },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  const session = await getAuth()

  if (!session?.strapiJWT) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()

    // First, get the user profile to find its ID
    const userProfile = await PrivateStrapiClient.fetchAPI(
      `/user-profiles`,
      {
        filters: {
          userId: session.user.userId,
        },
      },
      undefined,
      { userJWT: session.strapiJWT }
    )

    if (!userProfile?.data?.[0]) {
      return NextResponse.json(
        { error: "User profile not found" },
        { status: 404 }
      )
    }

    // Update the user profile
    const updatedProfile = await PrivateStrapiClient.fetchAPI(
      `/user-profiles/${userProfile.data[0].id}`,
      undefined,
      {
        method: "PUT",
        body: JSON.stringify({
          data: body,
        }),
      },
      { userJWT: session.strapiJWT }
    )

    return NextResponse.json(updatedProfile.data)
  } catch (error) {
    console.error("Error updating user profile:", error)
    return NextResponse.json(
      { error: "Failed to update user profile" },
      { status: 500 }
    )
  }
}
