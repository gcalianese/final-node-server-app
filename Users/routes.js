import * as dao from "./dao.js";

export default function UserRoutes(app) {

    // Return all users
    app.get("/api/users", async (req, res) => {
        const status = await dao.getAllUsers();
        res.send(status);
    });

    // Create a new user, sign them in as "currentUser"
    app.post("/api/users", async (req, res) => {
        const newUser = await dao.createUser(req.body);
        req.session["currentUser"] = newUser;
        res.json(newUser);
    });

    // Update a user
    app.put("/api/users", async (req, res) => {
        const updatedUser = await dao.updateUser(req.body);
        res.json(updatedUser);
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


    // Get the profile for the user with the given uid
    app.get("/api/users/:uid", async (req, res) => {
        const { uid } = req.params;
        const user = await dao.findUserById(uid)
        res.json(user);
    });

    // delete the user with the given uid
    app.delete("/api/users/:uid", async (req, res) => {
        const { uid } = req.params;
        const status = await dao.deleteUser(uid)
        res.sendStatus(200);
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
};