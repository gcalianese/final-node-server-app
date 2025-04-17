import model from "./model.js"
import * as userDao from "../Users/dao.js"

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

// Return the users not followed by the user with the given cid
export async function getUsersNotFollowedBy(cid) {
    const followedUsers = await getUsersFollowedBy(cid);
    const followedUserIds = followedUsers.map(user => user._id);
    const allUsers = await userDao.getAllUsers();
    const nonFollowedUsers = allUsers.filter(user => !followedUserIds.includes(user._id));
    return nonFollowedUsers;
}