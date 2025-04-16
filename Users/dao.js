import model from "./model.js"

// Return all users
export function getAllUsers() {
    return model.find();
}

// Find a user with the given credentials to sign in
export function findUserByCredentials(username, password) {
    return model.findOne({ username, password });
}

// Find a user with the given cid
export function findUserById(cid) {
    return model.findById(cid);
}