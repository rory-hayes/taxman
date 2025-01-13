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
import { DollarSign, Users, CreditCard, Activity } from 'lucide-react'
import { RecentTransactions } from "@/components/dashboard/recent-transactions"

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
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <DashboardHeader displayName={displayName} />
      
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Income
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">£45,231.89</div>
                <p className="text-xs text-muted-foreground">
                  +20.1% from last year
                </p>
              </CardContent>
            </Card>
            
            {/* Add other metric cards similarly */}
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Financial Overview</CardTitle>
                <CardDescription>
                  Your income and tax breakdown for the current tax year
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <Overview />
              </CardContent>
            </Card>

            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>
                  Your latest financial activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Remove or replace RecentTransactions */}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
} 