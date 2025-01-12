import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { 
  ArrowRight, 
  BarChart3, 
  Shield, 
  Sparkles,
  CheckCircle2,
  Menu
} from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-200">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <Sparkles className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">TaxMan</span>
            </div>
            <div className="hidden md:block">
              <div className="flex items-center space-x-4">
                <Link href="/features">
                  <Button variant="ghost">Features</Button>
                </Link>
                <Link href="/pricing">
                  <Button variant="ghost">Pricing</Button>
                </Link>
                <Link href="/auth/login">
                  <Button variant="outline">Sign In</Button>
                </Link>
                <Link href="/auth/register">
                  <Button>Get Started</Button>
                </Link>
              </div>
            </div>
            <div className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-32 pb-16">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <div className="inline-block">
              <div className="inline-flex items-center rounded-full px-3 py-1 text-sm leading-6 text-indigo-600 ring-1 ring-indigo-600/10 hover:ring-indigo-600/20 bg-white/60 backdrop-blur-sm">
                <span>Now with AI-powered insights</span>
                <Sparkles className="ml-1 h-4 w-4" />
              </div>
            </div>
            <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              Smart Financial Dashboard
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              Take control of your finances with AI-powered insights, automated payslip analysis, 
              and intelligent tax optimization recommendations.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register">
              <Button size="lg" className="w-full sm:w-auto group">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Sign In
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-24 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div className="relative group">
            <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 opacity-25 group-hover:opacity-50 transition-opacity blur"></div>
            <div className="relative p-6 bg-white rounded-lg shadow-sm">
              <div className="w-12 h-12 rounded-lg bg-indigo-500/10 flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Smart Analytics</h3>
              <p className="mt-2 text-gray-600">
                Visualize your financial health with interactive charts and AI-powered insights.
              </p>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 opacity-25 group-hover:opacity-50 transition-opacity blur"></div>
            <div className="relative p-6 bg-white rounded-lg shadow-sm">
              <div className="w-12 h-12 rounded-lg bg-indigo-500/10 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Secure & Private</h3>
              <p className="mt-2 text-gray-600">
                Bank-level encryption and GDPR-compliant data handling for your peace of mind.
              </p>
            </div>
          </div>

          <div className="relative group sm:col-span-2 lg:col-span-1">
            <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 opacity-25 group-hover:opacity-50 transition-opacity blur"></div>
            <div className="relative p-6 bg-white rounded-lg shadow-sm">
              <div className="w-12 h-12 rounded-lg bg-indigo-500/10 flex items-center justify-center mb-4">
                <Sparkles className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">AI Tax Assistant</h3>
              <p className="mt-2 text-gray-600">
                Get personalized tax insights and optimization recommendations powered by AI.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Trusted by Finance Professionals
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              See what our users are saying about their experience
            </p>
          </div>
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Testimonial cards */}
            {[1, 2, 3].map((i) => (
              <div key={i} className="relative rounded-2xl bg-white p-6 shadow-md">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-indigo-500/10" />
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">John Doe</h3>
                    <p className="text-sm text-gray-500">Financial Advisor</p>
                  </div>
                </div>
                <p className="mt-4 text-gray-600">
                  "This platform has revolutionized how I handle my clients' tax planning. The AI insights are incredibly valuable."
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="bg-gray-50 py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Simple, Transparent Pricing
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Choose the plan that works best for you
            </p>
          </div>
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Pricing cards */}
            {['Basic', 'Pro', 'Enterprise'].map((plan) => (
              <div key={plan} className="relative rounded-2xl bg-white p-8 shadow-md">
                <h3 className="text-lg font-semibold text-gray-900">{plan}</h3>
                <p className="mt-4 text-sm text-gray-500">
                  Perfect for {plan === 'Basic' ? 'individuals' : plan === 'Pro' ? 'small businesses' : 'large organizations'}
                </p>
                <div className="mt-8">
                  <span className="text-4xl font-bold text-gray-900">
                    {plan === 'Basic' ? '£9' : plan === 'Pro' ? '£29' : 'Custom'}
                  </span>
                  <span className="text-gray-500">/month</span>
                </div>
                <ul className="mt-8 space-y-4">
                  {[1, 2, 3].map((i) => (
                    <li key={i} className="flex items-center">
                      <CheckCircle2 className="h-5 w-5 text-indigo-600" />
                      <span className="ml-3 text-gray-600">Feature {i}</span>
                    </li>
                  ))}
                </ul>
                <Button className="mt-8 w-full">Get Started</Button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Product</h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <Link href="#" className="text-sm text-gray-600 hover:text-gray-900">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-gray-600 hover:text-gray-900">
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>
            {/* Add more footer columns as needed */}
          </div>
          <div className="mt-8 border-t border-gray-200 pt-8">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} TaxMan. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
} 