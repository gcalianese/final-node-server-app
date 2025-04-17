import model from "./model.js"
import userModel from "../Users/model.js"

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

// Return posts marked SENDS for users the user with the given cid follows first
export function getSendsForUser(cid) {
    return model.find({ category: "SENDS" });
}