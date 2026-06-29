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
    const [postDataOne, setPostDataOne]=useState<any>(null)

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
        setPostData(temp.data.posts)
        // return 
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const searchPost=async(formData: any)=>{
        const searchTitle=formData.get('title')
        const temp=await axios.get('/api/users/mediaposts/'+encodeURIComponent(searchTitle))
        setPostDataOne(temp.data.post)
        
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updatePost=async(formData: any)=>{
        if (!postDataOne) return;
        
        const data={
            newPostTitle: formData.get('newTitle'), 
            newPostBody: formData.get('newBody')
        }
        // Change '.title' to '.postTitle' to match your schema
        const oldTitle = postDataOne?.postTitle 
        
        // Note: If your backend endpoint uses PUT for updates, change .post to .put
        await axios.post('/api/users/mediaposts/'+encodeURIComponent(oldTitle), data)
        
        // Reset view or clean up
        setCurrentView("")
        setPostDataOne(null)
    }

    const deletePost=async()=>{
        const oldTitle = postDataOne?.postTitle 
        await axios.delete('/api/users/mediaposts/'+encodeURIComponent(oldTitle))
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const stateJSX=()=>{
        switch (currentView){

            case 'viewOne':
                return (
                    <>
                    <header>
                        <form action={searchPost} className="flex flex-col space-y-5 justify-center items-center" >
                            <h1>Search a Post</h1>
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
                            <button
                                type="submit"
                                className="w-full py-2.5 mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition duration-200"
                            >
                                Search
                            </button>
                        </form>

                    
                                    
                    </header>
                    <div className='flex justify-center items-center w-full p-4'>
                        {postDataOne ? (
                            <div key={postDataOne._id} className='p-6 min-w-[300px] max-w-md outline-2 rounded-xl text-center bg-blue-800/30 border border-blue-700/50'>
                                <h3 className="text-2xl font-bold mb-3 text-white">{postDataOne?.postTitle}</h3>
                                <p className="text-base text-slate-300 font-normal">{postDataOne?.postBody}</p>
                                
                                {/* Optional: Add metadata fields if you want to show them */}
                                <div className="mt-4 pt-3 border-t border-blue-700/30 text-xs text-slate-400 font-normal flex justify-between">
                                    <span>Likes: {postDataOne.postLikes}</span>
                                    <span>Created: {new Date(postDataOne.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center text-slate-400 font-normal">No post found</div>
                        )}
                    </div>
                    </>
                    
                                )
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
                                        <div className="mt-4 pt-3 border-t border-blue-700/30 text-xs text-slate-400 font-normal flex justify-between">
                                            <span>Likes: {item.postLikes}</span>
                                            <span>Created: {new Date(item.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    
                                )
                            })
                        ) : (
                            <div className="col-span-full text-center text-slate-400">No posts found or loading...</div>
                        )}
                    </div>
                )
            case 'updatePost':
                return (
                    <>
                    <header>
                        <form action={searchPost} className="flex flex-col space-y-5 justify-center items-center" >
                            <h1>Update a Post</h1>
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
                            <button
                                type="submit"
                                className="w-full py-2.5 mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition duration-200"
                            >
                                Search
                            </button>
                        </form>

                    </header>
                    <div className='flex justify-center items-center w-full p-4'>
                        {postDataOne ? (
                            <form action={updatePost}>
                            <div key={postDataOne?._id} className='p-6 min-w-[300px] max-w-md outline-2 rounded-xl text-center bg-blue-800/30 border border-blue-700/50'>
                                <h1>Old Post</h1>
                                <h3 className="text-2xl font-bold mb-3 text-white">{postDataOne?.postTitle}</h3>
                                <p className="text-base text-slate-300 font-normal">{postDataOne?.postBody}</p>
                                
                                {/* Optional: Add metadata fields if you want to show them */}
                                <div className="mt-4 pt-3 border-t border-blue-700/30 text-xs text-slate-400 font-normal flex justify-between">
                                    <span>Likes: {postDataOne?.postLikes}</span>
                                    <span>Created: {new Date(postDataOne?.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">
                                    Enter new Post title:
                                    </label>
                                    <input 
                                        className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                        placeholder="new title" 
                                        required 
                                        name="newTitle"
                                    />
                                <label className="block text-sm font-medium text-slate-300 mb-1">
                                    Enter new Post body:
                                    </label>
                                    <input 
                                        className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                        placeholder="new body" 
                                        required 
                                        name="newBody"
                                    />
                                <button
                                    type="submit"
                                    className="w-full py-2.5 mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition duration-200"
                                >
                                    Update
                                </button>
                            </div>
                            </form>
                        ) : (
                            <div className="text-center text-slate-400 font-normal">No post found</div>
                        )}
                    </div>
                    </>
                    
                                )
            case 'deletePost':
                return (
                    <>
                    <header>
                        <form action={searchPost} className="flex flex-col space-y-5 justify-center items-center" >
                            <h1>Delete a Post</h1>
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
                            <button
                                type="submit"
                                className="w-full py-2.5 mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition duration-200"
                            >
                                Search
                            </button>
                        </form>

                    </header>
                    <div className='flex justify-center items-center w-full p-4'>
                        {postDataOne ? (
                            <form action={deletePost}>
                            <div key={postDataOne?._id} className='p-6 min-w-[300px] max-w-md outline-2 rounded-xl text-center bg-blue-800/30 border border-blue-700/50'>
                                <h1>Post</h1>
                                <h3 className="text-2xl font-bold mb-3 text-white">{postDataOne?.postTitle}</h3>
                                <p className="text-base text-slate-300 font-normal">{postDataOne?.postBody}</p>
                                
                                {/* Optional: Add metadata fields if you want to show them */}
                                <div className="mt-4 pt-3 border-t border-blue-700/30 text-xs text-slate-400 font-normal flex justify-between">
                                    <span>Likes: {postDataOne?.postLikes}</span>
                                    <span>Created: {new Date(postDataOne?.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="w-full py-2.5 mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition duration-200"
                            >
                                Delete Permanently
                            </button>
                            </form>
                        ) : (
                            <div className="text-center text-slate-400 font-normal">No post found</div>
                        )}
                    </div>
                    </>
                    
                )
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