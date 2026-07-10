'use client'
import {useState, useEffect, useContext} from 'react'
import axios from 'axios'
import {useRouter} from 'next/navigation'
import DataContextProvider from '@/context/DataContextProvider';
import DataContext from '@/context/DataContext';

import AddPost from './components/addPost'
import Dashboard from './components/dashboard'
import DeletePost from './components/deletePost'
import RestorePost from './components/restorePost'
import UpdatePost from './components/updatePost'
import ViewAllPosts from './components/viewAll'
import ViewOnePost from './components/viewOne'  
import ViewArchivedPosts from './components/viewArchivedPosts'



function Page(){

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const {currentView} = useContext(DataContext) as any 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const {setCurrentView} = useContext(DataContext) as any 
    

    const [isAdmin, setIsAdmin]= useState(false)
    async function getAdminCheckData() {
        try {
            // const response = await axios.post('/api/users/profile')
            const userType = (await axios.post('/api/users/profile')).data['User Data'].userType || "Standard User"
            
            console.log(`response: ${userType}`)
            
            
            if (userType === 'Admin') {
                setIsAdmin(true)
            } else {
                setIsAdmin(false)
            }
        } catch (error) {
            console.error("Failed to check admin status:", error)
            setIsAdmin(false)
        }
    }
    useEffect(function() {
        getAdminCheckData()
    }, [])
    
    
    const router=useRouter()
    
    const goToLogout= async()=>{
        router.push('/logout')
    }

    const goToProfile= async()=>{
        router.push('/profile')
    }


    const stateJSX=()=>{
        switch (currentView){

            case 'viewOne':
                return(<ViewOnePost/>)

            case 'viewAll':
                return (<ViewAllPosts/>)

            case 'updatePost':
                return (<UpdatePost/>)

            case 'deletePost':
                return (<DeletePost/>)

            case 'dashboard':
                return (<Dashboard/>)

            case 'viewArchivedPosts':
                return (<ViewArchivedPosts/>)

            case 'restorePost':
                return (<RestorePost/>)
            
            default:
                return (<AddPost/>)
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
                <div className='size-8 grow p-1 outline-2 rounded-xl mx-2 my-2 text-center bg-blue-800/30 hover:bg-blue-800/75' onClick={function(){setCurrentView('dashboard'); }}>Analytic Dashboard</div>
                <div className='size-8 grow p-1 outline-2 rounded-xl mx-2 my-2 text-center bg-blue-800/30 hover:bg-blue-800/75' onClick={function(){setCurrentView('addPost'); }}>Add Post</div>
                <div className='size-8 grow p-1 outline-2 rounded-xl  mx-2 my-2 text-center bg-blue-800/30 hover:bg-blue-800/75' onClick={function(){setCurrentView('viewOne'); }}>View One Post</div>
                <div className='size-8 grow p-1 outline-2 rounded-xl  mx-2 my-2 text-center bg-blue-800/30 hover:bg-blue-800/75' onClick={function(){setCurrentView('viewAll'); }}>View All Posts</div>
                <div className='size-8 grow p-1 outline-2 rounded-xl  mx-2 my-2 text-center bg-blue-800/30 hover:bg-blue-800/75' onClick={function(){setCurrentView('updatePost');}}>Update Post</div>
                <div className='size-8 grow p-1 outline-2 rounded-xl  mx-2 my-2 text-center bg-blue-800/30 hover:bg-blue-800/75' onClick={function(){setCurrentView('deletePost');}}>Delete Post</div>
                {isAdmin?(
                    <div className='size-9 grow p-1 outline-2 rounded-xl  mx-2 my-2 text-center bg-blue-800/30 hover:bg-blue-800/75' onClick={function(){setCurrentView('viewArchivedPosts'); }}>View Archived Posts</div>
                ):(<div></div>)}
                
                <div className='size-8 grow p-1 outline-2 rounded-xl  mx-2 my-2 text-center bg-blue-800/30 hover:bg-blue-800/75' onClick={function(){setCurrentView('restorePost');}}>Restore Post</div>

            </header>

            <header className="w-full flex justify-center">
                <div className='flex h-auto w-full max-w-5xl p-4 outline-2 bg-blue-300/30 rounded-xl mx-4 my-8 items-center justify-center'>
                    <div className='w-full flex items-center justify-center p-4 text-white'>
                        <DataContextProvider>
                            {stateJSX()}
                        </DataContextProvider>
                        
                    </div>
                    
                </div>
                
            </header>
        </div>
    )
}

export default Page