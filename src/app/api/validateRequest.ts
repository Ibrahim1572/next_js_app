import { NextRequest, NextResponse } from "next/server"
import { z } from 'zod'

export default async function validateRequest<T>(data: unknown, schema: z.ZodSchema<T>) {
    try {
        
        const result=schema.safeParse(data)

        if(!result.success){
            return NextResponse.json({
            message: 'Invalid data',
            success: false
            }, {status:400})
        }
        return result.data
        
    } 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch (error:any) {
        return NextResponse.json({
            message: 'error in the validate request wrapper',
            error: error.message,
            status: 400,
            success: false
        })
    }
}

