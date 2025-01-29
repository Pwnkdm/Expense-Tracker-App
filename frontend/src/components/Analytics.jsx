import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";

const Analytics = () => {
  const [expenses, setExpenses] = useState([]);

  const fetchExpenses = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/expenses`
      );
      setExpenses(response.data);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  // Helper function to get month name
  const getMonthName = (monthIndex) => {
    const formatter = new Intl.DateTimeFormat("en-US", { month: "long" });
    const date = new Date(2000, monthIndex - 1); // Month index starts from 0
    return formatter.format(date);
  };

  // Group data by month and year
  const analytics = useMemo(() => {
    const result = { monthly: {}, yearly: {} };

    expenses &&
      expenses?.forEach((entry) => {
        const date = new Date(entry.date);
        const year = date.getFullYear();
        const monthNumber = date.getMonth() + 1; // 1-based index for month
        const month = `${getMonthName(monthNumber)} ${year}`; // Format: "January 2025"

        // Initialize year and month if not present
        if (!result.yearly[year])
          result.yearly[year] = { earnings: 0, expenditures: 0 };
        if (!result.monthly[month])
          result.monthly[month] = { earnings: 0, expenditures: 0 };

        // Update totals based on type
        if (entry.type === "earning") {
          result.yearly[year].earnings += entry.amount;
          result.monthly[month].earnings += entry.amount;
        } else {
          result.yearly[year].expenditures += entry.amount;
          result.monthly[month].expenditures += entry.amount;
        }
      });

    return result;
  }, [expenses]);

  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Analytics</h2>
      <div className="space-y-6">
        {/* Monthly Analytics */}
        <div>
          <h3 className="text-xl font-medium text-gray-700 mb-2">
            Monthly Report
          </h3>
          <div className="space-y-4">
            {Object.entries(analytics.monthly).map(([month, totals]) => (
              <div key={month} className="p-4 bg-white rounded-md shadow">
                <h4 className="text-lg font-semibold text-gray-800">{month}</h4>
                <p className="text-gray-600">
                  <strong>Earnings:</strong> ₹{totals.earnings.toLocaleString()}
                </p>
                <p className="text-gray-600">
                  <strong>Expenditures:</strong> ₹
                  {totals.expenditures.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Yearly Analytics */}
        <div>
          <h3 className="text-xl font-medium text-gray-700 mb-2">
            Yearly Report
          </h3>
          <div className="space-y-4">
            {Object.entries(analytics.yearly).map(([year, totals]) => (
              <div key={year} className="p-4 bg-white rounded-md shadow">
                <h4 className="text-lg font-semibold text-gray-800">{year}</h4>
                <p className="text-gray-600">
                  <strong>Earnings:</strong> ₹{totals.earnings.toLocaleString()}
                </p>
                <p className="text-gray-600">
                  <strong>Expenditures:</strong> ₹
                  {totals.expenditures.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
