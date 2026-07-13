'use client'
import { useState, ReactNode } from 'react'
import DataContext from './DataContext'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function DataContextProvider({children }: { children: ReactNode }){
    const [currentView, setCurrentView] = useState("addPost")
    const [postDataOne, setPostDataOne] = useState(null)
    const [postData, setPostData] = useState(null)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [chartGraphData, setChartGraphData] = useState<any[]>([])

    return (
        <DataContext.Provider value={{currentView, setCurrentView, postDataOne, setPostDataOne, postData, setPostData, setChartGraphData, chartGraphData}}>
            {children }
        </DataContext.Provider>
    )
}
