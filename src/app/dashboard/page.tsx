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
import { OnboardingDialog } from "@/components/onboarding-dialog"

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
    <>
      <OnboardingDialog />
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            Welcome back, {displayName}
          </h1>
          <p className="text-muted-foreground">
            Here's an overview of your financial health
          </p>
        </div>

        {/* Top Row Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Tax Card */}
          <div className="relative group">
            <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 opacity-25 group-hover:opacity-50 transition-opacity blur"></div>
            <Card className="relative">
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
                  className="w-full bg-gray-200" 
                  indicatorClassName="bg-gradient-to-r from-indigo-500 to-purple-500"
                  aria-label="Tax paid progress" 
                />
              </CardFooter>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="relative group md:col-span-2">
            <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 opacity-25 group-hover:opacity-50 transition-opacity blur"></div>
            <Card className="relative">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest financial transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {payslips?.map((payslip) => (
                    <div key={payslip.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center">
                          <Receipt className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Payslip</p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(payslip.month), 'MMMM yyyy')}
                          </p>
                        </div>
                      </div>
                      <div className="text-sm font-medium">
                        {CURRENCY_SYMBOL}{payslip.net_pay.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="relative group">
            <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 opacity-25 group-hover:opacity-50 transition-opacity blur"></div>
            <Card className="relative">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tasks and shortcuts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Payslip
                </Button>
                <Button variant="outline" className="w-full">
                  <Calculator className="mr-2 h-4 w-4" />
                  Tax Calculator
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Charts and Analytics */}
        <div className="relative group">
          <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 opacity-25 group-hover:opacity-50 transition-opacity blur"></div>
          <Card className="relative">
            <CardHeader>
              <CardTitle>Financial Overview</CardTitle>
              <CardDescription>Your income and tax trends</CardDescription>
            </CardHeader>
            <CardContent>
              <FinancialChart />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
} 