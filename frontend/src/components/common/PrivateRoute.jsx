import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { isTokenExpired } from "../../utils/commonFunc";

// eslint-disable-next-line react/prop-types
const PrivateRoute = ({ children }) => {
  const { accessToken, isAuthenticated } = useSelector((state) => state.auth);

  isTokenExpired(accessToken);

  if (!accessToken || !isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default PrivateRoute;
