"use client"

import { useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

export default function RegisterPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState<'register' | 'verify'>('register')
  const router = useRouter()
  const supabase = createClientComponentClient()
  const { toast } = useToast()

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${location.origin}/auth/callback`,
        },
      })

      if (error) throw error

      setStep('verify')
      toast({
        title: "Verification email sent",
        description: "Please check your email to verify your account before continuing.",
      })

    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred during registration.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCompleteSetup = async () => {
    setIsLoading(true)

    try {
      // Check if user is authenticated and email is verified
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user || !user.email_confirmed_at) {
        toast({
          title: "Email not verified",
          description: "Please verify your email before continuing.",
          variant: "destructive",
        })
        return
      }

      // Create user profile after email verification
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert([
          {
            user_id: user.id,
            email: user.email,
          }
        ])

      if (profileError) throw profileError

      router.push('/dashboard')
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to complete setup. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="mx-auto w-full max-w-md space-y-6 px-4">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Create an account</h1>
          <p className="text-muted-foreground">
            Enter your email to create your account
          </p>
        </div>

        {step === 'register' ? (
          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button
              className="w-full"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Create account"}
            </Button>
          </form>
        ) : (
          <div className="space-y-4">
            <p className="text-center text-muted-foreground">
              Please check your email and verify your account before continuing.
            </p>
            <Button
              className="w-full"
              onClick={handleCompleteSetup}
              disabled={isLoading}
            >
              {isLoading ? "Completing setup..." : "Complete Setup"}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
} 