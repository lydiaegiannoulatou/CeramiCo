const express = require("express");
const { getAllProducts, addNewProduct, updateProduct, deleteProduct } = require("../controllers/productControllers")
const router = express.Router()

router.get("/products", getAllProducts)
router.post("/products/add",addNewProduct)//admin
router.put("products/update/:id", updateProduct)//admin
router.delete("products/delete/:id", deleteProduct)//admin

module.exports = router