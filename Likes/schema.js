import mongoose from "mongoose";
const likeSchema = new mongoose.Schema({
    _id: String,
    likedBy: String,
    postId: { type: String, ref: "PostModel" },
},
    { collection: "likes" }
);
export default likeSchema;