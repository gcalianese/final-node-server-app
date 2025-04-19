import * as dao from './dao.js';
import { v4 as uuidv4 } from 'uuid';

export default function CommentRoutes(app) {

    // Return all comments for the given post id
    app.get("/api/comments/:pid", async (req, res) => {
        const { pid } = req.params;
        const comments = await dao.getAllCommentsForPost(pid);
        res.json(comments);
    });

    // Create a comment for a post
    app.post("/api/comments", async (req, res) => {
        const comment = req.body;
        const newComment = await dao.createCommentForPost(comment);
        res.json(newComment);
    });

    // update a comment
    app.put("/api/comments/update", async (req, res) => {
        const comment = req.body;
        const updatedComment = await dao.updateComment(comment);
        res.json(updatedComment);
    });

    // delete a comment
    app.delete("/api/comments/:cid", async (req, res) => {
        const { cid } = req.params;
        const status = await dao.deleteComment(cid);
        res.sendStatus(200);
    });

}