const express = require("express");
const router = express.Router();

const {
  getAllExhibitions,
  getExhibitionById,
  addExhibition,
  updateExhibition,
  deleteExhibition,
} = require("../controllers/exhibitionsController");

const { authMiddleware, adminAccess } = require("../middleware/authMiddleware");
// Public Routes
router.get("/", authMiddleware, getAllExhibitions);
router.get("/:id", authMiddleware, getExhibitionById);

// Admin Routes (authentication/authorization middleware should be added here)
router.post("/add", authMiddleware, adminAccess, addExhibition);
router.put("/:id", authMiddleware, adminAccess, updateExhibition);
router.delete("/:id", authMiddleware, adminAccess, deleteExhibition);

module.exports = router;
