import multer from "multer";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const uploadPath = path.join("uploads", "blogpostimage");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `${uuidv4()}${ext}`;
    cb(null, filename);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files allowed!"));
    }
  },
  limits: { fileSize: 2 * 1024 * 1024 } 
});

export default upload;
