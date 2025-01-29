import Navbar from "./components/Navbar";
import EariningExpenseForm from "./components/EariningExpenseForm";
import Footer from "./components/Footer";
import Analytics from "./components/Analytics";
import { Route, Routes } from "react-router-dom";
import MonthlyDetails from "./components/MonthlyDetails";
import PrivateRoute from "./components/PrivateRoute";
// import Login from "./components/Login"; // Make sure you have this component
// import Signup from "./components/Signup"; // Make sure you have this component

const App = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <Routes>
        {/* Public Routes */}
        {/* <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} /> */}

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <EariningExpenseForm />
            </PrivateRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <PrivateRoute>
              <Analytics />
            </PrivateRoute>
          }
        />
        <Route
          path="/month/:month"
          element={
            <PrivateRoute>
              <MonthlyDetails />
            </PrivateRoute>
          }
        />
      </Routes>

      <Footer />
    </div>
  );
};

export default App;
