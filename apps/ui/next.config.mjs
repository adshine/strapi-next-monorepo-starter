import withPlaiceholder from "@plaiceholder/next"
// import { withSentryConfig } from "@sentry/nextjs"
// import plugin from "next-intl/plugin"

import { env } from "./src/env.mjs"

// Temporarily disable Sentry and i18n for debugging
// const withSentryConfig = require('@sentry/nextjs').withSentryConfig
// const withNextIntl = plugin("./src/lib/i18n.ts")

// Temporarily disable Sentry by removing config files

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: env.NEXT_OUTPUT,
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack: (config, { isServer }) => {
    // Completely exclude problematic modules
    if (isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@opentelemetry/instrumentation': false,
        '@opentelemetry/api': false,
        '@sentry/opentelemetry': false,
        '@sentry/nextjs': false,
      }
    }
    return config
  },
  experimental: {
    // Disable webpack 5 features that might cause issues
    optimizePackageImports: [],
    turbo: {
      rules: {
        "*.svg": {
          loaders: ["@svgr/webpack"],
          as: "*.js",
        },
      },
    },
  },
  experimental: {},
  transpilePackages: ["@repo/design-system"],
  images: {
    // Be aware that Strapi has optimization on by default
    // Do not optimize all images by default.
    // This is because the optimization process can be slow and resource-intensive. Instead, only optimize images that are requested by the browser.
    unoptimized: false,

    // AVIF generally takes 20% longer to encode but it compresses 20% smaller compared to WebP.
    // This means that the first time an image is requested, it will typically be slower and then subsequent requests that are cached will be faster.
    formats: ["image/webp" /* 'image/avif' */],

    // The optimized image file will be served for subsequent requests until the expiration is reached.
    // When a request is made that matches a cached but expired file, the expired image is served stale immediately.
    // Then the image is optimized again in the background (also called revalidation) and saved to the cache with the new expiration date.
    minimumCacheTTL: 60 * 15, // 15 minutes - after this time, the image will be revalidated

    // You can configure deviceSizes or imageSizes to reduce the total number of possible generated images.
    // Please check: https://nextjs.org/docs/14/app/api-reference/components/image#imagesizes
    deviceSizes: [420, 768, 1024],

    remotePatterns: [
      {
        protocol: "https",
        hostname: "*",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
      },
    ],
  },

  webpack: (config, { dev }) => {
    if (config.cache && !dev) {
      // Switching between memory and filesystem cache
      // Memory cache is faster and can be beneficial in environments with slow or limited disk access,
      // but it isn't persistent across builds and requires higher memory usage.
      // Filesystem cache survives across builds but may cause large `.next/cache` folder.
      config.cache = Object.freeze({
        type: env.WEBPACK_CACHE_TYPE || "filesystem",
      })
    }
    return config
  },
}

// Temporarily disable complex wrappers for debugging
export default nextConfig
