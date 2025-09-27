import { Data } from "@strapi/strapi"

import { hierarchyService } from "../api/internal-job/services/hierarchyService"
import { getNewPageFullPath } from "./pages"

async function updateFullPath(
  documentType: "api::page.page",
  documentId: string,
  fullPath: string
) {
  await strapi.documents(documentType).update({
    documentId,
    data: { fullPath },
  })
}

/**
 * This should be added to all collection types that are hierarchical.
 * It sets the full path for the document before it is created.
 */
export async function handleHierarchyBeforeCreate(
  event: any,
  documentType: "api::page.page"
) {
  const data = event.params?.data || {}

  const newData = event.params.data
  const fullPath = await getNewPageFullPath({
    parent: newData.parent,
    slug: newData.slug,
  })

  newData.fullPath = fullPath
}
