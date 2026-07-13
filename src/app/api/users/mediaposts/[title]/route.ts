import {db_connection} from '@/dbConfig/dbconfig';
import Posts from '@/models/postsModels';
import { NextResponse, NextRequest } from 'next/server';
import {jwtDecode} from 'jwt-decode'
import {cookies} from 'next/headers'
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { updatePost } from '@/schemas/mediaPostsSchema'
import { getOnePost } from '@/schemas/mediaPostsSchema'
import validateRequest from '@/app/api/validateRequest';
import {z} from 'zod'
import asyncHandler from '@/utils/asyncHandler' 
import ApiError from '@/utils/ApiError'  
import toastResponse from '@/utils/toastErrorWrapper'

interface RouteParams {
  params: Promise<{ title: string }>
}


export const GET=asyncHandler(async(request: NextRequest, context: RouteParams)=>{
    await db_connection();
    
        const {title}=await context.params
        const getTitle= decodeURIComponent(title)
        const decodedTitle = validateRequest(getTitle, getOnePost);
        const searchParams = request.nextUrl.searchParams;        
        const isDeleted = searchParams.get('deleted')
        let state=false
        isDeleted==='true'?state=true:state=false
        let dbPost

        if(state){
            dbPost= await Posts.findOne({postTitle: decodedTitle, isdeleted:true})||""
        }
        else{
            dbPost= await Posts.findOne({postTitle: decodedTitle, isdeleted:false})||""
        }

        if(!dbPost){
            toastResponse('Post Not Found')
            throw new ApiError(404, `Post with "${title}" title Not Found`)
        }

        return NextResponse.json({post: dbPost, success: true, message: 'Post retrived', status:200, toastMessage:'Post Found'})
})

//delete and restore post api 
export const POST = asyncHandler(async(request :NextRequest, context: RouteParams)=>{
    await db_connection();
    const searchParams = request.nextUrl.searchParams;        
    const isDeleted = searchParams.get('deleted')
    let state=false
    isDeleted==='true'?state=true:state=false

        if (state===false) {
            const cookieStore=cookies();
            let extractedUserEmail=""
            let cookieType='jwt'
            let tokenCookie=(await cookieStore).get('token');
            
            if(!tokenCookie){
                tokenCookie=(await cookieStore).get('__Secure-next-auth.session-token')
                cookieType='nextAuth'
            }
            if(!tokenCookie){
                tokenCookie=(await cookieStore).get('next-auth.session-token')
                cookieType='nextAuth'
            }
                    
            if (!tokenCookie) {
                toastResponse('No user logged In: UNAUTHORIZED ACCESS')
                throw new ApiError(401, "Token cookie not found, user is not logged in")
            }

            if(cookieType==='jwt'){
                        const tokenValue = tokenCookie.value;
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const decodedToken= jwtDecode(tokenValue) as any;
                        extractedUserEmail = decodedToken.email;
                    }
            
                    if(cookieType==='nextAuth'){
                        const session = await getServerSession(authOptions);
            
                        if (session && session.user && session.user.email) {
                            extractedUserEmail = session.user.email;
                            }
                    }


            // get title
            const {title}=await context.params
            const decodedTitle=decodeURIComponent(title);

            const dbPost= await Posts.findOne({postTitle: decodedTitle})||""

            if(!dbPost){
                toastResponse('Post Not Found')
                throw new ApiError(404, `Post with "${title}" title Not Found`)
            }

            const dbId=await dbPost.postedBy

            //check db post and logged in user is same
            if(extractedUserEmail!==dbId){
                toastResponse("INVALID ACTION: You can not delete soemone else's post")
                throw new ApiError(401, "You can not delete soemone else's post")
            }
            const dateNow=new Date()
            const restoredPost= await Posts.findOneAndUpdate({postTitle: decodedTitle, isdeleted:false}, {$set:{isdeleted:true, deletedDate:dateNow}})
            return NextResponse.json({post: restoredPost, success: true, message: 'Post deleted permanently', status:200, toastMessage: 'Post Restored Successfully'})
            
        } 
        else if(state===true){
            const cookieStore=cookies();
            let extractedUserEmail=""
            let cookieType='jwt'
            let tokenCookie=(await cookieStore).get('token');
            
            if(!tokenCookie){
                tokenCookie=(await cookieStore).get('__Secure-next-auth.session-token')
                cookieType='nextAuth'
            }
            if(!tokenCookie){
                tokenCookie=(await cookieStore).get('next-auth.session-token')
                cookieType='nextAuth'
            }
                    
            if (!tokenCookie) {
                toastResponse('No user logged In: UNAUTHORIZED ACCESS')
                throw new ApiError(401, "Token cookie not found, user is not logged in")
            }

            if(cookieType==='jwt'){
                        const tokenValue = tokenCookie.value;
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const decodedToken= jwtDecode(tokenValue) as any;
                        extractedUserEmail = decodedToken.email;
                    }
            
                    if(cookieType==='nextAuth'){
                        const session = await getServerSession(authOptions);
            
                        if (session && session.user && session.user.email) {
                            extractedUserEmail = session.user.email;
                            }
                    }


            // get title
            const {title}=await context.params
            const decodedTitle=decodeURIComponent(title);

            const dbPost= await Posts.findOne({postTitle: decodedTitle})||""

            if(!dbPost){
                toastResponse('Post Not Found')
                throw new ApiError(404, `Post with "${title}" title Not Found`)
            }

            const dbId=await dbPost.postedBy

            //check db post and logged in user is same
            if(extractedUserEmail!==dbId){
                toastResponse("INVALID ACTION: You can not delete soemone else's post")
                throw new ApiError(401, "You can not delete soemone else's post")
            }
            const dateNow=new Date()
            const deletedPost= await Posts.findOneAndUpdate({postTitle: decodedTitle, isdeleted:true}, {$set:{isdeleted:false, restoreDate:dateNow}})
            return NextResponse.json({post: deletedPost, success: true, message: 'Post deleted permanently', status:200, toastMessage: 'Post Deleted Successfully'})
        }
        
})

