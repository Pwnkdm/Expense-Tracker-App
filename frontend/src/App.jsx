import Navbar from "./components/Navbar"; // Import the Navbar
import EariningExpenseForm from "./components/EariningExpenseForm";
import Footer from "./components/Footer";
import Analytics from "./components/Analytics";
import { Route, Routes } from "react-router-dom";
import MonthlyDetails from "./components/MonthlyDetails";

const App = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <Routes>
        <Route path="/" element={<EariningExpenseForm />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/month/:month" element={<MonthlyDetails />} />
      </Routes>

      <Footer />
    </div>
  );
};

export default App;
