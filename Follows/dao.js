import model from "./model.js"

// Return all users who follow the user with the given cid
export async function getUsersFollowing(cid) {
    const followers = await model.find({ followed: cid }).populate('follower');
    return followers.map(doc => doc.follower);
}

// Return all users the user with the given cid follows
export async function getUsersFollowedBy(cid) {
    const follows = await model.find({ follower: cid }).populate('followed');
    return follows.map(doc => doc.followed);
}