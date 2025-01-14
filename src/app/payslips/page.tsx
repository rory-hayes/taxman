import { Metadata } from "next"
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { PayslipCard } from "../../components/payslips/payslip-card"
import { PayslipProcessor } from "../../components/payslips/payslip-processor"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export const metadata: Metadata = {
  title: "Payslips | TaxMan",
  description: "View and manage your payslips",
}

export default async function PayslipsPage() {
  const supabase = createServerComponentClient({ cookies })
  
  // Fetch payslips from Supabase
  const { data: payslips } = await supabase
    .from('payslips')
    .select('*')
    .eq('user_id', user.id)
    .order('month', { ascending: false })

  return (
    <>
      {/* Header */}
      <header className="sticky top-0 z-30 flex h-14 items-center border-b bg-background px-4">
        <h1 className="text-lg font-semibold">Payslips</h1>
      </header>

      {/* Main Content */}
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Payslips</h1>
            <p className="text-muted-foreground">
              View and manage all your uploaded payslips
            </p>
          </div>
          <PayslipProcessor />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {payslips?.map((payslip) => (
            <PayslipCard key={payslip.id} payslip={payslip} />
          ))}
          
          {payslips?.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
              <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
                <h3 className="mt-4 text-lg font-semibold">No payslips uploaded</h3>
                <p className="mb-4 mt-2 text-sm text-muted-foreground">
                  Upload your first payslip to start tracking your income and taxes.
                </p>
                <PayslipProcessor />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
} 