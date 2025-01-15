"use client"

import { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CURRENCY_SYMBOL } from '@/lib/constants'

export function SavingsGoalCard() {
  const [savingsGoal, setSavingsGoal] = useState<number>(0)
  const [currentSavings, setCurrentSavings] = useState<number>(0)
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function fetchSavingsData() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Fetch user's savings goal
      const { data: settings } = await supabase
        .from('user_settings')
        .select('savings_goal')
        .eq('user_id', user.id)
        .single()

      if (settings) {
        setSavingsGoal(settings.savings_goal)
      }

      // Calculate current month's savings from payslips
      const { data: payslips } = await supabase
        .from('payslips')
        .select('data')
        .eq('user_id', user.id)
        .gte('month', new Date().toISOString().slice(0, 7)) // Current month

      if (payslips && payslips.length > 0) {
        const monthlySavings = payslips.reduce((acc, payslip) => {
          const netPay = payslip.data.netPay || 0
          const expenses = (payslip.data.expenses || 0)
          return acc + (netPay - expenses)
        }, 0)
        setCurrentSavings(monthlySavings)
      }
    }

    fetchSavingsData()
  }, [supabase])

  const progress = savingsGoal > 0 ? (currentSavings / savingsGoal) * 100 : 0

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Savings Goal</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {CURRENCY_SYMBOL}{currentSavings.toFixed(2)} / {CURRENCY_SYMBOL}{savingsGoal.toFixed(2)}
        </div>
        <Progress
          value={progress}
          className="mt-2"
        />
        <p className="mt-2 text-xs text-muted-foreground">
          {progress.toFixed(1)}% of monthly goal
        </p>
      </CardContent>
    </Card>
  )
} 