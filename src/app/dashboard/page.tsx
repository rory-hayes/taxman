import { createServerClient } from '@/lib/supabase/server'

export default async function Dashboard() {
  const supabase = createServerClient() as any
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Welcome back{user?.email ? `, ${user.email}` : ''}</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Add dashboard widgets here */}
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h3 className="font-semibold">Total Salary</h3>
          <p className="mt-2 text-2xl font-bold">£0.00</p>
        </div>

        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h3 className="font-semibold">Taxes Paid</h3>
          <p className="mt-2 text-2xl font-bold">£0.00</p>
        </div>

        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h3 className="font-semibold">Savings Goal</h3>
          <p className="mt-2 text-2xl font-bold">£0.00</p>
        </div>
      </div>
    </div>
  )
} 