import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const path=request.nextUrl.pathname

  const isPathPublic= path==='/login' || path==='/signup'
  const token=request.cookies.get('token')?.value || ""
  // console.log("-------------------------------------------------")
  // console.log(isPathPublic)

  if (isPathPublic&&token) {
      return NextResponse.redirect(new URL('/', request.url))
  }

  if(!isPathPublic&&!token){
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/profile', '/logout']
  // matcher: ["/", '/profile', '/logout', '/login', '/signup']
}