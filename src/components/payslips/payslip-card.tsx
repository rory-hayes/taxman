"use client"

import { useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Eye, Download, Trash2, FileText } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { CURRENCY_SYMBOL } from '@/lib/constants'

interface PayslipCardProps {
  payslip: {
    id: string
    month: string
    file_name: string
    file_path: string
    data: {
      grossPay: number
      netPay: number
      tax: number
      nationalInsurance: number
      pension: number
      otherDeductions: number
    }
  }
}

export function PayslipCard({ payslip }: PayslipCardProps) {
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClientComponentClient()
  const { toast } = useToast()

  const handleDownload = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase.storage
        .from('payslips')
        .download(payslip.file_path)

      if (error) throw error

      // Create download link
      const url = window.URL.createObjectURL(data)
      const link = document.createElement('a')
      link.href = url
      link.download = payslip.file_name
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error downloading file:', error)
      toast({
        title: "Error",
        description: "Failed to download payslip",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('payslips')
        .delete()
        .eq('id', payslip.id)

      if (error) throw error

      toast({
        title: "Success",
        description: "Payslip deleted successfully",
      })
    } catch (error) {
      console.error('Error deleting payslip:', error)
      toast({
        title: "Error",
        description: "Failed to delete payslip",
        variant: "destructive",
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{new Date(payslip.month).toLocaleDateString('en-GB', { 
              month: 'long', 
              year: 'numeric' 
            })}</CardTitle>
            <CardDescription>{payslip.file_name}</CardDescription>
          </div>
          <Badge variant="outline">Monthly</Badge>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm font-medium text-muted-foreground">Gross Pay</div>
            <div className="text-2xl font-bold">€{payslip.data.grossPay.toFixed(2)}</div>
          </div>
          <div>
            <div className="text-sm font-medium text-muted-foreground">Net Pay</div>
            <div className="text-2xl font-bold">€{payslip.data.netPay.toFixed(2)}</div>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-2">
          <div>
            <div className="text-sm font-medium text-muted-foreground">Tax</div>
            <div className="font-medium">€{payslip.data.tax.toFixed(2)}</div>
          </div>
          <div>
            <div className="text-sm font-medium text-muted-foreground">NI</div>
            <div className="font-medium">€{payslip.data.nationalInsurance.toFixed(2)}</div>
          </div>
          <div>
            <div className="text-sm font-medium text-muted-foreground">Pension</div>
            <div className="font-medium">€{payslip.data.pension.toFixed(2)}</div>
          </div>
        </div>

        <div className="rounded-lg bg-muted p-4">
          <div className="text-sm font-medium">AI Insights</div>
          <p className="mt-1 text-sm text-muted-foreground">
            Your take-home pay this month is {((payslip.data.netPay / payslip.data.grossPay) * 100).toFixed(1)}% 
            of your gross pay. Tax and deductions account for €
            {(payslip.data.tax + payslip.data.nationalInsurance + payslip.data.pension).toFixed(2)}.
          </p>
        </div>
      </CardContent>
      <CardFooter className="justify-between space-x-2">
        <Button variant="outline" size="sm" onClick={handleDownload} disabled={isLoading}>
          <Download className="mr-2 h-4 w-4" />
          Download
        </Button>
        <div className="space-x-2">
          <Button variant="outline" size="sm">
            <Eye className="mr-2 h-4 w-4" />
            View
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your payslip.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardFooter>
    </Card>
  )
} 