import { notFound } from "next/navigation"
import { ROOT_PAGE_PATH } from "@repo/shared-data"
import { setRequestLocale } from "next-intl/server"

import type { PageProps } from "@/types/next"
import type { Metadata } from "next"

import { isDevelopment } from "@/lib/general-helpers"
import { getMetadataFromStrapi } from "@/lib/metadata"
import { routing } from "@/lib/navigation"
import { fetchAllPages, fetchPage } from "@/lib/strapi-api/content/server"
import { cn } from "@/lib/styles"
import { Breadcrumbs } from "@/components/elementary/Breadcrumbs"
import { Container } from "@/components/elementary/Container"
import { ErrorBoundary } from "@/components/elementary/ErrorBoundary"
import { MarketingLandingPage } from "@/components/marketing/landing-page"
import { PageContentComponents } from "@/components/page-builder"
import StrapiStructuredData from "@/components/page-builder/components/seo-utilities/StrapiStructuredData"

type Props = PageProps<{
  rest: string[]
}>

export async function generateStaticParams() {
  if (isDevelopment()) {
    return []
  }

  try {
    const promises = routing.locales.map((locale) =>
      fetchAllPages("api::page.page", locale)
    )

    const results = await Promise.allSettled(promises)

    return results
      .filter((result) => result.status === "fulfilled")
      .flatMap((result) => result.value.data)
      .map((page) => ({
        locale: page.locale,
        rest: [page.slug],
      }))
  } catch (error) {
    console.warn("generateStaticParams fallback triggered", error)
    return []
  }
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const restSegments = params.rest?.filter(Boolean) ?? []
  const fullPath = ROOT_PAGE_PATH + restSegments.join("/")

  try {
    return await getMetadataFromStrapi({ fullPath, locale: params.locale })
  } catch (error) {
    const isRootRequest = restSegments.length === 0
    if (!isRootRequest) {
      throw error
    }

    return {
      title: "FramerDojo Templates",
      description:
        "Premium Framer templates, pricing, and subscription tiers you can explore without connecting to the CMS.",
    }
  }
}

export default async function StrapiPage(props: Props) {
  const params = await props.params
  const restSegments = params.rest?.filter(Boolean) ?? []
  const isRootRequest = restSegments.length === 0

  setRequestLocale(params.locale)

  const fullPath = ROOT_PAGE_PATH + restSegments.join("/")

  if (isRootRequest) {
    return <MarketingLandingPage />
  }

  let response: Awaited<ReturnType<typeof fetchPage>> | null = null

  try {
    response = await fetchPage(fullPath, params.locale)
  } catch (error) {
    console.warn("fetchPage failed", {
      error,
      fullPath,
      locale: params.locale,
    })
    notFound()
  }

  const data = response?.data
  const content = data?.content?.filter((comp) => comp != null) ?? []

  if (content.length === 0) {
    notFound()
  }

  const { content: _unused, ...restPageData } = data

  return (
    <>
      <StrapiStructuredData structuredData={data?.seo?.structuredData} />

      <main className={cn("flex w-full flex-col overflow-hidden")}>
        <Container>
          <Breadcrumbs
            breadcrumbs={response?.meta?.breadcrumbs}
            className="mt-6 mb-6"
          />
        </Container>

        {content.map((comp) => {
          const name = comp.__component
          const id = comp.id
          const key = `${name}-${id}`
          const Component = PageContentComponents[name]

          if (Component == null) {
            console.warn(`Unknown component "${name}" with id "${id}".`)

            return (
              <div key={key} className="font-medium text-red-500">
                Component &quot;{key}&quot; is not implemented on the frontend.
              </div>
            )
          }

          return (
            <ErrorBoundary key={key}>
              <div className={cn("mb-4 md:mb-12 lg:mb-16")}>
                <Component
                  component={comp}
                  pageParams={params}
                  page={restPageData}
                />
              </div>
            </ErrorBoundary>
          )
        })}
      </main>
    </>
  )
}
