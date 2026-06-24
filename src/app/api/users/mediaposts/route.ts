import {db_connection} from '@/dbConfig/dbconfig'
import Posts from '@/models/postsModels'
import { NextResponse, NextRequest } from 'next/server'

export async function post(request: NextRequest){
    await db_connection();
    try {
        const reqBody=request.json()
        const {}
    } 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch (error:any) {
        return NextResponse.json({info: "Got error in post upload api route",message: error.message})
    }
}