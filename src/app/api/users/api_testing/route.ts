import { db_connection } from '@/dbConfig/dbconfig';
import Posts from '@/models/postsModels';
import { NextResponse } from 'next/server';

export async function PATCH() {
    try {
        await db_connection();

        const result = await Posts.updateMany(
            {
                // Filter: find documents where these new fields do not exist yet
                $or: [
                    { updateCount: { $exists: false } },
                    { restoreDate: { $exists: false } }
                ]
            },
            [
                // Aggregation pipeline stage allows referencing existing field values
                {
                    $set: {
                        updateCount: {
                            $cond: {
                                if: { $eq: ["$createdAt", "$updatedAt"] },
                                then: 0,
                                else: 1
                            }
                        },
                        restoreDate: "$createdAt" // Dynamically copies the unique creation date of each post
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