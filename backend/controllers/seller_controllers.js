const jwt = require("jsonwebtoken");
const seller = require("../models/seller_model");
const bcrypt = require("bcrypt");
// const crypto = require("crypto");

const signupSeller = async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      companyName,
      email,
      phone,
      address,
      gstNumber,
      username,
      bankName,
      accountNumber,
      ifscCode,
      password,
      confirmPassword,
    } = req.body;

    const existingSeller = await seller.findOne({
      $or: [{ email }, { username }],
    });

    if (existingSeller) {
      return res.status(409).json({
        message: "Username or email already exists.",
      });
    }

    const newSeller = new seller({
      firstName,
      lastName,
      companyName,
      contactInfo: {
        email,
        phone,
        address,
      },
      gstNumber,
      bankName,
      accountNumber,
      ifscCode,
      username,
      password,
      confirmPassword,
    });

    await newSeller.save();

    res.status(201).json({
      message: "Seller registered successfully.",
      seller: newSeller,
    });

    next();
  } catch (error) {
    console.error("Error registering seller:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


const loginSeller = async (req, res) => {
  const { username, password } = req.body;

  try {
    const Seller = await seller.findOne({ username });

    
    if (!Seller) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    if (Seller.approvalStatus!='Approved') {
        return res
          .status(403)
          .json({ message: "Account not approved by admin yet" });
      }

    

    const isPasswordValid = await bcrypt.compare(password, Seller.password);

    if (!isPasswordValid) {
     
      await Seller.save();

      return res.status(401).json({ message: "Invalid username or password" });
    }

    await Seller.save();

    const payload = {
        userID: Seller._id, 
      };
    const token = jwt.sign(payload, 'YOUR_SECRET_KEY', { expiresIn: process.env.LOGIN_EXPIRES });
    res.status(200).json({ message: "Login successful", token });
    return token;
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


module.exports = {
    signupSeller,
    loginSeller
}