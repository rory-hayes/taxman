import { DollarSign, PiggyBank, Calculator, BarChart3, Receipt, Settings, Search, Bell, User } from 'lucide-react'
import Link from "next/link"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 h-full w-16 border-r bg-background transition-all duration-300 hover:w-64">
        {/* ... copy all the sidebar content from root layout ... */}
      </aside>

      {/* Main Content Area */}
      <div className="pl-16">
        {children}
      </div>
    </div>
  )
} 