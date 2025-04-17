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

    // Multer setup
    const storage = multer.diskStorage({
        destination: "uploads/", // Save files in 'uploads' folder
        filename: (req, file, cb) => {
            cb(null, Date.now() + "-" + file.originalname); // Unique filename
        },
    });
    const upload = multer({ storage });

    // Create post with image using model.create()
    app.post("/api/posts/sends", upload.single("image"), async (req, res) => {
        console.log("hit endpoint")
        try {
            const { caption, category, postedBy } = req.body;
            const img = req.file?.path; // Path to the uploaded file

            if (!img) {
                return res.status(400).json({ error: "Image upload failed, please try again." });
            }

            // Use model.create() to create and save the post in one step
            const savedPost = await model.create({_id: uuidv4(), caption: "default caption", category: "SENDS", postedBy: "123", img: img,});

            res.status(201).json(savedPost); // Respond with the saved post
        } catch (err) {
            res.status(500).json({ error: "Upload failed", details: err });
        }
    });
}