"use client"

import { useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Plus, Upload, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Input } from "@/components/ui/input"
import { Label } from "../../components/ui/label"

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
  const [step, setStep] = useState<'upload' | 'verify' | 'processing'>('upload')
  const [isProcessing, setIsProcessing] = useState(false)
  const [payslipData, setPayslipData] = useState<PayslipData | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const supabase = createClientComponentClient()
  const { toast } = useToast()

  const processPayslip = async (file: File) => {
    setIsProcessing(true)
    try {
      // 1. Upload to temporary storage
      const tempPath = `temp/${Date.now()}-${file.name}`
      const { error: uploadError } = await supabase.storage
        .from('payslips-temp')
        .upload(tempPath, file)
      
      if (uploadError) throw uploadError

      // 2. Get public URL for OCR processing
      const { data: { publicUrl } } = supabase.storage
        .from('payslips-temp')
        .getPublicUrl(tempPath)

      // 3. Call your OCR API endpoint
      const response = await fetch('/api/ocr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: publicUrl })
      })

      if (!response.ok) throw new Error('OCR processing failed')

      const extractedData = await response.json()
      setPayslipData(extractedData)
      setStep('verify')
    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description: "Failed to process payslip",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    
    console.log('File selected:', file.name) // Debug log
    
    try {
      setIsProcessing(true)
      const user = (await supabase.auth.getUser()).data.user
      if (!user) throw new Error("Not authenticated")

      console.log('Starting upload to temp storage') // Debug log
      
      // 1. Upload to temporary storage
      const tempPath = `temp/${Date.now()}-${file.name}`
      const { error: uploadError, data } = await supabase.storage
        .from('payslips-temp')
        .upload(tempPath, file)
      
      if (uploadError) {
        console.error('Upload error:', uploadError) // Debug log
        throw uploadError
      }

      console.log('File uploaded, getting public URL') // Debug log

      // 2. Get public URL for OCR processing
      const { data: { publicUrl } } = supabase.storage
        .from('payslips-temp')
        .getPublicUrl(tempPath)

      console.log('Calling OCR endpoint') // Debug log

      // 3. Call your OCR API endpoint
      const response = await fetch('/api/ocr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: publicUrl })
      })

      if (!response.ok) throw new Error('OCR processing failed')

      const extractedData = await response.json()
      console.log('OCR data:', extractedData) // Debug log
      
      setPayslipData(extractedData)
      setStep('verify')
    } catch (error) {
      console.error('Processing error:', error) // Debug log
      toast({
        title: "Error",
        description: "Failed to process payslip",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleVerification = async (verifiedData: PayslipData) => {
    try {
      setIsProcessing(true)
      const user = (await supabase.auth.getUser()).data.user
      if (!user) throw new Error("Not authenticated")

      // 1. Move file from temp to permanent storage
      const permanentPath = `${user.id}/${verifiedData.month}-${file?.name}`
      // ... move file logic ...

      // 2. Save data to database
      const { error: dbError } = await supabase
        .from('payslips')
        .insert({
          user_id: user.id,
          file_path: permanentPath,
          file_name: file?.name,
          month: verifiedData.month,
          data: verifiedData
        })

      if (dbError) throw dbError

      toast({
        title: "Success",
        description: "Payslip processed and saved successfully",
      })
    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description: "Failed to save payslip data",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="h-8 w-8">
          <Plus className="h-4 w-4" />
          <span className="sr-only">Upload payslip</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Process Payslip</DialogTitle>
          <DialogDescription>
            Upload your payslip and verify the extracted information.
          </DialogDescription>
        </DialogHeader>

        {step === 'upload' && (
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="payslip-file">Choose payslip file</Label>
              <input
                id="payslip-file"
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
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
          </div>
        )}

        {step === 'verify' && payslipData && (
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Verify extracted information</Label>
              {/* Add form fields for verification */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="grossPay">Gross Pay</Label>
                  <Input
                    id="grossPay"
                    value={payslipData.grossPay}
                    onChange={(e) => setPayslipData({
                      ...payslipData,
                      grossPay: parseFloat(e.target.value)
                    })}
                  />
                </div>
                {/* Add other fields similarly */}
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => handleVerification(payslipData)}>
                Confirm and Save
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
} 