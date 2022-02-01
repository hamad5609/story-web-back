import express from "express";
import { getPost, addPost, updatePost, deletePost, likePost, getPostBySearch } from '../controller/post.js';
import auth from "../middleware/auth.js";

const router = express.Router();

router.get('/', getPost);
router.get('/post/search', getPostBySearch);
router.post('/post', auth, addPost);
router.patch('/post/:id', auth, updatePost);
router.delete('/post/:id', auth, deletePost);
router.patch('/post/:id/like', auth, likePost);

export default router;