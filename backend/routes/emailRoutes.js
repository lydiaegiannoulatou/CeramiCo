const express = require("express");
const router = express.Router();
const {sendNewsletter,subscribeUser, handleContactMessage}  = require("../controllers/emailController")
const {authMiddleware, adminAccess} = require("../middleware/authMiddleware")

router.post("/subscribe", subscribeUser);
router.post("/newsletter", authMiddleware, adminAccess, sendNewsletter)
router.post('/contact', handleContactMessage)

module.exports = router