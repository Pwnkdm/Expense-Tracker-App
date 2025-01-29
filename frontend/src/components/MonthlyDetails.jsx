import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const MonthlyDetails = () => {
  const [details, setDetails] = useState([]);
  const [type, setType] = useState(""); // 'expense' or 'earning'
  const { month } = useParams(); // Assuming you're passing month as a URL param like '/month/:month'

  // Fetch the data for a particular month
  const fetchMonthlyDetails = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/expenses`
      );
      setDetails(response.data);
      setType(response.data[0]?.type); // Set the type (either 'expense' or 'earning')
    } catch (error) {
      console.error("Error fetching monthly details:", error);
    }
  };

  useEffect(() => {
    fetchMonthlyDetails();
  }, [month]);

  return (
    <div className="container mx-auto p-6 h-screen">
      <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
        {month?.charAt(0).toUpperCase() + month.slice(1)}{" "}
        {type === "expense" ? "Expenditure" : "Earning"} Details
      </h2>
      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Category</th>
              <th className="px-4 py-2">Amount</th>
              <th className="px-4 py-2">Description</th>
            </tr>
          </thead>
          <tbody>
            {details.length > 0 ? (
              details.map((entry) => (
                <tr key={entry.id} className="border-b">
                  <td className="px-4 py-2 text-gray-700">
                    {new Date(entry?.date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 text-gray-700">{entry?.category}</td>
                  <td className="px-4 py-2 text-gray-700">
                    ₹{entry.amount.toLocaleString()}
                  </td>
                  <td className="px-4 py-2 text-gray-700">
                    {entry.description}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-4 py-2 text-center text-gray-700">
                  No data available for this month.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MonthlyDetails;
