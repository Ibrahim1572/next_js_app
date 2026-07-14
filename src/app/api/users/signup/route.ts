import {db_connection} from '@/dbConfig/dbconfig'
import User from '@/models/userModels'
import { NextResponse, NextRequest } from 'next/server'
import { signUpSchema } from '@/schemas/signUpSchema'
import validateRequest from '../../validateRequest';
import { z } from 'zod'
import asyncHandler from '@/utils/asyncHandler' 


export const POST = asyncHandler(async(request: NextRequest) => {
    await db_connection();

        const body = await request.json()
        const result = await validateRequest(body, signUpSchema) as z.infer<typeof signUpSchema>
                
        const email = result.email
        const userName = result.userName
        const password = result.password


        const user= await User.findOne({email})
        if(user){
            // toastResponse('User already registred')
            // throw new ApiError(400, 'User already registerd')
            return NextResponse.json({toastMessage: "User already Exists", status: 409})
        }
        const newUser= new User({email, userName, password})
        const savedUser=await newUser.save()

        return NextResponse.json({message: 'user registerd sucessfully', User:savedUser, success: true, status:200, toastMessage:'User Registred Successfully'})
})
