import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import MonthlyDetails from "./MonthlyDetails";

const MonthlyReportPage = () => {
  const { month } = useParams(); // Get month from URL
  const [details, setDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMonthlyDetails = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/expenses`
        );
        setDetails(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMonthlyDetails();
  }, [month]);

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
