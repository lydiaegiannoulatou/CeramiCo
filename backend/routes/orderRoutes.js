const express = require("express");
const router = express.Router();
const { getOrder } = require("../controllers/orderController");
const { authMiddleware} = require("../middleware/authMiddleware")

router.get("/success/:sessionId", getOrder);

module.exports = router;
