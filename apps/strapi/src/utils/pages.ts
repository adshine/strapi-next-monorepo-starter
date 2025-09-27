import { ROOT_PAGE_PATH } from "@repo/shared-data"

export async function getNewPageFullPath({
  parent,
  slug,
}: {
  parent?: string | null
  slug?: string | null
}): Promise<string> {
  if (!slug) return ""

  // If there's a parent, fetch it to get its fullPath
  if (parent) {
    const parentPage = await strapi.documents("api::page.page").findOne({
      documentId: parent,
      fields: ["fullPath"],
    })

    if (parentPage?.fullPath) {
      return joinPaths(parentPage.fullPath, slug)
    }
  }

  // No parent or parent not found - this is a root page
  return joinPaths(ROOT_PAGE_PATH, slug)
}

function joinPaths(...paths: Array<string | undefined | null>) {
  const joinedPath = paths
    .filter(Boolean)
    .flatMap((path) => path!.split("/"))
    .filter(Boolean)
    .join("/")

  return `${ROOT_PAGE_PATH}${joinedPath}`
}
