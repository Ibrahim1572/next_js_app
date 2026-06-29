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

    const [postData, setPostData]=useState([])
    const [currentView, setCurrentView]=useState("")

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const addPost=async(formData: any)=>{
        const data ={
            title: formData.get('title'),
            body: formData.get('body')
        }
        const response=await axios.post('/api/users/mediaposts', data)
        setCurrentView("")
        console.log(response)
    }

    const viewAll=async()=>{
        setPostData([])
        const temp=await axios.get('/api/users/mediaposts')
        console.log(typeof(temp.data.posts))
        setPostData(temp.data.posts)
        console.log(typeof(temp.data.posts))
        // return 
    }

    const viewOne=async(searchTitle: string)=>{
        setPostData([])
        const temp=await axios.get('/api/users/mediaposts/'+searchTitle)
        console.log(typeof(temp.data.posts))
        setPostData(temp.data.posts)
        console.log(typeof(temp.data.posts))
        // return 
    }


    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const stateJSX=()=>{
        switch (currentView){

            case 'viewOne':
                return(<h1>viewOne</h1>)
            case 'viewAll':
                return(
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-4 justify-center items-center w-full p-4'>
                        {postData && postData.length > 0 ? (
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            postData.map(function(item: any) {
                                return (
                                    <div key={item._id} className='p-4 outline-2 rounded-xl text-center bg-blue-800/30 border border-blue-700/50'>
                                        <h3 className="text-xl font-bold mb-2">{item.postTitle}</h3>
                                        <p className="text-sm text-slate-300 font-normal">{item.postBody}</p>
                                    </div>
                                )
                            })
                        ) : (
                            <div className="col-span-full text-center text-slate-400">No posts found or loading...</div>
                        )}
                    </div>
                )
            case 'updatePost':
                return(<h1>updatePost</h1>)
            case 'deletePost':
                return(<h1>deletePost</h1>)
            default : 
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
                )
        }
    }


    return (
        <div className='flex flex-col grow bg-blue-950 font-[roboto] font-bold text-white'>



            <header className='flex flex-row '>
                <div className='size-8 grow p-1 outline-2 rounded-xl  mx-8 my-8 text-center bg-blue-800/30 hover:bg-blue-800/75' onClick={goToProfile}>Profile</div>
                <div className='text-white grow-19 text-6xl flex items-center justify-center p-4'>Media Posts</div>
                <div className='size-8 grow p-1 outline-2 rounded-xl  mx-8 my-8 text-center bg-blue-800/30 hover:bg-blue-800/75' onClick={goToLogout}>Logout</div>
            </header>






            <header className='flex flex-row '>
                <div className='size-8 grow p-1 outline-2 rounded-xl mx-8 my-2 text-center bg-blue-800/30 hover:bg-blue-800/75' onClick={function(){setCurrentView('addPost'); }}>Add Post</div>
                <div className='size-8 grow p-1 outline-2 rounded-xl  mx-8 my-2 text-center bg-blue-800/30 hover:bg-blue-800/75' onClick={function(){setCurrentView('viewOne'); }}>View One Post</div>
                <div className='size-8 grow p-1 outline-2 rounded-xl  mx-8 my-2 text-center bg-blue-800/30 hover:bg-blue-800/75' onClick={function(){setCurrentView('viewAll'); viewAll()}}>View All Posts</div>
                <div className='size-8 grow p-1 outline-2 rounded-xl  mx-8 my-2 text-center bg-blue-800/30 hover:bg-blue-800/75' onClick={function(){setCurrentView('updatePost');}}>Update Post</div>
                <div className='size-8 grow p-1 outline-2 rounded-xl  mx-8 my-2 text-center bg-blue-800/30 hover:bg-blue-800/75' onClick={function(){setCurrentView('deletePost');}}>Delete Post</div>
            </header>






            <header>
                <div className='flex h-auto grow p-4 outline-2 bg-blue-300/30 rounded-xl mx-64 my-8 items-center justify-center'>
                    <div className='flex items-center justify-center p-4'>
                        {stateJSX()}
                    </div>
                    
                </div>
                
            </header>
        </div>
    )
}

export default Page