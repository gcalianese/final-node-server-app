import mongoose from "mongoose";
const commentSchema = new mongoose.Schema({
    _id: String,
    postedBy: String,
    username: String,
    comment: String,
    postId: { type: String, ref: "PostModel" },
},
    { collection: "comments", timestamps: true }
);
export default commentSchema;