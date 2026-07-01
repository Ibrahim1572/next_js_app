import {db_connection} from '@/dbConfig/dbconfig'
import User from '@/models/userModels'
import { NextResponse, NextRequest } from 'next/server'


export async function POST(request: NextRequest){
    await db_connection();
    try {
        const reqBody= await request.json()
        const{email, userName, password}=reqBody
        // const emailLower=email.toLowerCase()

        // if(password!==confirmPassword){
        //     return NextResponse.json({error: "password and conform password don't match", status:400})
        // }

        const user= await User.findOne({email})
        console.log(user)
        if(user){
            return NextResponse.json({error: 'User already registerd', status:400})
        }
        console.log(user)
        const newUser= new User({email, userName, password})
        const savedUser=await newUser.save()
        console.log(savedUser)

        return NextResponse.json({message: 'user registerd sucessfully', savedUser, success: true})
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch (error:any) {
        return NextResponse.json({error: error.message, message:'last'})
    }
}
