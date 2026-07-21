
import { NextResponse, NextRequest } from 'next/server'
import cookieFunction from '@/utils/cookieWrapper'
import asyncHandler from '@/utils/asyncHandler'
import RefreshToken from '@/models/refreshTokenModel'

export const POST= asyncHandler(async(request :NextRequest)=>{
    
        const resp = await cookieFunction()
        const userData = await resp.json()  
       
        await RefreshToken.findOneAndUpdate({userEmail: userData.userData.email, isValid: true}, {$set:{isValid: false}}, {sort:{createdAt:-1}})

        const response=NextResponse.json({message: 'Logged Out Successfully', userData: userData.userData.name, success:true, status:200, toastMessage: 'Logged Out Successfully'})
        response.cookies.set('token', "", { 
            httpOnly: true, 
            expires: new Date(0),
            path: '/' 
        })

        response.cookies.set('accessToken', "", { 
            httpOnly: true, 
            expires: new Date(0),
            path: '/' 
        })

        response.cookies.set('refreshToken', "", { 
            httpOnly: true, 
            expires: new Date(0),
            path: '/' 
        })

        response.cookies.set('next-auth.session-token', "", { 
            httpOnly: true,
            expires: new Date(0),
            path: '/' 
        })
        
        response.cookies.set('__Secure-next-auth.session-token', "", { 
            httpOnly: true,
            expires: new Date(0),
            path: '/' 
        })

        return  response
})