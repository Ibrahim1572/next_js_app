'use client'
import {useContext, useEffect, useEffectEvent} from 'react'
import DataContext from '@/context/DataContext'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useQuery } from '@tanstack/react-query'


export default function ViewAllPosts(){

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const {postData} = useContext(DataContext) as any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const {setPostData} = useContext(DataContext) as any

    
    


    // const viewAll=async(isDeleted:string)=>{
    //         setPostData([])
    //         const temp=await axios.get('/api/users/mediaposts?deleted='+isDeleted)
    //         setPostData(temp.data.posts)
    //         if(temp.data.status===200){
    //             toast.success(temp.data.toastMessage)
    //         }
    //         else{
    //             toast.error(temp.data.toastMessage)
    //         }
    //     }

    const {data, refetch} = useQuery({
        queryKey: ['viewAll'],
        queryFn: ()=>viewAllQueryFunc('false'),
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        staleTime: 5*60*1000

    })

    const viewAllQueryFunc = async(isDeleted: string) =>{
        const temp = await axios.get('/api/users/mediaposts?deleted='+isDeleted)
        // console.log('|||||||||||||||||||||||||||||||||||||||||||||||||||||||')
        // console.log(temp)
        return temp
    }

    const handleViewAllClick = async () => {
    const result = await refetch();
    if (result.data?.data.status === 200) {
        toast.success(result.data.data.toastMessage);
    } else {
        toast.error(result.data?.data.toastMessage);
    }
};

    return(
                <>
                    <div className='flex flex-col'>
                        <button className='flex flex-row justify-center items-center py-3 px-2 outline-2 rounded-xl  bg-blue-900/30 hover:bg-blue-800/75' onClick={handleViewAllClick}>Refresh</button>
                        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 justify-center items-center w-full p-4'>
                            {/* {console.log(data)} */}
                            {data?.data.posts && data?.data.posts.length > 0 ? (
                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                data.data.posts.map(function(item: any) {
                                    return (
                                        <div key={item._id} className='p-4 outline-2 rounded-xl text-center bg-blue-800/30 border border-blue-700/50'>
                                            <h3 className="text-xl font-bold mb-2">{item.postTitle}</h3>
                                            <p className="text-sm text-slate-300 font-normal">{item.postBody}</p>
                                            <div className="mt-4 pt-3 border-t border-blue-700/30 text-xs text-slate-400 font-normal flex justify-between">
                                                <span>Likes: {item.postLikes}</span>
                                                <span>Created: {new Date(item.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                        
                                    )
                                })
                            ) : (
                                <div className="col-span-full text-center text-slate-400">No posts found or loading...</div>
                            )}
                        </div>
                    </div>
                </>
                )
}