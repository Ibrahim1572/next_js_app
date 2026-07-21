import {db_connection} from '@/dbConfig/dbconfig'
import User from '@/models/userModels'
import { NextResponse, NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'
import { logInSchema } from '@/schemas/logInSchema'
import validateRequest from '@/app/api/validateRequest'
import { z } from 'zod'
import asyncHandler from '@/utils/asyncHandler' 
import RefreshToken from '@/models/refreshTokenModel'

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

        const accessTokenData={
            name: dbUser.userName,
            email: dbUser.email,
            role: dbUser.userRole
        }

        const refreshTokenData={
            email: dbUser.email
        }

        const access_tk_secret=process.env.SECRET_ACCESS_TOKEN || "Ibrahim";
        const accessToken= jwt.sign(accessTokenData, access_tk_secret, {expiresIn: '15m'})

        const refresh_tk_secret=process.env.SECRET_REFRESH_TOKEN || "Ibrahim1";
        const refreshToken= jwt.sign(refreshTokenData, refresh_tk_secret, {expiresIn: '7d'})

        const dateNow = new Date()
        const expiryDate = new Date(Date.now()+7*60*60*24*1000)

        const newRefreshToken = new RefreshToken({userEmail: dbUser.email, createdAt: dateNow, updatedAt: dateNow, expiresAt: expiryDate, isValid: true, token: refreshToken})
        const savedRefreshToken = await newRefreshToken.save()
        // console.log(`savedRefreshToken route: ${savedRefreshToken}`)

        const response= NextResponse.json({message: 'user loggedIN sucessfully: ', success: true, status:200, User:dbUser, toastMessage: 'Login Successfull'})
        response.cookies.set('accessToken', accessToken, {httpOnly:true, maxAge:15*60, sameSite: 'strict'})
        response.cookies.set('refreshToken', refreshToken, {httpOnly:true, maxAge: 7*60*60*24, sameSite: 'strict', path: '/api/auth/refresh'})

        return response

    }) 