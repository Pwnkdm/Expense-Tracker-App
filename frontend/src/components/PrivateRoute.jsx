import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";

// eslint-disable-next-line react/prop-types
const PrivateRoute = ({ children }) => {
  const { accessToken, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    console.log("PrivateRoute Rendered:", accessToken, isAuthenticated);
  }, [accessToken, isAuthenticated]);

  if (!accessToken || !isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default PrivateRoute;
