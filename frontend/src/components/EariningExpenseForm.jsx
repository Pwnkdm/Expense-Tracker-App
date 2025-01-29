import axios from "axios";
import { useState } from "react";

const EariningExpenseForm = () => {
  const [formData, setFormData] = useState({
    date: "",
    type: "expense",
    category: "",
    amount: "",
    description: "",
  });

  const categories = {
    expense: ["Other Expense", "EMI Expense", "Bills", "Groceries", "Travel"],
    earning: [
      "Salary",
      "Freelance",
      "Business Revenue",
      "Investments",
      "Other Revenue",
    ],
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env}/api/expenses`, formData);
      setFormData({
        date: "",
        type: "expense",
        category: "",
        amount: "",
        description: "",
      });
    } catch (error) {
      console.error("Error adding expense:", error);
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg max-w-lg mx-auto mx-4 my-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Add Expense/Earning
      </h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date
          </label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none text-black"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type
          </label>
          <select
            value={formData.type}
            onChange={(e) =>
              setFormData({ ...formData, type: e.target.value, category: "" })
            }
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none text-black"
          >
            <option value="expense">Expense</option>
            <option value="earning">Earning</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none text-black"
            required
          >
            <option value="" disabled>
              Select Category
            </option>
            {categories[formData.type].map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Amount
          </label>
          <input
            type="number"
            placeholder="Amount"
            value={formData.amount}
            onChange={(e) =>
              setFormData({ ...formData, amount: e.target.value })
            }
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none text-black"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none text-black"
            rows="3"
          ></textarea>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
        >
          Add {formData.type === "expense" ? "Expense" : "Earning"}
        </button>
      </form>
    </div>
  );
};

export default EariningExpenseForm;
