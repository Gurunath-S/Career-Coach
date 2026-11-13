import { NextResponse, type NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'careercatch_super_secure_jwt_secret_2026'
)

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Only apply to /student/dashboard, /student/profile, /student/events
  // Public auth pages /student/login and /student/register are excluded
  if (
    pathname.startsWith('/student') &&
    !pathname.startsWith('/student/login') &&
    !pathname.startsWith('/student/register')
  ) {
    const sessionCookie = request.cookies.get('careercatch_student_session')?.value

    if (!sessionCookie) {
      const loginUrl = new URL('/student/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }

    try {
      const { payload } = await jwtVerify(sessionCookie, JWT_SECRET)
      if (payload.role !== 'STUDENT') {
        const loginUrl = new URL('/student/login', request.url)
        loginUrl.searchParams.set('redirect', pathname)
        return NextResponse.redirect(loginUrl)
      }

      // Valid session -> forward with user headers
      const response = NextResponse.next()
      response.headers.set('x-student-id', String(payload.id))
      return response
    } catch {
      // Invalid or expired token -> redirect to login
      const loginUrl = new URL('/student/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      const res = NextResponse.redirect(loginUrl)
      res.cookies.delete('careercatch_student_session')
      return res
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/student/:path*'],
}
