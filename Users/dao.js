import model from "./model.js"

// Return all users
export function getAllUsers() {
    return model.find();
}

// Create a new user
export function createUser(newUser) {
    return model.create(newUser);
}

// Find a user with the given credentials to sign in
export function findUserByCredentials(username, password) {
    return model.findOne({ username, password });
}

// Find a user with the given
export function findUserById(cid) {
    return model.findById(cid);
}