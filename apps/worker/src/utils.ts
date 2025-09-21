import { jwtVerify, SignJWT } from "jose"

export async function verifyJWT(token: string, secret: string): Promise<any> {
  try {
    const encoder = new TextEncoder()
    const { payload } = await jwtVerify(token, encoder.encode(secret))
    return payload
  } catch (error) {
    console.error("JWT verification failed:", error)
    return null
  }
}

export async function signJWT(
  payload: any,
  secret: string,
  expiresIn: string = "1h"
): Promise<string> {
  const encoder = new TextEncoder()
  const jwt = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(encoder.encode(secret))
  return jwt
}

export function createErrorResponse(
  message: string,
  status: number = 400,
  headers: Record<string, string> = {}
): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  })
}

export function createSuccessResponse(
  data: any,
  headers: Record<string, string> = {}
): Response {
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  })
}

export async function generateSignedUrl(
  bucket: R2Bucket,
  key: string,
  expiresIn: number = 900
): Promise<string | null> {
  try {
    // Check if object exists
    const object = await bucket.head(key)
    if (!object) {
      return null
    }

    // Generate signed URL
    // Note: R2 signed URLs require additional configuration
    // This is a placeholder - actual implementation depends on your R2 setup
    const url = `https://r2.cloudflarestorage.com/${bucket}/${key}`
    return url
  } catch (error) {
    console.error("Error generating signed URL:", error)
    return null
  }
}
