
import { NextResponse, NextRequest } from 'next/server'

export async function POST(request :NextRequest){
    try {
        const response=NextResponse.json({message: 'Logged Out Successfully', success:true})
        response.cookies.set('token', "", { 
            httpOnly: true, 
            expires: new Date(0),
            path: '/' 
        })
        
        response.cookies.set('next-auth.session-token', "", { 
            expires: new Date(0),
            path: '/' 
        })
        
        response.cookies.set('__Secure-next-auth.session-token', "", { 
            expires: new Date(0),
            path: '/' 
        })

        return  response
        
    } 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch (error:any) {
        return NextResponse.json({message: "got and error for login", 
            error: error.message, status:500
        })
    }
}