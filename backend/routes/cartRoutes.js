const express = require("express");
const router = express.Router();
const {
  addToCart,
  getCart,
  deleteItemFromCart,
  updateItemQuantityInCart
} = require("../controllers/cartController");
const { authMiddleware } = require("../middleware/authMiddleware");

router.post("/add-to-cart", authMiddleware, addToCart);
router.get("/get-cart", authMiddleware, getCart);
router.delete("/remove-item", authMiddleware, deleteItemFromCart);
router.put("/update-quantity", authMiddleware, updateItemQuantityInCart);

module.exports = router;
