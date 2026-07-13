import { db_connection } from '@/dbConfig/dbconfig';
import Posts from '@/models/postsModels';
import { NextResponse } from 'next/server';

export async function GET(){
    await db_connection();
    try {
        const createdData = [];
        let min = 0;
        let max = 2;

        for(let i = 0; i < 8; i++){
            const maxDate = new Date();
            maxDate.setDate(maxDate.getDate() - (i * 4 + 4));
            const minDate = new Date();
            minDate.setDate(minDate.getDate() - (i * 4));



            const posts = await Posts.find({
                createdAt: {
                    $gte: maxDate,
                    $lte: minDate
                }
            });

            createdData[i] = posts.length;

            min += 4;
            max += 4;
            maxDate.setDate(maxDate.getDate() - max);
            minDate.setDate(minDate.getDate() - min);
        }

        const deletedData = [];
        // FIXED: Resetting local bucket bounds specifically for the delete loop
        let minDel = 0;
        let maxDel = 2;
        const maxDateDelete = new Date();
        const minDateDelete = new Date();
        maxDateDelete.setDate(maxDateDelete.getDate() - maxDel);
        minDateDelete.setDate(minDateDelete.getDate() - minDel);

        for(let i = 0; i < 8; i++){
            const posts = await Posts.find({
                // FIXED: Referencing the correct query variable parameters
                deletedDate: {
                    $gte: maxDateDelete,
                    $lte: minDateDelete
                },
                $expr: { 
                    $and: [
                        { $ne: ["$deletedDate", "$createdAt"] },
                        { $ne: ["$deletedDate", "$updatedAt"] }
                    ]
                }
            });

            deletedData[i] = posts.length;

            minDel += 4;
            maxDel += 4;
            maxDateDelete.setDate(maxDateDelete.getDate() - maxDel);
            minDateDelete.setDate(minDateDelete.getDate() - minDel);
        }

        const updatedData = [];
        // FIXED: Resetting local bucket bounds specifically for the update loop
        let minUp = 0;
        let maxUp = 2;
        const maxDateUpdate = new Date();
        const minDateUpdate = new Date();
        maxDateUpdate.setDate(maxDateUpdate.getDate() - maxUp);
        minDateUpdate.setDate(minDateUpdate.getDate() - minUp);
        // let postUpdateCount=0
        
        const rawPosts= await Posts.find({})
        const postLogs=[]
        console.log('===================================================')

        for(let i=0; i<rawPosts.length; i++){
            const updateLog = rawPosts[i].updateLog || [];
            for(let j=0; j<updateLog.length; j++){
                postLogs.push(rawPosts[i].updateLog[j])
            }
        }

       

       
        for(let x=0; x<8; x++){
            const tempPost=[]
            for(let y=0; y<postLogs.length; y++){
                if(postLogs[y]>maxDateUpdate&&postLogs[y]<=minDateUpdate){
                    tempPost.push(postLogs[y])
                }
            }
            updatedData[x]=tempPost.length

            minUp += 4;
            maxUp += 4;
            maxDateUpdate.setDate(maxDateUpdate.getDate() - maxUp);
            minDateUpdate.setDate(minDateUpdate.getDate() - minUp);
        }

        // console.log(updatedData)


        // for(let i = 0; i < 8; i++){
        //     const posts = await Posts.find({
        //         // FIXED: Querying updated lifecycle window fields
        //         updatedAt: {
        //             $gte: maxDateUpdate,
        //             $lte: minDateUpdate
        //         },
        //         $expr: { 
        //             $and: [
        //                 { $ne: ["$updatedAt", "$createdAt"] },
        //                 { $ne: ["$updatedAt", "$deletedDate"] }
        //             ]
        //         }
        //     });

        //     for(let i=0; i<posts.length; i++){
        //         postUpdateCount+=posts[i].updateCount
        //     }
        //     updatedData[i] = postUpdateCount;

        //     minUp += 4;
        //     maxUp += 4;
        //     maxDateUpdate.setDate(maxDateUpdate.getDate() - maxUp);
        //     minDateUpdate.setDate(minDateUpdate.getDate() - minUp);
        // }

        const dataBuckets = [
            '1-4 ago', '5-8 ago', '9-12 ago', '13-16 ago',
            '17-20 ago', '21-24 ago', '25-28 ago', '29-32 ago'
        ];

        const chartData = [];
        for(let i = 7; i >= 0; i--){
            chartData.push({
                'name': dataBuckets[i],
                'created': createdData[i],
                'updated': updatedData[i],
                'deleted': deletedData[i]
            });
        }

        return NextResponse.json({ 'data': chartData, status:200, success: true, toastMessage: 'Data Retrieved' });
        
    } 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch (error: any) {
        return NextResponse.json({ message: "Got error in view all api route", error: error.message, status: 500, success: false });
    }
}