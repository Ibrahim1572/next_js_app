'use client'
import axios from 'axios'
import {useRouter} from 'next/navigation'
import {useState} from 'react'

function Page(){
    const router=useRouter()
    const [userData, setUserData] = useState(null)

    const getData=async()=>{
        const response = await axios.post("/api/users/profile")
        setUserData(response.data.dbUser)
        console.log("-----------------------------------------------------------")
        console.log(response.data)
        return response
    }

    const goToSignOut= async()=>{
        router.push("/logout")
    }
    const response = axios.post("/api/users/profile")
    console.log(response)
    

    return (
        <div className="p-8 flex flex-col gap-4 bg-slate-900 min-h-screen text-white">
            <div>Profile Page</div>
            
            {/* Displaying the data if it exists */}
            {userData && (
                <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                    <p><strong>Email:</strong> {userData.email}</p>
                    <p><strong>ID:</strong> {userData._id}</p>
                </div>
            )}

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
            </div>
        </div>
    )
}

export default Page