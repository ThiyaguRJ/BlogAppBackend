import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import AuthRouter from "./Routes/auth.js";
import BlogRouter from "./Routes/blog.js";

const app = express();
dotenv.config();

app.use(
  cors({
    origin: "https://blogapp-frontend-six.vercel.app",
    credentials: true,
  })
);


app.use(express.json());
app.use(cookieParser());


//Routes
app.use("/api/auth", AuthRouter);
app.use("/api/blog", BlogRouter);
app.use("/api/uploads", express.static("uploads"));

const ConnectDB = async () => {
  try {
    await mongoose
      .connect(process.env.MONGO_URI,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => console.log("Connected to MongoDB"))
      .catch((err) => console.error("MongoDB connection error:", err));
  } catch (err) {
    throw new Error("Database connection failed", err);
  }
};

app.listen(process.env.PORT || 3000, () => {
  ConnectDB()
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
});

