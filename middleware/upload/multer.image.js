import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage });

export const singleImage = [
  upload.single("image"),
  (req, res, next) => {
    if (req.file) {
      req.body.image = req.file.buffer.toString("base64");
    }
    // Multer will automatically add text fields (like mission) to req.body
    next();
  },
];
