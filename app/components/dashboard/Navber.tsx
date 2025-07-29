"use client";
import React from "react";
import { ConnectButton } from "../connect-button";

const Navbar: React.FC = () => {
  return (
    <nav className="bg-white shadow-sm px-4 py-3 border-b-2 flex items-center justify-between">
      {/* Logo */}
      <div className="flex items-center">
        <div className="w-6 h-6 rounded bg-green-700 mr-2"></div>
        <span className="font-medium text-gray-800">CrowdChain Admin</span>
      </div>

      {/* Wallet Connection */}
      <ConnectButton variant="navbar" />
    </nav>
  );
};

export default Navbar;
