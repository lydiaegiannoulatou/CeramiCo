const express = require("express");
const { loginUser, registerUser, userProfile } = require("../controllers/userControllers");
const {authMiddleware, adminAccess} = require("../middleware/authMiddleware")
const router = express.Router();

router.post("/login", loginUser);
router.post("/register", registerUser);
router.get("/profile", userProfile)
// router.post("/update/_id");
// router.post("/delete/_id");

module.exports = router;
