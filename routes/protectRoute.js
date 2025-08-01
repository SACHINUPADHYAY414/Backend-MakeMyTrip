const express = require('express');
const router = express.Router();
const verifyToken = require('../MiddleWare/authMiddleware');

router.get('/dashboard', verifyToken, (req, res) => {
  res.send(`Welcome ${req.user.name}`);
});

module.exports = router;
