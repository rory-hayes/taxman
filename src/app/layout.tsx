import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/app/globals.css'
import { AuthProvider } from '@/providers/supabase-auth-provider'
import { DollarSign, PiggyBank, Calculator, BarChart3, Receipt, Settings, Search, Bell, User } from 'lucide-react'
import Link from "next/link"

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'TaxMan - Smart Financial Dashboard',
  description: 'Take control of your finances with AI-powered insights',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <div className="min-h-screen">
            {/* Sidebar */}
            <aside className="fixed left-0 top-0 z-40 h-full w-16 border-r bg-background transition-all duration-300 hover:w-64">
              <div className="flex h-14 items-center justify-center border-b px-4">
                <Link href="/" className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <DollarSign className="h-5 w-5" />
                  </div>
                  <span className="whitespace-nowrap text-lg font-semibold">
                    TaxMan
                  </span>
                </Link>
              </div>
              
              <nav className="flex flex-col gap-2 p-2">
                <Link 
                  href="/" 
                  className="flex h-10 items-center gap-3 rounded-lg px-3 text-foreground hover:bg-accent hover:text-accent-foreground" 
                >
                  <BarChart3 className="h-5 w-5 shrink-0" />
                  <span className="whitespace-nowrap overflow-hidden">Overview</span>
                </Link>
                <Link 
                  href="/payslips"
                  className="flex h-10 items-center gap-3 rounded-lg px-3 text-foreground hover:bg-accent hover:text-accent-foreground" 
                >
                  <Receipt className="h-5 w-5 shrink-0" />
                  <span className="whitespace-nowrap overflow-hidden">Payslips</span>
                </Link>
                <Link 
                  href="/savings" 
                  className="flex h-10 items-center gap-3 rounded-lg px-3 text-foreground hover:bg-accent hover:text-accent-foreground" 
                >
                  <PiggyBank className="h-5 w-5 shrink-0" />
                  <span className="whitespace-nowrap overflow-hidden">Savings</span>
                </Link>
                <Link 
                  href="/tax" 
                  className="flex h-10 items-center gap-3 rounded-lg px-3 text-foreground hover:bg-accent hover:text-accent-foreground" 
                >
                  <Calculator className="h-5 w-5 shrink-0" />
                  <span className="whitespace-nowrap overflow-hidden">Tax Analysis</span>
                </Link>
                
                <div className="my-2 border-t" />
                
                <Link 
                  href="/search" 
                  className="flex h-10 items-center gap-3 rounded-lg px-3 text-foreground hover:bg-accent hover:text-accent-foreground" 
                >
                  <Search className="h-5 w-5 shrink-0" />
                  <span className="whitespace-nowrap overflow-hidden">Search</span>
                </Link>
                <Link 
                  href="/notifications" 
                  className="flex h-10 items-center gap-3 rounded-lg px-3 text-foreground hover:bg-accent hover:text-accent-foreground" 
                >
                  <Bell className="h-5 w-5 shrink-0" />
                  <span className="whitespace-nowrap overflow-hidden">Notifications</span>
                </Link>
              </nav>

              <nav className="absolute bottom-0 left-0 right-0 flex flex-col gap-2 border-t p-2">
                <Link 
                  href="/profile" 
                  className="flex h-10 items-center gap-3 rounded-lg px-3 text-foreground hover:bg-accent hover:text-accent-foreground"
                >
                  <User className="h-5 w-5 shrink-0" />
                  <span className="whitespace-nowrap overflow-hidden">Profile</span>
                </Link>
                <Link 
                  href="/settings" 
                  className="flex h-10 items-center gap-3 rounded-lg px-3 text-foreground hover:bg-accent hover:text-accent-foreground"
                >
                  <Settings className="h-5 w-5 shrink-0" />
                  <span className="whitespace-nowrap overflow-hidden">Settings</span>
                </Link>
              </nav>
            </aside>

            {/* Main Content Area */}
            <div className="pl-16">
              {children}
            </div>
          </div>
        </AuthProvider>
      </body>
    </html>
  )
} 