const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
//ADD PRODUCT TO CART
const addToCart = async (req, res) => {
  try {
    const { items } = req.body;
    const userId = req.user.userId;

    if (!items || items.length === 0) {
      return res.status(400).send({ msg: "No items in the request body" });
    }

    const { product_id, quantity } = items[0];
    const product = await Product.findById(product_id);
    if (!product) {
      return res.status(404).send({ msg: "Product not found" });
    }

    let cart = await Cart.findOne({ user_id: userId });

    if (!cart) {
      cart = new Cart({
        user_id: userId,
        items: [{ product_id, quantity }],
      });
    } else {
      const existingItemIndex = cart.items.findIndex(
        (item) => item.product_id.toString() === product_id
      );

      if (existingItemIndex >= 0) {
        cart.items[existingItemIndex].quantity += quantity;
      } else {
        cart.items.push({ product_id, quantity });
      }
    }

    await cart.save();

    // ✅ Populate before returning
    const populatedCart = await Cart.findOne({ user_id: userId }).populate("items.product_id", "title price images");

    res.status(200).send({ msg: "Product added to cart successfully", cart: populatedCart });
  } catch (error) {
    console.error(error);
    res.status(500).send({ msg: "Could not add product to cart, please try again later" });
  }
};

//GET CART
const getCart = async (req, res) => {
  try {
    const userId = req.user.userId;

    let cart = await Cart.findOne({ user_id: userId }).populate(
      "items.product_id",
      "title price images"
    );

  
    if (!cart) {
      return res.status(200).send({ msg: "Cart is empty", cart: { items: [] } });
    }

    res.status(200).send({ msg: "Cart retrieved successfully", cart });
  } catch (error) {
    console.error(error);
    res.status(500).send({ msg: "Could not retrieve cart, please try again later" });
  }
};


// DELETE PRODUCT FROM CART

const deleteProductFromCart = async (req, res) => {
  try {
    console.log("DELETE body:", req.body);
    const userId = req.user.userId;
    const { product_id } = req.body;

    let cart = await Cart.findOne({ user_id: userId });
    if (!cart) return res.status(404).send({ msg: "Cart not found" });

    cart.items = cart.items.filter(item => item.product_id.toString() !== product_id);
    await cart.save();

    // ✅ Populate before returning
    const populatedCart = await Cart.findOne({ user_id: userId }).populate("items.product_id", "title price images");

    res.status(200).send({ msg: "Item removed from cart", cart: populatedCart });
  } catch (error) {
    console.error(error);
    res.status(500).send({ msg: "Could not remove item, please try again later" });
  }
};


//UPDATE PRODUCT FROM CART
const updateProductQuantityInCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { product_id, quantity } = req.body;

    if (quantity <= 0) {
      return res.status(400).send({ msg: "Quantity must be greater than zero" });
    }

    let cart = await Cart.findOne({ user_id: userId });
    if (!cart) return res.status(404).send({ msg: "Cart not found" });

    const itemIndex = cart.items.findIndex(item => item.product_id.toString() === product_id);
    if (itemIndex === -1) return res.status(404).send({ msg: "Product not found in cart" });

    cart.items[itemIndex].quantity = quantity;
    await cart.save();

    // ✅ Populate before returning
    const populatedCart = await Cart.findOne({ user_id: userId }).populate("items.product_id", "title price images");

    res.status(200).send({ msg: "Item quantity updated", cart: populatedCart });
  } catch (error) {
    console.error(error);
    res.status(500).send({ msg: "Could not update item, please try again later" });
  }
};

module.exports = { addToCart, getCart, deleteProductFromCart, updateProductQuantityInCart };
