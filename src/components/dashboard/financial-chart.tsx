"use client"

import { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { format } from "date-fns"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartConfig = {
  grossPay: {
    label: "Gross Pay",
    color: "hsl(var(--chart-1))",
  },
  netPay: {
    label: "Net Pay",
    color: "hsl(var(--chart-2))",
  },
  tax: {
    label: "Tax",
    color: "hsl(var(--chart-3))",
  },
  nationalInsurance: {
    label: "National Insurance",
    color: "hsl(var(--chart-4))",
  },
  pension: {
    label: "Pension",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig

export function FinancialChart() {
  const [chartData, setChartData] = useState<any[]>([])
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchPayslips = async () => {
      const { data: payslips } = await supabase
        .from('payslips')
        .select('*')
        .order('month', { ascending: true })

      if (payslips) {
        const formattedData = payslips.map(p => ({
          month: format(new Date(p.month), 'MMM yyyy'),
          grossPay: p.data.grossPay,
          netPay: p.data.netPay,
          tax: p.data.tax,
          nationalInsurance: p.data.nationalInsurance,
          pension: p.data.pension
        }))

        setChartData(formattedData)
      }
    }

    fetchPayslips()
  }, [supabase])

  if (chartData.length === 0) return null

  return (
    <ChartContainer config={chartConfig}>
      <BarChart 
        data={chartData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        height={400}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis 
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
        />
        <YAxis
          tickFormatter={(value) => `£${value}`}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip 
          content={<ChartTooltipContent />}
          formatter={(value) => `£${value}`}
        />
        <Legend content={<ChartLegendContent />} />
        <Bar
          dataKey="grossPay"
          stackId="a"
          fill="var(--color-grossPay)"
          radius={[4, 4, 0, 0]}
        />
        <Bar
          dataKey="netPay"
          stackId="a"
          fill="var(--color-netPay)"
        />
        <Bar
          dataKey="tax"
          stackId="a"
          fill="var(--color-tax)"
        />
        <Bar
          dataKey="nationalInsurance"
          stackId="a"
          fill="var(--color-nationalInsurance)"
        />
        <Bar
          dataKey="pension"
          stackId="a"
          fill="var(--color-pension)"
          radius={[0, 0, 4, 4]}
        />
      </BarChart>
    </ChartContainer>
  )
} 