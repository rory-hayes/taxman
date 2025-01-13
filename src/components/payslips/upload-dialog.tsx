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
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Plus, Upload } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export function PayslipUploadDialog() {
  const [isUploading, setIsUploading] = useState(false)
  const supabase = createClientComponentClient()
  const { toast } = useToast()

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      setIsUploading(true)
      const user = (await supabase.auth.getUser()).data.user
      if (!user) throw new Error("Not authenticated")

      // Create path: payslips/user-id/filename
      const filePath = `${user.id}/${new Date().toISOString()}-${file.name}`
      
      const { error: uploadError } = await supabase.storage
        .from('payslips')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      // Add record to payslips table
      const { error: dbError } = await supabase
        .from('payslips')
        .insert({
          user_id: user.id,
          file_path: filePath,
          file_name: file.name,
          month: new Date().toISOString().slice(0, 7) // YYYY-MM
        })

      if (dbError) throw dbError

      toast({
        title: "Success",
        description: "Payslip uploaded successfully",
      })
    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description: "Failed to upload payslip",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Payslip</DialogTitle>
          <DialogDescription>
            Upload your payslip in PDF format. The file will be securely stored and processed.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="payslip-file" className="sr-only">
              Choose file
            </label>
            <input
              id="payslip-file"
              type="file"
              accept=".pdf"
              onChange={handleFileUpload}
              disabled={isUploading}
              className="hidden"
            />
            <Button
              variant="outline"
              className="w-full"
              disabled={isUploading}
              onClick={() => document.getElementById('payslip-file')?.click()}
            >
              <Upload className="mr-2 h-4 w-4" />
              {isUploading ? "Uploading..." : "Select File"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 