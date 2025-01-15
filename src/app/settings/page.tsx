import { Metadata } from "next"
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { MainNav } from "@/components/layout/main-nav"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GeneralSettings } from "@/components/settings/general-settings"
import { NotificationSettings } from "@/components/settings/notification-settings"
import { TaxSettings } from "@/components/settings/tax-settings"

export const metadata: Metadata = {
  title: "Settings | TaxMan",
  description: "Manage your account settings and preferences",
}

export default async function SettingsPage() {
  const supabase = createServerComponentClient({ cookies })
  const { data: { user } } = await supabase.auth.getUser()
  
  // Fetch user settings
  const { data: settings } = await supabase
    .from('user_settings')
    .select('*')
    .eq('user_id', user?.id)
    .single()

  return (
    <div className="min-h-screen">
      <MainNav />
      <div className="pl-16">
        <header className="sticky top-0 z-30 flex h-14 items-center border-b bg-background px-4">
          <h1 className="text-lg font-semibold">Settings</h1>
        </header>

        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
              <p className="text-muted-foreground">
                Manage your account settings and preferences
              </p>
            </div>
          </div>

          <Tabs defaultValue="general" className="space-y-4">
            <TabsList>
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="tax">Tax Preferences</TabsTrigger>
            </TabsList>
            <TabsContent value="general" className="space-y-4">
              <GeneralSettings initialSettings={settings} />
            </TabsContent>
            <TabsContent value="notifications" className="space-y-4">
              <NotificationSettings initialSettings={settings} />
            </TabsContent>
            <TabsContent value="tax" className="space-y-4">
              <TaxSettings initialSettings={settings} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
} 