//update post api
export const PATCH = asyncHandler(async(request :NextRequest, context: RouteParams)=>{
    await db_connection();

        //get user details
        const cookieStore=cookies();
        let extractedUserEmail=''
        let tokenCookie=(await cookieStore).get('token')
        let cookieType='jwt'

        if(!tokenCookie){
            tokenCookie=(await cookieStore).get('__Secure-next-auth.session-token')
            cookieType='nextAuth'
        }
        if(!tokenCookie){
            tokenCookie=(await cookieStore).get('next-auth.session-token')
            cookieType='nextAuth'
        }
                
        if (!tokenCookie) {
            toastResponse('No user logged In: UNAUTHORIZED ACCESS')
            throw new ApiError(401, "Token cookie not found, user is not logged in")
        }

        if(cookieType==='jwt'){
                    const tokenValue = tokenCookie.value;
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const decodedToken= jwtDecode(tokenValue)as any;
                    extractedUserEmail = decodedToken.email;
                }
        
                if(cookieType==='nextAuth'){
                    const session = await getServerSession(authOptions);
                    
                    if (session && session.user && session.user.email) {
                        extractedUserEmail = session.user.email;
                        }
                }

        // get title
        const {title}=await context.params
        const decodedTitle=validateRequest(decodeURIComponent(title), getOnePost);

        const dbPost= await Posts.findOne({postTitle: decodedTitle})||""

        if(!dbPost){
            toastResponse('Post Not Found')
            throw new ApiError(404, `Post with "${title}" title Not Found can not Update Post`)
        }

        const dbId=dbPost.postedBy

        //check db post and logged in user is same
        if(extractedUserEmail!==dbId){
            toastResponse("INVALID ACTION: You can not delete soemone else's post")
            throw new ApiError(401, "You can not delete soemone else's post")
        }

        //get details from next request
        const result = await validateRequest(request.json(), updatePost) as z.infer<typeof updatePost>

        const newPostTitle = result.title
        const newPostBody = result.body

        const oldPost=dbPost
        let updatedPost
        const currentTimestamp = new Date();

        //check if both fields are empty
        
        if(newPostTitle===""&&newPostBody ===""){
            toastResponse('Enter either a title or a body')
            throw new ApiError(422, "No field to change")
            return NextResponse.json({success: false, message: "No field to change", status:422, toastMessage:'Enter either a title or a body'});
        }
        //for when only body needs changing
        if(newPostTitle===""&&newPostBody !==""){
            updatedPost= await Posts.findOneAndUpdate({postTitle: decodedTitle}, {$set:{postBody: newPostBody}, $push: { updateLog: currentTimestamp}});
        }
        // for only when the title needs changing
        if(newPostTitle!==""&&newPostBody ===""){
            updatedPost= await Posts.findOneAndUpdate({postTitle: decodedTitle} ,{$set:{postTitle: newPostTitle}, $push: { updateLog: currentTimestamp}});
        }
        // for when both need changing
        if(newPostTitle!==""&&newPostBody !==""){
            updatedPost= await Posts.findOneAndUpdate({postTitle: decodedTitle},{$set:{postTitle: newPostTitle, postBody: newPostBody}, $push: { updateLog: currentTimestamp}});
        }

        
        return NextResponse.json({"Updated Post": updatedPost, "Old Post": oldPost, success: true, message: 'Post Updated', status:200, toastMessage: 'Post Updated Successfully'})
        
})