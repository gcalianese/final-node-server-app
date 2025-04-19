import model from "./model.js"

// Return all users
export function getAllUsers() {
    return model.find();
}

// Create a new user
export function createUser(newUser) {
    return model.create(newUser);
}

// Update a user
export function updateUser(user) {
    return model.updateOne({ _id: user._id }, { $set: user });
}

// Find a user with the given credentials to sign in
export function findUserByCredentials(username, password) {
    return model.findOne({ username, password });
}

// Find a user with the given
export function findUserById(uid) {
    return model.findById(uid);
}

// Delete user with the given uid
export function deleteUser(uid) {
    return model.deleteOne({ _id: uid});
}