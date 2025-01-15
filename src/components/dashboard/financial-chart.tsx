"use client"

import { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { format } from "date-fns"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts"
import { CURRENCY_SYMBOL } from '@/lib/constants'

type ChartData = {
  month: string
  grossPay: number
  netPay: number
  tax: number
  nationalInsurance: number
  pension: number
}

export function FinancialChart() {
  const [chartData, setChartData] = useState<ChartData[]>([])
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function fetchPayslips() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data: payslips, error } = await supabase
          .from('payslips')
          .select('*')
          .eq('user_id', user.id)
          .order('month', { ascending: true })

        if (error) {
          console.error('Error fetching payslips:', error)
          return
        }

        if (payslips) {
          console.log('Fetched payslips:', payslips) // Debug log
          const formattedData = payslips.map(p => ({
            month: format(new Date(p.month), 'MMM yyyy'),
            grossPay: p.data.grossPay || 0,
            netPay: p.data.netPay || 0,
            tax: p.data.tax || 0,
            nationalInsurance: p.data.nationalInsurance || 0,
            pension: p.data.pension || 0
          }))
          console.log('Formatted chart data:', formattedData) // Debug log
          setChartData(formattedData)
        }
      } catch (error) {
        console.error('Error in fetchPayslips:', error)
      }
    }

    fetchPayslips()
  }, [supabase])

  if (chartData.length === 0) {
    return (
      <div className="flex h-[400px] items-center justify-center text-muted-foreground">
        No payslip data available
      </div>
    )
  }

  return (
    <div className="w-full h-[400px]">
      <BarChart data={chartData} className="w-full">
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis
          tickFormatter={(value) => `${CURRENCY_SYMBOL}${value}`}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip 
          formatter={(value) => `${CURRENCY_SYMBOL}${value}`}
          labelStyle={{ color: 'black' }}
          contentStyle={{ 
            backgroundColor: 'white',
            border: '1px solid #e2e8f0'
          }}
        />
        <Legend />
        <Bar
          dataKey="netPay"
          name="Net Pay"
          stackId="a"
          fill="hsl(var(--chart-2))"
        />
        <Bar
          dataKey="tax"
          name="Tax"
          stackId="a"
          fill="hsl(var(--chart-3))"
        />
        <Bar
          dataKey="nationalInsurance"
          name="National Insurance"
          stackId="a"
          fill="hsl(var(--chart-4))"
        />
        <Bar
          dataKey="pension"
          name="Pension"
          stackId="a"
          fill="hsl(var(--chart-5))"
        />
      </BarChart>
    </div>
  )
} 