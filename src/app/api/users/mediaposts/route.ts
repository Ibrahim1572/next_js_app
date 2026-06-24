import {db_connection} from '@/dbConfig/dbconfig';
import Posts from '@/models/postsModels';
import User from '@/models/userModels';
import { NextResponse, NextRequest } from 'next/server';
import {jwtDecode} from 'jwt-decode'
import {cookies} from 'next/headers'

export async function POST(request: NextRequest){
    await db_connection();
    try {
        const reqBody=await request.json()
        const {title, body}= reqBody;

        const cookieStore=cookies();
        const tokenCookie=(await cookieStore).get('token')
        
        if (!tokenCookie) {
            return NextResponse.json({ message: "Token cookie not found" }, { status: 401 });                }
        
        const tokenValue = tokenCookie.value;
        
        const decodedToken= jwtDecode(tokenValue);
        const extractedUserId = decodedToken.id;

        console.log(extractedUserId)
        console.log(typeof extractedUserId)
        const id= await User.findById(extractedUserId)
        if(!id){
            return NextResponse.json({message: "only existing users can post", status: 401})
        }

        const newPost=new Posts({"postTitle":title, "postBody": body, "postedBy": extractedUserId})
        const savedPost=await newPost.save()
        
        return NextResponse.json({post: savedPost, success:true, message:"Post added", status:201})

    } 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch (error:any) {
        return NextResponse.json({info: "Got error in post upload api route",message: error.message, status:500, success:false})
    }
}

