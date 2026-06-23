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


    return (
        <>
            <div>sign out page</div>
            <form action={onSignUp}>
                <button type='submit'>LogOut</button>
            </form>

        </>
    )
}

export default Page