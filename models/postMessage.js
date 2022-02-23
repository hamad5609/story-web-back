import mongoose from 'mongoose';

const postSchema = mongoose.Schema({
    title: String,
    message: String,
    name: String,
    creator: String,
    tag: [String],
    selectedFile: String,
    likes: {
        type: [String],
        default: [],
    },
    comments: {
        type: [], default: [],
    },
    createdAt: {
        type: Date,
        default: new Date()
    }
})

const PostMessage = mongoose.model('PostMessage', postSchema);

export default PostMessage;