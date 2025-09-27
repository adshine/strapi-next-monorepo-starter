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
          <div className="flex h-[22px] w-[22px] items-center justify-center scale-y-[-1]">
            <Image
              src="/logo.png"
              alt="FramerDojo Logo"
              width={22}
              height={22}
              className="object-cover"
            />
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

      <div className="mx-auto w-full max-w-[1440px] px-[64px]">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {loading
          ? Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="flex animate-pulse flex-col gap-[6px]">
                <div className="aspect-[4/5] w-full rounded-[12px] bg-gray-200" />
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
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[12px]">
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
      </div>
    </div>
  )
}

export default MarketingLandingPage
