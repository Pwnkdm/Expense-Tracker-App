import { useMemo } from "react";
import { useGetExpensesQuery } from "../../features/apiSlice";
import { Spin, Card, Collapse, Typography, Alert, Button, Empty } from "antd";
import { Link } from "react-router-dom";
import { CaretRightOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const Analytics = () => {
  const { data: expenses = [], error, isLoading } = useGetExpensesQuery();

  const getMonthName = (monthIndex) => {
    return new Intl.DateTimeFormat("en-US", { month: "long" }).format(
      new Date(2000, monthIndex)
    );
  };

  const analytics = useMemo(() => {
    const result = { monthly: {}, yearly: {} };

    if (!expenses || expenses.length === 0) return result;

    expenses.forEach((entry) => {
      const date = new Date(entry.date);
      if (isNaN(date)) return;

      const year = date.getFullYear();
      const month = `${getMonthName(date.getMonth())} ${year}`;

      if (!result.yearly[year]) {
        result.yearly[year] = { earnings: 0, expenditures: 0, months: {} };
      }
      if (!result.monthly[month]) {
        result.monthly[month] = { earnings: 0, expenditures: 0 };
      }
      if (!result.yearly[year].months[month]) {
        result.yearly[year].months[month] = { earnings: 0, expenditures: 0 };
      }

      const amount = Number(entry.amount) || 0;

      if (entry.type === "earning") {
        result.yearly[year].earnings += amount;
        result.yearly[year].months[month].earnings += amount;
      } else {
        result.yearly[year].expenditures += amount;
        result.yearly[year].months[month].expenditures += amount;
      }
    });

    return result;
  }, [expenses]);

  if (isLoading)
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <Spin size="large" />
      </div>
    );

  if (error)
    return (
      <Alert
        message="Error fetching analytics"
        type="error"
        showIcon
        className="m-4 shadow-lg"
      />
    );

  const collapseItems = Object.entries(analytics.yearly).map(
    ([year, totals]) => ({
      key: year,
      label: (
        <div className="flex flex-col sm:flex-row justify-between w-full">
          <Text strong className="text-base sm:text-xl text-gray-700">
            {year}
          </Text>
          <div className="flex flex-col sm:flex-row sm:space-x-4">
            <Text className="font-semibold text-sm sm:text-base">
              Earnings:{" "}
              <span style={{ color: "#52c41a" }}>
                ₹{totals.earnings.toLocaleString()}
              </span>
            </Text>
            <Text className="font-semibold text-sm sm:text-base">
              Expenditures:{" "}
              <span style={{ color: "#f5222d" }}>
                ₹{totals.expenditures.toLocaleString()}
              </span>
            </Text>
          </div>
        </div>
      ),
      children: (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4">
          {Object.entries(totals.months).map(([month, monthTotals]) => (
            <Card
              key={month}
              title={
                <span className="text-base sm:text-lg font-semibold text-gray-700">
                  {month}
                </span>
              }
              className="hover:shadow-lg transition-shadow duration-300 rounded-xl"
              headStyle={{ borderBottom: "1px solid #f0f0f0" }}
            >
              <div className="space-y-2 sm:space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-green-600 font-medium text-sm sm:text-base">
                    Earnings
                  </span>
                  <span className="text-green-600 text-sm sm:text-base">
                    ₹{monthTotals.earnings.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-red-600 font-medium text-sm sm:text-base">
                    Expenditures
                  </span>
                  <span className="text-red-600 text-sm sm:text-base">
                    ₹{monthTotals.expenditures.toLocaleString()}
                  </span>
                </div>
                <Link to={`/monthly/${year}/${month.split(" ")[0]}`}>
                  <Button
                    type="primary"
                    block
                    className="bg-blue-500 hover:bg-blue-600 border-0 text-sm sm:text-base"
                  >
                    View Details
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      ),
      className: "rounded-lg overflow-hidden border-0 shadow-sm",
    })
  );

  return (
    <div className="bg-gray-50 h-screen overflow-auto pt-4">
      {Object.keys(analytics.yearly).length === 0 ? (
        <div className="flex justify-center items-center h-96 bg-white rounded-lg shadow-md">
          <Empty
            description="No financial data available"
            className="text-gray-500"
          />
        </div>
      ) : (
        <div className="flex justify-center">
          <Collapse
            accordion
            className="w-[95%] max-w-5xl bg-transparent"
            items={collapseItems}
            expandIcon={({ isActive }) => (
              <CaretRightOutlined rotate={isActive ? 90 : 0} />
            )}
          />
        </div>
      )}
    </div>
  );
};

export default Analytics;
