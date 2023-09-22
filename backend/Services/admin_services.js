const seller = require("../models/seller_model");
const express = require("express");
const router = express.Router();
const product = require("../models/product_model");
const fs = require("fs");
const sendEmail = require("../middleware/email");
const { createObjectCsvWriter } = require("csv-writer");

router.get("/admin/requests", async (req, res, next) => {
  try {
    const pendingRequests = await seller.find({
      approvalStatus: "Pending",
    });
    const jsonData = {
      pendingRequests: pendingRequests.map((seller) => ({
        id: seller._id,
        firstName: seller.firstName,
        lastName: seller.lastName,
        gstNumber: seller.gstNumber,
        approvalStatus: seller.approvalStatus,
      })),
    };
    fs.writeFileSync("pending-requests.json", JSON.stringify(jsonData));
    
    res.status(200).send("fetched pending requests successfully");
    next();
  } catch (error) {
    res.status(500).send("internal server error");
  }
});

function addJsonDatatoCsv(jsonData) {
  const csvFilePath = "pending-product-requests.csv";

  const csvWriter = createObjectCsvWriter({
    path: csvFilePath,
    header: [
      { id: "id", title: "ID" },
      { id: "name", title: "Name" },
      { id: "category", title: "Category" },
      { id: "description", title: "Description" },
      { id: "price", title: "Price" },
      { id: "approvalStatus", title: "Approval Status" },
    ],
  });

  csvWriter
    .writeRecords(jsonData.pendingProductRequests)
    .then(() => {
      console.log("CSV file created successfully.");
    })
    .catch((error) => {
      console.error("Error writing to CSV file:", error);
    });
}

function removeSellerFromPendingRequests(sellerId) {
  try {
    const fileName = "pending-requests.json";
    const jsonData = JSON.parse(fs.readFileSync(fileName, "utf-8"));
    jsonData.pendingRequests = jsonData.pendingRequests.filter(
      (seller) => seller.id !== sellerId
    );
    fs.writeFileSync(fileName, JSON.stringify(jsonData));
  } catch (error) {
    console.error("Error removing seller from pending requests:", error);
  }
}

router.post("/admin/approve/:sellerId", async (req, res, next) => {
  try {
    const sellerId = req.params.sellerId;
    const sellerDetails = await seller.findById(sellerId);
    if (sellerDetails.approvalStatus !== "Pending") {
      return res
        .status(400)
        .send("Request has already been processed by the admin.");
    }
    await seller.findByIdAndUpdate(sellerId, {
      approvalStatus: "Approved",
    });

    removeSellerFromPendingRequests(sellerId);

    res.status(200).send("Seller approved successfully");

    const mail = {
      from: process.env.EMAIL_USER,
      to: sellerDetails.contactInfo.email,
      subject: "Product Approval Status",
      message:
        "Your product has been approved and is now visible on our platform.",
    };
    await sendEmail(mail);
    next();
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

router.post("/admin/reject/:sellerId", async (req, res, next) => {
  try {
    const sellerId = req.params.sellerId;
    await seller.findByIdAndUpdate(sellerId, {
      approvalStatus: "Rejected",
    });
    await seller.findByIdAndUpdate(sellerId, {
      approvalStatus: "Rejected",
    });
    removeSellerFromPendingRequests(sellerId);
    res.status(200).send("seller rejected");

    const sellerDetails = await seller.findById(sellerId);

    const mail = {
      from: process.env.EMAIL_USER,
      to: sellerDetails.contactInfo.email,
      subject: "Product Approval Status",
      message:
        "Your product has been Rejected, please Visit nearest dnk center for verification.",
    };
    await sendEmail(mail);
    next();
  } catch (error) {
    res.status(500).send("internal server error");
  }
});

router.get("/admin/pending-product-requests", async (req, res) => {
  try {
    const pendingProductRequests = await product.find({
      approvalStatus: "Pending",
    });

    const productDetails = pendingProductRequests.map((product) => ({
      id: product._id,
      name: product.name,
      category: product.category,
      description: product.description,
      price: product.price,
      approvalStatus: product.approvalStatus,
    }));

    const jsonData = {
      pendingProductRequests: productDetails,
    };

    fs.writeFileSync("pending-product-requests.json", JSON.stringify(jsonData));
    addJsonDatatoCsv(jsonData);
    res
      .status(200)
      .json({ message: "Pending product requests saved to JSON file." });
  } catch (error) {
    console.error("Error fetching and saving pending product requests:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

function removeProductFromPendingRequests(productId) {
  try {
    const fileName = "pending-product-requests.json";
    const jsonData = JSON.parse(fs.readFileSync(fileName, "utf-8"));
    jsonData.pendingProductRequests = jsonData.pendingProductRequests.filter(
      (product) => product.id !== productId
    );
    fs.writeFileSync(fileName, JSON.stringify(jsonData));
  } catch (error) {
    console.error("Error removing product from pending requests:", error);
  }
}

router.post("/admin/products/approve/:productId", async (req, res, next) => {
  try {
    const productId = req.params.productId;
    const productDetails = await product.findById(productId);
    if (productDetails.approvalStatus != "Pending") {
      return res.status(404).send("product is already processed");
    }

    await product.findByIdAndUpdate(productId, {
      approvalStatus: "Approved",
    });

    removeProductFromPendingRequests(productId);
    res.status(200).send("product approved successfully");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/admin/products/reject/:productId", async (req, res) => {
  try {
    const productId = req.params.productId;
    const productDetails = product.findById(productId);
    if (productDetails.approvalStatus != "Pending") {
      return res.status(404).send("product is already processed");
    }

    await product.findByIdAndUpdate(productId, {
      approvalStatus: "Rejected",
    });

    removeProductFromPendingRequests(productId);
    res.status(200).send("product Rejected");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.put("/admin/products/update/:productId", async (req, res) => {
  try {
    const { name, description, price, images } = req.body;
    const productId = req.params.productId;
    const updatedProduct = await product.findByIdAndUpdate(
      productId,
      { name, description, price, images },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/admin/products/remove/:productId", async (req, res) => {
  try {
    const productId = req.params.productId;
    const deletedProduct = await product.findByIdAndRemove(productId);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(204).end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
