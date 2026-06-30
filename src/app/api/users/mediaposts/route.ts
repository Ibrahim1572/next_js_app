import {db_connection} from '@/dbConfig/dbconfig';
import Posts from '@/models/postsModels';
import User from '@/models/userModels';
import { NextResponse, NextRequest } from 'next/server';
import {jwtDecode} from 'jwt-decode'
import {cookies} from 'next/headers'
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";

export async function POST(request: NextRequest){
    await db_connection();
    try {
        const reqBody=await request.json()
        const {title, body}= reqBody;

        const cookieStore=cookies();
        let tokenCookie=(await cookieStore).get('token')
        let cookieType="jwt"
        let extractedUserEmail=""

        if(!tokenCookie){
            tokenCookie=(await cookieStore).get('__Secure-next-auth.session-token')
            cookieType="nextAuth"
        }
        if(!tokenCookie){
            tokenCookie=(await cookieStore).get('next-auth.session-token')
            cookieType="nextAuth"
        }
        
        if (!tokenCookie) {
            cookieType=""
            return NextResponse.json({ message: "Token cookie not found" }, { status: 401 });   
        }
                    
        
        if(cookieType==='jwt'){
            const tokenValue = tokenCookie.value;
            const decodedToken= jwtDecode(tokenValue);
            extractedUserEmail = decodedToken.email;
        }

        if(cookieType==='nextAuth'){
            const session = await getServerSession(authOptions);
            console.log(`session: ${session}`)
            // console.log(`session value: ${session.value}`)
            console.log(`session user: ${session.user}`)
            console.log(`Stringified Session: ${JSON.stringify(session, null, 2)}`);
            console.log(`session user email: ${session.user.email}`)
            if (session && session.user && session.user.email) {
                extractedUserEmail = session.user.email;
                }
        }
        // console.log(`decoded Token: ${decodedToken}`)
        // console.log(`extracted user Id: ${extractedUserId}`)

        // console.log(extractedUserId)
        // console.log(typeof extractedUserId)
        // const id= await User.findById(extractedUserId)
        // if(!id){
        //     return NextResponse.json({message: "only existing users can post", status: 401})
        // }

        const newPost=new Posts({"postTitle":title, "postBody": body, "postedBy": extractedUserEmail})
        const savedPost=await newPost.save()
        
        return NextResponse.json({post: savedPost, success:true, message:"Post added", status:201})

    } 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch (error:any) {
        return NextResponse.json({info: "Got error in post upload api route",message: error.message, status:500, success:false})
    }
}

export async function GET(){
    await db_connection();
    try {
        const allPosts=await Posts.find({}).sort({updatedAt: -1}).limit(10)
        if(!allPosts){
            return NextResponse.json({info: "No posts, (DB is empty)", success:true})
        }
        return NextResponse.json({info: "Posts retrieved", success:true, posts: allPosts})
    } 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch (error:any) {
        return NextResponse.json({info: "Got error in view all api route", message: error.message, status:500, success:false})
    }
}