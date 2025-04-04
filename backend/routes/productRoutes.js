const express = require("express");
const { getAllProducts, addNewProduct, updateProduct, deleteProduct } = require("../controllers/productControllers")
const router = express.Router()
const {authMiddleware, adminAccess } = require("../middleware/authMiddleware")

router.get("/", getAllProducts)
router.post("/products/add",addNewProduct,authMiddleware,adminAccess)//admin
router.put("products/update/:id", updateProduct, authMiddleware, adminAccess)//admin
router.delete("products/delete/:id", deleteProduct, authMiddleware,adminAccess)//admin

module.exports = router