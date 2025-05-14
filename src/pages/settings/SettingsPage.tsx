import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig
} from "@/components/ui/chart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function SettingsPage() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [autoPlay, setAutoPlay] = useState(true);

  // Subscription data for charts
  const subscriptionData = [
    { month: "Jan", premium: 42, basic: 28, free: 30 },
    { month: "Feb", premium: 45, basic: 30, free: 25 },
    { month: "Mar", premium: 50, basic: 35, free: 15 },
    { month: "Apr", premium: 55, basic: 32, free: 13 },
    { month: "May", premium: 60, basic: 30, free: 10 },
    { month: "Jun", premium: 65, basic: 28, free: 7 },
  ];

  // Revenue comparison data
  const revenueComparisonData = [
    { plan: "Free", value: 0, users: 650 },
    { plan: "Basic", value: 7.99, users: 1240 },
    { plan: "Premium", value: 14.99, users: 2350 },
  ];

  // Chart configs
  const subscriptionChartConfig: ChartConfig = {
    premium: {
      label: "Premium",
      theme: {
        light: "#6366f1",
        dark: "#818cf8"
      }
    },
    basic: {
      label: "Basic",
      theme: {
        light: "#f59e0b",
        dark: "#fbbf24"
      }
    },
    free: {
      label: "Free",
      theme: {
        light: "#d1d5db",
        dark: "#6b7280"
      }
    }
  };

  const revenueChartConfig: ChartConfig = {
    value: {
      label: "Price",
      theme: {
        light: "#10b981",
        dark: "#34d399"
      }
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="subscription">Subscription</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Update your general account preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" defaultValue="John Doe" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" defaultValue="john.doe@example.com" type="email" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select defaultValue="en">
                  <SelectTrigger id="language">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="pt">Portuguese</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select defaultValue="utc-8">
                  <SelectTrigger id="timezone">
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="utc-12">UTC-12:00</SelectItem>
                    <SelectItem value="utc-8">UTC-08:00</SelectItem>
                    <SelectItem value="utc-5">UTC-05:00</SelectItem>
                    <SelectItem value="utc">UTC</SelectItem>
                    <SelectItem value="utc+1">UTC+01:00</SelectItem>
                    <SelectItem value="utc+8">UTC+08:00</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button>Save Changes</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Playback Settings</CardTitle>
              <CardDescription>
                Customize your viewing experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="autoplay">Autoplay next episode</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically play the next episode in a series
                  </p>
                </div>
                <Switch
                  id="autoplay"
                  checked={autoPlay}
                  onCheckedChange={setAutoPlay}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quality">Default Video Quality</Label>
                <Select defaultValue="auto">
                  <SelectTrigger id="quality">
                    <SelectValue placeholder="Select quality" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto">Auto (Recommended)</SelectItem>
                    <SelectItem value="4k">4K Ultra HD</SelectItem>
                    <SelectItem value="1080p">1080p Full HD</SelectItem>
                    <SelectItem value="720p">720p HD</SelectItem>
                    <SelectItem value="480p">480p SD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="appearance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Customize how the application looks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="dark-mode">Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable dark mode for a better viewing experience at night
                  </p>
                </div>
                <Switch
                  id="dark-mode"
                  checked={darkMode}
                  onCheckedChange={setDarkMode}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="font-size">Font Size</Label>
                <Select defaultValue="medium">
                  <SelectTrigger id="font-size">
                    <SelectValue placeholder="Select font size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                    <SelectItem value="x-large">Extra Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Manage how you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-notifications">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications about new content and account updates via email
                  </p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="marketing-emails">Marketing Emails</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive emails about new features, special offers, and promotions
                  </p>
                </div>
                <Switch
                  id="marketing-emails"
                  checked={marketingEmails}
                  onCheckedChange={setMarketingEmails}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notification-frequency">Notification Frequency</Label>
                <Select defaultValue="daily">
                  <SelectTrigger id="notification-frequency">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediately">Immediately</SelectItem>
                    <SelectItem value="daily">Daily Digest</SelectItem>
                    <SelectItem value="weekly">Weekly Digest</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="subscription" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Subscription Details</CardTitle>
              <CardDescription>
                View and manage your current subscription
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 rounded-lg bg-muted">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">Current Plan: Premium</p>
                    <p className="text-sm text-muted-foreground">Your plan renews on October 21, 2023</p>
                  </div>
                  <Button variant="outline">Change Plan</Button>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Plan Features</h3>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <svg className="h-4 w-4 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Full library access - all movies and shows
                  </li>
                  <li className="flex items-center">
                    <svg className="h-4 w-4 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    4K Ultra HD streaming
                  </li>
                  <li className="flex items-center">
                    <svg className="h-4 w-4 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Watch on 4 devices simultaneously
                  </li>
                  <li className="flex items-center">
                    <svg className="h-4 w-4 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Offline downloads
                  </li>
                  <li className="flex items-center">
                    <svg className="h-4 w-4 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Ad-free experience
                  </li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Subscription Analytics</h3>
                
                <div className="h-64">
                  <ChartContainer config={subscriptionChartConfig}>
                    <AreaChart data={subscriptionData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip
                        content={({ active, payload }) => (
                          <ChartTooltipContent
                            active={active}
                            payload={payload}
                          />
                        )}
                      />
                      <Area type="monotone" dataKey="premium" name="premium" stackId="1" strokeWidth={2} />
                      <Area type="monotone" dataKey="basic" name="basic" stackId="1" strokeWidth={2} />
                      <Area type="monotone" dataKey="free" name="free" stackId="1" strokeWidth={2} />
                    </AreaChart>
                  </ChartContainer>
                </div>
                
                <div className="h-64 mt-8">
                  <h3 className="text-lg font-semibold mb-2">Pricing Comparison</h3>
                  <ChartContainer config={revenueChartConfig}>
                    <BarChart data={revenueComparisonData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="plan" />
                      <YAxis />
                      <ChartTooltip
                        content={({ active, payload }) => (
                          <ChartTooltipContent
                            active={active}
                            payload={payload}
                            formatter={(value, name) => 
                              name === 'value' ? `$${value}` : value.toLocaleString()
                            }
                          />
                        )}
                      />
                      <Bar dataKey="value" name="value" />
                    </BarChart>
                  </ChartContainer>
                </div>
              </div>
              
              <div className="pt-4 border-t flex justify-between">
                <Button variant="outline" className="text-destructive">
                  Cancel Subscription
                </Button>
                <Button>Upgrade Plan</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}