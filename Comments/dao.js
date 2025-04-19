import model from "./model.js"
import userModel from "../Users/model.js"

// Return the given list of posts with the usernames embedded
export async function getUsernamesForComments(comments) {
    const commentsWithUsernames = await Promise.all(comments.map(async (comment) => {
        const user = await userModel.findOne({ _id: comment.postedBy });
        const username = user.username;
        const commentWithUsername = { ...comment, username };
        return commentWithUsername;
    }));

    return commentsWithUsernames;
}

// Return all comments for the post with the given pid
export async function getAllCommentsForPost(pid) {
    const comments = await model.find({ postId: pid }).sort({ createdAt: -1 }).lean();
    const commentsWithUsernames = await getUsernamesForComments(comments);
    return commentsWithUsernames;
}

// Create a new comment
export async function createCommentForPost(comment) {
    const newComment = await model.create(comment);
    return newComment;
}

// Delete a comment
export async function deleteComment(cid) {
    const status = await model.deleteOne({ _id: cid });
    return status;
}

// Update a comment
export function updateComment(updates) {
    return model.updateOne({ _id: updates._id }, { $set: updates });
}