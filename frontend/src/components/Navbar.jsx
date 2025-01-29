import { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-gray-800 p-4 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          className="text-white text-xl lg:text-2xl font-bold flex items-center"
        >
          <img
            className="w-6 h-auto md:w-8 lg:w-10 xl:w-10 object-contain"
            src="/rupee.png"
            alt="rs"
          />
          <span className="ml-3 text-base md:text-lg lg:text-xl">
            Wallet Craft
          </span>
        </Link>

        {/* Navigation Links (Desktop) */}
        <div className="hidden md:flex space-x-6">
          <Link
            to="/"
            className="text-white text-sm lg:text-base hover:text-gray-200"
          >
            Home
          </Link>
          <Link
            to="/analytics"
            className="text-white text-sm lg:text-base hover:text-gray-200"
          >
            Analytics
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={toggleMobileMenu}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            ></path>
          </svg>
        </button>
      </div>

      {/* Mobile Menu (Conditionally Rendered) */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-2 space-y-2">
          <Link
            to="/"
            className="block text-white text-sm py-2 px-4 hover:bg-blue-500 rounded"
            onClick={toggleMobileMenu}
          >
            Home
          </Link>
          <Link
            to="/analytics"
            className="block text-white text-sm py-2 px-4 hover:bg-blue-500 rounded"
            onClick={toggleMobileMenu}
          >
            Analytics
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
