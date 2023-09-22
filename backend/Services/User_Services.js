const User = require("../models/User_model");
const product = require("../models/product_model");
const Router = require("express").Router();

Router.get("/products/:productId", async (req, res) => {
  try {
    const productId = req.params.productId;
    const Product = await product.findById(productId);
    if (!Product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ Product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

Router.post("/:userId/cart/add/:productId", async (req, res) => {
  try {
    const { userId, productId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const Product = await product.findById(productId);

    if (!Product) {
      return res.status(404).json({ message: "Product not found" });
    }

    //   if (!user.cart) {
    //     user.cart = [];
    //   }

    user.cart.push(Product);

    await user.save();

    res.status(200).json({ message: "Product added to cart successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

Router.post("/:userId/favorites/add/:productId", async (req, res) => {
  try {
    const { userId, productId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const Product = await product.findById(productId);
    if (!Product) {
      return res.status(404).json({ message: "Product not found" });
    }
    user.favorites.push(Product);
    await user.save();

    res
      .status(200)
      .json({ message: "Product added to favorites successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

Router.patch('/:userId/cart/:productId', async (req, res) => {
  try {
    const { userId, productId } = req.params;
    const { quantity } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const cartProduct = user.cart.find((item) => {
      return item._id == productId;
    });

    if (!cartProduct) {
      return res.status(404).json({ message: 'Product not found in cart' });
    }

    cartProduct.quantity = quantity;

    await user.save();

    res.status(200).json({ message: 'Cart updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


Router.delete("/:userId/cart/remove/:productId", async (req, res) => {
  try {
    const { userId, productId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const Product = await product.findById(productId);

    if (!Product) {
      return res.status(404).json({ message: "Product not found" });
    }

    user.cart = user.cart.filter(
      (cartProduct) => cartProduct.toString() !== productId
    );
    await user.save();

    res.status(200).json({ message: "Product removed from cart successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = Router;
