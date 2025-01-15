"use client"

import { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CURRENCY_SYMBOL } from '@/lib/constants'

export function TaxCard() {
  const [totalTaxPaid, setTotalTaxPaid] = useState(0)
  const [estimatedTax, setEstimatedTax] = useState(0)
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function fetchTaxData() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Get all payslips for the current tax year
      const currentYear = new Date().getFullYear()
      const taxYearStart = `${currentYear}-04-06` // UK tax year starts April 6th
      const taxYearEnd = `${currentYear + 1}-04-05`

      const { data: payslips } = await supabase
        .from('payslips')
        .select('data, month')
        .eq('user_id', user.id)
        .gte('month', taxYearStart)
        .lte('month', taxYearEnd)

      if (payslips) {
        // Calculate total tax paid from payslips
        const totalTax = payslips.reduce((acc, payslip) => {
          const tax = payslip.data.tax || 0
          return acc + tax
        }, 0)

        // Calculate estimated annual tax based on average monthly tax
        const monthsInData = payslips.length
        const estimatedAnnualTax = monthsInData > 0 
          ? (totalTax / monthsInData) * 12 
          : 0

        setTotalTaxPaid(totalTax)
        setEstimatedTax(estimatedAnnualTax)
      }
    }

    fetchTaxData()
  }, [supabase])

  const taxProgress = estimatedTax > 0 ? (totalTaxPaid / estimatedTax) * 100 : 0

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription>Tax Paid This Year</CardDescription>
        <CardTitle className="text-4xl">
          {CURRENCY_SYMBOL}{totalTaxPaid.toFixed(2)}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-xs text-muted-foreground">
          {taxProgress.toFixed(0)}% of estimated tax ({CURRENCY_SYMBOL}{estimatedTax.toFixed(2)})
        </div>
      </CardContent>
      <CardFooter>
        <Progress 
          value={taxProgress} 
          className="w-full" 
          aria-label={`${taxProgress.toFixed(0)}% of tax paid`}
        />
      </CardFooter>
    </Card>
  )
} 