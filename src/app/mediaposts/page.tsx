'use client'
import {useState, useEffect} from 'react'
import axios from 'axios'
import {useRouter} from 'next/navigation'
import { Area, AreaChart, CartesianGrid, Tooltip, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast'


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
            title: formData.get('title').trim(),
            body: formData.get('body').trim()
        }
        const response=await axios.post('/api/users/mediaposts', data)
        if(response.data.status===200){
                    toast.success(response.data.toastMessage)
                }
                else{
                    toast.error(response.data.toastMessage)
                }
        setCurrentView("")
        console.log(response)
    }

    const viewAll=async(isDeleted:string)=>{
        setPostData([])
        const temp=await axios.get('/api/users/mediaposts?deleted='+isDeleted)
        setPostData(temp.data.posts)
        if(temp.data.status===200){
            toast.success(temp.data.toastMessage)
        }
        else{
            toast.error(temp.data.toastMessage)
        }
        // return 
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const searchPost=async(formData: any)=>{
        const searchTitle=formData.get('title').trim()
        let temp
        if(currentView==='restorePost'){
            temp=await axios.get('/api/users/mediaposts/'+encodeURIComponent(searchTitle)+'?deleted=true')
        }
        else{
            temp=await axios.get('/api/users/mediaposts/'+encodeURIComponent(searchTitle)+'?deleted=false')
        }
        setPostDataOne(temp.data.post)
        if(temp.data.status===200){
            toast.success(temp.data.toastMessage)
        }
        else{
            toast.error(temp.data.toastMessage)
        }
        
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
        const response= await axios.patch('/api/users/mediaposts/'+encodeURIComponent(oldTitle), data)
        if(response.data.status===200){
            toast.success(response.data.toastMessage)
        }
        else{
            toast.error(response.data.toastMessage)
        }
        
        // Reset view or clean up
        setCurrentView("")
        setPostDataOne(null)
    }

    const deletePost=async()=>{
        const oldTitle = postDataOne?.postTitle 
        const response= await axios.post('/api/users/mediaposts/'+encodeURIComponent(oldTitle)+'deleted=false')
        if(response.data.status===200){
            toast.success(response.data.toastMessage)
        }
        else{
            toast.error(response.data.toastMessage)
        }
    }

    const restorePost=async()=>{
        const oldTitle = postDataOne?.postTitle 
        const response= await axios.post('/api/users/mediaposts/'+encodeURIComponent(oldTitle)+'deleted=true')
        if(response.data.status===200){
            toast.success(response.data.toastMessage)
        }
        else{
            toast.error(response.data.toastMessage)
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [chartGraphData, setChartGraphData] = useState<any[]>([])

    const getGraphData=async()=>{
        // const data=await axios.get('/api/users/dashboard')|| []
        // console.log(`data: ${data}`)
        // return data.data

        const response = await axios.get('/api/users/dashboard')
        if (response.data && response.data['data']) {
            setChartGraphData(response.data['data']);
        if(response.data.status===200){
            toast.success(response.data.toastMessage)
        }
        else{
            toast.error(response.data.toastMessage)
        }
    }}

    useEffect(function() {
        getGraphData();
    }, []);


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
                

            case 'dashboard':
                return (
                    <div className="w-full">
                        <h1 className="text-xl font-bold mb-4 text-center">Simple Area Chart</h1>
                        <div className="w-full h-[400px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart
                                    data={chartGraphData}
                                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                                >
                                    <defs>
                                        <linearGradient id="colorCreated" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#34d399" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorUpdated" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#df4141" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#df4141" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorDeleted" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#eaec49" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#eaec49" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                                    <XAxis dataKey="name" stroke="#cbd5e1" />
                                    <YAxis stroke="#cbd5e1" />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                                        labelStyle={{ color: '#f1f5f9' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="created"
                                        stroke="#34d399"
                                        fillOpacity={1}
                                        fill="url(#colorCreated)"
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="updated"
                                        stroke="#df4141"
                                        fillOpacity={1}
                                        fill="url(#colorUpdated)"
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="deleted"
                                        stroke="#eaec49"
                                        fillOpacity={1}
                                        fill="url(#colorDeleted)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                );

            case 'viewArchivedPosts':
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

            case 'restorePost':
                return (
                    <>
                    <header>
                        <form action={searchPost} className="flex flex-col space-y-5 justify-center items-center" >
                            <h1>Restore a Post</h1>
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
                            <form action={restorePost}>
                            <div key={postDataOne?._id} className='p-6 min-w-[300px] max-w-md outline-2 rounded-xl text-center bg-blue-800/30 border border-blue-700/50'>
                                <h1>Post</h1>
                                <h3 className="text-2xl font-bold mb-3 text-white">{postDataOne?.postTitle}</h3>
                                <p className="text-base text-slate-300 font-normal">{postDataOne?.postBody}</p>
                                
                                {/* Optional: Add metadata fields if you want to show them */}
                                <div className="mt-4 pt-3 border-t border-blue-700/30 text-xs text-slate-400 font-normal flex justify-between">
                                    <span>Likes: {postDataOne?.postLikes}</span>
                                    <span>Created: {new Date(postDataOne?.createdAt).toLocaleDateString()}</span>
                                    <span>Deleted: {new Date(postDataOne?.deletedDate).toLocaleDateString()}</span>
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="w-full py-2.5 mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition duration-200"
                            >
                                Restore Post
                            </button>
                            </form>
                        ) : (
                            <div className="text-center text-slate-400 font-normal">No post found</div>
                        )}
                    </div>
                    </>
                    
                )
            
            default:
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
                );
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
                <div className='size-8 grow p-1 outline-2 rounded-xl mx-2 my-2 text-center bg-blue-800/30 hover:bg-blue-800/75' onClick={function(){getGraphData();setCurrentView('dashboard'); }}>Analytic Dashboard</div>
                <div className='size-8 grow p-1 outline-2 rounded-xl mx-2 my-2 text-center bg-blue-800/30 hover:bg-blue-800/75' onClick={function(){setCurrentView('addPost'); }}>Add Post</div>
                <div className='size-8 grow p-1 outline-2 rounded-xl  mx-2 my-2 text-center bg-blue-800/30 hover:bg-blue-800/75' onClick={function(){setCurrentView('viewOne'); }}>View One Post</div>
                <div className='size-8 grow p-1 outline-2 rounded-xl  mx-2 my-2 text-center bg-blue-800/30 hover:bg-blue-800/75' onClick={function(){setCurrentView('viewAll'); viewAll('false')}}>View All Posts</div>
                <div className='size-8 grow p-1 outline-2 rounded-xl  mx-2 my-2 text-center bg-blue-800/30 hover:bg-blue-800/75' onClick={function(){setCurrentView('updatePost');}}>Update Post</div>
                <div className='size-8 grow p-1 outline-2 rounded-xl  mx-2 my-2 text-center bg-blue-800/30 hover:bg-blue-800/75' onClick={function(){setCurrentView('deletePost');}}>Delete Post</div>
                <div className='size-9 grow p-1 outline-2 rounded-xl  mx-2 my-2 text-center bg-blue-800/30 hover:bg-blue-800/75' onClick={function(){setCurrentView('viewArchivedPosts'); viewAll('true')}}>View Archived Posts</div>
                <div className='size-8 grow p-1 outline-2 rounded-xl  mx-2 my-2 text-center bg-blue-800/30 hover:bg-blue-800/75' onClick={function(){setCurrentView('deletePost');}}>Restore Post</div>

            </header>

            <header className="w-full flex justify-center">
                <div className='flex h-auto w-full max-w-5xl p-4 outline-2 bg-blue-300/30 rounded-xl mx-4 my-8 items-center justify-center'>
                    <div className='w-full flex items-center justify-center p-4 text-white'>
                        {stateJSX()}
                    </div>
                    
                </div>
                
            </header>
        </div>
    )
}

export default Page