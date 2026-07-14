import { NextResponse } from 'next/server';
const asyncHandler = (fn) => async (request, context) => {
    const startTime = new Date()
    const method = await request.json()
    console.log('++++++++++++++++++++++++++++++++++++++++++++')
    console.log(startTime)
    console.log(method)
    console.log(typeof(method))
    try {
        // You MUST return the execution of your route handler function
        return await fn(request, context);
    } catch (error) {
        console.error("API Error:", error);
        
        // Return a valid NextResponse instead of using Express's res object
        return NextResponse.json({
            message: error.message || "Internal Server Error",
            success: false,
        }, { 
            status: error.statusCode || error.code || 500 
        });
    }
}

export default asyncHandler;