const express = require("express");
const {
  addEarningExpense,
  getEarningExpense,
  getMonthlyReport,
  updateEarningExpense,
  deleteEarningExpense,
} = require("../controllers/earningExpense.controller.js");

const router = express.Router();
console.log(process.env.JWT_EXPIRY, "pppppppppppp");

router.post("/expenses", addEarningExpense);
router.get("/expenses", getEarningExpense);
router.put("/expenses/:id", updateEarningExpense);
router.get("/monthly/:year/:month", getMonthlyReport);
router.delete("/expenses/:id", deleteEarningExpense);

module.exports = router;
