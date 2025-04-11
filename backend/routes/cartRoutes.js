const express = require("express");
const router = express.Router();
const {
  addToCart,
  getCart,
  deleteProductFromCart,
  updateProductQuantityInCart,
} = require("../controllers/cartController");
const { authMiddleware } = require("../middleware/authMiddleware");

router.post("/add-to-cart", authMiddleware, addToCart);
router.get("/get-cart", authMiddleware, getCart);
router.delete("/remove-item", authMiddleware, deleteProductFromCart);
router.put("/update-quantity", authMiddleware, updateProductQuantityInCart);

module.exports = router;
