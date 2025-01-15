'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/providers/supabase-auth-provider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert } from '@/components/ui/alert'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { CURRENCY_SYMBOL } from '@/lib/constants'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

type Step = 'credentials' | 'profile' | 'goals'

interface ProfileData {
  displayName: string
  ageRange: string
  location: string
  jobField: string
  payDate: string
}

interface GoalsData {
  savingsGoal: number
  monthlyTarget: number
}

export default function Register() {
  const router = useRouter()
  const { signUpWithEmail } = useAuth()
  const [step, setStep] = useState<Step>('credentials')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // Credentials state
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // Profile state
  const [profile, setProfile] = useState<ProfileData>({
    displayName: '',
    ageRange: '',
    location: '',
    jobField: '',
    payDate: '',
  })

  // Goals state
  const [goals, setGoals] = useState<GoalsData>({
    savingsGoal: 0,
    monthlyTarget: 0,
  })

  const [savingsGoal, setSavingsGoal] = useState("")

  const supabase = createClientComponentClient()

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      await signUpWithEmail(email, password)
      setStep('profile')
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Save profile data to Supabase
    setStep('goals')
  }

  const handleGoalsSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No user found')

      // Save user settings
      const { error: settingsError } = await supabase
        .from('user_settings')
        .insert({
          user_id: user.id,
          savings_goal: goals.savingsGoal,
          location: profile.location,
          currency: 'EUR', // Default to EUR
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        })

      if (settingsError) throw settingsError

      router.push('/auth/verify-email')
    } catch (error) {
      console.error('Error saving settings:', error)
      setError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const renderStep = () => {
    switch (step) {
      case 'credentials':
        return (
          <form onSubmit={handleCredentialsSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="displayName" className="block text-sm font-medium text-gray-700">
                  Display Name
                </label>
                <Input
                  id="displayName"
                  type="text"
                  value={profile.displayName}
                  onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
                  required
                  className="mt-1"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-1"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="mt-1"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creating account...' : 'Continue'}
            </Button>
          </form>
        )

      case 'profile':
        return (
          <form onSubmit={handleProfileSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="ageRange" className="block text-sm font-medium text-gray-700">
                  Age Range
                </label>
                <Select value={profile.ageRange} onValueChange={(value) => setProfile({ ...profile, ageRange: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select age range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="18-24">18-24</SelectItem>
                    <SelectItem value="25-34">25-34</SelectItem>
                    <SelectItem value="35-44">35-44</SelectItem>
                    <SelectItem value="45-54">45-54</SelectItem>
                    <SelectItem value="55+">55+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Add other profile fields */}
            </div>

            <Button type="submit" className="w-full">
              Continue
            </Button>
          </form>
        )

      case 'goals':
        return (
          <form onSubmit={handleGoalsSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="savingsGoal" className="block text-sm font-medium text-gray-700">
                  Annual Savings Goal (£)
                </label>
                <div className="relative mt-1">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <span className="text-gray-500 sm:text-sm">£</span>
                  </div>
                  <Input
                    id="savingsGoal"
                    type="number"
                    min="0"
                    step="100"
                    value={goals.savingsGoal}
                    onChange={(e) => setGoals({ 
                      ...goals, 
                      savingsGoal: Number(e.target.value),
                      monthlyTarget: Math.round(Number(e.target.value) / 12)
                    })}
                    required
                    className="pl-7"
                    placeholder="10000"
                  />
                </div>
                {goals.savingsGoal > 0 && (
                  <p className="mt-2 text-sm text-gray-600">
                    Monthly target: £{(goals.savingsGoal / 12).toFixed(2)}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Preferred Payday
                </label>
                <Input
                  type="number"
                  min="1"
                  max="31"
                  value={profile.payDate}
                  onChange={(e) => setProfile({ ...profile, payDate: e.target.value })}
                  required
                  className="mt-1"
                  placeholder="Day of month (1-31)"
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Finalizing...' : 'Complete Setup'}
            </Button>
          </form>
        )
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-4">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-6 shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            {step === 'credentials' && 'Create your account'}
            {step === 'profile' && 'Tell us about yourself'}
            {step === 'goals' && 'Set your financial goals'}
          </h2>
          {step === 'credentials' && (
            <p className="mt-2 text-sm text-gray-600">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-indigo-600 hover:text-indigo-500">
                Sign in
              </Link>
            </p>
          )}
        </div>

        {error && (
          <Alert variant="destructive">
            {error}
          </Alert>
        )}

        {renderStep()}
      </div>
    </div>
  )
} 