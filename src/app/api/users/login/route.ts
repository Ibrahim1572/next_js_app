import {db_connection} from '@/dbConfig/dbconfig'
import User from '@/models/userModels'
import { NextResponse, NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

export async function POST(request: NextRequest){
    await db_connection();
    try {
        const reqBody= await request.json()
        const{email, password}=reqBody

        console.log(email);
        const dbUser= await User.findOne({email})
        
        if(!dbUser){
            console.log("dbUser is null/wrong email/user not exists")
            return NextResponse.json({message: "Not loggd in, dbUser is null/wrong email/user not exists", status :400, dbUser})
        }
        if(dbUser.password!==password){
            console.log("wrong password")
            return NextResponse.json({message: "Wrong Password", status :400, dbUser})
        }
        console.log('Login Sucessful')


        const tokenData={
            name: dbUser.name,
            email: dbUser.email

        }
        console.log(`dbUser: ${dbUser}`)
        console.log(`token data: ${tokenData}`)
        const tk_secret=process.env.SECRET_TOKEN || "Ibrahim";
        console.log(`Secret key= ${tk_secret}`)
        const token= jwt.sign(tokenData, tk_secret, {expiresIn: '1d'})

        const response= NextResponse.json({message: 'user loggedIN sucessfully: ', success: true})
        response.cookies.set('token', token, {httpOnly:true})

        console.log(response.cookies)
        return response

    } 
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch (error:any) {
        return NextResponse.json({message: "got and error for login", 
            error: error.message, status:500
        })
    }
} 