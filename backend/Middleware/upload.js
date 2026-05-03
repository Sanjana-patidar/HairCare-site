
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

// For product: accepts 1 main image + up to 5 gallery images
export const uploadProductImages = upload.fields([
  { name: "image", maxCount: 1 },
  { name: "images", maxCount: 5 }
]);

export default upload;

