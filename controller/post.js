import mongoose from "mongoose";
import PostMessage from "../models/postMessage.js";

export const getPost = async (req, res) => {
    const { page } = req.query;
    try {
        const Limit = 3;
        const startingIndex = (Number(page) - 1) * Limit;
        const total = await PostMessage.countDocuments({});
        const numberOfPages = Math.ceil(total / Limit);
        const postData = await PostMessage.find().sort({ _id: -1 }).limit(Limit).skip(startingIndex);
        res.status(200).json({ data: postData, currentPage: Number(page), numberOfPages: numberOfPages });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}
export const getPostBySearch = async (req, res) => {
    const { searchQuery, tags } = req.query;
    try {
        const title = new RegExp(searchQuery, 'i');
        const postData = await PostMessage.find({ $or: [{ title: title }, { tag: { $in: tags.split(',') } }] });
        res.json({ data: postData })
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const addPost = async (req, res) => {
    const body = req.body;
    const newPost = new PostMessage({ ...body, creator: req.userId, createdAt: new Date().toISOString() });
    try {
        const postData = await newPost.save();
        res.status(200).json(postData);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const updatePost = async (req, res) => {
    const { id: _id } = req.params;
    const post = req.body;
    if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('No Post with that id');
    const updatedPost = await PostMessage.findByIdAndUpdate(_id, post, { new: true });
    res.status(200).json(updatedPost);
}

export const deletePost = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No Post with that id');
    await PostMessage.findByIdAndRemove(id);
    res.json('Post delted Successfully');
}

export const likePost = async (req, res) => {
    const { id } = req.params;
    if (!req.userId) return res.json({ message: "Unauthorized" });
    const userId = req.userId;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No Post with that id');
    const post = await PostMessage.findById(id);

    const index = post.likes.findIndex((id) => id === String(userId));
    if (index === -1) {
        post.likes.push(userId);
    } else {
        post.likes = post.likes.filter((id) => id !== String(userId))
    }
    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new: true });
    res.json(updatedPost);
}