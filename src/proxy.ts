import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify, SignJWT } from 'jose'

// Helper to verify JWT using Web Crypto API compatible 'jose' library
async function verifyToken(token: string, secret: string) {
  try {
    const secretKey = new TextEncoder().encode(secret)
    const { payload } = await jwtVerify(token, secretKey)
    return payload
  } 
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  catch (error:any) {
    return null
  }
}

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname
  const isPathPublic = path === '/login' || path === '/signup'

  const accessTokenSecret = process.env.SECRET_ACCESS_TOKEN || 'Ibrahim'
  const refreshTokenSecret = process.env.SECRET_REFRESH_TOKEN || 'Ibrahim1'

  const accessToken = request.cookies.get('accessToken')?.value || ''
  const refreshToken = request.cookies.get('refreshToken')?.value || ''

  // 1. Verify access token
  let validAccessTokenPayload = accessToken ? await verifyToken(accessToken, accessTokenSecret) : null
  let newAccessTokenToSet: string | null = null

  // 2. If access token is missing or expired, attempt refresh
  if (!validAccessTokenPayload && refreshToken) {
    const validRefreshTokenPayload = await verifyToken(refreshToken, refreshTokenSecret)

    if (validRefreshTokenPayload) {
      // Access token was invalid/expired, but refresh token is valid -> Issue new access token
      const secretKey = new TextEncoder().encode(accessTokenSecret)
      
      newAccessTokenToSet = await new SignJWT({
        email: validRefreshTokenPayload.email,
        name: validRefreshTokenPayload.name,
        role: validRefreshTokenPayload.role
      })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('15m')
        .sign(secretKey)

      // Treat session as valid now
      validAccessTokenPayload = validRefreshTokenPayload
    }
  }

  const hasValidSession = Boolean(validAccessTokenPayload)

  // 3. Handle Route Protection
  if (isPathPublic && hasValidSession) {
    const response = NextResponse.redirect(new URL('/mediaposts', request.url))
    if (newAccessTokenToSet) {
      response.cookies.set('accessToken', newAccessTokenToSet, { httpOnly: true, maxAge: 15 * 60, sameSite: 'strict', path: '/' })
    }
    return response
  }

  if (!isPathPublic && !hasValidSession) {
    const response = NextResponse.redirect(new URL('/login', request.url))
    // Clear cookies if session failed completely
    response.cookies.delete('accessToken')
    response.cookies.delete('refreshToken')
    return response
  }

  // 4. Proceed to protected route
  const response = NextResponse.next()

  // If a new access token was generated during refresh, set it in the response cookies
  if (newAccessTokenToSet) {
    response.cookies.set('accessToken', newAccessTokenToSet, {
      httpOnly: true,
      maxAge: 15 * 60,
      sameSite: 'strict',
      path: '/'
    })
  }

  return response
}

export const config = {
  matcher: ['/profile', '/logout', '/mediaposts']
  // matcher: ["/", '/profile', '/logout', '/login', '/signup']
}