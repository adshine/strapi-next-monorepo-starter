import { PAGES_HIERARCHY_ENABLED } from "../../../../utils/constants"
import { handleHierarchyBeforeCreate } from "../../../../utils/hierarchy"

export default {
  async beforeCreate(event: any) {
    if (PAGES_HIERARCHY_ENABLED) {
      await handleHierarchyBeforeCreate(event, "api::page.page")
    }
  },
}
