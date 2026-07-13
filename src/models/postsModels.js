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
    },
    isdeleted:{
        type: Boolean,
        default: false
    },
    deletedDate:{
        type: Date
    },
    updateLog:{
        type: [Date],
        default: []
    },
    restoreDate:{
        type: Date
    }
},
    {
        timestamps: true
    }

)

const Posts= mongoose.models.posts || mongoose.model("posts", postsSchema)

export default Posts
