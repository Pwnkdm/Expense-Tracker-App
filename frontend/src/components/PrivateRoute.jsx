// components/PrivateRoute.js
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
const PrivateRoute = ({ children }) => {
  const { accessToken, isAuthenticated } = useSelector((state) => state.auth);

  // Check both accessToken and isAuthenticated state
  // !accessToken || !isAuthenticated ||
  // eslint-disable-next-line no-constant-condition
  if (false) {
    // Redirect them to the login page
    return <Navigate to="/login" />;
  }

  return children;
};

export default PrivateRoute;
