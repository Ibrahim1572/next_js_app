
import { NextResponse, NextRequest } from 'next/server'

export const POST= ((request :NextRequest)=>{
    
        const response=NextResponse.json({message: 'Logged Out Successfully', success:true, status:200, toastMessage: 'Logged Out Successfully'})
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

        // await RefreshToken.updateMany({userEmail: tokenData.userData.email, isValid: true}, {$set:{isVaid: false}})
        
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