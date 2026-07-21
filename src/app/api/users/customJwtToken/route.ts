import cookieFunction from '@/utils/cookieWrapper'
import jwt from 'jsonwebtoken'
import { NextResponse } from 'next/server'
import {cookies} from 'next/headers'
import RefreshToken from '@/models/refreshTokenModel'


export const GET = async() =>{

    const tempFunc = async() =>{
        const resp = await cookieFunction()
        const tokenData = await resp.json()
        await RefreshToken.updateMany({userEmail: tokenData.userData.email, isValid: true}, {$set:{isVaid: false}})
        // const alreadyValidToken = 

        const accessTokenData = {
            name: tokenData.userData.name,
            email: tokenData.userData.email,
            role: tokenData.userData.role
        }

        const refreshTokenData={
            email: tokenData.userData.email
        }

        const access_tk_secret=process.env.SECRET_ACCESS_TOKEN || "Ibrahim";
        const accessToken= jwt.sign(accessTokenData, access_tk_secret, {expiresIn: '15m'})

        const refresh_tk_secret=process.env.SECRET_REFRESH_TOKEN || "Ibrahim1";
        const refreshToken= jwt.sign(refreshTokenData, refresh_tk_secret, {expiresIn: '7d'})

        const dateNow = new Date()
        const expiryDate = new Date(Date.now()+7*60*60*24*1000)

        const newRefreshToken = new RefreshToken({userEmail: tokenData.userData.email, createdAt: dateNow, updatedAt: dateNow, expiresAt: expiryDate, isValid: true, token: refreshToken})
        const savedRefreshToken = await newRefreshToken.save()
        // console.log(`savedRefreshToken custom route: ${savedRefreshToken}`)

        const response= NextResponse.json({message: 'user loggedIN sucessfully: ', success: true, status:200, User:tokenData.userData, toastMessage: 'Login Successfull'})
        response.cookies.set('accessToken', accessToken, {httpOnly:true, maxAge:15*60, sameSite: 'strict'})
        response.cookies.set('refreshToken', refreshToken, {httpOnly:true, maxAge: 7*60*60*24, sameSite: 'strict', path: '/api/auth/refresh'})
        
        return response
    } 

    const cookieStore = await cookies();
    const token1 = cookieStore.get('__Secure-next-auth.session-token')||""
    const token2 = cookieStore.get('next-auth.session-token')||""
    let resp 
    if(token1||token2){
        resp = await tempFunc()
        // console.log(`response form jwt token: ${resp.cookies}`)
        return NextResponse.json({response: resp, status: 200})
    }
    else{
        resp = "falied"
    }
    
    return NextResponse.json({response: resp, status: 200})
}