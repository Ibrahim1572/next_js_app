'use client'
import {useState} from 'react'
import axios from 'axios'
import {useRouter} from 'next/navigation'

function Page(){
    const router=useRouter()
    const onSignUp = async (formData) =>{
        const data={
            username: "",
            email: "",
            password: ""
        }
        const response = await axios.post("/api/users/logout", data)
        console.log("Signup success:", response.data)
        alert("Logged Out successfully!")
        router.push('/login')
    }

    const goToLogout= async()=>{
        router.push('/logout')
    }

    const goToProfile= async()=>{
        router.push('/profile')
    }


    return (
        <div className='flex flex-col grow bg-blue-950 font-[roboto] font-bold text-white'>
            <header className='flex flex-row '>
                <div className='size-8 grow p-1 outline-2 rounded-xl  mx-8 my-8 text-center bg-blue-800/30 hover:bg-blue-800/75' onClick={goToProfile}>Profile</div>
                <div className='text-white grow-19 text-6xl flex items-center justify-center p-4'>Media Posts</div>
                <div className='size-8 grow p-1 outline-2 rounded-xl  mx-8 my-8 text-center bg-blue-800/30 hover:bg-blue-800/75' onClick={goToLogout}>Logout</div>
            </header>

            <header className='flex flex-row '>
                <div className='size-8 grow p-1 outline-2 rounded-xl mx-8 my-2 text-center bg-blue-800/30 hover:bg-blue-800/75'>Add Post</div>
                <div className='size-8 grow p-1 outline-2 rounded-xl  mx-8 my-2 text-center bg-blue-800/30 hover:bg-blue-800/75'>View One Post</div>
                <div className='size-8 grow p-1 outline-2 rounded-xl  mx-8 my-2 text-center bg-blue-800/30 hover:bg-blue-800/75'>View All Posts</div>
                <div className='size-8 grow p-1 outline-2 rounded-xl  mx-8 my-2 text-center bg-blue-800/30 hover:bg-blue-800/75'>Update Post</div>
                <div className='size-8 grow p-1 outline-2 rounded-xl  mx-8 my-2 text-center bg-blue-800/30 hover:bg-blue-800/75'>Delete Post</div>
                <div className='size-8 grow p-1 outline-2 rounded-xl  mx-8 my-2 text-center bg-blue-800/30 hover:bg-blue-800/75'>Logout</div>
            </header>
            <div>media posts</div>
            <form action={onSignUp}>
                <button type='submit'>LogOut</button>
            </form>

        </div>
    )
}

export default Page