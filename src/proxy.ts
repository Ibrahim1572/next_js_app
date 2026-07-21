import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
// This function can be marked `async` if using `await` inside
export function proxy(request: NextRequest) {
  const path=request.nextUrl.pathname

  const isPathPublic= path==='/login' || path==='/signup'
  const token=request.cookies.get('accessToken')?.value || ""
  // console.log("-------------------------------------------------")
  // console.log(isPathPublic)
  const nextAuthToken = request.cookies.get('next-auth.session-token')?.value || request.cookies.get('__Secure-next-auth.session-token')?.value || ""

  // A session is valid if either the custom token or the OAuth token exists
  const hasValidSession = token || nextAuthToken

  if (isPathPublic&&hasValidSession) {
      return NextResponse.redirect(new URL('/mediaposts', request.url))
  }

  if(!isPathPublic&&!hasValidSession){
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/profile', '/logout', '/mediaposts']
  // matcher: ["/", '/profile', '/logout', '/login', '/signup']
}