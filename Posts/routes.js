import multer from 'multer';
import * as dao from './dao.js';
import * as followsDao from '../Follows/dao.js';
import { v4 as uuidv4 } from 'uuid';

export default function PostRoutes(app) {

    // Return all posts in the given category
    app.get("/api/posts/:cat", async (req, res) => {
        const { cat } = req.params;
        const posts = await dao.getAllPostsWithCat(cat);
        res.json(posts);
    });

    // get the posts posted by the user with the given uid
    app.get("/api/posts/by/:uid", async (req, res) => {
        const { uid } = req.params;
        const posts = await dao.getAllPostsByUser(uid);
        res.json(posts);
    });

    // Return posts marked with the given category for users the user with the given uid follows first of the given category
    app.get("/api/posts/:cat/:uid", async (req, res) => {
        const { cat, uid } = req.params;
        const followedUsers = await followsDao.getUsersFollowedBy(uid);
        const followedUserIds = followedUsers.map(user => user._id);
        const followedPosts = await dao.getPostsByUsers(cat, followedUserIds);

        const nonFollowerUsers = await followsDao.getUsersNotFollowedBy(uid);
        const nonFollowedUserIds = nonFollowerUsers.map(user => user._id);
        const nonFollowedPosts = await dao.getPostsByUsers(cat, nonFollowedUserIds);

        const posts = followedPosts.concat(nonFollowedPosts);
        res.json(posts);
    });

    // Multer setup
    const storage = multer.memoryStorage();
    const upload = multer({ storage });

    // delete the post with the given pid
    app.delete("/api/posts/:pid", async (req, res) => {
        const { pid } = req.params;
        const status = await dao.deletePost(pid);
        res.sendStatus(status);
    });

    // upload a post with the image embedded
    app.post("/api/posts", upload.single("image"), async (req, res) => {
        try {
            const post = JSON.parse(req.body.post);
            const file = req.file;

            if (!file) {
                return res.status(400).json({ error: "Image upload failed, please try again." });
            }

            const imageBuffer = file.buffer;
            const contentType = file.mimetype;

            const newPost = {
                ...post,
                _id: uuidv4(),
                img: {
                    data: imageBuffer,
                    contentType: contentType,
                },
            };

            const savedPost = await dao.uploadImage(newPost);
            res.status(201).json(savedPost);
        } catch (err) {
            res.status(500).json({ error: "Upload failed", details: err.message });
        }
    });
}