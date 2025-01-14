"use client"

import { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Line } from "react-chartjs-2"
import { format, subMonths } from "date-fns"

export function FinancialChart() {
  const [chartData, setChartData] = useState<any>(null)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchPayslips = async () => {
      const { data: payslips } = await supabase
        .from('payslips')
        .select('*')
        .order('month', { ascending: true })

      if (payslips) {
        const labels = payslips.map(p => format(new Date(p.month), 'MMM yyyy'))
        const grossData = payslips.map(p => p.data.grossPay)
        const netData = payslips.map(p => p.data.netPay)
        const taxData = payslips.map(p => p.data.tax)
        const niData = payslips.map(p => p.data.nationalInsurance)
        const pensionData = payslips.map(p => p.data.pension)

        setChartData({
          labels,
          datasets: [
            {
              label: 'Gross Pay',
              data: grossData,
              borderColor: 'rgb(59, 130, 246)',
              backgroundColor: 'rgba(59, 130, 246, 0.5)',
            },
            {
              label: 'Net Pay',
              data: netData,
              borderColor: 'rgb(34, 197, 94)',
              backgroundColor: 'rgba(34, 197, 94, 0.5)',
            },
            {
              label: 'Tax',
              data: taxData,
              borderColor: 'rgb(239, 68, 68)',
              backgroundColor: 'rgba(239, 68, 68, 0.5)',
            },
            {
              label: 'National Insurance',
              data: niData,
              borderColor: 'rgb(168, 85, 247)',
              backgroundColor: 'rgba(168, 85, 247, 0.5)',
            },
            {
              label: 'Pension',
              data: pensionData,
              borderColor: 'rgb(234, 179, 8)',
              backgroundColor: 'rgba(234, 179, 8, 0.5)',
            }
          ]
        })
      }
    }

    fetchPayslips()
  }, [supabase])

  if (!chartData) return null

  return (
    <Line
      data={chartData}
      options={{
        responsive: true,
        plugins: {
          legend: {
            position: 'top' as const,
          },
          title: {
            display: true,
            text: 'Financial Overview'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: (value) => `£${value}`
            }
          }
        }
      }}
    />
  )
} 