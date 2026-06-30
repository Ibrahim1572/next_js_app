'use client'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useSession, signIn } from 'next-auth/react'

function Page() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [user, setUser] = useState({
        password: "",
        email: ""
    })

    useEffect(function() {
        if (session) {
            router.push('/mediaposts')
        }
    }, [session, router])

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onSignIn = async (formData: any) => {
        const data = {
            email: formData.get('email').trim(),
            password: formData.get('password').trim()
        }
        const response = await axios.post("/api/users/login", data)
        console.log("Signup success:", response.data)
        alert("Logged in successfully!")
        window.location.href = '/mediaposts';

    }

    function goToSignUp() {
        router.push('/signup')
    }

    if (status === "loading") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-400 font-sans">
                Checking authentication...
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
            {/* Main Card Container */}
            <div className="bg-slate-800 p-8 rounded-xl shadow-lg w-full max-w-md">
                
                <h1 className="text-3xl font-bold text-white mb-6 text-center">
                    Welcome Back
                </h1>

                {/* Form area using space-y to automatically gap the inputs */}
                <form action={onSignIn} className="flex flex-col space-y-5">
                    
                    {/* Email Input Group */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">
                            Enter Email:
                        </label>
                        <input 
                            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            placeholder="Email" 
                            required 
                            type="email" 
                            name="email"
                        />
                    </div>

                    {/* Password Input Group */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">
                            Enter Password:
                        </label>
                        <input 
                            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            placeholder="Password(******)" 
                            required  
                            type="password" 
                            name="password"
                        />
                    </div>

                    {/* Primary Submit Button */}
                    <button 
                        type="submit"
                        className="w-full py-2.5 mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition duration-200"
                    >
                        Log In
                    </button>
                </form>
                <div className="relative flex py-3 items-center">
                    <div className="flex-grow border-t border-slate-700"></div>
                    <span className="flex-shrink mx-4 text-slate-500 text-xs uppercase">Or continue with</span>
                    <div className="flex-grow border-t border-slate-700"></div>
                </div>

                <div className="mt-1">
                    <button 
                        type="button"
                        onClick={function() { signIn('github') }}
                        className="w-full py-2.5 bg-zinc-700 hover:bg-zinc-600 text-white font-semibold rounded-lg shadow-md transition duration-200 flex items-center justify-center gap-2"
                    >
                        Sign In with GitHub
                    </button>
                </div>
                <div className="mt-1">
                    <button 
                        type="button"
                        onClick={function() { signIn('google') }}
                        className="w-full py-2.5 bg-zinc-700 hover:bg-zinc-600 text-white font-semibold rounded-lg shadow-md transition duration-200 flex items-center justify-center gap-2"
                    >
                        Sign In with Google
                    </button>
                </div>
                {/* Divider & Secondary Action */}
                <div className="mt-8 text-center border-t border-slate-700 pt-6">
                    <p className="text-sm text-slate-400 mb-3">Don't have an account?</p>
                    <button 
                        type="button" 
                        onClick={goToSignUp}
                        className="w-full py-2.5 bg-transparent border border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white font-semibold rounded-lg transition duration-200"
                    >
                        Sign Up Instead
                    </button>
                </div>

            </div>
        </div>
    )
}

export default Page