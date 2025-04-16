import "dotenv/config";
import express from 'express';
import mongoose from "mongoose";
import cors from "cors";
import session from "express-session";
import "dotenv/config";
import UserRoutes from "./Users/routes.js";
import FollowRoutes from "./Follows/routes.js";

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
UserRoutes(app);
FollowRoutes(app);

app.listen(process.env.PORT || 4000)