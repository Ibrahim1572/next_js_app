'use client'
import {useContext} from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import DataContext from '@/context/DataContext'
import { useRouter } from 'next/navigation'

export default function DeletePost(){

    const router = useRouter()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const {setCurrentView} = useContext(DataContext) as any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const {currentView} = useContext(DataContext) as any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const {setPostDataOne} = useContext(DataContext) as any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const {postDataOne} = useContext(DataContext) as any


    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const searchPost=async(formData: any)=>{
        const searchTitle=formData.get('title').trim()
        let temp
        console.log(`current view: ${currentView}`)
        if(currentView==='restorePost'){
            temp=await axios.get('/api/users/mediaposts/'+encodeURIComponent(searchTitle)+'?deleted=true')
        }
        else{
            temp=await axios.get('/api/users/mediaposts/'+encodeURIComponent(searchTitle)+'?deleted=false')
        }
        setPostDataOne(temp.data.post)
        if(temp.data.status===200){
            toast.success(temp.data.toastMessage)
        }
        else{
            toast.error(temp.data.toastMessage)
            router.push('/mediaposts')
        }
        
    }

    const deletePost=async()=>{
            const oldTitle = postDataOne?.postTitle 
            const response= await axios.post('/api/users/mediaposts/'+encodeURIComponent(oldTitle)+'?deleted=false')
            if(response.data.status===200){
                toast.success(response.data.toastMessage)
            }
            else{
                toast.error(response.data.toastMessage)
                router.push('/mediaposts')
            }

            setCurrentView("")
            setPostDataOne(null)
        }

    return (
                    <>
                    <header>
                        <form action={searchPost} className="flex flex-col space-y-5 justify-center items-center" >
                            <h1>Delete a Post</h1>
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
                        {postDataOne ? (
                            <form action={deletePost}>
                            <div key={postDataOne?._id} className='p-6 min-w-[300px] max-w-md outline-2 rounded-xl text-center bg-blue-800/30 border border-blue-700/50'>
                                <h1>Post</h1>
                                <h3 className="text-2xl font-bold mb-3 text-white">{postDataOne?.postTitle}</h3>
                                <p className="text-base text-slate-300 font-normal">{postDataOne?.postBody}</p>
                                
                                {/* Optional: Add metadata fields if you want to show them */}
                                <div className="mt-4 pt-3 border-t border-blue-700/30 text-xs text-slate-400 font-normal flex justify-between">
                                    <span>Likes: {postDataOne?.postLikes}</span>
                                    <span>Created: {new Date(postDataOne?.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="w-full py-2.5 mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition duration-200"
                            >
                                Delete Permanently
                            </button>
                            </form>
                        ) : (
                            <div className="text-center text-slate-400 font-normal">No post found</div>
                        )}
                    </div>
                    </>
                    
                )
}