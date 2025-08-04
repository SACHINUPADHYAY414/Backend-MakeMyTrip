const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
require("dotenv").config();

function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  const hash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, "sha512")
    .toString("hex");
  return { salt, hash };
}

function verifyPassword(password, salt, hash) {
  const hashed = crypto
    .pbkdf2Sync(password, salt, 1000, 64, "sha512")
    .toString("hex");
  return hashed === hash;
}

const register = async (req, res) => {
  const {
    title,
    first_name,
    last_name,
    gender,
    date_of_birth,
    present_address_line1,
    present_pincode,
    present_country,
    present_state,
    present_city,
    email,
    mobile_number,
    password
  } = req.body;

  const { salt, hash } = hashPassword(password);
  const existingUser = await User.findUserByEmail(email);
  if (existingUser) {
    return res.status(400).json({ message: "Email already exists" });
  }
  try {
    await User.createUser({
      title,
      first_name,
      last_name,
      gender,
      date_of_birth,
      present_address_line1,
      present_pincode,
      present_country,
      present_state,
      present_city,
      email,
      mobile_number,
      password_hash: hash,
      salt
    });

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Registration failed" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findUserByEmail(email);
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isValid = verifyPassword(password, user.salt, user.password_hash);
    if (!isValid)
      return res.status(400).json({ message: "Invalid credentials" });

    const payload = {
      id: user.id,
      email: user.email,
      name: `${user.first_name} ${user.last_name}`
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "1h"
    });

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        date_of_birth: user.date_of_birth,
        present_address_line1: user.present_address_line1,
        present_pincode: user.present_pincode,
        present_country: user.present_country,
        present_state: user.present_state,
        present_city: user.present_city
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Login failed" });
  }
};
const updateProfile = async (req, res) => {
  const userId = req.user.id;
  const {
    first_name,
    last_name,
    gender,
    date_of_birth,
    present_address_line1,
    present_pincode,
    present_country,
    present_state,
    present_city,
    mobile_number
  } = req.body;

  try {
    const updatedUser = await User.updateUserProfile(userId, {
      first_name,
      last_name,
      gender,
      date_of_birth,
      present_address_line1,
      present_pincode,
      present_country,
      present_state,
      present_city,
      mobile_number
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Failed to update profile" });
  }
};

const getProfile = async (req, res) => {
  try {
    const paramId = parseInt(req.params.id);
    const tokenUserId = req.user.id;
    if (paramId !== tokenUserId) {
      return res
        .status(403)
        .json({ message: "Unauthorized access to profile." });
    }

    const user = await User.findUserById(paramId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { password_hash, salt, ...userProfile } = user;
    res.json({ data: userProfile });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};

const forgotPassword = async (req, res) => {
  const { email, oldPassword, newPassword } = req.body;

  if (!email || !oldPassword || !newPassword) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const user = await User.findUserByEmail(email);
    if (!user) return res.status(404).json({ message: "User not found." });

    const isValid = verifyPassword(oldPassword, user.salt, user.password_hash);
    if (!isValid)
      return res.status(401).json({ message: "Old password is incorrect." });

    const { hash, salt } = hashPassword(newPassword);
    await User.updateUserPassword(user.id, hash, salt);

    res.json({ message: "Password updated successfully." });
  } catch (error) {
    console.error("Error in forgotPassword:", error);
    res.status(500).json({ message: "Something went wrong." });
  }
};

module.exports = {
  register,
  login,
  updateProfile,
  getProfile,
  forgotPassword
};
