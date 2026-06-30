import {db_connection} from '@/dbConfig/dbconfig';
import Posts from '@/models/postsModels';
import User from '@/models/userModels';
import { NextResponse, NextRequest } from 'next/server';
import {jwtDecode} from 'jwt-decode'
import {cookies} from 'next/headers'
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

export async function DELETE(request :NextRequest, context: RouteParams){
    await db_connection();
    try {
        //get user details
        const cookieStore=cookies();
        let tokenCookie=(await cookieStore).get('token');
        
        if(!tokenCookie){
            tokenCookie=(await cookieStore).get('__Secure-next-auth.session-token')
        }
        if(!tokenCookie){
            tokenCookie=(await cookieStore).get('next-auth.session-token')
        }
                
        if (!tokenCookie) {
            return NextResponse.json({ message: "Token cookie not found, like user is not logged in" }, { status: 401 });                
        }
        const tokenValue = tokenCookie.value;
                
        const decodedToken= jwtDecode(tokenValue);
        const extractedUserId = decodedToken.id;
        console.log(`extracted user: ${extractedUserId}`)
        const id= await User.findById(extractedUserId)

        if(!id){
            return NextResponse.json({message: "only existing users can post, login or sign up first", status: 401})
        }

        // get title
        const {title}=await context.params
        const decodedTitle=decodeURIComponent(title);

        const dbPost= await Posts.findOne({postTitle: decodedTitle})||""

        if(!dbPost){
            return NextResponse.json({message: `Post with "${title}" title Not Found`, status: 404})
        }

        const dbId=await dbPost.postedBy

        //check db post and logged in user is same
        if(extractedUserId!==dbId){
            return NextResponse.json({success: false, message: "You can not delete soemone else's post", status: 401})
        }

        const deletedPost= await Posts.findOneAndDelete({postTitle: decodedTitle})
        return NextResponse.json({post: deletedPost, success: true, message: 'Post deleted permanently'})
        
    } 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch (error:any) {
        return NextResponse.json({info: "Got error in delete post api route",message: error.message, status:500, success:false})
    }
}

export async function POST(request :NextRequest, context: RouteParams){
    await db_connection();
    try {
        //get user details
        const cookieStore=cookies();
        let tokenCookie=(await cookieStore).get('token')

        if(!tokenCookie){
            tokenCookie=(await cookieStore).get('__Secure-next-auth.session-token')
        }
        if(!tokenCookie){
            tokenCookie=(await cookieStore).get('next-auth.session-token')
        }
                
        if (!tokenCookie) {
            return NextResponse.json({ message: "Token cookie not found, like user is not logged in" }, { status: 401 });                
        }
        const tokenValue = tokenCookie.value;
                
        const decodedToken= jwtDecode(tokenValue);
        const extractedUserId = decodedToken.id;
        console.log(`extracted user: ${extractedUserId}`)
        const id= await User.findById(extractedUserId)

        if(!id){
            return NextResponse.json({message: "only existing users can update post, login or sign up first", status: 401})
        }

        // get title
        const {title}=await context.params
        const decodedTitle=decodeURIComponent(title);

        const dbPost= await Posts.findOne({postTitle: decodedTitle})||""

        if(!dbPost){
            return NextResponse.json({message: `Post with "${title}" title Not Found can not update post`, status: 404})
        }

        const dbId=dbPost.postedBy.toString()

        //check db post and logged in user is same
        if(extractedUserId!==dbId){
            return NextResponse.json({success: false, message: "You can not update soemone else's post", status: 401})
        }

        //get details from next request
        const reqBody=await request.json()
        const {newPostTitle, newPostBody}=reqBody;

        // const oldPost=dbPost
        const oldPost=dbPost
        let updatedPost=""

        if(newPostTitle&&newPostBody ===""){
            return NextResponse.json({success: false, message: "No field to change"})
        }
        if(!newPostTitle){
            updatedPost= await Posts.findOneAndUpdate({postTitle: decodedTitle},{postBody: newPostBody}, {new:true})||""
            // updatedPost= await Posts.findOne({postTitle: decodedTitle})||""
        }
        if(!newPostBody){
            updatedPost= await Posts.findOneAndUpdate({postTitle: decodedTitle},{postTitle: newPostTitle}, {new:true})||""
            // updatedPost= await Posts.findOne({postTitle: newPostTitle})||""
        }
        if(newPostTitle&&newPostBody){
            updatedPost= await Posts.findOneAndUpdate({postTitle: decodedTitle},{postTitle: newPostTitle, postBody: newPostBody}, {new:true})||""
            // updatedPost= await Posts.findOne({postTitle: newPostTitle})||""
        }

        
        return NextResponse.json({"Updated Post": updatedPost, "Old Post": oldPost, success: true, message: 'Post Updated'})
        
    } 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch (error:any) {
        return NextResponse.json({info: "Got error in delete post api route",message: error.message, status:500, success:false})
    }
}