import {db_connection} from '@/dbConfig/dbconfig';
import Posts from '@/models/postsModels';
import { NextResponse, NextRequest } from 'next/server';
import { addPost } from '@/schemas/mediaPostsSchema'
import validateRequest from '../../validateRequest';
import {z} from 'zod'
import asyncHandler from '@/utils/asyncHandler' 
import axios from 'axios'
import cookieFunction from '@/utils/cookieWrapper'


//add post
export const POST= asyncHandler(async(request: NextRequest)=>{
    await db_connection();
    
        const req = await request.json()
        const result= await validateRequest(req, addPost) as z.infer<typeof addPost>
        
        const title= result.title
        const body= result.body

        const userData = await cookieFunction()
        console.log(`cookie Func response: ${userData}`)
    
        const dateNow= new Date()
        const newPost=new Posts({"postTitle":title, "postBody": body, "postedBy": userData, 'deletedDate':dateNow})
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
            const user = await axios.post("/api/users/profile")
            // const userType = user["User Data"].userType
            if(user.data['User Data'].userType!=='admin'){
                return NextResponse.json({toastMessage: "UNAUTHORIZED ACCESS", status: 401})
            }

            
            const allPosts=await Posts.find({isdeleted:true}).sort({updatedAt: -1}).limit(20)
            if(!allPosts){
                return NextResponse.json({info: "No archivedposts, (DB is empty)", success:true, toastMessage:'No Archived Posts to Load'})
            }
            return NextResponse.json({info: "Posts retrieved", success:true, status:200, posts: allPosts, toastMessage:'Archived Posts Retrieved'})
        }
})