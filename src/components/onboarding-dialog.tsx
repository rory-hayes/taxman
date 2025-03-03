"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useToast } from "@/components/ui/use-toast"

export function OnboardingDialog() {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    displayName: '',
    ageRange: '',
    jobField: '',
    savingsGoal: '',
    paydayDate: '',
  })
  
  const supabase = createClientComponentClient()
  const { toast } = useToast()

  useEffect(() => {
    checkOnboardingStatus()
  }, [])

  const checkOnboardingStatus = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('onboarding_completed')
      .eq('user_id', user.id)
      .single()

    setOpen(!profile?.onboarding_completed)
  }

  const handleSubmit = async () => {
    setIsLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No user found')

      // Update user metadata
      await supabase.auth.updateUser({
        data: {
          display_name: formData.displayName,
          age_range: formData.ageRange,
          job_field: formData.jobField,
        }
      })

      // Create/update profile
      await supabase
        .from('user_profiles')
        .upsert({
          user_id: user.id,
          email: user.email,
          display_name: formData.displayName,
          age_range: formData.ageRange,
          job_field: formData.jobField,
          savings_goal: parseFloat(formData.savingsGoal) || 0,
          payday_date: parseInt(formData.paydayDate) || 1,
          onboarding_completed: true,
        })

      setOpen(false)
      toast({
        title: "Profile Updated",
        description: "Your profile has been set up successfully.",
      })
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Complete Your Profile</DialogTitle>
          <DialogDescription>
            Help us personalize your experience
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="displayName">Display Name</Label>
            <Input
              id="displayName"
              value={formData.displayName}
              onChange={(e) => setFormData({...formData, displayName: e.target.value})}
              placeholder="How should we call you?"
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
            <Label htmlFor="jobField">Job Field</Label>
            <Input
              id="jobField"
              value={formData.jobField}
              onChange={(e) => setFormData({...formData, jobField: e.target.value})}
              placeholder="e.g. Technology, Healthcare"
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
        </div>

        <Button
          className="w-full"
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? "Saving..." : "Complete Setup"}
        </Button>
      </DialogContent>
    </Dialog>
  )
} 