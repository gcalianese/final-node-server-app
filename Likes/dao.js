import model from "./model.js"

//Get all likes
export async function getAllLikes() {
    const likes = await model.find();
    return likes;
}

// Return a newly created like
export async function likePost(like) {
    const newLike = await model.create(like);
    return newLike;
}

// Delete a like with uid and pid
export async function unlikePost(pid, uid) {
    const status = await model.deleteOne({ likedBy: uid, postId: pid });
    return status;
}

//Get the likes for the post with the given pid
export async function getLikesForPost(pid) {
    const likes = await model.find({ postId: pid });
    return likes;
}

//Get like for all posts with the given pids
export async function getLikesForPosts(pids) {
    const likes = await model.find({ postId: { $in: pids } });
    return likes;
}
