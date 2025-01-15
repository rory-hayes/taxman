"use client"

import { useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function TaxSettings({ initialSettings }: { initialSettings: any }) {
  const [settings, setSettings] = useState({
    taxYear: initialSettings?.tax_year || `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
    taxCode: initialSettings?.tax_code || "1257L",
    paymentFrequency: initialSettings?.payment_frequency || "monthly"
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tax Settings</CardTitle>
        <CardDescription>Configure your tax preferences</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label>Tax Year</Label>
            <Input 
              value={settings.taxYear} 
              onChange={(e) => setSettings({ ...settings, taxYear: e.target.value })}
              disabled
            />
          </div>
          <div>
            <Label>Tax Code</Label>
            <Input 
              value={settings.taxCode} 
              onChange={(e) => setSettings({ ...settings, taxCode: e.target.value })}
            />
          </div>
          <div>
            <Label>Payment Frequency</Label>
            <Select 
              value={settings.paymentFrequency}
              onValueChange={(value) => setSettings({ ...settings, paymentFrequency: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select payment frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="annual">Annual</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 