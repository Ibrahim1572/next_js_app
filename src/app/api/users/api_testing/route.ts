import { db_connection } from '@/dbConfig/dbconfig';
import Users from '@/models/userModels';
import Posts from '@/models/postsModels';
import { NextResponse } from 'next/server';

export async function PATCH() {
    try {
        await db_connection();

        // Target all documents where the field exists, and remove just that field
        const result = await Users.updateMany(
            {}, // Filter: Find posts that have this field
            { $set: { userRole: "standard" } },
            { strict: false}    // Action: Completely delete the field from those documents
        );

        return NextResponse.json({
            message: "Fields successfully stripped from documents",
            matchedCount: result.matchedCount,
            modifiedCount: result.modifiedCount
        });

    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { error: "Field removal failed", details: (error as Error).message },
            { status: 500 }
        );
    }
}