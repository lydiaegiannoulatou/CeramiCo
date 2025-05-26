const express = require("express");
const router = express.Router();
const {
  listGallery,
  getUploadSignature,
  deleteImage,
} = require("../controllers/galleryController");

const { authMiddleware, adminAccess } = require("../middleware/authMiddleware");

router.get("/", listGallery); // list images
router.post("/sign", authMiddleware, adminAccess, getUploadSignature); // signed upload
router.delete("/:id", authMiddleware, adminAccess, deleteImage); // delete image

module.exports = router;
