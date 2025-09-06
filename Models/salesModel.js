const mongoose = require("mongoose");

const SalesSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
    trim: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  dateOfSale: {
    type: Date,
    default: Date.now,
  },
  customerName: {
    type: String,
    required: true,
    trim: true,
  },
  customerEmail: {
    type: String,
    trim: true,
    lowercase: true,
  },
  customerPhone: {
    type: String,
    trim: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // links sale to the salesperson
    required: true,
  },
});

module.exports = mongoose.model("Sale", SalesSchema);
