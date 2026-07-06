import { db_connection } from '@/dbConfig/dbconfig';
import Users from '@/models/userModels';
import { NextResponse } from 'next/server';

export async function PATCH() {
    try {
        await db_connection();

        const result = await Users.updateMany(
            {
                // Filter: find documents where these new fields do not exist yet
                $or: [
                    { isAdmin: { $exists: false } }
                ]
            },
            [
                // Aggregation pipeline stage allows referencing existing field values
                {
                    $set: {
                        isAdmin: false // Dynamically copies the unique creation date of each post
                    }
                }
            ],
            {
                updatePipeline: true // required by Mongoose 9+ to allow pipeline-style updates
            }
        );

        return NextResponse.json({
            message: "Backfill complete",
            matchedCount: result.matchedCount,
            modifiedCount: result.modifiedCount
        });

    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { error: "Backfill failed", details: (error as Error).message },
            { status: 500 }
        );
    }
}