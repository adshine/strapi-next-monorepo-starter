import { Data } from "@repo/strapi"
import { Coins } from "lucide-react"
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
import { Button } from "@/components/ui/button"

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
    { id: "templates", href: "/templates", label: "All Templates" },
    { id: "pricing", href: "/pricing", label: "Pricing" },
  ]

  const links = navbar?.links
    ? (navbar.links ?? []).filter((link) => link.href).concat(...hardcodedLinks)
    : fallbackLinks

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-16">
        <div className="flex items-center gap-8">
          {navbar?.logoImage ? (
            <StrapiImageWithLink
              component={navbar.logoImage}
              linkProps={{ className: "flex items-center gap-2" }}
              imageProps={{
                forcedSizes: { width: 90, height: 60 },
                hideWhenMissing: true,
              }}
            />
          ) : (
            <AppLink href="/" className="flex items-center gap-2">
              <div className="flex h-[22px] w-[22px] items-center justify-center">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 22 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="scale-y-[-1]"
                >
                  <rect width="22" height="22" rx="4" fill="#ef1d0c" />
                </svg>
              </div>
              <span className="font-instrument-sans text-[12.897px] leading-[9.673px] font-semibold tracking-[-0.5159px] text-black capitalize">
                Framer Dojo
              </span>
            </AppLink>
          )}

          <nav className="flex items-center gap-8">
            {session?.user && (
              <div className="flex items-center gap-3 rounded-[24px] border-[0.5px] border-gray-200 bg-white px-5 py-2 shadow-sm">
                <span className="font-roboto text-[16px] leading-[1.5] text-black">
                  3
                </span>
                <Coins className="h-5 w-5 text-black" />
              </div>
            )}

            {links.map((link) => (
              <StrapiLink
                component={link}
                key={link.href}
                className="font-roboto text-[16px] leading-[1.5] text-black transition-colors hover:text-[#ef1d0c]"
              />
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {session?.user ? (
            <LoggedUserMenu user={session.user} />
          ) : (
            <>
              <AppLink href="/auth/signin">
                <Button
                  variant="outline"
                  className="font-roboto rounded-[24px] border-[0.5px] border-gray-200 bg-white px-5 py-2 text-[16px] leading-[1.5] text-black shadow-sm hover:bg-gray-50"
                >
                  {t("actions.signIn")}
                </Button>
              </AppLink>
              <AppLink href="/auth/register">
                <Button className="font-roboto rounded-[24px] bg-black px-5 py-2 text-[16px] leading-[1.5] text-white hover:bg-black/90">
                  Sign Up
                </Button>
              </AppLink>
            </>
          )}
          <LocaleSwitcher locale={locale} />
        </div>
      </div>
    </header>
  )
}

StrapiNavbar.displayName = "StrapiNavbar"

export default StrapiNavbar
