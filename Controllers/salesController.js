const Sale = require("../Models/salesModel");

// @desc    Create new sale
// @route   POST /sales
// @access  Private (Sales/Manager)
const createSale = async (req, res) => {
  const { productName, quantity, dateOfSale, customerName, customerEmail, customerPhone } = req.body;

  if (!productName || !quantity || !customerName) {
    return res.status(400).json({ message: "Product, quantity, and customer name are required" });
  }

  try {
    const sale = new Sale({
      productName,
      quantity,
      dateOfSale,
      customerName,
      customerEmail,
      customerPhone,
      createdBy: req.user.userid, // link to logged-in user
    });

    await sale.save();
    res.status(201).json({ message: "Sale recorded successfully", sale });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get all sales (Manager can see all, Salesperson only their own)
// @route   GET /sales
// @access  Private
const getSales = async (req, res) => {
  try {
    let sales;
    if (req.user.role === "manager") {
      sales = await Sale.find().populate("createdBy", "name email");
    } else {
      sales = await Sale.find({ createdBy: req.user.userid });
    }

    res.json(sales);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update a sale
// @route   PUT /sales/:id
// @access  Private
const updateSale = async (req, res) => {
  try {
    let sale = await Sale.findById(req.params.id);

    if (!sale) return res.status(404).json({ message: "Sale not found" });

    // Only creator or manager can update
    if (sale.createdBy.toString() !== req.user.userid && req.user.role !== "manager") {
      return res.status(401).json({ message: "Not authorized" });
    }

    sale = await Sale.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: "Sale updated successfully", sale });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Delete a sale
// @route   DELETE /sales/:id
// @access  Private
const deleteSale = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id);

    if (!sale) return res.status(404).json({ message: "Sale not found" });

    if (sale.createdBy.toString() !== req.user.userid && req.user.role !== "manager") {
      return res.status(401).json({ message: "Not authorized" });
    }

    await sale.deleteOne();
    res.json({ message: "Sale deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { createSale, getSales, updateSale, deleteSale };
