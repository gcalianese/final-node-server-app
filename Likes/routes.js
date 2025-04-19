import * as dao from './dao.js';
import { v4 as uuidv4 } from 'uuid';

export default function LikeRoutes(app) {

    // Return all the likes for the post with the given pid
    app.get("/api/likes/:pid", async (req, res) => {
        const { pid } = req.params;
        const likes = await dao.getLikesForPost(pid);
        res.json(likes);
    });

    // // Return all the likes for all the given pids
    // app.get("/api/likes", async (req, res) => {
    //     const like  = req.body;
    //     const likes = await dao.getLikesForPosts(like);
    //     res.json(likes);
    // });

    // Return all likes
    app.get("/api/likes", async (req, res) => {
        const likes = await dao.getAllLikes();
        res.json(likes);
    });

    // Like a post
    app.post("/api/likes", async (req, res) => {
        const { pid } = req.params;
        const like = req.body;
        const newLike = await dao.likePost(like);
        res.json(newLike);
    });

    // Unlike the post with the given pid from the user with the given uid
    app.delete("/api/likes/:pid/:uid", async (req, res) => {
        const { pid, uid } = req.params;
        const deletedLike = await dao.unlikePost(pid, uid);
        res.sendStatus(200);
    });
}