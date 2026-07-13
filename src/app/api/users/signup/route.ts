import {db_connection} from '@/dbConfig/dbconfig'
import User from '@/models/userModels'
import { NextResponse, NextRequest } from 'next/server'
import { signUpSchema } from '@/schemas/signUpSchema'
import validateRequest from '../../validateRequest';
import { z } from 'zod'


export async function POST(request: NextRequest){
    await db_connection();
    try {

        const result = await validateRequest(request.json(), signUpSchema) as z.infer<typeof signUpSchema>
                
        const email = result.email
        const userName = result.userName
        const password = result.password


        const user= await User.findOne({email})
        if(user){
            return NextResponse.json({error: 'User already registerd', status:400, toastMessage: 'User already registred'})
        }
        const newUser= new User({email, userName, password})
        const savedUser=await newUser.save()

        return NextResponse.json({message: 'user registerd sucessfully', User:savedUser, success: true, status:200, toastMessage:'User Registred Successfully'})
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch (error:any) {
        return NextResponse.json({error: error.message, message:'This is an error from the signup api route', status: 500})
    }
}
