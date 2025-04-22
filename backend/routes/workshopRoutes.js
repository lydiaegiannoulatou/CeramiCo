const express = require("express");
const router = express.Router();
const {
  getAllClasses,
  getClassById,
  createClass,
  updateClass,
  deleteClass,
  getClassesForCalendar,
  bookSession
} = require("../controllers/workshopController");
const { authMiddleware, adminAccess } = require("../middleware/authMiddleware");

router.get("/", getAllClasses);
router.get("/:id", getClassById);
router.post("/new_class", authMiddleware, adminAccess, createClass);
router.put("/update/:id", authMiddleware, adminAccess, updateClass);
router.delete("/delete/:id", authMiddleware, adminAccess, deleteClass);
router.get("/calendar", authMiddleware, getClassesForCalendar);
router.post("/book-session", bookSession);

module.exports = router;
