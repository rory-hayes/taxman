import { Metadata } from "next"
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Overview } from "@/components/dashboard/overview"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DollarSign, Users, CreditCard, Activity, TrendingUp, PiggyBank, Calculator } from 'lucide-react'
import { DateRangePicker } from "@/components/dashboard/date-range-picker"

export const metadata: Metadata = {
  title: "Dashboard | TaxMan",
  description: "Manage your finances with AI-powered insights",
}

export default async function DashboardPage() {
  const supabase = createServerComponentClient({ cookies })
  const { data: { user } } = await supabase.auth.getUser()
  
  const displayName = user?.user_metadata?.display_name || 
    user?.email?.split('@')[0] || 'User'

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <DashboardHeader displayName={displayName} />
        <DateRangePicker />
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Income
            </CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">£45,231.89</div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-emerald-500" />
              <p className="text-xs text-emerald-500">
                +20.1% from last year
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tax Paid
            </CardTitle>
            <Calculator className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">£12,458.32</div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-blue-500" />
              <p className="text-xs text-blue-500">
                On track with estimates
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Savings
            </CardTitle>
            <PiggyBank className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">£8,392.12</div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-purple-500" />
              <p className="text-xs text-purple-500">
                +12.3% this month
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Take-Home Pay
            </CardTitle>
            <Activity className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">£32,773.57</div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-orange-500" />
              <p className="text-xs text-orange-500">
                +5.2% vs last month
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-white dark:bg-gray-800 p-1 rounded-lg">
          <TabsTrigger value="overview" className="text-sm">Overview</TabsTrigger>
          <TabsTrigger value="analytics" className="text-sm">Analytics</TabsTrigger>
          <TabsTrigger value="reports" className="text-sm">Reports</TabsTrigger>
          <TabsTrigger value="insights" className="text-sm">AI Insights</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4 hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Financial Overview
                </CardTitle>
                <CardDescription>
                  Your income and tax breakdown for the current tax year
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <Overview />
              </CardContent>
            </Card>

            <Card className="col-span-3 hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  Recent Activity
                </CardTitle>
                <CardDescription>
                  Your latest financial updates and notifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Add activity items here */}
                  <div className="flex items-center gap-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                    <div className="h-8 w-8 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
                      <DollarSign className="h-4 w-4 text-emerald-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Salary Received</p>
                      <p className="text-xs text-muted-foreground">Today at 9:30 AM</p>
                    </div>
                    <div className="text-sm font-medium text-emerald-500">+£3,250.00</div>
                  </div>
                  {/* Add more activity items */}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
} 