const express = require("express");
const router = express.Router();
const {
  getOrder,
  productOrders,
  getOrdersByUser,
  cancelOrder,
  updateOrder,
  getOrderById
} = require("../controllers/orderController");
const { authMiddleware, adminAccess } = require("../middleware/authMiddleware");

router.get("/success/:sessionId", authMiddleware, getOrder);
router.get("/user", authMiddleware, getOrdersByUser);
router.get("/product_orders", authMiddleware, adminAccess, productOrders);
router.put("/cancel/:orderId", authMiddleware, cancelOrder);
router.put("/update/:orderId", authMiddleware, adminAccess, updateOrder);
router.get("/get-order/:sessionId", authMiddleware, getOrderById)
module.exports = router;
