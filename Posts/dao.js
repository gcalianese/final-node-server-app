import model from "./model.js"

// Return all posts marked with the given category
export async function getAllPostsWithCat(cat, currentUser) {

    const posts = await model.find({ category: cat }).sort({ createdAt: -1 }).populate('postedBy');
    const postsWithImg = posts.map(post => {
        const buffer = Buffer.from(post.img.data.buffer);
        const imgBase64 = `data:${post.img.contentType};base64,${buffer.toString("base64")}`;

        return {
            ...post.toObject(),
            img: imgBase64,
        };
    });

    // If a user is logged in, don't show their own posts in their feed
    if (currentUser) {
        return postsWithImg.filter(post => post.postedBy._id !== currentUser._id)
    } else {
        return postsWithImg;
    }
}

// Return posts marked with the given category for the users with the given ids
export async function getPostsByUsers(cat, userIds) {
    const posts = await model.find({ category: cat, postedBy: { $in: userIds } }).sort({ createdAt: -1 }).populate('postedBy');
    const postsWithImg = posts.map(post => {
        const buffer = Buffer.from(post.img.data.buffer);
        const imgBase64 = `data:${post.img.contentType};base64,${buffer.toString("base64")}`;

        return {
            ...post.toObject(),
            img: imgBase64,
        };
    });

    return postsWithImg;
}

// insert a post to the database
export async function uploadImage(newPost) {
    const savedPost = await model.create(newPost);
    return savedPost;
}

// delete the post with the given pid from the database any associated picture
export async function deletePost(pid) {
    const post = await model.findOne({ _id: pid });
    await model.deleteOne({ _id: pid });
    return 204;
}

// get all posts by the user with the given id
export async function getAllPostsByUser(uid) {
    const posts = await model.find({ postedBy: uid }).sort({ createdAt: -1 }).populate('postedBy');
    const postsWithImg = posts.map(post => {
        const buffer = Buffer.from(post.img.data.buffer);
        const imgBase64 = `data:${post.img.contentType};base64,${buffer.toString("base64")}`;

        return {
            ...post.toObject(),
            img: imgBase64,
        };
    });

    return postsWithImg;
}

// get the post with the given pid
export async function getPost(pid) {
    const post = await model.findById(pid).populate('postedBy');
    const buffer = Buffer.from(post.img.data.buffer);

    const imgBase64 = `data:${post.img.contentType};base64,${buffer.toString("base64")}`;

    const postWithImg = {
        ...post.toObject(),
        img: imgBase64,
    };

    return postWithImg;
}

//update a post, ie its caption
export function updatePost(pid, cap) {
    return model.updateOne({ _id: pid }, { caption: cap });
}