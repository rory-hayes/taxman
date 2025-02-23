"use client"

import { useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Plus, Upload, Loader2, ChevronLeft, ChevronRight } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { format, startOfMonth, subMonths, addMonths } from "date-fns"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { CalendarIcon } from "lucide-react"

interface PayslipData {
  grossPay: number
  netPay: number
  tax: number
  nationalInsurance: number
  pension: number
  otherDeductions: number
  month: string
}

export function PayslipProcessor() {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<'upload' | 'verify'>('upload')
  const [isProcessing, setIsProcessing] = useState(false)
  const [payslipData, setPayslipData] = useState<PayslipData | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const supabase = createClientComponentClient()
  const { toast } = useToast()
  const router = useRouter()
  const [selectedMonth, setSelectedMonth] = useState<Date | undefined>(new Date())

  // Step 2: Handle file selection
  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    console.log('File selected:', selectedFile?.name) // Debug log
    if (!selectedFile) return

    try {
      setIsProcessing(true)
      setFile(selectedFile)

      console.log('Creating FormData') // Debug log
      const formData = new FormData()
      formData.append('file', selectedFile)

      console.log('Calling OCR endpoint') // Debug log
      const response = await fetch('/api/ocr', {
        method: 'POST',
        body: formData
      })

      console.log('OCR Response status:', response.status) // Debug log

      if (!response.ok) {
        throw new Error('Failed to process payslip')
      }

      const extractedData = await response.json()
      console.log('Extracted data:', extractedData) // Debug log
      
      setPayslipData(extractedData)
      setStep('verify')
    } catch (error) {
      console.error('Error processing payslip:', error)
      toast({
        title: "Error",
        description: "Failed to process payslip",
        variant: "destructive"
      })
    } finally {
      setIsProcessing(false)
    }
  }

  // Step 6 & 7: Handle verification and save
  const handleVerification = async (verifiedData: PayslipData) => {
    if (!file || !selectedMonth) return

    try {
      setIsProcessing(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      const formattedMonth = format(selectedMonth, 'yyyy-MM-dd')
      const taxYear = getTaxYear(selectedMonth)

      // Save payslip
      const { data: payslip, error: payslipError } = await supabase
        .from('payslips')
        .upsert({
          user_id: user.id,
          month: formattedMonth,
          data: verifiedData,
          gross_pay: verifiedData.grossPay,
          net_pay: verifiedData.netPay,
          tax_paid: verifiedData.tax,
          ni_paid: verifiedData.nationalInsurance,
          pension: verifiedData.pension,
          tax_year: taxYear,
        })
        .select()
        .single()

      if (payslipError) throw payslipError

      // Update tax records for the year
      const { data: existingTaxRecord } = await supabase
        .from('tax_records')
        .select('*')
        .eq('user_id', user.id)
        .eq('tax_year', taxYear)
        .single()

      if (existingTaxRecord) {
        // Update existing record
        await supabase
          .from('tax_records')
          .update({
            total_gross_pay: existingTaxRecord.total_gross_pay + verifiedData.grossPay,
            total_tax_paid: existingTaxRecord.total_tax_paid + verifiedData.tax,
            total_ni_paid: existingTaxRecord.total_ni_paid + verifiedData.nationalInsurance,
            total_pension: existingTaxRecord.total_pension + verifiedData.pension,
            estimated_annual_tax: (verifiedData.tax * 12), // Simple estimation
            last_updated: new Date().toISOString()
          })
          .eq('id', existingTaxRecord.id)
      } else {
        // Create new tax record
        await supabase
          .from('tax_records')
          .insert({
            user_id: user.id,
            tax_year: taxYear,
            total_gross_pay: verifiedData.grossPay,
            total_tax_paid: verifiedData.tax,
            total_ni_paid: verifiedData.nationalInsurance,
            total_pension: verifiedData.pension,
            estimated_annual_tax: verifiedData.tax * 12,
          })
      }

      toast({
        title: "Success",
        description: "Payslip processed and saved successfully"
      })

      router.refresh()
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Error",
        description: "Failed to save payslip",
        variant: "destructive"
      })
    } finally {
      setIsProcessing(false)
      setOpen(false)
    }
  }

  // Helper function to get tax year
  function getTaxYear(date: Date): string {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    
    // Tax year runs from April 6th to April 5th
    if (month < 4 || (month === 4 && date.getDate() <= 5)) {
      return `${year-1}-${year}`
    }
    return `${year}-${year+1}`
  }

  const MonthPicker = ({ selected, onSelect }: { 
    selected: Date | undefined, 
    onSelect: (date: Date) => void 
  }) => {
    const [year, setYear] = useState(selected?.getFullYear() || new Date().getFullYear())
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ]

    return (
      <div className="p-3">
        <div className="flex items-center justify-between mb-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setYear(year - 1)}
            disabled={year <= 2020}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="font-semibold">{year}</div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setYear(year + 1)}
            disabled={year >= new Date().getFullYear()}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {months.map((month, index) => {
            const date = new Date(year, index)
            const isDisabled = date > new Date() || date < new Date(2020, 0)
            const isSelected = selected && 
              selected.getMonth() === index && 
              selected.getFullYear() === year

            return (
              <Button
                key={month}
                variant={isSelected ? "default" : "outline"}
                className="w-full"
                disabled={isDisabled}
                onClick={() => onSelect(startOfMonth(date))}
              >
                {format(date, 'MMM')}
              </Button>
            )
          })}
        </div>
      </div>
    )
  }

  const processPayslipData = async (text: string) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    // Extract data using regex patterns
    const grossPayMatch = text.match(/gross\s+pay[:\s]+([€£$]?\d+[\d,]*\.?\d*)/i);
    const taxPaidMatch = text.match(/tax\s+paid[:\s]+([€£$]?\d+[\d,]*\.?\d*)/i);
    const niPaidMatch = text.match(/national\s+insurance[:\s]+([€£$]?\d+[\d,]*\.?\d*)/i);
    const netPayMatch = text.match(/net\s+pay[:\s]+([€£$]?\d+[\d,]*\.?\d*)/i);
    const pensionMatch = text.match(/pension[:\s]+([€£$]?\d+[\d,]*\.?\d*)/i);

    // Convert matched strings to numbers, removing currency symbols and commas
    const parseAmount = (match: RegExpMatchArray | null) => {
      if (!match) return null;
      return parseFloat(match[1].replace(/[€£$,]/g, ''));
    };

    const payslipData = {
      gross_pay: parseAmount(grossPayMatch),
      tax_paid: parseAmount(taxPaidMatch),
      ni_paid: parseAmount(niPaidMatch),
      net_pay: parseAmount(netPayMatch),
      pension: parseAmount(pensionMatch),
      month: new Date().toISOString().slice(0, 7), // YYYY-MM format
      user_id: user.id,
      processed_at: new Date().toISOString()
    };

    // Save to Supabase
    const { error } = await supabase
      .from('payslips')
      .insert([payslipData]);

    if (error) throw error;
    
    return payslipData;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className="h-8 w-8"
        >
          <Plus className="h-4 w-4" />
          <span className="sr-only">Upload payslip</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {step === 'upload' ? 'Upload Payslip' : 'Verify Information'}
          </DialogTitle>
          <DialogDescription>
            {step === 'upload' 
              ? "Upload your payslip to extract information" 
              : "Please verify the extracted information"}
          </DialogDescription>
        </DialogHeader>

        {step === 'upload' && (
          <div className="grid gap-4 py-4">
            <Label htmlFor="payslip-file" className="sr-only">
              Choose file
            </Label>
            <input
              id="payslip-file"
              type="file"
              accept=".pdf"
              onChange={handleFileSelect}
              disabled={isProcessing}
              className="hidden"
            />
            <Button
              variant="outline"
              className="w-full"
              disabled={isProcessing}
              onClick={() => document.getElementById('payslip-file')?.click()}
            >
              {isProcessing ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Upload className="mr-2 h-4 w-4" />
              )}
              {isProcessing ? "Processing..." : "Select File"}
            </Button>
          </div>
        )}

        {step === 'verify' && payslipData && (
          <div className="grid gap-4 py-4">
            <div className="grid gap-4">
              <div>
                <Label>Payslip Month</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !selectedMonth && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedMonth ? format(selectedMonth, 'MMMM yyyy') : <span>Pick a month</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <MonthPicker
                      selected={selectedMonth}
                      onSelect={setSelectedMonth}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label htmlFor="grossPay">Gross Pay</Label>
                <Input
                  id="grossPay"
                  type="number"
                  value={payslipData.grossPay}
                  onChange={(e) => setPayslipData({
                    ...payslipData,
                    grossPay: parseFloat(e.target.value)
                  })}
                />
              </div>
              <div>
                <Label htmlFor="netPay">Net Pay</Label>
                <Input
                  id="netPay"
                  type="number"
                  value={payslipData.netPay}
                  onChange={(e) => setPayslipData({
                    ...payslipData,
                    netPay: parseFloat(e.target.value)
                  })}
                />
              </div>
              <div>
                <Label htmlFor="tax">Tax</Label>
                <Input
                  id="tax"
                  type="number"
                  value={payslipData.tax}
                  onChange={(e) => setPayslipData({
                    ...payslipData,
                    tax: parseFloat(e.target.value)
                  })}
                />
              </div>
              <div>
                <Label htmlFor="nationalInsurance">National Insurance</Label>
                <Input
                  id="nationalInsurance"
                  type="number"
                  value={payslipData.nationalInsurance}
                  onChange={(e) => setPayslipData({
                    ...payslipData,
                    nationalInsurance: parseFloat(e.target.value)
                  })}
                />
              </div>
              <div>
                <Label htmlFor="pension">Pension</Label>
                <Input
                  id="pension"
                  type="number"
                  value={payslipData.pension}
                  onChange={(e) => setPayslipData({
                    ...payslipData,
                    pension: parseFloat(e.target.value)
                  })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={() => handleVerification(payslipData)}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Confirm and Save'
                )}
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
} 