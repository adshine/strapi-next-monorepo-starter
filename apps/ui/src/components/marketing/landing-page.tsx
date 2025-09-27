"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Share2 } from "lucide-react"

import { projectsAPI } from "@/lib/api/projects"
import { Button } from "@/components/ui/button"

export function MarketingLandingPage() {
  const [templates, setTemplates] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const templatesData = await projectsAPI.getAllProjects({
          pagination: { pageSize: 12 },
        })
        setTemplates(templatesData.slice(0, 12))
      } catch (error) {
        console.error("Failed to fetch templates:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <div className="flex min-h-screen flex-col gap-[100px] bg-white">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center gap-[80px] px-4 py-16">
        <div className="flex w-full max-w-[768px] flex-col items-center gap-8 text-center">
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

          <div className="flex flex-col gap-6">
            <h1 className="font-instrument-sans text-[56px] leading-none font-bold tracking-[-3.92px] text-black">
              <span className="font-instrument-serif font-normal tracking-[-1.12px] italic">
                Premium
              </span>{" "}
              <span className="font-instrument-sans font-normal tracking-[-1.12px]">
                Templates,
              </span>
              <br />
              <span className="font-instrument-sans font-normal tracking-[-1.12px]">
                Unlimited Creativity
              </span>
            </h1>

            <p className="font-instrument-sans text-[18px] leading-[1.5] text-black/80">
              Professional Framer templates designed for Business owners,
              developers and designers. Skip the design phase and focus on what
              matters.
            </p>
          </div>

          <Link href="/templates">
            <Button
              size="lg"
              className="font-roboto rounded-[24px] bg-[#ef1d0c] px-6 py-3 text-[16px] leading-[1.5] font-normal text-white hover:bg-[#ef1d0c]/90"
            >
              Browse Templates
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 px-[120px] md:grid-cols-2 lg:grid-cols-4">
        {loading
          ? Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="flex animate-pulse flex-col gap-[6px]">
                <div className="aspect-[285/399] w-full rounded-[12px] bg-gray-200" />
                <div className="flex items-center justify-between">
                  <div className="h-4 w-32 rounded bg-gray-200" />
                  <div className="h-7 w-7 rounded bg-gray-200" />
                </div>
              </div>
            ))
          : templates.map((template) => (
              <Link
                key={template.id}
                href={`/templates/${template.slug}`}
                className="group flex flex-col gap-[6px]"
              >
                <div className="relative aspect-[285/399] w-full overflow-hidden rounded-[12px]">
                  {template.featuredImage?.url || template.thumbnailUrl ? (
                    <Image
                      src={template.featuredImage?.url || template.thumbnailUrl}
                      alt={template.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                      <span className="text-gray-400">No image</span>
                    </div>
                  )}

                  <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <Button
                      size="lg"
                      className="font-roboto rounded-[24px] bg-[#ef1d0c] px-6 py-3 text-[16px] leading-[1.5] font-normal text-white hover:bg-[#ef1d0c]/90"
                    >
                      Button
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <h3 className="font-instrument-sans text-[14px] leading-[9.673px] font-medium text-black capitalize">
                    {template.title}
                  </h3>
                  <button
                    className="flex h-7 w-7 items-center justify-center rounded-[4px] px-2 hover:bg-gray-100"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                    }}
                  >
                    <Share2 className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
              </Link>
            ))}
      </div>

      <footer className="w-full border-t border-gray-200 bg-white">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-12 px-[120px] py-20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
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
            </div>

            <div className="font-roboto flex items-center gap-8 text-[14px] leading-[1.5] font-semibold text-black">
              <Link href="/templates" className="hover:text-[#ef1d0c]">
                All Templates
              </Link>
              <Link href="/pricing" className="hover:text-[#ef1d0c]">
                Pricing
              </Link>
              <Link href="/auth/signin" className="hover:text-[#ef1d0c]">
                Sign In
              </Link>
              <Link href="/auth/register" className="hover:text-[#ef1d0c]">
                Sign Up
              </Link>
            </div>
          </div>

          <div className="flex w-full flex-col items-center gap-16 overflow-hidden">
            <h2 className="font-instrument-sans w-full text-center text-[clamp(80px,16vw,234.146px)] leading-none font-semibold tracking-[-0.07em] whitespace-nowrap text-black">
              Framer Dojo
            </h2>
          </div>

          <div className="flex flex-col gap-8">
            <div className="h-px w-full bg-gray-200" />

            <div className="font-roboto flex items-center justify-between text-[14px] leading-[1.5] font-normal text-black">
              <div className="flex gap-6">
                <Link
                  href="/privacy-policy"
                  className="underline hover:text-[#ef1d0c]"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="/terms-of-service"
                  className="underline hover:text-[#ef1d0c]"
                >
                  Terms of Service
                </Link>
                <Link
                  href="/cookies-settings"
                  className="underline hover:text-[#ef1d0c]"
                >
                  Cookies Settings
                </Link>
              </div>
              <span>© 2026 Framer Dojo. All rights reserved.</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default MarketingLandingPage
