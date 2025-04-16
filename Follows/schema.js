import mongoose from "mongoose";
const followSchema = new mongoose.Schema({
    _id: String,
    follower: { type: String, ref: "UserModel" },
    followed: { type: String, ref: "UserModel" }
},
    { collection: "follows" }
);
export default followSchema;