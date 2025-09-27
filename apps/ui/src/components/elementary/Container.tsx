import React from "react"

import { cn } from "@/lib/styles"

export const Container = ({
  children,
  className,
  hideDefaultPadding,
}: {
  readonly children: React.ReactNode
  readonly className?: string
  readonly hideDefaultPadding?: boolean
}) => {
  return (
    <div
      className={cn(
        "mx-auto w-full",
        hideDefaultPadding ? "max-w-[1440px]" : "max-w-[1440px] px-[64px]",
        className
      )}
    >
      {children}
    </div>
  )
}
