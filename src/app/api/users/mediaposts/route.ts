import {db_connection} from '@/dbConfig/dbconfig';
import Posts from '@/models/postsModels';
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
            return NextResponse.json({ message: "Token cookie not found", status: 401, toastMessage: 'Unauthorized user' });   
        }
                    
        
        if(cookieType==='jwt'){
            const tokenValue = tokenCookie.value;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const decodedToken= jwtDecode(tokenValue) as any;
            extractedUserEmail = decodedToken.email;
        }

        if(cookieType==='nextAuth'){
            const session = await getServerSession(authOptions);
            console.log(`session: ${session}`)
            // console.log(`session value: ${session.value}`)
            // console.log(`session user: ${session.user}`)
            // console.log(`Stringified Session: ${JSON.stringify(session, null, 2)}`);
            // console.log(`session user email: ${session.user.email}`)
            if (session && session.user && session.user.email) {
                extractedUserEmail = session.user.email;
                }
        }
    
        const dateNow= new Date()
        const newPost=new Posts({"postTitle":title, "postBody": body, "postedBy": extractedUserEmail, 'deletedDate':dateNow})
        const savedPost=await newPost.save()
        
        return NextResponse.json({post: savedPost, success:true, message:"Post added", status:200, toastMessage:'Post added Successfully'})

    } 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch (error:any) {
        return NextResponse.json({message: "Got error in post upload api route", error: error.message, status:500, success:false})
    }
}

export async function GET(request: NextRequest){
    await db_connection();
    const searchParams = request.nextUrl.searchParams;        
    const isDeleted = searchParams.get('deleted')
    let state=false
    isDeleted==='true'?state=true:state=false

    try {
        if(!state){
            const allPosts=await Posts.find({isdeleted:false}).sort({updatedAt: -1}).limit(20)
            if(!allPosts){
                return NextResponse.json({info: "No posts, (DB is empty)", success:true, toastMessage:'No Posts to Load'})
            }
            return NextResponse.json({info: "Posts retrieved", success:true, status:200, posts: allPosts, toastMessage:'Posts Retrieved'})
        }
        else if(state){
            const allPosts=await Posts.find({isdeleted:true}).sort({updatedAt: -1}).limit(20)
            if(!allPosts){
                return NextResponse.json({info: "No archivedposts, (DB is empty)", success:true, toastMessage:'No Archived Posts to Load'})
            }
            return NextResponse.json({info: "Posts retrieved", success:true, status:200, posts: allPosts, toastMessage:'Archived Posts Retrieved'})
        }
    } 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch (error:any) {
        return NextResponse.json({message: "Got error in view all api route", error: error.message, status:500, success:false})
    }
}