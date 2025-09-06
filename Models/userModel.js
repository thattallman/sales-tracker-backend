const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  mobile: {
    type: String,
    required: true,
    unique: true,
    match: /^[0-9]{10}$/, // ensures 10-digit mobile number
  },
  password: {
    type: String,
    required: true,
    minlength: 6, // enforce minimum password length
  },
  role: {
    type: String,
    enum: ["sales", "manager"], // only these two roles allowed
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

// Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare passwords during login
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);
