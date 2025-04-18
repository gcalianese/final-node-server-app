import mongoose from "mongoose";
const postSchema = new mongoose.Schema({
    _id: String,
    postedBy: String,
    username: { type: String, ref: "UserModel" },
    category: {
        type: String,
        enum: [
            "SENDS",
            "GYMS",
            "GEAR",
            "FT"],
    },
    img: {
        data: Buffer,
        contentType: String,
    },
    caption: String,
    likedBy: [{ type: String, ref: "UserModel" }],
},
    { collection: "posts", timestamps: true }
);
export default postSchema;