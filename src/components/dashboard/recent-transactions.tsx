"use client"

import { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { format } from "date-fns"
import { FileText, Receipt } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { CURRENCY_SYMBOL } from '@/lib/constants'

type Transaction = {
  id: string
  type: 'payslip' | 'receipt'
  description: string
  category: string
  date: string
  amount: number
  status: 'processed' | 'pending'
}

export function RecentTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function fetchTransactions() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Fetch recent payslips
      const { data: payslips } = await supabase
        .from('payslips')
        .select('*')
        .eq('user_id', user.id)
        .order('month', { ascending: false })
        .limit(5)

      // Fetch recent receipts
      const { data: receipts } = await supabase
        .from('receipts')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .limit(5)

      // Combine and format transactions
      const formattedPayslips = (payslips || []).map(p => ({
        id: p.id,
        type: 'payslip' as const,
        description: 'Salary Payment',
        category: 'Income',
        date: p.month,
        amount: p.data.grossPay,
        status: p.processed ? 'processed' as const : 'pending' as const
      }))

      const formattedReceipts = (receipts || []).map(r => ({
        id: r.id,
        type: 'receipt' as const,
        description: r.description || 'Receipt',
        category: r.category,
        date: r.date,
        amount: -r.amount,
        status: r.processed ? 'processed' as const : 'pending' as const
      }))

      // Combine, sort by date, and take most recent 5
      const allTransactions = [...formattedPayslips, ...formattedReceipts]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5)

      setTransactions(allTransactions)
    }

    fetchTransactions()
  }, [supabase])

  return (
    <Card>
      <CardHeader className="px-6">
        <CardTitle>Recent Transactions</CardTitle>
        <CardDescription>Your latest financial activities</CardDescription>
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
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {transaction.type === 'payslip' ? (
                      <Receipt className="h-4 w-4" />
                    ) : (
                      <FileText className="h-4 w-4" />
                    )}
                    <div>
                      <div className="font-medium">{transaction.description}</div>
                      <div className="hidden text-sm text-muted-foreground md:inline">
                        {transaction.type === 'payslip' ? 'Monthly Income' : transaction.category}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">{transaction.category}</TableCell>
                <TableCell className="hidden sm:table-cell">
                  <Badge 
                    className="text-xs" 
                    variant={transaction.status === 'processed' ? 'secondary' : 'outline'}
                  >
                    {transaction.status === 'processed' ? 'Processed' : 'Pending'}
                  </Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {format(new Date(transaction.date), 'dd/MM/yyyy')}
                </TableCell>
                <TableCell className={`text-right ${
                  transaction.amount > 0 ? 'text-emerald-600' : 'text-red-600'
                }`}>
                  {transaction.amount > 0 ? '+' : ''}{CURRENCY_SYMBOL}{transaction.amount.toLocaleString('en-GB', {
                    style: 'currency',
                    currency: 'GBP'
                  })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
} 