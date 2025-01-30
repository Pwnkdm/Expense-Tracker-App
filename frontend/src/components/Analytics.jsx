import React, { useMemo } from "react";
import { useGetExpensesQuery } from "../features/apiSlice";
import { Spin, Card, Collapse, Typography, Alert, Button, Empty } from "antd";
import { Link } from "react-router-dom"; // Import Link for navigation

const { Panel } = Collapse;
const { Title, Text } = Typography;

const Analytics = () => {
  const { data: expenses = [], error, isLoading } = useGetExpensesQuery();

  // Helper function to get month name
  const getMonthName = (monthIndex) => {
    return new Intl.DateTimeFormat("en-US", { month: "long" }).format(
      new Date(2000, monthIndex)
    );
  };

  // Process expenses data
  const analytics = useMemo(() => {
    const result = { monthly: {}, yearly: {} };

    if (!expenses || expenses.length === 0) return result;

    expenses.forEach((entry) => {
      const date = new Date(entry.date);
      if (isNaN(date)) return; // Skip invalid dates

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
      <div className="h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );

  if (error)
    return <Alert message="Error fetching analytics" type="error" showIcon />;

  return (
    <div className="p-6">
      <Title level={2} className="text-center">
        Analytics
      </Title>

      {/* Show Empty Box when no data */}
      {Object.keys(analytics.yearly).length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <Empty description="No data available" />
        </div>
      ) : (
        <Collapse accordion>
          {Object.entries(analytics.yearly).map(([year, totals]) => (
            <Panel
              key={year}
              header={
                <div className="flex justify-between w-full">
                  <Text strong>{year}</Text>
                  <Text type="secondary">
                    <span className="text-green-800">
                      <span>Earnings: ₹</span>{" "}
                      <span>{totals.earnings.toLocaleString()}</span> |
                    </span>
                    <span className="text-red-800">
                      <span>Expenditures: ₹</span>
                      <span>{totals.expenditures.toLocaleString()}</span>
                    </span>
                  </Text>
                </div>
              }
            >
              {/* Monthly Reports inside Yearly Report */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(totals.months).map(([month, monthTotals]) => (
                  <Card
                    key={month}
                    title={month}
                    bordered={false}
                    className="shadow-md"
                  >
                    <p>
                      <strong className="text-green-800">Earnings:</strong> ₹
                      <span className="text-green-800">
                        {monthTotals.earnings.toLocaleString()}
                      </span>
                    </p>
                    <p>
                      <strong className="text-red-800">Expenditures:</strong>{" "}
                      <span className="text-red-800">
                        ₹{monthTotals.expenditures.toLocaleString()}
                      </span>
                    </p>
                    {/* Link to navigate to monthly details page */}
                    <Button type="dashed">
                      <Link
                        to={`/monthly/${year}/${month.split(" ")[0]}`}
                        className="text-blue-500 hover:underline"
                      >
                        View Details
                      </Link>
                    </Button>
                  </Card>
                ))}
              </div>
            </Panel>
          ))}
        </Collapse>
      )}
    </div>
  );
};

export default Analytics;
