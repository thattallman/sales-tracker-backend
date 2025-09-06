const express = require("express");
const { createSale, getSales, updateSale, deleteSale } = require("../Controllers/salesController");
const { protect } = require("../Middlewares/authMiddleware");

const router = express.Router();

router.post("/", protect, createSale);
router.get("/", protect, getSales);
router.put("/:id", protect, updateSale);
router.delete("/:id", protect, deleteSale);

module.exports = router;
