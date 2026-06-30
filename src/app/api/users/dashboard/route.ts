import {db_connection} from '@/dbConfig/dbconfig';
import Posts from '@/models/postsModels';
import User from '@/models/userModels';
import { NextResponse, NextRequest } from 'next/server';
import {jwtDecode} from 'jwt-decode'
import {cookies} from 'next/headers'
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";

export async function GET(){
    await db_connection();
    try {
        // const allPosts=await Posts.find({}).sort({updatedAt: -1})
        const anchor=new Date()
        console.log(anchor)
        anchor.setDate( anchor.getDate()-30)


        console.log(anchor)

        return NextResponse.json({})
        
    } 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch (error:any) {
        return NextResponse.json({info: "Got error in view all api route", message: error.message, status:500, success:false})
    }
}