'use client'
import {useState} from 'react'
import axios from 'axios'
import {useRouter} from 'next/navigation'
import toast from 'react-hot-toast'

function Page(){
    const router= useRouter()
    const[user, setUser]= useState({
        username: "",
        password: "",
        email: ""
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onSignUp = async (formData:any) =>{
        const data={
            userName: formData.get('username').trim(),
            email: formData.get('email').trim(),
            password: formData.get('password').trim()
        }
        const response = await axios.post("/api/users/signup", data)
        if(response.data.status===200){
            toast.success(response.data.toastMessage)
        }
        else{
            toast.error(response.data.toastMessage)
        }
        // console.log("Signup success:", response.data)
        // alert("Signed up successfully!")
        goToLogin()
    }

    function goToLogin(){
        router.push('/login')
    }


    return (
        <div className='flex flex-col items-center justify-center bg-blue-950 min-h-screen p-8 font-[Roboto]'>
            <div className='flex flex-col items-center justify-center bg-blue-300/30 rounded-xl shadow-lg max-w-md w-full min-h-1/2 p-4 gap-1'>
                <div className='text-[42px] uppercase font-bold'>sign up page</div>
                <form action={onSignUp} className='p-4 gap-2'>
                    <h1 className='p-0.5'>Enter Username:</h1>
                    <input className='border rounded p-0.5' placeholder={'Username'} required type='text' name='username'/>
                    <h1 className='p-0.5'>Enter Email:</h1>
                    <input className='border rounded p-0.5' placeholder={'Email'} required type='email' name='email'/>
                    <h1 className='p-0.5'>Enter Password:</h1>
                    <input className='border rounded p-0.5' placeholder={'Password(******)'} required  type="password" name='password'/>
                    <button className='flex flex-col justify-center p-0.5 border rounded hover:bg-yellow-300/75' type='submit'>Signup</button>
                </form>
                <button className='border p-0.5 hover:bg-yellow-300/75 rounded' onClick={goToLogin} type='submit'>LogIn Instead</button>
            </div>
        </div>
    )
}

export default Page