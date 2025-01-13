"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

// Sample data structure for financial information
const financialData = [
  {
    month: "Apr 23",
    grossPay: 5000,
    netPay: 3750,    // 25% tax
    savings: 800,
    expenses: 2500   // rent/mortgage, bills, etc.
  },
  {
    month: "May 23",
    grossPay: 5000,
    netPay: 3750,
    savings: 750,
    expenses: 2600
  },
  {
    month: "Jun 23",
    grossPay: 5500,  // overtime
    netPay: 4125,
    savings: 900,
    expenses: 2400
  },
  {
    month: "Jul 23",
    grossPay: 5000,
    netPay: 3750,
    savings: 800,
    expenses: 2550
  },
  {
    month: "Aug 23",
    grossPay: 5000,
    netPay: 3750,
    savings: 850,
    expenses: 2450
  },
  {
    month: "Sep 23",
    grossPay: 5250,  // small bonus
    netPay: 3937,
    savings: 1000,
    expenses: 2400
  },
  {
    month: "Oct 23",
    grossPay: 5000,
    netPay: 3750,
    savings: 800,
    expenses: 2600
  },
  {
    month: "Nov 23",
    grossPay: 5000,
    netPay: 3750,
    savings: 750,
    expenses: 2700  // holiday spending
  },
  {
    month: "Dec 23",
    grossPay: 6000,  // Christmas bonus
    netPay: 4500,
    savings: 1200,
    expenses: 2900  // Christmas spending
  },
  {
    month: "Jan 24",
    grossPay: 5000,
    netPay: 3750,
    savings: 700,
    expenses: 2400
  },
  {
    month: "Feb 24",
    grossPay: 5000,
    netPay: 3750,
    savings: 800,
    expenses: 2350
  },
  {
    month: "Mar 24",
    grossPay: 5500,  // year-end bonus
    netPay: 4125,
    savings: 1000,
    expenses: 2500
  }
]

const colors = {
  grossPay: "#22c55e", // Green
  netPay: "#3b82f6",   // Blue
  savings: "#a855f7",  // Purple
  expenses: "#ef4444"  // Red
}

export function FinancialChart() {
  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Financial Overview</CardTitle>
        <CardDescription>Monthly breakdown of income and expenses</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          <BarChart
            width={800}
            height={400}
            data={financialData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis 
              dataKey="month" 
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              tickFormatter={(value) => `£${value}`}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip 
              formatter={(value) => `£${value}`}
              labelStyle={{ color: 'black' }}
              contentStyle={{ 
                backgroundColor: 'white',
                border: '1px solid #e2e8f0'
              }}
            />
            <Legend />
            <Bar
              dataKey="grossPay"
              name="Gross Pay"
              stackId="a"
              fill={colors.grossPay}
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="netPay"
              name="Net Pay"
              stackId="b"
              fill={colors.netPay}
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="savings"
              name="Savings"
              stackId="c"
              fill={colors.savings}
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="expenses"
              name="Expenses"
              stackId="d"
              fill={colors.expenses}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </div>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium">
          <TrendingUp className="h-4 w-4 text-emerald-500" />
          Net income increased by 6.7% this month
        </div>
        <div className="text-muted-foreground">
          Showing financial breakdown for the last 6 months
        </div>
      </CardFooter>
    </Card>
  )
} 