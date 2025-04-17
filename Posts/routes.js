import * as dao from "./dao.js"
import * as followsDao from "../Follows/dao.js"

export default function PostRoutes(app) {

    // Return all SENDS posts
    app.get("/api/posts/sends", async (req, res) => {
        const sends = await dao.getAllSends();
        res.json(sends);
    });

    // Return posts marked SENDS for users the user with the given cid follows first
    app.get("/api/posts/sends/:cid", async (req, res) => {
        const { cid } = req.params;
        const followedUsers = await followsDao.getUsersFollowedBy(cid);
        const followedUserIds = followedUsers.map(user => user._id);
        const followedSends = await dao.getSendsByUsers(followedUserIds);

        const nonFollowerUsers = await followsDao.getUsersNotFollowedBy(cid);
        const nonFollowedUserIds = nonFollowerUsers.map(user => user._id);
        const nonFollowedSends = await dao.getSendsByUsers(nonFollowedUserIds);

        const sends = followedSends.concat(nonFollowedSends);
        res.json(sends);
    });

}
