import mongoose from "mongoose";
import express from "express";
export const Postsrouter = express.Router();
const postSchema = new mongoose.Schema({
	title: String,
	content: String,
});

const Post = mongoose.model("Post", postSchema);

export default Post;
