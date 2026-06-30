import { error } from "console";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { NextRequest} from "next/server";
import {db_connection} from '@/dbConfig/dbconfig'
import { jwtDecode } from "jwt-decode";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import User from '@/models/userModels'


export async function POST(request: NextRequest){
    await db_connection();
    try {console.log("------------------------------------------------------------------------")

        const cookieStore=cookies();
        let extractedUserEmail=""
        let extractedUserName=""
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
            return NextResponse.json({ message: "Token cookie not found" }, { status: 401 });
        }

        if(cookieType==='jwt'){
                            const tokenValue = tokenCookie.value;
                            const decodedToken= jwtDecode(tokenValue);
                            extractedUserEmail = decodedToken.email;
                            extractedUserName = decodedToken.name;
                        }
                
                        if(cookieType==='nextAuth'){
                            const session = await getServerSession(authOptions);
                            // console.log(`session: ${session}`)
                            // console.log(`session value: ${session.value}`)
                            // console.log(`session user: ${session.user}`)
                            // console.log(`Stringified Session: ${JSON.stringify(session, null, 2)}`);
                            // console.log(`session user email: ${session.user.email}`)
                            if (session && session.user && session.user.email&&session.user.name) {
                                extractedUserEmail = session.user.email;
                                extractedUserName = session.user.name;
                                }
                        }

        // const tokenValue = tokenCookie.value;

        // const decodedToken= jwtDecode(tokenValue);
        // // console.log(decodedToken)
        // const extractedUserId = decodedToken.id;

        // if (!extractedUserId) {
        //     return NextResponse.json({ message: "Invalid token payload structures" }, { status: 400 });
        // }

        // const dbUser= await User.findOne({ _id: extractedUserId });
        const userData={email:extractedUserEmail, name:extractedUserName}
        const response =NextResponse.json({dbUser: userData})
        return response        
    } 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch (error:any) {
        const response= NextResponse.json({message: error.message})
        return response;
    }

}