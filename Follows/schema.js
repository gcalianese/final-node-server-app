import mongoose from "mongoose";
const followSchema = new mongoose.Schema({
    _id: String,
    follower: String,
    followed: String,
},
    { collection: "follows" }
);
export default followSchema;