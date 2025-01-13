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
            href="#payslips" 
            className="flex h-10 items-center gap-3 rounded-lg px-3 text-muted-foreground hover:bg-accent hover:text-accent-foreground" 
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
          <div className="grid auto-rows-max gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Tax Paid This Year</CardDescription>
                <CardTitle className="text-4xl">€8,329</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground">75% of estimated tax</div>
              </CardContent>
              <CardFooter>
                <Progress value={75} className="w-full" aria-label="75% of tax paid" />
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Savings Goal</CardDescription>
                <CardTitle className="text-4xl">€12,000</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground">60% achieved</div>
              </CardContent>
              <CardFooter>
                <Progress value={60} className="w-full" aria-label="60% of savings goal achieved" />
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Financial Overview</CardTitle>
                <CardDescription>Your tax and income summary for the current financial year.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">£45,231.89</div>
                <div className="text-sm text-muted-foreground">Total Income</div>
              </CardContent>
              <CardFooter>
                <Button variant="outline">View Details</Button>
              </CardFooter>
            </Card>

            <FinancialChart />

            <Card className="col-span-full lg:col-span-2">
              <CardHeader className="px-7">
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>Your latest financial activities.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Description</TableHead>
                      <TableHead className="hidden sm:table-cell">Category</TableHead>
                      <TableHead className="hidden sm:table-cell">Status</TableHead>
                      <TableHead className="hidden md:table-cell">Date</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <div className="font-medium">Salary Payment</div>
                        <div className="hidden text-sm text-muted-foreground md:inline">Monthly Income</div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">Income</TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <Badge className="text-xs" variant="secondary">
                          Received
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">2024-03-25</TableCell>
                      <TableCell className="text-right text-emerald-600">+£3,750.00</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <div className="font-medium">Tax Payment</div>
                        <div className="hidden text-sm text-muted-foreground md:inline">Quarterly Tax</div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">Tax</TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <Badge className="text-xs" variant="outline">
                          Pending
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">2024-03-24</TableCell>
                      <TableCell className="text-right text-red-600">-£950.00</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card className="col-span-full lg:col-span-1">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Payslips</CardTitle>
                  <PayslipProcessor />
                </div>
                <CardDescription>Upload and manage your payslips</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Example payslips - will be replaced with real data */}
                <div className="space-y-4 divide-y divide-border">
                  <div className="flex items-start justify-between pt-4 first:pt-0">
                    <div>
                      <div className="font-medium">March 2024</div>
                      <div className="text-sm text-muted-foreground">Monthly Salary</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="font-medium text-right">£5,500.00</div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Download PDF</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  <div className="flex items-start justify-between pt-4">
                    <div>
                      <div className="font-medium">February 2024</div>
                      <div className="text-sm text-muted-foreground">Monthly Salary</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="font-medium text-right">£5,000.00</div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Download PDF</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  {/* Add more payslips here */}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
} 