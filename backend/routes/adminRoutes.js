const express = require("express");
const router = express.Router();
const  {
    sendNewsletter,
    listGallery,
    getUploadSignature,
    deleteImage,
  }  =require("../controllers/adminController")
const {authMiddleware, adminAccess} = require("../middleware/authMiddleware")


router.post("/newsletter", authMiddleware, adminAccess, sendNewsletter)
router.get("/gallery",listGallery);      // list images
router.post("/gallery/sign",authMiddleware,adminAccess, getUploadSignature); // signed upload
router.delete("/gallery/:id",authMiddleware,adminAccess,deleteImage);      // delete image

module.exports = router


