import model from "./model.js"
import userModel from "../Users/model.js"

// Return all posts marked with the given category
export async function getAllPostsWithCat(cat) {
    const posts = await model.find({ category: cat }).sort({ createdAt: -1 });
    const postsWithUsernames = await getUsernamesForPosts(posts);
    return postsWithUsernames;
}

// Return the given list of posts with the usernames embedded
export async function getUsernamesForPosts(posts) {
    const postsWithUsernames = await Promise.all(posts.map(async (post) => {
        const user = await userModel.findOne({ _id: post.postedBy });
        const username = user.username;

        let imgBase64 = null;
        if (post.img && post.img.data) {
            imgBase64 = `data:${post.img.contentType};base64,${post.img.data.toString("base64")}`;
        }

        return {
            ...post.toObject(),
            username,
            img: imgBase64,
        };
    }));

    return postsWithUsernames;
}

// Return posts marked with the given category for the users with the given ids
export async function getPostsByUsers(cat, userIds) {
    const posts = await model.find({ category: cat, postedBy: { $in: userIds } }).sort({ createdAt: -1 });
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
    await model.deleteOne({ _id: pid });
    return 204;
}

// get all posts by the user with the given id
export async function getAllPostsByUser(uid) {
    const posts = await model.find({ postedBy: uid }).sort({ createdAt: -1 });
    const postsWithUsername = await getUsernamesForPosts(posts);
    return postsWithUsername;
}

// get the post with the given pid
export async function getPost(pid) {
    const post = await model.findById(pid);
    const postsWithUsername = await getUsernamesForPosts([post]);
    const postWithUsername = postsWithUsername[0];
    return postWithUsername;
}

//update a post, ie its caption
export function updatePost(pid, cap) {
    return model.updateOne({ _id: pid }, { caption: cap });
}