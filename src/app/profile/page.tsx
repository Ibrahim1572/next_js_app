'use client'
import axios from 'axios'
import {useRouter} from 'next/navigation'
import {useState} from 'react'
import toast from 'react-hot-toast'

function Page(){
    const router=useRouter()
    const [userData, setUserData] = useState(null)

    const getData=async()=>{
        const response = await axios.post("/api/users/profile")
        if(response.data.status===200){
                    toast.success(response.data.toastMessage)
                }
                else{
                    toast.error(response.data.toastMessage)
                }
        setUserData(response.data.dbUser)
        // console.log("-----------------------------------------------------------")
        // console.log(response.data)
        return response
    }

    const goToSignOut= async()=>{
        router.push("/logout")
    }
    // const response1 = axios.post("/api/users/profile")
    // console.log(response1)

    const goToMediaPosts= async()=>{
        router.push("/mediaposts")
    }
    // const response2 = axios.post("/api/users/mediaposts")
    // console.log(response2)
    

    return (
        <div className="p-8 flex flex-col gap-4 bg-slate-900 min-h-screen text-white">
            <div>Profile Page</div>
            
            {/* Displaying the data if it exists */}
            {userData? (
                <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                    <p><strong>Name:</strong> {userData.name}</p>
                    <p><strong>Email:</strong> {userData.email}</p>
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