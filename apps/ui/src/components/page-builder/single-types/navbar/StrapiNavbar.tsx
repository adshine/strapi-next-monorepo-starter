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
> = []

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
    ? (navbar.links ?? []).filter((link) => link.href)
    : fallbackLinks

  return (
    <header className="sticky top-0 z-40 w-full bg-white">
      <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-[64px]">
        {/* Logo Section */}
        <div className="flex shrink-0 items-center gap-[8px]">
          {navbar?.logoImage ? (
            <StrapiImageWithLink
              component={navbar.logoImage}
              linkProps={{ className: "flex items-center gap-[8px]" }}
              imageProps={{
                forcedSizes: { width: 22, height: 22 },
                hideWhenMissing: true,
              }}
            />
          ) : (
            <AppLink href="/" className="flex items-center gap-[8px]">
              <div className="flex shrink-0 items-center justify-center">
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
              <div className="flex flex-col items-start gap-[5px]">
                <span className="font-instrument-sans text-[12.897px] leading-[9.673px] font-semibold tracking-[-0.5159px] whitespace-nowrap text-black capitalize">
                  Framer Dojo
                </span>
              </div>
            </AppLink>
          )}
        </div>

        {/* Right Side: Navigation Links + Auth */}
        <div className="flex shrink-0 items-center gap-[24px]">
          {/* Navigation Links with Coin Badge */}
          <nav className="flex items-center gap-[32px]">
            {/* Coin Badge - Always visible */}
            <div className="relative shrink-0 rounded-[24px] bg-white">
              <div className="box-border flex items-center justify-center gap-[12px] px-[20px] py-[8px]">
                <span className="font-roboto text-[16px] leading-[1.5] font-normal whitespace-nowrap text-black">
                  3
                </span>
                <Coins
                  className="h-5 w-5 shrink-0 text-black"
                  strokeWidth={1.5}
                />
              </div>
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-[-0.5px] rounded-[24.5px] border-[0.5px] border-[rgba(0,0,0,0.12)]"
              />
            </div>

            {/* Navigation Links */}
            {links.map((link) => (
              <StrapiLink
                component={link}
                key={link.href}
                className="font-roboto text-[16px] leading-[1.5] font-normal whitespace-nowrap text-black"
              />
            ))}
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center gap-[12px]">
            {session?.user ? (
              <LoggedUserMenu user={session.user} />
            ) : (
              <>
                <AppLink href="/auth/signin">
                  <div className="shrink-0 rounded-[24px] border border-gray-200 bg-white">
                    <div className="flex items-center justify-center gap-[8px] px-[20px] py-[8px]">
                      <span className="font-roboto text-[16px] leading-[1.5] font-normal whitespace-nowrap text-black">
                        Login
                      </span>
                    </div>
                  </div>
                </AppLink>
                <AppLink href="/auth/register">
                  <div className="box-border flex shrink-0 items-center justify-center gap-[8px] rounded-[24px] bg-black px-[20px] py-[8px]">
                    <span className="font-roboto text-[16px] leading-[1.5] font-normal whitespace-nowrap text-white">
                      Sign Up
                    </span>
                  </div>
                </AppLink>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

StrapiNavbar.displayName = "StrapiNavbar"

export default StrapiNavbar
