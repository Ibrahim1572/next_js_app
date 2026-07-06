import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { NextRequest} from "next/server";
import {db_connection} from '@/dbConfig/dbconfig'
import { jwtDecode } from "jwt-decode";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";


export async function POST(request: NextRequest){
    await db_connection();
    try {console.log("------------------------------------------------------------------------")

        const cookieStore=cookies();
        let extractedUserEmail;
        let extractedUserName;
        let cookieType='jwt'

        let tokenCookie=(await cookieStore).get('token')
        
        if(!tokenCookie){
            tokenCookie=(await cookieStore).get('__Secure-next-auth.session-token')
            cookieType='nextAuth'
        }
        if(!tokenCookie){
            tokenCookie=(await cookieStore).get('next-auth.session-token')
            cookieType='nextAuth'
        }

        if (!tokenCookie) {
            return NextResponse.json({ message: "Token cookie not found", toastMessage: 'No user logged in: UNAUTHORIZED ACCESS' }, { status: 401 });
        }

        if(cookieType==='jwt'){
                            const tokenValue = tokenCookie.value;
                            // console.log(`token cookie: ${tokenCookie}`)
                            // console.log(`token cookie: ${tokenCookie.value}`)
                            // console.log(jwtDecode(tokenCookie.value))
                            const decodedToken= jwtDecode(tokenValue);
                            // console.log(decodedToken)
                            // console.log(decodedToken.email)
                            // console.log(typeof(decodedToken))
                            extractedUserEmail = decodedToken.email;
                            extractedUserName = decodedToken.name;
                            // console.log(extractedUserEmail)
                            // console.log(extractedUserName)
                        }
                
                        if(cookieType==='nextAuth'){
                            const session = await getServerSession(authOptions);
                            
                            if (session && session.user && session.user.email&&session.user.name) {
                                extractedUserEmail = session.user.email;
                                extractedUserName = session.user.name;
                                }
                        }

        
        const userData={email:extractedUserEmail, name:extractedUserName}
        console.log(userData)
        const response =NextResponse.json({'User Data': userData, status:200, toastMessage:'Data Retrieved Successfully'})
        return response        
    } 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch (error:any) {
        const response= NextResponse.json({message:"this is an error in the post api route", status:500, error: error.message})
        return response;
    }

}