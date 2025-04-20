import * as dao from "./dao.js";

export default function FollowRoutes(app) {

    // Return all followings
    app.get("/api/users/follows/all", async (req, res) => {
        const followings = await dao.getAllFollowings();
        res.json(followings);
    });

    // Return all users that follow the user with the given uid
    app.get("/api/users/follows/:uid", async (req, res) => {
        const { uid } = req.params;
        const followings = await dao.getUsersFollowing(uid);
        res.json(followings);
    });

    // Return all users the user with the given uid follows
    app.get("/api/users/follows/by/:uid", async (req, res) => {
        const { uid } = req.params;
        const followings = await dao.getUsersFollowedBy(uid);
        res.json(followings);
    });

    // Add a following
    app.post("/api/users/follows", async (req, res) => {
        const following = req.body;
        const newFollowing = await dao.addFollowing(following);
        res.json(newFollowing);
    });

    // Remove a following, fid = the id of the user being unfollowed, uid = the id of the user doing the unfollowing
    app.delete("/api/users/follows/:fid/:uid", async (req, res) => {
        const { fid, uid } = req.params;
        const status = await dao.deleteFollowing(fid, uid);
        res.sendStatus(200);
    });
}