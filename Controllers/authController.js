const User = require("../Models/userModel");
const jwt = require("jsonwebtoken");
// @desc    Register new user
// @route   POST /signup
// @access  Public
const registerUser = async (req, res) => {
  const { name, email, password, role, mobile } = req.body;

  if (!name || !email || !password || !role || !mobile) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    // Check if mobile already exists
    user = await User.findOne({ mobile });
    if (user) {
      return res.status(400).json({ message: "Mobile number already exists" });
    }
    user = new User({ name, email, password, role, mobile });
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Login user
// @route   POST /login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    // Match password
    const isMatch = await user.matchPassword(password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    // Create JWT token
    const payload = {
      userid: user._id,
      username: user.email,
      role: user.role,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({
      data: {
        token: token,
        role: user.role,
        name: user.name,
        email: user.email,
        phone: user.mobile,
      },
      msg: "success",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { registerUser, loginUser };
