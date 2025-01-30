import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-gray-800 p-2 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          className="text-white text-sm lg:text-base font-bold flex items-center"
        >
          <img
            className="w-5 h-auto md:w-6 lg:w-8 object-contain"
            src="/rupee.png"
            alt="rs"
          />
          <span className="ml-2 text-sm md:text-base lg:text-lg">
            Wallet Craft
          </span>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
