import mongoose from "mongoose";

const postsSchema=mongoose.Schema({
    postTitle: {
        type: String,
        required: true,
        unique: true
    },
    postBody: {
        type: String,
        required: true
    },
    postedBy: {
        type: String ,
        required:true
    },
    postLikes:{
        type: Number,
        default: 0
    },
    postDisLikes:{
        type: Number,
        default: 0
    }
},
    {
        timestamps: true
    }

)

const Posts= mongoose.models.post || mongoose.model("posts", postsSchema)

export default Posts
