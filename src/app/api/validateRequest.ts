import { NextResponse } from "next/server"
import { z } from 'zod'
import ApiError from "@/utils/ApiError";

// export default async function validateRequest<T>(data: unknown, schema: z.ZodSchema<T>) {
//     try {
        
//         const result=schema.safeParse(await data)

//         if(!result.success){
//             return NextResponse.json({
//             message: 'Invalid data',
//             success: false
//             }, {status:400})
//         }
//         console.log('-----------------------------------------------------')
//         console.log(result.data)
//         return result.data
        
//     } 
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     catch (error:any) {
//         return NextResponse.json({
//             message: 'error in the validate request wrapper',
//             error: error.message,
//             status: 400,
//             success: false
//         })
//     }
// }


export default async function validateRequest<T>(
  data: unknown,
  schema: z.ZodSchema<T>
): Promise<T> {
  const result = schema.safeParse(data);

  if (!result.success) {
    throw new ApiError(400, "Validation failed", result.error.issues);   // ← throw, don't return
  }

  return result.data;   // ← always returns the validated value, never a Response
}