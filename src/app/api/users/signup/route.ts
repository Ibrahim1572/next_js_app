import {db_connection} from '@/dbConfig/dbconfig'
import User from '@/models/userModels'
import { NextResponse, NextRequest } from 'next/server'
import { signUpSchema } from '@/schemas/signUpSchema'


export async function POST(request: NextRequest){
    await db_connection();
    try {
        const reqBody= await request.json()
        const result= signUpSchema.safeParse(reqBody)

        if(!result.success){
            return NextResponse.json(
                {
                    success: false, 
                    message: 'Invalid Post Data', 
                    error: result.error.flatten().fieldErrors, 
                    status: 400
                })
        }
                
        const email = result.data.email
        const userName = result.data.username
        const password = result.data.password


        const user= await User.findOne({email})
        // console.log(user)
        if(user){
            return NextResponse.json({error: 'User already registerd', status:400, toastMessage: 'User already registred'})
        }
        // console.log(user)
        const newUser= new User({email, userName, password})
        const savedUser=await newUser.save()
        // console.log(savedUser)

        return NextResponse.json({message: 'user registerd sucessfully', User:savedUser, success: true, status:200, toastMessage:'User Registred Successfully'})
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch (error:any) {
        return NextResponse.json({error: error.message, message:'This is an error from the signup api route', status: 500})
    }
}
