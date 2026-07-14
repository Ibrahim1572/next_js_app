import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { NextRequest} from "next/server";
import {db_connection} from '@/dbConfig/dbconfig'
import { jwtDecode } from "jwt-decode";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import User from '@/models/userModels'
import asyncHandler from '@/utils/asyncHandler' 

export const POST = asyncHandler(async(request: NextRequest) => {
    await db_connection();
    console.log("------------------------------------------------------------------------")

        const cookieStore=cookies();
        let extractedUserEmail;
        let extractedUserName;
        // let extractedUserType;
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
            return NextResponse.json({toastMessage: "Token cookie not found. UNAUTHORIZED ACCESS", status: 401})
            // toastResponse('Unauthorized user')
            // throw new ApiError(401, "Token cookie not found")
        }

        

        if(cookieType==='jwt'){
                            const tokenValue = tokenCookie.value;
                            
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            const decodedToken= jwtDecode(tokenValue) as any;
                           
                            extractedUserEmail = decodedToken.email;
                            extractedUserName = decodedToken.name;
            
                        }
                
                        if(cookieType==='nextAuth'){
                            const session = await getServerSession(authOptions);
                            
                            if (session && session.user && session.user.email&&session.user.name) {
                                extractedUserEmail = session.user.email;
                                extractedUserName = session.user.name;
                                
                                }
                        }

        const user=await User.findOne({email: extractedUserEmail})
        const adminStatus = user.isAdmin
        const extractedUserType = adminStatus?"Admin":"Standard User"
        console.log(extractedUserType)
        
        const userData={email:extractedUserEmail, name:extractedUserName, userType: extractedUserType}
        const response =NextResponse.json({'User Data': userData, status:200, toastMessage:'Data Retrieved Successfully'})
        return response        
})