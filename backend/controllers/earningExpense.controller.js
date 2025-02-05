const EarningExpense = require("../models/EarningExpense.model.js");

const addEarningExpense = async (req, res) => {
  try {
    const { date, type, time, category, amount, description } = req.body;
    const userId = req.user.user.id; // Get user ID from authentication middleware

    const newExpense = new EarningExpense({
      userId, // Associate with the logged-in user
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
    const userId = req.user.user.id; // Get user ID from authentication middleware
    const expenses = await EarningExpense.find({ userId }); // Fetch only user-specific data
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// const getMonthlyReport = async (req, res) => {
//   const { year, month } = req.params;

//   // Ensure the month is valid (1-12)
//   if (month < 1 || month > 12) {
//     return res.status(400).json({ message: "Invalid month" });
//   }

//   try {
//     // Convert year and month into a date range (from the start of the month to the end)
//     const startDate = new Date(year, month - 1, 1); // Start of the month
//     const endDate = new Date(year, month, 0); // End of the month (last day)

//     // Find records in the date range
//     const records = await EarningExpense.find({
//       date: { $gte: startDate, $lt: endDate },
//     });

//     if (records.length === 0) {
//       return res
//         .status(404)
//         .json({ message: "No records found for this month" });
//     }

//     // Return the records
//     res.status(200).json(records);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// Month name to number mapping
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
  const userId = req.user.user.id; // Get user ID from authentication middleware

  const monthIndex = monthMap[month];
  if (monthIndex === undefined) {
    return res.status(400).json({ message: "Invalid month name" });
  }

  try {
    // Ensure startDate is the beginning of the day (00:00:00) and endDate is end of the month (23:59:59)
    const startDate = new Date(year, monthIndex, 1, 0, 0, 0);
    const endDate = new Date(year, monthIndex + 1, 0, 23, 59, 59);

    console.log("Filtering from:", startDate, "to:", endDate); // Debugging output

    const records = await EarningExpense.find({
      userId, // Fetch only records belonging to the user
      date: { $gte: startDate, $lte: endDate }, // Ensure inclusive search
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

module.exports = { addEarningExpense, getEarningExpense, getMonthlyReport };
