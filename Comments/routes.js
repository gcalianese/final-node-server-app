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

}