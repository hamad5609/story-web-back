import mongoose from "mongoose";
import PostMessage from "../models/postMessage.js";

export const getPost = async (req, res) => {
    try {
        const postData = await PostMessage.find();
        res.status(200).json(postData);
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