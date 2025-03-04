import { useMemo } from "react";
import { useGetExpensesQuery } from "../../features/apiSlice";
import { Spin, Card, Collapse, Typography, Alert, Button, Empty } from "antd";
import { Link } from "react-router-dom";

const { Panel } = Collapse;
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

  return (
    <div className="p-6 bg-gray-50 h-screen overflow-auto">
      <Title level={2} className="text-center text-2xl mb-8 text-gray-800">
        Financial Analytics Dashboard
      </Title>

      {Object.keys(analytics.yearly).length === 0 ? (
        <div className="flex justify-center items-center h-96 bg-white rounded-lg shadow-md">
          <Empty
            description="No financial data available"
            className="text-gray-500"
          />
        </div>
      ) : (
        <Collapse
          accordion
          className="w-full bg-transparent"
          expandIconPosition="right"
        >
          {Object.entries(analytics.yearly).map(([year, totals]) => (
            <Panel
              key={year}
              header={
                <div className="flex flex-col sm:flex-row justify-between w-full py-2">
                  <Text strong className="text-xl text-gray-700">
                    {year}
                  </Text>
                  <div className="space-x-4">
                    <Text className="text-green-600 font-semibold">
                      Earnings: ₹{totals.earnings.toLocaleString()}
                    </Text>
                    <Text className="text-red-600 font-semibold">
                      Expenditures: ₹{totals.expenditures.toLocaleString()}
                    </Text>
                  </div>
                </div>
              }
              className="mb-4 rounded-lg overflow-hidden border-0 shadow-sm"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
                {Object.entries(totals.months).map(([month, monthTotals]) => (
                  <Card
                    key={month}
                    title={
                      <span className="text-lg font-semibold text-gray-700">
                        {month}
                      </span>
                    }
                    className="hover:shadow-lg transition-shadow duration-300 rounded-xl min-h-[250px]"
                    headStyle={{ borderBottom: "1px solid #f0f0f0" }}
                    bodyStyle={{ padding: "20px" }}
                  >
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-green-600 font-medium">
                          Earnings
                        </span>
                        <span className="text-green-600">
                          ₹{monthTotals.earnings.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-red-600 font-medium">
                          Expenditures
                        </span>
                        <span className="text-red-600">
                          ₹{monthTotals.expenditures.toLocaleString()}
                        </span>
                      </div>
                      <Link to={`/monthly/${year}/${month.split(" ")[0]}`}>
                        <Button
                          type="primary"
                          block
                          className="mt-4 bg-blue-500 hover:bg-blue-600 border-0"
                        >
                          View Details
                        </Button>
                      </Link>
                    </div>
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
