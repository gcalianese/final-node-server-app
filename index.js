import "dotenv/config";
import express from 'express';
import mongoose from "mongoose";
import cors from "cors";
import session from "express-session";
import "dotenv/config";
import UserRoutes from "./Users/routes.js";
import FollowRoutes from "./Follows/routes.js";
import PostRoutes from "./Posts/routes.js";
import multer from "multer";
import SearchRoutes from "./Search/routes.js";

const app = express()
app.use(
  cors({
    credentials: true,
    origin: process.env.NETLIFY_URL || "http://localhost:5173",
  })
);
const sessionOptions = {
  secret: process.env.SESSION_SECRET || "kambaz",
  resave: false,
  saveUninitialized: false,
};
if (process.env.NODE_ENV !== "development") {
  sessionOptions.proxy = true;
  sessionOptions.cookie = {
    sameSite: "none",
    secure: true,
    domain: process.env.NODE_SERVER_DOMAIN,
  };
}
app.use(session(sessionOptions));
const CONNECTION_STRING = process.env.MONGO_CONNECTION_STRING || "mongodb://127.0.0.1:27017/FinalProject"
mongoose.connect(CONNECTION_STRING);
app.use(express.json());
app.use("/uploads", express.static("uploads"));
UserRoutes(app);
FollowRoutes(app);
PostRoutes(app);
SearchRoutes(app);

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

app.listen(process.env.PORT || 4000)