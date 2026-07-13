import {db_connection} from '@/dbConfig/dbconfig'
import User from '@/models/userModels'
import { NextResponse, NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'
import { logInSchema } from '@/schemas/logInSchema'
import validateRequest from '@/app/api/validateRequest'
import { z } from 'zod'
import asyncHandler from '@/utils/asyncHandler' 
import ApiError from '@/utils/ApiError'  
import toastResponse from '@/utils/toastErrorWrapper'

export const POST = asyncHandler(async(request: NextRequest) => {
    await db_connection();
        const result= await validateRequest(request.json(), logInSchema) as z.infer<typeof logInSchema>

        const email = result.email
        const password = result.password

        const dbUser= await User.findOne({email})
        
        if(!dbUser){
            console.log("dbUser is null/wrong email/user not exists")
            toastResponse('User Not Found')
            throw new ApiError(409, "Not loggd in, dbUser is null/wrong email/user not exists")
        }
        if(dbUser.password!==password){
            console.log("wrong password")
            toastResponse('Invalid Password')
            throw new ApiError(401, "Wrong Password")
        }
        // console.log('Login Sucessful')

        const tokenData={
            name: dbUser.userName,
            email: dbUser.email
        }

        const tk_secret=process.env.SECRET_TOKEN || "Ibrahim";
        const token= jwt.sign(tokenData, tk_secret, {expiresIn: '1d'})

        const response= NextResponse.json({message: 'user loggedIN sucessfully: ', success: true, status:200, User:dbUser, toastMessage: 'Login Successfull'})
        response.cookies.set('token', token, {httpOnly:true})

        return response

    }) 