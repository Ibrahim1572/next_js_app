import {db_connection} from '@/dbConfig/dbconfig'
import User from '@/models/userModels'
import { NextResponse, NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'
import { logInSchema } from '@/schemas/logInSchema'
import validateRequest from '@/app/api/validateRequest'
import { z } from 'zod'
import asyncHandler from '@/utils/asyncHandler' 

export const POST = asyncHandler(async(request: NextRequest) => {
    await db_connection();
    const requestJSON = await request.json()
    // console.log('---------------------------------------------------------')
        // console.log(requestJSON)
        const result= await validateRequest(requestJSON, logInSchema) as z.infer<typeof logInSchema>
        
        // console.log(result)
        
        const email = result.email
        const password = result.password
        
        const dbUser= await User.findOne({email})
        // console.log('---------------------------------------------------------')
        // console.log(dbUser)
        
        if(!dbUser){
            // console.log("dbUser is null/wrong email/user not exists")
            return NextResponse.json({toastMessage: "Not loggd in, dbUser is null/wrong email/user not exists", status: 401})
            // toastResponse('User Not Found')
            // throw new ApiError(409, "Not loggd in, dbUser is null/wrong email/user not exists")
        }
        if(dbUser.password!==password){
            return NextResponse.json({toastMessage: "Wrong Password", status: 401})

            // toastResponse('Invalid Password')
            // throw new ApiError(401, "Wrong Password")
        }
        // console.log('Login Sucessful')

        const tokenData={
            name: dbUser.userName,
            email: dbUser.email,
            role: dbUser.userRole
        }

        

        const tk_secret=process.env.SECRET_TOKEN || "Ibrahim";
        const token= jwt.sign(tokenData, tk_secret, {expiresIn: '1d'})

        const response= NextResponse.json({message: 'user loggedIN sucessfully: ', success: true, status:200, User:dbUser, toastMessage: 'Login Successfull'})
        response.cookies.set('token', token, {httpOnly:true})

        return response

    }) 