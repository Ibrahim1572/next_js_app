import { NextResponse } from 'next/server';

const asyncHandler = (fn) => async (request, context) => {
    const startTime = new Date()
    const req = await request
    
    try {
        // You MUST return the execution of your route handler function
        const response = await fn(request, context);
        const endTime = new Date()

        console.log(JSON.stringify({method: req.method, path: req.url, statusCode: response.status, durationMS: endTime-startTime}))
        return response
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