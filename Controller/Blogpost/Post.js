import Post from "../../Model/Blog/post.js";

export const createPost = async (req, res) => {
  try {
    const { title, content, category, tags } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "Image is required" });
    }

    const newPost = new Post({
      title,
      content,
      category,
      tags: JSON.parse(tags),
      imageUrl: `/uploads/blogpostimage/${req.file.filename}`,
    });

    await newPost.save();

    res.status(201).json({
      message: "Post created successfully",
      post: newPost,
      success: true,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const getPosts = async (req, res) => {
  try {
    const {
      search = "",
      page = 1,
      limit = 6,
      category = "",
      tag = "",
    } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
      ];
    }

    if (category) {
      query.category = category;
    }

    if (tag) {
      query.tags = tag;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const totalPosts = await Post.countDocuments(query);
    const categoriesCount = await Post.distinct("category").then(
      (cats) => cats.length
    );
    const tagsList = await Post.distinct("tags");
    const tagsCount = tagsList.length;

    const categoriesList = await Post.distinct("category");

    res.json({
      posts,
      totalPosts,
      categoriesCount,
      tagsCount,
      categories: categoriesList,
      tags: tagsList,
    });
  } catch (err) {
    console.error("Error in getPosts:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const likePost = async (req, res) => {
  try {
    const postId = req.params.id;

    const post = await Post.findByIdAndUpdate(
      postId,
      { $inc: { likes: 1 } },
      { new: true }
    );

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.json({ message: "Post liked", likes: post.likes });
  } catch (err) {
    console.error("Error in likePost:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const commentPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const { user, text } = req.body;

    if (!text || !user) {
      return res
        .status(400)
        .json({ error: "User and comment text are required" });
    }

    const post = await Post.findByIdAndUpdate(
      postId,
      { $push: { comments: { user, text } } },
      { new: true }
    );

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.json({ message: "Comment added", comments: post.comments });
  } catch (err) {
    console.error("Error in commentPost:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const getSinglePost = async (req, res) => {
  try {
    const postId = req.params.id;

    const post = await Post.findById(postId).lean();
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    return res.json({ post, success: true });
  } catch (err) {
    console.error("Error in getSinglePost:", err);
    res.status(500).json({ error: "Server error" });
  }
};
