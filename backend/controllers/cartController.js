const Cart = require("../models/cartModel");
const Product = require("../models/productModel");

// Utility function to check if MongoDB ObjectId is valid
const mongoose = require("mongoose");
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// ADD PRODUCT TO CART
const addToCart = async (req, res) => {
  try {
    const { items } = req.body;
    const userId = req.user.userId;

    if (!items || items.length === 0) {
      return res.status(400).send({ msg: "No items in the request body" });
    }

    for (let item of items) {
      const { product_id, quantity } = item;
      if (!product_id || !isValidObjectId(product_id)) {
        return res.status(400).send({ msg: "Invalid or missing product ID" });
      }

      let product = await Product.findById(product_id);
      if (!product) {
        return res.status(404).send({ msg: "Product not found" });
      }
      if (quantity > product.stock) {
        return res.status(400).send({
          msg: `Only ${product.stock} units of '${product.title}' available in stock`,
        });
      }

      const price = product.price;

      let cart = await Cart.findOne({ user_id: userId });

      if (!cart) {
        const newItem = { product_id, quantity, price };
        cart = new Cart({
          user_id: userId,
          items: [newItem],
        });
      } else {
        const existingItemIndex = cart.items.findIndex(
          (cartItem) => cartItem.product_id.toString() === product_id
        );

        if (existingItemIndex >= 0) {
          const existingQuantity = cart.items[existingItemIndex].quantity;
          if (existingQuantity + quantity > product.stock) {
            return res.status(400).send({
              msg: `Adding ${quantity} exceeds stock. You already have ${existingQuantity} in cart and only ${product.stock} are available.`,
            });
          }
          cart.items[existingItemIndex].quantity += quantity;
        } else {
          2222;
          const newItem = { product_id, quantity, price };
          cart.items.push(newItem);
        }
      }

      await cart.save();
    }

    const populatedCart = await Cart.findOne({ user_id: userId }).populate({
      path: "items.product_id",
      select: "title price images stock",
    });

    if (!populatedCart) {
      return res.status(404).send({ msg: "Populated cart not found" });
    }

    res.status(200).send({
      success: true,
      msg: "Items added to cart successfully",
      cart: populatedCart,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      msg: "Could not add item to cart, please try again later",
    });
  }
};

// GET CART
const getCart = async (req, res) => {
  try {
    const userId = req.user.userId;

    let cart = await Cart.findOne({ user_id: userId }).populate({
      path: "items.product_id",
      select: "title price images stock",
    });

    if (!cart) {
      return res
        .status(200)
        .send({ msg: "Cart is empty", cart: { items: [] } });
    }

    res.status(200).send({ msg: "Cart retrieved successfully", cart });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      msg: "Could not retrieve cart, please try again later",
    });
  }
};

// DELETE ITEM FROM CART
const deleteItemFromCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { product_id } = req.body;

    if (product_id && !isValidObjectId(product_id)) {
      return res.status(400).send({ msg: "Invalid product ID" });
    }

    let cart = await Cart.findOne({ user_id: userId });
    if (!cart) return res.status(404).send({ msg: "Cart not found" });

    cart.items = cart.items.filter(
      (item) => item.product_id.toString() !== product_id
    );
    await cart.save();

    const populatedCart = await Cart.findOne({ user_id: userId }).populate(
      "items.product_id",
      "title price images stock"
    );

    res
      .status(200)
      .send({ msg: "Item removed from cart", cart: populatedCart });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      msg: "Could not remove item, please try again later",
    });
  }
};

// UPDATE ITEM QUANTITY IN CART
const updateItemQuantityInCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { product_id, quantity } = req.body;

    if (!product_id || !isValidObjectId(product_id)) {
      return res.status(400).send({ msg: "Invalid product ID" });
    }

    if (quantity <= 0) {
      return res
        .status(400)
        .send({ msg: "Quantity must be greater than zero" });
    }

    const product = await Product.findById(product_id);
    if (!product) {
      return res.status(404).send({ msg: "Product not found" });
    }

    if (quantity > product.stock) {
      return res.status(400).send({
        msg: `Only ${product.stock} units of '${product.title}' are available`,
      });
    }

    const cart = await Cart.findOne({ user_id: userId });
    if (!cart) {
      return res.status(404).send({ msg: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product_id && item.product_id.toString() === product_id
    );

    if (itemIndex === -1) {
      return res.status(404).send({ msg: "Item not found in cart" });
    }

    cart.items[itemIndex].quantity = quantity;
    await cart.save();

    const populatedCart = await Cart.findOne({ user_id: userId }).populate(
      "items.product_id",
      "title price images stock"
    );

    res.status(200).send({ msg: "Item quantity updated", cart: populatedCart });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      msg: "Could not update item, please try again later",
    });
  }
};

module.exports = {
  addToCart,
  getCart,
  deleteItemFromCart,
  updateItemQuantityInCart,
};
