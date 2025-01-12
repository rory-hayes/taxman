import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, BarChart3, Shield, Sparkles } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-20 pb-16">
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
    </div>
  )
} 