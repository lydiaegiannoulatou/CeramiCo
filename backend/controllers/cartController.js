const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const Workshop = require("../models/WorkshopModel"); 

// Utility function to check if MongoDB ObjectId is valid
const mongoose = require('mongoose');

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// ADD PRODUCT OR WORKSHOP TO CART
const addToCart = async (req, res) => {
  try {
    console.log("req.user:", req.user); 
    console.log("User ID from req.user:", req.user.userId);

    const { items } = req.body;
    const userId = req.user.userId;

    if (!items || items.length === 0) {
      return res.status(400).send({ msg: "No items in the request body" });
    }

    const item = items[0]; // Assuming we are adding one item for simplicity
    console.log("Item being added (raw):", JSON.stringify(item));
    const { type, quantity } = item;
    let product_id, workshop_id;

    // Validate the item type and corresponding ID
    if (type === "product") {
      product_id = item.product_id;
      if (!product_id) {
        console.log("❌ Missing product_id for item of type 'product'");
        return res.status(400).send({ msg: "Product ID is required for product type" });
      }
      if (!isValidObjectId(product_id)) {
        console.log("❌ Invalid product_id:", product_id);
        return res.status(400).send({ msg: "Invalid product ID" });
      }
    } else if (type === "workshop") {
      workshop_id = item.workshop_id;
      if (!workshop_id) {
        return res.status(400).send({ msg: "Workshop ID is required for workshop type" });
      }
      if (!isValidObjectId(workshop_id)) {
        return res.status(400).send({ msg: "Invalid workshop ID" });
      }
    } else {
      return res.status(400).send({ msg: "Invalid item type" });
    }

    // Validate the product or workshop based on the type
    let product;
    let workshop;

    if (type === "product") {
      product = await Product.findById(product_id);
      console.log("🔍 Looked up product:", product);
      if (!product) {
        return res.status(404).send({ msg: "Product not found" });
      }
    } else if (type === "workshop") {
      workshop = await Workshop.findById(workshop_id);
      if (!workshop) {
        return res.status(404).send({ msg: "Workshop not found" });
      }
    }

    // Find the user's cart or create a new one if not found
    let cart = await Cart.findOne({ user_id: userId });
    console.log("Cart found:", cart);

    if (!cart) {
      console.log("No cart found, creating a new one");

      const newItem = {
        type,
        quantity,
        ...(type === "product" && { product_id }),
        ...(type === "workshop" && { workshop_id })
      };
      cart = new Cart({
        user_id: userId,
        items: [newItem],
      });
    } else {
      console.log("Cart found, checking for existing items...");
      const existingItemIndex = cart.items.findIndex(
        (cartItem) =>
          (cartItem.product_id && cartItem.product_id.toString() === product_id) ||
          (cartItem.workshop_id && cartItem.workshop_id.toString() === workshop_id)
      );

      if (existingItemIndex >= 0) {
        // Update the existing item's quantity
        cart.items[existingItemIndex].quantity += quantity;
        console.log("Updated quantity for existing item:", cart.items[existingItemIndex]);
      } else {
        // Add a new item to the cart with proper handling for product_id or workshop_id
        let newItem;
        if (type === "product") {
          newItem = { type, product_id, quantity };
        } else if (type === "workshop") {
          newItem = { type, workshop_id, quantity };
        }
        cart.items.push(newItem);
        console.log("Added new item to cart:", newItem);
      }
    }

    console.log("Cart before saving:", cart);
    await cart.save();

    // ✅ Populate before returning the response
    const populatedCart = await Cart.findOne({ user_id: userId })
      .populate({
        path: "items.product_id",
        select: "title price images",
      })
      .populate({
        path: "items.workshop_id",
        select: "workshopTitle sessionDate price",
      });

    if (!populatedCart) {
      return res.status(404).send({ msg: "Populated cart not found" });
    }

    res.status(200).send({ success: true, msg: "Item added to cart successfully", cart: populatedCart });
  } catch (error) {
    console.error(error);
    res.status(500).send({ msg: "Could not add item to cart, please try again later" });
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
      })
      .populate({
        path: 'items.workshop_id',
        select: 'workshopTitle sessionDate price',
      });

    if (!cart) {
      return res.status(200).send({ msg: "Cart is empty", cart: { items: [] } });
    }

    res.status(200).send({ msg: "Cart retrieved successfully", cart });
  } catch (error) {
    console.error(error);
    res.status(500).send({ msg: "Could not retrieve cart, please try again later" });
  }
};

// DELETE ITEM FROM CART
const deleteItemFromCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { product_id, workshop_id } = req.body;

    // Validate ObjectIds
    if (product_id && !isValidObjectId(product_id)) {
      return res.status(400).send({ msg: "Invalid product ID" });
    }

    if (workshop_id && !isValidObjectId(workshop_id)) {
      return res.status(400).send({ msg: "Invalid workshop ID" });
    }

    let cart = await Cart.findOne({ user_id: userId });
    if (!cart) return res.status(404).send({ msg: "Cart not found" });

    // Remove the item based on product_id or workshop_id
    cart.items = cart.items.filter(
      (item) => (item.product_id && item.product_id.toString() !== product_id) &&
                (item.workshop_id && item.workshop_id.toString() !== workshop_id)
    );
    cart.items = cart.items.filter((item) => item.product_id !== null);
    await cart.save();

    // ✅ Populate before returning
    const populatedCart = await Cart.findOne({ user_id: userId })
      .populate("items.product_id", "title price images")
      .populate("items.workshop_id", "workshopTitle sessionDate price");

    res.status(200).send({ msg: "Item removed from cart", cart: populatedCart });
  } catch (error) {
    console.error(error);
    res.status(500).send({ msg: "Could not remove item, please try again later" });
  }
};

// UPDATE ITEM QUANTITY IN CART
const updateItemQuantityInCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { product_id, workshop_id, quantity } = req.body;

    if (quantity <= 0) {
      return res.status(400).send({ msg: "Quantity must be greater than zero" });
    }

    // Validate ObjectIds
    if (product_id && !isValidObjectId(product_id)) {
      return res.status(400).send({ msg: "Invalid product ID" });
    }

    if (workshop_id && !isValidObjectId(workshop_id)) {
      return res.status(400).send({ msg: "Invalid workshop ID" });
    }

    let cart = await Cart.findOne({ user_id: userId });
    if (!cart) return res.status(404).send({ msg: "Cart not found" });

    const itemIndex = cart.items.findIndex(
      (item) => (item.product_id && item.product_id.toString() === product_id) ||
                (item.workshop_id && item.workshop_id.toString() === workshop_id)
    );

    if (itemIndex === -1) return res.status(404).send({ msg: "Item not found in cart" });

    cart.items[itemIndex].quantity = quantity;
    await cart.save();

    // ✅ Populate before returning
    const populatedCart = await Cart.findOne({ user_id: userId })
      .populate("items.product_id", "title price images")
      .populate("items.workshop_id", "workshopTitle sessionDate price");

    res.status(200).send({ msg: "Item quantity updated", cart: populatedCart });
  } catch (error) {
    console.error(error);
    res.status(500).send({ msg: "Could not update item, please try again later" });
  }
};

module.exports = {
  addToCart,
  getCart,
  deleteItemFromCart,
  updateItemQuantityInCart
};
