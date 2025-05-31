const Product = require("../models/productModel");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

//___get all products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).send(products);
  } catch (error) {
    res.status(500).send({ msg: "Could not find any product" });
  }
};

//______get one product

const getOneProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).send({ msg: "Product not found" });
    }
    res.status(200).send(product);
  } catch (error) {
    console.log(error);

    res.status(500).send({ msg: "Could not find any product" });
  }
};
// ________add a product (Admin)
const addNewProduct = async (req, res) => {
  try {
    const { title, price, category, description, keywords, stock, images } =
      req.body;
    const stripeProduct = await stripe.products.create({
      name: title,
      description,
    });
    const stripePrice = await stripe.prices.create({
      unit_amount: Math.round(price * 100),
      currency: "eur",
      product: stripeProduct.id,
    });
    const newProduct = new Product({
      title,
      price,
      category,
      description,
      keywords,
      stock,
      images,
      stripeProductId: stripeProduct.id,
      stripePriceId: stripePrice.id,
    });

    await newProduct.save();
    res
      .status(201)
      .send({ msg: "Product added successfully", product: newProduct });
  } catch (error) {
    res.status(500).send({
      msg: "Could not add new product, all fields are required, try again later",
    });
  }
};

//_______update a product (admin)

const updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedProduct) res.status(404).send({ msg: "Product not found" });
    res
      .status(200)
      .json({ msg: "Product updated successfully!", product: updatedProduct });
  } catch (error) {
    res.status(500).send({ msg: "Could not update product, try later" });
  }
};

// __________delete a Product (admin)

const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).send({ msg: "Product not found" });
    }
    res.status(200).send({ msg: "Product deleted successfully" });
  } catch (err) {
    console.error("Error deleting product:", err);
    res.status(500).send({ msg: "Error deleting product" });
  }
};

module.exports = {
  getAllProducts,
  getOneProduct,
  addNewProduct,
  updateProduct,
  deleteProduct,
};
