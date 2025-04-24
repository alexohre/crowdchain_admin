import React from "react";

const Footer = () => {
  return (
    <footer className="py-6 text-sm text-gray-500 flex justify-center space-x-[150px] items-center px-6">
      <div>© 2025 CrowdChain. All rights reserved.</div>
      <div className="flex items-center">
        <svg
          className="w-4 h-4 mr-1 text-green-700"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
        Secure Connection
      </div>
    </footer>
  );
};

export default Footer;
