import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    _id: String,
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: String,
    email: String,
    phoneNumber: String,
    lastName: String,
    dob: Date,
    role: {
        type: String,
        enum: [
            "ADMIN",
            "USER"],
        default: "USER"
        ,
    },
    homeGym: String,
    postCount: String
},
    { collection: "users" }
);
export default userSchema;