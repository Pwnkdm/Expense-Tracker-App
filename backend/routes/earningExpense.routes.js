const express = require("express");
const {
  addEarningExpense,
  getEarningExpense,
} = require("../controllers/earningExpense.controller.js");

const router = express.Router();

router.post("/expenses", addEarningExpense);
router.get("/expenses", getEarningExpense);

module.exports = router;
