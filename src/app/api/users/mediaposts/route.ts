import {db_connection} from '@/dbConfig/dbconfig';
import Posts from '@/models/postsModels';
import { NextResponse, NextRequest } from 'next/server';
import {jwtDecode} from 'jwt-decode'
import {cookies} from 'next/headers'
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { addPost } from '@/schemas/mediaPostsSchema'
import validateRequest from '../../validateRequest';
import {z} from 'zod'
import asyncHandler from '@/utils/asyncHandler' 

//add post
export const POST= asyncHandler(async(request: NextRequest)=>{
    await db_connection();
    
        // console.log('++++++++++++++++++++++++++++++++++++++++++++++++++++++++')
        // console.log(request)
        // console.log(await request.json())
        const req = await request.json()
        const result= await validateRequest(req, addPost) as z.infer<typeof addPost>
        
        const title= result.title
        const body= result.body

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
            // toastResponse('Unauthorized user')
            // throw new ApiError(401, "Token cookie not found")
            return NextResponse.json({toastMessage: 'Token cookie not found', status:401})
        }
                    
        
        if(cookieType==='jwt'){
            const tokenValue = tokenCookie.value;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const decodedToken= jwtDecode(tokenValue) as any;
            extractedUserEmail = decodedToken.email;
        }

        if(cookieType==='nextAuth'){
            const session = await getServerSession(authOptions);
            // console.log(`session: ${session}`)
           
            if (session && session.user && session.user.email) {
                extractedUserEmail = session.user.email;
                }
        }
    
        const dateNow= new Date()
        const newPost=new Posts({"postTitle":title, "postBody": body, "postedBy": extractedUserEmail, 'deletedDate':dateNow})
        const savedPost=await newPost.save()
        
        return NextResponse.json({post: savedPost, success:true, message:"Post added", status:200, toastMessage:'Post added Successfully'})

    })

//get all posts
export const GET= asyncHandler(async(request: NextRequest)=>{
    await db_connection();
    const searchParams = request.nextUrl.searchParams;        
    const isDeleted = searchParams.get('deleted')
    let state=false
    isDeleted==='true'?state=true:state=false

        if(!state){
            const allPosts=await Posts.find({isdeleted:false}).sort({updatedAt: -1}).limit(20)
            if(allPosts.length === 0){
                // toastResponse('No Posts to Load')
                // throw new ApiError(200, 'No posts, (DB is empty)')
                return NextResponse.json({toastMessage: 'No posts, DB is Empty', status: 200})
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
})