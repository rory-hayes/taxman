"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const financialData = [
  {
    month: "Apr 23",
    tax: 1250,
    expenses: 2500,
    savings: 800,
    disposableIncome: 450,
    total: 5000
  },
  {
    month: "May 23",
    tax: 1250,
    expenses: 2600,
    savings: 750,
    disposableIncome: 400,
    total: 5000
  },
  {
    month: "Jun 23",
    tax: 1375,  // Overtime
    expenses: 2400,
    savings: 900,
    disposableIncome: 825,
    total: 5500
  },
  {
    month: "Jul 23",
    tax: 1250,
    expenses: 2550,
    savings: 800,
    disposableIncome: 400,
    total: 5000
  },
  {
    month: "Aug 23",
    tax: 1250,
    expenses: 2450,
    savings: 850,
    disposableIncome: 450,
    total: 5000
  },
  {
    month: "Sep 23",
    tax: 1312,  // Small bonus
    expenses: 2400,
    savings: 1000,
    disposableIncome: 538,
    total: 5250
  },
  {
    month: "Oct 23",
    tax: 1250,
    expenses: 2600,
    savings: 800,
    disposableIncome: 350,
    total: 5000
  },
  {
    month: "Nov 23",
    tax: 1250,
    expenses: 2700,  // Holiday spending
    savings: 750,
    disposableIncome: 300,
    total: 5000
  },
  {
    month: "Dec 23",
    tax: 1500,  // Christmas bonus
    expenses: 2900,  // Christmas spending
    savings: 1200,
    disposableIncome: 400,
    total: 6000
  },
  {
    month: "Jan 24",
    tax: 1250,
    expenses: 2400,
    savings: 700,
    disposableIncome: 650,
    total: 5000
  },
  {
    month: "Feb 24",
    tax: 1250,
    expenses: 2350,
    savings: 800,
    disposableIncome: 600,
    total: 5000
  },
  {
    month: "Mar 24",
    tax: 1375,  // Year-end bonus
    expenses: 2500,
    savings: 1000,
    disposableIncome: 625,
    total: 5500
  }
].map(item => ({
  ...item,
  total: item.tax + item.expenses + item.savings + item.disposableIncome
}))

const colors = {
  tax: "#ef4444",           // Red
  expenses: "#f97316",      // Orange
  savings: "#22c55e",       // Green
  disposableIncome: "#3b82f6" // Blue
}

export function FinancialChart() {
  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Financial Overview</CardTitle>
        <CardDescription>Monthly breakdown of income allocation</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
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
                tickFormatter={(value) => `€${value}`}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip 
                formatter={(value: number, name: string) => [`€${value}`, name.toString().split(/(?=[A-Z])/).join(' ')]}
                labelStyle={{ color: 'black' }}
                contentStyle={{ 
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0'
                }}
              />
              <Legend 
                formatter={(value) => value.split(/(?=[A-Z])/).join(' ')}
              />
              <Bar
                dataKey="tax"
                name="Tax"
                stackId="a"
                fill={colors.tax}
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="expenses"
                name="Expenses"
                stackId="a"
                fill={colors.expenses}
                radius={[0, 0, 0, 0]}
              />
              <Bar
                dataKey="savings"
                name="Savings"
                stackId="a"
                fill={colors.savings}
                radius={[0, 0, 0, 0]}
              />
              <Bar
                dataKey="disposableIncome"
                name="Disposable Income"
                stackId="a"
                fill={colors.disposableIncome}
                radius={[0, 0, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium">
          <TrendingUp className="h-4 w-4 text-emerald-500" />
          Total income increased by 6.7% this month
        </div>
        <div className="text-muted-foreground">
          Showing monthly income breakdown for the tax year
        </div>
      </CardFooter>
    </Card>
  )
} 