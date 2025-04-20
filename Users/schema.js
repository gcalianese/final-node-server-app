import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    _id: String,
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: String,
    email: String,
    phoneNumber: String,
    lastName: String,
    role: {
        type: String,
        enum: [
            "ADMIN",
            "MOD",
            "USER"],
        default: "USER"
        ,
    },
    homeGym: String,
    favoritedGyms: [String],
},
    { collection: "users" }
);
export default userSchema;