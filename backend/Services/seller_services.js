const seller = require("../models/seller_model");
const product = require("../models/product_model");
const router = require("express").Router();
const fs = require('fs')


router.post("/upload-product", async (req, res) => {
  try {
    const { name, category, description, price, sellerId } = req.body;

    const newProduct = new product({
      name,
      category,
      description,
      price,
      seller: sellerId,
    });

    await newProduct.save();

    await seller.findByIdAndUpdate(
      sellerId,
      {
        $push: { submittedProducts: newProduct._id },
      },
      { new: true }
    );

    res.status(201).json({ message: "Product uploaded for verification" });
  } catch (error) {
    console.error("Error uploading product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});





module.exports = router;
