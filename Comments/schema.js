import mongoose from "mongoose";
const commentSchema = new mongoose.Schema({
    _id: String,
    postedBy: { type: String, ref: "UserModel" },
    comment: String,
    postId: { type: String, ref: "PostModel" },
},
    { collection: "comments", timestamps: true }
);
export default commentSchema;