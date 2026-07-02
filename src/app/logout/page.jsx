'use client'
import {useState} from 'react'
import axios from 'axios'
import {useRouter} from 'next/navigation'
import toast from 'react-hot-toast'

function Page(){
    const router=useRouter()
    const onLogOut = async (formData) =>{
        const data={
            username: "",
            email: "",
            password: ""
        }
        const response = await axios.post("/api/users/logout", data)
        if(response.data.status===200){
                    toast.success(response.data.toastMessage)
                }
                else{
                    toast.error(response.data.toastMessage)
                }
        console.log("Signup success:", response.data)
        alert("Logged Out successfully!")
        router.push('/login')
    }

   
    
    const goToMediaPosts= async()=>{
        router.push("/mediaposts")
        }

    const goToProfilePage=async()=>{
        router.push('/profile')
    }


    // return (
    //     <>
    //         <div>sign out page</div>
    //         <form action={onSignUp}>
    //             <button type='submit'>LogOut</button>
    //         </form>

    //     </>
    // )

    return (
        <div className="p-8 flex flex-col gap-4 bg-slate-900 min-h-screen text-white">
            <div>Signout Page</div>
                    

            <div className="flex gap-4">
                {/* Fixed border classes by adding 'border-b-2' */}
                <button 
                    className='border-b-2 border-b-amber-600 px-4 py-2 rounded bg-amber-600/10 hover:bg-amber-600/20 transition' 
                    onClick={onLogOut}
                >
                    Logout
                </button>
                
                <button 
                    className='border-b-2 border-b-green-500 px-4 py-2 rounded bg-green-500/10 hover:bg-green-500/20 transition' 
                    onClick={goToProfilePage}
                >
                    Go to profile Page
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