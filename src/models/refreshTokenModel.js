import mongoose from 'mongoose'

const refreshTokenSchema = mongoose.Schema({
    userEmail:{
        required: true,
        type: Stirng
    },

    isValid:{
        requred: true,
        default: true,
        type: Boolean
    },

    token:{
        required: true,
        type: String
    },

    createdAt:{
        required: true,
        type: Date
    },

    updatedAt:{
        required: true,
        type: Date
    }, 
    
    expiresAt:{
        requred: true,
        type: Date
    }

})

const RefreshToken = mongoose.models.refreshTokenSchema || mongoose.model("refreshTokens", refreshTokenSchema)

export default RefreshToken