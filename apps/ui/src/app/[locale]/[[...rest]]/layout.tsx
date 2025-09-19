import { AuthProvider } from "@/lib/auth-context"
import { AppHeader } from "@/components/ui/app-header"

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <AuthProvider>
      <AppHeader />
      <main className="min-h-[calc(100vh-64px)]">{children}</main>
    </AuthProvider>
  )
}
