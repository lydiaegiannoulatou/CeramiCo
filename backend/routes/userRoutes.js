const express = require("express");
const { loginUser, registerUser, userProfile } = require("../controllers/userControllers");
const {authMiddleware, adminAccess} = require("../middleware/authMiddleware")
const router = express.Router();

router.post("/login", loginUser);
router.post("/register", registerUser);
router.get("/profile/:id", userProfile)
// router.post("/update/:id");
// router.post("/delete/:id");

module.exports = router;
