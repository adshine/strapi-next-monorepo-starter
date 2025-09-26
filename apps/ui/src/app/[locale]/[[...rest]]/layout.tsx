import { AuthProvider } from "@/lib/auth-context"

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <AuthProvider>
      <main className="min-h-screen">{children}</main>
    </AuthProvider>
  )
}
