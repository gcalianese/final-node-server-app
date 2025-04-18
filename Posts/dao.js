import model from "./model.js"
import userModel from "../Users/model.js"
import fs from "fs/promises";
import path from "path";

// Return all posts marked SENDS
export async function getAllSends() {
    const sends = await model.find({ category: "SENDS" });
    const sendsWithUsernames = await getUsernamesForSends(sends);
    return sendsWithUsernames;
}

// Return the given list of SENDS posts with the usernames embedded
export async function getUsernamesForSends(sends) {
    const sendsWithUsernames = await Promise.all(sends.map(async (send) => {
        const user = await userModel.findOne({ _id: send.postedBy });
        const username = user.username;
        const sendWithUsername = { ...send.toObject(), username: username };
        return sendWithUsername;
    }));
    return sendsWithUsernames;
}

// Return posts marked SENDS for the users with the given ids
export async function getSendsByUsers(userIds) {
    const sends = await model.find({ category: "SENDS", postedBy: { $in: userIds } });
    const sendsWithUsernames = await getUsernamesForSends(sends);
    return sendsWithUsernames;
}

// insert a post to the database
export async function uploadImage(newPost) {
    const savedPost = await model.create(newPost);
    return savedPost;
}

// delete the post with the given pid from the database any associated picture
export async function deletePost(pid) {
    const post = await model.findOne({ _id: pid });
    if (post.img) {
        try {
            await fs.unlink(post.img);
        } catch (err) {
            console.warn("Image deletion failed:", err.message);
        }
    }
    await model.deleteOne({ _id: pid });
    return 204;
}

// get all posts by the user with the given id
export async function getPostsByUser(uid) {
    const posts = await model.find({ postedBy: uid});
    return posts;
}

