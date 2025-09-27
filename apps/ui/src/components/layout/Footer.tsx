import Image from "next/image"
import Link from "next/link"

import { Container } from "@/components/elementary/Container"

export function Footer() {
  return (
    <footer className="w-full border-t bg-white shadow-sm">
      <Container className="py-8">
        <div className="mb-12 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded bg-red-600" />
            <span className="text-xl font-bold">FramerDojo</span>
          </Link>

          <nav className="flex items-center space-x-8">
            <Link
              href="/templates"
              className="text-sm font-medium text-gray-900 hover:text-gray-600"
            >
              All Templates
            </Link>
            <Link
              href="/pricing"
              className="text-sm font-medium text-gray-900 hover:text-gray-600"
            >
              Pricing
            </Link>
            <Link
              href="/auth/signin"
              className="text-sm font-medium text-gray-900 hover:text-gray-600"
            >
              Sign In
            </Link>
            <Link
              href="/auth/register"
              className="text-sm font-medium text-gray-900 hover:text-gray-600"
            >
              Sign Up
            </Link>
          </nav>
        </div>

        <div className="mb-8">
          <h2 className="text-[64px] leading-none font-black tracking-tight text-gray-900 md:text-[96px] lg:text-[120px]">
            Framer Dojo
          </h2>
        </div>

        <div className="flex items-center justify-between border-t pt-6">
          <div className="flex items-center space-x-6">
            <Link
              href="/privacy"
              className="text-sm text-gray-600 underline hover:text-gray-900"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-sm text-gray-600 underline hover:text-gray-900"
            >
              Terms of Service
            </Link>
            <Link
              href="/cookies"
              className="text-sm text-gray-600 underline hover:text-gray-900"
            >
              Cookies Settings
            </Link>
          </div>

          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} Framer Dojo. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  )
}
