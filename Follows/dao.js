import model from "./model.js"
import userModel from "../Users/model.js"

// Return all users who follow the user with the given cid
export async function getFollowers(cid) {
    const followerDocs = await model.find({followed : cid});
    const followerIds = followerDocs.map(f => f.follower);
    const followerUsers = await userModel.find({ _id: { $in: followerIds } });
    return followerUsers;
}