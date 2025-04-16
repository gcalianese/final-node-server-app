import * as dao from "./dao.js";

export default function UserRoutes(app) {

    // Return all users
    app.get("/api/users", async (req, res) => {
        const status = await dao.getAllUsers();
        res.send(status);
    });

    // Find a user with the given credentials to sign in
    app.post("/api/users/signin", async (req, res) => {
        const { username, password } = req.body;
        const currentUser = await dao.findUserByCredentials(username, password);
        if (currentUser) {
            req.session["currentUser"] = currentUser;
            res.json(currentUser);
        } else {
            res.status(401).json({ message: "Unable to login. Try again later." });
        }
    });

    // Sign out the current user
    app.post("/api/users/signout", (req, res) => {
        req.session.destroy();
        res.sendStatus(200);
    });


    // Get the profile for the user with the given cid
    app.get("/api/users/:cid", async (req, res) => {
        const { cid } = req.params;
        const user = await dao.findUserById(cid)
        res.json(user);
    });

    // Get the profile for the session
    app.post("/api/users/profile", (req, res) => {
        const currentUser = req.session["currentUser"];
        if (!currentUser) {
            res.sendStatus(401);
            return;
        }
        res.json(currentUser);
    });

    // Get the profile for the current user of the session
    app.post("/api/users/profile", (req, res) => {
        const currentUser = req.session["currentUser"];
        if (!currentUser) {
            res.sendStatus(401);
            return;
        }
        res.json(currentUser);
    });
};