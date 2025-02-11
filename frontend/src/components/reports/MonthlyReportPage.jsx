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
  } = useGetMonthlyDetailsQuery({ year, month });

  return (
    <div>
      <MonthlyDetails
        year={year} // Pass the year to MonthlyDetails
        month={month} // Pass the month to MonthlyDetails
        data={details} // Pass the details to MonthlyDetails
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
};

export default MonthlyReportPage;
