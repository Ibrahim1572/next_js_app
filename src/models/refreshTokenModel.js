import mongoose from 'mongoose'

const refreshTokenSchema = mongoose.Schema({
    userId:{
        required: true,
        type: stirng
    },
    isValid:{
        requred: true,
        default: true,
        type: Boolean,

    },
    createdAt:{
        required: true,
        type: Date
    },
    updatedAt:{
        required: true,
        type: Date
    }

})

const RefreshTokenSchema= mongoose.models.refreshTokenSchema || mongoose.model("refreshTokens", refreshTokenSchema)

export default RefreshTokenSchema