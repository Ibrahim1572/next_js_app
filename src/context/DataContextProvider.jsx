import react from 'react'
import DataContext from '../context/DataContext'

export default function DataContextProvider({children }){
    const [currentView, setCurrentView] = react.useState(null)
    const [postDataOne, setPostDataOne] = react.useState(null)
    const [postData, setPostData] = react.useState(null)

    return (
        <DataContext.Provider value={{currentView, setCurrentView, postDataOne, setPostDataOne, postData, setPostData}}>
            {children }
        </DataContext.Provider>
    )
}
