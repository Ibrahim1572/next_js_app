'use client'
import {useContext, useEffect, useState, useEffectEvent} from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import DataContext from '@/context/DataContext'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'




export default function ViewOnePost(){
    const router= useRouter()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const {currentView} = useContext(DataContext) as any
    
    const [postTitle, setPostTitle] = useState('')

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const searchPost=async(formData: any)=>{
        const searchTitle=formData.get('title').trim()
        setPostTitle(searchTitle)
    }

    const queryFunc = async(postTitle: string) =>{
        
        if(currentView ==='viewOne'){
            const res=await axios.get('/api/users/mediaposts/'+encodeURIComponent(postTitle)+'?deleted=false')
            console.log(res)
            return res
        }
    }

    const { data } = useQuery({
        queryKey: ['viewOne', postTitle, currentView],
        queryFn: ()=> queryFunc(postTitle), 
        enabled: !!postTitle,
    })

    const navigateToMedia = useEffectEvent(()=>{
        router.push('/mediaposts')
    })

    useEffect(() => {
        if(data){
            if(data?.data.status===200){
                toast.success(data.data.toastMessage)
            }
            else{
                toast.error(data?.data.toastMessage)
                navigateToMedia()
            }
        }
    }, [data])

    

    return (
                    <>
                    <header>
                        <form action={searchPost} className="flex flex-col space-y-5 justify-center items-center" >
                            <h1>Search a Post</h1>
                            <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">
                               Enter Post title:
                            </label>
                            <input 
                                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                placeholder="title" 
                                required 
                                name="title"
                            />
                            </div>
                            <button
                                type="submit"
                                className="w-full py-2.5 mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition duration-200"
                            >
                                Search
                            </button>
                        </form>

                    
                                    
                    </header>
                    <div className='flex justify-center items-center w-full p-4'>
                        {data ? (
                            <div key={data.data.post._id} className='p-6 min-w-[300px] max-w-md outline-2 rounded-xl text-center bg-blue-800/30 border border-blue-700/50'>
                                <h3 className="text-2xl font-bold mb-3 text-white">{data.data.post?.postTitle}</h3>
                                <p className="text-base text-slate-300 font-normal">{data.data.post?.postBody}</p>
                                
                                {/* Optional: Add metadata fields if you want to show them */}
                                <div className="mt-4 pt-3 border-t border-blue-700/30 text-xs text-slate-400 font-normal flex justify-between">
                                    <span>Likes: {data.data.post.postLikes}</span>
                                    <span>Created: {new Date(data.data.post.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center text-slate-400 font-normal">No post found</div>
                        )}
                    </div>
                    </>
                    
                                )
}