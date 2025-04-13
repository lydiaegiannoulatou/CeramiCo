const express = require("express");
const router = express.Router();
const { createCheckoutSession } = require("../controllers/paymentController");
const { authMiddleware } = require("../middleware/authMiddleware");

router.post("/checkout", authMiddleware, createCheckoutSession);

module.exports = router;
