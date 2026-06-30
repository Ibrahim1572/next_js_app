import { error } from "console";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { NextRequest} from "next/server";
import {db_connection} from '@/dbConfig/dbconfig'
import { jwtDecode } from "jwt-decode";
import User from '@/models/userModels'


export async function POST(request: NextRequest){
    await db_connection();
    try {console.log("------------------------------------------------------------------------")

        const cookieStore=cookies();
        let tokenCookie=(await cookieStore).get('token')
        
        if(!tokenCookie){
            tokenCookie=(await cookieStore).get('__Secure-next-auth.session-token')
        }
        if(!tokenCookie){
            tokenCookie=(await cookieStore).get('next-auth.session-token')
        }

        if (!tokenCookie) {
            return NextResponse.json({ message: "Token cookie not found" }, { status: 401 });
        }

        const tokenValue = tokenCookie.value;

        const decodedToken= jwtDecode(tokenValue);
        // console.log(decodedToken)
        const extractedUserId = decodedToken.id;

        if (!extractedUserId) {
            return NextResponse.json({ message: "Invalid token payload structures" }, { status: 400 });
        }

        const dbUser= await User.findOne({ _id: extractedUserId });
        
        const response =NextResponse.json({dbUser: dbUser})
        return response        
    } 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch (error:any) {
        const response= NextResponse.json({message: error.message})
        return response;
    }

}