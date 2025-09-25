import { PrivateClient } from "./private"
import { PublicClient } from "./public"

// Export classes for direct instantiation (avoids circular dependency)
export { PrivateClient, PublicClient }

// Create singleton instances lazily
let publicClientInstance: PublicClient | null = null
let privateClientInstance: PrivateClient | null = null

function getPublicClient(): PublicClient {
  if (!publicClientInstance) {
    publicClientInstance = new PublicClient()
  }
  return publicClientInstance
}

function getPrivateClient(): PrivateClient {
  if (!privateClientInstance) {
    privateClientInstance = new PrivateClient()
  }
  return privateClientInstance
}

// Export singleton wrappers with all methods
export const PublicStrapiClient = {
  fetchAPI: (...args: Parameters<PublicClient["fetchAPI"]>) =>
    getPublicClient().fetchAPI(...args),
  fetchOne: (...args: Parameters<PublicClient["fetchOne"]>) =>
    getPublicClient().fetchOne(...args),
  fetchMany: (...args: Parameters<PublicClient["fetchMany"]>) =>
    getPublicClient().fetchMany(...args),
  fetchAll: (...args: Parameters<PublicClient["fetchAll"]>) =>
    getPublicClient().fetchAll(...args),
  fetchOneBySlug: (...args: Parameters<PublicClient["fetchOneBySlug"]>) =>
    getPublicClient().fetchOneBySlug(...args),
  fetchOneByFullPath: (
    ...args: Parameters<PublicClient["fetchOneByFullPath"]>
  ) => getPublicClient().fetchOneByFullPath(...args),
}

export const PrivateStrapiClient = {
  get: (...args: Parameters<PrivateClient["get"]>) =>
    getPrivateClient().get(...args),
  post: (...args: Parameters<PrivateClient["post"]>) =>
    getPrivateClient().post(...args),
  put: (...args: Parameters<PrivateClient["put"]>) =>
    getPrivateClient().put(...args),
  delete: (...args: Parameters<PrivateClient["delete"]>) =>
    getPrivateClient().delete(...args),
  fetchAPI: (...args: Parameters<PrivateClient["fetchAPI"]>) =>
    getPrivateClient().fetchAPI(...args),
  fetchOne: (...args: Parameters<PrivateClient["fetchOne"]>) =>
    getPrivateClient().fetchOne(...args),
  fetchMany: (...args: Parameters<PrivateClient["fetchMany"]>) =>
    getPrivateClient().fetchMany(...args),
  fetchAll: (...args: Parameters<PrivateClient["fetchAll"]>) =>
    getPrivateClient().fetchAll(...args),
  fetchOneBySlug: (...args: Parameters<PrivateClient["fetchOneBySlug"]>) =>
    getPrivateClient().fetchOneBySlug(...args),
  fetchOneByFullPath: (
    ...args: Parameters<PrivateClient["fetchOneByFullPath"]>
  ) => getPrivateClient().fetchOneByFullPath(...args),
}
