import { NextResponse } from "next/server";
import { NextRequest} from "next/server";
import {db_connection} from '@/dbConfig/dbconfig'

import asyncHandler from '@/utils/asyncHandler' 
import cookieFunction from '@/utils/cookieWrapper'

export const POST = asyncHandler(async(request: NextRequest) => {
    await db_connection();
    const resp= await cookieFunction()
    const userData = await resp.json()
    // console.log(await userData.json())
    // console.log(typeof(userData))


    const response =NextResponse.json({'User Data': userData, status:200, toastMessage:'Data Retrieved Successfully'})
    return response        
})