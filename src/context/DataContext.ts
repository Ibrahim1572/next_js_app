'use client'
import { createContext, Dispatch, SetStateAction } from 'react'

interface DataContextType {
    currentView: string
    setCurrentView: Dispatch<SetStateAction<string>>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    postDataOne: any
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setPostDataOne: Dispatch<SetStateAction<any>>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    postData: any
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setPostData: Dispatch<SetStateAction<any>>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    chartGraphData: any[]
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setChartGraphData: Dispatch<SetStateAction<any[]>>
}

const DataContext = createContext<DataContextType | null>(null)

export default DataContext