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
import cookieFunction from '@/utils/cookieWrapper';

interface RouteParams {
  params: Promise<{ title: string }>
}

// get one post
export const GET=asyncHandler(async(request: NextRequest, context: RouteParams)=>{
    await db_connection();
    
        const {title}=await context.params
        const getTitle= decodeURIComponent(title)
        const decodedTitle = await validateRequest({title: getTitle}, getOnePost);
        
        const searchParams = request.nextUrl.searchParams;        
        const isDeleted = searchParams.get('deleted')
        let state=false
        isDeleted==='true'?state=true:state=false
        let dbPost

        if(state){
            dbPost= await Posts.findOne({postTitle: decodedTitle.title, isdeleted:true})||""
        }
        else{
            dbPost= await Posts.findOne({postTitle: decodedTitle.title, isdeleted:false})||""
        }

        if(!dbPost){
            return NextResponse.json({status: 404, toastMessage:'Post Not Found'})
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
            // get title
            const {title}=await context.params
            const getTitle= decodeURIComponent(title)
            const decodedTitle = await validateRequest({title: getTitle}, getOnePost);

            const dbPost= await Posts.findOne({postTitle: decodedTitle.title})||""

            if(!dbPost){
                // toastResponse('Post Not Found')
                // throw new ApiError(404, `Post with "${title}" title Not Found`)
                return NextResponse.json({toastMessage: `Post with "${title}" title Not Found`, status: 404})
            }

            const dbId=await dbPost.postedBy

            const resp = await cookieFunction()
            const userData = await resp.json()

            //check db post and logged in user is same
            if(userData.userData.email!==dbId){
                // toastResponse("INVALID ACTION: You can not delete soemone else's post")
                // throw new ApiError(401, "You can not delete soemone else's post")
                return NextResponse.json({toastMessage: "You can not delete someone else's post", status: 401})
            }
            const dateNow=new Date()
            const deletedPost= await Posts.findOneAndUpdate({postTitle: decodedTitle.title, isdeleted:false}, {$set:{isdeleted:true, deletedDate:dateNow}})
            return NextResponse.json({post: deletedPost, success: true, message: 'Post deleted permanently', status:200, toastMessage: 'Post Deleted Successfully'})
            
        } 

        // restore post
        else if(state===true){
            
            // get title
            const {title}=await context.params
            // console.log("//////////////////////////////////////////////////")
            const getTitle= decodeURIComponent(title)
            // console.log("//////////////////////////////////////////////////")
            const decodedTitle = await validateRequest({title: getTitle}, getOnePost);
            // console.log("//////////////////////////////////////////////////")

            const dbPost= await Posts.findOne({postTitle: decodedTitle.title})||""
            // console.log("----------------------------------------------------------")
            // console.log(dbPost)
            // console.log(typeof(dbPost))
            if(!dbPost){
                // toastResponse('Post Not Found')
                // throw new ApiError(404, `Post with "${title}" title Not Found`)
                return NextResponse.json({toastMessage: `Post with "${title}" title Not Found`, status: 404})
            }

            const dateNow=new Date()
            const restoredPost= await Posts.findOneAndUpdate({postTitle: decodedTitle.title, isdeleted:true}, {$set:{isdeleted:false, restoreDate:dateNow}})
            return NextResponse.json({post: restoredPost, success: true, message: 'Post Restored', status:200, toastMessage: 'Post Restored'})
        }
        
})

//update post api
export const PATCH = asyncHandler(async(request :NextRequest, context: RouteParams)=>{
    await db_connection();
        //get user details
        const resp = await cookieFunction()
        const userData = await resp.json()

        // get title
        const {title}=await context.params
        const getTitle= decodeURIComponent(title)
        const decodedTitle = await validateRequest({title: getTitle}, getOnePost);
        // const decodedTitle=validateRequest({title: decodeURIComponent(title)}, getOnePost);

        const dbPost= await Posts.findOne({postTitle: decodedTitle.title})||""

        if(!dbPost){
            // toastResponse('Post Not Found')
            // throw new ApiError(404, `Post with "${title}" title Not Found can not Update Post`)
            return NextResponse.json({toastMessage: `Post with "${title}" title Not Found can not Update Post`, status: 404})

        }

        const dbId=dbPost.postedBy


        //check db post and logged in user is same
        if(userData.userData.email!==dbId){
            // toastResponse("INVALID ACTION: You can not delete soemone else's post")
            return NextResponse.json({toastMessage: "INVALID ACTION: You can not Update someone else's post", status: 401})
            // throw new ApiError(401, "You can not delete soemone else's post")
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
            // toastResposnse('Enter either a title or a body')

            // throw new ApiError(422, "No field to change")
            return NextResponse.json({toastMessage: "No field to change", status: 422})
        }
        //for when only body needs changing
        if(newPostTitle===""&&newPostBody !==""){
            updatedPost= await Posts.findOneAndUpdate({postTitle: decodedTitle.title}, {$set:{postBody: newPostBody}, $push: { updateLog: currentTimestamp}});
        }
        // for only when the title needs changing
        if(newPostTitle!==""&&newPostBody ===""){
            updatedPost= await Posts.findOneAndUpdate({postTitle: decodedTitle.title} ,{$set:{postTitle: newPostTitle}, $push: { updateLog: currentTimestamp}});
        }
        // for when both need changing
        if(newPostTitle!==""&&newPostBody !==""){
            updatedPost= await Posts.findOneAndUpdate({postTitle: decodedTitle.title},{$set:{postTitle: newPostTitle, postBody: newPostBody}, $push: { updateLog: currentTimestamp}});
        }

        
        return NextResponse.json({"Updated Post": updatedPost, "Old Post": oldPost, success: true, message: 'Post Updated', status:200, toastMessage: 'Post Updated Successfully'})
        
})