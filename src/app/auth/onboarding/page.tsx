"use client"

import { useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function OnboardingPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    displayName: '',
    ageRange: '',
    location: '',
    jobField: '',
    monthlyIncome: '',
    savingsGoal: '',
    paydayDate: '',
  })
  
  const router = useRouter()
  const supabase = createClientComponentClient()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No user found')

      // Update user metadata with display name
      const { error: updateError } = await supabase.auth.updateUser({
        data: { display_name: formData.displayName }
      })

      if (updateError) throw updateError

      // Create or update user profile with onboarding data
      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          user_id: user.id,
          email: user.email,
          display_name: formData.displayName,
          age_range: formData.ageRange,
          location: formData.location,
          job_field: formData.jobField,
          monthly_income: parseFloat(formData.monthlyIncome),
          savings_goal: parseFloat(formData.savingsGoal),
          payday_date: parseInt(formData.paydayDate),
          onboarding_completed: true,
        })

      if (error) throw error

      toast({
        title: "Setup Complete",
        description: "Your profile has been created successfully.",
      })

      router.push('/dashboard')
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save your profile. Please try again.",
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
          <h1 className="text-3xl font-bold">Complete Your Profile</h1>
          <p className="text-muted-foreground">
            Help us personalize your experience
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="displayName">Display Name</Label>
            <Input
              id="displayName"
              value={formData.displayName}
              onChange={(e) => setFormData({...formData, displayName: e.target.value})}
              placeholder="How should we call you?"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ageRange">Age Range</Label>
            <Select
              value={formData.ageRange}
              onValueChange={(value) => setFormData({...formData, ageRange: value})}
            >
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

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
              placeholder="City, Country"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="jobField">Job Field</Label>
            <Input
              id="jobField"
              value={formData.jobField}
              onChange={(e) => setFormData({...formData, jobField: e.target.value})}
              placeholder="e.g. Technology, Healthcare"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="monthlyIncome">Monthly Income</Label>
            <Input
              id="monthlyIncome"
              type="number"
              value={formData.monthlyIncome}
              onChange={(e) => setFormData({...formData, monthlyIncome: e.target.value})}
              placeholder="0.00"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="savingsGoal">Monthly Savings Goal</Label>
            <Input
              id="savingsGoal"
              type="number"
              value={formData.savingsGoal}
              onChange={(e) => setFormData({...formData, savingsGoal: e.target.value})}
              placeholder="0.00"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="paydayDate">Payday Date</Label>
            <Input
              id="paydayDate"
              type="number"
              min="1"
              max="31"
              value={formData.paydayDate}
              onChange={(e) => setFormData({...formData, paydayDate: e.target.value})}
              placeholder="Day of month (1-31)"
            />
          </div>

          <Button
            className="w-full"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Complete Setup"}
          </Button>
        </form>
      </div>
    </div>
  )
} 