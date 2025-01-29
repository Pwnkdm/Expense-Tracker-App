const EarningExpense = require("../models/EarningExpense.model.js");

const addEarningExpense = async (req, res) => {
  try {
    const { date, type, category, amount, description } = req.body;
    const newExpense = new EarningExpense({
      date,
      type,
      category,
      amount,
      description,
    });
    await newExpense.save();
    res.status(201).json(newExpense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getEarningExpense = async (req, res) => {
  try {
    const expenses = await EarningExpense.find();
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addEarningExpense, getEarningExpense };
