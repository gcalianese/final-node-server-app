import * as dao from "./dao.js";

export default function FollowRoutes(app) {

    // getFollowers
    app.get("/api/users/followers/:cid", async (req, res) => {
        const { cid } = req.params;
        const status = await dao.getFollowers(cid);
        res.send(status);
    });
}