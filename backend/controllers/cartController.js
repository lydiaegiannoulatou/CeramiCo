const Cart = require("../models/cartModel");
const Product = require("../models/productModel");

const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.userId;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).send({ msg: "Product not found" });
    }

    let cart = await Cart.findOne({ user_id: userId });
    if (!cart) {
      cart = new Cart({
        user_id: userId,
        items: [{ product_id: productId, quantity: quantity }],
      });
      await cart.save();
      return res
        .status(201)
        .send({ msg: "Product added to cart successfully", cart });
    }

    const existingItemIndex = cart.items.findIndex(
      (item) => item.product_id.toString() === productId
    );

    if (existingItemIndex >= 0) {
      // If the product already exists in the cart, update the quantity
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // If the product is not in the cart, add it
      cart.items.push({ product_id: productId, quantity: quantity });
    }

    // Save the updated cart
    await cart.save();

    res.status(200).send({ msg: "Product added to cart successfully", cart });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ msg: "Could not add product to cart, please try again later" });
  }
};


const getCart = async (req, res) => {
    try {
      const userId = req.user.userId;  // Get the logged-in user's ID from the decoded JWT
  
      // Find the cart by the user's ID
      const cart = await Cart.findOne({ user_id: userId }).populate('items.product_id', 'title price images'); // Populate product data (like title, price, and images)
  
      if (!cart) {
        return res.status(404).send({ msg: 'Cart not found' });
      }
  
      // Send the cart data along with product details
      res.status(200).send({ msg: 'Cart retrieved successfully', cart });
    } catch (error) {
      console.error(error);
      res.status(500).send({ msg: 'Could not retrieve cart, please try again later' });
    }
  }

module.exports = { addToCart, getCart };
