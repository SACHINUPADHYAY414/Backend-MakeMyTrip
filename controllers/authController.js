const crypto = require('crypto');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Hash helpers
function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return { salt, hash };
}

function verifyPassword(password, salt, hash) {
  const hashed = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return hashed === hash;
}

// REGISTER
const register = async (req, res) => {
  const {
    title, first_name, last_name, gender, date_of_birth,
    present_address_line1, present_pincode, present_country,
    present_state, present_city, email, password
  } = req.body;

  const { salt, hash } = hashPassword(password);

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
      password_hash: hash,
      salt
    });

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    if (error.code === '23505') {
      return res.status(400).json({ message: 'Email already exists' });
    }
    res.status(500).json({ message: 'Registration failed' });
  }
};


const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findUserByEmail(email);
    console.log("User found:", user);

    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isValid = verifyPassword(password, user.salt, user.password_hash);
    if (!isValid) return res.status(400).json({ message: 'Invalid credentials' });
const testHash = crypto.pbkdf2Sync(password, user.salt, 1000, 64, 'sha512').toString('hex');
console.log("Expected hash: ", user.password_hash);
console.log("Generated hash from entered password: ", testHash);

    // Payload for token
    const payload = {
      id: user.id,
      email: user.email,
      name: `${user.first_name} ${user.last_name}`
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '1h'
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
    present_city: user.present_city,
  
  },
});
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Login failed' });
  }
};


module.exports = {
  register,
  login,
};
