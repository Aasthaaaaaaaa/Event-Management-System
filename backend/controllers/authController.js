const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Register User
exports.registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        const user = await User.create({ name, email, password });
        res.status(201).json({ _id: user._id, name, email, token: generateToken(user._id) });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user' });
    }
};

// Login User
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ message: 'Invalid credentials' });

        res.json({ _id: user._id, name: user.name, email, token: generateToken(user._id) });
    
    
};

exports.checkAuth = async (req, res) => {
    try {
      // Ensure the user is authenticated (middleware already handles this)
      const user = req.user; // This is set in authMiddleware
  
      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
  
      // Check if any users exist
      const userCount = await User.countDocuments();
      if (userCount === 0) {
        return res.status(404).json({ message: "No registered users found" });
      }
  
      res.json({ message: "Authenticated", user });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };
  
  