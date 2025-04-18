import multer from 'multer';
import * as dao from './dao.js';
import * as followsDao from '../Follows/dao.js';
import model from './model.js'; // Now importing as 'model'
import { v4 as uuidv4 } from 'uuid';

export default function PostRoutes(app) {

    // Return all SENDS posts
    app.get("/api/posts/sends", async (req, res) => {
        const sends = await dao.getAllSends();
        res.json(sends);
    });

    // Return posts marked SENDS for users the user with the given uid follows first
    app.get("/api/posts/sends/:uid", async (req, res) => {
        const { uid } = req.params;
        const followedUsers = await followsDao.getUsersFollowedBy(uid);
        const followedUserIds = followedUsers.map(user => user._id);
        const followedSends = await dao.getSendsByUsers(followedUserIds);

        const nonFollowerUsers = await followsDao.getUsersNotFollowedBy(uid);
        const nonFollowedUserIds = nonFollowerUsers.map(user => user._id);
        const nonFollowedSends = await dao.getSendsByUsers(nonFollowedUserIds);

        const sends = followedSends.concat(nonFollowedSends);
        res.json(sends);
    });

    // Multer setup
    const storage = multer.diskStorage({
        destination: "uploads/", // Save files in 'uploads' folder
        filename: (req, file, cb) => {
            cb(null, Date.now() + "-" + file.originalname); // Unique filename
        },
    });
    const upload = multer({ storage });

    // Add a post to the database, save the image to uploads folder
    app.post("/api/posts/sends", upload.single("image"), async (req, res) => {
        try {
            const post = JSON.parse(req.body.post);
            const img = req.file?.path; // Path to the uploaded file

            if (!img) {
                return res.status(400).json({ error: "Image upload failed, please try again." });
            }
            const newPost = {...post, _id: uuidv4(), img: img};
            const savedPost = await dao.uploadImage(newPost);
            res.status(201).json(savedPost);
        } catch (err) {
            res.status(500).json({ error: "Upload failed", details: err });
        }
    });

    // delete the post with the given pid
    app.delete("/api/posts/:pid", async (req, res) => {
        const { pid } = req.params;
        const status = await dao.deletePost(pid);
        res.sendStatus(status);
     });
}