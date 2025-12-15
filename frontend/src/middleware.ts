import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { i18n } from '../next-i18next.config'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  
  // Skip locale redirect for static files and API routes
  const isStaticFile = pathname.startsWith('/uploads/') || 
                       pathname.startsWith('/downloads/') ||
                       pathname.match(/\.(ico|png|jpg|jpeg|svg|gif|webp|pdf|txt|csv|doc|docx|xls|xlsx)$/i)
  
  if (isStaticFile) {
    return NextResponse.next()
  }
  
  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  )

  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    const locale = i18n.defaultLocale
    return NextResponse.redirect(
      new URL(`/${locale}${pathname}`, request.url)
    )
  }
  
  // Return next() when locale is already present to allow request to proceed
  return NextResponse.next()
}

export const config = {
  matcher: [
    // Skip all internal paths (_next) and static files
    '/((?!api|_next/static|_next/image|favicon.ico|uploads|downloads).*)',
  ],
}