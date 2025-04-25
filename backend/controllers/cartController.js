const Cart = require("../models/cartModel");
const Product = require("../models/productModel");

// Utility function to check if MongoDB ObjectId is valid
const mongoose = require('mongoose');
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// ADD PRODUCT TO CART
const addToCart = async (req, res) => {
  try {
    console.log("req.user:", req.user);
    console.log("User ID from req.user:", req.user.userId);

    const { items } = req.body;
    const userId = req.user.userId;

    if (!items || items.length === 0) {
      return res.status(400).send({ msg: "No items in the request body" });
    }

    // Iterate through each item being added to the cart
    for (let item of items) {
      const { product_id, quantity } = item;
      if (!product_id || !isValidObjectId(product_id)) {
        return res.status(400).send({ msg: "Invalid or missing product ID" });
      }

      // Validate the product
      let product = await Product.findById(product_id);
      if (!product) {
        return res.status(404).send({ msg: "Product not found" });
      }

      // Get the price from the product
      const price = product.price;

      // Find the user's cart or create a new one if not found
      let cart = await Cart.findOne({ user_id: userId });

      if (!cart) {
        // Create the new cart with the item
        const newItem = { product_id, quantity, price };
        cart = new Cart({
          user_id: userId,
          items: [newItem],
        });
      } else {
        // Check if the item already exists in the cart
        const existingItemIndex = cart.items.findIndex(
          (cartItem) => cartItem.product_id.toString() === product_id
        );

        if (existingItemIndex >= 0) {
          // If it exists, update the quantity
          cart.items[existingItemIndex].quantity += quantity;
        } else {
          // Otherwise, add a new item to the cart
          const newItem = { product_id, quantity, price };
          cart.items.push(newItem);
        }
      }

      // Save the updated cart
      await cart.save();
    }

    // Populate the cart with product details
    const populatedCart = await Cart.findOne({ user_id: userId })
      .populate({
        path: "items.product_id",
        select: "title price images",
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

    let cart = await Cart.findOne({ user_id: userId })
      .populate({
        path: 'items.product_id',
        select: 'title price images',
      });

    if (!cart) {
      return res.status(200).send({ msg: "Cart is empty", cart: { items: [] } });
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

    // Validate ObjectId
    if (product_id && !isValidObjectId(product_id)) {
      return res.status(400).send({ msg: "Invalid product ID" });
    }

    let cart = await Cart.findOne({ user_id: userId });
    if (!cart) return res.status(404).send({ msg: "Cart not found" });

    // Remove the item based on product_id
    cart.items = cart.items.filter(
      (item) => item.product_id.toString() !== product_id
    );
    await cart.save();

    // Populate before returning
    const populatedCart = await Cart.findOne({ user_id: userId })
      .populate("items.product_id", "title price images");

    res.status(200).send({ msg: "Item removed from cart", cart: populatedCart });
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

    if (quantity <= 0) {
      return res.status(400).send({ msg: "Quantity must be greater than zero" });
    }

    // Validate ObjectId for product
    if (product_id && !isValidObjectId(product_id)) {
      return res.status(400).send({ msg: "Invalid product ID" });
    }

    let cart = await Cart.findOne({ user_id: userId });
    if (!cart) return res.status(404).send({ msg: "Cart not found" });

    const itemIndex = cart.items.findIndex(
      (item) => item.product_id && item.product_id.toString() === product_id
    );

    if (itemIndex === -1) return res.status(404).send({ msg: "Item not found in cart" });

    // Update the quantity
    cart.items[itemIndex].quantity = quantity;
    await cart.save();

    // Populate before returning
    const populatedCart = await Cart.findOne({ user_id: userId })
      .populate("items.product_id", "title price images");

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
