const express = require("express");
const router = express.Router();
const { getOrder, getOrdersByUser, cancelOrder } = require("../controllers/orderController");
const { authMiddleware } = require("../middleware/authMiddleware");

router.get("/success/:sessionId", authMiddleware, getOrder);
router.get("/user", authMiddleware, getOrdersByUser);
router.delete("/:orderId", authMiddleware, cancelOrder);

module.exports = router;
