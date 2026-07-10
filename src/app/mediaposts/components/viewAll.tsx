'use client'
import {useContext} from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import DataContext from '@/context/DataContext'


export default function ViewAllPosts(){

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const {setPostData} = useContext(DataContext) as any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const {postData} = useContext(DataContext) as any

    const viewAll=async(isDeleted:string)=>{
            setPostData([])
            const temp=await axios.get('/api/users/mediaposts?deleted='+isDeleted)
            setPostData(temp.data.posts)
            if(temp.data.status===200){
                toast.success(temp.data.toastMessage)
            }
            else{
                toast.error(temp.data.toastMessage)
            }
        }

    return(
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-4 justify-center items-center w-full p-4'>
                        {viewAll('false')}
                        {postData && postData.length > 0 ? (
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            postData.map(function(item: any) {
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
                )
}