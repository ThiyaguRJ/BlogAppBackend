import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    user: { type: String, required: true },  
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  },
  { _id: false }
);

const postSchema = new mongoose.Schema(
  {
    title: String,
    content: String,
    category: String,
    tags: [String],
    imageUrl: String,
    likes: { type: Number, default: 0 },
    comments: [commentSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Post", postSchema);
