import { Metadata } from "next"
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import Link from "next/link"
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter 
} from "@/components/ui/card"
import { Progress } from "../../components/ui/progress"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../../components/ui/table"
import { Badge } from "../../components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
  DropdownMenuLabel, DropdownMenuItem, DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"
import { 
  DollarSign, PiggyBank, Calculator, BarChart3, 
  Receipt, Settings, Search, Menu, User, Plus, MoreVertical, Upload, Bell
} from 'lucide-react'
import { FinancialChart } from "../../components/dashboard/financial-chart"
import { PayslipProcessor } from "../../components/payslips/payslip-processor"
import { format } from 'date-fns'
import { SavingsGoalCard } from "@/components/dashboard/savings-goal-card"
import { TaxCard } from "@/components/dashboard/tax-card"
import { CURRENCY_SYMBOL } from '@/lib/constants'

function getCurrentTaxYear(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1
  const day = now.getDate()
  
  // Tax year runs from April 6th to April 5th
  if (month < 4 || (month === 4 && day <= 5)) {
    return `${year-1}-${year}`
  }
  return `${year}-${year+1}`
}

export const metadata: Metadata = {
  title: "Dashboard | TaxMan",
  description: "Manage your finances with AI-powered insights",
}

export default async function DashboardPage() {
  const supabase = createServerComponentClient({ cookies })
  const { data: { user } } = await supabase.auth.getUser()
  
  // Fetch recent payslips
  const { data: payslips } = await supabase
    .from('payslips')
    .select('*')
    .eq('user_id', user?.id)
    .order('month', { ascending: false })
    .limit(3) // Show last 3 payslips

  const displayName = user?.user_metadata?.display_name || 
    user?.email?.split('@')[0] || 'User'

  const { data: taxRecord } = await supabase
    .from('tax_records')
    .select('*')
    .eq('user_id', user?.id)
    .eq('tax_year', getCurrentTaxYear())
    .single()

  return (
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
            href="#overview" 
            className="flex h-10 items-center gap-3 rounded-lg bg-accent px-3 text-accent-foreground" 
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
            href="#savings" 
            className="flex h-10 items-center gap-3 rounded-lg px-3 text-foreground hover:bg-accent hover:text-accent-foreground" 
          >
            <PiggyBank className="h-5 w-5 shrink-0" />
            <span className="whitespace-nowrap overflow-hidden">Savings</span>
          </Link>
          <Link 
            href="#tax" 
            className="flex h-10 items-center gap-3 rounded-lg px-3 text-foreground hover:bg-accent hover:text-accent-foreground" 
          >
            <Calculator className="h-5 w-5 shrink-0" />
            <span className="whitespace-nowrap overflow-hidden">Tax Analysis</span>
          </Link>
          
          <div className="my-2 border-t" />
          
          <Link 
            href="#search" 
            className="flex h-10 items-center gap-3 rounded-lg px-3 text-foreground hover:bg-accent hover:text-accent-foreground" 
          >
            <Search className="h-5 w-5 shrink-0" />
            <span className="whitespace-nowrap overflow-hidden">Search</span>
          </Link>
          <Link 
            href="#notifications" 
            className="flex h-10 items-center gap-3 rounded-lg px-3 text-foreground hover:bg-accent hover:text-accent-foreground" 
          >
            <Bell className="h-5 w-5 shrink-0" />
            <span className="whitespace-nowrap overflow-hidden">Notifications</span>
          </Link>
        </nav>

        <nav className="absolute bottom-0 left-0 right-0 flex flex-col gap-2 border-t p-2">
          <Link 
            href="#profile" 
            className="flex h-10 items-center gap-3 rounded-lg px-3 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          >
            <User className="h-5 w-5 shrink-0" />
            <span className="whitespace-nowrap overflow-hidden">Profile</span>
          </Link>
          <Link 
            href="#settings" 
            className="flex h-10 items-center gap-3 rounded-lg px-3 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          >
            <Settings className="h-5 w-5 shrink-0" />
            <span className="whitespace-nowrap overflow-hidden">Settings</span>
          </Link>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="pl-16">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-14 items-center border-b bg-background px-4">
          <h1 className="text-lg font-semibold">Overview</h1>
        </header>

        {/* Main Content */}
        <main className="p-4">
          <div className="grid auto-rows-max gap-4 md:gap-8">
            {/* Top Row Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {/* Tax Card */}
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Tax Paid This Year</CardDescription>
                  <CardTitle className="text-4xl">
                    {CURRENCY_SYMBOL}{taxRecord?.total_tax_paid?.toFixed(2) || '0.00'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-muted-foreground">
                    {taxRecord ? 
                      `${((taxRecord.total_tax_paid / taxRecord.estimated_annual_tax) * 100).toFixed(0)}% of estimated tax` 
                      : 'No tax data available'}
                  </div>
                </CardContent>
                <CardFooter>
                  <Progress 
                    value={taxRecord ? (taxRecord.total_tax_paid / taxRecord.estimated_annual_tax) * 100 : 0} 
                    className="w-full" 
                    aria-label="Tax paid progress" 
                  />
                </CardFooter>
              </Card>

              {/* Savings Goal Card */}
              <SavingsGoalCard />

              {/* Payslips Card */}
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Recent Payslips</CardDescription>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-4xl">
                      {payslips?.length || 0}
                    </CardTitle>
                    <PayslipProcessor />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-muted-foreground">
                    {payslips?.length ? 'Latest payslip processed' : 'No payslips uploaded'}
                  </div>
                </CardContent>
              </Card>
              
              {/* Financial Overview Card */}
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Total Income</CardDescription>
                  <CardTitle className="text-4xl">
                    {CURRENCY_SYMBOL}{taxRecord?.total_gross_pay?.toFixed(2) || '0.00'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-muted-foreground">
                    Net Income: {CURRENCY_SYMBOL}
                    {((taxRecord?.total_gross_pay || 0) - 
                      (taxRecord?.total_tax_paid || 0) - 
                      (taxRecord?.total_ni_paid || 0) - 
                      (taxRecord?.total_pension || 0)).toFixed(2)}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Financial Chart */}
            <Card className="col-span-full">
              <CardHeader>
                <CardTitle>Financial Overview</CardTitle>
                <CardDescription>Your income and deductions over time</CardDescription>
              </CardHeader>
              <CardContent>
                <FinancialChart />
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
} 