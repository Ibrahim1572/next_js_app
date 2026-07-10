'use client'
import { useContext} from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import DataContext from '@/context/DataContext'

export default function AddPost(){

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const {setCurrentView} = useContext(DataContext) as any

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const addPost=async(formData: any)=>{
        const data ={
            title: formData.get('title').trim(),
            body: formData.get('body').trim()
        }
        const response=await axios.post('/api/users/mediaposts', data)
        if(response.data.status===200){
                    toast.success(response.data.toastMessage)
                }
                else{
                    toast.error(response.data.toastMessage)
                }
        setCurrentView("")
        console.log(response)
    }

    return(
                    <form action={addPost} className="flex flex-col space-y-5 justify-center items-center" >
                    <h1>Add a Post</h1>
                    {/* Email Input Group */}
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

                    {/* Password Input Group */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">
                            Enter Post body:
                        </label>
                        <input 
                            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            placeholder="body" 
                            required  
                            name="body"
                        />
                    </div>

                    {/* Primary Submit Button */}
                    <button
                        type="submit"
                        className="w-full py-2.5 mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition duration-200"
                    >
                        Post
                    </button>
                </form>
                );
}