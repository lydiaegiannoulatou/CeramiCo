const express = require("express");
const { loginUser, registerUser } = require("../controllers/userControllers");

const router = express.Router();

router.post("/login", loginUser);
router.post("/register", registerUser);
router.post("/update/_id");
router.post("/delete/_id");

module.exports = router;
