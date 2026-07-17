import {jwtDecode} from 'jwt-decode'
import {cookies} from 'next/headers'
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { NextResponse} from 'next/server';


const cookieFunction = async() => {
    const cookieStore= await cookies();
            let tokenCookie=cookieStore.get('token')
            let cookieType="jwt"
            let extractedUserEmail=" "
            let extractedUserName= "  "
            let extractedUserRole= " "
    
            if(!tokenCookie){
                tokenCookie=(await cookieStore).get('__Secure-next-auth.session-token')
                cookieType="nextAuth"
            }
            if(!tokenCookie){
                tokenCookie=cookieStore.get('next-auth.session-token')
                cookieType="nextAuth"
            }
            
            if (!tokenCookie) {
                cookieType=""
                // toastResponse('Unauthorized user')
                // throw new ApiError(401, "Token cookie not found")
                return NextResponse.json({toastMessage: "Token cookie not found. UNAUTHORIZED ACCESS", status: 401})
            }
                        
            
            if(cookieType==='jwt'){
                const tokenValue = tokenCookie.value;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const decodedToken= jwtDecode(tokenValue)
                extractedUserEmail = decodedToken.email;
                extractedUserName = decodedToken.name;
                extractedUserRole = decodedToken.role;
            }
    
            if(cookieType==='nextAuth'){
                const session = await getServerSession(authOptions);
                console.log(`session: ${session?.user}`)
               
                if (session && session.user && session.user.email) {
                    extractedUserEmail = session.user.email;
                    extractedUserName = session.user.name;
                    extractedUserRole = "standard";
                    }
            }

    const userData = {email: extractedUserEmail, name: extractedUserName, role: extractedUserRole}
    return NextResponse.json({userData: userData, status: 200})
}

export default cookieFunction