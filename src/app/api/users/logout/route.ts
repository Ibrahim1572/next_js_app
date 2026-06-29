
import { NextResponse, NextRequest } from 'next/server'

export async function POST(request :NextRequest){
    try {
        const response=NextResponse.json({message: 'Logged Out Successfully', success:true})
        if(response.cookies.get('token')){response.cookies.set('token' ,"", {httpOnly:true, expires: new Date(0)})}
        if(response.cookies.get('next-auth.session-token')){response.cookies.set('next-auth.session-token', "")}
        if(response.cookies.get('__Secure-next-auth.session-token')){response.cookies.set('__Secure-next-auth.session-token', "")}
        //   const nextAuthToken = request.cookies.get('next-auth.session-token')?.value || request.cookies.get('__Secure-next-auth.session-token')?.value || ""

        console.log(response.cookies)
        return  response
        
    } 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch (error:any) {
        return NextResponse.json({message: "got and error for login", 
            error: error.message, status:500
        })
    }
}