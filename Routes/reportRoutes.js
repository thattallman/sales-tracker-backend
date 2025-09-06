const express = require("express");
const { getSalesSummary } = require("../Controllers/reportController");
const { protect, managerOnly } = require("../Middlewares/authMiddleware");

const router = express.Router();

router.get("/sales-summary", protect, managerOnly, getSalesSummary);

module.exports = router;
