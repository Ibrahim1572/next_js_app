import cookieFunction from '@/utils/cookieWrapper'
import jwt from 'jsonwebtoken'
import { NextResponse } from 'next/server'
import {cookies} from 'next/headers'


export const GET = async() =>{

    const tempFunc = async() =>{
        const resp = await cookieFunction()
        const tokenData = await resp.json()

        const tk_secret=process.env.SECRET_TOKEN || "Ibrahim";
        const token= jwt.sign(tokenData, tk_secret, {expiresIn: '1d'})

        const response= NextResponse.json({message: 'user loggedIN sucessfully: ', success: true, status:200, toastMessage: 'Login Successfull'})
        response.cookies.set('token', token, {httpOnly:true})
        // console.log(response)
    } 

    const cookieStore = await cookies();
    const token1 = cookieStore.get('__Secure-next-auth.session-token')||""
    const token2 = cookieStore.get('next-auth.session-token')||""
    if(token1||token2){
        const resp = tempFunc()
    }
    
}