import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req: request, res })
  
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Public paths that don't require auth
  const isPublicPath = request.nextUrl.pathname.startsWith('/auth')
  const isHomePage = request.nextUrl.pathname === '/'
  const isOnboardingPath = request.nextUrl.pathname === '/auth/onboarding'

  // Allow public access to home page
  if (isHomePage) {
    return res
  }

  if (!session) {
    // If no session and trying to access protected pages, redirect to login
    if (!isPublicPath && !isHomePage) {
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }
  } else {
    // If authenticated
    try {
      // Check onboarding status
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('onboarding_completed')
        .eq('user_id', session.user.id)
        .single()

      // If onboarding not completed and not on onboarding page, redirect to onboarding
      if (!profile?.onboarding_completed && !isOnboardingPath) {
        return NextResponse.redirect(new URL('/auth/onboarding', request.url))
      }

      // If onboarding completed and trying to access auth pages, redirect to dashboard
      if (profile?.onboarding_completed && isPublicPath) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
    } catch (error) {
      // If profile doesn't exist yet and not on onboarding, redirect to onboarding
      if (!isOnboardingPath) {
        return NextResponse.redirect(new URL('/auth/onboarding', request.url))
      }
    }
  }

  return res
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
} 