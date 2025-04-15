const express = require("express");
const router = express.Router();
const {
  getOrder,
  getAllOrders,
  getOrdersByUser,
  cancelOrder,
  updateOrder,
} = require("../controllers/orderController");
const { authMiddleware, adminAccess } = require("../middleware/authMiddleware");

router.get("/success/:sessionId",authMiddleware, getOrder);
router.get("/all_orders", authMiddleware, adminAccess, getAllOrders);
router.get("/user", authMiddleware, getOrdersByUser);
router.delete("/cancel/:orderId", authMiddleware, adminAccess, cancelOrder);
router.put("/update/:orderId", authMiddleware, adminAccess, updateOrder);

module.exports = router;
