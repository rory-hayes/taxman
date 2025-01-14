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
      const user = (await supabase.auth.getUser()).data.user
      if (!user) throw new Error("Not authenticated")

      // Define filePath first
      const filePath = `${user.id}/${verifiedData.month}-${file.name}`
      const formattedMonth = format(selectedMonth, 'yyyy-MM-dd')

      // Check for existing payslip
      const { data: existingPayslip } = await supabase
        .from('payslips')
        .select('id')
        .eq('user_id', user.id)
        .eq('month', formattedMonth)
        .single()

      if (existingPayslip) {
        // Update existing payslip using filePath
        const { error: updateError } = await supabase
          .from('payslips')
          .update({
            file_path: filePath,
            file_name: file.name,
            data: verifiedData,
            processed: true
          })
          .eq('id', existingPayslip.id)

        if (updateError) throw updateError
      } else {
        // Insert new payslip
        const { error: insertError } = await supabase
          .from('payslips')
          .insert({
            user_id: user.id,
            file_path: filePath,
            file_name: file.name,
            month: formattedMonth,
            data: verifiedData,
            processed: true
          })

        if (insertError) throw insertError
      }

      // Upload file to permanent storage
      const { error: uploadError } = await supabase.storage
        .from('payslips')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      toast({
        title: "Success",
        description: "Payslip processed and saved successfully"
      })

      // Reset form and refresh data
      setStep('upload')
      setFile(null)
      setPayslipData(null)
      router.refresh()
    } catch (error) {
      console.error('Error saving payslip:', error)
      toast({
        title: "Error",
        description: "Failed to save payslip",
        variant: "destructive"
      })
    } finally {
      setIsProcessing(false)
    }
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