import express from "express";
import upload from "../middleware/multerConfig.js";
import { commentPost, createPost, getPosts, getSinglePost, likePost } from "../Controller/Blogpost/Post.js";

const BlogRouter = express.Router();

BlogRouter.post("/createblog", upload.single("image"), createPost);
BlogRouter.get("/getallposts", getPosts);
BlogRouter.get("/singleblog/:id", getSinglePost);
BlogRouter.post("/posts/like/:id", likePost);
BlogRouter.post("/posts/comment/:id", commentPost);

export default BlogRouter;
