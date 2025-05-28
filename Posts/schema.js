import mongoose from "mongoose";
const postSchema = new mongoose.Schema({
    _id: String,
    postedBy: { type: String, ref: "UserModel" },
    category: {
        type: String,
        enum: [
            "SENDS",
            "GEAR",
            "FT"],
    },
    img: {
        data: Buffer,
        contentType: String,
    },
    caption: String,
},
    { collection: "posts", timestamps: true }
);
export default postSchema;