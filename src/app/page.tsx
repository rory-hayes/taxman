import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-4">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-6 shadow-lg">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            Financial Dashboard
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Track your finances, analyze payslips, and optimize savings
          </p>
        </div>
        
        <div className="mt-8 flex flex-col gap-4">
          <Link href="/auth/login" className="w-full">
            <Button className="w-full" size="lg">
              Login
            </Button>
          </Link>
          <Link href="/auth/register" className="w-full">
            <Button variant="outline" className="w-full" size="lg">
              Register
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
} 