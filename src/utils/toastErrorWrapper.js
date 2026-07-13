import {toast} from 'react-hot-toast'

const toastResponse= async(text)=>{
    toast.error(text)
}

export default toastResponse;