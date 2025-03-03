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
          {children}
        </AuthProvider>
      </body>
    </html>
  )
} 