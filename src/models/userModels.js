import mongoose from "mongoose";

const userSchema=mongoose.Schema({
    userName: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String ,
        required:true,
        unique: true
    },
    isVerified:{
        type: Boolean,
        default: false
    },
    userRole:{
        type: string,
        default: 'standard'
    },

    forgotPasswordToken:String,
    forgotPasswordTokenExpiry:Date,
    verifyToken:String,
    verifyTokenExpiry:Date

})

const User= mongoose.models.user || mongoose.model("users", userSchema)

export default User
