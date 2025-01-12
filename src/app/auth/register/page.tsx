'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/providers/supabase-auth-provider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert } from '@/components/ui/alert'
import { Select } from '@/components/ui/select'

type Step = 'credentials' | 'profile' | 'goals'

interface ProfileData {
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
      // TODO: Save goals data to Supabase
      router.push('/auth/verify-email')
    } catch (error) {
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
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
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
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
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
                <Select
                  value={profile.ageRange}
                  onChange={(e) => setProfile({ ...profile, ageRange: e.target.value })}
                >
                  <option value="18-24">18-24</option>
                  <option value="25-34">25-34</option>
                  <option value="35-44">35-44</option>
                  <option value="45-54">45-54</option>
                  <option value="55+">55+</option>
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
                  Annual Savings Goal
                </label>
                <Input
                  id="savingsGoal"
                  type="number"
                  value={goals.savingsGoal}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                    setGoals({ ...goals, savingsGoal: Number(e.target.value) })}
                  required
                  className="mt-1"
                  placeholder="10000"
                />
              </div>

              {/* Add other goals fields */}
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