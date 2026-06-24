import {db_connection} from '@/dbConfig/dbconfig';
import Posts from '@/models/postsModels';
import { NextResponse, NextRequest } from 'next/server';
interface RouteParams {
  params: Promise<{ title: string }>
}


export async function GET(request: NextRequest, context: RouteParams){
    await db_connection();
    try {
        // const reqBody=await request.json()
        const {title}=await context.params
        const decodedTitle=decodeURIComponent(title);

        const dbPost= await Posts.findOne({postTitle: decodedTitle})||""

        if(!dbPost){
            return NextResponse.json({message: `Post with "${title}" title Not Found`, status: 404})
        }

        return NextResponse.json({post: dbPost, success: true, message: 'Post retrived'})
    } 
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch (error:any) {
        return NextResponse.json({info: "Got error in view one post api route",message: error.message, status:500, success:false})
    }
}