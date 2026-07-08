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
interface RouteParams {
  params: Promise<{ title: string }>
}


export async function GET(request: NextRequest, context: RouteParams){
    await db_connection();
    
    try {
        // const reqBody=await request.json()
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
            return NextResponse.json({message: `Post with "${title}" title Not Found`, status: 404, toastMessage: 'Post Not Found'})
        }

        return NextResponse.json({post: dbPost, success: true, message: 'Post retrived', status:200, toastMessage:'Post Found'})
    } 
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch (error:any) {
        return NextResponse.json({info: "Got error in view one post api route",message: error.message, status:500, success:false})
    }
}

//delete and restore post api 
export async function POST(request :NextRequest, context: RouteParams){
    await db_connection();
    const searchParams = request.nextUrl.searchParams;        
    const isDeleted = searchParams.get('deleted')
    let state=false
    isDeleted==='true'?state=true:state=false
    try {
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
                return NextResponse.json({ message: "Token cookie not found, user is not logged in", status: 401, toastMessage:'No user logged In: UNAUTHORIZED ACCESS' });                
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
                return NextResponse.json({message: `Post with "${title}" title Not Found`, status: 404, toastMessage: 'Post Not Found'})
            }

            const dbId=await dbPost.postedBy

            //check db post and logged in user is same
            if(extractedUserEmail!==dbId){
                return NextResponse.json({success: false, message: "You can not delete soemone else's post", status: 401, toastMessage:"INVALID ACTION: You can not delete soemone else's post"})
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
                return NextResponse.json({ message: "Token cookie not found, user is not logged in", status: 401, toastMessage:'No user logged In: UNAUTHORIZED ACCESS' });                
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
                return NextResponse.json({message: `Post with "${title}" title Not Found`, status: 404, toastMessage: 'Post Not Found'})
            }

            const dbId=await dbPost.postedBy

            //check db post and logged in user is same
            if(extractedUserEmail!==dbId){
                return NextResponse.json({success: false, message: "You can not delete soemone else's post", status: 401, toastMessage:"INVALID ACTION: You can not delete soemone else's post"})
            }
            const dateNow=new Date()
            const deletedPost= await Posts.findOneAndUpdate({postTitle: decodedTitle, isdeleted:true}, {$set:{isdeleted:false, restoreDate:dateNow}})
            return NextResponse.json({post: deletedPost, success: true, message: 'Post deleted permanently', status:200, toastMessage: 'Post Deleted Successfully'})
        }
        
    } 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch (error:any) {
        return NextResponse.json({message: "Got error in delete post api route",error: error.message, status:500, success:false})
    }
}

//update post api
export async function PATCH(request :NextRequest, context: RouteParams){
    await db_connection();
    try {
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
            return NextResponse.json({ message: "Token cookie not found, like user is not logged in", toastMessage:'No user logged in: UNAUTORIZED ACCESS' }, { status: 401 });                
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
            return NextResponse.json({message: `Post with "${title}" title Not Found can not update post`, status: 404, toastMessage: 'Post not found'})
        }

        const dbId=dbPost.postedBy

        //check db post and logged in user is same
        if(extractedUserEmail!==dbId){
            return NextResponse.json({success: false, message: "You can not update soemone else's post", status: 401, toastMessage: "INVALID ACTION: You can not update someone else's post"})
        }

        //get details from next request
        const result = await validateRequest(request.json(), updatePost) as z.infer<typeof updatePost>
        // const reqBody=await request.json()
        // const result= updatePost.safeParse(reqBody)
        
        //         if(!result.success){
        //             return NextResponse.json(
        //                 {
        //                     success: false, 
        //                     message: 'Invalid Post Data', 
        //                     error: result.error.flatten().fieldErrors, 
        //                     status: 400
        //                 })
        //         }

        const newPostTitle = result.title
        const newPostBody = result.body
        // const {newPostTitle: incomingTitle, newPostBody: incomingBody}=result;
        
        // const newPostTitle = typeof incomingTitle === 'string' ? incomingTitle.trim() : "";
        // const newPostBody = typeof incomingBody === 'string' ? incomingBody.trim() : "";

        // const oldPost=dbPost
        const oldPost=dbPost
        let updatedPost
        const currentTimestamp = new Date();

        //check if both fields are empty
        
        if(newPostTitle===""&&newPostBody ===""){
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
        
    } 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch (error:any) {
        return NextResponse.json({message: "Got error in update post api route", error: error.message, status:500, success:false})
    }
}