import { Data } from "@strapi/strapi"

export interface Breadcrumb {
  title: string
  path: string
}

export function getFullPathFromQuery(ctx: any): string | null {
  const { query } = ctx
  return query?.filters?.fullPath?.$eq || null
}

export async function generateBreadcrumbs(
  document: any,
  contentType: string
): Promise<Breadcrumb[]> {
  if (contentType === "api::page.page") {
    return fetchPageBreadcrumbs(document)
  }
  return []
}

export async function fetchPageBreadcrumbs(
  document: Data.ContentType<"api::page.page">,
  locale?: string
): Promise<Breadcrumb[]> {
  const breadcrumbs: Breadcrumb[] = [
    {
      title: document.breadcrumbTitle ?? document.title ?? "",
      path: document.fullPath ?? "",
    },
  ]

  let hierarchy = await strapi.documents("api::page.page").findOne({
    documentId: document.documentId,
    populate: "parent",
    locale: locale ?? document.locale ?? undefined,
  })

  const parent = (hierarchy as any)?.parent ?? null
  let currentParent = parent

  while (currentParent) {
    breadcrumbs.unshift({
      title: currentParent.breadcrumbTitle ?? currentParent.title ?? "",
      path: currentParent.fullPath ?? "",
    })

    const parentPage = await strapi.documents("api::page.page").findOne({
      documentId: currentParent.documentId,
      populate: "parent",
      locale,
    })

    currentParent = (parentPage as any)?.parent ?? null
  }

  return breadcrumbs
}
