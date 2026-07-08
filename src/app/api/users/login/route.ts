import {db_connection} from '@/dbConfig/dbconfig'
import User from '@/models/userModels'
import { NextResponse, NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'
import toast from 'react-hot-toast'
import { logInSchema } from '@/schemas/logInSchema'

export async function POST(request: NextRequest){
    await db_connection();
    try {
        const reqBody= await request.json()
        const result= logInSchema.safeParse(reqBody)
                
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
        const password = result.data.password

        // console.log(email);
        const dbUser= await User.findOne({email})
        
        if(!dbUser){
            console.log("dbUser is null/wrong email/user not exists")
            return NextResponse.json({message: "Not loggd in, dbUser is null/wrong email/user not exists", status :409, User:dbUser, toastMessage:'User Not Found'})
        }
        if(dbUser.password!==password){
            console.log("wrong password")
            return NextResponse.json({message: "Wrong Password", status :401, User:dbUser, toastMessage: 'Invalid Password'})
        }
        console.log('Login Sucessful')
        // console.log(dbUser)


        const tokenData={
            name: dbUser.userName,
            email: dbUser.email
        }
        // console.log(`dbUser: ${dbUser}`)
        // console.log(`token data: ${tokenData}`)
        const tk_secret=process.env.SECRET_TOKEN || "Ibrahim";
        // console.log(`Secret key= ${tk_secret}`)
        const token= jwt.sign(tokenData, tk_secret, {expiresIn: '1d'})

        const response= NextResponse.json({message: 'user loggedIN sucessfully: ', success: true, status:200, User:dbUser, toastMessage: 'Login Successfull'})
        response.cookies.set('token', token, {httpOnly:true})

        // console.log(response.cookies)
        return response

    } 
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch (error:any) {
        return NextResponse.json({message: "got and error for login", 
            error: error.message, status:500
        })
    }
} 