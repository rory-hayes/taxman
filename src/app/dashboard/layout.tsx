import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import { MainNav } from '@/components/dashboard/main-nav'
import { UserNav } from '@/components/dashboard/user-nav'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createServerClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect('/auth/login')
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="border-b bg-white/80 backdrop-blur-md">
        <div className="flex h-16 items-center px-4">
          <MainNav className="mx-6" />
          <div className="ml-auto flex items-center space-x-4">
            <UserNav />
          </div>
        </div>
      </div>
      <div className="flex-1 px-4 py-8 md:px-8 lg:px-12">
        {children}
      </div>
    </div>
  )
} 