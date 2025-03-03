const express = require("express");
const {
  addEarningExpense,
  getEarningExpense,
  getMonthlyReport,
  updateEarningExpense,
  deleteEarningExpense,
} = require("../controllers/earningExpense.controller.js");
const auth = require("../middlewares/auth.middleware"); // Middleware to verify user authentication

const router = express.Router();
console.log(process.env.JWT_EXPIRY, "pppppppppppp");

router.post("/expenses", auth, addEarningExpense);
router.get("/expenses", auth, getEarningExpense);
router.put("/expenses/:id", auth, updateEarningExpense);
router.get("/monthly/:year/:month", auth, getMonthlyReport);
router.delete("/expenses/:id", auth, deleteEarningExpense);

module.exports = router;
