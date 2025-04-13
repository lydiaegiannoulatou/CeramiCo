const express = require("express");
const { loginUser, registerUser, userProfile } = require("../controllers/userControllers");
const router = express.Router();

router.post("/login", loginUser);
router.post("/register", registerUser);
router.get("/profile/:id", userProfile)


module.exports = router;
