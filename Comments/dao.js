import model from "./model.js"

// Return all comments for the post with the given pid
export async function getAllCommentsForPost(pid) {
    const comments = await model.find({ postId: pid }).lean().populate('postedBy');
    return comments;
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