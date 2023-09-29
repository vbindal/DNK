const jwt = require("jsonwebtoken");
const User = require("../models/User_model");
const bcrypt = require("bcrypt");

const signupUser = async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      password,
      confirmPassword,
      HomeAddress,
      pincode,
      district,
      state,
      country,
    } = req.body;

    const existingUser = await User.findOne({email});

    if (existingUser) {
      return res.status(409).json({
        message: "Username or email already exists.",
      });
    }

    const newUser = new User({
      firstName,
      lastName,
      email,
      phoneNumber,
      password,
      confirmPassword,
      Address: {
        HomeAddress,
        pincode,
        district,
        state,
        country,
      },
    });

    await newUser.save();
    console.log(newUser)
    res.status(201).json({
      message: "User registered successfully.",
      User: newUser,
    });

    next();
  } catch (error) {
    console.error("Error registering User:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      await user.save();

      return res.status(401).json({ message: "Invalid email or password" });
    }

    await user.save();

    const payload = {
      userID: user._id,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.LOGIN_EXPIRES,
    });
    res.status(200).json({ message: "Login successful", token });
    return token;
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  signupUser,
  loginUser,
};
