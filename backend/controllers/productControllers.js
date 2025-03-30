const Product = require("../models/productModel");

//___get all products
const getAllProducts = async (req,res) => {
    try {
        const products = await Product.find()
        res.status(200).send(products)
    } catch (error) {
        res.status(500).send({msg:"Could not find any product"})
    }
}

// ________add a product (Admin)
const addNewProduct = async (req,res) => {
    try{
        const { title, price, category, description, keywords, stock, images} = req.body;
        const newProduct = new Product ({title, price, category, description, keywords, stock, images});
        await newProduct.save()
        res.status(201).send({msg:"Product added successfully", product : newProduct})
    }catch (error) {
        res.status(500).send({msg:"Could not add new product, all fields are required, try again later"})
    }
}


//_______update a product (admin)

const updateProduct = async (req,res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, {new: true});
        if(!updatedProduct) res.status(404).send({msg:"Product not found"});
        res.status(200).json({msg:"Product updated successfully!", product: updatedProduct})
    } catch (error) {
        res.status(500).send({msg:"Could not update product, try later"})
    }
}


// __________delete a Product (admin)

const deleteProduct = async (req,res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if(!deletedProduct)return res.status(404).send({msg: "Product not found"});
        res.status(200).send({msg:"Product deleted successfully"})
    } catch (error) {
        res.send(500).send({error:error.message})
    }
}


module.exports = { getAllProducts, addNewProduct, updateProduct, deleteProduct }