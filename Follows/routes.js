import * as dao from "./dao.js";

export default function FollowRoutes(app) {

    // Return all users that follow the user with the given cid
    app.get("/api/users/followers/:cid", async (req, res) => {
        const { cid } = req.params;
        const status = await dao.getUsersFollowing(cid);
        res.send(status);
    });

    // Return all users the user with the given cid follows
    app.get("/api/users/follows/:cid", async (req, res) => {
        const { cid } = req.params;
        const status = await dao.getUsersFollowedBy(cid);
        res.send(status);
    });
}