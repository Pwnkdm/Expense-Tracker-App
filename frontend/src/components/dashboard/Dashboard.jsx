import React, { useState } from "react";
import { Card, Statistic, Table, Select, Spin, Alert } from "antd";
import { Pie, Line } from "@ant-design/plots";
import { useGetExpensesQuery } from "../../features/apiSlice";

const { Option } = Select;

const Dashboard = () => {
  const currentYear = new Date().getFullYear().toString();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState("All");

  const { data = [], error, isLoading } = useGetExpensesQuery();

  if (error) {
    return <Alert message="Error loading data" type="error" showIcon />;
  }

  const getYears = () => {
    const years = [...new Set(data?.map((item) => item.date?.split("-")[0]))];
    return years.length ? years.sort((a, b) => b - a) : [currentYear];
  };

  const filteredData =
    data?.filter(
      (item) =>
        item.date &&
        item.date.startsWith(selectedYear) &&
        (selectedMonth === "All" || item.date.split("-")[1] === selectedMonth)
    ) || [];

  const earnings = filteredData
    .filter((d) => d.type === "earning")
    .reduce((sum, item) => sum + (item.amount || 0), 0);

  const expenses = filteredData
    .filter((d) => d.type === "expense")
    .reduce((sum, item) => sum + (item.amount || 0), 0);

  const categoryExpense = filteredData
    .filter((d) => d.type === "expense")
    .reduce((acc, item) => {
      if (item.category) {
        acc[item.category] = (acc[item.category] || 0) + item.amount;
      }
      return acc;
    }, {});

  const pieData = Object.keys(categoryExpense).map((key) => ({
    type: key,
    value: categoryExpense[key],
  }));

  const lineData = filteredData
    .filter((d) => d.amount && d.date)
    .map((d) => ({ date: d.date, amount: d.amount }));

  const columns = [
    { title: "Category", dataIndex: "category", key: "category" },
    { title: "Type", dataIndex: "type", key: "type" },
    { title: "Amount", dataIndex: "amount", key: "amount" },
  ];

  return (
    <div className="p-4">
      {isLoading ? (
        <div className="flex justify-center items-center min-h-[50vh]">
          <Spin size="large" />
        </div>
      ) : (
        <>
          {/* Year & Month Selection */}
          <div className="flex gap-4 mb-4">
            <Select value={selectedYear} onChange={setSelectedYear}>
              {getYears().map((year) => (
                <Option key={year} value={year}>
                  {year}
                </Option>
              ))}
            </Select>
            <Select value={selectedMonth} onChange={setSelectedMonth}>
              <Option value="All">Yearly Overview</Option>
              {[...Array(12)].map((_, i) => (
                <Option key={i + 1} value={(i + 1).toString().padStart(2, "0")}>
                  {new Date(2024, i).toLocaleString("default", {
                    month: "long",
                  })}
                </Option>
              ))}
            </Select>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <Statistic title="Total Earnings" value={earnings} prefix="₹" />
            </Card>
            <Card>
              <Statistic title="Total Expenses" value={expenses} prefix="₹" />
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <Card title="Category-wise Expenses">
              {pieData.length ? (
                <Pie data={pieData} angleField="value" colorField="type" />
              ) : (
                <p>No expense data available</p>
              )}
            </Card>
            <Card title="Expense Trend Over Time">
              {lineData.length ? (
                <Line data={lineData} xField="date" yField="amount" />
              ) : (
                <p>No transaction history available</p>
              )}
            </Card>
          </div>

          {/* Table */}
          <Table
            className="mt-4"
            dataSource={filteredData}
            columns={columns}
            rowKey={(record) => record.date + record.category}
            pagination={{ pageSize: 5 }}
          />
        </>
      )}
    </div>
  );
};

export default Dashboard;
