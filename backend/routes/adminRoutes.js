const express = require("express");
const router = express.Router();
const  newsletter  =require("../controllers/adminController")
const {authMiddleware, adminAccess} = require("../middleware/authMiddleware")


router.post("/newsletter", authMiddleware, adminAccess, newsletter)

module.exports = router