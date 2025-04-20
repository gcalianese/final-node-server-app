import model from "./model.js"
import * as userDao from "../Users/dao.js"

// Return all users who follow the user with the given uid
export async function getUsersFollowing(uid) {
    const followers = await model.find({ followed: uid }).populate('follower');
    return followers.map(doc => doc.follower);
}

// Return all users the user with the given uid follows
export async function getUsersFollowedBy(uid) {
    const follows = await model.find({ follower: uid }).populate('followed');
    return follows.map(doc => doc.followed);
}

// Return the users not followed by the user with the given uid
export async function getUsersNotFollowedBy(uid) {
    const followedUsers = await getUsersFollowedBy(uid);
    const followedUserIds = followedUsers.map(user => user._id);
    const allUsers = await userDao.getAllUsers();
    const nonFollowedUsers = allUsers.filter(user => !followedUserIds.includes(user._id));
    return nonFollowedUsers;
}

// Return all followings
export async function getAllFollowings() {
    const followings = await model.find();
    return followings;
}

// Add a following
export async function addFollowing(following) {
    const newFollow = await model.create(following);
    return newFollow;
}

// Delete a following
export async function deleteFollowing(fid, uid) {
    const status = await model.deleteOne({ followed: fid, follower: uid });
    return status;
}