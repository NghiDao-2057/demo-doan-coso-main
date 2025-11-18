import express from "express";
import { upload } from "../config/cloudinary.js"; // Import từ config
import { verifyToken, verifyAdmin } from "../middleware/authMiddleware.js";
import {
  uploadAvatar,
  deleteAvatar,
  getAllImages,
  deleteImage,
  uploadImage,
} from "../controllers/imageController.js";

const router = express.Router();

console.log("=== SETTING UP IMAGE ROUTES ===");

// Test route
router.get("/test", (req, res) => {
  console.log("Test route accessed");
  res.json({
    message: "Image routes are working!",
    timestamp: new Date().toISOString(),
  });
});

// Avatar routes - Sử dụng cloudinary config từ file config
router.post(
  "/avatar/:userId",
  (req, res, next) => {
    console.log("=== AVATAR UPLOAD ROUTE HIT ===");
    console.log("Method:", req.method);
    console.log("URL:", req.originalUrl);
    console.log("Params:", req.params);
    next();
  },
  verifyToken,
  (req, res, next) => {
    console.log("Token verified, user:", req.user);
    next();
  },
  upload.single("avatar"), // Sử dụng upload từ cloudinary config
  (req, res, next) => {
    console.log(
      "Multer processed, file:",
      req.file
        ? {
            originalname: req.file.originalname,
            path: req.file.path,
            filename: req.file.filename,
          }
        : "No file"
    );
    next();
  },
  uploadAvatar
);

router.delete("/avatar/:userId", verifyToken, deleteAvatar);

// General image upload routes (for admin)
router.post(
  "/upload",
  verifyToken,
  verifyAdmin,
  upload.single("image"),
  uploadImage
);

router.post(
  "/upload-multiple",
  verifyToken,
  verifyAdmin,
  upload.array("images", 10),
  async (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: "Không có file được upload" });
      }

      const imageData = req.files.map((file) => ({
        imageUrl: file.path,
        publicId: file.filename,
        filename: file.originalname || `image-${Date.now()}`,
        size: file.size,
        format: file.mimetype?.split("/")[1],
      }));

      res.json({
        message: "Upload ảnh thành công",
        images: imageData,
      });
    } catch (error) {
      console.error("Error uploading multiple images:", error);
      res.status(500).json({
        message: "Lỗi khi upload ảnh",
        error: error.message,
      });
    }
  }
);

// Admin image management routes
router.get("/", verifyToken, verifyAdmin, getAllImages);
router.delete("/:publicId", verifyToken, verifyAdmin, deleteImage);

// Get image details by publicId
router.get("/:publicId/details", verifyToken, async (req, res) => {
  try {
    const { publicId } = req.params;
    const decodedPublicId = decodeURIComponent(publicId);

    const result = await cloudinary.api.resource(decodedPublicId, {
      image_metadata: true,
    });

    res.json({
      publicId: result.public_id,
      filename: result.filename || result.public_id.split("/").pop(),
      url: result.secure_url,
      size: result.bytes,
      width: result.width,
      height: result.height,
      format: result.format,
      uploadDate: result.created_at,
      tags: result.tags || [],
      metadata: result.image_metadata || {},
    });
  } catch (error) {
    console.error("Error getting image details:", error);
    res.status(500).json({
      message: "Lỗi khi lấy thông tin ảnh",
      error: error.message,
    });
  }
});

console.log("=== IMAGE ROUTES SETUP COMPLETE ===");

export default router;
