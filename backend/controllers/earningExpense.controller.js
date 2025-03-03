const EarningExpense = require("../models/EarningExpense.model.js");

const addEarningExpense = async (req, res) => {
  try {
    const { date, type, time, category, amount, description } = req.body;
    const userId = req.user.user.id;

    const newExpense = new EarningExpense({
      userId,
      date,
      time,
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
    const userId = req.user.user.id;
    const expenses = await EarningExpense.find({ userId });
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const monthMap = {
  January: 0,
  February: 1,
  March: 2,
  April: 3,
  May: 4,
  June: 5,
  July: 6,
  August: 7,
  September: 8,
  October: 9,
  November: 10,
  December: 11,
};

const getMonthlyReport = async (req, res) => {
  const { year, month } = req.params;
  const userId = req.user.user.id;

  const monthIndex = monthMap[month];
  if (monthIndex === undefined) {
    return res.status(400).json({ message: "Invalid month name" });
  }

  try {
    const startDate = new Date(year, monthIndex, 1, 0, 0, 0);
    const endDate = new Date(year, monthIndex + 1, 0, 23, 59, 59);

    console.log("Filtering from:", startDate, "to:", endDate);

    const records = await EarningExpense.find({
      userId,
      date: { $gte: startDate, $lte: endDate },
    });

    if (records.length === 0) {
      return res
        .status(404)
        .json({ message: "No records found for this month" });
    }

    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const updateEarningExpense = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.user.id;
  const updateData = req.body;

  try {
    const updatedRecord = await EarningExpense.findOneAndUpdate(
      { _id: id, userId },
      updateData,
      { new: true }
    );

    if (!updatedRecord) {
      return res.status(404).json({
        message: "Record not found or you don't have permission to update it",
      });
    }

    res.status(200).json(updatedRecord);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating record", error: error.message });
  }
};

const deleteEarningExpense = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.user.id;

  try {
    const deletedRecord = await EarningExpense.findOneAndDelete({
      _id: id,
      userId,
    });

    if (!deletedRecord) {
      return res.status(404).json({
        message: "Record not found or you don't have permission to delete it",
      });
    }

    res.status(200).json({ message: "Record deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting record", error: error.message });
  }
};

module.exports = {
  addEarningExpense,
  getEarningExpense,
  getMonthlyReport,
  updateEarningExpense,
  deleteEarningExpense,
};
