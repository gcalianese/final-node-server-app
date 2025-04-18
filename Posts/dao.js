import model from "./model.js"
import userModel from "../Users/model.js"
import fs from "fs/promises";
import path from "path";

// Return all posts marked with the given category
export async function getAllPostsWithCat(cat) {
    const posts = await model.find({ category: cat });
    const postsWithUsernames = await getUsernamesForPosts(posts);
    return postsWithUsernames;
}

// Return the given list of SENDS posts with the usernames embedded
export async function getUsernamesForPosts(posts) {
    const postsWithUsernames = await Promise.all(posts.map(async (post) => {
        const user = await userModel.findOne({ _id: post.postedBy });
        const username = user.username;
        const postWithUsername = { ...post.toObject(), username: username };
        return postWithUsername;
    }));
    return postsWithUsernames;
}

// Return posts marked with the given category for the users with the given ids
export async function getPostsByUsers(cat, userIds) {
    const posts = await model.find({ category: cat, postedBy: { $in: userIds } });
    const postsWithUsernames = await getUsernamesForPosts(posts);
    return postsWithUsernames;
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
export async function getAllPostsByUser(uid) {
    const posts = await model.find({ postedBy: uid});
    return posts;
}

