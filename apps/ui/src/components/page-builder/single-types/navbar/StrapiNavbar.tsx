import { Data } from "@repo/strapi"
import { getTranslations } from "next-intl/server"

import { AppLocale } from "@/types/general"

import { getAuth } from "@/lib/auth"
import { fetchNavbar } from "@/lib/strapi-api/content/server"
import { cn } from "@/lib/styles"
import AppLink from "@/components/elementary/AppLink"
import LocaleSwitcher from "@/components/elementary/LocaleSwitcher"
import StrapiImageWithLink from "@/components/page-builder/components/utilities/StrapiImageWithLink"
import StrapiLink from "@/components/page-builder/components/utilities/StrapiLink"
import { LoggedUserMenu } from "@/components/page-builder/single-types/navbar/LoggedUserMenu"

const hardcodedLinks: NonNullable<
  Data.ContentType<"api::navbar.navbar">["links"]
> = [{ id: "client-page", href: "/client-page", label: "Client Page" }]

export async function StrapiNavbar({ locale }: { readonly locale: AppLocale }) {
  const response = await fetchNavbar(locale)
  const navbar = response?.data

  const t = await getTranslations("navbar")
  const session = await getAuth()

  // Fallback navigation when Strapi data is unavailable
  const fallbackLinks = [
    { id: "templates", href: "/templates", label: "Templates" },
    { id: "pricing", href: "/pricing", label: "Pricing" },
    { id: "dashboard", href: "/dashboard", label: "Dashboard" },
  ]

  const links = navbar?.links
    ? (navbar.links ?? []).filter((link) => link.href).concat(...hardcodedLinks)
    : fallbackLinks

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--border-neutral)] bg-[var(--bg-elevated)]/90 shadow-sm backdrop-blur transition-colors duration-300">
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        <div className="flex gap-6 md:gap-10">
          {navbar?.logoImage ? (
            <StrapiImageWithLink
              component={navbar.logoImage}
              linkProps={{ className: "flex items-center space-x-2" }}
              imageProps={{
                forcedSizes: { width: 90, height: 60 },
                hideWhenMissing: true,
              }}
            />
          ) : (
            <AppLink href="/" className="text-xl font-bold text-[var(--text-primary)]">
              FramerTemplates
            </AppLink>
          )}

          {links.length > 0 ? (
            <nav className="flex gap-6">
              {links.map((link) => (
                <StrapiLink
                  component={link}
                  key={link.href}
                  className={cn(
                    "flex items-center text-sm font-medium text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
                  )}
                />
              ))}
            </nav>
          ) : null}
        </div>

        <div className="flex items-center space-x-4">
          {session?.user ? (
            <nav className="flex items-center space-x-1">
              <LoggedUserMenu user={session.user} />
            </nav>
          ) : (
            <AppLink
              href="/auth/signin"
              className="text-sm font-medium text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
            >
              {t("actions.signIn")}
            </AppLink>
          )}
          <LocaleSwitcher locale={locale} />
        </div>
      </div>
    </header>
  )
}

StrapiNavbar.displayName = "StrapiNavbar"

export default StrapiNavbar
