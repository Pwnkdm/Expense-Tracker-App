import React, { useMemo } from "react";
import { useGetExpensesQuery } from "../features/apiSlice";

const Analytics = () => {
  const { data: expenses = [], error, isLoading } = useGetExpensesQuery();

  // Helper function to get month name
  const getMonthName = (monthIndex) => {
    const formatter = new Intl.DateTimeFormat("en-US", { month: "long" });
    const date = new Date(2000, monthIndex); // Month index starts from 0
    return formatter.format(date);
  };

  // Process expenses data
  const analytics = useMemo(() => {
    const result = { monthly: {}, yearly: {} };

    if (!expenses || expenses.length === 0) return result; // Handle empty data

    expenses.forEach((entry) => {
      const date = new Date(entry.date);
      if (isNaN(date)) return; // Skip invalid dates

      const year = date.getFullYear();
      const month = `${getMonthName(date.getMonth())} ${year}`;

      if (!result.yearly[year]) {
        result.yearly[year] = { earnings: 0, expenditures: 0 };
      }
      if (!result.monthly[month]) {
        result.monthly[month] = { earnings: 0, expenditures: 0 };
      }

      const amount = Number(entry.amount) || 0; // Ensure amount is a number

      if (entry.type === "earning") {
        result.yearly[year].earnings += amount;
        result.monthly[month].earnings += amount;
      } else {
        result.yearly[year].expenditures += amount;
        result.monthly[month].expenditures += amount;
      }
    });

    return result;
  }, [expenses]);

  if (isLoading)
    return (
      <div className="h-screen flex items-center justify-center text-black text-xl font-semibold">
        Loading...
      </div>
    );
  if (error) return <p>Error fetching analytics</p>;

  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Analytics</h2>

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
      <div className="mt-6">
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
  );
};

export default Analytics;
