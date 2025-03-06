import { useParams } from "react-router-dom";
import MonthlyDetails from "./MonthlyDetails";
import { useGetMonthlyDetailsQuery } from "../../features/apiSlice";

const MonthlyReportPage = () => {
  const { year, month } = useParams(); // Get year and month from URL

  // Fetch monthly details using the query hook
  const {
    data: details,
    isLoading,
    error,
  } = useGetMonthlyDetailsQuery({
    year,
    month,
    type: undefined, // Optional filter params as defined in apiSlice
    category: undefined,
    description: undefined,
  });

  return (
    <div>
      <MonthlyDetails
        month={month}
        data={details}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
};

export default MonthlyReportPage;
