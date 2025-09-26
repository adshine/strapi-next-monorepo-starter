const pagePopulateObject: any = {
  parent: {
    populate: {
      parent: true,
    },
  },
  children: true,
  content: {
    populate: "*",
  },
  favoritedBy: true,
}

export const registerPopulatePageMiddleware = ({ strapi }: { strapi: any }) => {
  strapi.documents.use((context: any, next: any) => {
    if (context.action === "findOne" || context.action === "findFirst") {
      if (context.contentType?.uid === "api::page.page") {
        const queryParamPopulate = context.params?.middlewarePopulate

        if (queryParamPopulate) {
          const pageKeys = Object.keys(pagePopulateObject || {})
          const populateToSet = queryParamPopulate
            .split(",")
            .filter((populateAttr: string) => pageKeys.includes(populateAttr))
            .reduce((acc: any, populateAttr: string) => {
              acc[populateAttr] = pagePopulateObject[populateAttr]
              return acc
            }, {})

          context.params.populate = populateToSet
        }
      }
    }

    return next()
  })
}
