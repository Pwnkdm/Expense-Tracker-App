import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-3">
      <div className="container mx-auto text-center">
        <p className="text-xs">
          &copy; {new Date().getFullYear()} Wallet Craft. Made by Pwn_kdm.
        </p>
        <div className="mt-2 flex justify-center space-x-3">
          <a
            href="https://github.com/Pwnkdm"
            className="text-gray-400 hover:text-white transition"
            aria-label="Facebook"
          >
            Github
          </a>

          <a
            href="https://www.linkedin.com/in/pwnkdm/"
            className="text-gray-400 hover:text-white transition"
            aria-label="LinkedIn"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
