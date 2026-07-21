'use client'
import axios from 'axios'
import {useRouter} from 'next/navigation'
import {useEffect, useState} from 'react'
import toast from 'react-hot-toast'

interface UserProfile {
    'User Data': {
        name: string;
        email: string;
        role: string;
    };
    status: number;
    toastMessage: string;
}

function Page(){
    const router=useRouter()
    const [userData, setUserData] = useState<UserProfile | null>(null)

    const getData=async()=>{
        const response = await axios.post("/api/users/profile")
        if(response.data.status===200){
                    toast.success(response.data.toastMessage)
                }
                else{
                    toast.error(response.data.toastMessage)
                    router.push('/profile')
                }
        setUserData(response.data['User Data'].userData)
        return response
    }

    const goToSignOut= async()=>{
        router.push("/logout")
    }

    const goToMediaPosts= async()=>{
        router.push("/mediaposts")
    }

    return (
        <div className="p-8 flex flex-col gap-4 bg-slate-900 min-h-screen text-white">
            <div>Profile Page</div>
            
            {userData? (
                <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                    <p><strong>Name:</strong> {userData.name }</p>
                    <p><strong>Email:</strong> {userData.email}</p>
                    <p><strong>User Type:</strong> {userData.role}</p>
                </div>
            ):(<div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                    <p><strong></strong></p>
                    
                </div>)}


            <div className="flex gap-4">
                {/* Fixed border classes by adding 'border-b-2' */}
                <button 
                    className='border-b-2 border-b-amber-600 px-4 py-2 rounded bg-amber-600/10 hover:bg-amber-600/20 transition' 
                    onClick={goToSignOut}
                >
                    Logout
                </button>
                
                <button 
                    className='border-b-2 border-b-green-500 px-4 py-2 rounded bg-green-500/10 hover:bg-green-500/20 transition' 
                    onClick={getData}
                >
                    Get User Data
                </button>

                <button 
                    className='border-b-2 border-b-green-500 px-4 py-2 rounded bg-red-500/10 hover:bg-red-500/20 transition' 
                    onClick={goToMediaPosts}
                >
                    Go to Media Posts Dashboard
                </button>
            </div>
        </div>
    )
}

export default Page