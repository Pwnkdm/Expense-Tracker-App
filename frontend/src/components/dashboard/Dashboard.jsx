import React, { useState } from "react";
import { Card, Select, Spin } from "antd";
import { useGetExpensesQuery } from "../../features/apiSlice";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  BankOutlined,
} from "@ant-design/icons";
const { Option } = Select;

const Dashboard = () => {
  const currentYear = new Date().getFullYear().toString();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState("All");
  const { data = [], isLoading } = useGetExpensesQuery();

  const filteredData = data.filter(
    (item) =>
      item.date.startsWith(selectedYear) &&
      (selectedMonth === "All" || item.date.split("-")[1] === selectedMonth)
  );

  const earningsData = filteredData.filter((d) => d.type === "earning");
  const expensesData = filteredData.filter((d) => d.type === "expense");

  const earnings = earningsData.reduce(
    (sum, item) => sum + (item.amount || 0),
    0
  );
  const expenses = expensesData.reduce(
    (sum, item) => sum + (item.amount || 0),
    0
  );
  const savings = earnings - expenses;

  const expenseCategories = expensesData.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + item.amount;
    return acc;
  }, {});

  const pieData = Object.entries(expenseCategories).map(
    ([category, value]) => ({
      name: category,
      value,
      type: "expense",
    })
  );
  pieData.push({ name: "Income", value: earnings, type: "income" });

  // Updated Color Palette
  const COLORS = ["#2ecc71", "#e74c3c", "#f1c40f", "#3498db", "#9b59b6"];

  const lineChartData = filteredData.map((item) => ({
    date: item.date.split("T")[0],
    earnings: item.type === "earning" ? item.amount : 0,
    expenses: item.type === "expense" ? item.amount : 0,
  }));

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <Select
          value={selectedYear}
          onChange={setSelectedYear}
          className="w-full sm:w-[180px]"
        >
          {[currentYear, (parseInt(currentYear) - 1).toString()].map((year) => (
            <Option key={year} value={year}>
              {year}
            </Option>
          ))}
        </Select>
        <Select
          value={selectedMonth}
          onChange={setSelectedMonth}
          className="w-full sm:w-[180px]"
        >
          <Option value="All">All Months</Option>
          {Array.from({ length: 12 }, (_, i) => (
            <Option key={i} value={(i + 1).toString().padStart(2, "0")}>
              {new Date(2024, i).toLocaleString("default", { month: "long" })}
            </Option>
          ))}
        </Select>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {/* Total Earnings */}
        <Card
          title="Total Earnings"
          extra={<ArrowUpOutlined style={{ color: "#2ecc71" }} />}
        >
          <p className="text-2xl font-bold text-green-700">
            ₹{earnings.toLocaleString("en-IN")}
          </p>
        </Card>

        {/* Total Expenses */}
        <Card
          title="Total Expenses"
          extra={<ArrowDownOutlined style={{ color: "#e74c3c" }} />}
        >
          <p className="text-2xl font-bold text-red-700">
            ₹{expenses.toLocaleString("en-IN")}
          </p>
        </Card>

        {/* Total Savings */}
        <Card
          title="Total Savings"
          extra={<BankOutlined style={{ color: "#3498db" }} />}
        >
          <p className="text-2xl font-bold text-blue-700">
            ₹{savings.toLocaleString("en-IN")}
          </p>
        </Card>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {/* Income vs Expenses Breakdown */}
        <Card title="Income vs Expenses Breakdown">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Income vs Expenses Over Time */}
        <Card title="Income vs Expenses Over Time">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={lineChartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="earnings"
                stroke="#2ecc71"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="expenses"
                stroke="#e74c3c"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
