const Sale = require("../Models/salesModel");
const mongoose = require("mongoose");

// @desc    Sales report summary
// @route   GET /reports/sales-summary
// @access  Private (Manager only)
const getSalesSummary = async (req, res) => {
  try {
    // 1. Sales over time (daily totals)
    const salesOverTime = await Sale.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$dateOfSale" } },
          totalQuantity: { $sum: "$quantity" }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // 2. Top products
    const topProducts = await Sale.aggregate([
      {
        $group: {
          _id: "$productName",
          totalQuantity: { $sum: "$quantity" }
        }
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: 10 }
    ]);

    // 3. Sales by salesperson
    const salesByRep = await Sale.aggregate([
      {
        $group: {
          _id: "$createdBy",
          totalQuantity: { $sum: "$quantity" }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "salesperson"
        }
      },
      { $unwind: "$salesperson" },
      {
        $project: {
          _id: 0,
          salesperson: "$salesperson.name",
          totalQuantity: 1
        }
      }
    ]);

    // 4. Monthly sales trends
    const monthlySales = await Sale.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$dateOfSale" } },
          totalQuantity: { $sum: "$quantity" }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      salesOverTime,
      topProducts,
      salesByRep,
      monthlySales
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getSalesSummary };
