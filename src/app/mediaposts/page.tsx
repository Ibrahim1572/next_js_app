'use client'
import {useState} from 'react'
import axios from 'axios'
import {useRouter} from 'next/navigation'

function Page(){
    const router=useRouter()
    
    const goToLogout= async()=>{
        router.push('/logout')
    }

    const goToProfile= async()=>{
        router.push('/profile')
    }

    const [post, setPost]= useState({
        title: "",
        body: ""
    })

    const [currentView, setCurrentView]=useState("addPost")

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const addPost=async(formData: any)=>{
        const data ={
            title: formData.get('title'),
            body: formData.get('body')
        }
        const response= await axios.post('/api/users/mediaposts', data)

        return response
    }

    const viewAll=async()=>{
        console.log('viewAll func called')
    }


    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const stateJSX=async(currView: any)=>{
        const view=currView
        switch (view){

            case 'addPost':
                return("")
            case 'addPost':
                return("")
            case 'addPost':
                return("")
            case 'addPost':
                return("")
            default: 
                return("")
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    // const viewSelector=async({view})=>{
    //     const currentView=view
    //     switch (currentView){
    //         case "viewAll":
    //             return 
    //         default:
                
    // }}
    // const addPostHelper=async()=>{
    //     addPost()
    // }

    // const onSignUp=async()=>{
        // return (
        //     <form  className="flex flex-col space-y-5">
                    
        //             {/* Email Input Group */}
        //             <div>
        //                 <label className="block text-sm font-medium text-slate-300 mb-1">
        //                     Enter Email:
        //                 </label>
        //                 <input 
        //                     className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
        //                     placeholder="Email" 
        //                     required 
        //                     type="email" 
        //                     name="email"
        //                 />
        //             </div>

        //             {/* Password Input Group */}
        //             <div>
        //                 <label className="block text-sm font-medium text-slate-300 mb-1">
        //                     Enter Password:
        //                 </label>
        //                 <input 
        //                     className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
        //                     placeholder="Password(******)" 
        //                     required  
        //                     type="password" 
        //                     name="password"
        //                 />
        //             </div>

        //             {/* Primary Submit Button */}
        //             <button 
        //                 type="submit"
        //                 className="w-full py-2.5 mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition duration-200"
        //             >
        //                 Log In
        //             </button>
        //         </form>
        // )
    // }

    // const stateSet=async(option: string)=>{
    //     setState(option)
    // }

    return (
        <div className='flex flex-col grow bg-blue-950 font-[roboto] font-bold text-white'>



            <header className='flex flex-row '>
                <div className='size-8 grow p-1 outline-2 rounded-xl  mx-8 my-8 text-center bg-blue-800/30 hover:bg-blue-800/75' onClick={goToProfile}>Profile</div>
                <div className='text-white grow-19 text-6xl flex items-center justify-center p-4'>Media Posts</div>
                <div className='size-8 grow p-1 outline-2 rounded-xl  mx-8 my-8 text-center bg-blue-800/30 hover:bg-blue-800/75' onClick={goToLogout}>Logout</div>
            </header>






            <header className='flex flex-row '>
                <div className='size-8 grow p-1 outline-2 rounded-xl mx-8 my-2 text-center bg-blue-800/30 hover:bg-blue-800/75' onClick={function(){setCurrentView('addPost'); stateJSX('addPost');}}>Add Post</div>
                <div className='size-8 grow p-1 outline-2 rounded-xl  mx-8 my-2 text-center bg-blue-800/30 hover:bg-blue-800/75' onClick={function(){setCurrentView('viewOne'); stateJSX('viewOne');}}>View One Post</div>
                <div className='size-8 grow p-1 outline-2 rounded-xl  mx-8 my-2 text-center bg-blue-800/30 hover:bg-blue-800/75' onClick={function(){setCurrentView('viewAll'); stateJSX('viewAll');}}>View All Posts</div>
                <div className='size-8 grow p-1 outline-2 rounded-xl  mx-8 my-2 text-center bg-blue-800/30 hover:bg-blue-800/75' onClick={function(){setCurrentView('updatePost'); stateJSX('updatePost');}}>Update Post</div>
                <div className='size-8 grow p-1 outline-2 rounded-xl  mx-8 my-2 text-center bg-blue-800/30 hover:bg-blue-800/75' onClick={function(){setCurrentView('deletePost'); stateJSX('deletePost');}}>Delete Post</div>
            </header>






            <header>
                <div className='flex h-105 grow p-4 outline-2 bg-blue-300/30 rounded-xl mx-64 my-8'>
                    <h1>helooo</h1>
                </div>
                
            </header>
        </div>
    )
}

export default Page