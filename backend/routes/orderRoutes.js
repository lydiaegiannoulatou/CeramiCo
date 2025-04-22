const express = require("express");
const router = express.Router();
const {
  getOrder,
  productOrders,
  getOrdersByUser,
  cancelOrder,
  updateOrder,
} = require("../controllers/orderController");
const { authMiddleware, adminAccess } = require("../middleware/authMiddleware");

router.get("/success/:sessionId", authMiddleware, getOrder);
router.get("/user", authMiddleware, getOrdersByUser);
router.get("/product_orders", authMiddleware, adminAccess, productOrders);
router.delete("/cancel/:orderId", authMiddleware, adminAccess, cancelOrder);
router.put("/update/:orderId", authMiddleware, adminAccess, updateOrder);

module.exports = router;
